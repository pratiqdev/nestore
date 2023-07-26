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


describe(heading('B | get'), function () {

  it('B.1 | Returns the correct values', function () {
    const nst = createStore(sto)
    expect(nst.title).to.eq('The Book')
    expect(nst.pages).to.eq(817)
    expect(nst.checkedOut).to.eq(false)
    expect(nst.chapters?.[0]).to.eq('1-The Start')
  });

  it('B.2 | Returns undefined for nonexistent keys', function () {
    const nst = createStore(sto)
    // @ts-expect-error
    expect(nst.flapper).to.be.undefined
    // @ts-expect-error
    expect(nst.blippo).to.be.undefined
  });

  it('B.3 | Modifiers return computed values', function () {
    type NST = {
      firstName:string;
      lastName:string;
      age: number;
      who: () => string;
    }
    const nst = createStore<NST>((self) => ({
      firstName: 'John',
      lastName: 'Smith',
      age: 33,
      who: () => `I am ${self.firstName} ${self.lastName} and I am ${self.age} years old`
    }))

    expect(nst.who())

  });

});
