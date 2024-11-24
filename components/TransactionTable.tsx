import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";

// Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
  addNewRow,
  deleteRow,
}: TransactionTableProps) {
  const columnHelper = createColumnHelper<Transaction>();

  const columns = [
    columnHelper.accessor("date", {
      header: "Date",
      cell: (info) => (
        <Input
          defaultValue={info.getValue()}
          onChange={(e) =>
            updateTransaction(info.row.index, "date", e.target.value)
          }
        />
      ),
    }),
    columnHelper.accessor("bank", {
      header: "Bank",
      cell: (info) => (
        <Input
          defaultValue={info.getValue()}
          onChange={(e) =>
            updateTransaction(info.row.index, "bank", e.target.value)
          }
        />
      ),
    }),
    columnHelper.accessor("category", {
      header: "Category",
      cell: (info) => (
        <Input
          defaultValue={info.getValue()}
          onChange={(e) =>
            updateTransaction(info.row.index, "category", e.target.value)
          }
        />
      ),
    }),
    columnHelper.accessor("amount", {
      header: "Amount",
      cell: (info) => (
        <Input
          type="number"
          defaultValue={info.getValue()}
          onChange={(e) =>
            updateTransaction(
              info.row.index,
              "amount",
              parseFloat(e.target.value)
            )
          }
        />
      ),
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
  ];

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

      <Separator />

      <Button className="w-full mt-4" onClick={addNewRow} variant={"outline"}>
        Add New Row
      </Button>
    </div>
  );
}
