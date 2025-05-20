import { hookstate } from "@hookstate/core";
import { useHookstate } from "@hookstate/core";
import type { EditProductData } from "@/types";
import { useCallback } from "react";
import { getEditedProductById, saveEditedProduct } from "@/utils/localStorageUtils";
import { useNavigate } from "react-router-dom";

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


export function useProductFormState(id?: string) {
  const state = useHookstate(productFormState);
  const navigate = useNavigate();

  const fetchProductById = useCallback(async (id: string) => {
    state.loading.set(true);
    try {
      const localData = getEditedProductById(Number(id));
      if (localData) {
        state.data.set(localData);
        return localData;
      }
      const res = await fetch(`https://dummyjson.com/products/${id}`);
      if (!res.ok) throw new Error("Failed to fetch product");
      
      const data = await res.json();
      state.data.set({
        title: data.title,
        description: data.description,
        price: data.price,
      });
      return data;
    } catch (error) {
      throw error;
    } finally {
      state.loading.set(false);
    }
  }, [state]);

  const saveProduct = useCallback(
    async (data: EditProductData, id?: string) => {
      if (!id) return;

      state.saving.set(true);
      try {
        const res = await fetch(`https://dummyjson.com/products/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error("Failed to save product");

        const responseData = await res.json();
        saveEditedProduct(Number(id), responseData);

        navigate("/", { state: responseData });
      } catch (error) {
        // Optionally handle error
        throw error;
      } finally {
        state.saving.set(false);
      }
    },
    [state, navigate]
  );

  return {
    state,
    fetchProductById,
    saveProduct,
  };
}