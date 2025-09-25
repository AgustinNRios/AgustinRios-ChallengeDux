import { useState } from 'react';

interface Filtros {
  search: string;
  estado: string;
}

interface UseUsuarioFiltersReturn {
  filtros: Filtros;
  setFiltros: React.Dispatch<React.SetStateAction<Filtros>>;
  handleSearchChange: (value: string | number) => void;
  handleEstadoChange: (value: string | number) => void;
  resetFilters: () => void;
  getFilterParams: () => {
    search?: string;
    estado?: string;
  };
}

const initialFilters: Filtros = {
  search: '',
  estado: '',
};

export const useUsuarioFilters = (): UseUsuarioFiltersReturn => {
  const [filtros, setFiltros] = useState<Filtros>({
    search: '',
    estado: '', // Asegurar que siempre sea string
  });

  const handleSearchChange = (value: string | number) => {
    setFiltros(prev => ({ ...prev, search: String(value) }));
  };

  const handleEstadoChange = (value: string | number) => {
    // Convertir siempre a string y manejar casos especiales
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
    
    // Solo incluir estado si tiene valor y no es 'todos' o cadena vacía
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
