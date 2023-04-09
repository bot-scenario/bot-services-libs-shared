import amqp from 'amqplib'
import { v4 } from 'uuid'

export const connectQueueService = async ({ host }) => {
  try {
    const connection = await amqp.connect(host)
    return connection
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const createChanel = async ({ queue, host }) => {
  try {
    const connection = await connectQueueService({ host })
    const channel = await connection.createChannel()

    await channel.assertQueue(queue)
    return channel
  } catch (error) {
    console.log(error)
    throw error
  }
}

const parseMessage = (msgInfo) => {
  const { content } = msgInfo
  return JSON.parse(content.toString())
}

export const consumeQueue = async ({
  channel,
  queue,
  onReceive,
  log,
  nackOnError = false,
}) => {
  try {
    channel.consume(queue, async (msgInfo) => {
      try {
        const { msgId, data } = parseMessage(msgInfo)
        log.info(`Handling message: ${msgId}`)
        await onReceive(data)
        channel.ack(msgInfo)
      } catch (error) {
        const { msgId } = parseMessage(msgInfo)
        log.error(`Error while handling message: ${msgId}`)
        if (nackOnError) {
          channel.nack(msgInfo)
        } else {
          channel.ack(msgInfo)
        }
      }
    })
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const initializeQueue = async ({ host, queue, log }) => {
  const channel = await createChanel({ host, queue, log })

  const push = async (data) => {
    const msgId = v4()
    try {
      log.info(`Pushing to queue msgId: ${msgId}`)
      const res = await channel.sendToQueue(
        queue,
        Buffer.from(JSON.stringify({ msgId, data })),
      )
      return res
    } catch (error) {
      log.error(`Error while pushing to queue msgId: ${msgId}`)
      log.error(error)

      throw error
    }
  }
  const innerConsumeQueue = ({ queue, onReceive }) =>
    consumeQueue({ channel, queue, log, onReceive })

  return {
    push,
    consumeQueue: innerConsumeQueue,
  }
}
