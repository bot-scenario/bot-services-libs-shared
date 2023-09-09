import { Entity, Schema } from 'redis-om'

class Platform extends Entity {}

const PlatformProperties = {
  _id: { type: 'string' },
  token: { type: 'string' },
  email: { type: 'string' },
  name: { type: 'string' },
  application: { type: 'string' },
  graph: { type: 'string' /* JSON string  */ },
  nodes: { type: 'string' /* JSON string  */ },
  tenantConfigurations: { type: 'string' /* JSON string  */ },
}

export const PlatformSchema = new Schema(Platform, PlatformProperties, {
  dataStructure: 'JSON',
})
