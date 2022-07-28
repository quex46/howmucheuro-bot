import fetch from 'node-fetch';

import * as entities from './types/entities';
import * as params from './types/params';

export default class TelegramBotApi {
  constructor(private readonly token: string) {}

  private async invoke<T, K>(methodName: string, body?: K): Promise<T> {
    const res = await fetch(`https://api.telegram.org/bot${this.token}/${methodName}`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });

    const json = (await res.json()) as { ok: boolean; result: T };

    if (json.ok) {
      return json.result as T;
    }

    throw new Error(`Telegram Bot API request error: ${JSON.stringify(json)}`);
  }

  public async sendMessage(body: params.SendMessageParams): Promise<entities.Message> {
    return this.invoke('sendMessage', body);
  }

  public async setWebhook(url: string, secret?: string): Promise<void> {
    return this.invoke('setWebhook', {
      url,
      drop_pending_updates: true,
      secret_token: secret,
    });
  }

  public async leaveChat(chatId: number): Promise<void> {
    return this.invoke('leaveChat', {
      chat_id: chatId,
    });
  }
}
