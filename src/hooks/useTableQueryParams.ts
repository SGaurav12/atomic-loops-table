import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

interface Sort {
  id: string;
  desc: boolean;
}

export function useTableQueryParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [pagination, setPagination] = useState({ //local states for pagination such as for index and page size
    pageIndex: parseInt(searchParams.get("page") || "0"),
    pageSize: parseInt(searchParams.get("size") || "10"),
  });

  const [sorting, setSorting] = useState<Sort[]>(() => { //local state for sorting column and order
    const sortParam = searchParams.get("sort") || "";
    const [sortId, sortOrder] = sortParam.split(".");
    return sortId ? [{ id: sortId, desc: sortOrder === "desc" }] : [];
  });

  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || ""); //local state for the search query string


  //Sync local state (pagination, sorting, search) to URL query parameters
  useEffect(() => {
    const params: Record<string, string> = {
      page: pagination.pageIndex.toString(),
      size: pagination.pageSize.toString(),
      search: searchQuery,
    };

    //if sorting is set then add it to query params
    if (sorting[0]) {
      params.sort = `${sorting[0].id}.${sorting[0].desc ? "desc" : "asc"}`;
    }
    setSearchParams(params, { replace: true });
  }, [pagination, sorting, searchQuery, setSearchParams]);

  useEffect(() => { // this hook helps when searchquery change after first render it reset the page index to 0. and start from first apge
    if (searchQuery) {
      setPagination((prev) => ({ ...prev, pageIndex: 0 })); 
    } 
  }, [searchQuery]);

  return {
    pagination,
    setPagination,
    sorting,
    setSorting,
    searchQuery,
    setSearchQuery,
  };
}