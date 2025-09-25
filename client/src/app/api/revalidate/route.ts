import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path = '/' } = body;

    // Invalidar la cache ISR inmediatamente
    revalidatePath(path);

    console.log(`🔄 ISR bajo demanda: Cache invalidada para ${path}`);

    return NextResponse.json({
      message: 'Cache invalidada exitosamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error al invalidar cache:', error);
    return NextResponse.json(
      { error: 'Error al invalidar cache' },
      { status: 500 }
    );
  }
}
