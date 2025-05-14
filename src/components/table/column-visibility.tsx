import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import { type Table as ReactTable } from '@tanstack/react-table';


interface DataTableProps<TData> {
  table: ReactTable<TData>;
}

function ColumnVisibility<TData> ({table}: DataTableProps<TData>) {
  return (
    <div className="flex justify-end mb-4">
    <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline">Columns Visibility</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-48">
      {table.getAllLeafColumns().map((column) => (
        <DropdownMenuCheckboxItem
          key={column.id}
          className="capitalize"
          checked={column.getIsVisible()}
          onCheckedChange={() => column.toggleVisibility()}
        >
          {column.id}
        </DropdownMenuCheckboxItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
    </div>
  )
}

export default ColumnVisibility