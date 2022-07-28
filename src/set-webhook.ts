import TelegramBotApi from './lib/telegram-bot-api/telegram-bot-api';

const getUrl = (path: string): string => {
  const base = (process.argv[2] ?? '').replace(/\/+$/, '');
  return base ? `${base}${path}` : '';
};

(async () => {
  const {
    TELEGRAM_BOT_TOKEN,
    TELEGRAM_BOT_WEBHOOK_SECRET,
  } = process.env;

  const telegram = new TelegramBotApi(TELEGRAM_BOT_TOKEN ?? '');

  try {
    const url = getUrl('/webhook');
    console.info(`Setting bot webhook to "${url}`);
    await telegram.setWebhook(url, TELEGRAM_BOT_WEBHOOK_SECRET ?? '');
  } catch (err) {
    console.error(err);
  }
})();
