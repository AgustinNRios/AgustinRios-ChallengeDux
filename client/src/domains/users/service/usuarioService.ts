import { Usuario, PaginationParams } from '@/domains/users/model/usuario';

/**
 * Objeto que encapsula todas las operaciones de red relacionadas con los usuarios.
 * Funciona como una capa de abstracción entre los componentes de la UI y la API.
 */
export const usuarioService = {
  /**
   * Obtiene una lista paginada y filtrada de usuarios desde la API.
   * @param params - Objeto con parámetros de paginación y filtros (página, límite, búsqueda, etc.).
   * @returns Una promesa que resuelve a un objeto con los datos de los usuarios y la información de paginación.
   */
  async getUsuarios(params: PaginationParams = {}) {
    const { page = 1, limit = 5, search, estado, sortField, sortOrder } = params;

    // Construye los parámetros de la URL de forma dinámica a partir de los filtros.
    const queryParams = new URLSearchParams({
      _page: page.toString(),
      _limit: limit.toString(),
    });

    if (search) queryParams.append('q', search);
    if (estado && estado !== 'todos' && estado !== '') queryParams.append('estado', estado);
    if (sortField && sortOrder) {
      queryParams.append('_sort', sortField);
      queryParams.append('_order', sortOrder === 1 ? 'asc' : 'desc');
    }

    const url = `/api/usuarios?${queryParams}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al obtener los usuarios: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return data;
  },

  async createUsuario(usuario: Usuario) {
    const response = await fetch('/api/usuarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(usuario),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al crear el usuario');
    }

    return response.json();
  },

  async updateUsuario(id: string, usuario: Partial<Usuario>) {
    const response = await fetch(`/api/usuarios/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(usuario),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al actualizar el usuario');
    }

    return response.json();
  },

  async deleteUsuario(id: string) {
    const response = await fetch(`/api/usuarios/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al eliminar el usuario');
    }
  },
};
