import { getInitialUsuarios } from '@/lib/usuarios-server';
import { UsuariosPageClient } from '@/components/UsuariosPageClient';

// Esta página ahora usa ISR (Incremental Static Regeneration)
export const revalidate = 120; // Revalidar cada 120 segundos

export default async function Home() {
  console.log('🏠 ISR: Renderizando página principal...');
  
  // Obtener datos iniciales en el servidor
  let initialData;
  try {
    initialData = await getInitialUsuarios();
  } catch (error) {
    console.error('Error en getInitialUsuarios:', error);
    initialData = {
      data: [],
      pagination: { page: 1, limit: 10, total: 0, totalPages: 0 }
    };
  }
  
  console.log('📊 ISR: Datos para el cliente:', {
    usuariosCount: initialData?.data?.length || 0,
    hasData: !!initialData?.data?.length
  });

  return (
    <UsuariosPageClient 
      initialUsuarios={initialData?.data || []}
      initialPagination={initialData?.pagination || {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
      }}
    />
  );
}
