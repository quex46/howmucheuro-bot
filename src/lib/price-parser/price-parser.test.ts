import PriceParser, { PriceEntity } from './price-parser';

describe('PriceParser', () => {
  const pp = new PriceParser({
    modifiers: [
      { pattern: 'k|к|тыс(?:яч|ячу|яча|ячу|ячи)', max: 3, value: 1e3 },
    ],
    currencies: [
      {
        asset: 'RUB',
        symbol: '₽',
        patterns: [
          'руб', 'рубл(?:ей|я|ь)', 'rub(?:le|les)?',
        ],
      },
      {
        asset: 'USD',
        symbol: '$',
        patterns: [
          'usd', 'dollar(?:s)?', 'бакс(?:а|ов|у)?', 'бач(?:а|ей|инских|инский)', 'доллар(?:а|ов|ей|у)',
        ],
      },
    ],
  });

  const rub = { currency: { asset: 'RUB', symbol: '₽' } };
  const usd = { currency: { asset: 'USD', symbol: '$' } };
  const cases: [string, PriceEntity[]][] = [
    [
      'я сегодня потратил 10 рублей, а вчера потратил 40к руб, and 1kkkk usd',
      [
        { ...rub, value: 10 },
        { ...rub, value: 40000 },
      ],
    ],
    [
      '17,000K $,купил за 10руб вчера, 3,5 бакса, and then -1 usd and -32,300.42 usd',
      [
        { ...usd, value: 17000000 },
        { ...rub, value: 10 },
        { ...usd, value: 3.5 },
        // Negative values must be skipped.
      ],
    ],
    [
      '17,000.34$ и 1к баксов и 99999999999999999999к баксов и 0,000000001 usd and "0.00000001 $"; and 0.1 usd',
      [
        { ...usd, value: 17000.34 },
        { ...usd, value: 1000 },
        { ...usd, value: 0.1 },
      ],
    ],
  ];

  test.each(cases)('parse "%s"', (input, expected) => {
    const res = pp.parse(input);
    expect(res).toStrictEqual(expected);
  });
});
