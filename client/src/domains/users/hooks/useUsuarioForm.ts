import { useState, useEffect, FormEvent } from 'react';
import { Usuario, UserStatus, SECTOR_FIJO, FormData } from '@/domains/users/model/usuario';

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
  handleSubmit: (e: FormEvent) => void;
  validateForm: () => boolean;
  resetForm: () => void;
}

/**
 * Hook personalizado para gestionar el estado, la validación y la lógica de un formulario de usuario.
 * Encapsula toda la complejidad del manejo del formulario, haciéndolo reutilizable y fácil de testear.
 * @param {UseUsuarioFormProps} props - Propiedades para inicializar el hook, incluyendo valores iniciales y la función de submit.
 */
export const useUsuarioForm = ({
  initialValues = {},
  isEditing = false,
  onSubmit,
}: UseUsuarioFormProps): UseUsuarioFormReturn => {
  // Estado para los datos del formulario.
  const [formData, setFormData] = useState<FormData>(() => ({
    id: initialValues.id || "",
    usuario: initialValues.usuario || "",
    estado: initialValues.estado ?? UserStatus.ACTIVO,
    sector: SECTOR_FIJO, // El sector es un valor fijo según los requerimientos.
  }));
  
  // Estado para los errores de validación del formulario.
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    setFormData({
      id: initialValues.id || "",
      usuario: initialValues.usuario || "",
      estado: initialValues.estado ?? UserStatus.ACTIVO,
      sector: SECTOR_FIJO, // Sector fijo
    });
  }, [initialValues]);

  /**
   * Valida todos los campos del formulario según las reglas de negocio y actualiza el estado de errores.
   * @returns {boolean} - `true` si el formulario es válido, `false` en caso contrario.
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validación del ID (solo para creación)
    if (!isEditing) {
      if (!formData.id?.trim()) {
        newErrors.id = "El ID es requerido";
      } else if (!/^\d+$/.test(formData.id.trim())) {
        newErrors.id = "El ID debe ser numérico";
      }
    }

    // Validación del nombre de usuario
    if (!formData.usuario.trim()) {
      newErrors.usuario = "El nombre de usuario es requerido";
    } else if (formData.usuario.trim().length < 3) {
      newErrors.usuario = "El nombre de usuario debe tener al menos 3 caracteres";
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.usuario.trim())) {
      newErrors.usuario = "El nombre de usuario solo puede contener letras, números, guiones y guiones bajos";
    }

    // Validación del estado
    if (!Object.values(UserStatus).includes(formData.estado as UserStatus)) {
      newErrors.estado = "El estado seleccionado no es válido";
    }

    // Sector siempre es fijo, no necesita validación

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Maneja los cambios en los inputs del formulario, actualizando el estado `formData`.
   * También limpia el error asociado al campo que se está modificando para una mejor UX.
   */
  const handleInputChange = (field: keyof FormData, value: string | number | UserStatus) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Si había un error en este campo, se limpia al empezar a corregirlo.
    // Esto proporciona feedback inmediato al usuario.
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  /**
   * Maneja el envío del formulario. Previene el comportamiento por defecto,
   * valida los datos y, si son válidos, ejecuta la función `onSubmit` pasada como prop.
   */
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  /**
   * Restablece el formulario a sus valores iniciales y limpia todos los errores.
   */
  const resetForm = () => {
    setFormData({
      id: initialValues.id || "",
      usuario: initialValues.usuario || "",
      estado: initialValues.estado ?? UserStatus.ACTIVO,
      sector: SECTOR_FIJO,
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
