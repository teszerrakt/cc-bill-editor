"use server";

// @ts-expect-error pdf-parse does not have types
import pdf from "pdf-parse/lib/pdf-parse.js";

import { billingFactory, IssuingBanks } from "./factories/index";
import { formatBillingsWithAI } from "./services/openai-service";
import { SupportedModel } from "./types";

export async function parsePDF(
  pdfBuffer: Buffer,
  issuingBank: IssuingBanks,
  model?: SupportedModel
) {
  const pdfText = await pdf(pdfBuffer);

  const { billings, additionalQueries } = billingFactory[issuingBank](
    pdfText.text
  );

  const formattedBillings = formatBillingsWithAI(
    billings,
    issuingBank,
    additionalQueries,
    model
  );

  return formattedBillings;
}
