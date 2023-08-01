import crypto from 'crypto'

export const symmetricEncryption = {
  encrypt({
    key,
    plainText,
    algorithm = 'aes256',
    inputEncoding = 'utf8',
    outputEncoding = 'hex',
    ivlength = 16,
  }) {
    const bufferedKey = Buffer.from(key, 'latin1')
    // create a random initialization vector
    const iv = crypto.randomBytes(ivlength) //.toString('base64')

    // create a cipher object
    const cipher = crypto.createCipheriv(algorithm, bufferedKey, iv)

    // update the cipher object with the plainText to encrypt
    const cipherTextUpdated = cipher.update(
      plainText,
      inputEncoding,
      outputEncoding,
    )

    // finalize the encryption process
    const cipherTextFinal = cipher.final(outputEncoding)

    const cipherText = `${iv.toString(
      outputEncoding,
    )}:${cipherTextUpdated}${cipherTextFinal}`

    return { cipherText, iv }
  },

  decrypt({
    key,
    cipherText,
    algorithm = 'aes256',
    inputEncoding = 'utf8',
    outputEncoding = 'hex',
  }) {
    // create a decipher object
    const parts = cipherText.split(':')

    const ivBuffered = Buffer.from(parts.shift(), outputEncoding)

    const bufferedKey = Buffer.from(key, 'latin1')

    const decipher = crypto.createDecipheriv(algorithm, bufferedKey, ivBuffered)

    // update the decipher object with the base64-encoded cipherText
    const plainTextUpdated = decipher.update(
      parts.join(':'),
      outputEncoding,
      inputEncoding,
    )

    // finalize the decryption process
    const plainTextFinal = decipher.final(inputEncoding)

    const plainText = `${plainTextUpdated}${plainTextFinal}`

    return plainText
  },
}
