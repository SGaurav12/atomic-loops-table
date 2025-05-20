import { hookstate } from "@hookstate/core";
import type { EditProductData } from "@/types";

export const productFormState = hookstate<{
  data: EditProductData;
  loading: boolean;
  saving: boolean;
}>({
  data: {
    title: "",
    description: "",
    price: 0,
  },
  loading: true,
  saving: false,
});
