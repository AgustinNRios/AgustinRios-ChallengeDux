import { RefObject, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { Usuario, UserStatus, SECTOR_FIJO, FormData } from '@/domains/users/model/usuario';
import { usuarioService } from '@/domains/users/service/usuarioService';

interface UseUsuarioActionsProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  refreshData?: () => Promise<void>; // Nueva prop para refrescar datos con filtros> void;

}

interface UseUsuarioActionsReturn {
  toast: RefObject<Toast | null>;
  createUsuario: (data: FormData) => Promise<void>;
  updateUsuario: (data: FormData) => Promise<void>;
  deleteUsuario: (usuario: Usuario) => Promise<void>;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

/**
 * Hook que encapsula las acciones de mutación (crear, actualizar, eliminar),
 * el manejo de notificaciones y la revalidación de la caché de ISR.
 */
export const useUsuarioActions = ({
  onSuccess,
  onError,
  refreshData,
}: UseUsuarioActionsProps = {}): UseUsuarioActionsReturn => {
  const toast = useRef<Toast>(null);

  // Invalida la caché de ISR bajo demanda para reflejar los cambios en la UI.
  const revalidateCache = async (path: string = '/') => {
    try {
      await fetch('/api/revalidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path }),
      });
    } catch (error) {
      console.error('Error al invalidar la caché de ISR:', error);
    }
  };

  const showSuccess = (message: string) => {
    toast.current?.show({
      severity: 'success',
      summary: 'Éxito',
      detail: message,
      life: 3000,
    });
  };

  const showError = (message: string) => {
    toast.current?.show({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 5000,
    });
  };

  const createUsuario = async (data: FormData) => {
    try {
      const usuarioData = {
        id: data.id,
        usuario: data.usuario,
        estado: data.estado as UserStatus,
        sector: SECTOR_FIJO,
      };

      await usuarioService.createUsuario(usuarioData);
      showSuccess('Usuario creado exitosamente');
      // Revalidar caché ISR y refrescar datos del cliente con filtros actuales
      await revalidateCache('/');

      // Agregar un pequeño delay para asegurar que la base de datos se actualice
      await new Promise(resolve => setTimeout(resolve, 5000));

      await refreshData?.();

      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear el usuario';
      showError(errorMessage);
      onError?.(errorMessage);
    }
  };

  const updateUsuario = async (data: FormData) => {
    try {
      if (!data.id) {
        throw new Error('El ID del usuario es requerido para actualizar.');
      }

      const usuarioData = {
        usuario: data.usuario,
        estado: data.estado as UserStatus,
        sector: SECTOR_FIJO,
      };

      await usuarioService.updateUsuario(data.id, usuarioData);
      showSuccess('Usuario actualizado exitosamente');
      // Revalidar caché ISR y refrescar datos del cliente con filtros actuales
      await revalidateCache('/');

      // Agregar un pequeño delay para asegurar que la base de datos se actualice
      await new Promise(resolve => setTimeout(resolve, 2000));

      await refreshData?.();

      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar el usuario';
      showError(errorMessage);
      onError?.(errorMessage);
    }
  };

  const deleteUsuario = async (usuario: Usuario) => {
    try {
      if (!usuario.id) {
        throw new Error('El ID del usuario es requerido para eliminar.');
      }

      await usuarioService.deleteUsuario(usuario.id);
      showSuccess(`Usuario "${usuario.usuario}" eliminado exitosamente`);
      // Revalidar caché ISR y refrescar datos del cliente con filtros actuales
      await revalidateCache('/');

      // Agregar un pequeño delay para asegurar que la base de datos se actualice
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Revalidar caché ISR y refrescar datos del cliente con filtros actuales
      await revalidateCache('/');

      await refreshData?.();

      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar el usuario';
      showError(errorMessage);
      onError?.(errorMessage);
    }
  };

  return {
    toast,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    showSuccess,
    showError,
  };
};
