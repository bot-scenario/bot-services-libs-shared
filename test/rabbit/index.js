import { rabbitUriFromEnv } from '../../src/libs/queue-service.js'

const host = rabbitUriFromEnv({
  RABBIT_HOST: '0.0.0.0',
  RABBIT_PORT: 5672,
  RABBIT_USERNAME: 'bot',
  RABBIT_PASSWORD: 'bot',
  RABBIT_PROTOCOL: undefined,
})

console.log(host)
