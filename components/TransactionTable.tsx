import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  ColumnDef,
} from "@tanstack/react-table";

// Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Icons
import { Trash2 } from "lucide-react";

// Models
import { Transaction } from "@/models/Transaction";
import { useMemo, useState } from "react";

interface TransactionTableProps {
  transactions: Transaction[];
  updateTransaction: (
    index: number,
    field: keyof Transaction,
    value: any
  ) => void;
  addNewRow: () => void;
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
    [transactions]
  );

  const table = useReactTable({
    data: transactions,
    columns,
    defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: (rowIndex: number, columnId: string, value: string) => {
        updateTransaction(rowIndex, columnId as keyof Transaction, value);
      },
    },
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

const defaultColumn: Partial<ColumnDef<Transaction>> = {
  cell: ({ getValue, row: { index }, column: { id }, table }) => {
    const initialValue = getValue();
    // We need to keep and update the state of the cell normally
    const [value, setValue] = useState(initialValue);

    // When the input is blurred, we'll call our table meta's updateData function
    const onBlur = () => {
      // @ts-expect-error
      table.options.meta?.updateData(index, id, value);
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    };

    return (
      <Input value={value as string} onChange={onChange} onBlur={onBlur} />
    );
  },
};
