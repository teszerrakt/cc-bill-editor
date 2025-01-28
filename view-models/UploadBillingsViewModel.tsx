import { useState } from "react";

// Types
import type { FormattedBilling, SupportedModel } from "@/lib/pdf-parser/types";
import type { IssuingBanks } from "@/lib/pdf-parser/factories";

type Params = {
  onSuccessfulUpload: (transactions: FormattedBilling[]) => void;
};

const BANK_LIST: IssuingBanks[] = ["BRI", "JENIUS"];
const MODEL_LIST: SupportedModel[] = [
  "gpt-4o",
  "gpt-4",
  "gpt-4-turbo",
  "gpt-3.5-turbo",
  "o1-mini",
];

export function useUploadBillingsViewModal({ onSuccessfulUpload }: Params) {
  const [bank, setBank] = useState<IssuingBanks | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [base64PDF, setBase64PDF] = useState<string | undefined>();
  const [model, setModel] = useState<SupportedModel | undefined>();

  const fileToBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileUpload = async (file: File) => {
    setBase64PDF(undefined);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("bank", bank as string);
    formData.append("model", model as string);

    const base64 = await fileToBase64(file);

    try {
      setIsLoading(true);
      const response = await fetch("/api/parse-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to parse PDF");
      }

      const data = await response.json();

      if (!data.transactions || data.transactions.length === 0) {
        throw new Error("No transactions found in the PDF");
      }

      setBase64PDF(base64);

      onSuccessfulUpload(data.transactions);
    } catch (error) {
      // TODO: Use better component for error handling
      console.error("Error uploading file:", error);
      alert("Failed to upload and parse the file. Please try again.");
      setBase64PDF(undefined);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    base64PDF,
    bankList: BANK_LIST.sort(),
    issuingBank: bank,
    aiModel: model,
    modelList: MODEL_LIST.sort(),
    onFileUpload: handleFileUpload,
    onSelectBank: setBank,
    onBase64Change: setBase64PDF,
    onSelectModel: setModel,
  };
}
