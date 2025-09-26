'use client';

import { useUsuarioModalContext } from '@/domains/users/context/UsuarioModalContext';
import { useUsuarioActions } from '@/domains/users/hooks/useUsuarioActions';
import { UsuarioModal } from '@/domains/users/components/usuarioModal/UsuarioModal';

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

  const {
    createUsuario,
    updateUsuario,
  } = useUsuarioActions({
    onSuccess: () => {
      closeModal();
      // Llamar al callback para refrescar los datos de la tabla
      onDataChange?.();
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
