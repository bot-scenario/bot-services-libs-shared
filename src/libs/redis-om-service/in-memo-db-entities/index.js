import { PlatformSchema } from '../schema/platform.js'
import { ChatterSchema } from '../schema/chatter.js'
import { initRepositories } from '../repositories/init-repositories.js'
import { initPlatforms } from './Platforms.js'
import { initChatter } from './Chatter.js'

export const initializeInMemoRepositories = async ({ url }) => {
  const { Chatters, Platforms } = await initRepositories({
    url,
    schemas: {
      Platforms: PlatformSchema,
      Chatters: ChatterSchema,
    },
  })

  await Chatters.search().return.first()
  await Platforms.search().return.first()

  return {
    Chatters: initChatter({ Chatters }),
    Platforms: initPlatforms({ Platforms }),
  }
}
