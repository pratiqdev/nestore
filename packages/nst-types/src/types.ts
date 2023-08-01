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

export type event = (symbol|string);
export type eventNS = string|event[];

export interface ConstructorOptions {
    /**
     * @default false
     * @description set this to `true` to use wildcards.
     */
    wildcard?: boolean,
    /**
     * @default '.'
     * @description the delimiter used to segment namespaces.
     */
    delimiter?: string,
    /**
     * @default false
     * @description set this to `true` if you want to emit the newListener events.
     */
    newListener?: boolean,
    /**
     * @default false
     * @description set this to `true` if you want to emit the removeListener events.
     */
    removeListener?: boolean,
    /**
     * @default 10
     * @description the maximum amount of listeners that can be assigned to an event.
     */
    maxListeners?: number
    /**
     * @default false
     * @description show event name in memory leak message when more than maximum amount of listeners is assigned, default false
     */
    verboseMemoryLeak?: boolean
    /**
     * @default false
     * @description disable throwing uncaughtException if an error event is emitted and it has no listeners
     */
    ignoreErrors?: boolean
}
export interface ListenerFn {
    (...values: any[]): void;
}
export interface EventAndListener {
    (event: string | string[], ...values: any[]): void;
}

export interface WaitForFilter { (...values: any[]): boolean }

export interface WaitForOptions {
    /**
     * @default 0
     */
    timeout: number,
    /**
     * @default null
     */
    filter: WaitForFilter,
    /**
     * @default false
     */
    handleError: boolean,
    /**
     * @default Promise
     */
    Promise: Function,
    /**
     * @default false
     */
    overload: boolean
}

export interface CancelablePromise<T> extends Promise<T>{
    cancel(reason: string): undefined
}

export interface OnceOptions {
    /**
     * @default 0
     */
    timeout: number,
    /**
     * @default Promise
     */
    Promise: Function,
    /**
     * @default false
     */
    overload: boolean
}

export interface ListenToOptions {
    on?: { (event: event | eventNS, handler: ListenerFn): void },
    off?: { (event: event | eventNS, handler: ListenerFn): void },
    reducers: Function | Object
}

export interface GeneralEventEmitter{
    addEventListener(event: event, handler: ListenerFn): this,
    removeEventListener(event: event, handler: ListenerFn): this,
    addListener?(event: event, handler: ListenerFn): this,
    removeListener?(event: event, handler: ListenerFn): this,
    on?(event: event, handler: ListenerFn): this,
    off?(event: event, handler: ListenerFn): this
}

export interface OnOptions {
    async?: boolean,
    promisify?: boolean,
    nextTick?: boolean,
    objectify?: boolean
}

export interface Listener {
    emitter: EventEmitter2;
    event: event|eventNS;
    listener: ListenerFn;
    off(): this;
}

export declare class EventEmitter2 {
    constructor(options?: ConstructorOptions)
    emit(event: event | eventNS, ...values: any[]): boolean;
    emitAsync(event: event | eventNS, ...values: any[]): Promise<any[]>;
    addListener(event: event | eventNS, listener: ListenerFn): this|Listener;
    on(event: event | eventNS, listener: ListenerFn, options?: boolean|OnOptions): this|Listener;
    prependListener(event: event | eventNS, listener: ListenerFn, options?: boolean|OnOptions): this|Listener;
    once(event: event | eventNS, listener: ListenerFn, options?: true|OnOptions): this|Listener;
    prependOnceListener(event: event | eventNS, listener: ListenerFn, options?: boolean|OnOptions): this|Listener;
    many(event: event | eventNS, timesToListen: number, listener: ListenerFn, options?: boolean|OnOptions): this|Listener;
    prependMany(event: event | eventNS, timesToListen: number, listener: ListenerFn, options?: boolean|OnOptions): this|Listener;
    onAny(listener: EventAndListener): this;
    prependAny(listener: EventAndListener): this;
    offAny(listener: ListenerFn): this;
    removeListener(event: event | eventNS, listener: ListenerFn): this;
    off(event: event | eventNS, listener: ListenerFn): this;
    removeAllListeners(event?: event | eventNS): this;
    setMaxListeners(n: number): void;
    getMaxListeners(): number;
    eventNames(nsAsArray?: boolean): (event|eventNS)[];
    listenerCount(event?: event | eventNS): number
    listeners(event?: event | eventNS): ListenerFn[]
    listenersAny(): ListenerFn[]
    waitFor(event: event | eventNS, timeout?: number): CancelablePromise<any[]>
    waitFor(event: event | eventNS, filter?: WaitForFilter): CancelablePromise<any[]>
    waitFor(event: event | eventNS, options?: WaitForOptions): CancelablePromise<any[]>
    listenTo(target: GeneralEventEmitter, events: event | eventNS, options?: ListenToOptions): this;
    listenTo(target: GeneralEventEmitter, events: event[], options?: ListenToOptions): this;
    listenTo(target: GeneralEventEmitter, events: Object, options?: ListenToOptions): this;
    stopListeningTo(target?: GeneralEventEmitter, event?: event | eventNS): Boolean;
    hasListeners(event?: String): Boolean
    static once(emitter: EventEmitter2, event: event | eventNS, options?: OnceOptions): CancelablePromise<any[]>;
    static defaultMaxListeners: number;
}

export default EventEmitter2;