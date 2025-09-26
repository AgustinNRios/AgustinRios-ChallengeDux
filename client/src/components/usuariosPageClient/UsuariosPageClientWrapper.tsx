'use client';

import { UsuarioModalProvider } from '@/domains/users/context/UsuarioModalContext';
import { UsuariosPageClient } from './UsuariosPageClient';
import { Usuario } from '@/domains/users/model/usuario';

interface UsuariosPageClientWrapperProps {
  initialUsuarios?: Usuario[];
  initialPagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function UsuariosPageClientWrapper(props: UsuariosPageClientWrapperProps) {
  return (
    <UsuarioModalProvider>
      <UsuariosPageClient {...props} />
    </UsuarioModalProvider>
  );
}
