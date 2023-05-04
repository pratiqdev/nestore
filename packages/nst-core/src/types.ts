
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
    debug?: boolean;
}

// export type NestoreReturn<T> = ProxyObject<T> & {
//     get<K extends keyof T>(pathOrFunc: K | ((state: T) => T[K])): T[K];
//     set(pathOrFunc: keyof T | ((state: T) => T), value?: unknown): void;
//     reset(): void;
//     delete<K extends keyof T>(pathOrFunc: K | ((state: T) => unknown)): void;
//     store: T;
// }
export type NestoreReturn<T> = {
    [K in keyof T]?: T[K];
  } & {
    get: <K extends keyof T>(keyOrGetterFunc?: string | T[K] | GetterFunc<T>) => typeof keyOrGetterFunc extends undefined | null ? T[K] : T;
    set: <K extends keyof T>(key: K, valueOrSetterFunc: T[K] | SetterFunc<T>) => boolean;
    reset: () => void;
    store: Partial<T>;
  };

export type BaseRecord = {
    [key: string]: any;
  };

// export type StateGetter<T> = {
//   <K extends keyof T>(pathOrFunc: K | ((state: T) => T[K])): T[K];
// };

  
  
  
  
  
  
  
  
  
  
  
  
  
// Define the state manager types
export type Store = Record<string, any>;
export type Options = Record<string, any>;
export type GetterFunc<T> = (store: T) => any;
export type SetterFunc<T> = (store: T) => any;

// Define the event emitter types
export type Listener = (event: any) => void;
export type Event = string;
