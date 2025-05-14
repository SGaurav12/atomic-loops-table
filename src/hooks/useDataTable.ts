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
import type { Product } from "../components/table/columns";

export function useDataTable() {
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
  const { products : fetchedProducts, totalCount } = useData(pagination, sorting, searchQuery);

  const [products, setProducts] = useState<Product[]>([]);
    useEffect(() => {
    setProducts(fetchedProducts);
  }, [fetchedProducts]);
  
    const columns = createColumns({
    onEdit: (product) => setEditProduct(product),
    onView: (id) => navigate(`/products/${id}`),
  })


  const table = useReactTable({
    columns,
    data: products,
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