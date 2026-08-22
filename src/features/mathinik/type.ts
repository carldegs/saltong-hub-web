import { Tables } from "@/lib/supabase/types";

export type MathinikUserRound = Tables<"mathinik-user-rounds">;

export type MathinikUserRoundPrimaryKeys = Pick<
  MathinikUserRound,
  "userId" | "date"
>;

export interface MathinikRound {
  largeNumDeckSize: number;
  deck: number[];
  target: number;
  solution: {
    value: number;
    expression: string;
    difference: number;
    isExact: boolean;
  };
}
