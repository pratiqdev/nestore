import createStore from './nestore-dist/useNestore'
import { persistAdapter } from './nestore-dist/adapters'
import debug from 'debug'

const useNestore = createStore({
    hello: 'World!',
    count: 0,
    time: Date.now(),
    person: {
        name: 'John',
        age: 50,
    }
}, {
    adapter: persistAdapter('my-store-key')
})

export default useNestore