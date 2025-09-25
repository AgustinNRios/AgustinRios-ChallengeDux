import { useState, useEffect } from 'react';
import { Usuario, PaginationParams } from '@/domains/users/model/usuario';
import { usuarioService } from '@/domains/users/service/usuarioService';

interface UseUsuariosReturn {
  usuarios: Usuario[];
  loading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error: string | null;
  fetchUsuarios: (params?: PaginationParams) => Promise<void>;
  refreshUsuarios: () => Promise<void>;
  setInitialData: (usuarios: Usuario[], pagination: { page: number; limit: number; total: number; totalPages: number; }) => void;
}

export const useUsuarios = (): UseUsuariosReturn => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [initialDataSet, setInitialDataSet] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 0,
  });

  const fetchUsuarios = async (params?: PaginationParams) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await usuarioService.getUsuarios(params);
      
      setUsuarios(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar usuarios');
      console.error('Error fetching usuarios:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshUsuarios = async () => {
    await fetchUsuarios({
      page: pagination.page,
      limit: pagination.limit,
    });
  };

  const setInitialData = (initialUsuarios: Usuario[], initialPagination: { page: number; limit: number; total: number; totalPages: number; }) => {
    if (!initialDataSet) {
      setUsuarios(initialUsuarios);
      setPagination(initialPagination);
      setInitialDataSet(true);
    }
  };

  useEffect(() => {
    // Solo hacer fetch si no se han establecido datos iniciales
    if (!initialDataSet) {
      fetchUsuarios();
    }
  }, [initialDataSet]);

  return {
    usuarios,
    loading,
    pagination,
    error,
    fetchUsuarios,
    refreshUsuarios,
    setInitialData,
  };
};
