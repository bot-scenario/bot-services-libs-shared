export const updateInMemoEntity = ({ entity, valuesToUpdate }) => {
  const updated = Object.entries(valuesToUpdate).reduce(
    (entity, [key, value]) => {
      entity[key] = value
      return entity
    },
    entity,
  )
  return updated
}
