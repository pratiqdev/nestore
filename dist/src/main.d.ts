declare type NestoreEmit = {
    path: string;
    key: string;
    value: unknown;
};
declare type NestoreListener = (data: NestoreEmit) => unknown;
declare type NestoreOptions = {
    delimiter?: string;
    maxListeners?: number;
};
declare class Nestore<T> {
    #private;
    constructor(initialStore?: Partial<T>, options?: NestoreOptions);
    get(path: string): any;
    set(path: string, value?: unknown): any;
    reset(path: string): this;
    addListener(path: string, listener: NestoreListener, max?: number): this;
    removeListener(path: string, listener: NestoreListener, max?: number): this;
    removeAllListeners(path: string): this;
    on(path: string, listener: NestoreListener, max?: number): this;
    off(path: string, listener: NestoreListener, max?: number): this;
    onAny(listener: NestoreListener): void;
    emit(data: NestoreEmit): this;
}
export default Nestore;
