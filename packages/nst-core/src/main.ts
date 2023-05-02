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


//&                                                                                                 
function createNestore<T extends BaseRecord>(
  initialState: T = {} as T
): NestoreReturn<T> {
  let store: T = initialState;

  try {
    JSON.parse(JSON.stringify(initialState));
  } catch (err) {
    throw new Error(`Nestore: failed to parse 'initialStore'`);
  }

  function get<K extends keyof T>(pathOrFunc: K | ((state: T) => T[K])): T[K] {
    let isGetter:boolean = typeof pathOrFunc === 'function'
    let key:string;
    let value: any;
    let splitPath:

    if(isGetter){

    }

    console.log(
      "nst:get | invoked with:",
      isGetter ? pathOrFunc.toString() : pathOrFunc
    );
    const key = isGetter ? "" : pathOrFunc;
    const value = isGetter ? pathOrFunc(store): undefined;
    const path = key.toString().split(".");

    console.log("nst:get | k/v/p:", { key, value, path });
    const result =
      value ?? path.reduce((obj: any, key) => obj[key], value || store);
    /*
      the line `const result = path.reduce((obj, key) => obj[key], value || store);` throws a type 
      error: Element implicitly has an 'any' type because expression of type 'string' can't be used to index type 'T | NonNullable<T[K]>'.
  No index signature with a parameter of type 'string' was found on type 'T | NonNullable<T[K]>'.ts(7053)


      */
    return result as T[K];
  }

  function set(pathOrFunc: keyof T | ((state: T) => T), value?: unknown): void {
    console.log("nst:set | invoked with:", pathOrFunc, value);
    const key = typeof pathOrFunc === "function" ? "" : pathOrFunc;
    const newValue =
      typeof pathOrFunc === "function" ? pathOrFunc(store) : value;
    const path = key.toString().split(".");
    let obj: any = store;
    path.forEach((key, index) => {
      if (index === path.length - 1) {
        obj[key] = newValue;
      } else {
        obj = obj[key] as T;
      }
    });
  }

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

  const proxy = new Proxy(store, {
    get(target, key) {
      if (key === "get") return get;
      if (key === "set") return set;
      if (key === "reset") return reset;
      if (key === "delete") return del;
      if (key === "store") return store;
      return target[key as string | number];
    },
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

//   const nst = createNestore({
//     greeting:'hello',
//     user: {
//         name: 'John',
//         number: 7
//     }
//   })

//   const name = nst.get(s => s.user.name)
