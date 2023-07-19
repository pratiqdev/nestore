const { expect} = require('chai')
const useNestore = require('../index.js')

describe('useNestore hook setup', function () {

  it('Provides a function as the default export', function () {
      console.log('>>> HOOK SETUP', useNestore)
  

      expect(typeof useNestore).to.eq('function')
  });


});
