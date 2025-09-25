import { useState, useEffect } from 'react';
import { Usuario, UserStatus, SECTOR_FIJO } from '@/Domains/users/model/usuario';

interface FormData {
  id?: string;
  usuario: string;
  estado: UserStatus;
  sector: number | string;
}

interface FormErrors {
  id?: string;
  usuario?: string;
  sector?: string;
  [key: string]: string | undefined;
}

interface UseUsuarioFormProps {
  initialValues?: Partial<Usuario>;
  isEditing?: boolean;
  onSubmit: (data: FormData) => void;
}

interface UseUsuarioFormReturn {
  formData: FormData;
  errors: FormErrors;
  handleInputChange: (field: keyof FormData, value: string | number | UserStatus) => void;
  handleSubmit: (e: React.FormEvent) => void;
  validateForm: () => boolean;
  resetForm: () => void;
}

export const useUsuarioForm = ({
  initialValues = {},
  isEditing = false,
  onSubmit,
}: UseUsuarioFormProps): UseUsuarioFormReturn => {
  const [formData, setFormData] = useState<FormData>(() => ({
    id: initialValues.id || "",
    usuario: initialValues.usuario || "",
    estado: initialValues.estado ?? UserStatus.ACTIVO,
    sector: SECTOR_FIJO, // Sector fijo
  }));
  
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    setFormData({
      id: initialValues.id || "",
      usuario: initialValues.usuario || "",
      estado: initialValues.estado ?? UserStatus.ACTIVO,
      sector: SECTOR_FIJO, // Sector fijo
    });
  }, [initialValues]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!isEditing && !formData.id?.trim()) {
      newErrors.id = "El ID es requerido";
    }

    if (!formData.usuario.trim()) {
      newErrors.usuario = "El nombre de usuario es requerido";
    }

    // Sector siempre es fijo, no necesita validación

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string | number | UserStatus) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Asegurar que siempre se envíe el sector fijo
      onSubmit({ ...formData, sector: SECTOR_FIJO });
    }
  };

  const resetForm = () => {
    setFormData({
      id: initialValues.id || "",
      usuario: initialValues.usuario || "",
      estado: initialValues.estado ?? UserStatus.ACTIVO,
      sector: SECTOR_FIJO, // Sector fijo
    });
    setErrors({});
  };

  return {
    formData,
    errors,
    handleInputChange,
    handleSubmit,
    validateForm,
    resetForm,
  };
};
