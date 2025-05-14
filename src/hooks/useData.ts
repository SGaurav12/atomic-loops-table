import { useEffect, useState, useRef } from 'react';
import type { Product, Sort } from '@/types';

type Pagination = {
  pageIndex: number;
  pageSize: number;
};

export const useData = (pagination: Pagination, sorting: Sort[], searchQuery: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  //using ref hook to get last query and prevent duplicate request in console.
  const lastQueryRef = useRef<string>("");

  useEffect(() => {
     const queryKey = JSON.stringify({ pagination, sorting, searchQuery });

    if (queryKey === lastQueryRef.current) {
      return;
    }

    lastQueryRef.current = queryKey;

    const fetchData = async () => {
      try {
        setLoading(true);

      const baseUrl = "https://dummyjson.com/products";
      const limit = pagination.pageSize;
      const skip = pagination.pageIndex * pagination.pageSize;

      let url = "";

      if (searchQuery.trim()) {
        url = `${baseUrl}/search?q=${encodeURIComponent(searchQuery)}&limit=${limit}&skip=${skip}`;
      } else {
        url = `${baseUrl}?limit=${limit}&skip=${skip}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      const sorted = [...data.products];
      if (sorting.length) {
        const { id, desc } = sorting[0];
        sorted.sort((a, b) => (a[id] > b[id] ? (desc ? -1 : 1) : a[id] < b[id] ? (desc ? 1 : -1) : 0));
      }

      setProducts(sorted);
      setTotalCount(data.total);
      } catch (error) {
        console.log(error);
      } finally {
      setLoading(false);
    }
    };

    fetchData();

  }, [pagination, sorting, searchQuery]);

  return { products, totalCount, loading };
};
