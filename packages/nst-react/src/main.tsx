import { useMemo, useState } from 'react'
import createStore from '@pratiq/nestore'
import { BaseRecord, NestoreOptions, NestoreReturn, StoreInitializer } from '@pratiq/nestore-types'

type UseNestore = (path:string) => any;
type UseNestoreListener = (event: string | string[], ...values: any[]) => void;




const createNestateHook = <T extends BaseRecord, U extends T>(
    initialStore: T | StoreInitializer<T> = {} as T, 
    options: NestoreOptions = {}
): UseNestore => {

    const NST = createStore(initialStore, options) as NestoreReturn<T>


    //&                                                                                                                 
    const useNestateHook = (hookPath:string = '') => {

        
        const config = useMemo(() => ({
            /** Does this call to useStore() contain a path? */
            hasPath: typeof hookPath === 'string' && hookPath.length > 0,
            /** Does this path lead to a mutator function */
            hasMutator: typeof NST.get === 'function' ? typeof hookPath === 'string' && typeof NST[hookPath] === 'function' : null,
            /** Is this a root or null path */
            hasRoot: !hookPath || hookPath === '/',
            /** Previous value of this key */
            prevVal: typeof NST.get === 'function' ? typeof hookPath === 'string' && hookPath.length > 0 ? NST.get(hookPath) : NST.store : null
        }), [ hookPath, NST ])


        const [ value, setValue ] = useState(config.prevVal)


        const handleUpdateValue = (newValue: any) => {
            return config.hasPath
                ? NST.set(hookPath, newValue)
                : NST.set('/', () => newValue)
        }






        return [ value, handleUpdateValue ]
    }

    return useNestateHook
}

export default createNestateHook


// TODO - create an org on github to match the new nestate org on npm
// and publish this repo
