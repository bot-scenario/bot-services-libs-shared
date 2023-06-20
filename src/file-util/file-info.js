import { fileTypeFromBuffer } from 'file-type'
import { readChunk } from 'read-chunk'

export const getMimeType = async (fileName, length = 1000) => {
  const buffer = await readChunk(fileName, { length })
  const type = await fileTypeFromBuffer(buffer)
  return type
}

export const extractExtension = (fileName) => {
  return fileName.substring(fileName.lastIndexOf('.') + 1)
}
