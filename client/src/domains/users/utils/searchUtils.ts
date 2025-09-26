import { PaginationParams } from '@/domains/users/model/usuario';
import { Filtros, PaginationState } from './constants';

/**
 * Construye los parámetros de búsqueda para la API
 */
export const buildSearchParams = (
  pagination: PaginationState,
  filtros: Filtros,
  sortField?: string,
  sortOrder?: 1 | -1 | null
): PaginationParams => {
  const params: PaginationParams = {
    page: pagination.page,
    limit: pagination.limit,
  };

  // Agregar filtros
  if (filtros.search?.trim()) {
    params.search = filtros.search;
  }

  if (filtros.estado && filtros.estado !== '' && filtros.estado !== 'todos') {
    params.estado = filtros.estado;
  }

  // Agregar ordenamiento
  if (sortField && sortOrder) {
    params.sortField = sortField;
    params.sortOrder = sortOrder;
  }

  return params;
};

/**
 * Construye los parámetros para búsqueda con página específica
 */
export const buildSearchParamsWithPage = (
  page: number,
  pagination: PaginationState,
  filtros: Filtros,
  sortField?: string,
  sortOrder?: 1 | -1 | null
): PaginationParams => {
  return buildSearchParams(
    { ...pagination, page },
    filtros,
    sortField,
    sortOrder
  );
};

/**
 * Construye los parámetros para búsqueda desde el inicio (página 1)
 */
export const buildSearchParamsFromStart = (
  pagination: PaginationState,
  filtros: Filtros,
  sortField?: string,
  sortOrder?: 1 | -1 | null
): PaginationParams => {
  return buildSearchParamsWithPage(1, pagination, filtros, sortField, sortOrder);
};

/**
 * Valida si un filtro tiene valor
 */
export const isValidFilter = (value: string | undefined): boolean => {
  return Boolean(value && value !== '' && value !== 'todos');
};

/**
 * Calcula si debe incluir el estado en los parámetros
 */
export const shouldIncludeEstado = (estado: string): boolean => {
  return isValidFilter(estado);
};

/**
 * Calcula si debe incluir la búsqueda en los parámetros
 */
export const shouldIncludeSearch = (search: string): boolean => {
  return Boolean(search.trim());
};
