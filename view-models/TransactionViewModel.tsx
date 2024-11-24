import { useState } from "react";
import { Transaction } from "../models/Transaction";

export function useTransactionViewModel() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const addTransactions = (newTransactions: Transaction[]) => {
    setTransactions(newTransactions);
  };

  const updateTransaction = (
    index: number,
    field: keyof Transaction,
    value: any
  ) => {
    setTransactions((old) =>
      old.map((transaction, i) => {
        if (i === index) {
          return {
            ...transaction,
            [field]: value,
          };
        }
        return transaction;
      })
    );
  };

  const saveToCSV = () => {
    const headers = ["Date", "Bank", "Category", "Amount"];
    const csvContent = [
      headers.join(","),
      ...transactions.map((row) =>
        [row.date, row.bank, row.category, row.amount].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "transactions.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const addNewRow = () => {
    setTransactions((old) => [
      ...old,
      { date: "", bank: "", category: "", amount: 0 },
    ]);
  };

  const deleteRow = (index: number) => {
    setTransactions((old) => old.filter((_, i) => i !== index));
  };

  return {
    transactions,
    addTransactions,
    updateTransaction,
    saveToCSV,
    addNewRow,
    deleteRow,
  };
}
