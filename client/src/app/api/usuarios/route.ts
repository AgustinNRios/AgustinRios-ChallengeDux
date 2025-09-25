import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

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
    const body = await request.json();
    
    // Validar datos requeridos
    if (!body.nombre || !body.usuario || body.estado === undefined) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...body,
        estado: body.estado ? 'Habilitado' : 'Deshabilitado',
      }),
    });

    if (!response.ok) {
      throw new Error('Error al crear el usuario');
    }

    const nuevoUsuario = await response.json();
    return NextResponse.json(nuevoUsuario, { status: 201 });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    return NextResponse.json(
      { error: 'Error al crear el usuario' },
      { status: 500 }
    );
  }
}
