import PriceValue from './price-value';

describe('PriceValue', () => {
  const cases: [string, number][] = [
    ['23', 23],
    ['3,56', 3.56],
    ['0.37', 0.37],
    ['1,003,273', 1003273],
    ['1,287,345.63', 1287345.63],
    ['1,334.45', 1334.45],
    ['17,000', 17000],
    ['1,2,3', 0],
    ['1,333,44', 0],
    ['1.333.44', 0],
    ['-1', 0],
    ['-53,000.53', 0],
    ['0.0000000000001', 0],
    ['999999999999999999999999999999999999999999999999', 0],
  ];

  test.each(cases)('%s -> %d', (input, expected) => {
    const pv = new PriceValue();
    expect(pv.parse(input)).toBe(expected);
  });
});
