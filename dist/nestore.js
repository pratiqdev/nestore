import debug from 'debug';

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
/* eslint-disable */

var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
var reIsPlainProp = /^\w*$/;
function isKey(value, object) {
  if (Array.isArray(value)) {
    return false;
  }
  var type = _typeof(value);
  if (type === 'number' || type === 'boolean' || value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
}
function memoize(func, resolver) {
  if (typeof func !== 'function' || resolver != null && typeof resolver !== 'function') {
    throw new TypeError('Expected a function');
  }
  var memoized = function memoized() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    var key = resolver ? resolver.apply(this, args) : args[0];
    var cache = memoized.cache;
    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || Map)();
  return memoized;
}
memoize.Cache = Map;
var MAX_MEMOIZE_SIZE = 500;
function memoizeCapped(func) {
  var result = memoize(func, function (key) {
    var cache = result.cache;
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });
  return result;
}
var charCodeOfDot = '.'.charCodeAt(0);
var reEscapeChar = /\\(\\)?/g;
var rePropName = RegExp(
// Match anything that isn't a dot or bracket.
'[^.[\\]]+' + '|' +
// Or match property names within brackets.
'\\[(?:' +
// Match a non-string expression.
'([^"\'][^[]*)' + '|' +
// Or match strings (supports escaping characters).
'(["\'])((?:(?!\\2)[^\\\\]|\\\\.)*?)\\2' + ')\\]' + '|' +
// Or match "" as the space between consecutive dots or empty brackets.
'(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|$))', 'g');
var stringToPath = memoizeCapped(function (string) {
  var result = [];
  if (string.charCodeAt(0) === charCodeOfDot) {
    result.push('');
  }
  string.replace(rePropName, function (match, expression, quote, subString) {
    var key = match;
    if (quote) {
      key = subString.replace(reEscapeChar, '$1');
    } else if (expression) {
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
var toStr = Object.prototype.toString;
function getTag(value) {
  if (value == null) {
    return value === undefined ? '[object Undefined]' : '[object Null]';
  }
  return toStr.call(value);
}
function isSymbol(value) {
  var type = _typeof(value);
  return type == 'symbol' || type === 'object' && value != null && getTag(value) == '[object Symbol]';
}

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

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
  var result = "".concat(value);
  return result == '0' && 1 / value == -INFINITY ? '-0' : result;
}
function baseGet(object, path) {
  path = castPath(path, object);
  var index = 0;
  var _path = path,
    length = _path.length;
  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return index && index == length ? object : undefined;
}
function GET(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
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
  } else {
    object[key] = value;
  }
}
function isObject(value) {
  var type = _typeof(value);
  return value != null && (type === 'object' || type === 'function');
}

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;
function isIndex(value, length) {
  var type = _typeof(value);
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length && (type === 'number' || type !== 'symbol' && reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
}
function eq(value, other) {
  return value === other || value !== value && other !== other;
}
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(Object.prototype.hasOwnProperty.call(object, key) && eq(objValue, value))) {
    if (value !== 0 || 1 / value === 1 / objValue) {
      baseAssignValue(object, key, value);
    }
  } else if (value === undefined && !(key in object)) {
    baseAssignValue(object, key, value);
  }
}
function baseSet(object, path, value, customizer) {
  if (!isObject(object)) {
    return object;
  }
  path = castPath(path, object);
  var length = path.length;
  var lastIndex = length - 1;
  var index = -1;
  var nested = object;
  while (nested != null && ++index < length) {
    var key = toKey(path[index]);
    var newValue = value;
    if (index != lastIndex) {
      var objValue = nested[key];
      newValue = customizer ? customizer(objValue, key, nested) : undefined;
      if (newValue === undefined) {
        newValue = isObject(objValue) ? objValue : isIndex(path[index + 1]) ? [] : {};
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

/* eslint-disable */
const LOG = (name) => debug(`nestore:${name}`);
// ~                                                                                               _
const nestoreDefaultSettings = {
    delimiter: '.',
    maxListeners: -1
};
// ~                                                                                               _
// ~                                                                                               _
class Nestore {
    #listeners;
    #anyListeners;
    #store;
    #originalStore;
    #settings;
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
    // recurse (config: RecurseConfig) {
    //   const log = LOG('recurse')
    //   const ref = null
    //   const EMIT = this.emit
    //   const rec = this.recurse
    //   const og = this.#originalStore
    //   const sto = this.#store
    //   function RECURSE (obj:Partial<T> | T[Extract<keyof T, string>], localConfig: RecurseConfig) {
    //     // eslint-disable-next-line
    //     Object.keys(obj as Record<string, unknown>).forEach((k) => {
    //       if (typeof obj[k] === 'object' && obj[k] !== null) {
    //         log('Recursing in:', k)
    //         localConfig.foundPath += localConfig?.foundPath?.length ? `.${k}` : k
    //         RECURSE(obj[k], localConfig)
    //       }
    //       // some comment
    //       else {
    //         log('Found val at:', k)
    //         localConfig.foundPath += localConfig.foundPath?.length ? `.${k}` : k
    //         localConfig.foundKey = k
    //         localConfig.foundVal = obj[k]
    //         switch (localConfig.action) {
    //           case RecurseActions.SET: {
    //             const emitObj = {
    //               path: localConfig.foundPath ?? '',
    //               key: k,
    //               value: config.value
    //             }
    //             // eslint-disable-next-line
    //             obj[k] = config.value
    //             EMIT(emitObj)
    //           } break
    //           case RecurseActions.RESET: {
    //             const originalValue = rec({ action: 'get', path: localConfig.foundPath ?? '' })
    //             rec({ action: 'set', value: originalValue, path: localConfig.foundPath ?? '' })
    //           } break
    //           default: return obj[k]
    //         }
    //       }
    //     })
    //   }
    //   RECURSE(this.#store, {
    //     ...config,
    //     foundPath: '',
    //     foundKey: '',
    //     foundVal: undefined
    //   })
    // }
    // getValueFromPath (path:string, obj:unknown = this.#store) {
    //   const log = LOG('getValueFromPath')
    //   let foundPath = ''
    //   function RECURSE (obj:Partial<T> | T[Extract<keyof T, string>], path?: string) {
    //     // eslint-disable-next-line
    //     Object.keys(obj as Record<string, unknown>).forEach((k) => {
    //       if (typeof obj[k] === 'object' && obj[k] !== null) {
    //         log('Recursing in:', k)
    //         foundPath += foundPath.length ? `.${k}` : k
    //         RECURSE(obj[k], path)
    //       }
    //       // some comment
    //       else {
    //         log('Found val at:', k)
    //         localConfig.foundPath += localConfig.foundPath?.length ? `.${k}` : k
    //         localConfig.foundKey = k
    //         localConfig.foundVal = obj[k]
    //       }
    //     })
    //   }
    //   RECURSE(obj, path)
    // }
    // // &                                                                                             _
    // setValue(
    //   path:string,
    //   value?: unknown
    // ){
    //   const log = LOG('set')
    //   function RECURSE (obj:Partial<T> | T[Extract<keyof T, string>], localConfig: RecurseConfig) {
    //     // eslint-disable-next-line
    //     Object.keys(obj as Record<string, unknown>).forEach((k) => {
    //       if (typeof obj[k] === 'object' && obj[k] !== null) {
    //         log('Recursing in:', k)
    //         localConfig.foundPath += localConfig?.foundPath?.length ? `.${k}` : k
    //         RECURSE(obj[k], localConfig)
    //       }
    //       // some comment
    //       else {
    //         log('Found val at:', k)
    //         localConfig.foundPath += localConfig.foundPath?.length ? `.${k}` : k
    //         localConfig.foundKey = k
    //         localConfig.foundVal = obj[k]
    //       }
    //     })
    //   }
    // }
    // // &                                                                                             _
    // getValue<
    //   TPath extends string,
    //   TDefault = GetFieldType<T, TPath>
    // >(
    //   path: TPath,
    //   defaultValue?: TDefault
    // ): GetFieldType<T, TPath> | TDefault {
    //   let data = this.#store
    //   const value = path
    //     .split(/[.[\]]/)
    //     .filter(Boolean)
    //     .reduce<GetFieldType<T, TPath>>(
    //       (value, key) => (value as any)?.[key],
    //       data as any
    //     );
    //   return value !== undefined ? value : (defaultValue as TDefault);
    // }
    // &                                                                                             _
    get(path) {
        return GET(this.#store, path);
    }
    // &                                                                                             _
    set(path, value) {
        return SET(this.#store, path, value);
    }
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
