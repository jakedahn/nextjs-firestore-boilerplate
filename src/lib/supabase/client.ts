import { createBrowserClient } from '@supabase/ssr'

/**
 * Creates a Supabase client for browser-side operations.
 * Use this client for operations that don't require authentication or are safe to run in the browser.
 * 
 * @returns {ReturnType<typeof createBrowserClient>} A Supabase client for browser-side operations.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
