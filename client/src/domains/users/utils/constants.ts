export interface Filtros {
  search: string;
  estado: string;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginationEvent {
  page?: number;
  rows?: number;
  first?: number;
}

/**
 * Estados válidos para filtros
 */
export const VALID_FILTER_STATES = {
  TODOS: 'todos',
  ACTIVE: 'activo',
  INACTIVE: 'inactivo',
} as const;

/**
 * Límites de paginación comunes
 */
export const PAGINATION_LIMITS = {
  SMALL: 5,
  MEDIUM: 10,
  LARGE: 20,
  EXTRA_LARGE: 50,
} as const;

/**
 * Constantes para debounce
 */
export const DEBOUNCE_DELAYS = {
  SEARCH: 500,
  FILTER: 300,
} as const;

/**
 * Mensajes de error comunes
 */
export const ERROR_MESSAGES = {
  FETCH_USERS: 'Error al cargar usuarios',
  CREATE_USER: 'Error al crear el usuario',
  UPDATE_USER: 'Error al actualizar el usuario',
  DELETE_USER: 'Error al eliminar el usuario',
  REQUIRED_FIELD: 'Este campo es requerido',
} as const;
