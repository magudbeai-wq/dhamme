import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lbmsdvnqtabwwspeobch.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_tT5p5zHePZae6Ek7COXSyw_AB9KpZRv';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
