import { useState } from "react";
import { DataTable, PaginationControls, ColumnVisibility, SearchInput } from "../components/table";
import { useDataTable } from "../hooks/useDataTable";
import { EditProductDialog, type EditProductData } from "../components/table/edit-product-dialog";

export default function DetailsList() {
  const { table, products, setProducts, searchQuery, setSearchQuery } = useDataTable();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<EditProductData & { id: number } | null>(null);

  const handleSaveProduct = async (updatedData: EditProductData) => {
    if (!editingProduct) return;

    try {
      const res = await fetch(`https://dummyjson.com/products/${editingProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) throw new Error("Failed to update product");

      const updated = await res.json();

      // Update local state
    setProducts((prev) =>
      prev.map((product) => (product.id === updated.id ? updated : product))
    );

      setIsEditDialogOpen(false);
      setEditingProduct(null);
    } catch (err) {
      console.error("Edit failed:", err);
    }
  };

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
      />

      <div className="flex justify-end">
        <PaginationControls table={table} />
      </div>

      {/* Render Edit Dialog */}
      <EditProductDialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleSaveProduct}
        initialData={editingProduct}
      />
    </div>
  );
}
