import { NestoreOptions } from "@pratiq/nestore-types";
import EventEmitter from "./event";
import { debug } from "./debug";
import tinyId from "./tinyId";

// & {
//     [K in keyof T]?: T[K] extends Record<string | number, unknown>
//     ? ProxyObject<T[K]>
//     : T[K];
// };

// export type MakeDataPropsOptional<T> = {
//     [K in keyof T]: {
//       [P in keyof T[K]]: Partial<T[K][P]> | undefined;
//     }
//   };
// export type ProxyObject<T> = Partial<T & Record<string | number, any>>

// export type StoreMethods<T> = {
//     [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
// }[keyof T];

// export type StoreProps<T> = {
//     [K in keyof T]: T[K] extends (...args: any[]) => any ? never : K;
// }[keyof T];

// export type ProxyObject<T> = Partial<Record<StoreProps<T>, any>> & Record<StoreMethods<T>, any>;

const sendToReduxDevTools = (action: any, state: any) => {
    if (typeof window !== 'undefined' && (window as any).__REDUX_DEVTOOLS_EXTENSION__) {
        (window as any).__REDUX_DEVTOOLS_EXTENSION__.send(action, state);
    }
};




// When initialState is an object
function createStore<T extends Object>(
    initialState: Partial<T>,
    options?: NestoreOptions
): Partial<T> & Record<string | number, any>;

// When initialState is a function
function createStore<T extends Object>(
    initialState: (self: Partial<T>) => Partial<T>,
    options?: NestoreOptions
): Partial<T> & Record<string | number, any>;

//& Implementation                                                                                                      
function createStore<T extends Object>(
    initialState: T | ((self: T) => T),
    options: NestoreOptions = {}
): Partial<T> & Record<string | number, any> {

    let globalDebugNamespace:string = ''
    const EE = new EventEmitter();
    const DT = typeof window !== 'undefined' ? (window as any).__REDUX_DEVTOOLS_EXTENSION__.connect() : null;

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


    const proxy_apply = (target: Partial<T> | Function, thisArg:any, argumentsList: any[]) => {
        console.log('>>>>>>>>>>>> Proxy - apply:', target, thisArg, argumentsList)
        if(typeof target !== 'function'){
        console.log('NON FUNCTION TARGET PASSED TO PROXY APPLY METHOD')
        return;
        }
        let actionId = tinyId(4)
        // Custom logic before function call
        const result = target.apply(thisArg, argumentsList); // Call the original function
        // Custom logic after function call
        logger.action.log({ action: 'modifier', actionId, result, target, argumentsList })
        return result; // Return the result of the function call (optional)
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
            return async function (...args:any[]) {
                console.log('>>> its a function?? this is middleware????')
                let res = await (returnable as Function).apply(receiver, args)
                console.log('>>>> we did it! here is the result:', res)
                return res
            }
        }

        return returnable

        // return Reflect.get(target, prop, receiver) as T[typeof prop]
    }

    const proxy_set = (target: Partial<T>, prop: string | symbol, value: any, receiver: any) => {
        let actionId = tinyId(4)
        
        const oldValue = Reflect.get(target, prop, receiver);
        const result = Reflect.set(target, prop, value, receiver);
        
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
        return result
    }

    // const handleEmitAll = (ignoreRoot?:boolean) => {

    //     const emitted:string[] = []

    //     const visitNodes = (obj:Partial<T>, visitor: (path:string, value: unknown) => unknown, stack:unknown[] = []) => {
    //         if (typeof obj === 'object') {
    //           for (const key in obj) {
    //             visitor(stack.join('.').replace(/(?:\.)(\d+)(?![a-z_])/ig, '[$1]'), obj);
    //             visitNodes(obj[key] as Partial<T>, visitor, [...stack, key]);
    //           }
    //         } else {
    //           visitor(stack.join('.').replace(/(?:\.)(\d+)(?![a-z_])/ig, '[$1]'), obj);
    //         }
    //     }

    //     visitNodes(store, (_path:string, value:unknown) => {
    //         // let split = _path.split(/\[|\]\[|\]\.|\.|\]/g)
    //         const split = this.#splitPathStringAtKnownDelimiters(_path)
    //         .filter(x => x.trim() !== '')
            
    //         const key = split[split.length - 1] ?? '/'
    //         const path = split.length ? split.join(this.#DELIMITER_CHAR) : '/'


    //         if(!emitted.includes(path)){
    //             if(ignoreRoot && path === '/') return
    //             emitted.push(path)

    //             // this.#DEV_EXTENSION
    //             // && this.#DEV_EXTENSION.send({
    //             //     type: `SET: ${path}`,
    //             //     previousValue: get(ignoreRoot, path),
    //             //     path,
    //             //     value,
    //             // }, this.store)
                
    //             this.#emit({
    //                 path,
    //                 key,
    //                 value,
    //                 // timestamp: Date.now()
    //             })
    //         }

    //     });
          
    // }


    let state: T = {} as T
    let proxy: T = new Proxy(state, {
        apply: proxy_apply,
        get: proxy_get,
        set: proxy_set,
        deleteProperty: proxy_delete
      }) as T

    if (typeof initialState === 'function') {
        const func = initialState as (self: T) => T;
        let newState = func(proxy);
        Object.assign(state, newState)
    } else {
        state = initialState as T;
    }

    proxy = new Proxy(state, {
        apply: proxy_apply,
        get: proxy_get,
        set: proxy_set,
        deleteProperty: proxy_delete
    }) as T

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

    return proxy
}

if (typeof window !== "undefined") {
    (window as any).nestore = createStore;
}

export default createStore;


















// const nst1 = createStore({
//     greetings: 'hello'
// })

// //&                                                                                                                     
// type Store = {
//     greetings: string;
//     location: string;
//     ayo: () => string;
// }

// let GREETING = 'hello'
// const nst = createStore<Store>((self) => ({
//     greetings: GREETING,
//     location: 'world',
//     ayo: () => self.greetings + ', ' + self.location
// }))
// delete nst.greetings
// nst.ayo?.()
// // Cannot invoke an object which is possibly 'undefined'.ts(2722)
// // (property) ayo?: (() => string) | undefined


// nst1.greetings = 'ayo'
// nst1.ayo = 'greetings'


// const n1 = createStore({ greetings: 'hello' })
// delete n1.greetings
// n1.ayo = 'whjat'


// const n2 = createStore(() => ({ greetings: 'hello' }))
// delete n2.greetings
// n2.ayo = 'whjat'
