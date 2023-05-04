const { expect} = require('chai')
const nestore = require('../../index.js')

describe('nestore setup', function () {

  it('Provides a function as the default export', function () {
      console.log(nestore)
      const nst = nestore({
        greetings: "fellow humans"
      })
      console.log(nst)

      expect(typeof nestore).to.eq('function')
  });


});
