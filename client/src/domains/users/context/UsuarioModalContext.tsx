'use client';

import { createContext, FC, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { useUsuarioModal } from '@/domains/users/hooks/useUsuarioModal';
import { Usuario } from '@/domains/users/model/usuario';

/**
 * Define la forma de los datos que se compartirán a través del contexto.
 * Esto proporciona autocompletado y seguridad de tipos en todo el árbol de componentes.
 */
interface UsuarioModalContextType {
  showModal: boolean;
  editingUsuario: Usuario | null;
  isEditing: boolean;
  openCreateModal: () => void;
  openEditModal: (usuario: Usuario) => void;
  closeModal: () => void;
  /**
   * Un callback que se invoca cuando se realiza una acción (crear/editar/eliminar)
   * que requiere que los datos de la tabla se actualicen. Este es el mecanismo que
   * notifica a otros componentes que deben volver a cargar los datos.
   */
  onDataChange?: () => Promise<void>;
  /**
   * Permite que un componente consumidor (como la tabla de usuarios) "registre" su propia
   * función de actualización de datos en el contexto. Es un patrón de inversión de control.
   */
  setOnDataChange: (callback: () => Promise<void>) => void;
}

// Creación del contexto de React. Se inicializa como `undefined` porque el valor real
// será proporcionado por el `UsuarioModalProvider`.
const UsuarioModalContext = createContext<UsuarioModalContextType | undefined>(undefined);

/**
 * El proveedor del contexto. Este componente envuelve a las partes de la aplicación
 * que necesitan acceso al estado del modal. Se encarga de gestionar toda la lógica.
 */
export const UsuarioModalProvider: FC<{ children: ReactNode }> = ({ children }) => {
  // `useUsuarioModal` es un hook personalizado que encapsula la lógica de estado del modal.
  const modalState = useUsuarioModal();
  
  // Estado para almacenar la función de callback que refrescará los datos.
  const [onDataChange, setOnDataChangeState] = useState<(() => Promise<void>) | undefined>();

  // `useCallback` asegura que la función `setOnDataChange` no se cree en cada render.
  const setOnDataChange = useCallback((callback: () => Promise<void>) => {
    setOnDataChangeState(() => callback);
  }, []);

  // `useMemo` optimiza el rendimiento. El valor del contexto solo se recalculará si
  // alguna de sus dependencias cambia. Esto evita re-renders innecesarios en los
  // componentes consumidores del contexto.
  const contextValue = useMemo(() => ({
    ...modalState,
    onDataChange,
    setOnDataChange,
  }), [modalState, onDataChange, setOnDataChange]);

  return (
    <UsuarioModalContext.Provider value={contextValue}>
      {children}
    </UsuarioModalContext.Provider>
  );
};

/**
 * Hook personalizado para consumir el contexto del modal de usuario de forma segura.
 * Abstrae el uso de `useContext` y proporciona un error claro si se intenta usar
 * fuera de un `UsuarioModalProvider`.
 */
export const useUsuarioModalContext = () => {
  const context = useContext(UsuarioModalContext);
  if (context === undefined) {
    // Este error es una guía útil para el desarrollador.
    throw new Error('useUsuarioModalContext debe ser utilizado dentro de un UsuarioModalProvider');
  }
  return context;
};
