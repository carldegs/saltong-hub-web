import { createBrowserClient } from "@supabase/ssr";
import { Database } from "./types";
import { useMemo } from "react";
import { SupabaseClientOptions } from "@supabase/supabase-js";

export function createClient(options: SupabaseClientOptions<"public"> = {}) {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      isSingleton: true,
      ...options,
    }
  );
}

export function useSupabaseClient() {
  return useMemo(() => createClient(), []);
}
