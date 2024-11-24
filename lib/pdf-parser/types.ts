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
