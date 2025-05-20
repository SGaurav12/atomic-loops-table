import type { Product } from "@/types";

const LOCAL_STORAGE_KEY = "editedProducts";

export const getEditedProducts = (): Record<number, any> => {
  const data = localStorage.getItem("editedProducts");
  return data ? JSON.parse(data) : {};
};

export const getEditedProductById = (id: number): any | null => {
  const data = getEditedProducts();
  return data[id] || null;
};

export function getEditedProduct(id: number | string) {
  const item = localStorage.getItem(`editedProduct_${id}`);
  return item ? JSON.parse(item) : null;
}

export const saveEditedProduct = (id: number, updatedProduct: any) => {
  const existing = getEditedProducts();
  existing[id] = updatedProduct;
  localStorage.setItem("editedProducts", JSON.stringify(existing));
};

export function getAllEditedProductsFromLocalStorage(): Record<number, Product> {
  const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
};

