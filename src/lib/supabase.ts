import { createClient, SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let _anon: SupabaseClient | null = null;
let _service: SupabaseClient | null = null;

export function supabaseAnon(): SupabaseClient {
  if (!url || !anonKey) {
    throw new Error(
      "Supabase env vars manquantes (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY)."
    );
  }
  if (!_anon) {
    _anon = createClient(url, anonKey, { auth: { persistSession: false } });
  }
  return _anon;
}

export function supabaseService(): SupabaseClient {
  if (!url || !serviceKey) {
    throw new Error(
      "Supabase server env vars manquantes (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)."
    );
  }
  if (!_service) {
    _service = createClient(url, serviceKey, {
      auth: { persistSession: false },
    });
  }
  return _service;
}
