import {
  MESSAGE_MEDIA_TYPE,
  MESSAGE_TYPE,
} from '../../constants/telegram-message-types.js'

export const isItMediaType =
  (mediaType) =>
  ({ messageInfo: { message } }) => {
    return mediaType in message
  }

export const isMessageTypeof =
  (typeOfMessage) =>
  ({ messageInfo: { type } }) => {
    return type === typeOfMessage
  }

export const isItPoll = isItMediaType(MESSAGE_MEDIA_TYPE.POLL)
export const isItVideoNote = isItMediaType(MESSAGE_MEDIA_TYPE.VIDEO_NOTE)
export const isItVoice = isItMediaType(MESSAGE_MEDIA_TYPE.VOICE)
export const isItLocation = isItMediaType(MESSAGE_MEDIA_TYPE.LOCATION)
export const isItVideo = isItMediaType(MESSAGE_MEDIA_TYPE.VIDEO)
export const isItPhoto = isItMediaType(MESSAGE_MEDIA_TYPE.PHOTO)
export const isItDocument = isItMediaType(MESSAGE_MEDIA_TYPE.DOCUMENT)
export const isItFreeText = isItMediaType(MESSAGE_MEDIA_TYPE.TEXT)
export const isItButtonClick = isMessageTypeof(MESSAGE_TYPE.BUTTON_CLICK)
export const isItMessage = isMessageTypeof(MESSAGE_TYPE.MESSAGE)

export const getMessageType = ({ messageInfo }) => {
  switch (true) {
    case isItFreeText({ messageInfo }):
      return MESSAGE_MEDIA_TYPE.TEXT
    case isItVideo({ messageInfo }):
      return MESSAGE_MEDIA_TYPE.VIDEO
    case isItPhoto({ messageInfo }):
      return MESSAGE_MEDIA_TYPE.PHOTO
    case isItDocument({ messageInfo }):
      return MESSAGE_MEDIA_TYPE.DOCUMENT
    case isItLocation({ messageInfo }):
      return MESSAGE_MEDIA_TYPE.LOCATION
    case isItVoice({ messageInfo }):
      return MESSAGE_MEDIA_TYPE.VOICE
    case isItVideoNote({ messageInfo }):
      return MESSAGE_MEDIA_TYPE.VIDEO_NOTE
    case isItPoll({ messageInfo }):
      return MESSAGE_MEDIA_TYPE.POLL
    case isItButtonClick({ messageInfo }):
      return MESSAGE_TYPE.BUTTON_CLICK
    case isItMessage({ messageInfo }):
      return MESSAGE_MEDIA_TYPE.MESSAGE

    default:
      return MESSAGE_TYPE.UNKNOWN_MESSAGE_TYPE
  }
}
