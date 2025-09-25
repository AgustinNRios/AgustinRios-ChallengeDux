import { Usuario, PaginationParams } from '@/domains/users/model/usuario';

export const usuarioService = {
  async getUsuarios(params: PaginationParams = {}) {
    const { page = 1, limit = 10, search, estado, sortField, sortOrder } = params;

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
      throw new Error('Error al obtener los usuarios');
    }

    const data = await response.json();
    return data;
  },

  async getUsuarioById(id: string): Promise<Usuario> {
    const response = await fetch(`/api/usuarios/${id}`);
    
    if (!response.ok) {
      throw new Error('Usuario no encontrado');
    }

    return response.json();
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
