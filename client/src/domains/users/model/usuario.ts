export interface Usuario {
  id?: string;
  estado: UserStatus;
  sector: number;
  usuario: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UsuariosResponse {
  data: Usuario[];
  pagination: Pagination;
}

export enum UserStatus {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  estado?: string;
  sortField?: string;
  sortOrder?: 1 | -1 | null;
}

// Sector fijo - no se usa en filtros
export const SECTOR_FIJO = 5000;

export const SECTORES_FORM = [
  { label: 'Desarrollo', value: 5000 },
];

export const ESTADOS = [
  { label: 'Todos los estados', value: '' },
  { label: 'Activo', value: 'ACTIVO' },
  { label: 'Inactivo', value: 'INACTIVO' },
];

export const ESTADOS_FORM = [
  { label: 'Activo', value: UserStatus.ACTIVO },
  { label: 'Inactivo', value: UserStatus.INACTIVO },
];