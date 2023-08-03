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





describe.skip(heading('F | Modifiers'), function () {
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



  it('F.1 | modifier access', function () {
    expect(nst.invoked).to.be.undefined
    nst.invokeMe?.('ohhh', 'kayy')
    expect(nst.invoked).eq('hell yeah')
  });

  it('F.2 | Modifiers return computed values', function () {
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

  it('F.3 | Async modifiers return computed values', async function () {
    type NST = {
      firstName:string;
      lastName:string;
      age: number;
      who: () => Promise<string>;
    }
    const nst = createStore<NST>((self) => ({
      firstName: 'John',
      lastName: 'Smith',
      age: 33,
      who: async () => {
        await new Promise(r => setTimeout(r, 1000))
        return `I am ${self.firstName} ${self.lastName} and I am ${self.age} years old`
      }
    }), { debug: true })


    const who2Result = await nst.who();

    expect(who2Result).to.eq("I am John Smith and I am 33 years old");

  });

});
