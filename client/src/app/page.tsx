import { getInitialUsuarios } from '@/lib/usuarios-server';
import { UsuariosPageClient } from '@/components/usuariosPageClient/UsuariosPageClient';

// Esta página usa ISR (Incremental Static Regeneration)

export default async function Home() {
  console.log('ISR: Renderizando página principal...');
  
  // Obtener datos iniciales en el servidor
  let initialData;
  try {
    initialData = await getInitialUsuarios();
  } catch (error) {
    console.error('Error en getInitialUsuarios:', error);
    initialData = {
      data: [],
      pagination: { page: 1, limit: 5, total: 0, totalPages: 0 }
    };
  }
  
  console.log('ISR: Datos para el cliente:', {
    usuariosCount: initialData?.data?.length || 0,
    hasData: !!initialData?.data?.length
  });

  return (
    <UsuariosPageClient 
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
