import { hookstate, useHookstate } from '@hookstate/core';
import type { EditProductData, Product } from '@/types';

type Pagination = { pageIndex: number; pageSize: number };
type Sorting = { id: string; desc: boolean }[];

export const productTableState = hookstate({
  selectedRowIds: [] as number[],                // For row selection (multi-select)
  isEditModalOpen: false,                        // Edit modal visibility
  editProductData: null as EditProductData | null, // Data for editing
  pagination: { pageIndex: 0, pageSize: 10 },    // Pagination state
  sorting: [] as Sorting,                        // Sorting state
  searchQuery: "",                               // Search/filter query
  editProduct: null as Product | null,           // Currently editing product
});

export function useProductTableState() {
  const state = useHookstate(productTableState);

  return {
    // Pagination
    pagination: state.pagination.get(),
    setPagination: (val: Pagination) => state.pagination.set(val),

    // Sorting
    sorting: state.sorting.get(),
    setSorting: (val: Sorting) => state.sorting.set(val),

    // Search
    searchQuery: state.searchQuery.get(),
    setSearchQuery: (val: string) => state.searchQuery.set(val),

    // Row selection
    selectedRowIds: state.selectedRowIds.get(),
    setSelectedRowIds: (val: number[]) => state.selectedRowIds.set(val),

    // Edit modal
    isEditModalOpen: state.isEditModalOpen.get(),
    setIsEditModalOpen: (val: boolean) => state.isEditModalOpen.set(val),

    // Edit product data (for modal)
    editProductData: state.editProductData.get(),
    setEditProductData: (val: EditProductData | null) => state.editProductData.set(val),

    // Currently editing product (full object)
    editProduct: state.editProduct.get(),
    setEditProduct: (val: Product | null) => state.editProduct.set(val),
  };
}