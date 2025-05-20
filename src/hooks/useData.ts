import { useEffect, useState, useRef } from 'react';
import type { Product, Sort } from '@/types';

type Pagination = {
  pageIndex: number;
  pageSize: number;
};

export const useData = (
  pagination: Pagination,
  sorting: Sort[],
  searchQuery: string,
  updatedProduct?: Product
) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const lastQueryRef = useRef<string>("");

  useEffect(() => {
    const queryKey = JSON.stringify({ pagination, sorting, searchQuery });
    if (queryKey === lastQueryRef.current) return;

    lastQueryRef.current = queryKey;

    const fetchData = async () => {
      try {
        setLoading(true);
        const baseUrl = "https://dummyjson.com/products";
        const limit = pagination.pageSize;
        const skip = pagination.pageIndex * pagination.pageSize;

        const url = searchQuery.trim()
          ? `${baseUrl}/search?q=${encodeURIComponent(searchQuery)}&limit=${limit}&skip=${skip}`
          : `${baseUrl}?limit=${limit}&skip=${skip}`;

        const res = await fetch(url);
        const data = await res.json();

        let items = [...data.products];

        if (sorting.length) {
          const { id, desc } = sorting[0];
          items.sort((a, b) =>
            a[id] > b[id] ? (desc ? -1 : 1) : a[id] < b[id] ? (desc ? 1 : -1) : 0
          );
        }

        if (updatedProduct) {
          const index = items.findIndex((p) => p.id === updatedProduct.id);
          if (index !== -1) {
            items[index] = updatedProduct;
          }
        }

        setProducts(items);
        setTotalCount(data.total);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pagination, sorting, searchQuery, updatedProduct]);

  return { products, setProducts, totalCount, loading };
};
