export type BillingFactoryFn = (pdf: string) => {
  billings: string[];
  additionalQueries?: string[];
};

export type FormattedBilling = {
  transactionDate: string;
  description: string;
  amount: number;
  issuingBank: string;
};

export type SupportedModel =
  | "gpt-4o"
  | "gpt-4"
  | "gpt-4-turbo"
  | "gpt-3.5-turbo"
  | "o1-mini";
