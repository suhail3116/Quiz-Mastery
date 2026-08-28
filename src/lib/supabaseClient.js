import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://odjwbefjlelbxaimboyc.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kandiZWZqbGVsYnhhaW1ib3ljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3NzA2MDQsImV4cCI6MjA5MjM0NjYwNH0.9A8MxCT4DuRI2kLgltuzt80y6T8CcK1sY94garzNOXo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  },
  realtime: {
    params: {
      eventsPerSecond: 20
    }
  }
});
