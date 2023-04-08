import { Entity, Schema } from 'redis-om'

class Configuration extends Entity {}

const ConfigurationProperties = {
  _id: { type: 'string' },
  token: { type: 'string' },
  email: { type: 'string' },
  name: { type: 'string' },
  application: { type: 'string' },
  graph: { type: 'string' /* JSON string  */ },
}

export const ConfigurationSchema = new Schema(
  Configuration,
  ConfigurationProperties,
  {
    dataStructure: 'JSON',
  },
)
