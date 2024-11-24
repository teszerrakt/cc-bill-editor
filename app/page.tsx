"use client";

// Components
import UploadArea from "@/components/UploadBox";
import TransactionTable from "@/components/TransactionTable";

// View Models
import { useTransactionViewModel } from "@/view-models/TransactionViewModel";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default function Home() {
  const {
    transactions,
    addTransactions,
    updateTransaction,
    addNewRow,
    deleteRow,
  } = useTransactionViewModel();

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/parse-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to parse PDF");
      }

      const data = await response.json();
      addTransactions(data.transactions);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload and parse the file. Please try again.");
    }
  };

  return (
    <div className="min-h-screen px-4 bg-background text-foreground">
      <div className="flex w-full min-h-screen gap-4">
        <div
          className={cn("flex justify-center items-center ", {
            "w-full": !transactions?.length,
            "w-1/3": transactions?.length,
          })}
        >
          <UploadArea onFileUpload={handleFileUpload} />
        </div>

        {transactions?.length > 0 && (
          <div className="flex gap-4 p-4">
            <Separator orientation="vertical" />
            <div className="">
              <TransactionTable
                transactions={transactions}
                updateTransaction={updateTransaction}
                addNewRow={addNewRow}
                deleteRow={deleteRow}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
