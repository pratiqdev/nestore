// const { expect} = require('chai')
// const nestore = require('../../index')
import { expect } from 'chai'
import createStore from '../../dist/main.js'

describe('NESTORE: setup', function () {

  it('Provides a function as the default export', function () {
    expect(typeof createStore).to.eq('function')


    const nstFunc = createStore(() => ({
      greetings: "fellow humans"
    }))

    const nstObj = createStore({
      greetings: "fellow humans"
    })

    const nstOpt = createStore<{ greetings?: string }>(() => ({
      greetings: "fellow humans"
    }))

    

    // does the prop exist
    nstFunc.greetings
    nstObj.greetings
    nstOpt.greetings
    expect(nstFunc.greetings).to.eq('fellow humans')
    expect(nstObj.greetings).to.eq('fellow humans')
    expect(nstOpt.greetings).to.eq('fellow humans')

    // provided store props with no type should not be optional (TS ONLY
    // @ts-expect-error
    delete nstFunc.greetings
    // @ts-expect-error
    delete nstObj.greetings
    delete nstOpt.greetings
    expect(nstFunc.greetings).to.be.undefined
    expect(nstObj.greetings).to.be.undefined
    expect(nstOpt.greetings).to.be.undefined

    // new props NOT allowed (TS ONLY)
    // @ts-expect-error
    nstFunc.nonExistentProp = 3
    // @ts-expect-error
    nstObj.nonExistentProp = 7
    // @ts-expect-error
    expect(nstFunc.nonExistentProp).to.eq(3)
    // @ts-expect-error
    expect(nstObj.nonExistentProp).to.eq(7)

    
  });


});
