'use client';

import { Dialog } from 'primereact/dialog';
import { Usuario } from '@/domains/users/model/usuario';
import { UsuarioForm } from '@/domains/users/components/usuarioForm/UsuarioForm';
import styles from './UsuarioModal.module.css';

interface UsuarioFormData {
  id?: string;
  usuario: string;
  estado: string;
  sector: number | string;
}

interface UsuarioModalProps {
  visible: boolean;
  onHide: () => void;
  onSave: (data: UsuarioFormData) => void;
  usuario?: Usuario;
  isEditing?: boolean;
}

export const UsuarioModal = ({ visible, onHide, onSave, usuario, isEditing = false }: UsuarioModalProps) => {
  const handleSubmit = (data: UsuarioFormData) => {
    onSave(data);
  };

  return (
    <Dialog
      header={
        <div className={styles.header}>
          {isEditing ? 'Editar Usuario' : 'Usuario'}
        </div>
      }
      visible={visible}
      style={{ width: '500px' }}
      modal
      className={styles.dialog}
      onHide={onHide}
      draggable={false}
      resizable={false}
    >
      <UsuarioForm
        onSubmit={handleSubmit}
        onCancel={onHide}
        initialValues={usuario || {}}
        isEditing={isEditing}
      />
    </Dialog>
  );
};
