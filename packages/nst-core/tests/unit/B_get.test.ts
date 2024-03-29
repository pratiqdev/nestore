// const { expect} = require('chai')
// const nestore = require('../../index')
import { expect, heading } from './utils'
import createStore from '../../dist/main.js'
import { beforeEach } from 'mocha';

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

type Store = {
  count: number;
  greetings?: string;
  invoked?: string;
  nested: {
    properties:{
      are: Array<string>,
      willBe: Record<string, boolean>
    }
  },
  invokeMe: (arg1:any, arg2:string) => number
}
 
let nst = createStore<Store>((self) => ({
  count: 2,
  greetings: "fellow humans",
  nested: {
    properties:{
      are: ['cool','neat','okay'],
      willBe: {
        useful: true,
        easy: true,
        best: false
      }
    }
  },
  invokeMe: (arg1:any, arg2:string) => {
    console.log({arg1, arg2})
    self.invoked = 'hell yeah' // Property 'invoked' does not exist on type 'Partial<Store>'.ts(2339)
    return 5
  }
}));





describe(heading('B | get'), function () {
  beforeEach(()=>{
    nst = createStore((x) => ({
      count: 2,
      greetings: "fellow humans",
      invoked: undefined,
      nested: {
        properties:{
          are: ['cool','neat','okay'],
          willBe: {
            useful: true,
            easy: true,
            best: false
          }
        }
      },
      invokeMe: (arg1:any, arg2:string) => {
        console.log({arg1, arg2})
        x.invoked = 'hell yeah'
        return 5
      }
    }), {
      debug: false 
    })
    
  })

  it('B.1 | direct access via proxy `get` trap', function () {
    expect(nst.count).to.eq(2)
    expect(nst.greetings).to.eq("fellow humans")
  });

  it('B.2 | direct access via proxy `set` trap', function () {
    nst.count = 7
    expect(nst.count).to.eq(7)

    nst.greetings = "fellow humans"
    expect(nst.greetings).to.eq("fellow humans")
  });

  it('B.3 | direct access via proxy `delete` trap', function () {
    nst.count = 7
    expect(nst.count).to.eq(7)
    
    delete nst.greetings // marked as optional
    expect(nst.greetings).to.be.undefined
  });

  it('B.4 | modifier access', function () {
    expect(nst.invoked).to.be.undefined
    nst.invokeMe?.('ohhh', 'kayy')
    expect(nst.invoked).eq('hell yeah')
  });

  it('B.5 | Returns the correct values', function () {
    const nst = createStore(sto)
    expect(nst.title).to.eq('The Book')
    expect(nst.pages).to.eq(817)
    expect(nst.checkedOut).to.eq(false)
    expect(nst.chapters?.[0]).to.eq('1-The Start')
  });

  it('B.6 | Returns undefined for nonexistent keys', function () {
    const nst = createStore(sto)
    // @ts-expect-error
    expect(nst.flapper).to.be.undefined
    // @ts-expect-error
    expect(nst.blippo).to.be.undefined
  });



});
