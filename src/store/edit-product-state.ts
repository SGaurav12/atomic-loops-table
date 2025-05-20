import { hookstate, useHookstate } from "@hookstate/core";
import type { EditProductData } from "@/components/table/edit-product-dialog";

export const editProductDialogState = hookstate({
  open: false,
  initialData: null as EditProductData | null,
});

export function useEditProductDialogState() {
  const state = useHookstate(editProductDialogState);

  return {
    open: state.open.get(),
    setOpen: (val: boolean) => state.open.set(val),
    initialData: state.initialData.get(),
    setInitialData: (val: EditProductData | null) => state.initialData.set(val),
    // Optionally, add a helper to open dialog with data
    openWithData: (data: EditProductData) => {
      state.initialData.set(data);
      state.open.set(true);
    },
    close: () => state.open.set(false),
  };
}