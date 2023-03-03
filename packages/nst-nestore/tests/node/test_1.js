import createNestore from '../../dist/index.js'

const nst = createNestore({
    greeting: 'ayo'
})

console.log('node:test-1:', nst.get('greeting'))