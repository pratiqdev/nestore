const { expect} = require('chai')
const useNestore = require('../index.js')

describe('useNestore hook setup', function () {

  it('Provides a function as the default export', function () {
      expect(typeof useNestore).to.eq('function')
  });


});
