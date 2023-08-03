// const { expect} = require('chai')
// const nestore = require('../../index')
import { expect, heading } from './utils'
import createStore, { EventChange } from '../../dist/main.js'
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





describe.skip(heading('G | Events'), function () {
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



  it('G.1 | Updates to store emit events', function () {
    type NST = {
      name:string;
      nested: {
        object: Record<string, string>,
        array:  Array<number>
      }
    }
    const nst = createStore<NST>((self) => ({
      name: 'John',
      nested: {
        object: { v: 'ayo' },
        array: [1, 2, 3]
      }
    }))




    nst.onAny((e:string | string[]) => {
      console.log('--- any:', e)
    })
    // nst.on('nested', (e:EventChange) => {
    //   console.log('--- nested:', e)
    // })

    // nst.on('nested.*', (e:EventChange) => {
    //   console.log('--- nested.*:', e)
    // })

    // nst.on('nested.**', (e:EventChange) => {
    //   console.log('--- nested.**:', e)
    // })

    // nst.on('nested.object', (e:EventChange) => {
    //   console.log('--- nested.object:', e)
    // })
    // console.log('-'.repeat(80))
    // console.log(nst)
    // console.log('-'.repeat(80))
    // nst.name = 'ayo'
    nst.nested = { object: {}, array: [] }
    nst.nested.object = { v: 'yo' }
    nst.nested.object.v = 'hello'

    expect(nst.nested.object.v).eq('hello')

    // nst.name = 'Johnny'

  });



});
