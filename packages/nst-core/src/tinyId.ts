const alphanumerical = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

const tinyId = (length: number = 16, set:string = alphanumerical, breakInterval:number = 4) => {
  let id = ''
  let breakCount = 0

  while(id.length < length + breakCount){
    let rand = Math.floor(Math.random() * set.length)
    id += set.substring(rand, rand+1)

    if(
        (id.length - breakCount !== length) 
        && (id.length - breakCount) % breakInterval === 0
    ){
      id += '-'
      breakCount++
    }
  }

  return id
}

export default tinyId