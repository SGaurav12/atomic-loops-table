import type { ColumnDef } from '@tanstack/react-table'
import './App.css'
import DataTable from './components/data-table';
import { Button } from './components/ui/button';
import { useState, useEffect } from 'react';
import { ArrowUpDown } from 'lucide-react';
import { useReactTable, getCoreRowModel, getPaginationRowModel } from '@tanstack/react-table';

type Post = {
  userId: number
  id: number
  title: string
  body: string
}

const columns : ColumnDef<Post>[] = [
  {
    accessorKey: "userId",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        User Id
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Post Id
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Title
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
     cell: ({ row }) => {
      const full = row.original.title;
      const words = full.split(' ').slice(0, 5).join(' ');
      return <span title={full}>{words}...</span>;
    },
  },
  {
    accessorKey: "body",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Body
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
     cell: ({ row }) => {
      const full = row.original.title;
      const words = full.split(' ').slice(0, 5).join(' ');
      return <span title={full}>{words}...</span>;
    },
  },
]


function App() {

  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);

  const [totalCount, setTotalCount] = useState(0);

  const [pagination, setPagination] = useState({
  pageIndex: 0, //initial page index
  pageSize: 10, //default page size
});

 useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const data: Post[] = await response.json();

        const start = pagination.pageIndex * pagination.pageSize;
        const end = start + pagination.pageSize;
        const paginated = data.slice(start, end);

        setPosts(paginated)
        setTotalCount(data.length);
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts();
  }, [pagination.pageIndex, pagination.pageSize])

const table = useReactTable({
  columns,
  data : posts,
  getCoreRowModel: getCoreRowModel(),
  pageCount: Math.ceil(totalCount / pagination.pageSize),
  getPaginationRowModel: getPaginationRowModel(),
  autoResetPageIndex: false, //turn off auto reset of pageIndex
  state: {
    pagination
  },
  onPaginationChange: setPagination,
  manualPagination: true,
  manualSorting: true,
});

 
  if(loading) {
    return(
      <div>
        Loading...
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={posts}/>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
        {'<<'}
        </Button>
      <Button
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        {'<'}
      </Button>
      <Button
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        {'>'}
      </Button>
      <Button
        onClick={() => table.lastPage()}
        disabled={!table.getCanNextPage()}
      >
        {'>>'}
      </Button>
    <select
      value={table.getState().pagination.pageSize}
      onChange={e => {
        table.setPageSize(Number(e.target.value))
      }}
    >
  {[10, 20, 30, 40, 50].map(pageSize => (
    <option key={pageSize} value={pageSize}>
      {pageSize}
    </option>
  ))}
    </select>
      </div>
    </div>
  )
}

export default App;