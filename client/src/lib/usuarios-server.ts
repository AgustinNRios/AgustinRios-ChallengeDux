import { PaginationParams } from '@/domains/users/model/usuario';

// Función para obtener usuarios en el servidor (para ISR)
export async function getUsuariosServer(params: PaginationParams = {}) {
  const { page = 1, limit = 10, search, estado } = params;
  
  const queryParams = new URLSearchParams({
    _page: page.toString(),
    _limit: limit.toString(),
    ...(search && { q: search }),
    ...(estado && { estado }),
  });

  try {
    // Llamar directamente a la API externa, NO a nuestra API route
    const externalApiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    if (!externalApiUrl) {
      throw new Error('NEXT_PUBLIC_API_URL no está configurada');
    }
    
    // Construir URL con parámetros para la API externa
    const url = `${externalApiUrl}?${queryParams}`;
    
    const response = await fetch(url, {
      // Para ISR, especificamos un tiempo de revalidación.
      // Next.js cacheará esta respuesta por 120 segundos.
      next: { revalidate: 120 },
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener los usuarios');
    }

    // Obtener el total de registros desde los headers (igual que en la API route)
    const totalCount = response.headers.get('x-total-count') || '0';
    const usuarios = await response.json();

    // Estructurar la respuesta igual que la API route
    return {
      data: usuarios,
      pagination: {
        page: parseInt(page.toString()),
        limit: parseInt(limit.toString()),
        total: parseInt(totalCount),
        totalPages: Math.ceil(parseInt(totalCount) / parseInt(limit.toString()))
      }
    };
  } catch (error) {
    console.error('Error fetching usuarios on server:', error);
    // Retornar datos vacíos en caso de error para evitar que falle la build
    return {
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      }
    };
  }
}

// Función para obtener datos iniciales con fallback
export async function getInitialUsuarios() {
  const isDev = process.env.NODE_ENV === 'development';
  
  console.log(`🔄 ISR: Iniciando getInitialUsuarios... (${isDev ? 'DESARROLLO' : 'PRODUCCIÓN'})`);
  
  if (isDev) {
    console.log('⚠️  NOTA: ISR no funciona en desarrollo. Para probar ISR real, usa: npm run build && npm start');
  }
  
  try {
    const result = await getUsuariosServer({ page: 1, limit: 10 });
    
    console.log('✅ ISR: Datos obtenidos exitosamente:', {
      dataLength: result?.data?.length || 0,
      pagination: result?.pagination
    });
    
    // Validar que el resultado tenga la estructura esperada
    if (!result || typeof result !== 'object') {
      throw new Error('Invalid response structure');
    }
    
    return {
      data: Array.isArray(result.data) ? result.data : [],
      pagination: result.pagination || {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      }
    };
  } catch (error) {
    console.error('❌ ISR: Error getting initial usuarios:', error);
    console.error('🔧 Verifica que NEXT_PUBLIC_API_URL esté configurada correctamente');
    
    // Datos de fallback
    return {
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      }
    };
  }
}
