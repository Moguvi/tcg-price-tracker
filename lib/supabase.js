require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn("⚠ Warning: SUPABASE_URL or SUPABASE_KEY not found in environment.");
}

const supabase = createClient(
    supabaseUrl || 'https://xxxxxxxx.supabase.co', 
    supabaseKey || 'public-anon-key'
);

module.exports = { supabase };
