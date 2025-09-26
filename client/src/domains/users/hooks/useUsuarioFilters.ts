import { useState, Dispatch, SetStateAction } from 'react';
import { Filtros } from '@/domains/users/utils/constants';

interface UseUsuarioFiltersReturn {
  filtros: Filtros;
  setFiltros: Dispatch<SetStateAction<Filtros>>;
  handleSearchChange: (value: string | number) => void;
  handleEstadoChange: (value: string | number) => void;
  resetFilters: () => void;
  getFilterParams: () => {
    search?: string;
    estado?: string;
  };
}


/**
 * Hook personalizado para gestionar el estado y la lógica de los filtros de la tabla de usuarios.
 * Centraliza el manejo de los filtros de búsqueda y estado, facilitando su reutilización y mantenimiento.
 */
const initialFilters: Filtros = {
  search: '',
  estado: '',
};

export const useUsuarioFilters = (): UseUsuarioFiltersReturn => {
  const [filtros, setFiltros] = useState<Filtros>(initialFilters);

  const handleSearchChange = (value: string | number) => {
    setFiltros(prev => ({ ...prev, search: String(value) }));
  };

  const handleEstadoChange = (value: string | number) => {
    let estadoValue: string;
    if (typeof value === 'object') {
      estadoValue = '';
    } else {
      estadoValue = String(value);
    }
    setFiltros(prev => ({ ...prev, estado: estadoValue }));
  };

  const resetFilters = () => {
    setFiltros(initialFilters);
  };

  const getFilterParams = () => {
    const params: { search?: string; estado?: string } = {};
    if (filtros.search.trim()) {
      params.search = filtros.search;
    }
    if (filtros.estado && filtros.estado !== '' && filtros.estado !== 'todos') {
      params.estado = filtros.estado;
    }
    return params;
  };

  return {
    filtros,
    setFiltros,
    handleSearchChange,
    handleEstadoChange,
    resetFilters,
    getFilterParams,
  };
};
