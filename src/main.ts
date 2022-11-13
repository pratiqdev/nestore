/* eslint-disable */
import debug from 'debug'
import { GetFieldType } from './types';
import { GET, SET } from './lodashUtils.js'

const LOG = (name:string) => debug(`nestore:${name}`)


type NestoreEmit = {
  path:string;
  key:string;
  value:unknown;
}

type NestoreListener = (data:NestoreEmit) => unknown;

const RecurseActions = {
  GET: 'get',
  SET: 'set',
  RESET: 'reset'
} as const

type RecurseActionTypes = typeof RecurseActions[keyof typeof RecurseActions]

type NestoreListenerObject = {
  count: number;
  max: number;
  cb: (data: NestoreEmit) => unknown;
}

type NestoreOptions = {
  delimiter?: string;
  maxListeners?: number;
}

type RecurseConfig = {
  path: string;
  action: RecurseActionTypes;
  value?: unknown;
  foundPath?: string;
  foundKey?:string;
  foundVal?: unknown;
}

// ~                                                                                               _

const nestoreDefaultSettings = {
  delimiter: '.',
  maxListeners: -1
}

// ~                                                                                               _
// ~                                                                                               _
class Nestore <T> {
  #listeners: Map<string, NestoreListenerObject>
  #anyListeners: ((data: NestoreEmit) => unknown)[]
  #store: Partial<T>
  #originalStore: Partial<T>
  #settings: NestoreOptions

  constructor (initialStore:Partial<T> = {}, options: NestoreOptions = {}) {
    const log = LOG('init')
    log('Store:', initialStore)
    log('Options:', options)

    this.#store = { ...initialStore }
    this.#originalStore = { ...initialStore }
    this.#listeners = new Map()
    this.#anyListeners = []
    this.#settings = Object.assign(nestoreDefaultSettings, options)
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
  get (path:string) { 
    return GET(this.#store, path)
  }

  // &                                                                                             _
  set (path:string, value?:unknown) { 
    return SET(this.#store, path, value)
    //+ emit a value for this path, or any path that starts with path:
    //+ set("person.address.apt")
    //+ on("person.address.*", () => { })
    //- have to find a way to match wildcards with regexp
    //- like "person.*" => "person.name", "person.age"
    //- or "list.*.key" => "list.0.key", "list.1.key", "list.2.key"
  }

  // &                                                                                             _
  reset (path:string) { return this }

  // &                                                                                             _
  addListener (path:string, listener: NestoreListener, max = -1) { return this }

  // &                                                                                             _
  removeListener (path:string, listener: NestoreListener, max = -1) { return this }

  // &                                                                                             _
  removeAllListeners (path:string) {
    if (!path) {
      this.#anyListeners = []
      this.#listeners = new Map()
    }
    return this
  }

  // &                                                                                             _
  on (path:string, listener: NestoreListener, max = -1) {
    this.addListener(path, listener, max)
    return this
  }

  // &                                                                                             _
  off (path:string, listener: NestoreListener, max = -1) {
    this.addListener(path, listener, max)
    return this
  }

  // &                                                                                             _
  onAny (listener: NestoreListener) {
    this.#anyListeners.push(listener)
  }

  // &                                                                                             _
  emit (data: NestoreEmit) {
    return this
  }
}

export default Nestore
