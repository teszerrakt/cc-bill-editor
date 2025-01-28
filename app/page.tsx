"use client";

// Constants
import FEATURE_FLAGS from "@/constants/featureFlags";

// Components
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import UploadArea from "@/components/UploadBox";
import TransactionTable from "@/components/TransactionTable";
import Dropdown from "@/components/Dropdown";

// Icons
import { ArrowLeft, LoaderCircle } from "lucide-react";

// Models
import { FormattedBilling, SupportedModel } from "@/lib/pdf-parser/types";

// View Models
import { useTransactionViewModel } from "@/view-models/TransactionViewModel";
import { useUploadBillingsViewModal } from "@/view-models/UploadBillingsViewModel";

// Utils
import { cn } from "@/lib/utils";

// Types
import { IssuingBanks } from "@/lib/pdf-parser/factories";

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
    aiModel,
    modelList,
    bankList,
    base64PDF,
    issuingBank,
    isLoading,
    onBase64Change,
    onFileUpload,
    onSelectBank,
    onSelectModel,
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
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="animate-spin">
          <LoaderCircle className="w-10 h-10" />
        </div>
        <div className="animate-pulse">Analyzing your billings...</div>
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
              <Dropdown<IssuingBanks>
                options={bankList}
                value={issuingBank}
                onSelectItem={onSelectBank}
                placeholder="Select Bank"
              />
              <Dropdown<SupportedModel>
                options={modelList}
                value={aiModel}
                onSelectItem={onSelectModel}
                placeholder="Select Model"
              />

              <UploadArea onFileUpload={onFileUpload} />
            </div>
          </div>
        )}

        {transactions?.length > 0 && (
          <div className="flex gap-4 p-4 max-h-[100vh] w-2/3">
            <Separator orientation="vertical" />
            <div id="trx-table" className="pb-16 overflow-y-scroll w-full">
              <TransactionTable
                transactions={transactions}
                updateTransaction={updateTransaction}
                deleteRow={deleteRow}
              />
            </div>
            <div className="fixed flex items-center justify-between w-2/3 h-16 px-4 border rounded-md bottom-4 right-6 bg-background border-muted">
              <div>Total Expenses: {formattedTotalExpenses}</div>
              <div className="flex gap-2">
                <Button onClick={saveToCSV} variant={"secondary"}>
                  Export to CSV
                </Button>
                {FEATURE_FLAGS.TABLE_DIRECT_EDIT_ENABLED && (
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
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
