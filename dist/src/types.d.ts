export declare type NestoreEmit = {
    path: string;
    key: string;
    value: unknown;
};
export declare type NestoreListener = (data: NestoreEmit) => unknown;
export declare const RecurseActions: {
    readonly GET: "get";
    readonly SET: "set";
    readonly RESET: "reset";
};
export declare type RecurseActionTypes = typeof RecurseActions[keyof typeof RecurseActions];
export declare type NestoreListenerObject = {
    count: number;
    max: number;
    cb: (data: NestoreEmit) => unknown;
};
export declare type NestoreOptions = {
    delimiter: string;
    maxListeners: number;
};
export declare type RecurseConfig = {
    path: string;
    action: RecurseActionTypes;
    value?: unknown;
    foundPath?: string;
    foundKey?: string;
    foundVal?: unknown;
};
