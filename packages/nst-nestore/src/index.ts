import util1 from './util1'
import util2 from './util2'
import { Whut, Thang } from './types'



const mainFunc = (): Thang => {
    return util1() + util2()
}

if(typeof window !== 'undefined'){
    window.mainFunc  = mainFunc
}

export default mainFunc