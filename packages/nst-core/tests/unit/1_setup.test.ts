// const { expect} = require('chai')
// const nestore = require('../../index')
import { expect } from 'chai'
import createStore from '../../dist/main.js'

describe('NESTORE: setup', function () {

  it('Provides a function as the default export', function () {
    expect(typeof createStore).to.eq('function')


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

    

    // does the prop exist
    nstFunc.greetings
    nstObj.greetings
    expect(nstFunc.greetings).to.eq('fellow humans')
    expect(nstObj.greetings).to.eq('fellow humans')

    // is the prop optional
    delete nstFunc.greetings
    delete nstObj.greetings
    expect(nstFunc.greetings).to.be.undefined
    expect(nstObj.greetings).to.be.undefined

    // are new props allowed
    nstFunc.nonExistentProp = 3
    nstObj.nonExistentProp = 7
    expect(nstFunc.nonExistentProp).to.eq(3)
    expect(nstObj.nonExistentProp).to.eq(7)

    
  });


});
