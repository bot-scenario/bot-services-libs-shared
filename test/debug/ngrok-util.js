import { getCurrentRunningNgrok } from '../../index.js'
;(async () => {
  const url = await getCurrentRunningNgrok()
  console.log(url)
})()
