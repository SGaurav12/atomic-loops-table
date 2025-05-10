import { useEffect, useState } from 'react';
import type { Product, Sort } from '@/types';

type Pagination = {
  pageIndex: number;
  pageSize: number;
};

export const useData = (pagination: Pagination, sorting: Sort[]) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await fetch(`https://dummyjson.com/products?limit=${pagination.pageSize}&skip=${pagination.pageIndex * pagination.pageSize}`);
      const data = await res.json();

      const sorted = [...data.products];
      if (sorting.length) {
        const { id, desc } = sorting[0];
        sorted.sort((a, b) => (a[id] > b[id] ? (desc ? -1 : 1) : a[id] < b[id] ? (desc ? 1 : -1) : 0));
      }

      setProducts(sorted);
      setTotalCount(data.total);
      setLoading(false);
    };

    fetchData();
  }, [pagination, sorting]);

  return { products, totalCount, loading };
};
