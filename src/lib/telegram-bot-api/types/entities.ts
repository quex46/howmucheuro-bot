export type AnyDict = {
  [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
};

export type Message = AnyDict;

export type User = AnyDict;

export type MessageEntity = {
  type: string;
  offset: number;
  length: number;
  url?: string;
  user?: User;
  language?: string;
};

export type InlineKeyboardButton = AnyDict;

export type KeyboardButton = AnyDict;

export type InlineKeyboardMarkup = {
  inline_keyboard: InlineKeyboardButton[][];
};

export type ReplyKeyboardMarkup = {
  keyboard: KeyboardButton[][];
  resize_keyboard?: boolean;
  one_time_keyboard?: boolean;
  input_field_placeholder?: string;
  selective?: boolean;
};

export type ReplyKeyboardRemove = {
  remove_keyboard: boolean;
  selective?: boolean;
};

export type ForceReply = {
  force_reply: boolean;
  input_field_placeholder?: string;
  selective?: boolean;
};

export type Update = {
  update_id: number;
  message?: Message;
  edited_message?: Message;
  channel_post?: Message;
  edited_channel_post?: Message;
  // TODO: Extend schema.
};
