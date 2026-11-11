import { NextRequest, NextResponse } from 'next/server';

// Toma la URL desde las variables de entorno de Vercel o usa la actual por defecto (sin espacios en blanco)
const TARGET_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lvypkfof6e.localto.net').trim();

async function handleProxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname.replace('/api/supabase', '');
  const search = request.nextUrl.search;
  const destination = `${TARGET_URL}${pathname}${search}`;

  const headers = new Headers(request.headers);
  // Cabeceras obligatorias para saltar el bloqueo/advertencia de Localtonet
  headers.set('localtonet-skip-warning', 'true');
  headers.set('bypass-tunnel-reminder', 'true');
  headers.delete('host');

  try {
    const body = request.method !== 'GET' && request.method !== 'HEAD' 
      ? await request.blob() 
      : undefined;

    const response = await fetch(destination, {
      method: request.method,
      headers: headers,
      body: body,
      cache: 'no-store',
    });

    const data = await response.blob();
    
    // Limpiamos cabeceras de codificación para evitar errores al reenviar la respuesta
    const responseHeaders = new Headers(response.headers);
    responseHeaders.delete('content-encoding');
    responseHeaders.delete('content-length');

    return new NextResponse(data, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) { return handleProxy(req); }
export async function POST(req: NextRequest) { return handleProxy(req); }
export async function PUT(req: NextRequest) { return handleProxy(req); }
export async function DELETE(req: NextRequest) { return handleProxy(req); }
export async function PATCH(req: NextRequest) { return handleProxy(req); }
export async function OPTIONS(req: NextRequest) { return handleProxy(req); }
