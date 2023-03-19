import { Entity, Schema } from 'redis-om'

class ChatInfo extends Entity {}

const ChatInfoProperties = {
  chatId: { type: 'number' },
  botId: { type: 'string' },
  stage: { type: 'number' },
}

export const ChatInfoSchema = new Schema(ChatInfo, ChatInfoProperties, {
  dataStructure: 'JSON',
})
