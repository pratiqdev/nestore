const { expect} = require('chai')
const useNestore = require('../dist/index.js')

describe('useNestore hook setup', function () {

  it('Provides a function as the default export', function () {
      console.log(useNestore)
  

      expect(typeof useNestore).to.eq('function')
  });


});
