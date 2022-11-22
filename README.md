# nestore v2

Version 2 aims to reduce the footprint and remove dependencies while maintaining the core
functionality and performance of version 1.

Version 1 had two dependancies:
- lodash: to handle accessing and modifying the nested store object
- eventemitter2: to handle registering and emitting to nested / wildcard based listener callbacks

Version 2 will implement a singular method to recursively read from, update and emit events from deeply nested values within the store.


The `many` and `once` methods will be abandoned in favor of a unified `on` function that accepts anoptional third argument to limit callback events: 

```ts
on('this', () => { 
    // ... 
}, 3)
```