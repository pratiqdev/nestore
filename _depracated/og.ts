
function nestore () {
  const listeners = new Map()
  const listenerCount = 0
  const maxListeners = 10
  const store = {}
  const delimiter = '.'

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  UTILS

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  STORE

  const get = (path:string) => { /* */ }
  const set = (path:string, value?:unknown) => { /* */ }
  const reset = (path:string) => { /* */ }

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  EVENTS
  /**
   * Map paths to events Map
   * 'person.*' => [
   *      '-uuid' => () => {},
   *      '5/7-uuid' => () => {},
   *      '6/6-uuid' => () => {}, // will be removed
   * ]
   */

  const addListener = (path:string, cb:() => unknown, max = -1) => {
    // add
    const temp = listeners.get(path) ?? []
    temp.push({
      count: 0,
      max,
      cb
    })
    listeners.set(path, temp)
  }

  const removeListener = () => { /* */ }

  const emit = () => { /* */ }

  const onAnyEvent = () => { /* */ }
  const removeAllListeners = () => { /* */ }

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  RETURN
  return {
    get,
    set,
    reset,
    addListener,
    removeListener,
    on: addListener,
    onAny: onAnyEvent,
    off: removeListener,
    offAll: removeAllListeners,
    once: (path:string, cb: () => unknown) => addListener(path, cb, 1),
    emit,
    maxListeners,
    listenerCount,
    store,
    delimiter
  }
}
