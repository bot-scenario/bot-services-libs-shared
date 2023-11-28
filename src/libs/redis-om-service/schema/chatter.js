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
  dynamicResponseStringify: { type: 'string' },
}

export const ChatterSchema = new Schema(Chatters, ChatterProperties, {
  dataStructure: 'JSON',
})
