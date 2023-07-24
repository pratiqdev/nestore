// const { expect} = require('chai')
// const nestore = require('../../index')
import { expect } from 'chai'
import createStore from '../../dist/main.js'

describe('nestore setup', function () {

  it('Provides a function as the default export', function () {
      const nst = createStore({
        greetings: "fellow humans"
      })
      console.log(nst)

      expect(typeof createStore).to.eq('function')
  });


});
