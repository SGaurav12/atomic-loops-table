import './App.css'
import { useState, useEffect } from 'react';
import { useReactTable, getCoreRowModel, getPaginationRowModel } from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import DataTable from './components/data-table';
import { Button } from './components/ui/button';
import { ArrowUpDown } from 'lucide-react';

type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  brand: string;
};

interface Sort {
  id: string;
  desc: boolean;
}

const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'id',
    enableSorting: true,
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        ID <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: 'title',
    enableSorting: true,
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Title <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      const full = row.original.description;
      const preview = full.split(' ').slice(0, 5).join(' ');
      return <span title={full}>{preview}...</span>;
    },
  },
  {
    accessorKey: 'price',
    header: 'Price ($)',
  },
  {
    accessorKey: 'brand',
    header: 'Brand',
  },
];

function App() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<Sort[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `https://dummyjson.com/products?limit=${pagination.pageSize}&skip=${pagination.pageIndex * pagination.pageSize}`
        );
        const data = await response.json();

        const sortedProducts = [...data.products];
        if (sorting.length > 0) {
          const { id, desc } = sorting[0];
          sortedProducts.sort((a, b) => {
            if (a[id as keyof Product] < b[id as keyof Product]) return desc ? 1 : -1;
            if (a[id as keyof Product] > b[id as keyof Product]) return desc ? -1 : 1;
            return 0;
          });
        }

        setProducts(sortedProducts);
        setTotalCount(data.total);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [pagination.pageIndex, pagination.pageSize, sorting]);

  const table = useReactTable({
    columns,
    data: products,
    pageCount: Math.ceil(totalCount / pagination.pageSize),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    manualSorting: true,
    state: {
      pagination,
      sorting,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    autoResetPageIndex: false,
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable table={table} />
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
          {'<<'}
        </Button>
        <Button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          {'<'}
        </Button>
        <Button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          {'>'}
        </Button>
        <Button onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
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
    </div>
  );
}

export default App;
