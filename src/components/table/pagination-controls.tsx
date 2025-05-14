import { Button } from "../ui/button"
import { type Table as ReactTable } from '@tanstack/react-table';

interface DataTableProps<Tdata> {
    table: ReactTable<Tdata>
}

function PaginationControls<TData>({table}:DataTableProps<TData>) {

  return (
    <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="ghost" className="cursor-pointer" aria-label="First Page" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
          {'<<'}
        </Button>
        <Button variant="ghost" className="cursor-pointer" aria-label="Previous Page" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          {'<'}
        </Button>
        <Button variant="ghost" className="cursor-pointer" aria-label="Next Page" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          {'>'}
        </Button>
        <Button variant="ghost" className="cursor-pointer" aria-label="Last page" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
          {'>>'}
        </Button>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </select>
      </div>
  )
}

export default PaginationControls