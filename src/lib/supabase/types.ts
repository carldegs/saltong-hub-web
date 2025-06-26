export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      "saltong-hex-rounds": {
        Row: {
          centerLetter: string | null;
          createdAt: string | null;
          date: string;
          gameId: number;
          maxScore: number | null;
          numPangrams: number | null;
          numWords: number | null;
          rootWord: string | null;
          words: string | null;
        };
        Insert: {
          centerLetter?: string | null;
          createdAt?: string | null;
          date: string;
          gameId: number;
          maxScore?: number | null;
          numPangrams?: number | null;
          numWords?: number | null;
          rootWord?: string | null;
          words?: string | null;
        };
        Update: {
          centerLetter?: string | null;
          createdAt?: string | null;
          date?: string;
          gameId?: number;
          maxScore?: number | null;
          numPangrams?: number | null;
          numWords?: number | null;
          rootWord?: string | null;
          words?: string | null;
        };
        Relationships: [];
      };
      "saltong-main-rounds": {
        Row: {
          createdAt: string;
          date: string;
          gameId: number;
          word: string;
        };
        Insert: {
          createdAt: string;
          date: string;
          gameId: number;
          word: string;
        };
        Update: {
          createdAt?: string;
          date?: string;
          gameId?: number;
          word?: string;
        };
        Relationships: [];
      };
      "saltong-max-rounds": {
        Row: {
          createdAt: string;
          date: string;
          gameId: number;
          word: string;
        };
        Insert: {
          createdAt: string;
          date: string;
          gameId: number;
          word: string;
        };
        Update: {
          createdAt?: string;
          date?: string;
          gameId?: number;
          word?: string;
        };
        Relationships: [];
      };
      "saltong-mini-rounds": {
        Row: {
          createdAt: string;
          date: string;
          gameId: number;
          word: string;
        };
        Insert: {
          createdAt: string;
          date: string;
          gameId: number;
          word: string;
        };
        Update: {
          createdAt?: string;
          date?: string;
          gameId?: number;
          word?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;
