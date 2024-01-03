import { Entity, Schema } from 'redis-om'

export class Chatters extends Entity {
  #dynamicResponseReady
  #dynamicResponseReadyStringify

  get dynamicResponse() {
    if (this.#dynamicResponseReadyStringify !== this.dynamicResponseStringify) {
      this.#dynamicResponseReady = Graph(
        JSON.parse(this.dynamicResponseStringify),
      )
      this.#dynamicResponseReadyStringify = this.dynamicResponseStringify
    }

    return this.#dynamicResponseReady
  }

  get lastOutgoingMessages() {
    return this.lastOutgoingMessagesStringify
      ? JSON.parse(this.lastOutgoingMessagesStringify)
      : this.lastOutgoingMessagesStringify
  }

  get lastIncomingMessages() {
    return this.lastIncomingMessagesStringify
      ? JSON.parse(this.lastIncomingMessagesStringify)
      : this.lastIncomingMessagesStringify
  }
}

const ChatterProperties = {
  chatId: { type: 'string' },
  botId: { type: 'string' },
  stage: { type: 'number' },
  lastOutgoingMessagesStringify: { type: 'text' },
  lastIncomingMessagesStringify: { type: 'text' },
  dynamicResponseStringify: { type: 'string' },
}

export const ChatterSchema = new Schema(Chatters, ChatterProperties, {
  dataStructure: 'JSON',
})
