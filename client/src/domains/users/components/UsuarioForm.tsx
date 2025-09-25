"use client";

import { Button } from "primereact/button";
import { Usuario, ESTADOS_FORM } from "@/domains/users/model/usuario";
import { InputGroup } from "@/components/ui/inputGroup/InputGroup";
import { useUsuarioForm } from "../hooks/useUsuarioForm";
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
    <div style={{ maxHeight: '80vh', overflowY: 'auto' }}>
      <form onSubmit={handleSubmit} className="p-fluid">
        <InputGroup
          type="text"
          icon="pi-id-card"
          value={formData.id || ""}
          onChange={(value) => handleInputChange("id", value)}
          placeholder="Ingrese el ID"
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
          placeholder="Ingrese el nombre de usuario"
          label="Usuario:"
          required={true}
          error={errors.usuario}
        />


        <InputGroup
          type="text"
          icon="pi-building"
          value="Desarrollo (5000)"
          onChange={() => {}} // No hacer nada, es solo lectura
          placeholder="Desarrollo (5000)"
          label="Sector:"
          disabled={true}
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

        <div className="flex justify-content-end gap-2">
          <Button
            type="button"
            label="Cancelar"
            icon="pi pi-times"
            className="p-button-text"
            onClick={onCancel}
          />
          <Button
            type="submit"
            label={isEditing ? "Actualizar" : "Guardar"}
            icon={`pi ${isEditing ? "pi-check" : "pi-check"}`}
            className="p-button-primary"
          />
        </div>
      </form>
    </div>
  );
};
