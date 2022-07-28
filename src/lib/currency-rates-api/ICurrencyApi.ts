export type ExchangeRates = {
  [key: string]: number | undefined;
};

export interface ICurrencyApi {
  getExchangeRates(base: string, quotes: string[]): Promise<ExchangeRates>;
}
