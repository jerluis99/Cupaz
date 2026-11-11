import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Dejamos sin rewrites para que todas las peticiones a /api/supabase/* 
  // pasen por app/api/supabase/[...path]/route.ts y lleven las cabeceras de Localtonet.
};

export default nextConfig;
