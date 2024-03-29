import { DATABASE_ID_PREFIX } from '../constants/database-ids-prefixes.js'
import { fileTypeFromBuffer } from 'file-type'
import { readChunk } from 'read-chunk'
import { v4 } from 'uuid'

export const getMimeType = async (fileName, length = 1000) => {
  const buffer = await readChunk(fileName, { length })
  const type = await fileTypeFromBuffer(buffer)
  return type
}

export const extractExtension = (fileName) => {
  return fileName.substring(fileName.lastIndexOf('.') + 1)
}

export const generateFileId = () => {
  return `${DATABASE_ID_PREFIX.FILE}_${v4()}`
}
