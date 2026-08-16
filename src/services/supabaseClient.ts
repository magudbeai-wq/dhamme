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
    },
    upsert: async (records: any[], onConflict = 'id') => {
      try {
        const url = `${supabaseUrl}/rest/v1/${tableName}?on_conflict=${encodeURIComponent(onConflict)}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'apikey': supabaseAnonKey,
            'Authorization': `Bearer ${supabaseAnonKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates,return=representation'
          },
          body: JSON.stringify(records)
        });
        if (!res.ok) {
          console.warn(`Supabase REST upsert notice (${res.status}) on table '${tableName}'`);
          return { data: null, error: `HTTP ${res.status}` };
        }
        const data = await res.json();
        return { data, error: null };
      } catch (err) {
        console.warn(`Supabase network upsert notice on table '${tableName}':`, err);
        return { data: null, error: err };
      }
    },
    delete: (matchFilter?: string) => {
      const execDelete = async (filterStr: string) => {
        try {
          const url = `${supabaseUrl}/rest/v1/${tableName}?${filterStr}`;
          const res = await fetch(url, {
            method: 'DELETE',
            headers: {
              'apikey': supabaseAnonKey,
              'Authorization': `Bearer ${supabaseAnonKey}`
            }
          });
          if (!res.ok) {
            console.warn(`Supabase REST delete notice (${res.status}) on table '${tableName}'`);
            return { data: null, error: `HTTP ${res.status}` };
          }
          return { data: true, error: null };
        } catch (err) {
          console.warn(`Supabase network delete notice on table '${tableName}':`, err);
          return { data: null, error: err };
        }
      };

      if (typeof matchFilter === 'string' && matchFilter.length > 0) {
        return execDelete(matchFilter);
      }

      return {
        eq: (column: string, value: any) =>
          execDelete(`${encodeURIComponent(column)}=eq.${encodeURIComponent(String(value))}`)
      };
    }
  }),

  // SUPABASE AUTHENTICATION APIS
  auth: {
    signInWithGoogle: () => {
      const redirectUri = (window.location.origin && !window.location.origin.includes('localhost'))
        ? window.location.origin 
        : 'https://capilorix.store';
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

