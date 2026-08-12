const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lbmsdvnqtabwwspeobch.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_tT5p5zHePZae6Ek7COXSyw_AB9KpZRv';

/**
 * Crash-resistant Supabase REST & Auth client.
 */
export const supabase = {
  // REST DATABASE APIS
  from: (tableName: string) => ({
    select: async (query = '*') => {
      try {
        const url = `${supabaseUrl}/rest/v1/${tableName}?select=${encodeURIComponent(query)}`;
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'apikey': supabaseAnonKey,
            'Authorization': `Bearer ${supabaseAnonKey}`,
            'Accept': 'application/json'
          }
        });
        if (!res.ok) {
          console.warn(`Supabase REST notice (${res.status}) on table '${tableName}'`);
          return { data: null, error: `HTTP ${res.status}` };
        }
        const data = await res.json();
        return { data, error: null };
      } catch (err) {
        console.warn(`Supabase network notice on table '${tableName}':`, err);
        return { data: null, error: err };
      }
    },
    insert: async (records: any[]) => {
      try {
        const url = `${supabaseUrl}/rest/v1/${tableName}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'apikey': supabaseAnonKey,
            'Authorization': `Bearer ${supabaseAnonKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify(records)
        });
        if (!res.ok) {
          console.warn(`Supabase REST insert notice (${res.status}) on table '${tableName}'`);
          return { data: null, error: `HTTP ${res.status}` };
        }
        const data = await res.json();
        return { data, error: null };
      } catch (err) {
        console.warn(`Supabase network insert notice on table '${tableName}':`, err);
        return { data: null, error: err };
      }
    }
  }),

  // SUPABASE AUTHENTICATION APIS
  auth: {
    signInWithGoogle: () => {
      const redirectUri = window.location.origin;
      const googleAuthUrl = `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectUri)}`;
      window.location.href = googleAuthUrl;
    },

    signUpWithEmail: async (email: string, password: string, fullName: string, phone: string) => {
      try {
        const res = await fetch(`${supabaseUrl}/auth/v1/signup`, {
          method: 'POST',
          headers: {
            'apikey': supabaseAnonKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            password,
            data: {
              full_name: fullName,
              phone: phone
            }
          })
        });
        const data = await res.json();
        if (!res.ok) {
          return { data: null, error: data.msg || data.error_description || data.message || 'Signup failed' };
        }
        return { data, error: null };
      } catch (err: any) {
        return { data: null, error: err.message || err };
      }
    },

    signInWithEmail: async (email: string, password: string) => {
      try {
        const res = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
          method: 'POST',
          headers: {
            'apikey': supabaseAnonKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            password
          })
        });
        const data = await res.json();
        if (!res.ok) {
          return { data: null, error: data.error_description || data.msg || data.message || 'Login failed' };
        }
        return { data, error: null };
      } catch (err: any) {
        return { data: null, error: err.message || err };
      }
    }
  }
};
