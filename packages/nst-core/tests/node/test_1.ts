// import createStore from '../../index'



// //&                                                                                                                     

// // type AnyRecord = Record<string | number, any>
// // type StoreInitializer<T extends AnyRecord> = (self:T) => T
// // function createStore<T extends AnyRecord>(
// //     initialState: StoreInitializer<T> | T = {} as T,
// //     options: NestoreOptions = {}
// // ): AnyRecord & Partial<T> 

// type Store = {
//     greetings?: string;
//     location: string;
//     ayo: () => string;
// }

// let GREETING = 'hello'
// const nst = createStore<Store>((self) => ({
//     greetings: GREETING,
//     location: 'world',
//     ayo: () => self.greetings + ', ' + self.location
// }))
// delete nst.greetings //+ can only delete 'string' prop if marked optional in Store type
// nst.ayo() //+ should match Store.ayo type
// // Cannot invoke an object which is possibly 'undefined'.ts(2722)
// // (property) ayo?: (() => string) | undefined


// //&                                                                                                                     
// const nst2 = createStore((self) => ({
//     greetings: GREETING,
//     location: 'world',
//     ayo: () => self.greetings + ', ' + self.location
// }))
// delete nst2.greetings //+ untyped so returns as 'any'
// nst2.ayo() //+ untyped so returns as 'any'
// // Cannot invoke an object which is possibly 'undefined'.ts(2722)
// // (property) ayo?: (() => string) | undefined





// //&                                                                                                                     
// const nst1 = createStore({
//     greetings: 'hello' 
// })
// nst1.greetings = 'ayo'
// // nst1.ayo = 'greetings'


// const n1 = createStore({ greetings: 'hello' })
// delete n1.greetings //! deletion not allowed - as expected/intended
// n1.newKey = 'asdf' //! then unknown keys should not be allowed

// const n5 = createStore<{ greetings?: string; } & Record<number | string, any>>({ greetings: 'hello' })
// delete n5.greetings //+ optional
// n5.greetings = 'yo' //+ string only
// n5.ayo = 'whjat' //+ new key as AnyRecord


// const n2 = createStore(() => ({ greetings: 'hello' }))
// delete n2.greetings // Property 'greetings' does not exist on type '() => { greetings: string; }'.ts(2339) any


// const n3 = createStore((self:any) => ({ greetings: 'hello' }))
// delete n3.greetings // Property 'greetings' does not exist on type '(self: any) => { greetings: string; }'.ts(2339)

// n2.ayo = 'whjat'
// n2.ayo = 'whjat'

// const n4 = createStore<{greetings?: string }>((self) => ({ greetings: 'hello' }))
// delete n4.greetings
// n4.ayo = 'whjat'



// type AnyRecord = Record<string | number, any>;

// function createStore<T extends AnyRecord>(initialState: T | (() => T) = {} as T): T {
//   let state: T = typeof initialState === 'function' ? initialState() : initialState;

//   const handler = {
//     get: (target: T, prop: string | symbol) => {
//       console.log('get', prop);
//       return Reflect.get(target, prop);
//     },
//     set: (target: T, prop: string | symbol, value: any) => {
//       console.log('set', prop, value);
//       Reflect.set(target, prop, value);
//       return true;
//     },
//     deleteProperty: (target: T, prop: string | symbol) => {
//       console.log('delete', prop);
//       Reflect.deleteProperty(target, prop);
//       return true;
//     },
//   };

//   return new Proxy(state, handler);
// }


// const n2 = createStore(() => ({ greetings: 'hello' }))
// delete n2.greetings // Property 'greetings' does not exist on type '() => { greetings: string; }'.ts(2339) any


// const n3 = createStore((self:any) => ({ greetings: 'hello' }))
// delete n3.greetings // Property 'greetings' does not exist on type '(self: any) => { greetings: string; }'.ts(2339)