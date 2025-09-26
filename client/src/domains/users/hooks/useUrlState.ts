import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';

interface UrlStateParams {
  page: number;
  limit: number;
  sortField: string;
  sortOrder: 1 | -1 | null;
  search: string;
  estado: string;
}

/**
 * Hook para sincronizar el estado de los filtros y la paginación con la URL.
 */
export const useUrlState = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [urlState, setUrlState] = useState<UrlStateParams>({
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '5'),
    sortField: searchParams.get('sortField') || 'id',
    sortOrder: searchParams.get('sortOrder') === '-1' ? -1 : 
              searchParams.get('sortOrder') === '1' ? 1 : 1,
    search: searchParams.get('search') || '',
    estado: searchParams.get('estado') || '',
  });

  const updateUrl = useCallback((newParams: Partial<UrlStateParams>) => {
    const updatedState = { ...urlState, ...newParams };
    setUrlState(updatedState);

    const params = new URLSearchParams();
    
    if (updatedState.page !== 1) params.set('page', updatedState.page.toString());
    if (updatedState.limit !== 5) params.set('limit', updatedState.limit.toString());
    if (updatedState.sortField !== 'id') params.set('sortField', updatedState.sortField);
    if (updatedState.sortOrder !== 1) params.set('sortOrder', updatedState.sortOrder?.toString() || '1');
    if (updatedState.search) params.set('search', updatedState.search);
    if (updatedState.estado) params.set('estado', updatedState.estado);

    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : window.location.pathname;
    
    router.push(newUrl, { scroll: false });
  }, [router, urlState]);

  const resetToFirstPage = useCallback((otherParams?: Partial<UrlStateParams>) => {
    updateUrl({ page: 1, ...otherParams });
  }, [updateUrl]);

  return {
    urlState,
    updateUrl,
    resetToFirstPage,
  };
};
