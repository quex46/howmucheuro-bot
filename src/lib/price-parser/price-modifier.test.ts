import PriceModifer from './price-modifier';

describe('PriceModifier', () => {
  describe('simple modifier', () => {
    const v = 1e3;
    const pm = new PriceModifer({
      pattern: 'k',
      max: 3,
      value: v,
    });
    const cases: [string, number][] = [
      ['k', v],
      ['kk', v ** 2],
      ['kkk', v ** 3],
      ['kkkk', 0], // Reach `max` value case.
      ['kK', v ** 2],
      ['Kmk', 1],
      ['', 1],
      [' ', 1],
      ['H', 1],
    ];

    test.each(cases)('%s -> %d', (input, expected) => {
      expect(pm.parse(input)).toBe(expected);
    });
  });

  describe('plural modifier', () => {
    const v = 1e3;
    const pm = new PriceModifer({
      pattern: 'тыс|тысяч(?:а|и|у)?',
      max: 1,
      value: v,
    });
    const cases: [string, number][] = [
      ['тыс', v],
      ['Тыс', v],
      ['тысяча', v],
      ['тыстыс', 0],
    ];

    test.each(cases)('%s -> %d', (input, expected) => {
      expect(pm.parse(input)).toBe(expected);
    });
  });
});
