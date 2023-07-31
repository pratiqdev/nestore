declare global {
    interface Window {
      nestore?: () => unknown;
    }
}

// export type DEPRECATED__MakeDataPropsOptional<T> = {
//   [K in keyof T]: {
//     [P in keyof T[K]]: Partial<T[K][P]> | undefined;
//   }
// };


// export type DEPRECATED__ProxyObject<T> = {
//     [K in keyof T]: T[K] extends Record<string | number, unknown>
//         ? DEPRECATED__ProxyObject<T[K]>
//         : T[K];
// };

// export type DEPRECATED__NestoreOptions = {
//   /** Enable internal debugging of state and methods.  
//    * Has same effect as setting env variable `DEBUG=@nst`
//    */
//   debug?: boolean;

// }


// // extend the nestore return with any props
// export type DEPRECATED__AnyRecordProps = { [prop: string]: any; }



// export type DEPRECATED__NestoreReturn<T extends Object> = DEPRECATED__DynamicStore<T> & {
//   [K in keyof T]: T[K];
// }

// export type DEPRECATED__DynamicStore<T extends object> = T & Record<string | number, any>;

// // & {

// // export type TestReturn = 
// //   get: {
// //     <K extends keyof T>(key: K): T[K];
// //     <K extends keyof T>(func: (store: Partial<T>) => T[K]): ReturnType<typeof func>;
// //   };
// //   set: <K extends keyof T>(key: K, valueOrSetterFunc: T[K] | SetterFunc<T, K>) => boolean;
// //   reset: () => void;
// //   store: Partial<T>;
// // } & AnyRecordProps;


// export type DEPRECATED__BaseRecord = {
//     [key: string]: any;
//   };


  
  
// export type DEPRECATED__StoreInitializer<T> = (self:Partial<T>) => Partial<T>
// //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export type StoreInitializer<T> = (self:T) => T | (() => T)

export type BaseNestoreOptions<T> = {
  debug?: boolean;
  middleware?: Middleware<T>[];
};

export type StorageOptionsA = {
  storageKey: string;
};

export type StorageOptionsB = {
  storageKey: string;
  storage: Storage;
};

export type NestoreOptions<T> = BaseNestoreOptions<T> | (BaseNestoreOptions<T> & StorageOptionsA) | (BaseNestoreOptions<T> & StorageOptionsB);

export type NextFunc<T> = () => Handlers<T>

export type Middleware<T> = (self: T, next: NextFunc<T>) => Handlers<T>

export type Handlers<T> = {
    get?: (target: Partial<T>, prop: string | symbol, receiver: any) => any;
    set?: (target: Partial<T>, prop: string | symbol, value: any, receiver: any) => boolean;
    deleteProperty?: (target: Partial<T>, prop: string | symbol) => boolean;
}
  
export type AnyRecord = Record<string | number, any>