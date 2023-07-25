import type { 
  BaseRecord, 
  NestoreOptions, 
  NestoreReturn, 
  DynamicStore,
  StoreInitializer,
  Store
} from '@pratiq/nestore-types'
import { colors, debug } from './debug'; 
import EventEmitter from './event';
import tinyId from './tinyId';






//&                                                                                                 
function createNestore<T extends Store>(
  initialState: T | StoreInitializer<T> = {} as T,
  options: NestoreOptions = {}
): DynamicStore<T> {
  
  let store = typeof initialState === 'function' ? {} as T : JSON.parse(JSON.stringify(initialState)) as Partial<T>;
  let originalStore = typeof initialState === 'function' ? {} as T : JSON.parse(JSON.stringify(initialState)) as Partial<T>;
  let globalDebugNamespace:string = ''
  const eventEmitter = new EventEmitter();
  


  //&                                                                          
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
      returnable = Reflect.get(target, prop, receiver) as T[typeof prop]
    }

    if(typeof returnable === 'function'){
      return function (...args:any[]) {
        console.log('>>> its a function?? this is middleware????')
        let res = (returnable as Function).apply(receiver, args)
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
      eventEmitter.emit(prop.toString(), {
        key: prop.toString(),
        path: prop.toString(),
        value: value,
      });
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
    return result
  }



  
  //& create the proxy object                                                                                           
  //$ using the initial store and proxy handlers
  // using a proxy allows for easy access to and modification
  // of the internal properties of an object
  const proxy = new Proxy<DynamicStore<T>>(store, {
    apply: proxy_apply,
    get: proxy_get,
    set: proxy_set,
    deleteProperty: proxy_delete
  });


  //& Invoke the store initializer if exist                                                                             
  // If an initializer function was used to create the store:
  // invoke the store with the proxy - which stores a reference to the 
  // target and its attributes - so will update when the target updates
  if (typeof initialState === 'function') {
    logger.init.log('Store initializer provided:', { store, proxy })
    let newStore = (initialState as StoreInitializer<T>)(proxy)
    // must maintain the reference of the store
    // the initializer will return a new object that must be
    // merged with the target store
    Object.assign(store, newStore)
    logger.init.log('Initializer invoked.. result:', { store, proxy })
    // Optionally, you can update proxy with new initialStore here.
  }


  

  return proxy

}







if (typeof window !== "undefined") {
  (window as any).nestore = createNestore;
}





export default createNestore;
