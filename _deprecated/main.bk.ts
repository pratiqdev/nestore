
declare global {
  interface Window {
    nestore?: () => unknown;
  }
}

export type ProxyObject<T> = {
  [K in keyof T]: T[K] extends Record<string | number, unknown>
    ? ProxyObject<T[K]>
    : T[K];
};

export type NestoreOptions = {
  debug?: boolean;
}

export type NestoreReturn<T> = ProxyObject<T> & {
  get<K extends keyof T>(pathOrFunc: K | ((state: T) => T[K])): T[K];
  set(pathOrFunc: keyof T | ((state: T) => T), value?: unknown): void;
  reset(): void;
  delete<K extends keyof T>(pathOrFunc: K | ((state: T) => unknown)): void;
  store: T;
}

export type BaseRecord = Record<string | number, unknown>

// export type StateGetter<T> = {
//   <K extends keyof T>(pathOrFunc: K | ((state: T) => T[K])): T[K];
// };














// Define the state manager types
type Store = Record<string, any>;
type Options = Record<string, any>;
type GetterFunc = (store: Store) => any;
type SetterFunc = (store: Store) => any;

// Define the event emitter types
type Listener = (event: any) => void;
type Event = string;

class EventEmitter {
  listeners: Record<Event, Listener[]>;

  constructor() {
    this.listeners = {};
  }

  on(event: Event, listener: Listener) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }

    this.listeners[event].push(listener);
  }

  emit(event: Event, data: any) {
    const listeners = this.listeners[event];

    if (!listeners) return;

    for (let i = 0; i < listeners.length; i++) {
      listeners[i](data);
    }
  }
}


















let colors = {
  modifiers: {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",
  },
  primary: {
    red_dim: "\x1b[2m\x1b[31m",
    red: "\x1b[0m\x1b[31m",
    red_bright: "\x1b[1m\x1b[31m",
    
    green_dim: "\x1b[2m\x1b[32m",
    green: "\x1b[0m\x1b[32m",
    green_bright: "\x1b[1m\x1b[32m",
    
    yellow_dim: "\x1b[2m\x1b[33m",
    yellow: "\x1b[0m\x1b[33m",
    yellow_bright: "\x1b[1m\x1b[33m",

    blue_dim: "\x1b[2m\x1b[34m",
    blue: "\x1b[0m\x1b[34m",
    blue_bright: "\x1b[1m\x1b[34m",
    
    magenta_dim: "\x1b[2m\x1b[35m",
    magenta: "\x1b[0m\x1b[35m",
    magenta_bright: "\x1b[1m\x1b[35m",
    
    cyan_dim: "\x1b[2m\x1b[36m",
    cyan: "\x1b[0m\x1b[36m",
    cyan_bright: "\x1b[1m\x1b[36m",
  }
}

let globalDebugNamespace: string;
let rootNamespace: string = '@nst'

function hashString(str:string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    let char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to a 32-bit integer
  }
  return hash;
}

function getColor(str:string) {
  let hash = hashString(str);
  // Make sure it's positive and fits in the array bounds
  let index = Math.abs(hash) % Object.values(colors.primary).length; 
  return Object.values(colors.primary)[index];
}

class Debug {
  namespace: string;
  forceEnabled: boolean;  
  color: string;

  constructor(namespace:string) {
    this.namespace = namespace;
    this.forceEnabled = true

    this.color = getColor(namespace)
  }

  enable(){
    this.forceEnabled = true
  }

  disable(){
    this.forceEnabled = false
  }

  log(...args: any[]) {
    if (this.forceEnabled 
      || globalDebugNamespace === '*'
      || globalDebugNamespace === rootNamespace
      || globalDebugNamespace === rootNamespace + this.namespace
      || globalDebugNamespace === this.namespace
      || this.namespace.includes(globalDebugNamespace)
    ) {
      console.log(`${this.color}${rootNamespace}:${this.namespace}${colors.modifiers.reset}`, ...args);
    }else{
      console.log(`Log "${this.namespace}" disabled...`)
    }
  }
}



//&                                                                                                 
function createNestore<T extends BaseRecord>(
  initialState: T = {} as T,
  options: NestoreOptions = {}
): NestoreReturn<T> {
  let store: T = initialState;
  const eventEmitter = new EventEmitter();
  
  //+ need to parse mutators and listeners before de-ref
  // try {
  //   store = JSON.parse(JSON.stringify(initialState));
  // } catch (err) {
  //   throw new Error(`Nestore: failed to parse 'initialStore'`);
  // }


  //&                                                                          
  //$ HANDLE LOGGING AND DEBUG FLAGS
  const logger = {
    init: new Debug('init'),
    get: new Debug('get'),
    set: new Debug('set'),
  }

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


  //&                                                                          
  //$ GETTER FUNCTION
  function get<K extends keyof T>(pathOrFunc: K | ((state: T) => T[K])): T[K] {
    let isGetter:boolean = typeof pathOrFunc === 'function'
    logger.get.log(`Getting key with ${isGetter ? 'getter func' : pathOrFunc as string}`)

    let path:string;
    let value: any;
    let func: (state: T) => T[K];
    let splitPath:string[];

    if(isGetter){
      path = "" as string
      func = pathOrFunc as (state: T) => T[K];
      value = func(store)
      logger.get.log("get func k/v/p:", { key: null, value, path });

      return value as T[K]
    }



    path = pathOrFunc as string;
    splitPath = path.toString().split(".");
    let key = splitPath[-1]

    const result = value ?? splitPath.reduce((obj: any, key) => obj[key], value || store);
    logger.get.log("get path k/v/p:", { key, value, path, result });

    return result as T[K];
  }



  //&                                                                          
  //$ SETTER FUNCTION
  function set(pathOrFunc: keyof T | ((state: T) => T), value?: unknown): boolean {
    let isSetter:boolean = typeof pathOrFunc === 'function'
    logger.set.log("invoked with:", pathOrFunc, value);

    let path:string;
    let val: T;
    let func: (state: T) => T;
    let splitPath:string[];

    if(isSetter){
      path = "" as string
      func = pathOrFunc as (state: T) => T;
      val = func(store)
      return true
    }

    path = pathOrFunc as string
    splitPath = path.toString().split(".");
    let key = splitPath[-1]

   

    let obj: any = store;
    path.forEach((key, index) => {
      if (index === path.length - 1) {
        obj[key] = newValue;
      } else {
        obj = obj[key] as T;
      }
    });
  }


  //&                                                                          
  //$ PROXY UTILS
  function reset(): void {
    store = JSON.parse(JSON.stringify(initialState));
  }

  function del(pathOrFunc: keyof T | ((state: T) => unknown)): void {
    const key = typeof pathOrFunc === "function" ? "" : pathOrFunc;
    const path = key.toString().split(".");
    let obj = store;
    path.forEach((key, index) => {
      if (index === path.length - 1) {
        delete obj[key];
      } else {
        obj = obj[key] as T;
      }
    });
  }

  

  //&                                                                          
  //$ PROXY
  const proxy = new Proxy(store, {
    get(target, key) {
      if (key === "get") return get;
      if (key === "set") return set;
      if (key === "reset") return reset;
      if (key === "delete") return del;
      // can already get all values in store from 'nst'
      // maybe this could return verbose store (with setters, listeners, etc.)
      if (key === "store") return store; 
      
      return target[key as string | number];
    },
    //! already returning custom 'set' function...
    set(target, key, value) {
      set(key as keyof T, value);
      return true;
    },
  });

  return proxy as NestoreReturn<T>
}







if (typeof window !== "undefined") {
  window.nestore = createNestore;
}





export default createNestore;
