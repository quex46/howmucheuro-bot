export type PriceModifierOptions = {
  pattern: string;
  value: number;
  max?: number;
};

export default class PriceModifier {
  private readonly searchPattern: string;

  private readonly testRegexp: RegExp;

  private readonly countRegexp: RegExp;

  constructor(private readonly options: PriceModifierOptions) {
    const { pattern } = options;
    this.searchPattern = `(?:${pattern})+`;
    this.testRegexp = new RegExp(`^${this.searchPattern}$`, 'i');
    this.countRegexp = new RegExp(pattern, 'ig');
  }

  get pattern(): string {
    return this.searchPattern;
  }

  parse(s: string): number {
    let i = 0;
    if (!this.testRegexp.test(s)) {
      return 1;
    }
    this.countRegexp.lastIndex = 0;
    while (this.countRegexp.exec(s)) {
      i += 1;
      // Skip processing if `max` reached.
      if (this.options.max && i > this.options.max) {
        return 0;
      }
    }
    return this.options.value ** i;
  }
}
