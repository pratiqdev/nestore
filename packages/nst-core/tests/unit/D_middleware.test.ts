// const { expect} = require('chai')
// const nestore = require('../../index')
import { expect, heading } from './utils'
import createStore from '../../dist/main.js'

function createLocalStorageMock() {
  let store:any = {};
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


describe(heading('D | middleware'), function () {

  it('D.1 | Middleware can intercept `get` actions and values', function () {



  let valueFromMiddleware: string = ''

  const customGetMiddleware = (self:any, next: () => any) => {
    const og = next()
    return {
      get(target: any, prop: string | symbol, receiver: any) {
        let mwValue = og.get?.(target, prop, receiver);
        valueFromMiddleware = mwValue
        return mwValue
      }
    }
  };


    type NST = {
      v:string;
    }

    const nst = createStore<NST>((self) => ({
      v: 'valueFromStore',
    }), {
      middleware: [
        customGetMiddleware,
      ]
    })


    expect(nst.v).eq(valueFromMiddleware)


  });


  it('D.2 | Middleware can intercept `set` actions and values', function () {



  let valueFromMiddleware: string = ''


    function customSetMiddleware(self: any, next: Function) {
      // console.log('>>> CSM | next:',  next)
      const og = next()
      // console.log('>>> CSM | og:', og)
      return {
        set(target: any, prop: string | symbol, value: any) {
          // console.log('>>> CSM | set prop:', prop)
          // console.log('>>> CSM | set value:', value)
          valueFromMiddleware = value
          // console.log('>>> CSM | set function:', og.set)
          let val = og.set?.(target, prop, value);
          // console.log('>>>CSM | set result:', val )

          return val
          // return true
        }
      };
    }

    type NST = {
      v:string;
    }

    const nst = createStore<NST>((self) => ({
      v: '',
    }), {
      middleware: [
        customSetMiddleware,
      ]
    })

    // console.log('middleware set:', {
    //   initialValue: valueFromMiddleware,
    //   storeValue: nst.v,
    // })

    // console.log('setting new value...')
    nst.v = 'newValue'
    // console.log('new value:', nst.v)
    // console.log('mw value:', valueFromMiddleware)
    expect(nst.v).eq(valueFromMiddleware)


  });


  it('D.3 | Middleware can intercept and modify `get` actions and values', function () {



    let valueFromMiddleware: string = ''
  
    const customGetMiddleware = (self:any, next: () => any) => {
      const og = next()
      return {
        get(target: any, prop: string | symbol, receiver: any) {
          let mwValue = og.get?.(target, prop, receiver) + 1;
          valueFromMiddleware = mwValue
          return mwValue
        }
      }
    };
  
  
      type NST = {
        v:number;
      }
  
      const nst = createStore<NST>((self) => ({
        v: 0,
      }), {
        middleware: [
          customGetMiddleware,
        ]
      })
  
  
      expect(nst.v).eq(1)
      nst.v = 5
      expect(nst.v).eq(6)
      expect(nst.v).eq(valueFromMiddleware)
  
  
  });
  
  
  it('D.4 | Middleware can intercept and modify `set` actions and values', function () {



  let valueFromMiddleware: string = ''


    function customSetMiddleware(self: any, next: Function) {
      console.log('>>> CSM | next:',  next)
      const og = next()
      console.log('>>> CSM | og:', og)
      return {
        set(target: any, prop: string | symbol, value: any) {
          console.log('>>> CSM | set prop:', prop)
          console.log('>>> CSM | set og value:', value)
          value = value + 1;
          console.log('>>> CSM | set modified value:', value)
          valueFromMiddleware = value
          console.log('>>> CSM | set function:', og.set)
          let val = og.set?.(target, prop, value);
          console.log('>>>CSM | set result:', val )

          return val
          // return true
        }
      };
    }

    type NST = {
      v:number;
    }

    const nst = createStore<NST>((self) => ({
      v: 0,
    }), {
      middleware: [
        customSetMiddleware,
      ]
    })

    // console.log('middleware set:', {
    //   initialValue: valueFromMiddleware,
    //   storeValue: nst.v,
    // })

    // console.log('setting new value...')
    nst.v = 9
    // console.log('new value:', nst.v)
    // console.log('mw value:', valueFromMiddleware)
    expect(nst.v).eq(10)
    expect(nst.v).eq(valueFromMiddleware)


  });

  // it('D.5 | Middleware can intercept and modify `set` actions and values', function () {

  //   let valueFromMiddleware: string = ''
  
  //   type NST = {
  //     v:number;
  //   }

    

  //   const storage = createLocalStorageMock() as Storage

  //   const nst = createStore<NST>((self) => ({
  //     v: 0,
  //   }), {
  //     middleware: [ ]
  //   })

  //   // console.log('middleware set:', {
  //   //   initialValue: valueFromMiddleware,
  //   //   storeValue: nst.v,
  //   // })

  //   // console.log('setting new value...')
  //   nst.v = 9
  //   // console.log('new value:', nst.v)
  //   // console.log('mw value:', valueFromMiddleware)
  //   expect(nst.v).eq(10)
  //   expect(nst.v).eq(valueFromMiddleware)
  
  
  // });
  

  






//   it.skip('D.2 | Middleware can intercept `set` actions and values', function () {

//     // function loggingMiddleware(self: any, next: Function) {
//     //   console.log('||| wrapping proxy in middleware:', { self, next })
//     //   return new Proxy(self, {
//     //     get(target: any, property: string) {
//     //       console.log(`MIDDLEWARE: Getting property "${property}":`, target[property]);
//     //       return next().get(target, property);
//     //     },
//     //     set(target: any, property: string, value: any) {
//     //       console.log(`MIDDLEWARE: Setting property "${property}" to:`, value);
//     //       return next().set(target, property, value);
//     //     }
//     //   });
//     // }

//   //   const loggingMiddleware = (self:any, next: () => any) => {
//   //     const oldHandlers = next();
//   //     return {
//   //         get(target: any, prop: string | symbol, receiver: any) {
//   //             console.log(`Getting property "${String(prop)}"`);
//   //             return oldHandlers.get?.(target, prop, receiver);
//   //         },
//   //         set(target: any, prop: string | symbol, value: any, receiver: any) {
//   //             console.log(`Setting property "${String(prop)}" to ${value}`);
//   //             return oldHandlers.set?.(target, prop, value, receiver) ?? false;
//   //         }
//   //     }
//   // };

//   let valueFromMiddleware: string = ''

//   const customGetMiddleware = (self:any, next: () => any) => {
//     const oldHandlers = next();
//     return {
//         get(target: any, prop: string | symbol, receiver: any) {
//             let mwValue = oldHandlers.get?.(target, prop, receiver);
//             valueFromMiddleware = mwValue
//             return mwValue
//         }
//     }
// };
    
//     function customSetMiddleware(self: any, next: Function) {
//       return new Proxy(self, {
//         set(target: any, property: string, value: any) {
//           if (typeof value === 'number') {
//             console.log(`MIDDLEWARE: Incrementing value of "${property}"`);
//             value++;
//           }
//           return next().set(target, property, value);
//         }
//       });
//     }

//     type NST = {
//       v:string;
//     }

//     const nst = createStore<NST>((self) => ({
//       v: 'valueFromStore',
//     }), {
//       middleware: [
//         customGetMiddleware,
//       ]
//     })


//     expect(nst.v).eq(valueFromMiddleware)


//   });

 

});
