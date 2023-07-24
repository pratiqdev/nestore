import { expect } from 'chai'
import nestore from '../../dist/main.js'

describe('NESTORE: createStore', function () {

  it('1. Provides expected handlers and proxy (get)', function () {
    const nst = nestore({
      greetings: "fellow humans"
    })


    expect(nst.greetings).to.eq('fellow humans')

  });

});
