import type { PriceCurrencyOptions } from '../lib/price-parser/price-currency';
import type { PriceModifierOptions } from '../lib/price-parser/price-modifier';

const currencies: PriceCurrencyOptions[] = [
  {
    asset: 'RUB',
    symbol: '₽',
    patterns: [
      'руб(?:ас|аса|асов|чинских|чинский)', 'рубл(?:ей|я|ь|ишек|ишков)', 'rub(?:le|les)?',
    ],
  },
  {
    asset: 'USD',
    symbol: '$',
    patterns: [
      'usd', 'dollar(?:s)?', 'bucks', 'бакс(?:а|ов|у)?', 'бач(?:а|ей|инских|инский)', 'доллар(?:а|ов|ей|у)?',
    ],
  },
  {
    asset: 'THB',
    symbol: '฿',
    patterns: [
      'bah?t', 'бат(?:ов)?',
    ],
  },
  {
    asset: 'EUR',
    symbol: '€',
    patterns: [
      'eur(?:o|os)?', 'евро(?:сов|сиков|сика|сику)?', 'еврик(?:а|ов)?', 'evro',
    ],
  },
  {
    asset: 'GEL',
    symbol: '₾',
    patterns: [
      'lari', 'лари', 'ларей',
    ],
  },
  {
    asset: 'TRY',
    symbol: '₺',
    patterns: [
      'лир(?:а|у|ов|ы)?',
    ],
  },
  {
    asset: 'VND',
    symbol: '₫',
    patterns: [
      'донг(?:а|у|ов|и)?',
    ],
  },
];

const modifiers: PriceModifierOptions[] = [
  { pattern: 'k|к|тыс(?:яч|ячу|яча|ячу|ячи)|косар(?:ь|я|ей|ям|ю|ями)', max: 3, value: 1e3 },
];

export { currencies, modifiers };
