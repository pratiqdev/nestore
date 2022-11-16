import createStore from 'use-nestore'
// import persistAdapter from './nestore-dist/adapters/persistAdapter'
import debug from 'debug'
import axios from 'axios'

debug.enable('nestore:*')

const useNestore = createStore({
    hello: 'World!',
    count: 0,
    time: Date.now(),
    person: {
        name: 'John',
        age: 50,
    },
    setName: (nst:any, args:any) => nst && nst.set('person.name', args[0]),
    login: async (nst:any, args:any[]) => {
        const { data } = await axios.get('https://jsonplaceholder.typicode.com/todos')
        nst && nst.set('login_data', data)
    }
}, {
    // adapter: persistAdapter(window?.localStorage, 'my-store-key')
})

export default useNestore