import numeral from 'numeral';
import ExchangeRatesApi from '../../lib/currency-rates-api/ExchangeRatesApi';
import PriceParser, { PriceEntity } from '../../lib/price-parser/price-parser';
import TelegramBotApi from '../../lib/telegram-bot-api/telegram-bot-api';
import { ApiGatewayEvent, ApiGatewayResponse } from '../types';
import { modifiers, currencies } from '../../config/price-parser';

const {
  TELEGRAM_BOT_TOKEN,
  APILAYER_API_KEYS,
  TELEGRAM_BOT_ALLOWED_CHATS,
} = process.env;

const telegram = new TelegramBotApi(TELEGRAM_BOT_TOKEN as string);
const exchange = new ExchangeRatesApi((APILAYER_API_KEYS as string).split(','));
const parser = new PriceParser({ modifiers, currencies });

const chats = (TELEGRAM_BOT_ALLOWED_CHATS ?? '').split(',');

const RESPONSE_OK = {
  statusCode: 200,
  body: '{}',
};

const handleParsed = async (parsed: PriceEntity[]): Promise<string> => {
  if (!parsed.length) {
    return '';
  }

  console.info('Handling parsed %s', JSON.stringify(parsed));

  const res = await Promise.all(parsed.map(async (p) => {
    const { value } = p;
    const { asset, symbol } = p.currency;
    const quotes = currencies.filter((a) => a.asset !== asset);
    const rates = await exchange.getExchangeRates(asset, quotes.map((q) => q.asset));
    const lines = [
      `*${numeral(value).format('0,0[.]00')}${symbol} (${asset})* это:`,
    ];
    for (let i = 0; i < quotes.length; i += 1) {
      const q = quotes[i];
      const r = rates[q.asset] ?? 0;
      const v = r ? numeral((value * r).toFixed(2)).format('0,0[.]00') : '';
      if (v) {
        lines.push(`• ${v}${q.symbol} (${q.asset})`);
      }
    }
    return lines.join('\r\n');
  }));

  console.info('Successfuly fetched exchange rates data');

  return res.join('\r\n\r\n');
};

export default async (e: ApiGatewayEvent): Promise<ApiGatewayResponse> => {
  if (e.headers?.['X-Telegram-Bot-Api-Secret-Token'] !== process.env.TELEGRAM_BOT_WEBHOOK_SECRET) {
    console.warn('Invalid X-Telegram-Bot-Api-Secret-Token');
    return RESPONSE_OK;
  }

  try {
    const body = e.body ? JSON.parse(e.body) : {};
    const chatId = body?.message?.chat?.id;
    const text = body?.message?.text;

    if (chats.indexOf(String(chatId)) === -1) {
      console.warn(`ChatId=${chatId} is not whitelisted. Leaving chat...`);
      await telegram.leaveChat(chatId);
      return RESPONSE_OK;
    }

    if (!text) {
      return RESPONSE_OK;
    }

    const parsed = parser.parse(text, 3);
    const botResponse = await handleParsed(parsed);
    if (botResponse) {
      await telegram.sendMessage({
        chat_id: chatId,
        text: botResponse,
        parse_mode: 'Markdown',
      });
      console.info(`Successfully sent response to ChatId=${chatId}`);
    }
  } catch (err) {
    console.error(err);
  }

  return RESPONSE_OK;
};
