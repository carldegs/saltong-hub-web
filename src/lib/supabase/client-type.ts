import { createClient } from "@supabase/supabase-js";
import { Database } from "./types";

export type DbClient = ReturnType<typeof createClient<Database>>;
