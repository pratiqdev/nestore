/* eslint-disable import/extensions */
/* eslint-disable no-console */
/* eslint-disable no-multiple-empty-lines */
import Nestore from '../../dist/nestore.js'


console.log('>>')


const NST = new Nestore({
    greeting: 'ayo',
    description: 'External nestore test, used in real-world situations.'
})

setTimeout(() => {
    console.log(NST.store.greeting)
}, 500)


setTimeout(() => {
    console.log('>>')
}, 1000)



NST.store.greeting