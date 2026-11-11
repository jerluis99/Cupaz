import { createClient } from '@supabase/supabase-js';

// Si está en el navegador, usa el proxy interno (/api/supabase) del mismo dominio para eliminar el error de CORS al 100%.
// Si se ejecuta en el servidor de Vercel, llama directamente al túnel de Localtonet.
const supabaseUrl = typeof window !== 'undefined'
  ? `${window.location.origin}/api/supabase`
  : (process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lvypkfof6e.localto.net').trim();

const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE').trim();

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: typeof window !== 'undefined',
    autoRefreshToken: typeof window !== 'undefined',
  },
  global: {
    headers: {
      'localtonet-skip-warning': 'true',
      'bypass-tunnel-reminder': 'true',
      'x-client-info': 'sistema-incidencias-ven911',
    },
  },
});
