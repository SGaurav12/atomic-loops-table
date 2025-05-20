import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { Column } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";

interface SortingPopoverProps<T> {
  column: Column<T, unknown>;
  label: string;
  sortType?: "default" | "alphabetical"; // Add sort type
}

export function SortingPopover<T>({
  column,
  label,
  sortType = "default", // fallback to default
}: SortingPopoverProps<T>) {
  const currentSort = column.getIsSorted(); // "asc", "desc", or false

  const handleSort = (direction: "asc" | "desc" | false) => {
    column.clearSorting();
    if (direction !== false) {
      column.toggleSorting(direction === "desc");
    }
  };

  const headingText = sortType === "alphabetical" ? `Alphabetical sort for ${label}` : `Sort by ${label}`;

  const ascLabel = sortType === "alphabetical" ? "A → Z" : "Ascending";
  const descLabel = sortType === "alphabetical" ? "Z → A" : "Descending";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center justify-between text-sm font-medium"
        >
          {label}
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-36 space-y-1 p-2">
        <p className="text-sm font-semibold text-gray-700">{headingText}</p>
        <Button
          variant={currentSort === "asc" ? "default" : "ghost"}
          onClick={() => handleSort("asc")}
          className="w-full justify-start"
        >
          {ascLabel}
        </Button>
        <Button
          variant={currentSort === "desc" ? "default" : "ghost"}
          onClick={() => handleSort("desc")}
          className="w-full justify-start"
        >
          {descLabel}
        </Button>
        <Button
          variant={currentSort === false ? "default" : "ghost"}
          onClick={() => handleSort(false)}
          className="w-full justify-start"
        >
          None
        </Button>
      </PopoverContent>
    </Popover>
  );
}