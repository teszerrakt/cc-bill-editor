// Utils
import { joinMultipleLines } from "./../utils/join-multiple-lines";

// Types
import type { BillingFactoryFn } from "../types";

export const factory: BillingFactoryFn = (pdfText) => {
  const lines = pdfText.split("\n");

  /**
   * Billing Format: {transaction_date}{posting_date}{description}{amount}
   * - transaction_date: DD\tMMM\tYYYY
   * - posting_date: DD\tMMM\tYYYY
   * - description: string
   * - amount: string
   *
   * Example: 30\tSep\t202403\tOkt\t2024GRAB*\tA-6VAW4DBGWGR7\tJAKARTA\tPUSATID\t58,800.00
   * - transaction_date: 30\tSep\t2024
   * - posting_date: 03\tOkt\t2024
   * - description: GRAB*\tA-6VAW4DBGWGR7\tJAKARTA\tPUSAT
   * - amount: 58,800.00
   */

  // Create a regex pattern to match the billing format
  // Description & amount will be treated as wildcard for now
  const billingPattern =
    /(\d{2}\t[A-Z]{3}\t\d{4})(\d{2}\t[A-Z]{3}\t\d{4})(.*)/i;
  const firstLineOfMultipleLinesPattern = /(\d{2}\t[A-Z]{3}\t\d{4})/i;

  let lastBillingLinesIndex: number | null = null;

  // Filter out the lines that match the billing pattern
  const billingLines: string[] = lines.reduce((arr, line, idx) => {
    const shouldSkip =
      lastBillingLinesIndex !== null && idx > lastBillingLinesIndex;

    if (shouldSkip) {
      return arr;
    }

    if (line.includes("BIAYA\tLAYANAN\tNOTIFIKASI\t")) {
      lastBillingLinesIndex = idx;
    }

    if (firstLineOfMultipleLinesPattern.test(line)) {
      const combinedLines = joinMultipleLines({
        lines,
        index: idx,
        patterns: [billingPattern],
      });

      arr.push(combinedLines);
    } else if (billingPattern.test(line)) {
      arr.push(line);
    }

    return arr;
  }, [] as string[]);

  return {
    billings: billingLines,
    additionalQueries: [],
  };
};
