import fetch from 'node-fetch';
import { URLSearchParams } from 'url';

import { ExchangeRates, ICurrencyApi } from './ICurrencyApi';

export type LatestResponse = {
  success: boolean;
  timestamp: number;
  date: string;
  base: string;
  rates: {
    [key: string]: number;
  };
};

export default class ExchangeRatesApi implements ICurrencyApi {
  constructor(private readonly apikeys: string[]) {}

  private get apikey(): string {
    const i = Math.floor(Math.random() * this.apikeys.length);
    return this.apikeys[i];
  }

  async latest(base: string, symbols: string[]): Promise<LatestResponse> {
    const query = new URLSearchParams({
      base,
      symbols: symbols.join(','),
    });
    const res = await fetch(`https://api.apilayer.com/exchangerates_data/latest?${query}`, {
      method: 'get',
      headers: { apikey: this.apikey },
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Error requesting exchange API: ${err}`);
    }

    const json = (await res.json()) as LatestResponse;

    if (json.success) {
      return json;
    }

    throw new Error(`Invalid exchange API response: ${JSON.stringify(json)}`);
  }

  async getExchangeRates(base: string, quotes: string[]): Promise<ExchangeRates> {
    const { rates } = await this.latest(base, quotes);

    return rates;
  }
}
