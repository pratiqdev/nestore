// /* eslint-disable */

// import Nestore from '../../dist/nestore.js'
// import { match, colors, h1 } from './utils'


// const requiredMethods = [
//     // store
//     'get',
//     'set',
//     'reset',

//     // events
//     'on',       // addEventListener
//     'off',      // removeEventListener
//     'onAny',
//     'emit',
//     'offAll',   // removeAllListeners(optional_path)
// ]

// const requiredProperties = [
//     'store',
//     'maxListeners',
//     'delimiter'
// ]

// describe.skip(h1('X | Recurse Test'), () => {

//     it('recurses?', () => {
//         const NST = new Nestore({
//             woah: 'yeah',
//             how: {
//                 nested: {
//                     can: 'you get!?'
//                 }
//             }
//         })

//         let list = [
//             'how',
//             'how.nested',
//             'how.nested.can',
//             'how.nested.can.you',
//             'how.nested.can.you.get',
//             'how.*',
//             'how.nested.*',
//             'how.nested.can.*',
//             'how.nested.can.you.*',
//             'how.**',
//             'how.nested.**',
//             'how.nested.can.**',
//             'how.nested.can.you.**',
//             'how',
//             '*.nested',
//             'how.*.can',
//             'how.nested.*.you',
//             'how.nested.can.*.get',
//             'how',
//             '*.nested',
//             '*.*.can',
//             'how.*.*.you',
//             'how.*.*.*.get',
//             'how.**',
//             'how.nested.**',
//             'how.**.1',
//         ]

//         list.forEach(item => NST.on(item, item => console.log('EMITTED:', item)))

//         NST.set('how.nested.can', { you: 'get!!!', arr: ['1', '2', '3']})
//         NST.set('how.nested.can.arr.1', 'shfifty-five')

//         let val = NST.get('how.nested.can')
//         console.log(val)
//     })
// })
const a = {}
export default a
