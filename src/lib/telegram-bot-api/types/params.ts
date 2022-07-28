import * as entities from './entities';

export type SendMessageParams = {
  chat_id: string | number;
  text: string;
  parse_mode?: string;
  entities?: entities.MessageEntity[];
  disable_web_page_preview?: boolean;
  disable_notification?: boolean;
  protect_content?: boolean;
  reply_to_message_id?: number;
  allow_sending_without_reply?: boolean;
  reply_markup?: entities.InlineKeyboardMarkup
  | entities.ReplyKeyboardMarkup
  | entities.ReplyKeyboardRemove
  | entities.ForceReply;
};
