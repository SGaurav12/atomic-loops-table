import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import type { Product } from "@/types";
import { SortingPopover } from "./sorting-popover";

interface CreateColumnsProps {
  onEdit: (id: number) => void;
  onView: (id: number) => void;
}

export function createColumns({ onView }: CreateColumnsProps): ColumnDef<Product>[] { 
  return [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <SortingPopover column={column} label="ID" />
    ),
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <SortingPopover column={column} label="Title" sortType="alphabetical"  />
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
      header: "Actions",
      cell: ({ row }) => {
        const id = row.original.id;
        return (
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => onView(id)}>View</Button>
          </div>
        );
      },
    },
];
}