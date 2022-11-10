(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('debug')) :
   typeof define === 'function' && define.amd ? define(['debug'], factory) :
   (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.nestore = factory(global.debug));
})(this, (function (debug) { 'use strict';

   function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

   var debug__default = /*#__PURE__*/_interopDefaultLegacy(debug);

   var _listeners, _anyListeners, _store, _originalStore, _settings;
   const LOG = (name) => debug__default["default"](`nestore:${name}`);
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
           _listeners.set(this, void 0);
           _anyListeners.set(this, void 0);
           _store.set(this, void 0);
           _originalStore.set(this, void 0);
           _settings.set(this, void 0);
           const log = LOG('init');
           log('Store:', initialStore);
           log('Options:', options);
           __classPrivateFieldSet(this, _store, Object.assign({}, initialStore));
           __classPrivateFieldSet(this, _originalStore, Object.assign({}, initialStore));
           __classPrivateFieldSet(this, _listeners, new Map());
           __classPrivateFieldSet(this, _anyListeners, []);
           __classPrivateFieldSet(this, _settings, Object.assign(nestoreDefaultSettings, options));
       }
       recurse(config) {
           const log = LOG('recurse');
           const EMIT = this.emit;
           const rec = this.recurse;
           __classPrivateFieldGet(this, _originalStore);
           __classPrivateFieldGet(this, _store);
           function RECURSE(obj, localConfig) {
               // eslint-disable-next-line
               Object.keys(obj).forEach((k) => {
                   var _a, _b, _c, _d, _e;
                   if (typeof obj[k] === 'object' && obj[k] !== null) {
                       log('Recursing in:', k);
                       localConfig.foundPath += ((_a = localConfig === null || localConfig === void 0 ? void 0 : localConfig.foundPath) === null || _a === void 0 ? void 0 : _a.length) ? `.${k}` : k;
                       RECURSE(obj[k], localConfig);
                   }
                   // some comment
                   else {
                       log('Found val at:', k);
                       localConfig.foundPath += ((_b = localConfig.foundPath) === null || _b === void 0 ? void 0 : _b.length) ? `.${k}` : k;
                       localConfig.foundKey = k;
                       localConfig.foundVal = obj[k];
                       switch (localConfig.action) {
                           case RecurseActions.SET:
                               {
                                   const emitObj = {
                                       path: (_c = localConfig.foundPath) !== null && _c !== void 0 ? _c : '',
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
                                   const originalValue = rec({ action: 'get', path: (_d = localConfig.foundPath) !== null && _d !== void 0 ? _d : '' });
                                   rec({ action: 'set', value: originalValue, path: (_e = localConfig.foundPath) !== null && _e !== void 0 ? _e : '' });
                               }
                               break;
                           default: return obj[k];
                       }
                   }
               });
           }
           RECURSE(__classPrivateFieldGet(this, _store), Object.assign(Object.assign({}, config), { foundPath: '', foundKey: '', foundVal: undefined }));
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
               __classPrivateFieldSet(this, _anyListeners, []);
               __classPrivateFieldSet(this, _listeners, new Map());
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
           __classPrivateFieldGet(this, _anyListeners).push(listener);
       }
       // &                                                                                             _
       emit(data) {
           return this;
       }
   }
   _listeners = new WeakMap(), _anyListeners = new WeakMap(), _store = new WeakMap(), _originalStore = new WeakMap(), _settings = new WeakMap();

   return Nestore;

}));
