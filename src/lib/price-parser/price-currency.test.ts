import PriceCurrency from './price-currency';

describe('PriceCurrency', () => {
  const cases: [string, boolean][] = [
    ['руб', true],
    ['рубля', true],
    ['РуБлЕй', true],
    ['РУБЛИ', false],
    ['rubles', true],
    ['₽', true],
    ['RUB', true],
    ['рубл', false],
  ];

  test.each(cases)('%s -> %s', (input, expected) => {
    const pc = new PriceCurrency({
      asset: 'RUB',
      symbol: '₽',
      patterns: ['руб', 'рубл(?:ей|я|ь)', 'rub(?:le|les)?'],
    });

    expect(pc.test(input)).toBe(expected);
  });
});
