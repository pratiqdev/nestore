/* eslint-disable no-use-before-define */
type FieldWithPossiblyUndefined<T, Key> = GetFieldType<Exclude<T, undefined>, Key>
  | Extract<T, undefined>

export type GetIndexedField<T, K> = K extends keyof T
  ? T[K]
  : K extends `${number}`
    ? '0' extends keyof T // tuples have string keys, return undefined if K is not in tuple
      ? undefined
      : number extends keyof T
        ? T[number]
        : undefined
    : undefined

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

export type NestoreEmit = {
  path:string;
  key:string;
  value:unknown;
}

export type NestoreListener = (data:NestoreEmit) => unknown;

export const RecurseActions = {
  GET: 'get',
  SET: 'set',
  RESET: 'reset'
} as const

export type RecurseActionTypes = typeof RecurseActions[keyof typeof RecurseActions]

export type NestoreListenerObject = {
  count: number;
  max: number;
  cb: (data: NestoreEmit) => unknown;
}

export type NestoreOptions = {
  delimiter: string;
  maxListeners: number;
}

export type RecurseConfig = {
  path: string;
  action: RecurseActionTypes;
  value?: unknown;
  foundPath?: string;
  foundKey?:string;
  foundVal?: unknown;
}
