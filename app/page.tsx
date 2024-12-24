"use client";

// Components
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import UploadArea from "@/components/UploadBox";
import TransactionTable from "@/components/TransactionTable";
import SelectBank from "@/components/SelectBank";

// Icons
import { LoaderPinwheel, ArrowLeft } from "lucide-react";

// Models
import { FormattedBilling } from "@/lib/pdf-parser/types";

// View Models
import { useTransactionViewModel } from "@/view-models/TransactionViewModel";
import { useUploadBillingsViewModal } from "@/view-models/UploadBillingsViewModel";

// Utils
import { cn } from "@/lib/utils";

export default function Home() {
  const {
    transactions,
    addTransactions,
    updateTransaction,
    addNewRow,
    deleteRow,
    saveToCSV,
    resetTransactions,
  } = useTransactionViewModel();

  const {
    bankList,
    base64PDF,
    issuingBank,
    isLoading,
    onBase64Change,
    onFileUpload,
    onSelectBank,
  } = useUploadBillingsViewModal({
    onSuccessfulUpload: (transactions) => {
      addTransactions(
        transactions.map((t: FormattedBilling) => ({
          date: t.transactionDate,
          bank: t.issuingBank,
          category: "",
          amount: t.amount,
          description: t.description,
        }))
      );
    },
  });

  // TODO: Move this to a view model
  const totalExpenses = transactions.reduce(
    (total, transaction) => total + Number(transaction.amount),
    0
  );

  const formattedTotalExpenses = new Intl.NumberFormat("en", {
    style: "currency",
    currency: "IDR",
  }).format(totalExpenses);

  const handleBack = () => {
    onBase64Change(undefined);
    resetTransactions();
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
            <div className="flex py-4 gap-4 items-center">
              <Button variant={"outline"} onClick={handleBack}>
                <ArrowLeft /> Back
              </Button>
              {issuingBank} Billings
            </div>
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
            <div className="flex flex-col gap-4">
              <SelectBank
                bankList={bankList}
                issuingBank={issuingBank}
                onSelectBank={onSelectBank}
              />
              <UploadArea onFileUpload={onFileUpload} />
            </div>
          </div>
        )}

        {transactions?.length > 0 && (
          <div className="flex gap-4 p-4 max-h-[100vh]">
            <Separator orientation="vertical" />
            <div id="trx-table" className="pb-16 overflow-y-scroll">
              <TransactionTable
                transactions={transactions}
                updateTransaction={updateTransaction}
                deleteRow={deleteRow}
              />
            </div>
            <div className="fixed flex items-center justify-between w-2/3 h-16 px-4 border rounded-md bottom-4 right-4 bg-background border-muted">
              <div>Total Expenses: {formattedTotalExpenses}</div>
              <div className="flex gap-2">
                <Button onClick={saveToCSV} variant={"secondary"}>
                  Export to CSV
                </Button>
                <Button
                  onClick={() => {
                    addNewRow();
                    const table = document.getElementById("trx-table");

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
          </div>
        )}
      </div>
    </div>
  );
}
