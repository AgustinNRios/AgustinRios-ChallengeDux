import { useState } from 'react';
import { Usuario } from '@/domains/users/model/usuario';

interface UseUsuarioModalReturn {
  showModal: boolean;
  editingUsuario: Usuario | null;
  isEditing: boolean;
  openCreateModal: () => void;
  openEditModal: (usuario: Usuario) => void;
  closeModal: () => void;
}

export const useUsuarioModal = (): UseUsuarioModalReturn => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);

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

  return {
    showModal,
    editingUsuario,
    isEditing,
    openCreateModal,
    openEditModal,
    closeModal,
  };
};
