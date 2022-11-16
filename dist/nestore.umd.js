(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('debug')) :
    typeof define === 'function' && define.amd ? define(['debug'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.nestore = factory(global.createDebug));
})(this, (function (createDebug) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var createDebug__default = /*#__PURE__*/_interopDefaultLegacy(createDebug);

    function __classPrivateFieldGet(receiver, state, kind, f) {
      if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
      return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    }
    function __classPrivateFieldSet(receiver, state, value, kind, f) {
      if (kind === "m") throw new TypeError("Private method is not writable");
      if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
      return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
    }

    /* eslint-disable */
    //@ts-nocheck
    const reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
    const reIsPlainProp = /^\w*$/;
    function isKey(value, object) {
        if (Array.isArray(value)) {
            return false;
        }
        const type = typeof value;
        if (type === 'number' || type === 'boolean' || value == null || isSymbol(value)) {
            return true;
        }
        return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
            (object != null && value in Object(object));
    }
    function memoize(func, resolver) {
        if (typeof func !== 'function' || (resolver != null && typeof resolver !== 'function')) {
            throw new TypeError('Expected a function');
        }
        const memoized = function (...args) {
            const key = resolver ? resolver.apply(this, args) : args[0];
            const cache = memoized.cache;
            if (cache.has(key)) {
                return cache.get(key);
            }
            const result = func.apply(this, args);
            memoized.cache = cache.set(key, result) || cache;
            return result;
        };
        memoized.cache = new (memoize.Cache || Map);
        return memoized;
    }
    memoize.Cache = Map;
    const MAX_MEMOIZE_SIZE = 500;
    function memoizeCapped(func) {
        const result = memoize(func, (key) => {
            const { cache } = result;
            if (cache.size === MAX_MEMOIZE_SIZE) {
                cache.clear();
            }
            return key;
        });
        return result;
    }
    const charCodeOfDot = '.'.charCodeAt(0);
    const reEscapeChar = /\\(\\)?/g;
    const rePropName = RegExp(
    // Match anything that isn't a dot or bracket.
    '[^.[\\]]+' + '|' +
        // Or match property names within brackets.
        '\\[(?:' +
        // Match a non-string expression.
        '([^"\'][^[]*)' + '|' +
        // Or match strings (supports escaping characters).
        '(["\'])((?:(?!\\2)[^\\\\]|\\\\.)*?)\\2' +
        ')\\]' + '|' +
        // Or match "" as the space between consecutive dots or empty brackets.
        '(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|$))', 'g');
    const stringToPath = memoizeCapped((string) => {
        const result = [];
        if (string.charCodeAt(0) === charCodeOfDot) {
            result.push('');
        }
        string.replace(rePropName, (match, expression, quote, subString) => {
            let key = match;
            if (quote) {
                key = subString.replace(reEscapeChar, '$1');
            }
            else if (expression) {
                key = expression.trim();
            }
            result.push(key);
        });
        return result;
    });
    function castPath(value, object) {
        if (Array.isArray(value)) {
            return value;
        }
        return isKey(value, object) ? [value] : stringToPath(value);
    }
    const toStr = Object.prototype.toString;
    function getTag(value) {
        if (value == null) {
            return value === undefined ? '[object Undefined]' : '[object Null]';
        }
        return toStr.call(value);
    }
    function isSymbol(value) {
        const type = typeof value;
        return type == 'symbol' || (type === 'object' && value != null && getTag(value) == '[object Symbol]');
    }
    /** Used as references for various `Number` constants. */
    const INFINITY = 1 / 0;
    /**
     * Converts `value` to a string key if it's not a string or symbol.
     *
     * @private
     * @param {*} value The value to inspect.
     * @returns {string|symbol} Returns the key.
     */
    function toKey(value) {
        if (typeof value === 'string' || isSymbol(value)) {
            return value;
        }
        const result = `${value}`;
        return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
    }
    function baseGet(object, path) {
        path = castPath(path, object);
        let index = 0;
        const { length } = path;
        while (object != null && index < length) {
            object = object[toKey(path[index++])];
        }
        return (index && index == length) ? object : undefined;
    }
    function GET(object, path, defaultValue) {
        const result = object == null ? undefined : baseGet(object, path);
        return result === undefined ? defaultValue : result;
    }
    //~                                                                                   
    //~                                                                                   
    //~                                                                                   
    function baseAssignValue(object, key, value) {
        if (key == '__proto__') {
            Object.defineProperty(object, key, {
                'configurable': true,
                'enumerable': true,
                'value': value,
                'writable': true
            });
        }
        else {
            object[key] = value;
        }
    }
    function isObject(value) {
        const type = typeof value;
        return value != null && (type === 'object' || type === 'function');
    }
    /** Used as references for various `Number` constants. */
    const MAX_SAFE_INTEGER = 9007199254740991;
    /** Used to detect unsigned integer values. */
    const reIsUint = /^(?:0|[1-9]\d*)$/;
    function isIndex(value, length) {
        const type = typeof value;
        length = length == null ? MAX_SAFE_INTEGER : length;
        return !!length &&
            (type === 'number' ||
                (type !== 'symbol' && reIsUint.test(value))) &&
            (value > -1 && value % 1 == 0 && value < length);
    }
    function eq(value, other) {
        return value === other || (value !== value && other !== other);
    }
    function assignValue(object, key, value) {
        const objValue = object[key];
        if (!(Object.prototype.hasOwnProperty.call(object, key) && eq(objValue, value))) {
            if (value !== 0 || (1 / value) === (1 / objValue)) {
                baseAssignValue(object, key, value);
            }
        }
        else if (value === undefined && !(key in object)) {
            baseAssignValue(object, key, value);
        }
    }
    function baseSet(object, path, value, customizer) {
        if (!isObject(object)) {
            return object;
        }
        path = castPath(path, object);
        const length = path.length;
        const lastIndex = length - 1;
        let index = -1;
        let nested = object;
        while (nested != null && ++index < length) {
            const key = toKey(path[index]);
            let newValue = value;
            if (index != lastIndex) {
                const objValue = nested[key];
                newValue = customizer ? customizer(objValue, key, nested) : undefined;
                if (newValue === undefined) {
                    newValue = isObject(objValue)
                        ? objValue
                        : (isIndex(path[index + 1]) ? [] : {});
                }
            }
            assignValue(nested, key, newValue);
            nested = nested[key];
        }
        return object;
    }
    function SET(object, path, value) {
        return object == null ? object : baseSet(object, path, value);
    }

    const debug = (name) => createDebug__default["default"](`NST:${name}`);
    const colors = {
        reset: '\x1b[0m',
        bright: '\x1b[1m',
        dim: '\x1b[2m',
        underscore: '\x1b[4m',
        red: '\x1b[31m',
        green: '\x1b[32m',
        yellow: '\x1b[33m',
        blue: '\x1b[34m',
        magenta: '\x1b[35m',
        cyan: '\x1b[36m',
        white: '\x1b[37m',
        grey: '\x1b[2m',
        RED: '\x1b[31m\x1b[1m',
        GREEN: '\x1b[32m\x1b[1m',
        YELLOW: '\x1b[33m\x1b[1m',
        BLUE: '\x1b[34m\x1b[1m',
        MAGENTA: '\x1b[35m\x1b[1m',
        CYAN: '\x1b[36m\x1b[1m',
        WHITE: '\x1b[37m\x1b[1m',
        GREY: '\x1b[2m\x1b[1m'
    };

    var _Nestore_listeners, _Nestore_anyListeners, _Nestore_store, _Nestore_originalStore, _Nestore_settings;
    const linerule = () => `-`.repeat(process.stdout.columns - 20);
    // //Explanation code
    // function matchRuleExpl(str, rule) {
    //   // for this solution to work on any string, no matter what characters it has
    //   var escapeRegex = (str) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    //   // "."  => Find a single character, except newline or line terminator
    //   // ".*" => Matches any string that contains zero or more characters
    //   rule = rule.split("*").map(escapeRegex).join(".*");
    //   // "^"  => Matches any string with the following at the beginning of it
    //   // "$"  => Matches any string with that in front at the end of it
    //   rule = "^" + rule + "$"
    //   //Create a regular expression object for matching string
    //   var regex = new RegExp(rule);
    //   //Returns true if it finds a match, otherwise it returns false
    //   return regex.test(str);
    // }
    // ~                                                                                               _
    const nestoreDefaultSettings = {
        delimiter: ".",
        maxListeners: -1,
    };
    // ~                                                                                               _
    // ~                                                                                               _
    class Nestore {
        constructor(initialStore = {}, options = nestoreDefaultSettings) {
            _Nestore_listeners.set(this, void 0);
            _Nestore_anyListeners.set(this, void 0);
            _Nestore_store.set(this, void 0);
            _Nestore_originalStore.set(this, void 0);
            _Nestore_settings.set(this, void 0);
            const log = debug("init");
            log("Store:", initialStore);
            log("Options:", options);
            __classPrivateFieldSet(this, _Nestore_store, Object.assign({}, initialStore), "f");
            __classPrivateFieldSet(this, _Nestore_originalStore, Object.assign({}, initialStore), "f");
            __classPrivateFieldSet(this, _Nestore_listeners, new Map(), "f");
            __classPrivateFieldSet(this, _Nestore_anyListeners, [], "f");
            __classPrivateFieldSet(this, _Nestore_settings, Object.assign(nestoreDefaultSettings, options), "f");
        }
        // &                                                                                             _
        get(path) {
            return GET(__classPrivateFieldGet(this, _Nestore_store, "f"), path);
        }
        // &                                                                                             _
        set(path, value) {
            var _a;
            this.emit({
                path,
                key: (_a = path.split(__classPrivateFieldGet(this, _Nestore_settings, "f").delimiter).pop()) !== null && _a !== void 0 ? _a : "/",
                value,
            });
            return SET(__classPrivateFieldGet(this, _Nestore_store, "f"), path, value);
            //+ emit a value for this path, or any path that starts with path:
            //+ set("person.address.apt")
            //+ on("person.address.*", () => { })
            //- have to find a way to match wildcards with regexp
            //- like "person.*" => "person.name", "person.age"
            //- or "list.*.key" => "list.0.key", "list.1.key", "list.2.key"
        }
        // &                                                                                             _
        reset(path) {
            return this;
        }
        // &                                                                                             _
        addListener(path, listener, max = -1) {
            const log = debug("addListener");
            // check the listeners map to see if this path exists
            // if it already exists: push this listener to the array
            if (__classPrivateFieldGet(this, _Nestore_listeners, "f").has(path)) {
                log(`Path exists in listener map > pushing listener object`);
                let og = __classPrivateFieldGet(this, _Nestore_listeners, "f").get(path);
                og.push({
                    cb: listener,
                    count: 0,
                    max,
                });
            }
            // if listeners map has no path, set as array of [listener]
            else {
                log(`Path does not exist in listener map > creating new path entry`);
                __classPrivateFieldGet(this, _Nestore_listeners, "f").set(path, [
                    {
                        cb: listener,
                        count: 0,
                        max,
                    },
                ]);
            }
            log(`Listeners:`, __classPrivateFieldGet(this, _Nestore_listeners, "f"));
            return this;
        }
        // &                                                                                             _
        removeListener(path, listener, max = -1) {
            return this;
        }
        // &                                                                                             _
        removeAllListeners(path) {
            if (!path) {
                __classPrivateFieldSet(this, _Nestore_anyListeners, [], "f");
                __classPrivateFieldSet(this, _Nestore_listeners, new Map(), "f");
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
            __classPrivateFieldGet(this, _Nestore_anyListeners, "f").push(listener);
        }
        // &                                                                                             _
        emitAll() { }
        // &                                                                                             _
        emit(data) {
            var _a;
            const log = debug("emit");
            log(linerule());
            log(`Path: ${data.path}`);
            log(`Key: ${data.key}`);
            log(`Value: ${data.value}`);
            for (const listenerPath of __classPrivateFieldGet(this, _Nestore_listeners, "f").keys()) {
                log(`-----------\nComparing full path: \n"${listenerPath}"\n"${data.path}"\n`);
                let splitListPath = listenerPath.split(__classPrivateFieldGet(this, _Nestore_settings, "f").delimiter);
                let splitEmitPath = data.path.split(__classPrivateFieldGet(this, _Nestore_settings, "f").delimiter);
                let doubleWild = 0;
                if (splitEmitPath.every((item, idx) => {
                    /** C - the custom path with wildcards attached to the cb */
                    let cPath = splitListPath[idx];
                    /** E - the path of the store item used in emit call */
                    let ePath = item;
                    // if no double wildcard - and cPath undefined - no match
                    if (typeof cPath === 'undefined') {
                        // if there was a double wildcard > and it occured before the current index
                        if (doubleWild && idx > doubleWild) {
                            log(`double wildcard used before index ${idx}`);
                            return true;
                        }
                        log(colors.dim + `No item at index ${idx}`);
                        return false;
                    }
                    // if a double wildcard is used > save its index to approve anything after
                    if (cPath === "**") {
                        doubleWild = idx;
                        log(`Double wildcard used at index ${idx}`);
                        return true;
                    }
                    // if a single wildcard is used > match only this idx
                    if (cPath === "*") {
                        log(`Single wildcard used at index ${idx}`);
                        return true;
                    }
                    // if exact match > return true
                    if (ePath === cPath) {
                        log(`Item matched at index ${idx}:`, cPath, ePath);
                        return true;
                    }
                    if (splitListPath.length < splitEmitPath.length && !doubleWild) {
                        log(colors.RED + 'listPath longer than emitPath with no doublewild');
                        return false;
                    }
                    log(colors.red + `No match at index ${idx}:`, item, splitListPath[idx]);
                    return false;
                })) {
                    log(colors.green + 'C: ' + splitListPath);
                    log(colors.GREEN + 'E: ' + splitEmitPath);
                }
            }
            //+ This method works for a path that exactly matches the supplied path
            //+ To loosely match paths > you must loop through each path in the map
            //+ using listeners.keys()
            // if the listener map has this path > get the array at path
            if ((data === null || data === void 0 ? void 0 : data.path) && __classPrivateFieldGet(this, _Nestore_listeners, "f").has(data.path)) {
                let listArr = (_a = __classPrivateFieldGet(this, _Nestore_listeners, "f").get(data.path)) !== null && _a !== void 0 ? _a : [];
                // for each listener object > increment count if used and call cb
                // create a new listener object array with all listObj that should be re-used
                listArr = listArr.filter((listObj) => {
                    if (listObj.max > 0) {
                        listObj.count++;
                    }
                    listObj.cb(data);
                    if (listObj.count < listObj.max) {
                        return listObj;
                    }
                });
                // overwrite the old listeners object array with the new one
                __classPrivateFieldGet(this, _Nestore_listeners, "f").set(data.path, listArr);
            }
            //+ ---------------------------------------------------------------------
            return this;
        }
    }
    _Nestore_listeners = new WeakMap(), _Nestore_anyListeners = new WeakMap(), _Nestore_store = new WeakMap(), _Nestore_originalStore = new WeakMap(), _Nestore_settings = new WeakMap();

    return Nestore;

}));
