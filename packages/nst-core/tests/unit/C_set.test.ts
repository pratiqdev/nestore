// const { expect} = require('chai')
// const nestore = require('../../index')
import { expect, heading } from './utils'
import createStore from '../../dist/main.js'

const sto = {
  title: 'The Book',
  /** The number of pages in the current book. */
  pages: 817,
  checkedOut: false,
  chapters: ['1-The Start', '2-The Middle', '3-The End'],
  reviews: {
    'someGuy': 'This is a book',
    'Some Guy': 'This book was... okay.',
    'Big Name': 'Best book ever in the world always.',
    'Some Extra': {
      'Stuff Here': {
        find: {
          'me ?': 'Hello!'
        }
      }
    }
  },
}


describe(heading('C | set'), function () {

  it('C.1 | Can set values directly', function () {
    const nst = createStore(sto)
    expect(nst.title).to.eq('The Book')
    nst.title = 'The Movie'
    expect(nst.title).to.eq('The Movie')
  });

  it('C.2 | Can set new values (against TS warnings)', function () {
    const nst = createStore(sto)
    // @ts-expect-error
    nst.flapper = 123
    // @ts-expect-error
    expect(nst.flapper).eq(123)
    // @ts-expect-error
    nst.blippo = false
    // @ts-expect-error
    expect(nst.blippo).eq(false)
  });

  it('C.3 | Modifiers can set values', function () {
    type NST = {
      firstName:string;
      lastName:string;
      age: number;
      who: (f:string, l:string) => boolean;
    }
    const nst = createStore<NST>((self) => ({
      firstName: 'John',
      lastName: 'Smith',
      age: 33,
      who: (f:string, l:string) => {
        self.firstName = f
        self.lastName = l
        return true
      }
    }))

    // console.log('WHO MODIFIER TYPE:', typeof nst.who)
    // console.log('WHO MODIFIER:', nst.who('',''))

    expect(nst.who('Bobby', "Brown")).eq(true)
    expect(nst.firstName).eq('Bobby')
    expect(nst.lastName).eq('Brown')

  });

  it('C.4 | Async modifiers can set values', async function () {
    type NST = {
      firstName:string;
      lastName:string;
      age: number;
      who2: (f:string, l:string) => Promise<boolean>;
    }
    const nst = createStore<NST>((self) => ({
      firstName: 'John',
      lastName: 'Smith',
      age: 33,

      who2: async (f:string, l:string) => {
        await new Promise(r => setTimeout(r, 1000))
        self.firstName = f
        self.lastName = l
        return true
      }
    }))
    // console.log('WHO2 MODIFIER TYPE:', typeof nst.who2)
    // console.log('WHO MODIFIER:', nst.who2('',''))

    const who2Result = await nst.who2('Chuck', "Chum");

    expect(who2Result).to.eq(true);
    expect(nst.firstName).to.eq('Chuck');
    expect(nst.lastName).to.eq('Chum');

  });

});
