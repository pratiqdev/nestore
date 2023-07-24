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
    nst = nestore((self) => ({
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
    }))
    
  })

  it('1. direct access', function () {
    expect(nst.count).to.eq(2)
  });

  it('2. get function with string path', function () {
    expect(nst.get('count')).to.eq(2)
  });

  it('3. get function with string path (nested object)', function () {
    expect(nst.get('nested.properties.willBe.useful')).to.eq(true)
  });

  it('4. get function with string path (nested array dot notation)', function () {
    expect(nst.get('nested.properties.are.0')).to.eq('cool')
  });

  //! nestore does not currently support bracket notation for nested string path parsing
  // it('5. get function with string path (nested array bracket notation)', function () {
  //   expect(nst.get('nested.properties.are[1]')).to.eq('neat')
  // });

  it('5. get function with getter callback', function () {
    expect(nst.get(s => s.count)).to.eq(2)
  });

  it('6. get function with getter callback (nested)', function () {
    expect(nst.get(s => s.count)).to.eq(2)
  });




});
