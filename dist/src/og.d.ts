declare function nestore(): {
    get: (path: string) => void;
    set: (path: string, value?: unknown) => void;
    reset: (path: string) => void;
    addListener: (path: string, cb: () => unknown, max?: number) => void;
    removeListener: () => void;
    on: (path: string, cb: () => unknown, max?: number) => void;
    onAny: () => void;
    off: () => void;
    offAll: () => void;
    once: (path: string, cb: () => unknown) => void;
    emit: () => void;
    maxListeners: number;
    listenerCount: number;
    store: {};
    delimiter: string;
};
