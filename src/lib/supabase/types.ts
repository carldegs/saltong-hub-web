export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5";
  };
  public: {
    Tables: {
      group_members: {
        Row: {
          groupId: string;
          joinedAt: string;
          role: string;
          userId: string;
        };
        Insert: {
          groupId: string;
          joinedAt?: string;
          role?: string;
          userId: string;
        };
        Update: {
          groupId?: string;
          joinedAt?: string;
          role?: string;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "group_members_groupId_fkey";
            columns: ["groupId"];
            isOneToOne: false;
            referencedRelation: "groups";
            referencedColumns: ["id"];
          },
        ];
      };
      groups: {
        Row: {
          avatarUrl: string | null;
          createdAt: string;
          createdBy: string | null;
          id: string;
          inviteCode: string;
          invitesEnabled: boolean | null;
          isPublic: boolean | null;
          memberCount: number | null;
          name: string;
          updatedAt: string;
        };
        Insert: {
          avatarUrl?: string | null;
          createdAt?: string;
          createdBy?: string | null;
          id?: string;
          inviteCode: string;
          invitesEnabled?: boolean | null;
          isPublic?: boolean | null;
          memberCount?: number | null;
          name: string;
          updatedAt?: string;
        };
        Update: {
          avatarUrl?: string | null;
          createdAt?: string;
          createdBy?: string | null;
          id?: string;
          inviteCode?: string;
          invitesEnabled?: boolean | null;
          isPublic?: boolean | null;
          memberCount?: number | null;
          name?: string;
          updatedAt?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          display_name: string | null;
          id: string;
          updated_at: string;
          username: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          display_name?: string | null;
          id: string;
          updated_at?: string;
          username: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          display_name?: string | null;
          id?: string;
          updated_at?: string;
          username?: string;
        };
        Relationships: [];
      };
      "saltong-hex-rounds": {
        Row: {
          centerLetter: string | null;
          createdAt: string | null;
          date: string;
          maxScore: number | null;
          numPangrams: number | null;
          numWords: number | null;
          rootWord: string | null;
          roundId: number;
          wordId: number | null;
          words: string | null;
        };
        Insert: {
          centerLetter?: string | null;
          createdAt?: string | null;
          date: string;
          maxScore?: number | null;
          numPangrams?: number | null;
          numWords?: number | null;
          rootWord?: string | null;
          roundId: number;
          wordId?: number | null;
          words?: string | null;
        };
        Update: {
          centerLetter?: string | null;
          createdAt?: string | null;
          date?: string;
          maxScore?: number | null;
          numPangrams?: number | null;
          numWords?: number | null;
          rootWord?: string | null;
          roundId?: number;
          wordId?: number | null;
          words?: string | null;
        };
        Relationships: [];
      };
      "saltong-hex-user-rounds": {
        Row: {
          date: string;
          guessedWords: string | null;
          isRevealed: boolean | null;
          isTopRank: boolean | null;
          isTopRankWhileLive: boolean | null;
          liveScore: number | null;
          startedAt: string | null;
          updatedAt: string | null;
          userId: string;
        };
        Insert: {
          date: string;
          guessedWords?: string | null;
          isRevealed?: boolean | null;
          isTopRank?: boolean | null;
          isTopRankWhileLive?: boolean | null;
          liveScore?: number | null;
          startedAt?: string | null;
          updatedAt?: string | null;
          userId: string;
        };
        Update: {
          date?: string;
          guessedWords?: string | null;
          isRevealed?: boolean | null;
          isTopRank?: boolean | null;
          isTopRankWhileLive?: boolean | null;
          liveScore?: number | null;
          startedAt?: string | null;
          updatedAt?: string | null;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "saltong-hex-user-rounds_date_fkey";
            columns: ["date"];
            isOneToOne: false;
            referencedRelation: "saltong-hex-rounds";
            referencedColumns: ["date"];
          },
        ];
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
      "saltong-rounds": {
        Row: {
          createdAt: string | null;
          date: string;
          mode: string;
          roundId: number;
          word: string;
        };
        Insert: {
          createdAt?: string | null;
          date: string;
          mode: string;
          roundId: number;
          word: string;
        };
        Update: {
          createdAt?: string | null;
          date?: string;
          mode?: string;
          roundId?: number;
          word?: string;
        };
        Relationships: [];
      };
      "saltong-user-rounds": {
        Row: {
          answer: string;
          date: string;
          endedAt: string | null;
          grid: string | null;
          isCorrect: boolean | null;
          mode: string;
          solvedLive: boolean | null;
          solvedTurn: number | null;
          startedAt: string;
          updatedAt: string | null;
          userId: string;
        };
        Insert: {
          answer: string;
          date: string;
          endedAt?: string | null;
          grid?: string | null;
          isCorrect?: boolean | null;
          mode: string;
          solvedLive?: boolean | null;
          solvedTurn?: number | null;
          startedAt: string;
          updatedAt?: string | null;
          userId: string;
        };
        Update: {
          answer?: string;
          date?: string;
          endedAt?: string | null;
          grid?: string | null;
          isCorrect?: boolean | null;
          mode?: string;
          solvedLive?: boolean | null;
          solvedTurn?: number | null;
          startedAt?: string;
          updatedAt?: string | null;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "saltong-user-rounds_date_mode_fkey";
            columns: ["date", "mode"];
            isOneToOne: false;
            referencedRelation: "saltong-rounds";
            referencedColumns: ["date", "mode"];
          },
        ];
      };
      "saltong-user-stats": {
        Row: {
          createdAt: string;
          currentWinStreak: number | null;
          lastGameDate: string | null;
          lastRoundId: number | null;
          longestWinStreak: number | null;
          mode: string;
          totalLosses: number | null;
          totalWins: number | null;
          updatedAt: string;
          userId: string;
          winTurns: Json[] | null;
        };
        Insert: {
          createdAt?: string;
          currentWinStreak?: number | null;
          lastGameDate?: string | null;
          lastRoundId?: number | null;
          longestWinStreak?: number | null;
          mode: string;
          totalLosses?: number | null;
          totalWins?: number | null;
          updatedAt?: string;
          userId: string;
          winTurns?: Json[] | null;
        };
        Update: {
          createdAt?: string;
          currentWinStreak?: number | null;
          lastGameDate?: string | null;
          lastRoundId?: number | null;
          longestWinStreak?: number | null;
          mode?: string;
          totalLosses?: number | null;
          totalWins?: number | null;
          updatedAt?: string;
          userId?: string;
          winTurns?: Json[] | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_group_members_rounds: {
        Args: { p_date: string; p_group: string; p_mode: string };
        Returns: {
          avatarUrl: string;
          displayName: string;
          endedAt: string;
          solvedTurn: number;
          startedAt: string;
          userId: string;
          username: string;
        }[];
      };
      is_group_admin: {
        Args: { p_group: string; p_user: string };
        Returns: boolean;
      };
      is_group_member: {
        Args: { p_group: string; p_user: string };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
