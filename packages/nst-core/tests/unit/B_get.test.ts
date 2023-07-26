// const { expect} = require('chai')
// const nestore = require('../../index')
import { expect, heading } from './utils'
import createStore from '../../dist/main.js'

describe(heading('B | get'), function () {

  it('B.1 | Provides a function as the default export', function () {
    expect(typeof createStore).to.eq('function')
  });

});
