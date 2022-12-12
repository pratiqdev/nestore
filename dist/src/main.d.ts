// /* eslint-disable no-use-before-define */
//&                                                                                                 
type FieldWithPossiblyUndefined<T, Key> = GetFieldType<Exclude<T, undefined>, Key>
  | Extract<T, undefined>

//&                                                                                                 
export type GetIndexedField<T, K> = K extends keyof T
  ? T[K]
  : K extends `${number}`
    ? '0' extends keyof T // tuples have string keys, return undefined if K is not in tuple
      ? undefined
      : number extends keyof T
        ? T[number]
        : undefined
    : undefined

//&                                                                                                 
export type GetFieldType<T, P> = P extends `${infer Left}.${infer Right}`
  ? Left extends keyof T
    ? FieldWithPossiblyUndefined<T[Left], Right>
    : Left extends `${infer FieldKey}[${infer IndexKey}]`
      ? FieldKey extends keyof T
        ? FieldWithPossiblyUndefined<GetIndexedField<Exclude<T[FieldKey], undefined>, IndexKey>
          | Extract<T[FieldKey], undefined>, Right>
        : undefined
      : undefined
  : P extends keyof T
    ? T[P]
    : P extends `${infer FieldKey}[${infer IndexKey}]`
      ? FieldKey extends keyof T
        ? GetIndexedField<Exclude<T[FieldKey], undefined>, IndexKey>
          | Extract<T[FieldKey], undefined>
        : undefined
      : undefined



//&                                                                                                 
export declare type NestoreEmit = {
    path: string;
    key: string;
    value: unknown;
};
//&                                                                                                 
export declare type NestoreListener = (data: NestoreEmit) => unknown;
//&                                                                                                 
export declare const RecurseActions: {
    readonly GET: "get";
    readonly SET: "set";
    readonly RESET: "reset";
};
//&                                                                                                 
export declare type RecurseActionTypes = typeof RecurseActions[keyof typeof RecurseActions];
//&                                                                                                 
export declare type NestoreListenerObject = {
    count: number;
    max: number;
    cb: (data: NestoreEmit) => unknown;
};
//&                                                                                                 
export declare type NestoreOptions = {
    delimiter?: string;
    maxListeners?: number;
};
//&                                                                                                 
export declare type NestoreOptionsInternal = {
    delimiter: string;
    maxListeners: number;
};
//&                                                                                                 
export declare type RecurseConfig = {
    path: string;
    action: RecurseActionTypes;
    value?: unknown;
    foundPath?: string;
    foundKey?: string;
    foundVal?: unknown;
};
//&                                                                                                 
declare class Nestore<T> {
    #private;
    constructor(initialStore?: T | Partial<T>, options?: NestoreOptions);
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
    offAll(): void;
    emit(data: NestoreEmit): this;
    get store(): Partial<T>;
    get maxListeners(): number;
    get delimiter(): string;
    get listeners(): (((data: NestoreEmit) => unknown) | [string, NestoreListenerObject[]])[];
    get settings(): NestoreOptionsInternal;
    get originalStore(): Partial<T>;
}
export default Nestore;
