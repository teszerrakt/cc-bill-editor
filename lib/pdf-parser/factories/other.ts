import type { BillingFactoryFn } from "../types";

export const factory: BillingFactoryFn = (pdfText) => {
  const lines = pdfText.split("\n");

  return {
    billings: lines,
    additionalQueries: [],
  };
};
