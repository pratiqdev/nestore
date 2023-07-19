const { expect} = require('chai')
const nestore = require('../../index')

describe('nestore setup', function () {

  it('Provides a function as the default export', function () {
      console.log('>>> NESTORE:', nestore)
      const nst = nestore({
        greetings: "fellow humans"
      })
      console.log(nst)

      expect(typeof nestore).to.eq('function')
  });


});
