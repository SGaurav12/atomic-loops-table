import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { Column } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { ArrowUp01 } from "lucide-react";
import { ArrowDown10 } from "lucide-react";
import { ArrowUpAZ } from "lucide-react";
import { ArrowDownZA } from "lucide-react";

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
  if (direction === false) {
    column.clearSorting();
  } else {
    column.toggleSorting(direction === "desc");
  }
};
  const headingText = sortType === "alphabetical" ? `Alphabetical sort for ${label}` : `Sort by ${label}`;

  const ascLabel = sortType === "alphabetical" ? "A → Z" : "Ascending";
  const descLabel = sortType === "alphabetical" ? "Z → A" : "Descending";

  return (
    <Popover>
      <PopoverTrigger asChild>
      {/* added sorting ui visibility for user */}
        <Button
          variant="ghost"
          className="flex items-center justify-between text-sm font-medium"
        >
          {label} 
          {currentSort === "asc" && (
            sortType === "alphabetical"
              ? <ArrowUpAZ className="ml-1 h-4 w-4" />
              : <ArrowUp01 className="ml-1 h-4 w-4" />
            )}
            {currentSort === "desc" && (
              sortType === "alphabetical"
              ? <ArrowDownZA className="ml-1 h-4 w-4" />
              : <ArrowDown10 className="ml-1 h-4 w-4" />
            )}
          {currentSort === false && <ChevronDown className="ml-1 h-4 w-4" />}
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