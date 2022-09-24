import PriceCurrency, { PriceCurrencyOptions } from './price-currency';
import PriceModifier, { PriceModifierOptions } from './price-modifier';
import PriceValue from './price-value';

export type PriceParserOptions = {
  modifiers: PriceModifierOptions[];
  currencies: PriceCurrencyOptions[];
};

export type PriceEntity = {
  value: number;
  currency: {
    asset: string;
    symbol: string;
  };
};

export default class PriceParser {
  private readonly priceModifiers: PriceModifier[];

  private readonly priceCurrencies: PriceCurrency[];

  private readonly priceValue: PriceValue;

  private readonly searchRegexp: RegExp;

  constructor(private readonly options: PriceParserOptions) {
    this.priceModifiers = this.options.modifiers.map((m) => new PriceModifier(m));
    this.priceCurrencies = this.options.currencies.map((m) => new PriceCurrency(m));
    this.priceValue = new PriceValue();

    const pValue = this.priceValue.pattern;
    const pModifier = this.priceModifiers.map((m) => m.pattern).join('|');
    const pCurrency = this.priceCurrencies.map((c) => c.pattern).join('|');

    this.searchRegexp = new RegExp(`(${pValue})\\s*(${pModifier}\\s+)?(${pCurrency})(?:[^a-zA-Zа-яА-Я]|$)`, 'ig');
  }

  parse(text: string, max = 10): PriceEntity[] {
    const result: PriceEntity[] = [];
    let next;

    this.searchRegexp.lastIndex = 0;
    while (next = this.searchRegexp.exec(text)) {
      const val = this.parseValue(next[1], next[2]);
      const cur = this.parseCurrency(next[3]);

      if (val && cur) {
        result.push({
          value: val,
          currency: {
            asset: cur.asset,
            symbol: cur.symbol,
          },
        });
        max -= 1;
      }

      if (max <= 0) {
        break;
      }
    }

    return result;
  }

  private parseValue(value?: string, modifier?: string): number {
    if (value === undefined) {
      return 0;
    }

    let v = this.priceValue.parse(value.trim());

    if (modifier === undefined) {
      return v;
    }

    modifier = modifier.trim();
    for (let i = 0; i < this.priceModifiers.length; i += 1) {
      const m = this.priceModifiers[i].parse(modifier);
      v *= m;
    }

    return v;
  }

  private parseCurrency(currency: string): PriceCurrency | undefined {
    currency = currency.trim();
    for (let i = 0; i < this.priceCurrencies.length; i += 1) {
      if (this.priceCurrencies[i].test(currency)) {
        return this.priceCurrencies[i];
      }
    }
    return undefined;
  }
}
