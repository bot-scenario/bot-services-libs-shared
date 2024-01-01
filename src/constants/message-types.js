export const MESSAGE_MEDIA_TYPE = {
  TEXT: 'text',
  POLL: 'poll',
  VIDEO: 'video',
  PHOTO: 'photo',
  IMAGE: 'image',
  VOICE: 'voice',
  AUDIO: 'audio',
  STICKER: 'sticker',
  CONTACT: 'contact',
  REACTION: 'reaction',
  DOCUMENT: 'document',
  LOCATION: 'location',
  CONTACTS: 'contacts',
  VIDEO_NOTE: 'video_note',
  BUTTON_CLICK: 'button_click',
}

export const MESSAGE_TYPE = {
  MESSAGE: 'message',
  BUTTON_CLICK: 'button_click',
  UNKNOWN_MESSAGE_TYPE: 'unknown_message_type',
}

export const MESSAGE_MEDIA_TYPE_MAPPER = {
  [MESSAGE_MEDIA_TYPE.VOICE]: MESSAGE_MEDIA_TYPE.AUDIO,
  [MESSAGE_MEDIA_TYPE.PHOTO]: MESSAGE_MEDIA_TYPE.IMAGE,
  [MESSAGE_MEDIA_TYPE.CONTACTS]: MESSAGE_MEDIA_TYPE.CONTACT,
}
