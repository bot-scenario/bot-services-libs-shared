import { Client } from 'redis-om'

export const redisConnect = async ({ url }) => {
  try {
    const client = new Client(url)
    await client.open()
    return client
  } catch (error) {
    await client.close()
    console.log(error)
    throw error
  }
}
