import { useRef } from 'react';
import { Toast } from 'primereact/toast';
import { Usuario, UserStatus, SECTOR_FIJO, FormData } from '@/domains/users/model/usuario';
import { usuarioService } from '@/domains/users/service/usuarioService';

interface UseUsuarioActionsProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

interface UseUsuarioActionsReturn {
  toast: React.RefObject<Toast | null>;
  createUsuario: (data: FormData) => Promise<void>;
  updateUsuario: (data: FormData) => Promise<void>;
  deleteUsuario: (usuario: Usuario) => Promise<void>;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

export const useUsuarioActions = ({
  onSuccess,
  onError,
}: UseUsuarioActionsProps = {}): UseUsuarioActionsReturn => {
  const toast = useRef<Toast>(null);

  const revalidateCache = async (path: string = '/') => {
    try {
      await fetch('/api/revalidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path }),
      });
      console.log(`ISR bajo demanda: Cache invalidada para ${path}`);
    } catch (error) {
      console.error('Error al invalidar cache ISR:', error);
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
        sector: SECTOR_FIJO, // Siempre usar sector fijo
      };

      await usuarioService.createUsuario(usuarioData);
      showSuccess('Usuario creado exitosamente');

      // Invalidar cache ISR inmediatamente
      await revalidateCache('/');

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
        throw new Error('ID de usuario requerido para actualizar');
      }

      const usuarioData = {
        usuario: data.usuario,
        estado: data.estado as UserStatus,
        sector: SECTOR_FIJO, // Siempre usar sector fijo
      };

      await usuarioService.updateUsuario(data.id, usuarioData);
      showSuccess('Usuario actualizado exitosamente');

      // Invalidar cache ISR inmediatamente
      await revalidateCache('/');

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
        throw new Error('ID de usuario requerido para eliminar');
      }

      await usuarioService.deleteUsuario(usuario.id);
      showSuccess(`Usuario ${usuario.usuario} eliminado exitosamente`);

      // Invalidar cache ISR inmediatamente
      await revalidateCache('/');

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
