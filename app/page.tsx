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
      <div
        className="flex flex-col items-center justify-center gap-4"
        style={{
          height: "calc(100vh - 65px)",
        }}
      >
        <div className="animate-spin">
          <LoaderCircle className="w-10 h-10" />
        </div>
        <div className="animate-pulse">Analyzing your billings...</div>
      </div>
    );
  }

  return (
    <div className="px-4 bg-background text-foreground">
      <div className="flex flex-col md:flex-row w-full gap-4">
        {!base64PDF && (
          <div className={cn("flex mx-auto justify-center w-[500px]")}>
            <div className="flex flex-col gap-4 py-8 px-12 border h-fit rounded-lg mt-40">
              <p className="mb-4 text-center">
                Transform your credit card bills into an organized table and
                downloadable CSV.
              </p>
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

        {base64PDF && (
          <div className="w-full md:w-1/3">
            <div className="flex py-4 gap-4 items-center justify-between">
              <Button variant={"outline"} onClick={handleBack}>
                <ArrowLeft /> Back
              </Button>
              {issuingBank} Billings
            </div>

            <div className="text-center md:hidden py-4 border-b border-t">
              Total Expenses: {formattedTotalExpenses}
            </div>

            <iframe
              src={base64PDF}
              className="hidden md:block object-contain w-full h-full"
            />
          </div>
        )}

        {transactions?.length > 0 && (
          <div
            className="flex gap-4 md:p-4 w-full md:w-2/3"
            style={{
              // 65px is the height of the header
              maxHeight: "calc(100vh - 65px)",
            }}
          >
            <Separator orientation="vertical" className="hidden md:block" />

            <div id="trx-table" className="pb-16 overflow-y-scroll w-full">
              <TransactionTable
                transactions={transactions}
                updateTransaction={updateTransaction}
                deleteRow={deleteRow}
              />
            </div>
            <div className="fixed hidden md:flex items-center justify-between w-2/3 h-16 px-4 border rounded-md bottom-4 right-6 bg-background border-muted">
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
