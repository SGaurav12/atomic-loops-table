import { hookstate, useHookstate } from "@hookstate/core";
import type { ProductDetails } from "@/types";

export const productDetailsState = hookstate({
  product: null as ProductDetails | null,
  loading: false,
  error: "" as string | null,
});

export function useProductDetailsState() {
  const state = useHookstate(productDetailsState);

  return {
    product: state.product.get(),
    setProduct: (val: ProductDetails | null) => state.product.set(val),
    loading: state.loading.get(),
    setLoading: (val: boolean) => state.loading.set(val),
    error: state.error.get(),
    setError: (val: string | null) => state.error.set(val),
    reset: () => {
      state.product.set(null);
      state.loading.set(false);
      state.error.set("");
    },
  };
};