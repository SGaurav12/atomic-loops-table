import { hookstate, useHookstate } from "@hookstate/core";
import type { ProductDetails } from "@/types";

const initialState = {
  product: null as ProductDetails | null,
  loading: false,
  error: null as string | null,
};

const globalState = hookstate(initialState);

export function useProductDetailsState() {
  const state = useHookstate(globalState);


  console.log("Hookstate Raw State:", state);

  return {
    product: state.product?.get?.() ?? null,
    setProduct: (val: ProductDetails | null) => state.product?.set?.(val),

    loading: state.loading?.get?.() ?? false,
    setLoading: (val: boolean) => state.loading?.set?.(val),

    error: state.error?.get?.() ?? null,
    setError: (val: string | null) => state.error?.set?.(val),

    reset: () => {
      state.product?.set?.(null);
      state.loading?.set?.(false);
      state.error?.set?.(null);
    },
  };
}
