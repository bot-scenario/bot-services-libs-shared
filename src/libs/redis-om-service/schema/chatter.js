import { Entity, Schema } from 'redis-om'

export class Chatters extends Entity {
  get lastAnswerMessages() {
    return this.lastAnswerMessagesStringify
      ? JSON.parse(this.lastAnswerMessagesStringify)
      : this.lastAnswerMessagesStringify
  }
}

const ChatterProperties = {
  chatId: { type: 'number' },
  botId: { type: 'string' },
  stage: { type: 'number' },
  lastAnswerMessagesStringify: { type: 'text' },
}

export const ChatterSchema = new Schema(Chatters, ChatterProperties, {
  dataStructure: 'JSON',
})
