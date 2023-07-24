import { expect } from 'chai'
import nestore from '../../dist/main.js'
import { beforeEach } from 'mocha';

let nst = nestore((self) => ({
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
}));




describe('NESTORE: nst.get', function () {

  beforeEach(()=>{
    nst = nestore((x) => ({
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
        x.invoked = 'hell yeah'
        return 5
      }
    }), {
      debug: true
    })
    
  })

  it('1. direct access via proxy `get` trap', function () {
    expect(nst.count).to.eq(2)
    expect(nst.greetings).to.eq("fellow humans")
  });

  it('2. direct access via proxy `set` trap', function () {
    nst.count = 7
    expect(nst.count).to.eq(7)

    nst.greetings = "fellow humans"
    expect(nst.greetings).to.eq("fellow humans")
  });

  it('3. direct access via proxy `delete` trap', function () {
    nst.count = 7
    expect(nst.count).to.eq(7)
    
    delete nst.greetings
    expect(nst.greetings).to.be.undefined
  });

  it('4. direct access via proxy `apply` trap', function () {
    expect(nst.invoked).to.be.undefined
    nst.invokeMe('ohhh', 'kayy')
    expect(nst.invoked).eq('hell yeah')
  });



  // it('3. get function with string path (nested object)', function () {
  //   expect(nst.get('nested.properties.willBe.useful')).to.eq(true)
  // });

  // it('4. get function with string path (nested array dot notation)', function () {
  //   expect(nst.get('nested.properties.are.0')).to.eq('cool')
  // });

  // //! nestore does not currently support bracket notation for nested string path parsing
  // // it('5. get function with string path (nested array bracket notation)', function () {
  // //   expect(nst.get('nested.properties.are[1]')).to.eq('neat')
  // // });

  // it('5. get function with getter callback', function () {
  //   expect(nst.get(s => s.count)).to.eq(2)
  // });

  // it('6. get function with getter callback (nested)', function () {
  //   expect(nst.get(s=> s)).to.eq(2)
  // });

});
