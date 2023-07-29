import { Entity, Schema } from 'redis-om'

export class ChatInfo extends Entity {
  get lastAnswerMessages() {
    return this.lastAnswerMessagesStringify
      ? JSON.parse(this.lastAnswerMessagesStringify)
      : this.lastAnswerMessagesStringify
  }
}

const ChatInfoProperties = {
  chatId: { type: 'number' },
  botId: { type: 'string' },
  stage: { type: 'number' },
  lastAnswerMessagesStringify: { type: 'text' },
}

export const ChatInfoSchema = new Schema(ChatInfo, ChatInfoProperties, {
  dataStructure: 'JSON',
})
