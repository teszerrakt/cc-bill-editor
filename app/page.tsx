"use client";

import { useState } from "react";

// Components
import UploadArea from "@/components/UploadBox";
import TransactionTable from "@/components/TransactionTable";

// View Models
import { useTransactionViewModel } from "@/view-models/TransactionViewModel";
import { Separator } from "@/components/ui/separator";

// Utils
import { cn } from "@/lib/utils";
import { FormattedBilling } from "@/lib/pdf-parser/types";
import { LoaderPinwheel } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [base64PDF, setBase64PDF] = useState<string | null>(null);

  const {
    transactions,
    addTransactions,
    updateTransaction,
    addNewRow,
    deleteRow,
  } = useTransactionViewModel();

  const totalExpenses = transactions.reduce(
    (total, transaction) => total + transaction.amount,
    0
  );

  const formattedTotalExpenses = new Intl.NumberFormat("en", {
    style: "currency",
    currency: "IDR",
  }).format(totalExpenses);

  const fileToBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileUpload = async (file: File) => {
    setBase64PDF(null);

    const formData = new FormData();
    formData.append("file", file);

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

      setBase64PDF(base64);

      addTransactions(
        data.transactions.map((t: FormattedBilling) => ({
          date: t.transactionDate,
          bank: t.issuingBank,
          category: "",
          amount: t.amount,
          description: t.description,
        }))
      );
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload and parse the file. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin">
          <LoaderPinwheel />
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 bg-background text-foreground">
      <div className="flex w-full gap-4">
        {base64PDF && (
          <div className="w-1/3">
            <iframe src={base64PDF} className="object-contain w-full h-full" />
          </div>
        )}
        {!base64PDF && (
          <div
            className={cn("flex h-screen justify-center items-center", {
              "w-full": !transactions?.length,
              "w-1/3": transactions?.length,
            })}
          >
            <UploadArea onFileUpload={handleFileUpload} />
          </div>
        )}

        {transactions?.length > 0 && (
          <div className="flex gap-4 p-4 max-h-[100vh]">
            <Separator orientation="vertical" />
            <div id="trx-table" className="pb-16 overflow-y-scroll">
              <TransactionTable
                transactions={transactions}
                updateTransaction={updateTransaction}
                addNewRow={addNewRow}
                deleteRow={deleteRow}
              />
            </div>
            <div className="fixed flex items-center justify-between w-2/3 h-16 px-4 mx-auto border rounded-md bottom-4 right-4 bg-background border-muted">
              <div>Total Expenses: {formattedTotalExpenses}</div>
              <Button
                onClick={() => {
                  addNewRow();
                  const table = document.getElementById("trx-table");
                  console.log("table", table?.scrollHeight);

                  table?.scrollTo({
                    top: table.scrollHeight + 200,
                    behavior: "smooth",
                  });
                }}
                variant={"outline"}
              >
                Add New Row
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
