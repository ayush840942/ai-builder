import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️ Supabase credentials missing. Supabase functionality will fail.');
}

// Create client if credentials exist, otherwise create a dummy/proxy that throws on usage
export const supabase = (supabaseUrl && supabaseKey)
    ? createClient(supabaseUrl, supabaseKey)
    : new Proxy({} as any, {
        get: () => {
            throw new Error('Supabase client not initialized. Missing SUPABASE_URL or SUPABASE_KEY.');
        }
    });
