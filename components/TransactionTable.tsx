import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";

// Components
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SelectCategory from "./SelectCategory";

// Icons
import { Trash2 } from "lucide-react";

// Models
import { Transaction } from "@/models/Transaction";

interface TransactionTableProps {
  transactions: Transaction[];
  updateTransaction: (
    index: number,
    field: keyof Transaction,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any
  ) => void;
  deleteRow: (index: number) => void;
}

export default function TransactionTable({
  transactions,
  updateTransaction,
  deleteRow,
}: TransactionTableProps) {
  const columnHelper = createColumnHelper<Transaction>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("date", {
        header: "Date",
      }),
      columnHelper.accessor("description", {
        header: "Description",
      }),
      columnHelper.accessor("bank", {
        header: "Bank",
      }),
      columnHelper.accessor("category", {
        header: "Category",
        cell: (info) => (
          <SelectCategory
            value={info.row.original.category}
            onSelectCategory={(category) =>
              updateTransaction(info.row.index, "category", category)
            }
          />
        ),
      }),
      columnHelper.accessor("amount", {
        header: "Amount",
      }),
      columnHelper.display({
        id: "actions",
        cell: (info) => (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteRow(info.row.index)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        ),
      }),
    ],
    [columnHelper, deleteRow, updateTransaction]
  );

  const table = useReactTable({
    data: transactions,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
