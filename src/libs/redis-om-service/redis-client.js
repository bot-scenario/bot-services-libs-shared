import { Client } from 'redis-om'

export const redisConnect = async ({ url }) => {
  let client
  try {
    client = new Client()
    await client.open(url)
    return client
  } catch (error) {
    if (client) {
      await client?.close()
    }
    console.log(error)
    throw error
  }
}
