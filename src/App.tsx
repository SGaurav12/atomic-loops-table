import './App.css'
import { useState } from 'react';
import { useReactTable, getCoreRowModel, getPaginationRowModel } from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import DataTable from './components/data-table';
import { Button } from './components/ui/button';
import { ArrowUpDown } from 'lucide-react';

import PaginationControls from './components/pagination-controls';
import ColumnVisibility from './components/column-visibility';
import { useData } from './hooks/useData';

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
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<Sort[]>([]);

  const [columnVisibility, setColumnVisibility] = useState({});

    const { products, totalCount, loading } = useData(pagination, sorting);

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
      columnVisibility
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    autoResetPageIndex: false,
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-end mb-4">
        <ColumnVisibility table={table}/>
      </div>

      <DataTable table={table} />
      <PaginationControls table={table}/>
    </div>
  );
}

export default App;
