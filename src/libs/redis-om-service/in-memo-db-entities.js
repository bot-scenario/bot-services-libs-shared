import { PlatformSchema } from './schema/platform.js'
import { ChatInfoSchema } from './schema/chat-info.js'
import { initRepositories } from '../../libs/redis-om-service/repositories/init-repositories.js'

export const initializeInMemoRepositories = async ({ REDIS_URL }) => {
  const { ChatInfo, Platforms } = await initRepositories({
    url: REDIS_URL,
    schemas: {
      Platforms: PlatformSchema,
      ChatInfo: ChatInfoSchema,
    },
  })

  await ChatInfo.search().return.first()
  await Platforms.search().return.first()

  const updateInMemoEntity = ({ entity, valuesToUpdate }) => {
    const updated = Object.entries(valuesToUpdate).reduce(
      (entity, [key, value]) => {
        entity[key] = value
        return entity
      },
      entity,
    )
    return updated
  }

  const getPlatform = async ({ botId }) => {
    const platform = await Platforms.search()
      .where('_id')
      .is.equal(botId)
      .first()
    return platform
  }

  const getChatInfo = async ({ chatId, botId }) => {
    const chatInfo = await ChatInfo.search()
      .where('chatId')
      .is.equal(chatId)
      .and('botId')
      .is.equal(botId)
      .first()

    return chatInfo
  }

  const updateChatInfo = async ({ botId, chatId }, { chatInfoUpdated }) => {
    const chat = await getChatInfo({ chatId, botId })
    updateInMemoEntity({ entity: chat, valuesToUpdate: chatInfoUpdated })
    await ChatInfo.save(chat)
    return chat
  }

  const updatePlatform = async ({ botId }, { platformUpdated }) => {
    const platform = await getPlatform({ botId })
    updateInMemoEntity({ entity: platform, valuesToUpdate: platformUpdated })
    await ChatInfo.save(platform)
    return platform
  }

  return {
    getChatInfo,
    getPlatform,
    updatePlatform,
    updateChatInfo,
  }
}
