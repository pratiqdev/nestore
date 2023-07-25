declare global {
    interface Window {
      nestore?: () => unknown;
    }
}

export type MakeDataPropsOptional<T> = {
  [K in keyof T]: {
    [P in keyof T[K]]: Partial<T[K][P]> | undefined;
  }
};

export type ProxyObject<T> = {
    [K in keyof T]: T[K] extends Record<string | number, unknown>
        ? ProxyObject<T[K]>
        : T[K];
};

export type NestoreOptions = {
  /** Enable internal debugging of state and methods.  
   * Has same effect as setting env variable `DEBUG=@nst`
   */
  debug?: boolean;
}


// extend the nestore return with any props
export type AnyRecordProps = { [prop: string]: any; }



export type NestoreReturn<T extends Object> = DynamicStore<T> & {
  [K in keyof T]: T[K];
}

export type DynamicStore<T extends object> = T & Record<string | number, any>;

// & {

// export type TestReturn = 
//   get: {
//     <K extends keyof T>(key: K): T[K];
//     <K extends keyof T>(func: (store: Partial<T>) => T[K]): ReturnType<typeof func>;
//   };
//   set: <K extends keyof T>(key: K, valueOrSetterFunc: T[K] | SetterFunc<T, K>) => boolean;
//   reset: () => void;
//   store: Partial<T>;
// } & AnyRecordProps;


export type BaseRecord = {
    [key: string]: any;
  };


  
export type StoreInitializer<T extends BaseRecord> = (proxyRef: T) => T;
  

  