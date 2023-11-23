import { updateInMemoEntity } from './util.js'

export const initPlatforms = ({ Platforms }) => {
  const findOne = async ({ id }) => {
    const platform = await Platforms.search().where('id').is.equal(id).first()

    return platform
  }

  const updateOne = async ({ id }, { updatedValues }) => {
    const platform = await findOne({ id })
    updateInMemoEntity({ entity: platform, valuesToUpdate: updatedValues })
    await Platforms.save(platform)
    return findOne({ id })
  }

  const create = async ({ platform }) => {
    const entity = await Platforms.createEntity(platform)
    await Platforms.save(entity)
    return findOne({ id: platform.id })
  }

  const updatePlatformUserActivationCode = async (
    { id },
    { userActivationCode },
  ) => {
    const entity = await findOne({ id })
    const userActivationCodes = JSON.parse(entity?.userActivationCodes || '[]')
    userActivationCodes.push(userActivationCode)

    updateInMemoEntity({
      entity,
      valuesToUpdate: {
        userActivationCodes: JSON.stringify(userActivationCodes),
      },
    })
    await Platforms.save(entity)
  }

  return {
    create,
    findOne,
    updateOne,
    updatePlatformUserActivationCode,
  }
}
