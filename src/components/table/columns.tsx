import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from "../ui/dropdown-menu";
import { Button } from "../ui/button";

export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  brand: string;
};

interface CreateColumnsProps {
  onEdit: (product: Product) => void;
  onView: (id: number) => void;
}

export function createColumns({ onEdit, onView }: CreateColumnsProps): ColumnDef<Product>[] { 
  return [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        ID <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Title <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const full = row.original.description;
      const preview = full.split(" ").slice(0, 5).join(" ");
      return <span title={full}>{preview}...</span>;
    },
  },
  {
    accessorKey: "price",
    header: "Price ($)",
  },
  {
      id: "actions",
      cell: ({ row }) => {
        const product = row.original;

        return (
          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0 hover:bg-muted"
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => onView(product.id)}
                >
                  View details
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    onEdit(product)
                  }}
                >
                  Edit
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
];
}
