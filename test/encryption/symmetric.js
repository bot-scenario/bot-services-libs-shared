import { symmetricEncryption } from '../../index.js'

const key = '!2#QaF#4%&cd#2D5re@#*()gRESvj012'
const token = 'sdf@#$sdgfsdfasdfjkSDGASJLrro0'

const { cipherText, iv } = symmetricEncryption.encrypt({
  key,
  plainText: token,
})

const dec = symmetricEncryption.decrypt({ key, cipherText, iv })

console.log(`PlainText: ${token}, enc: ${(cipherText, iv)}, dec: ${dec}`)
