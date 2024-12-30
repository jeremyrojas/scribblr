import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://fiykfmkflvjcplakezoe.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpeWtmbWtmbHZqY3BsYWtlem9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU0NzIxNjksImV4cCI6MjA1MTA0ODE2OX0.zVIqefPJHFibb0hqMDsQIpkzTEu0HUK4MPwWDwVKxcI";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'scribblr-auth',
    storage: window.localStorage
  }
});