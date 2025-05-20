import { useNavigate, useLocation } from "react-router-dom";
import { DataTable, PaginationControls, ColumnVisibility, SearchInput } from "../components/table";
import { useDataTable } from "../hooks/useDataTable";
import { useEffect } from "react";
import type { Product } from "@/types";

export default function DetailsList() {
  const navigate = useNavigate();
  const location = useLocation();
  const updatedProduct = location.state as Product | null;

  const { table, products, setProducts, searchQuery, setSearchQuery } = useDataTable(updatedProduct ?? undefined);

   useEffect(() => {
    if (updatedProduct) {
      setProducts((prev) =>
        prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
      );
    }
  }, [updatedProduct, setProducts]);


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <SearchInput value={searchQuery} onChange={setSearchQuery} />
        {searchQuery && (
          <p className="text-sm text-gray-600 mt-1">
            Found {products.length} results
          </p>
        )}
        <ColumnVisibility table={table} />
      </div>

      <DataTable
        table={table}
        onEdit={(id: number) => navigate(`/products/${id}/edit`)}
      />

      <div className="flex justify-end">
        <PaginationControls table={table} />
      </div>
    </div>
  );
}
