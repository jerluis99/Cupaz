import { createClient } from '@supabase/supabase-js';

const tunnelUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lvypkfof6e.localto.net').trim().replace(/\/$/, '');

// En el navegador usa el proxy interno para peticiones REST sin CORS
const supabaseUrl = typeof window !== 'undefined'
  ? `${window.location.origin}/api/supabase`
  : tunnelUrl;

const supabaseAnonKey = (
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE'
).trim();

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: typeof window !== 'undefined',
    autoRefreshToken: typeof window !== 'undefined',
  },
  realtime: {
    // Evita que los intentos de WebSocket saturen el proxy / túnel
    timeout: 10000,
    heartbeatIntervalMs: 30000,
  },
  global: {
    headers: {
      'localtonet-skip-warning': 'true',
      'bypass-tunnel-reminder': 'true',
      'x-client-info': 'sistema-incidencias-ven911',
    },
  },
});
