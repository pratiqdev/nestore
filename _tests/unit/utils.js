import {expect as exp} from 'chai'

export const expect = exp

export const match = (a,b) => expect(a).to.eq(b)

export const matchStringified = (a,b) => expect(JSON.stringify(a)).to.eq(JSON.stringify(b))

export const matchExact = (a,b) => {
    let errs = 0
    errs += a === b ? 0 : 1
    errs += (typeof a === typeof b || a instanceof b || b instanceof a) ? 0 : 1
    errs += JSON.stringify(a) === JSON.stringify(b) ? 0 : 1

    expect(errs).to.eq(0)
    expect(a).to.eq(b)
}

export const colors = {
    reset:"\x1b[0m",
    bright:"\x1b[1m",
    dim:"\x1b[2m",
    underscore:"\x1b[4m",

    red:"\x1b[31m",
    green:"\x1b[32m",
    yellow:"\x1b[33m",
    blue:"\x1b[34m",
    magenta:"\x1b[35m",
    cyan:"\x1b[36m",
    white:"\x1b[37m",
    grey:"\x1b[2m",

    RED:"\x1b[31m\x1b[1m",
    GREEN:"\x1b[32m\x1b[1m",
    YELLOW:"\x1b[33m\x1b[1m",
    BLUE:"\x1b[34m\x1b[1m",
    MAGENTA:"\x1b[35m\x1b[1m",
    CYAN:"\x1b[36m\x1b[1m",
    WHITE:"\x1b[37m\x1b[1m",
    GREY:"\x1b[2m\x1b[1m",
}

export const h1 = (val) => {
    return colors.BLUE + val + '\n  ' + colors.reset + colors.dim + '-'.repeat(process.stdout.columns - 8)
}