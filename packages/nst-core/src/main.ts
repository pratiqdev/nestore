// import { NestoreOptions, StoreInitializer } from "@pratiq/nestore-types";
import { debug } from "./debug";
import tinyId from "./tinyId";
import ERRORS from "./errors";
import EE2 from "eventemitter2";

import { AnyRecord, StoreInitializer, NestoreOptions, Handlers, BaseNestoreOptions, StorageOptionsB, StorageOptionsA, NSTEventEmitter, Middleware } from "@pratiq/nestore-types";

const sendToReduxDevTools = (action: any, state: any) => {
    try{
        if (typeof window !== 'undefined' && (window as any).__REDUX_DEVTOOLS_EXTENSION__) {
            (window as any).__REDUX_DEVTOOLS_EXTENSION__.send(action, state);
        }
    }catch(err){
        console.log('DEVTOOLS ERROR:', err)
    }
};


const isPlainObject = (value: any): value is object => {
    return Object.prototype.toString.call(value) === '[object Object]';
}

const createDeepProxy = (target: any, handlers: ProxyHandler<any>): any => {
    return new Proxy(target, {
        ...handlers,
        get: (target, prop, receiver) => {
            const value = Reflect.get(target, prop, receiver);
            if (typeof value === 'object' && value !== null) {
                return createDeepProxy(value, handlers); // Recursively create proxy for nested objects
            }
            return value;
        },
    });
}


const eventMethods = [
    'emit',
    'emitAsync',
    'addListener',
    'on',
    'prependListener',
    'once',
    'prependOnceListener',
    'many',
    'prependMany',
    'onAny',
    'prependAny',
    'offAny',
    'removeListener',
    'off',
    'removeAllListeners',
    'setMaxListeners',
    'getMaxListeners',
    'eventNames',
    'listenerCount',
    'listeners',
    'listenersAny',
    'waitFor',
    'listenTo',
    'stopListeningTo',
    'hasListeners'
];

export type EventChange = {
    key: string;
    path: string;
    previousValue: any;
    value: any;
}


//& Implementation                                                                                                      
function createStore<T extends AnyRecord>(
    initialState: StoreInitializer<T> | T = {} as T,
    options: NestoreOptions<T> = {}
): T & NSTEventEmitter {
        

    let globalDebugNamespace:string = ''
    const EE: NSTEventEmitter = new EE2({

        // set this to `true` to use wildcards
        wildcard: true,
      
        // the delimiter used to segment namespaces
        delimiter: '.', 
      
        // set this to `true` if you want to emit the newListener event
        newListener: false, 
      
        // set this to `true` if you want to emit the removeListener event
        removeListener: false, 
      
        // the maximum amount of listeners that can be assigned to an event
        maxListeners: 10,
      
        // show event name in memory leak message when more than maximum amount of listeners is assigned
        verboseMemoryLeak: false,
      
        // disable throwing uncaughtException if an error event is emitted and it has no listeners
        ignoreErrors: false
    });


    const DT = typeof window !== 'undefined' ? (window as any).__REDUX_DEVTOOLS_EXTENSION__.connect() : null;
    let storageObject: null | Storage = null
    let state: T = {} as T


    const notifyListeners = (path: string | symbol, change: EventChange) => {
        console.log('EMITTING:', {path, change})
        EE.emit(path, change)
  
    };



    
    //& DEBUG SETTINGS                                                                                                  
    if(options?.debug){
        globalDebugNamespace = typeof options?.debug === 'string' ? options.debug : '*'
    }
    if(process?.env?.DEBUG){
        if(process.env.DEBUG === 'true'){
            globalDebugNamespace = '*'
        }else{
            globalDebugNamespace = process.env.DEBUG
        }
    }
    
    const logger = {
        init: debug('init', globalDebugNamespace),
        method: debug('method', globalDebugNamespace),
        get: debug('get', globalDebugNamespace),
        set: debug('set', globalDebugNamespace),
        action: debug('action', globalDebugNamespace),
    }
    

    

    //& PARSE INITIAL STATE AND OPTIONS                                                                                 
    if (typeof initialState === 'object') {
        if (!isPlainObject(initialState)) {
            throw new Error(`InitialState is of invalid type. Expected plain object or function, but received: ${typeof initialState}`);
        }
    } else if (typeof initialState !== 'function') {
        throw new Error(`InitialState is of invalid type. Expected 'function' or 'object', but received: ${typeof initialState}`);
    }

    if (options && !isPlainObject(options)){
        throw Error(ERRORS.options_bad_type)
    }



    //& UPDATE LOCAL STORAGE                                                                                            
    const updateStorage = (target:T | Partial<T>) => {
        if(storageObject){
            try{
                storageObject.setItem(opt.storageKey,  JSON.stringify(target))
            }catch(err){
                console.log('Failed to parse target and update storage:', err)
            }
        }
    }



    //& GET                                                                                                             
    const proxy_get = (target: Partial<T>, prop: string | symbol, receiver: any) => {
        // Return the entire store if 'get' is invoked without arguments
        let actionId = tinyId(4)
        logger.action.log({ action: 'get', actionId, prop, target })
        let returnable:any

        if (prop === 'undefined') {
            logger.get.log(`Prop is 'undefined', returning store.`)
            returnable = target;
            return;
        }


        else if (typeof prop === 'string' && prop.includes('.')) {
            const parts = prop.split('.');
            let current: any = target;

            for (let part of parts) {
                current = current[part];
            }
             returnable = current;
        }

        else if(typeof prop === 'string') {
            if(eventMethods.includes(prop)){
                console.log('proxy getter attempted access to event methods:', prop)
                let method: NSTEventEmitter[keyof NSTEventEmitter] = (EE as any)[prop].bind(EE)
                console.log('Returning eventEmitter method:', method)
                return method
            }
            returnable = Reflect.get(target, prop, receiver) // as T[typeof prop]
        }

        if(typeof returnable === 'function'){
            return function (...args:any[]) {
                let res = returnable.apply(receiver, args)
        
                if (res instanceof Promise) {
                    // If the result is a promise, we need to handle it asynchronously
                    return res.then((asyncRes) => {
                        return asyncRes
                    });
                } else {
                    return res
                }
            }
        }

        return Reflect.get(target, prop, receiver)
    }

    //& SET                                                                                                             
    const proxy_set = (target: Partial<T>, prop: string | symbol, value: any, receiver: any) => {
        try{

            let actionId = tinyId(4)
            console.log('> ROOT| set | Is target extensible:', Object.isExtensible(target));
            console.log('> ROOT | set | Property descriptor:', Object.getOwnPropertyDescriptor(target, prop));
            console.log('> ROOT | set prop:', prop)
            console.log('> ROOT | set value:', value)
            const oldValue = Reflect.get(target, prop, receiver);
            const result = Reflect.set(target, prop, value, receiver ?? target);
            logger.action.log({ action: 'set', actionId, prop, value, oldValue, result, target })
            console.log('> ROOT | set result:', result)
            if (result) {
                updateStorage(target)
            }
            
            notifyListeners(prop, { key: prop.toString(), path: prop.toString(), previousValue: oldValue, value });
            sendToReduxDevTools({ type: 'SET', payload: { prop, value } }, target);
            
            
            return result; 
        }catch(err){
            console.log('ERROR WITH PROXY SET HANDLER:', err)
            return false
        }
    }

    //& DELETE                                                                                                          
    const proxy_delete = (target: Partial<T>, prop: string | symbol) => {
        // Custom delete logic
        let actionId = tinyId(4)
        const oldValue = Reflect.get(target, prop);
        const result = Reflect.deleteProperty(target, prop);
        logger.action.log({ action: 'delete', actionId, prop, oldValue, result, target })
        sendToReduxDevTools({ type: 'DELETE', payload: { prop } }, target);
        if (result) {
            updateStorage(target)
            sendToReduxDevTools({ type: 'SET', payload: { prop, value:undefined } }, target);
            notifyListeners(prop, { key: prop.toString(), path: prop.toString(), previousValue: oldValue, value:undefined });
        }
        return result
    }



    
    //& STORE INITIALIZER                                                                                               
    if (typeof initialState === 'function') {
        const func = initialState as StoreInitializer<T>;
        let newState = func(state as T);
        Object.assign(state, newState)
    } else {
        let newState= JSON.parse(JSON.stringify(initialState as T));
        Object.assign(state, newState)
    }
    
    //& MIDDLEWARE REGISTRATION                                                                                         
    let handlers: Handlers<T> = {}
    type Context<T> = {
        target: Partial<T>;
        prop: string | symbol;
        receiver?: any;
        value?: any;
    };
    type Middleware<T> = (context: Context<T>, trapName: string, next: () => any) => any;

    if(options.middleware && options.middleware.length){

        
        // type Middleware<T> = (context: T, trapName: string, next: () => any) => any;

        function compose<T>(middlewares: Middleware<T>[]): Middleware<T> {
            return function (context: Context<T>, trapName: string, next: () => any) {
            let index = -1;
            
            function dispatch(i: number): any {
                if (i <= index) throw new Error('next() called multiple times');
                index = i;
                let fn = middlewares[i] || next;
                if (!fn) return;
                try {
                    return fn(context, trapName, () => dispatch(i + 1));
                } catch (err) {
                    throw err;
                }
            }

                return dispatch(0);
            };
        }

        const composed = compose(options.middleware);
   
        handlers = {
            get(target: Partial<T>, prop: string | symbol, receiver: any) {
                return composed({ target, prop, receiver }, 'get', () => proxy_get(target, prop, receiver));
            },
            set(target: Partial<T>, prop: string | symbol, value: any, receiver: any) {
                return composed({ target, prop, value, receiver }, 'set', () => proxy_set(target, prop, value, receiver));
            },
            deleteProperty(target: Partial<T>, prop: string | symbol) {
                return composed({ target, prop }, 'deleteProperty', () => proxy_delete(target, prop));
            }
        }

    }else{
        handlers = {
            get: proxy_get,
            set: proxy_set,
            deleteProperty: proxy_delete
        }
    }
   
    let proxy: T & NSTEventEmitter = createDeepProxy(state, handlers) as T & NSTEventEmitter





    // //& PROXY WITH STORE AND MIDDLEWARE                                                                             
    // proxy = createDeepProxy(state, handlers) as T & NSTEventEmitter

    //& Setup DevTools                                                                                                  
    if(DT){
        DT.init(state);
        DT.subscribe((message: any) => {
            if (message.type === 'DISPATCH' && message.state) {
                switch (message.payload.type) {
                    case 'JUMP_TO_STATE':
                    case 'JUMP_TO_ACTION':
                        let newState = JSON.parse(message.state);
                        Object.assign(state, newState)
                        //! this should really call emitAll
                        EE.emit('/', {
                            key: '/',
                            path: '/',
                            value: state,
                        });
                    break;
                }
            }
        });
    }


    //& Load from storage                                                                                               
    // loading storage must take place after store initializer to overwrite store values
    let opt:any = options as any
    if(opt.storageKey && typeof opt.storageKey === 'string' && opt.storageKey.length > 0){
        if(opt.storage){
            console.log('checking custom storage...')
            if(typeof opt.storage.getItem === 'function' && typeof opt.storage.setItem === 'function'){
                storageObject = opt.storage
                console.log('Custom storage OK', storageObject)
            }else{
                console.log('Custom storage does not conform to Storage API')
            }

        }else if(typeof window !== 'undefined' && window.localStorage){
            console.log('attempting to use localStorage...')
            storageObject = window.localStorage
        }else{
            console.log('! A storage key was provided but there is no storage object to use.')
        }

        if(storageObject){
            console.log('Loading state from storage...')
            try{
                let stored = storageObject.getItem(opt.storageKey) ?? '{}'
                let parsed = JSON.parse(stored)
                Object.assign(state, parsed)
                console.log('Storage loaded OK', state)
            }catch(err){
                console.log('Failed to load state from storage')
            }
        }
    }


    return proxy

}

if (typeof window !== "undefined") {
    (window as any).nestore = createStore;
}

export default createStore;
