import { getMimeType } from '../index.js'
import * as url from 'url'
import path from 'path'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
console.log('the dir name', __dirname)
const file1 = path.resolve(__dirname, './data/thefile')

;(async () => {
  const mime = await getMimeType(file1)
  console.log(mime)
})()
