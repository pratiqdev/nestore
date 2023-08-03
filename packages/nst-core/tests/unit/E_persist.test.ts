// const { expect} = require('chai')
// const nestore = require('../../index')
import { expect, heading } from './utils'
import createStore from '../../dist/main.js'

function createLocalStorageMock(store: Record<string, string> = {}) {
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


const mockLocalStorage = createLocalStorageMock({
  'persist-test-1': JSON.stringify({
    v: 'valueFromLocalStorage'
  })
})

const getKeyFromStorage = (key:string, prop:string) => {
  let sto = mockLocalStorage.getItem(key)
  let val = JSON.parse(sto ?? '{}')
  return val[prop]
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


describe.skip(heading('E | persist'), function () {

  it('E.1 | Store loads data from storage', function () {

    type NST = {
      v:string;
    }

    const nst = createStore<NST>((self) => ({
      v: 'valueFromStore',
    }), {
      storageKey: 'persist-test-1',
      storage: mockLocalStorage
    })

    expect(nst.v).eq('valueFromLocalStorage')

  });


  it('E.2 | Store sets storage on updates', function () {

    type NST = {
      v:string;
    }

    const nst = createStore<NST>((self) => ({
      v: 'valueFromStore',
    }), {
      storageKey: 'persist-test-1',
      storage: mockLocalStorage
    })

    nst.v = 'newValue'

    expect(nst.v).eq('newValue')
    expect(getKeyFromStorage('persist-test-1', 'v')).eq('newValue')
  });

  it('E.3 | Store sets storage on deletion', function () {

    type NST = {
      v?:string;
    }

    const nst = createStore<NST>((self) => ({
      v: 'valueFromStore',
    }), {
      storageKey: 'persist-test-1',
      storage: mockLocalStorage
    })

    delete nst.v 

    expect(nst.v).undefined
    expect(getKeyFromStorage('persist-test-1', 'v')).undefined
  });


});
