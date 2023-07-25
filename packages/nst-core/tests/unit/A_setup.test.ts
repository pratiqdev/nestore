// const { expect} = require('chai')
// const nestore = require('../../index')
import { expect, heading } from './utils'
import createStore from '../../dist/main.js'

describe(heading('A | setup'), function () {

  it('A.1 | Provides a function as the default export', function () {
    expect(typeof createStore).to.eq('function')
  });

  it('A.2 | Creates an empty store with no initialState or options', function () {
    const nst = createStore()
    expect(typeof nst).to.eq('object')
    expect(JSON.stringify(nst)).to.eq(JSON.stringify({}))
  });

  it('A.2 | Throws errors on incorrect type of initialState or options', function () {
    let stores:any = [
      [],
      [1,2,3],
      3,
      '3',
      'a string',
    ]
    let nst:any;
    stores.forEach((store:any) => {
      expect(() => nst = createStore(store)).to.throw(Error);
    })
  });


});
