import fetch from 'node-fetch'
import childProcess from 'child_process'
const { exec } = childProcess
const sleep = async (milliseconds) => {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds)
  })
}
export const getCurrentRunningNgrok = async (
  ngrokTunnelsUrl = 'http://127.0.0.1:4040/api/tunnels',
) => {
  try {
    const res = await fetch(ngrokTunnelsUrl)
    const { tunnels } = await res.json()
    const { public_url } = tunnels.find(({ proto }) => proto === 'https')
    return public_url
  } catch (error) {
    return null
  }
}

const runNgrokBackground = ({ port = 1234 } = {}) => {
  try {
    exec(`ngrok http ${port} &`)
  } catch (error) {
    console.log(error)
  }
}

export const getProxy = async ({
  port = 1234,
  maxRetry = 3,
  ngrokTunnelsUrl = 'http://127.0.0.1:4040/api/tunnels',
}) => {
  try {
    let currentUrl = await getCurrentRunningNgrok(ngrokTunnelsUrl)

    if (!currentUrl && maxRetry) {
      runNgrokBackground({ port })
      await sleep(2000)
      return getProxy({ port, ngrokTunnelsUrl, maxRetry: maxRetry - 1 })
    }

    console.log(`Ngrok url: ${currentUrl}`)
    if (!currentUrl) {
      throw new Error(`Couldn't get ngrok url`)
    }
    return currentUrl
  } catch (error) {
    console.error(error)
  }
}
