'use client';

import { useUsuarioModalContext } from '@/domains/users/context/UsuarioModalContext';
import { useUsuarioActions } from '@/domains/users/hooks/useUsuarioActions';
import { UsuarioModal } from '@/domains/users/components/usuarioModal/UsuarioModal';
import { useUsuarioPagination } from '../../hooks/useUsuarioPagination';
import { useUsuarioFilters } from '../../hooks/useUsuarioFilters';

/**
 * Container que maneja la lógica del modal de usuario.
 * Conecta el estado del modal (del contexto) con las acciones CRUD.
 * Cuando se completa una acción exitosamente, cierra el modal y refresca los datos.
 */
export const UsuarioModalContainer = () => {
  const {
    showModal,
    editingUsuario,
    isEditing,
    closeModal,
    onDataChange,
  } = useUsuarioModalContext();

    // const {
    //   filtros,
    // } = useUsuarioFilters();
  // const { fetchUsuarios } = useUsuarioPagination();

  const {
    createUsuario,
    updateUsuario,
  } = useUsuarioActions({
    onSuccess: () => {
      closeModal();
    },
    refreshData: async () => {
      // Ejecuta la función registrada desde UsuariosTable
      if (onDataChange) {
        await onDataChange();
      }
    },
  });

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

  return (
    <UsuarioModal
      visible={showModal}
      onHide={closeModal}
      onSave={handleSave}
      usuario={editingUsuario || undefined}
      isEditing={isEditing}
    />
  );
};
