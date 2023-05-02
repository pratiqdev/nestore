console.log('browser:test-1 | nestore:', nestore)

const nst = nestore({
    greeting: 'Ayo'
})

console.log('browser:test-1 | nst:', nst)

console.log('browser:test-1 | nst.get("greeting")', nst.get('greeting'))