export const createWebhookUrl = ({ webhookEndpoint, pathParams }) => {
  const webhookUrl = Object.entries(pathParams).reduce((url, [key, value]) => {
    return url.replace(`:${key}`, value)
  }, webhookEndpoint)
  return webhookUrl
}
