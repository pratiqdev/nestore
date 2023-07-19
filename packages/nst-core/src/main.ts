import type { BaseRecord, NestoreOptions, GetterFunc, SetterFunc, Listener, NestoreReturn, MakeDataPropsOptional } from './types'
import { colors, debug } from './debug';
import EventEmitter from './event';







/*


type StoreInitializer<T> = (proxyMethods: ProxyMethods<T>) => T;

interface ProxyMethods<T> {
    get: (prop: PropertyKey) => any;
    set: (prop: PropertyKey, value: any) => void;
}

function createStore<T>(store: T | StoreInitializer<T>) {
    let initialStore: T = typeof store === 'function' ? {} as T : store;

    let proxyMethods: ProxyMethods<T> = {
        get: (prop: PropertyKey) => initialStore[prop],
        set: (prop: PropertyKey, value: any) => {
            initialStore[prop] = value;
        }
    };
    
    let proxy = new Proxy(initialStore, {
        get: (_, prop) => proxyMethods.get(prop),
        set: (_, prop, value) => {
            proxyMethods.set(prop, value);
            return true;
        }
    });

    if (typeof store === 'function') {
        initialStore = (store as StoreInitializer<T>)(proxyMethods);
        // Optionally, you can update proxy with new initialStore here.
    }

    return proxy;
}

// Usage
const myStore = createStore(({ get, set }) => ({
    myKey: 'hello',
    myFunc: (newKey: string) => set('myKey', newKey),
}));

*/
type StoreInitializer<T extends object> = (proxyMethods: {
  get: <K extends keyof T> (keyOrGetterFunc ?: string | T[K] | GetterFunc<T>) => T | keyof T,
  set: <K extends keyof T>(key: K, valueOrSetterFunc: T[K] | SetterFunc<T>) => boolean
}) => T;

interface ProxyMethods<T> {
  get: (prop: PropertyKey) => any;
  set: (prop: PropertyKey, value: any) => void;
}



//&                                                                                                 
function createNestore<T extends BaseRecord>(
  initialState: T | StoreInitializer<T> = {} as T,
  options: NestoreOptions = {}
): NestoreReturn<T> {
  let store = typeof initialState === 'function' ? {} as T : JSON.parse(JSON.stringify(initialState)) as Partial<T>;
  let originalStore = typeof initialState === 'function' ? {} as T : JSON.parse(JSON.stringify(initialState)) as Partial<T>;
  let globalDebugNamespace:string = ''
  const eventEmitter = new EventEmitter();
  
  //+ need to parse mutators and listeners before de-ref
  // try {
  //   store = JSON.parse(JSON.stringify(initialState));
  // } catch (err) {
  //   throw new Error(`Nestore: failed to parse 'initialStore'`);
  // }


  //&                                                                          
  //$ HANDLE LOGGING AND DEBUG FLAGS
  
  if(options?.debug){
    console.log(colors.primary.red + 'Options debug flag set:', options.debug, colors.modifiers.reset)
    globalDebugNamespace = typeof options?.debug === 'string' ? options.debug : '*'
  }
  if(process?.env?.DEBUG){
    console.log(colors.primary.red + 'Env debug flag set:', process.env.DEBUG, colors.modifiers.reset)
    if(process.env.DEBUG === 'true'){
      globalDebugNamespace = '*'
    }else{
      globalDebugNamespace = process.env.DEBUG
    }
  }
  
  const logger = {
    init: debug('init', globalDebugNamespace),
    get: debug('get', globalDebugNamespace),
    set: debug('set', globalDebugNamespace),
  }


  const internalProps = [
    'get',
    'set',
    'reset',
    'delete'
  ]

  const _get = <K extends keyof T>(keyOrGetterFunc?: string | T[K] | GetterFunc<T>): T | keyof T => {
    if(!keyOrGetterFunc){
      return store as T
    }
    if (typeof keyOrGetterFunc === 'function') {
      return (keyOrGetterFunc as GetterFunc<T>)(proxy as T);
    }

    return proxy[keyOrGetterFunc] as T[K]
  }

  const _set = <K extends keyof T>(key: K, valueOrSetterFunc: T[K] | SetterFunc<T>) => {
    try{

      if (typeof valueOrSetterFunc === 'function') {
        proxy[key] = (valueOrSetterFunc as SetterFunc<T>)(proxy as T);
      } else {
        proxy[key] = valueOrSetterFunc;
      }
      return true
    }catch(err){
      return false
    }
  }

  const proxyMethods = {
    get(target: Partial<T>, prop: string | symbol, receiver: any) {
      // Return the entire store if 'get' is invoked without arguments
      logger.get.log({
        target, prop, receiver
      })

      if (prop === "get") return _get;
      if (prop === "set") return _set;
      if (prop === "reset") return () => {
        Object.keys(target).forEach(key => {
          delete target[key];
        });
        Object.assign(target, originalStore);
      };
      // can already get all values in store from 'nst'
      // maybe this could return verbose store (with setters, listeners, etc.)
      // if (prop === "store") return store; 

      // return target[prop as string | number];


      if (prop === 'undefined') {
        logger.get.log(`Prop is 'undefined', returning store.`)
        return target;
      }

      if (typeof prop === 'string' && prop.includes('.')) {
        const parts = prop.split('.');
        let current: any = target;

        for (let part of parts) {
          current = current[part];
        }

        return current;
      }

      return Reflect.get(target, prop, receiver) as keyof typeof store
    },
    set(target: Partial<T>, prop: string | symbol, value: any, receiver: any) {
      const oldValue = Reflect.get(target, prop, receiver);
      const result = Reflect.set(target, prop, value, receiver);

      if (oldValue !== value) {
        eventEmitter.emit(prop.toString(), {
          key: prop.toString(),
          path: prop.toString(),
          value: value,
        });
      }

      return result;
    },
    deleteProperty(target: Partial<T>, prop: string | symbol) {
      // Custom delete logic
      let propString = String(prop)
      console.log(`Deleting ${propString}`);
      if (!target || internalProps.includes(propString)) return false
      if (prop in target) {
        delete target[propString];
        return true;
      }
      return false;
    },
  }

  if (typeof store === 'function') {
    store = (store as StoreInitializer<T>)({ get: _get, set: _set });
    // Optionally, you can update proxy with new initialStore here.
  }

  const proxy = new Proxy<Partial<T>>(store, proxyMethods);

  return proxy as NestoreReturn<T>

}







if (typeof window !== "undefined") {
  window.nestore = createNestore;
}





export default createNestore;

const nst = createNestore({
  grape: 'flavored',
  number: (arg:any) => arg ? true : false
})


nst.number