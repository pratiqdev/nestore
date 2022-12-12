/* eslint-disable */

import Nestore from '../../dist/nestore.js'
import { expect, match, matchStringified, colors, h1 } from './utils.js'


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

describe(h1('1 | BASICS'), ()=>{

    it('The package provides a default export => a function named Nestore', () => {
        match(typeof Nestore, 'function')
        match(Nestore.name, 'Nestore')
    })
    
    
    requiredMethods.forEach((method) => {
        const NST = new Nestore()
        it(`Provides required method: "${method}"`, () => {
            expect(typeof NST[method]).to.eq('function')
        })
    })
    
    
    requiredProperties.forEach((prop) => {
        const NST =  new Nestore()
        it(`Provides required property: "${prop}"`, () => {
            expect(typeof NST[prop]).to.not.eq('undefined')
        })
    })

    it('Creates an empty store with no arguments', () => {
        const NST = new Nestore()
        matchStringified(NST.store, {})
    })

})
