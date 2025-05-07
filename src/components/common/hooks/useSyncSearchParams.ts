import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface UseSyncSearchParamsProps {
  search: string;
  currentPage: number;
  setSearch: (search: string) => void;
  setCurrentPage: (page: number) => void;
}

export default function useSyncSearchParams({
  search,
  currentPage,
  setSearch,
  setCurrentPage,
}: UseSyncSearchParamsProps) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  useEffect(() => {
    const currentSearch = searchParams.get('search') || '';
    const currentPageParam = Number(searchParams.get('page')) || 1;

    if (search !== currentSearch || currentPage !== currentPageParam) {
      setSearch(currentSearch);
      setCurrentPage(currentPageParam);
    }
  }, [location.search, search, currentPage, setSearch, setCurrentPage]);
}
