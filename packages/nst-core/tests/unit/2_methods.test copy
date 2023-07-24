import { expect } from 'chai'
import nestore from '../../dist/main.js'

describe('NESTORE: createStore', function () {

  it('1. Provides expected handlers and proxy (get)', function () {
    const nst = nestore({
      greetings: "fellow humans"
    })


    expect(nst.greetings).to.eq('fellow humans')

    expect(nst.get('greetings')).to.eq('fellow humans')

    expect(nst.get().greetings).to.eq('fellow humans')

    expect(nst.get(s => s.greetings)).to.eq('fellow humans')

  });

  it('2. Provides expected handlers and proxy (set)', function () {
    const nst = nestore({
      greetings: "fellow humans"
    })


    expect(nst.greetings).to.eq('fellow humans')

    expect(nst.set('greetings', 'ayo')).to.eq(true)

    expect(nst.greetings).to.eq('ayo')
    
    expect(nst.set('greetings', s => s.greetings + '123')).to.eq(true)
    
    expect(nst.greetings).to.eq('ayo123')

  });

  it('3. Provides expected handlers and proxy (delete)', function () {
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

  it('4. Provides expected handlers and proxy (reset)', function () {
    const nst = nestore({
      greetings: "fellow humans",
      count: 5,
    })

    expect(nst.greetings).to.eq('fellow humans')
    expect(nst.count).to.eq(5)

    delete nst.greetings
    expect(nst.greetings).to.eq(undefined)
    expect(nst.count).to.eq(5)
    
    delete nst.count
    expect(nst.count).to.eq(undefined)

    nst.reset()

    expect(nst.greetings).eq('fellow humans')
    expect(nst.count).eq(5)




  });

  it('5. Accepts a function as the store initializer', function () {
    const nst = nestore((self) => ({
      greetings: "fellow humans",
      count: 2,
    }), {
      debug: false
    })

    expect(nst.count).to.eq(2)




  });

  it('6. Accepts internal setter functions that can be invoked', function () {
    const nst = nestore((self) => ({
      greetings: "fellow humans",
      count: 2,
      get_a: () => self.greetings,
      get_b: () => self.count,
      get_self: () => self
    }), {
      debug: false
    })

    expect(nst.count).to.eq(2)
    expect(nst.get_a()).to.eq('fellow humans')
    expect(nst.get_b()).to.eq(2)
    expect(nst.get_self()).haveOwnPropertyDescriptor('count')




  });

});

describe('PROXY METHODS', function () {

  it('1. Provides expected handlers and proxy (get)', function () {
    const nst = nestore({
      greetings: "fellow humans"
    })


    expect(nst.greetings).to.eq('fellow humans')

    expect(nst.get('greetings')).to.eq('fellow humans')

    expect(nst.get().greetings).to.eq('fellow humans')

    expect(nst.get(s => s.greetings)).to.eq('fellow humans')

  });

  it('2. Provides expected handlers and proxy (set)', function () {
    const nst = nestore({
      greetings: "fellow humans"
    })


    expect(nst.greetings).to.eq('fellow humans')

    expect(nst.set('greetings', 'ayo')).to.eq(true)

    expect(nst.greetings).to.eq('ayo')
    
    expect(nst.set('greetings', s => s.greetings + '123')).to.eq(true)
    
    expect(nst.greetings).to.eq('ayo123')

  });

  it('3. Provides expected handlers and proxy (delete)', function () {
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

  it('4. Provides expected handlers and proxy (reset)', function () {
    const nst = nestore({
      greetings: "fellow humans",
      count: 5,
    })

    expect(nst.greetings).to.eq('fellow humans')
    expect(nst.count).to.eq(5)

    delete nst.greetings
    expect(nst.greetings).to.eq(undefined)
    expect(nst.count).to.eq(5)
    
    delete nst.count
    expect(nst.count).to.eq(undefined)

    nst.reset()

    expect(nst.greetings).eq('fellow humans')
    expect(nst.count).eq(5)




  });

  it('5. Accepts a function as the store initializer', function () {
    const nst = nestore((self) => ({
      greetings: "fellow humans",
      count: 2,
    }), {
      debug: false
    })

    expect(nst.count).to.eq(2)




  });

  it('6. Accepts internal setter functions that can be invoked', function () {
    const nst = nestore((self) => ({
      greetings: "fellow humans",
      count: 2,
      get_a: () => self.greetings,
      get_b: () => self.count,
      get_self: () => self
    }), {
      debug: false
    })

    expect(nst.count).to.eq(2)
    expect(nst.get_a()).to.eq('fellow humans')
    expect(nst.get_b()).to.eq(2)
    expect(nst.get_self()).haveOwnPropertyDescriptor('count')




  });

});
