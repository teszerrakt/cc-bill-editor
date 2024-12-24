import OpenAI from "openai";

// Types
import type { FormattedBilling } from "./../types";

const openAI = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function formatBillingsWithAI(
  billings: string[],
  issuingBanks: string,
  additionalQueries?: string[]
): Promise<FormattedBilling[] | undefined> {
  const formattedBillings = billings.join("\n");

  const mappedAdditionalQueries = (additionalQueries ?? []).map((query) => ({
    role: "user" as const,
    content: query,
  }));

  try {
    const response = await openAI.chat.completions.create({
      model: "o1-mini",
      messages: [
        {
          role: "user",
          content:
            "Format the following billing data into the format of {transactionDate}\t{description}\t{amount}\n",
        },
        {
          role: "user",
          content: "`\t` is separator for each column.",
        },
        {
          role: "user",
          content: "`\n` is separator for each row.",
        },
        {
          role: "user",
          content: "transactionDate is in YYYY-MM-DD format.",
        },
        {
          role: "user",
          content:
            "description is in string datatype and can contain any characters.",
        },
        {
          role: "user",
          content: "amount is in JavaScript readable number format",
        },
        {
          role: "user",
          content:
            "remove the currency symbol (e.g. IDR, USD, $, etc) and any other non-numeric characters from the amount.",
        },
        ...mappedAdditionalQueries,
        { role: "user", content: formattedBillings },
      ],
    });

    return response.choices[0].message.content
      ?.split("\n")
      .map((billing) => {
        const [transactionDate, description, amount] = billing.split("\t");
        return {
          transactionDate,
          description: description?.trim(),
          amount: Number(amount),
          issuingBank: issuingBanks,
        };
      })
      .filter((billing) => {
        // Date should conform to YYYY-MM-DD format
        const isDateValid = /^\d{4}-\d{2}-\d{2}$/.test(billing.transactionDate);
        // Description should not be empty
        const isDescriptionValid = !!billing.description;

        return isDateValid && isDescriptionValid;
      });
  } catch (error) {
    throw error;
  }
}
