
function nestore () {
  /**
 * Map paths to events Map
 * 'person.*' => [
 *      '-uuid' => () => {},
 *      '5/7-uuid' => () => {},
 *      '6/6-uuid' => () => {}, // will be removed
 * ]
 */
  const events = new Map()

  const addListener = (path:string, cb:() => unknown, count = -1) => {
    // add
    const temp = events.get(path) ?? []
    temp.push({
      count: 0,
      max: -1,
      cb
    })
    events.set(path, temp)
  }

  return {
    on: addListener,
    once: (path:string, cb: () => unknown) => addListener(path, cb, 1)
  }
}

export default nestore
