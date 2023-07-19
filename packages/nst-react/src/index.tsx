import createStore from '@pratiq/nestore'

const createNestateHook = (initialStore: any) => {

    const nst = createStore()

    const useNestateHook = (path:string) => {
        return path
    }

    return useNestateHook
}

export default createNestateHook


// TODO - create an org on github to match the new nestate org on npm
// and publish this repo
