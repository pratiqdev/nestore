// /* eslint-disable */

// import Nestore from '../../dist/nestore.js'
// import {expect} from 'chai'

// const match = (a,b) => expect(a).to.eq(b)

// const colors = {
//     reset:"\x1b[0m",
//     bright:"\x1b[1m",
//     dim:"\x1b[2m",
//     underscore:"\x1b[4m",

//     red:"\x1b[31m",
//     green:"\x1b[32m",
//     yellow:"\x1b[33m",
//     blue:"\x1b[34m",
//     magenta:"\x1b[35m",
//     cyan:"\x1b[36m",
//     white:"\x1b[37m",
//     grey:"\x1b[2m",

//     RED:"\x1b[31m\x1b[1m",
//     GREEN:"\x1b[32m\x1b[1m",
//     YELLOW:"\x1b[33m\x1b[1m",
//     BLUE:"\x1b[34m\x1b[1m",
//     MAGENTA:"\x1b[35m\x1b[1m",
//     CYAN:"\x1b[36m\x1b[1m",
//     WHITE:"\x1b[37m\x1b[1m",
//     GREY:"\x1b[2m\x1b[1m",
// }

// const h1 = (val) => {
//     return colors.BLUE + val + '\n  '
// + colors.reset + colors.dim
// + '-'.repeat(process.stdout.columns - 8
// )
// }

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
