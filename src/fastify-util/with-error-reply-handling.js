import httpStatus from 'http-status'
import { stringifyError, HttpError } from 'botscenario-shared'

const GENERAL_ERROR = {
  httpStatusCode: httpStatus.INTERNAL_SERVER_ERROR,
  code: 'UNKNOWN',
  httpStatusText: httpStatus[httpStatus.INTERNAL_SERVER_ERROR],
}
export const withErrorHandling =
  (log, defaultError) => async (funcToInvoke) => {
    try {
      return await funcToInvoke()
    } catch (error) {
      log.error(`[!] [withErrorHandling] - Error: ${stringifyError(error)}`)

      throw HttpError.isInstanceOf(error) ? error : defaultError
    }
  }

export const withErrorHandlingReply =
  ({ reply, log, defaultError = new HttpError(GENERAL_ERROR) }) =>
  async (funcToInvoke) => {
    try {
      return await withErrorHandling(log, defaultError)(funcToInvoke)
    } catch (error) {
      const { httpStatusCode, code, httpStatusText, details } = error
      reply.status(httpStatusCode).send({ code, httpStatusText, details })
    }
  }

export const replyOnErrorOnly =
  ({ reply, log, defaultError = GENERAL_ERROR }) =>
  async (funcToInvoke) => {
    try {
      return await withErrorHandling(log, defaultError)(funcToInvoke)
    } catch (error) {
      log.error(`[!] [replyOnErrorOnly] Error: ${error?.valueOf()}`)
      const errorMerged = HttpError.isInstanceOf(error)
        ? error
        : { ...error, ...defaultError }

      reply.status(errorMerged.statusCode).send({ error: errorMerged.exposed })
    }
  }
