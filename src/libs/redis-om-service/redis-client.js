import { Client } from 'redis-om'

export const redisConnect = async ({ url }) => {
  let client
  try {
    client = new Client(url)
    await client.open()
    return client
  } catch (error) {
    if (client) {
      await client?.close()
    }
    console.log(error)
    throw error
  }
}
