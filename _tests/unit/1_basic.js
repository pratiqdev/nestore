import Nestore from '../../dist/nestore.js'
import {expect} from 'chai'

const match = (a,b) => expect(a).to.eq(b)

const colors = {
    reset:"\x1b[0m",
    bright:"\x1b[1m",
    dim:"\x1b[2m",
    underscore:"\x1b[4m",

    red:"\x1b[31m",
    green:"\x1b[32m",
    yellow:"\x1b[33m",
    blue:"\x1b[34m",
    magenta:"\x1b[35m",
    cyan:"\x1b[36m",
    white:"\x1b[37m",
    grey:"\x1b[2m",

    RED:"\x1b[31m\x1b[1m",
    GREEN:"\x1b[32m\x1b[1m",
    YELLOW:"\x1b[33m\x1b[1m",
    BLUE:"\x1b[34m\x1b[1m",
    MAGENTA:"\x1b[35m\x1b[1m",
    CYAN:"\x1b[36m\x1b[1m",
    WHITE:"\x1b[37m\x1b[1m",
    GREY:"\x1b[2m\x1b[1m",
}

const h1 = (val) => {
    return colors.BLUE + val + '\n  ' + colors.reset + colors.dim + '-'.repeat(process.stdout.columns - 8)
}

const requiredMethods = [
    // store
    'get',
    'set',
    'reset',

    // events
    'on',       // addEventListener
    'off',      // removeEventListener
    'onAny',
    'emit', 
    'offAll',   // removeAllListeners(optional_path)
]

const requiredProperties = [
    'store',
    'maxListeners',
    'delimiter'
]

describe(h1('1 | Basics'), ()=>{

    it('The package provides a default export', () => {
        expect(typeof Nestore).to.not.eq('undefined')
    })

    it('The default export is a function named Nestore', () => {
        match(typeof Nestore, 'function')
        match(Nestore.name, 'Nestore')
    })

    
    requiredMethods.forEach((method) => {
        const NST = new Nestore()
        it(`Nestore provides required method: "${method}"`, () => {
            expect(typeof NST[method]).to.eq('function')
        })
    })
    
    
    requiredProperties.forEach((prop) => {
        const NST =  new Nestore()
        it(`Nestore provides required property: "${prop}"`, () => {
            expect(typeof NST[prop]).to.not.eq('undefined')
        })
    })


    


})


describe.only(h1('X | Recurse Test'), () => {

    it('recurses?', () => {
        const NST = new Nestore({
            woah: 'yeah',
            how: {
                nested: {
                    can: 'you get!?'
                }
            }
        })

        NST.recurse()
    })
})