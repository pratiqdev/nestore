import type { BaseRecord, NestoreOptions, GetterFunc, SetterFunc, Listener, NestoreReturn, MakeDataPropsOptional } from './types'
import { colors, debug } from './debug';
import EventEmitter from './event';











//&                                                                                                 
function createNestore<T extends BaseRecord>(
  initialState: T = {} as T,
  options: NestoreOptions = {}
): NestoreReturn<T> {
  let store = initialState as Partial<T>;
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

  const _reset = () => {

  }

  const _del = () => {

  }


  


  const proxy = new Proxy<Partial<T>>(store, {
    get(target, prop, receiver) {
      // Return the entire store if 'get' is invoked without arguments
      logger.get.log({
        target, prop, receiver
      })

      if (prop === "get") return _get;
      if (prop === "set") return _set;
      if (prop === "reset") return _reset;
      if (prop === "delete") return _del;
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
    set(target, prop, value, receiver) {
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
    deleteProperty(target, prop) {
      // Custom delete logic
      console.log(`Deleting ${String(prop)}`);
      if(!target) return false
      if (prop in target) {
        delete target[prop as string | number];
        return true;
      }
      return false;
    },
  });


  return proxy as NestoreReturn<T>

}







if (typeof window !== "undefined") {
  window.nestore = createNestore;
}





export default createNestore;


const nst = createNestore({
  grape: 'flavored'
})


nst.grape