import { NextRequest, NextResponse } from 'next/server';

const TARGET_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lvypkfof6e.localto.net').trim().replace(/\/$/, '');

async function handleProxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname.replace('/api/supabase', '');
  const search = request.nextUrl.search;
  const destination = `${TARGET_URL}${pathname}${search}`;

  // Solo copiamos las cabeceras necesarias para Supabase y Localtonet
  // Evitamos reenviar 'origin', 'referer', 'connection' o 'content-length' del cliente
  const headers = new Headers();
  const allowedHeaders = ['apikey', 'authorization', 'content-type', 'accept', 'prefer', 'range', 'x-client-info'];
  
  allowedHeaders.forEach((key) => {
    const val = request.headers.get(key);
    if (val) headers.set(key, val);
  });

  // Cabeceras obligatorias para saltar la pantalla de advertencia de Localtonet
  headers.set('localtonet-skip-warning', 'true');
  headers.set('bypass-tunnel-reminder', 'true');

  try {
    const body = request.method !== 'GET' && request.method !== 'HEAD'
      ? await request.text()
      : undefined;

    const response = await fetch(destination, {
      method: request.method,
      headers,
      body,
      cache: 'no-store',
      // Corta en 8 segundos si el túnel de Localtonet no responde
      signal: AbortSignal.timeout(8000),
    });

    const data = await response.arrayBuffer();

    const responseHeaders = new Headers();
    const copyResHeaders = ['content-type', 'content-range', 'preference-applied'];
    copyResHeaders.forEach((key) => {
      const val = response.headers.get(key);
      if (val) responseHeaders.set(key, val);
    });

    return new NextResponse(data, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error: any) {
    const isTimeout = error?.name === 'TimeoutError' || error?.name === 'AbortError';
    return NextResponse.json(
      {
        message: isTimeout
          ? `El túnel (${TARGET_URL}) no respondió en 8 segundos. Verifica que Localtonet esté activo en el servidor.`
          : `Error conectando al túnel (${TARGET_URL}): ${error.message}`,
      },
      { status: 504 }
    );
  }
}

export async function GET(req: NextRequest) { return handleProxy(req); }
export async function POST(req: NextRequest) { return handleProxy(req); }
export async function PUT(req: NextRequest) { return handleProxy(req); }
export async function DELETE(req: NextRequest) { return handleProxy(req); }
export async function PATCH(req: NextRequest) { return handleProxy(req); }
export async function OPTIONS(req: NextRequest) { return handleProxy(req); }
