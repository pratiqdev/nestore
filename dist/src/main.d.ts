import { NestoreEmit, NestoreOptions, NestoreListener } from "./types.js";
declare class Nestore<T> {
    #private;
    constructor(initialStore?: Partial<T>, options?: NestoreOptions);
    get(path: string): unknown;
    set(path: string, value?: unknown): unknown;
    reset(path: string): this;
    addListener(path: string, listener: NestoreListener, max?: number): this;
    removeListener(path: string, listener: NestoreListener, max?: number): this;
    removeAllListeners(path: string): this;
    on(path: string, listener: NestoreListener, max?: number): this;
    off(path: string, listener: NestoreListener, max?: number): this;
    onAny(listener: NestoreListener): void;
    emitAll(): void;
    emit(data: NestoreEmit): this;
}
export default Nestore;
