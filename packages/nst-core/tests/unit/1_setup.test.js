import {expect} from 'chai';
import nestore from '../../dist/index.js';

describe('nestore setup', function () {

  it('Provides a function as the default export', function () {
      expect(typeof nestore).to.eq('function')
  });

});
