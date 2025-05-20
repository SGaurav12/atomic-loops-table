import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { flexRender, type Table as ReactTable } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

interface DataTableProps<TData> {
  table: ReactTable<TData>;
  onEdit?: (id: number) => void;
}

function DataTable<TData extends { id: number }>({
  table,
  onEdit
}: DataTableProps<TData>) {
  const navigate = useNavigate();

  const handleRowClick = (row: TData) => {
 
    navigate(`/products/${row.id}`, { state: row });

  };

  return (
    <div className="overflow-x-auto border rounded-xl">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="px-4 py-3 text-sm font-semibold text-left whitespace-nowrap"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                onClick={() => handleRowClick(row.original)}
                className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors"
                tabIndex={0}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="px-4 py-3 text-sm text-left align-middle whitespace-nowrap"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}

                {onEdit && (
                  <TableCell className="px-4 py-3 text-sm">
                    <Button
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation(); // prevent row click
                        onEdit(row.original.id);
                      }}
                    >
                      Edit
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getAllColumns().length}
                className="h-24 text-center text-sm text-gray-500"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default DataTable;