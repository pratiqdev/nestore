export type Thang = string 
export type Whut = string | number

interface Window {
    myCustomProperty: string;
  }
  
  declare global {
    interface Window {
      mainFunc?: () => void;
    }
  }