import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useData } from "./useData";
import { useTableQueryParams } from "./useTableQueryParams";
import { createColumns } from "../components/table/columns";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Product } from "@/types";
import { getAllEditedProductsFromLocalStorage } from "@/utils/localStorageUtils"; // helper to get edits

export function useDataTable(updatedProduct?: Product) {
  const {
    pagination,
    setPagination,
    sorting,
    setSorting,
    searchQuery,
    setSearchQuery,
  } = useTableQueryParams();

  const navigate = useNavigate();
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const { products: fetchedProducts, totalCount } = useData(
    pagination,
    sorting,
    searchQuery,
    updatedProduct
  );

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Get locally saved edits from localStorage (returns object keyed by product id)
    const localEdits = getAllEditedProductsFromLocalStorage();

    // Merge local edits into fetchedProducts from server
    let mergedProducts = fetchedProducts.map((prod) =>
      localEdits[prod.id] ? localEdits[prod.id] : prod
    );

    // If updatedProduct is passed, apply it (highest priority)
    if (updatedProduct) {
      // Replace if exists, or add if missing
      const exists = mergedProducts.some((p) => p.id === updatedProduct.id);
      if (exists) {
        mergedProducts = mergedProducts.map((p) =>
          p.id === updatedProduct.id ? updatedProduct : p
        );
      } else {
        mergedProducts.push(updatedProduct);
      }
    }

    setProducts(mergedProducts);
  }, [fetchedProducts, updatedProduct]);

const filteredProducts = products.filter((product) =>
  [product.title, product.description]
    .some((field) =>
      field?.toLowerCase().includes(searchQuery.toLowerCase())
    )
);

  const columns = createColumns({
    onEdit: (id) => {
      const product = products.find((p) => p.id === id);
      setEditProduct(product ?? null);
    },
    onView: (id) => navigate(`/products/${id}`),
  });

  const table = useReactTable({
    columns,
    data: filteredProducts,
    pageCount: Math.ceil(totalCount / pagination.pageSize),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    manualSorting: true,
    state: { pagination, sorting },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    autoResetPageIndex: false,
  });

  return {
    table,
    products,
    setProducts,
    searchQuery,
    setSearchQuery,
    editProduct,
    setEditProduct,
  };
}