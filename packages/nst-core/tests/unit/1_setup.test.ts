// const { expect} = require('chai')
// const nestore = require('../../index')
import { expect } from 'chai'
import createStore from '../../dist/main.js'

describe('NESTORE: setup', function () {

  it('Provides a function as the default export', function () {
      const nstFunc = createStore(() => ({
        greetings: "fellow humans"
      }), {
        debug: true
      })

    const nstObj = createStore({
      greetings: "fellow humans"
    }, {
      debug: true
    })

    nstFunc.greetings

    nstObj.greetings
    nstObj.nonExistentProp = 3
    nstObj.nonExistentProp

    
    expect(typeof createStore).to.eq('function')
    expect(nstFunc.greetings).to.eq('function')
    expect(nstObj.greetings).to.eq('function')
  });


});
