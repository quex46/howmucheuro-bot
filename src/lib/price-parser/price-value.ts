export type PriceValueOptions = {
  decimalSeparator?: string;
  thousandSeparator?: string;
};

const SANITIZE_RE = /[^\d,\\.]/g;
const COMMA_DECIMAL_RE = /^\d+,\d+$/;
const COMMA_SEP_RE = /^\d+(?:,\d{3})+(?:\.\d+)?$/;

export default class PriceValue {
  get pattern(): string {
    return '-?\\d[\\d,\\. ]*';
  }

  parse(s: string): number {
    if (s.charAt(0) === '-') {
      return 0;
    }

    s = s.replace(SANITIZE_RE, '');

    const chunks = s.split(',');

    if (COMMA_SEP_RE.test(s)) {
      // Comma used as thousand separator (e.g., "3,444,555.56" -> "3444.56")
      s = chunks.join('');
    } else if (COMMA_DECIMAL_RE.test(s)) {
      // Comma as decimal separator (e.g., "3,55")
      s = chunks.join('.');
    }

    if (s.indexOf(',') > -1 || s.indexOf('.') !== s.lastIndexOf('.')) {
      return 0;
    }

    const n = Number.parseFloat(s);

    if (!n || n < 0.01 || n > 1000000000000) {
      return 0;
    }

    return n;
  }
}
