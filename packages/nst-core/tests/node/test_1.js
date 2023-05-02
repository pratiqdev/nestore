import createNestore from '../../dist/index.js'

const nst = createNestore({
    greeting: 'ayo'
})

console.log('node:test-1 | nst', nst)
console.log('node:test-1 | nst.store', nst.store)
console.log('node:test-1 | nst.get', nst.get)
console.log('-'.repeat(80))
console.log('node:test-1 | nst.get()', nst.get(s => s.greeting))
console.log('-'.repeat(80))
console.log('node:test-1 | nst.get()', nst.get('greeting'))
