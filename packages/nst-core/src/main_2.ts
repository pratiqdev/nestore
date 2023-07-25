// export type MakeDataPropsOptional<T> = {
//     [K in keyof T]: {
//         [P in keyof T[K]]: Partial<T[K][P]> | undefined;
//     }
// };

export type ProxyObject<T> = {
    [K in keyof T]: T[K] extends Record<string | number, unknown>
    ? ProxyObject<T[K]>
    : T[K];
};

// When initialState is an object
function createStore<T extends Object>(
    initialState: T
): ProxyObject<T> & Record<string | number, any>;

// When initialState is a function
function createStore<T extends Object>(
    initialState: (self: T) => T
): ProxyObject<T> & Record<string | number, any>;

// Implementation
function createStore<T extends Object>(
    initialState: T | ((self: T) => T)
): ProxyObject<T> & Record<string | number, any> {
    let handlers = {}
    let state: T = {} as T
    let proxy: T = new Proxy(state, handlers) as T

    if (typeof initialState === 'function') {
        const func = initialState as (self: T) => T;
        state = func(proxy);
    } else {
        state = initialState as T;
    }

    proxy = new Proxy(state, handlers) as T
    return proxy
}

type Store = {
    greetings: string;
    location: string;
    ayo: () => string;
}

// the createStore function should return a properly typed object and self
// without defining and passing the Store type here
const nst2 = createStore<Store>((self) => ({
    greetings: 'hello',
    location: 'world',
    ayo: () => self.greetings + ', ' + self.location
}))

nst2.greetings
nst2.ayo()


const nst1 = createStore({
    greetings: 'hello'
})

nst1.greetings = 'ayo'
nst1.ayo = 'greetings'