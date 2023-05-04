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
  
  