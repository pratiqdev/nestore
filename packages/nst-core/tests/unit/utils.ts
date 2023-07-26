import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);
export const expect = chai.expect;

const COLORS = {
    reset: '\x1b[0m',

    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
 
    blackBg: '\x1b[40m',
    redBg: '\x1b[41m',
    greenBg: '\x1b[42m',
    yellowBg: '\x1b[43m',
    blueBg: '\x1b[44m',
    magentaBg: '\x1b[45m',
    cyanBg: '\x1b[46m',
    whiteBg: '\x1b[47m'
}

export const heading = (text = '') => `${COLORS.blue}${text}\n  ${'-'.repeat(process?.stdout.columns ?? 10 - 10)}${COLORS.reset}`


/*
Using thse colors (intended for console/terminal):
const COLORS = {
    reset: '\x1b[0m',

    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
 
    blackBg: '\x1b[40m',
    redBg: '\x1b[41m',
    greenBg: '\x1b[42m',
    yellowBg: '\x1b[43m',
    blueBg: '\x1b[44m',
    magentaBg: '\x1b[45m',
    cyanBg: '\x1b[46m',
    whiteBg: '\x1b[47m'
}
Write a function or class for me using typescript (fully typed). The function or class is intended to track and log 
events from functions, once the function is complete or the logger functions 'done' method is called, for example:
```ts

const myStoreAccessor_Get_Function = async (arg1:string, arg2:number) => {
    const L = new Logger({
        action: 'get',
        scope: 'myStoreAccessor_Get_Function',
    })
    L.log('doing some work') // accumulate these messages as a group with a time since
    const result = await someLongFunc()
    L.out(result) // the out data should always be grouped with the input args
    L.mutate({
        input: [arg1, arg2],
        output: result
    })
    L.fatal(err) // should log all accumulated messages then throw an error
    L.done('done!') // the message accumulation is complete - print everything out, with optional final message

}
```
The log output should contain a unique id of the logger instance, the current timestamp
The log output should resemble this:
[uuid|  > |time]
[uuid| <  |time]
WHERE:
uuid: 4 char unique id provided by func `tinyId(4)`
' <  ' or '  > ': icon for 'out' and 'in' respectively
time:
*/