import { expect } from 'chai'
import assert from 'tsd'
import nestore from '../../src/main'

describe('PROXY METHODS', function () {

  it('A. Provides expected handlers and proxy (get)', function () {
    const nst = nestore({
      greetings: "fellow humans"
    })


    expect(nst.greetings).to.eq('fellow humans')

    expect(nst.get('greetings')).to.eq('fellow humans')

    expect(nst.get().greetings).to.eq('fellow humans')

    expect(nst.get(s => s.greetings)).to.eq('fellow humans')

  });

  it('B. Provides expected handlers and proxy (set)', function () {
    const nst = nestore({
      greetings: "fellow humans"
    })


    expect(nst.greetings).to.eq('fellow humans')

    expect(nst.set('greetings', 'ayo')).to.eq(true)

    expect(nst.greetings).to.eq('ayo')
    
    expect(nst.set('greetings', s => s.greetings + '123')).to.eq(true)
    
    expect(nst.greetings).to.eq('ayo123')

  });

  it('C. Provides expected handlers and proxy (delete)', function () {
    const nst = nestore({
      greetings: "fellow humans",
      count: 5,
    })

    expect(nst.greetings).to.eq('fellow humans')
    expect(nst.count).to.eq(5)

    delete nst.greetings

    expect(nst.greetings).to.eq(undefined)
    expect(nst.count).to.eq(5)


  });

});
