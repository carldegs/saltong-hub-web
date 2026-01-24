import { createBrowserClient } from "@supabase/ssr";
import { Database } from "./types";
import { useMemo } from "react";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      isSingleton: true,
    }
  );
}

export function useSupabaseClient() {
  return useMemo(() => createClient(), []);
}
