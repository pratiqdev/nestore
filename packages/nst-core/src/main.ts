// import { NestoreOptions, StoreInitializer } from "@pratiq/nestore-types";
import EventEmitter from "./event";
import { debug } from "./debug";
import tinyId from "./tinyId";
import ERRORS from "./errors";

import { AnyRecord, StoreInitializer, NestoreOptions, Handlers, BaseNestoreOptions, StorageOptionsB, StorageOptionsA } from "@pratiq/nestore-types";

 

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

function hasStorage(options: NestoreOptions<any>): options is BaseNestoreOptions<any> & StorageOptionsB {
    return (options as any).storage !== undefined;
}

function hasStorageKey(options: NestoreOptions<any>): options is BaseNestoreOptions<any> & StorageOptionsA | BaseNestoreOptions<any> & StorageOptionsB {
    return (options as any).storageKey !== undefined;
}

//& Implementation                                                                                                      
function createStore<T extends AnyRecord>(
    initialState: StoreInitializer<T> | T = {} as T,
    options: NestoreOptions<T> = {}
    ): T {
        

    let globalDebugNamespace:string = ''
    const EE = new EventEmitter();
    const DT = typeof window !== 'undefined' ? (window as any).__REDUX_DEVTOOLS_EXTENSION__.connect() : null;
    let storageObject: null | Storage = null
    let state: T = {} as T

    // let opt:any = options as any
    // if(opt.storageKey && typeof opt.storageKey === 'string' && opt.storageKey.length > 0){
    //     if(opt.storage){
    //         console.log('checking custom storage...')
    //         if(typeof opt.storage.getItem === 'function' && typeof opt.storage.setItem === 'function'){
    //             storageObject = opt.storage
    //             console.log('Custom storage OK', storageObject)
    //         }else{
    //             console.log('Custom storage does not conform to Storage API')
    //         }

    //     }else if(typeof window !== 'undefined' && window.localStorage){
    //         console.log('attempting to use localStorage...')
    //         storageObject = window.localStorage
    //     }else{
    //         console.log('! A storage key was provided but there is no storage object to use.')
    //     }

    //     if(storageObject){
    //         console.log('Loading state from storage...')
    //         try{
    //             let stored = storageObject.getItem(opt.storageKey) ?? '{}'
    //             let parsed = JSON.parse(stored)
    //             Object.assign(state, parsed)
    //             console.log('Storage loaded OK', state)
    //         }catch(err){
    //             console.log('Failed to load state from storage')
    //         }
    //     }
    // }
    
    //&                                                                          
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


    const updateStorage = (target:T | Partial<T>) => {
        if(storageObject){
            try{
                storageObject.setItem(opt.storageKey,  JSON.stringify(target))
            }catch(err){
                console.log('Failed to parse target and update storage:', err)
            }
        }
    }





    const proxy_get = (target: Partial<T>, prop: string | symbol, receiver: any) => {
        // Return the entire store if 'get' is invoked without arguments
        let actionId = tinyId(4)
        logger.action.log({ action: 'get', actionId, prop, target })
        let returnable:any


        if (prop === 'undefined') {
            logger.get.log(`Prop is 'undefined', returning store.`)

            returnable = target;
            // return target;
            return;
        }





        else if (typeof prop === 'string' && prop.includes('.')) {
            const parts = prop.split('.');
            let current: any = target;

            for (let part of parts) {
                current = current[part];
            }

             returnable = current;
            // return current;
        }

        else if(typeof prop === 'string') {
            // return Reflect.get(target, prop, receiver) as T[typeof prop]
            returnable = Reflect.get(target, prop, receiver) // as T[typeof prop]
        }

        if(typeof returnable === 'function'){
            return function (...args:any[]) {
                // console.log('>>>>> FUNC')
                // console.log(`[${actionId}|I|${Date.now()}\n\t`, args)
                let res = returnable.apply(receiver, args)
        
                if (res instanceof Promise) {
                    // If the result is a promise, we need to handle it asynchronously
                    return res.then((asyncRes) => {
                        // console.log(`[${actionId}|O|${Date.now()}\n\t`, asyncRes)
                        return asyncRes
                    });
                } else {
                    // console.log(`[${actionId}|O|${Date.now()}\n\t`, res)
                    return res
                }
            }
        }

        return Reflect.get(target, prop, receiver)

        // return Reflect.get(target, prop, receiver) as T[typeof prop]
    }

    const proxy_set = (target: Partial<T>, prop: string | symbol, value: any, receiver: any) => {
        let actionId = tinyId(4)
        console.log('> ROOT | set:', {
            target,
            prop,
            value,
            receiver
        })
        console.log('> ROOT| set | Is target extensible:', Object.isExtensible(target));
        console.log('> ROOT | set | Property descriptor:', Object.getOwnPropertyDescriptor(target, prop));
        console.log('> ROOT | set prop:', prop)
        console.log('> ROOT | set value:', value)
        const oldValue = Reflect.get(target, prop, receiver);
        const result = Reflect.set(target, prop, value, receiver ?? target);
        console.log('> ROOT | set result:', result)
        if (result) {
            updateStorage(target)
        }
        
        if (oldValue !== value) {
            EE.emit(prop.toString(), {
                key: prop.toString(),
                path: prop.toString(),
                value: value,
            });
            sendToReduxDevTools({ type: 'SET', payload: { prop, value } }, target);
        }
        
        
        logger.action.log({ action: 'set', actionId, prop, value, oldValue, result, target })
        return result; 
    }

    const proxy_delete = (target: Partial<T>, prop: string | symbol) => {
        // Custom delete logic
        let actionId = tinyId(4)
        const oldValue = Reflect.get(target, prop);
        const result = Reflect.deleteProperty(target, prop);
        logger.action.log({ action: 'delete', actionId, prop, oldValue, result, target })
        sendToReduxDevTools({ type: 'DELETE', payload: { prop } }, target);
        if (result) {
            updateStorage(target)
        }
        return result
    }



    let handlers: Handlers<T> = {
        get: proxy_get,
        set: proxy_set,
        deleteProperty: proxy_delete
    }

    let proxy: T = new Proxy(state, handlers) as T


    if (typeof initialState === 'function') {
        const func = initialState as StoreInitializer<T>;
        let newState = func(state as T);
        Object.assign(state, newState)
    } else {
        let newState= JSON.parse(JSON.stringify(initialState as T));
        Object.assign(state, newState)
    }

    if(options.middleware){
        for (const middleware of options.middleware) {
            console.log('>>> Registering middleware:', middleware?.name ?? middleware)
            handlers = middleware(proxy, () => handlers) as Handlers<T>;
        }
    }

    proxy = new Proxy(state, handlers) as T











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
