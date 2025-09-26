"use client";

import { Button } from "primereact/button";
import { Usuario, ESTADOS_FORM } from "@/domains/users/model/usuario";
import { InputGroup } from "@/components/ui/inputGroup/InputGroup";
import { useUsuarioForm } from "@/domains/users/hooks/useUsuarioForm";
import styles from './UsuarioForm.module.css';

interface FormData {
  id?: string;
  usuario: string;
  estado: string;
  sector: number | string;
}

interface UsuarioFormProps {
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  initialValues?: Partial<Usuario>;
  isEditing?: boolean;
}

export const UsuarioForm = ({
  onSubmit,
  onCancel,
  initialValues = {},
  isEditing = false,
}: UsuarioFormProps) => {
  const {
    formData,
    errors,
    handleInputChange,
    handleSubmit,
  } = useUsuarioForm({
    initialValues,
    isEditing,
    onSubmit,
  });


  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className="p-fluid">
        <InputGroup
          type="text"
          icon="pi-id-card"
          value={formData.id || ""}
          onChange={(value) => handleInputChange("id", value)}
          placeholder="Ingrese el ID del usuario"
          label="ID"
          required={!isEditing}
          error={errors.id}
          disabled={isEditing}
        />

        <InputGroup
          type="text"
          icon="pi-user"
          value={formData.usuario}
          onChange={(value) => handleInputChange("usuario", value)}
          placeholder="Ingrese el nombre del usuario"
          label="Nombre:"
          required={true}
          error={errors.usuario}
        />

          <InputGroup 
            value={formData.estado} 
            onChange={(value) => handleInputChange("estado", value)}
            placeholder="Seleccione un estado"
            type="dropdown"
            icon="pi-check-circle"
            options={ESTADOS_FORM}
            label="Estado:"
            required={true}
            error={errors.estado}
          />

        <InputGroup
          type="text"
          icon="pi-building"
          value="Desarrollo (5000)"
          onChange={() => {}} // No hacer nada, es solo lectura
          placeholder="Seleccionar el sector"
          label="Sector:"
          disabled={true}
        />

        <div className={styles.actions}>
          <Button
            type="submit"
            label={isEditing ? "Actualizar" : "Confirmar"}
            icon={`pi ${isEditing ? "pi-check" : "pi-check"}`}
            className="p-button-primary"
          />
          <Button
            type="button"
            label="Cancelar"
            icon="pi pi-times"
            className="p-button-primary"
            onClick={onCancel}
            outlined
          />
        </div>
      </form>
    </div>
  );
};
