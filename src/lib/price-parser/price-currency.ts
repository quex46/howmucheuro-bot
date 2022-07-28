export type PriceCurrencyOptions = {
  asset: string;
  symbol: string;
  patterns: string[];
};

export default class PriceCurrency {
  private readonly searchPattern: string;

  private readonly testRegexp: RegExp;

  constructor(private readonly options: PriceCurrencyOptions) {
    this.searchPattern = [
      this.options.asset,
      `\\${this.options.symbol}`,
      ...this.options.patterns,
    ].join('|');
    this.testRegexp = new RegExp(`^(?:${this.searchPattern})$`, 'i');
  }

  get asset(): string {
    return this.options.asset;
  }

  get symbol(): string {
    return this.options.symbol;
  }

  get pattern(): string {
    return this.searchPattern;
  }

  test(s: string): boolean {
    return this.testRegexp.test(s);
  }
}
