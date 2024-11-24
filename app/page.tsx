"use client";

// Components
import { Button } from "@/components/ui/button";
import UploadArea from "@/components/UploadBox";
import TransactionTable from "@/components/TransactionTable";

// View Models
import { useTransactionViewModel } from "@/view-models/TransactionViewModel";

export default function Home() {
  const {
    transactions,
    addTransactions,
    updateTransaction,
    saveToCSV,
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
    <div className="min-h-screen bg-background text-foreground">
      <div className="container px-4 py-8 mx-auto">
        <div className="flex items-center justify-center min-h-screen">
          <UploadArea onFileUpload={handleFileUpload} />
        </div>
        {transactions.length > 0 && (
          <div className="mt-8">
            <TransactionTable
              transactions={transactions}
              updateTransaction={updateTransaction}
              addNewRow={addNewRow}
              deleteRow={deleteRow}
            />
            <Button onClick={saveToCSV} className="mt-4">
              Save to CSV
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
