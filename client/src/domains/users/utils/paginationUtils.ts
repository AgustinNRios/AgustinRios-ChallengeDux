import { PaginationState, PaginationEvent } from './constants';

/**
 * Convierte un evento de paginación de PrimeReact a parámetros de API
 */
export const convertPaginationEvent = (
  event: PaginationEvent,
  currentPagination: PaginationState
): { page: number; limit: number } => {
  return {
    page: (event.page || 0) + 1, // PrimeReact usa índice 0, la API usa 1
    limit: event.rows || currentPagination.limit,
  };
};

/**
 * Calcula el total de páginas basado en total de elementos y límite por página
 */
export const calculateTotalPages = (total: number, limit: number): number => {
  return Math.ceil(total / limit);
};

/**
 * Valida si una página está dentro del rango válido
 */
export const isValidPage = (page: number, totalPages: number): boolean => {
  return page >= 1 && page <= totalPages;
};

/**
 * Obtiene la página anterior válida
 */
export const getPreviousPage = (currentPage: number): number => {
  return Math.max(1, currentPage - 1);
};

/**
 * Obtiene la página siguiente válida
 */
export const getNextPage = (currentPage: number, totalPages: number): number => {
  return Math.min(totalPages, currentPage + 1);
};

/**
 * Obtiene el número de elementos a mostrar en la página actual
 */
export const getCurrentPageItems = (
  currentPage: number,
  limit: number,
  total: number
): { start: number; end: number } => {
  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, total);

  return { start, end };
};
