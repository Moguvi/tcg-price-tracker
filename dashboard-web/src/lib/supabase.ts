import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Guard: only create client with valid URL
export const supabase = createClient(
  supabaseUrl && supabaseUrl.startsWith('http') ? supabaseUrl : 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

export const isConfigured = !!(
  supabaseUrl && supabaseUrl.startsWith('http') &&
  supabaseAnonKey && supabaseAnonKey !== 'your_supabase_anon_key'
);

export type PrecoRecord = {
  id: number;
  data: string;
  carta: string;
  edicao: string;
  ano: number;
  raridade: string;
  tipo_carta: string;
  preco_min: number;
  preco_medio: number;
};

