Using typescript create a function named 'createNestore' that meets the following criteria:

- takes a single arguments: initialState (an object typed as a record with strings or numbers as keys, and unknown as values).
- creates and returns a proxy of the initialState, with types inferred from intialState, or provided by a type definition as `createNestore<CustomType>(initialState)`.
- the proxy contains the following methods:
  a. get: function that takes a single argument of a string for getting a value from the store by key/path and returns it.
  b. set: function that takes two arguments: a string representing the path of the key to set (like 'this.nested.object.path') and the second argument is the value to set.
  c. reset: function that takes no arguments and resets the store to the initialState.
  d. delete: function that takes a single argument of the path to the key to delete from the store.
  e. store: returns a reference to the store
