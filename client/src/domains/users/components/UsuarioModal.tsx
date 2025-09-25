'use client';

import { Dialog } from 'primereact/dialog';
import { Usuario } from '@/domains/users/model/usuario';
import { UsuarioForm } from './UsuarioForm';

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
        <div className="flex align-items-center">
          {isEditing ? 'Editar Usuario' : 'Usuario'}
        </div>
      }
      visible={visible}
      style={{ width: '500px' }}
      modal
      className="p-fluid"
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
