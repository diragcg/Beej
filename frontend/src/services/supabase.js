// Supabase client configuration

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://evgmvktquwufhdevtahx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2Z212a3RxdXd1ZmhkZXZ0YWh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyNjU0NTEsImV4cCI6MjA2ODg0MTQ1MX0.-JTBxxMms1U3H1nIzEQN54FEHKeHMP8HbUf7s3nIfIk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
