import type { BillingFactoryFn } from "../types";

export const factory: BillingFactoryFn = (pdfText) => {
  const lines = pdfText.split("\n");

  /**
   * Billing Format: {transaction_date}{posting_date}{description}{long_space}{city}{currency}{amount}
   * - transaction_date: DD-MM-YYYY
   * - posting_date: DD-MM-YYYY
   * - description: string
   * - long_space: whitespace with variable length
   * - city: string
   * - currency: 3-letter string
   * - amount: number
   *
   * Example: 19-10-202422-10-2024MAXX COFFEE RK.CIDENG    JAKARTA PUSAT   IDR0.000.0060.000
   * - transaction_date: 19-10-2024
   * - posting_date: 22-10-2024
   * - description: MAXX COFFEE RK.CIDENG
   * - long_space: "    "
   * - city: JAKARTA PUSAT
   * - currency: IDR
   * - amount: 60.000
   */

  // Create a regex pattern to match the billing format
  // Description & amount will be treated as wildcard for now
  const billingPattern =
    /(\d{2}-\d{2}-\d{4})(\d{2}-\d{2}-\d{4})(.*)([A-Z]{3})(.*)/;

  // Filter out the lines that match the billing pattern
  const billingLines = lines.filter((line) => billingPattern.test(line));

  return {
    billings: billingLines,
    additionalQueries: [],
  };
};
