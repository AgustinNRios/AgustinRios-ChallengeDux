import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
const API_BASE_URL_WITHOUT_SECTOR = process.env.NEXT_PUBLIC_API_URL_WITHOUT_SECTOR || '';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('_page') || '1';
  const limit = searchParams.get('_limit') || '10';
  const search = searchParams.get('q') || '';
  const estado = searchParams.get('estado');

  try {
    // Construir la URL de la API con los parámetros
    let url = `${API_BASE_URL}&_page=${page}&_limit=${limit}`;
    
    // Añadir filtros si existen
    if (search) {
      url += `&q=${encodeURIComponent(search)}`;
    }
    if (estado) {
      url += `&estado=${estado}`;
    }

    const fetchResponse = await fetch(url);
    
    if (!fetchResponse.ok) {
      throw new Error('Error al obtener los usuarios');
    }

    // Obtener el total de registros desde los headers
    const totalCount = fetchResponse.headers.get('x-total-count') || '0';
    const usuarios = await fetchResponse.json();

    const response = NextResponse.json({
      data: usuarios,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(totalCount),
        totalPages: Math.ceil(parseInt(totalCount) / parseInt(limit))
      }
    });

    // Headers para ISR - permitir cache pero revalidar
    response.headers.set('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    
    return response;
  } catch (error) {
    console.error('Error en la API de usuarios:', error);
    return NextResponse.json(
      { error: 'Error al obtener los usuarios' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log("\n--- [API] Petición POST recibida en /api/usuarios ---");

    const body = await request.json();
    console.log("[API] Cuerpo (body) recibido del frontend:", body);

    // Validar datos requeridos
    if (!body.usuario || !body.estado || !body.id || !body.sector) {
      console.error("[API] Error: Faltan campos requeridos.");
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    console.log("[API] Enviando datos a la API externa...");
    const response = await fetch(API_BASE_URL_WITHOUT_SECTOR, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body), // Reenviamos el cuerpo tal cual lo recibimos
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[API] Error de la API externa:", response.status, errorText);
      throw new Error('Error al crear el usuario en la API externa');
    }

    const nuevoUsuario = await response.json();
    console.log("[API] Usuario creado exitosamente en la API externa:", nuevoUsuario);
    return NextResponse.json(nuevoUsuario, { status: 201 });

  } catch (error) {
    console.error('[API] Error fatal en el manejador POST:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al crear el usuario' },
      { status: 500 }
    );
  }
}
