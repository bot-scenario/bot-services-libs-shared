import { Repository } from 'redis-om'
import { redisConnect } from '../redis-client.js'

export const initRepository = async ({ schema, client }) => {
  const repository = new Repository(schema, client)
  await repository.dropIndex() // If already exist drop it
  await repository.createIndex() // Create a primary key for the document
  return client.fetchRepository(schema)
}

export const initRepositories = async ({ url, schemas }) => {
  const client = await redisConnect({ url })
  const schemaDefs = Object.entries(schemas)
  const repositories = await Promise.all(
    schemaDefs.map(async ([schemaName, schema]) => {
      const repo = await initRepository({
        schema,
        client,
      })
      return { [schemaName]: repo }
    }),
  )

  return repositories.reduce((repos, repo) => {
    return {
      ...repos,
      ...repo,
    }
  }, {})
}
