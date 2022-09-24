export type PriceCurrencyOptions = {
  asset: string;
  symbol: string;
  patterns: string[];
};

export default class PriceCurrency {
  private readonly searchPattern: string;

  private readonly testRegexp: RegExp;

  constructor(private readonly options: PriceCurrencyOptions) {
    const isLetter = this.options.symbol.toUpperCase() !== this.options.symbol.toLowerCase();
    this.searchPattern = [
      this.options.asset,
      ...(isLetter ? [] : [`\\${this.options.symbol}`]),
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
