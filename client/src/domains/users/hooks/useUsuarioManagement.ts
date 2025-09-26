import { useUsuarios } from '@/domains/users/hooks/useUsuarios';
import { useUsuarioFilters } from '@/domains/users/hooks/useUsuarioFilters';
import { useUsuarioActions } from '@/domains/users/hooks/useUsuarioActions';
import { Usuario } from '@/domains/users/model/usuario';
import { DataTableStateEvent, DataTableSortEvent } from 'primereact/datatable';
import { useRef, useState } from 'react';

export const useUsuarioManagement = () => {
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [sortField, setSortField] = useState<string>('id');
  const [sortOrder, setSortOrder] = useState<1 | -1 | null>(1);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);

  const {
    usuarios,
    loading,
    pagination,
    error,
    fetchUsuarios,
    refreshUsuarios,
    setInitialData,
  } = useUsuarios();

  const {
    filtros,
    setFiltros,
    handleSearchChange,
    resetFilters,
  } = useUsuarioFilters();

  // Modal management functions
  const openCreateModal = () => {
    setEditingUsuario(null);
    setShowModal(true);
  };

  const openEditModal = (usuario: Usuario) => {
    setEditingUsuario(usuario);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUsuario(null);
  };

  const isEditing = editingUsuario !== null;

  const handleEstadoChange = (value: string | number) => {
    // Convertir a string de forma segura
    let estadoValue: string;
    if (typeof value === 'object') {
      estadoValue = '';
    } else {
      estadoValue = String(value);
    }
    
    // Actualizar el filtro inmediatamente
    setFiltros(prev => ({ ...prev, estado: estadoValue }));
    
    // Preparar parámetros de búsqueda con el nuevo estado
    const params: { page: number; limit: number; search?: string; estado?: string } = { 
      page: 1, 
      limit: pagination.limit 
    };
    
    // Agregar búsqueda si existe
    if (filtros.search.trim()) {
      params.search = filtros.search;
    }
    
    // Agregar estado solo si no es vacío o "todos"
    if (estadoValue && estadoValue !== '' && estadoValue !== 'todos') {
      params.estado = estadoValue;
    }
    
    // Ejecutar búsqueda inmediatamente
    fetchUsuarios({ ...params, sortField, sortOrder });
  };

  const {
    toast,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    showSuccess,
    showError,
  } = useUsuarioActions({
    onSuccess: () => {
      closeModal();
      refreshUsuarios();
    },
  });

  // Funciones combinadas
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params: { page: number; limit: number; search?: string; estado?: string } = {
      page: 1,
      limit: pagination.limit
    };
    
    if (filtros.search.trim()) {
      params.search = filtros.search;
    }
    
    if (filtros.estado && filtros.estado !== '' && filtros.estado !== 'todos') {
      params.estado = filtros.estado;
    }
    
    fetchUsuarios(params);
  };

  // Manejar cambios de paginación
  const handlePageChange = (event: DataTableStateEvent) => {
    const params: { page: number; limit: number; search?: string; estado?: string } = {
      page: (event.page || 0) + 1, // PrimeReact usa índice 0, la api usa 1
      limit: event.rows || pagination.limit
    };
    
    if (filtros.search.trim()) {
      params.search = filtros.search;
    }
    
    if (filtros.estado && filtros.estado !== '' && filtros.estado !== 'todos') {
      params.estado = filtros.estado;
    }
    
    fetchUsuarios(params);
  };

  // Búsqueda automática cuando cambia el texto de búsqueda
  const handleSearchInputChange = (value: string | number) => {
    handleSearchChange(value);
    
    // Limpiar timeout anterior si existe
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Debounce para evitar demasiadas llamadas
    searchTimeoutRef.current = setTimeout(() => {
      const searchValue = String(value);
      const params: { page: number; limit: number; search?: string; estado?: string } = {
        page: 1,
        limit: pagination.limit
      };
      
      if (searchValue.trim()) {
        params.search = searchValue;
      }
      
      if (filtros.estado && filtros.estado !== '' && filtros.estado !== 'todos') {
        params.estado = filtros.estado;
      }
      
      fetchUsuarios(params);
    }, 500);
  };


  const handleCreate = () => {
    openCreateModal();
  };

  const handleEdit = (usuario: Usuario) => {
    openEditModal(usuario);
  };

  const handleDelete = async (usuario: Usuario) => {
    // La confirmación ahora se delega a un modal u otro componente de la UI.
    // Se llama directamente a la acción de eliminar.
    await deleteUsuario(usuario);
  };

  const handleSort = (e: DataTableSortEvent) => {
    const field = e.sortField;
    const order = e.sortOrder as (1 | -1 | null);
    setSortField(field);
    setSortOrder(order);
    fetchUsuarios({
      page: 1, // Reset to first page on sort
      limit: pagination.limit,
      search: filtros.search,
      estado: filtros.estado,
      sortField: field,
      sortOrder: order,
    });
  };

  const handleSave = async (data: {
    id?: string;
    usuario: string;
    estado: string;
    sector: number | string;
  }) => {
    if (isEditing) {
      await updateUsuario(data);
    } else {
      await createUsuario(data);
    }
  };

  return {
    // Estado
    usuarios,
    loading,
    pagination,
    error,
    showModal,
    editingUsuario,
    isEditing,
    filtros,
    toast,
    
    // Acciones de filtros
    setFiltros,
    handleSearchChange: handleSearchInputChange,
    handleEstadoChange,
    resetFilters,
    handleSearch,
    handlePageChange,
    
    // Acciones de modal
    handleCreate: openCreateModal,
    handleEdit: openEditModal,
    closeModal,
    
    // Acciones CRUD
    handleSave,
    handleDelete,
    
    // Acciones de datos
    fetchUsuarios,
    refreshUsuarios,
    setInitialData,
    
    // Notificaciones
    showSuccess,
    showError,

    // Ordenamiento
    sortField,
    sortOrder,
    handleSort,
  };
};
