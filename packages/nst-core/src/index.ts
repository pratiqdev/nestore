
const createNestore = (initialStore:any, options:any) => {
    
    const nst = new Proxy(initialStore, {
        get: (target: any, prop: any) => {

        }
    })
}

export default createNestore