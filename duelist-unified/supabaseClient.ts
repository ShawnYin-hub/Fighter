import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://seztpfvffmdjgwuqwqzy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlenRwZnZmZm1kamd3dXF3cXp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMDc2NTUsImV4cCI6MjA4NTY4MzY1NX0.jYxizpFLAyuMXWKxjo-K3Du_jBF0cPkERtw0AjIwzf4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

