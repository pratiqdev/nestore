---
sidebar_position: 1
sidebar_label: Introduction
---

# Introduction to Nestore

## Development

ALPHA VERSION <code>0.0.47</code>

This project has served as the starting point / testing-base for nestore (alpha).

A new project will be created to develop, test, release and publish separate semantic versions for
each new feature. The client-side framework connectors will be provided as separate packages.

### Timeline

#### <code>0.1.0</code>

- Simple function that takes an `initialState` object and returns a proxy to that object.
- The proxy contains the methods:
  - get: get a value at the provided path
  - set: set a value at the provided path
  - reset: reset the store to its initial state
  - delete: delete a key from the store
  - store: a direct reference to the state of the store

#### <code>0.2.0</code>

- add support for events with wildcards and double wildcards for nested routes
- the event interface should have the following core methods:
  - addListener('path', cb, -1)
  - removeListener('path', cb)
  - removeAllListeners('path' | undefined)
  - onAny(cb) => addListener('\*', cb)
  - offAny(cb) => removeListener('\*', cb)
  - once('path', cb) => addListener('path', cb, 1)
  - many('path', cb, 3) => addListener('path', cb, 3)

#### <code>0.1.x</code>

- Simple event based store (get, set, addListener, removeListener)
- setter function interop `set(s => ({ ...s, new: 'value' }))  --> emitAll()`

> ? is it possible to create a keymap of the old store, merge it with the keymap of the new store  
> and emit the new values for all keys (undefined for removed keys)

#### <code>0.2.x</code>

- add support for wildcard paths and double wildcards (for nested paths)

#### <code>0.2.x</code>

- manual type defs / automatic type inference

#### <code>0.2.x</code>

- Redux-DevTools interop

#### <code>0.3.x</code>

- In store mutator functions

#### <code>0.4.x</code>

- In store listener functions

#### <code>0.5.x</code>

- In store mutator functions

#### <code>0.6.x</code>

- Add middleware registration / usage

#### <code>0.7.x</code>

- Add adapter registration / usage

#### <code>0.8.x</code>

- Add front-end framework connectors (possibly as separate packages)

---

### Concerns

- How can `get('a.**.b')` be used to return multiple items that match the pattern? (via middleware)
- Setter functions will only emit events for the new keys in the store - not any values that no longer exist
- Getter functions are unnecessary (can use nst.get() to get entire store - same execution time) but should still be supported

```ts
const thing1 = nst.get((s) => s.thing1);
const thing2 = nst.get().thing2;
```

---

### Goals

- Create a single monorepo structure with `pnpm-workspaces`
- Create `umd` package for use in node/browsers using `swc`
- Use git tags on development/release-candidate branches
- Use GitHub actions for automatic testing / releases / publishing to npm
- Store creation should be synchronous (no waiting for adapter registration via `nst = await nestore()`)
- Extend JSDoc comments for eventemitter2 methods
- pass a new `set` func to in store mutators/listeners (like zustand) that always returns reference to nst (pre-typed)

```ts
const nst = nestore((NST) => ({
  logged_id: false,

  logIn: (username, password) => {
    NST.set("logged_in", true);
  },
}));
```

---

## FAQ

### What is this?

Nestore is state-management solution that uses event emitters and listeners to read from, write to
and listen to the store - a plain old javascript object - inside of the nestore object.

Much of the functionality and API is inspired, or _haunted_, by other similar state management solutions, like
`valtio`, `jotai`, `redux` and `zustand` - with `valtio` being the most similar. See the
**[full comparison](/docs/api/meta/comparison)** for more details.

### Why would you?

This project originally started as a simple key-value store that extended the base event emitter
to trigger UI updates within a Node.js CLI tool and centralize state logic. It quickly grew into
a research experiment into the inner-workings of common state management solutions

### Should I use this?

The are many other state-management solutions that likely contain the features that will satisfy the
requirements of any project - as well as being more mature, well-tested and backed by large communities
of developers and users.

Check out the **[full comparison](/docs/api/meta/comparison)** to see if this is the right choice for your project.
