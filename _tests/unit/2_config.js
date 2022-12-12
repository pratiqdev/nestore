/* eslint-disable */

import Nestore from '../../dist/nestore.js'
import { expect, match, colors, h1, matchStringified } from './utils.js'


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

describe(h1('2 | CONFIG'), ()=>{

    it('Contains the default settings if not set', () => {
        const NST = new Nestore()
        match(NST.settings.delimiter, '.')
        match(NST.settings.maxListeners, -1)
    })


})


/*

/// The typescript types of variables in the store should be correctly inferred,
/// and available to the user whe accessing `NST.store.<path>`
*/