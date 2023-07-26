let rootNamespace: string = '@nst'

export const colors = {
    modifiers: {
        reset: "\x1b[0m",
        bright: "\x1b[1m",
        dim: "\x1b[2m",
        underscore: "\x1b[4m",
        blink: "\x1b[5m",
        reverse: "\x1b[7m",
        hidden: "\x1b[8m",
    },
    primary: {
        red_dim: "\x1b[2m\x1b[31m",
        red: "\x1b[0m\x1b[31m",
        red_bright: "\x1b[1m\x1b[31m",
        
        green_dim: "\x1b[2m\x1b[32m",
        green: "\x1b[0m\x1b[32m",
        green_bright: "\x1b[1m\x1b[32m",
        
        yellow_dim: "\x1b[2m\x1b[33m",
        yellow: "\x1b[0m\x1b[33m",
        yellow_bright: "\x1b[1m\x1b[33m",
    
        blue_dim: "\x1b[2m\x1b[34m",
        blue: "\x1b[0m\x1b[34m",
        blue_bright: "\x1b[1m\x1b[34m",
        
        magenta_dim: "\x1b[2m\x1b[35m",
        magenta: "\x1b[0m\x1b[35m",
        magenta_bright: "\x1b[1m\x1b[35m",
        
        cyan_dim: "\x1b[2m\x1b[36m",
        cyan: "\x1b[0m\x1b[36m",
        cyan_bright: "\x1b[1m\x1b[36m",
    }
  }
  
  
function hashString(str:string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        let char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to a 32-bit integer
    }
    return hash;
}

function getColor(str:string) {
    let hash = hashString(str);
    // Make sure it's positive and fits in the array bounds
    let index = Math.abs(hash) % Object.values(colors.primary).length; 
    return Object.values(colors.primary)[index];
}
  
class Debug {
    globalNamespace: string;
    namespace: string;
    forceEnabled: boolean;  
    color: string;
  
    constructor(namespace:string, globalNamespace:string) {
        this.namespace = namespace;
        this.forceEnabled = false
        this.globalNamespace = globalNamespace
        this.color = getColor(namespace)
    }
  
    enable(){
        this.forceEnabled = true
    }
  
    disable(){
        this.forceEnabled = false
    }
  
    log(...args: any[]) {
        if (this.forceEnabled 
            || this.globalNamespace === '*'
            || this.globalNamespace === rootNamespace
            || this.globalNamespace === rootNamespace + this.namespace
            || this.globalNamespace === this.namespace
            || (this.globalNamespace !== '' && this.namespace.includes(this.globalNamespace))
        ) {
            console.log(`${this.color}${rootNamespace}:${this.namespace}${colors.modifiers.reset}`, ...args);
        }
    }
}

export const debug = (namespace:string, globalNamespace:string) => new Debug(namespace, globalNamespace)
  
// import { createLogger, format, transports } from 'winston'

// const logger = createLogger({
//   level: 'info',
//   format: format.combine(
//     format.timestamp({
//       format: 'YYYY-MM-DD HH:mm:ss'
//     }),
//     format.errors({ stack: true }),
//     format.splat(),
//     format.json()
//   ),
//   defaultMeta: { service: 'your-service-name' },
//   transports: [
//     //
//     // - Write to all logs with level `info` and below to `quick-start-combined.log`.
//     // - Write all logs error (and below) to `quick-start-error.log`.
//     //
//     new transports.File({ filename: 'quick-start-error.log', level: 'error' }),
//     new transports.File({ filename: 'quick-start-combined.log' })
//   ]
// });

// //
// // If we're not in production then **ALSO** log to the `console`
// // with the colorized simple format.
// //
// if (process.env.NODE_ENV !== 'production') {
//   logger.add(new transports.Console({
//     format: format.combine(
//       format.colorize(),
//       format.simple()
//     )
//   }));
// }

// // ***************
// // Allows for JSON logging
// // ***************

// logger.log({
//   level: 'info',
//   message: 'Pass an object and this works',
//   additional: 'properties',
//   are: 'passed along'
// });

// logger.info({
//   message: 'Use a helper method if you want',
//   additional: 'properties',
//   are: 'passed along'
// });

// // ***************
// // Allows for parameter-based logging
// // ***************

// logger.log('info', 'Pass a message and this works', {
//   additional: 'properties',
//   are: 'passed along'
// });

// logger.info('Use a helper method if you want', {
//   additional: 'properties',
//   are: 'passed along'
// });

// // ***************
// // Allows for string interpolation
// // ***************

// // info: test message my string {}
// logger.log('info', 'test message %s', 'my string');

// // info: test message 123 {}
// logger.log('info', 'test message %d', 123);

// // info: test message first second {number: 123}
// logger.log('info', 'test message %s, %s', 'first', 'second', { number: 123 });

// // prints "Found error at %s"
// logger.info('Found %s at %s', 'error', new Date());
// logger.info('Found %s at %s', 'error', new Error('chill winston'));
// logger.info('Found %s at %s', 'error', /WUT/);
// logger.info('Found %s at %s', 'error', true);
// logger.info('Found %s at %s', 'error', 100.00);
// logger.info('Found %s at %s', 'error', ['1, 2, 3']);

// // ***************
// // Allows for logging Error instances
// // ***************

// logger.warn(new Error('Error passed as info'));
// logger.log('error', new Error('Error passed as message'));

// logger.warn('Maybe important error: ', new Error('Error passed as meta'));
// logger.log('error', 'Important error: ', new Error('Error passed as meta'));

// logger.error(new Error('Error as info'));