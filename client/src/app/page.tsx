import { Suspense } from 'react';
import { getInitialUsuarios } from '@/lib/usuarios-server';
import { UsuariosPageClientWrapper } from '@/components/usuariosPageClient/UsuariosPageClientWrapper';
import { TableSkeleton } from '@/components/organisms/TableSkeleton/TableSkeleton';
import { ErrorBoundary } from '@/components/hocs/ErrorBoundary/ErrorBoundary';

// Esta página implementa ISR (Incremental Static Regeneration) y Suspense para una carga optimizada.

async function UsuariosDataLoader() {
  // Carga de datos inicial en el servidor. En caso de error, se provee un estado inicial vacío.
  let initialData;
  try {
            initialData = await getInitialUsuarios();
  } catch (error) {
    console.error('Error al obtener los usuarios iniciales:', error);
    initialData = {
      data: [],
      pagination: { page: 1, limit: 5, total: 0, totalPages: 0 }
    };
  }

  return (
    <UsuariosPageClientWrapper 
      initialUsuarios={initialData?.data || []}
      initialPagination={initialData?.pagination || {
        page: 1,
        limit: 5,
        total: 0,
        totalPages: 0
      }}
    />
  );
}

/**
 * Página principal que renderiza la tabla de usuarios.
 * Utiliza Suspense para una carga progresiva y ErrorBoundary como medida de seguridad.
 */
export default function Home() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<TableSkeleton />}>
          <UsuariosDataLoader />
      </Suspense>
    </ErrorBoundary>
  );
}
