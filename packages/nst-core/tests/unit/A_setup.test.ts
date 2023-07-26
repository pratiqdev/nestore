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

  it('A.3 | Throws errors on incorrect type of initialState', function () {
    let stores:any = [
      [],
      [1,2,3],
      3,
      '3',
      'a string',
    ]

    stores.forEach((store:any) => {
      expect(() => createStore(store)).to.throw(Error);
    })
  });

  it('A.4 | Throws errors on incorrect type of options', function () {
    let options: any = [
      [],
      [1, 2, 3],
      3,
      '3',
      'a string',
    ]

    options.forEach((opt: any) => {
      expect(() => createStore({}, opt)).to.throw(Error);
    })
  });

  it('A.5 | Returned store matches initialState', function () {
    const initialState = {
      blap: 'yap',
      trap: 9,
      arr: [1,2,3],
      obj: {
        ayo: 'geetings'
      },
      bool: true,
    }
    const nst = createStore(initialState)

    expect(JSON.stringify(nst)).eq(JSON.stringify(initialState))
  });

  it('A.6 | Multiple stores do not interfere', function () {
    const initialState = {
      count: 0
    }
    const nst1 = createStore(initialState)
    const nst2 = createStore(initialState)
    const nst3 = createStore(() => initialState)
    const nst4 = createStore(() => initialState)

    nst1.count = 1
    nst2.count = 2
    nst3.count = 3
    nst4.count = 4

    expect(nst1.count).eq(1)
    expect(nst2.count).eq(2)
    expect(nst3.count).eq(3)
    expect(nst4.count).eq(4)

  });


});
