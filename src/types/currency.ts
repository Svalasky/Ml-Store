export type CurrencyCode = "IDR" | "USD" | "EUR" | "JPY" | "SGD";

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  name: string;
  locale: string;
  decimals: number;
}

export interface TransactionCurrency {
  amount: number;
  currency: CurrencyCode;
}
