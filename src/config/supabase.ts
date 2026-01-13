// =====================
// SUPABASE CLIENT CONFIGUATION
// =====================

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import dotenv from 'dotenv'

// load environment variables
dotenv.config();

//get environment variables
const supabaseUrl: string = process.env.SUPABASE_URL || "";
const supabaseAnonKey: string = process.env.SUPABASE_ANON_KEY || "";

// validate en variables
if (!supabaseUrl || !supabaseAnonKey) {
    console.error("❌ Missing Supabase environment variables!")
    console.error("Make sure SUPABASE_URL and SUPABASE_ANON_KEY are set in .env");
    process.exit(1);
}

// create supabase client
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// export client 
export default supabase;

// log connection status 
console.log("Supabase client initialized");
console.log(`Connected to: ${supabaseUrl}`);

