import { updateInMemoEntity } from './util.js'

export const initChatter = ({ Chatters }) => {
  const createDefaultValues = {
    lastAnswerMessagesStringify: '[]',
    stage: 0,
  }

  const findOne = async ({ botId, chatId }) => {
    const chatter = await Chatters.search()
      .where('chatId')
      .is.equal(chatId)
      .and('botId')
      .is.equal(botId)
      .first()

    return chatter
  }

  const find = async ({ botId }) => {
    const chatters = await Chatters.search()
      .and('botId')
      .is.equal(botId)
      .return.all()

    return chatters
  }

  const updateOne = async ({ botId, chatId }, { updatedValues }) => {
    const chatter = await findOne({ chatId, botId })
    updateInMemoEntity({ entity: chatter, valuesToUpdate: updatedValues })
    await Chatters.save(chatter)
    return findOne({ botId, chatId })
  }

  const update = async ({ botId }, { updatedValues }) => {
    const chatters = await find({ botId })

    return Promise.all(
      chatters.map((chatter) => {
        updateInMemoEntity({ entity: chatter, valuesToUpdate: updatedValues })
        return Chatters.save(chatter)
      }),
    )
  }

  const create = async (chatter) => {
    const entity = await Chatters.createEntity({
      ...createDefaultValues,
      ...chatter,
    })
    await Chatters.save(entity)
    return findOne(chatter)
  }

  const upsert = async (chatter) => {
    const { botId, chatId, ...updatedValues } = chatter
    const entity = await findOne({ chatId, botId })
    if (entity) {
      return updateOne({ botId, chatId }, { updatedValues })
    }
    return create(chatter)
  }

  return {
    find,
    update,
    upsert,
    create,
    findOne,
    updateOne,
  }
}
