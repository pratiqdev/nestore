import debug from 'debug';

/* eslint-disable */
const LOG = (name) => debug(`nestore:${name}`);
const RecurseActions = {
    GET: 'get',
    SET: 'set',
    RESET: 'reset'
};
// ~                                                                                               _
const nestoreDefaultSettings = {
    delimiter: '.',
    maxListeners: -1
};
// ~                                                                                               _
// ~                                                                                               _
class Nestore {
    constructor(initialStore = {}, options = {}) {
        const log = LOG('init');
        log('Store:', initialStore);
        log('Options:', options);
        this.#store = { ...initialStore };
        this.#originalStore = { ...initialStore };
        this.#listeners = new Map();
        this.#anyListeners = [];
        this.#settings = Object.assign(nestoreDefaultSettings, options);
    }
    #listeners;
    #anyListeners;
    #store;
    #originalStore;
    #settings;
    recurse(config) {
        const log = LOG('recurse');
        const EMIT = this.emit;
        const rec = this.recurse;
        this.#originalStore;
        this.#store;
        function RECURSE(obj, localConfig) {
            // eslint-disable-next-line
            Object.keys(obj).forEach((k) => {
                if (typeof obj[k] === 'object' && obj[k] !== null) {
                    log('Recursing in:', k);
                    localConfig.foundPath += localConfig?.foundPath?.length ? `.${k}` : k;
                    RECURSE(obj[k], localConfig);
                }
                // some comment
                else {
                    log('Found val at:', k);
                    localConfig.foundPath += localConfig.foundPath?.length ? `.${k}` : k;
                    localConfig.foundKey = k;
                    localConfig.foundVal = obj[k];
                    switch (localConfig.action) {
                        case RecurseActions.SET:
                            {
                                const emitObj = {
                                    path: localConfig.foundPath ?? '',
                                    key: k,
                                    value: config.value
                                };
                                // eslint-disable-next-line
                                obj[k] = config.value;
                                EMIT(emitObj);
                            }
                            break;
                        case RecurseActions.RESET:
                            {
                                const originalValue = rec({ action: 'get', path: localConfig.foundPath ?? '' });
                                rec({ action: 'set', value: originalValue, path: localConfig.foundPath ?? '' });
                            }
                            break;
                        default: return obj[k];
                    }
                }
            });
        }
        RECURSE(this.#store, {
            ...config,
            foundPath: '',
            foundKey: '',
            foundVal: undefined
        });
    }
    // &                                                                                             _
    get(path) { return this; }
    // &                                                                                             _
    set(path, value) { return this; }
    // &                                                                                             _
    reset(path) { return this; }
    // &                                                                                             _
    addListener(path, listener, max = -1) { return this; }
    // &                                                                                             _
    removeListener(path, listener, max = -1) { return this; }
    // &                                                                                             _
    removeAllListeners(path) {
        if (!path) {
            this.#anyListeners = [];
            this.#listeners = new Map();
        }
        return this;
    }
    // &                                                                                             _
    on(path, listener, max = -1) {
        this.addListener(path, listener, max);
        return this;
    }
    // &                                                                                             _
    off(path, listener, max = -1) {
        this.addListener(path, listener, max);
        return this;
    }
    // &                                                                                             _
    onAny(listener) {
        this.#anyListeners.push(listener);
    }
    // &                                                                                             _
    emit(data) {
        return this;
    }
}

export { Nestore as default };
