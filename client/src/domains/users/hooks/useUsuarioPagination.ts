import { useState, useEffect } from 'react';
import { Usuario, PaginationParams } from '@/domains/users/model/usuario';
import { usuarioService } from '@/domains/users/service/usuarioService';
import { PAGINATION_LIMITS, ERROR_MESSAGES } from '@/domains/users/utils/constants';

interface UseUsuarioPaginationReturn {
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

/**
 * Hook para gestionar la paginación, carga de datos y estado de la tabla de usuarios.
 * Encapsula la comunicación con la API y la lógica de hidratación de datos desde el servidor (ISR).
 */
export const useUsuarioPagination = (): UseUsuarioPaginationReturn => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [initialDataSet, setInitialDataSet] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }>({
    page: 1,
    limit: PAGINATION_LIMITS.SMALL,
    total: 0,
    totalPages: 0,
  });

  const fetchUsuarios = async (params?: PaginationParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await usuarioService.getUsuarios(params);
      if (response && response.data && response.pagination) {
        setUsuarios(response.data);
        setPagination(response.pagination);
      } else {
        throw new Error('La respuesta de la API no tiene el formato esperado.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.FETCH_USERS;
      setError(errorMessage);
      console.error('Error en fetchUsuarios:', err);
    } finally {
      setLoading(false);
    }
  };

  // Refresca los datos de la tabla con los parámetros de paginación actuales.
  const refreshUsuarios = async () => {
    await fetchUsuarios({
      page: pagination.page,
      limit: pagination.limit,
    });
  };

  // Establece los datos iniciales del servidor (ISR) y previene fetches adicionales.
  const setInitialData = (initialUsuarios: Usuario[], initialPagination: { page: number; limit: number; total: number; totalPages: number; }) => {
    if (!initialDataSet) {
      setUsuarios(initialUsuarios);
      setPagination(initialPagination);
      setInitialDataSet(true);
    }
  };

  // Carga los datos iniciales si no fueron provistos por el servidor.
  useEffect(() => {
    if (!initialDataSet) {
      // Llamar directamente a la lógica sin depender de la función fetchUsuarios
      const loadInitialData = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await usuarioService.getUsuarios();
          if (response && response.data && response.pagination) {
            setUsuarios(response.data);
            setPagination(response.pagination);
          } else {
            throw new Error('La respuesta de la API no tiene el formato esperado.');
          }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.FETCH_USERS;
          setError(errorMessage);
          console.error('Error en fetchUsuarios:', err);
        } finally {
          setLoading(false);
        }
      };
      
      loadInitialData();
    }
  }, [initialDataSet]); // Solo depende de initialDataSet

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
