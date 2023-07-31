// const { expect} = require('chai')
// const nestore = require('../../index')
import { expect, heading } from './utils'
import createStore from '../../dist/main.js'

function createLocalStorageMock() {
  let store:any = {
    'persist-test-1': JSON.stringify({
      v: 'valueFromLocalStorage'
    })
  };
  return {
      getItem: function(key: string) {
          return store[key] || null;
      },
      setItem: function(key: string, value: string) {
          store[key] = value.toString();
      },
      clear: function() {
          store = {};
      },
      removeItem: function(key: string) {
          delete store[key];
      },
      get length() {
          return Object.keys(store).length;
      },
      key: function(index: number) {
          const keys = Object.keys(store);
          return keys[index] || null;
      }
  };
}

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


describe(heading('E | persist'), function () {

  it('E.1 | Middleware can intercept `get` actions and values', function () {

    type NST = {
      v:string;
    }

    const nst = createStore<NST>((self) => ({
      v: 'valueFromStore',
    }), {
      storageKey: 'persist-test-1',
      storage: createLocalStorageMock()
    })

    expect(nst.v).eq('valueFromLocalStorage')




  });


});
