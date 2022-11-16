/* eslint-disable */
import { GET, SET } from "./store.js";
import {
  NestoreEmit,
  NestoreListenerObject,
  NestoreOptions,
  NestoreListener,
} from "./types.js";
import { debug, colors } from "./utils.js";

const linerule = () => `-`.repeat(process.stdout.columns - 20)

//Short code
function matchRuleShort(str:string, rule:string) {
  var escapeRegex = (str:string) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  return new RegExp("^" + rule.split("*").map(escapeRegex).join(".*") + "$").test(str);
}

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
class Nestore<T> {
  #listeners: Map<string, NestoreListenerObject[]>;
  #anyListeners: ((data: NestoreEmit) => unknown)[];
  #store: Partial<T>;
  #originalStore: Partial<T>;
  #settings: NestoreOptions;

  constructor(
    initialStore: Partial<T> = {},
    options: NestoreOptions = nestoreDefaultSettings
  ) {
    const log = debug("init");
    log("Store:", initialStore);
    log("Options:", options);

    this.#store = { ...initialStore };
    this.#originalStore = { ...initialStore };
    this.#listeners = new Map();
    this.#anyListeners = [];
    this.#settings = Object.assign(nestoreDefaultSettings, options);
  }

  // &                                                                                             _
  get(path: string) {
    return GET(this.#store, path);
  }

  // &                                                                                             _
  set(path: string, value?: unknown) {
    this.emit({
      path,
      key: path.split(this.#settings.delimiter).pop() ?? "/",
      value,
    });
    return SET(this.#store, path, value);
    //+ emit a value for this path, or any path that starts with path:
    //+ set("person.address.apt")
    //+ on("person.address.*", () => { })
    //- have to find a way to match wildcards with regexp
    //- like "person.*" => "person.name", "person.age"
    //- or "list.*.key" => "list.0.key", "list.1.key", "list.2.key"
  }

  // &                                                                                             _
  reset(path: string) {
    return this;
  }

  // &                                                                                             _
  addListener(path: string, listener: NestoreListener, max = -1) {
    const log = debug("addListener");
    // check the listeners map to see if this path exists
    // if it already exists: push this listener to the array
    if (this.#listeners.has(path)) {
      log(`Path exists in listener map > pushing listener object`);
      let og = this.#listeners.get(path) as NestoreListenerObject[];
      og.push({
        cb: listener,
        count: 0,
        max,
      });
    }
    // if listeners map has no path, set as array of [listener]
    else {
      log(`Path does not exist in listener map > creating new path entry`);
      this.#listeners.set(path, [
        {
          cb: listener,
          count: 0,
          max,
        },
      ]);
    }

    log(`Listeners:`, this.#listeners);

    return this;
  }

  // &                                                                                             _
  removeListener(path: string, listener: NestoreListener, max = -1) {
    return this;
  }

  // &                                                                                             _
  removeAllListeners(path: string) {
    if (!path) {
      this.#anyListeners = [];
      this.#listeners = new Map();
    }
    return this;
  }

  // &                                                                                             _
  on(path: string, listener: NestoreListener, max = -1) {
    this.addListener(path, listener, max);
    return this;
  }

  // &                                                                                             _
  off(path: string, listener: NestoreListener, max = -1) {
    this.addListener(path, listener, max);
    return this;
  }

  // &                                                                                             _
  onAny(listener: NestoreListener) {
    this.#anyListeners.push(listener);
  }

  // &                                                                                             _
  emitAll() {}

  // &                                                                                             _
  emit(data: NestoreEmit) {
    const log = debug("emit");
    log(linerule())

    log(`Path: ${data.path}`);
    log(`Key: ${data.key}`);
    log(`Value: ${data.value}`);

    for (const listenerPath of this.#listeners.keys()) {
      log(`-----------\nComparing full path: \n"${listenerPath}"\n"${data.path}"\n`);
      let splitListPath = listenerPath.split(this.#settings.delimiter);
      let splitEmitPath = data.path.split(this.#settings.delimiter);
      let doubleWild = 0;
      

      if (
        splitEmitPath.every((item: string, idx: number) => {
          /** C - the custom path with wildcards attached to the cb */
          let cPath = splitListPath[idx]
          /** E - the path of the store item used in emit call */
          let ePath = item

          

          
          // if no double wildcard - and cPath undefined - no match
          if(typeof cPath === 'undefined'){
            // if there was a double wildcard > and it occured before the current index
            if (doubleWild && idx > doubleWild){
              log(`double wildcard used before index ${idx}`)
              return true;
            }
            log(colors.dim + `No item at index ${idx}`)
            return false
          }

          // if a double wildcard is used > save its index to approve anything after
          if (cPath === "**") {
            doubleWild = idx;
            log(`Double wildcard used at index ${idx}`)
            return true;
          } 
          
          // if a single wildcard is used > match only this idx
          if (cPath === "*") {
            log(`Single wildcard used at index ${idx}`)
            return true;
          } 
          
          // if exact match > return true
          if (ePath === cPath) {
            log(`Item matched at index ${idx}:`, cPath, ePath)
            return true;
          }

          if(splitListPath.length < splitEmitPath.length && !doubleWild){
            log(colors.RED + 'listPath longer than emitPath with no doublewild')
            return false
          }

          log(colors.red + `No match at index ${idx}:`, item, splitListPath[idx])
          return false;

        })
      ) {
        log(colors.green + 'C: ' + splitListPath)
        log(colors.GREEN + 'E: ' + splitEmitPath)
      }
    }

    //+ This method works for a path that exactly matches the supplied path
    //+ To loosely match paths > you must loop through each path in the map
    //+ using listeners.keys()
    // if the listener map has this path > get the array at path
    if (data?.path && this.#listeners.has(data.path)) {
      let listArr = this.#listeners.get(data.path) ?? [];
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
      this.#listeners.set(data.path, listArr);
    }
    //+ ---------------------------------------------------------------------

    return this;
  }
}

export default Nestore;
