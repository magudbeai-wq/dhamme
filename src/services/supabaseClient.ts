const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lbmsdvnqtabwwspeobch.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_tT5p5zHePZae6Ek7COXSyw_AB9KpZRv';

export const supabase = {
  from: (tableName: string) => ({
    select: async (query = '*') => {
      try {
        const res = await fetch(`${supabaseUrl}/rest/v1/${tableName}?select=${encodeURIComponent(query)}`, {
          headers: {
            'apikey': supabaseAnonKey,
            'Authorization': `Bearer ${supabaseAnonKey}`
          }
        });
        if (!res.ok) return { data: null, error: await res.text() };
        const data = await res.json();
        return { data, error: null };
      } catch (err) {
        return { data: null, error: err };
      }
    },
    insert: async (records: any[]) => {
      try {
        const res = await fetch(`${supabaseUrl}/rest/v1/${tableName}`, {
          method: 'POST',
          headers: {
            'apikey': supabaseAnonKey,
            'Authorization': `Bearer ${supabaseAnonKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify(records)
        });
        if (!res.ok) return { data: null, error: await res.text() };
        const data = await res.json();
        return { data, error: null };
      } catch (err) {
        return { data: null, error: err };
      }
    }
  })
};
