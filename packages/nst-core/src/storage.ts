// import { Middleware, Handlers, NextFunc } from "@pratiq/nestore-types";

// type StorageOptions = {
//     storage?: Storage;
//     key?: string;
// };

// export const persist = ({ storage = localStorage, key = 'store' }: StorageOptions = {}) => 
//     (self:any, next: NextFunc<any>): Handlers<any> => {
//         const og:Handlers<any> = next()
//     return {
//         get: (target: Partial<any>, prop: string | symbol, receiver: any) => {
//             // grab the store (stored as stringified object)
//             const storedValue = storage.getItem(key);
//             // if the store exists at this key
//             if (storedValue) {
//                 // parse it 
//                 const parsedValue = JSON.parse(storedValue);
//                 if (parsedValue[prop]) {
//                     return parsedValue[prop];
//                 }
//             }
//             return og.get?.(target, prop, receiver);
//         },
//         set: (target: Partial<any>, prop: string | symbol, value: any, receiver: any) => {
//             const result = og.set?.(target, prop, value, receiver);
//             if (result) {
//                 storage.setItem(key, JSON.stringify(target));
//             }
//             return result ? true : false;
//         },
//         deleteProperty: (target: Partial<any>, prop: string | symbol) => {
//             const result = og.deleteProperty?.(target, prop);
//             if (result) {
//                 storage.setItem(key, JSON.stringify(target));
//             }
//             return result ? true : false;
//         }
//     };
// };
