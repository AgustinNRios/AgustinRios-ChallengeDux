"use client";

import { Button } from "primereact/button";
import { Usuario, ESTADOS_FORM, FormData } from "@/domains/users/model/usuario";
import { InputGroup } from "@/components/molecules/InputGroup/InputGroup";
import { useUsuarioForm } from "@/domains/users/hooks/useUsuarioForm";
import styles from './UsuarioForm.module.css';

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
      <form onSubmit={handleSubmit} className={styles.form + ' p-fluid'}>
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
            pt={{root: {
              style: {backgroundColor: '#2563EB'}}
            }}
            type="submit"
            label={isEditing ? "Actualizar" : "Confirmar"}
            icon={`pi ${isEditing ? "pi-check" : "pi-check"}`}
            className="p-button-primary"
            style={{maxWidth: '118px'}}
          />
          <Button
            pt={{root: {
              style: {color: '#2563EB', borderColor: '#2563EB'}}
            }}
            type="button"
            label="Cancelar"
            icon="pi pi-times"
            className="p-button-primary"
            onClick={onCancel}
            outlined
            style={{maxWidth: '118px'}}
          />
        </div>
      </form>
    </div>
  );
};
