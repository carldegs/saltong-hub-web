


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE OR REPLACE FUNCTION "public"."add_creator_as_admin"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$BEGIN
  IF NEW."createdBy" IS NULL THEN
    RETURN NEW;
  END IF;

  -- Try to insert the creator as an admin. If a row exists, update the role to 'admin' only if it differs.
  INSERT INTO public.group_members ("groupId", "userId", role, "joinedAt")
  VALUES (NEW.id, NEW."createdBy", 'admin', now())
  ON CONFLICT ("groupId", "userId") DO UPDATE
    SET role = EXCLUDED.role,
        "joinedAt" = LEAST(public.group_members."joinedAt", EXCLUDED."joinedAt")
    WHERE public.group_members.role IS DISTINCT FROM EXCLUDED.role;

  RETURN NEW;
END;$$;


ALTER FUNCTION "public"."add_creator_as_admin"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."decrement_group_member_count"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  UPDATE public.groups 
  SET "memberCount" = GREATEST("memberCount" - 1, 0)
  WHERE id = OLD."groupId";
  RETURN OLD;
END;
$$;


ALTER FUNCTION "public"."decrement_group_member_count"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_group_members_hex_rounds"("p_group" "uuid", "p_date" "text") RETURNS TABLE("userId" "uuid", "role" "text", "username" "text", "displayName" "text", "avatarUrl" "text", "startedAt" timestamp with time zone, "liveScore" integer, "vaultScore" integer, "isTopRank" boolean)
    LANGUAGE "sql" STABLE
    AS $$SELECT
    gm."userId",
    gm.role,
    pf.username,
    pf."display_name",
    pf."avatar_url",
    sur."startedAt",
    sur."liveScore",
    sur."vaultScore",
    sur."isTopRank"
  FROM public."group_members" gm
  LEFT JOIN public."saltong-hex-user-rounds" sur
    ON sur."userId" = gm."userId"
   AND sur."date" = p_date
  LEFT JOIN public.profiles pf
    ON pf.id = gm."userId"
  WHERE gm."groupId" = p_group
  ORDER BY sur."liveScore" DESC NULLS LAST, sur."vaultScore" DESC NULLS LAST;$$;


ALTER FUNCTION "public"."get_group_members_hex_rounds"("p_group" "uuid", "p_date" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_group_members_rounds"("p_group" "uuid", "p_date" "text", "p_mode" "text") RETURNS TABLE("userId" "uuid", "role" "text", "username" "text", "displayName" "text", "avatarUrl" "text", "startedAt" timestamp with time zone, "endedAt" timestamp with time zone, "solvedTurn" integer)
    LANGUAGE "sql" STABLE
    AS $$SELECT
    gm."userId",
    gm.role,
    pf.username,
    pf."display_name",
    pf."avatar_url",
    sur."startedAt",
    sur."endedAt",
    sur."solvedTurn"
  FROM public."group_members" gm
  LEFT JOIN public."saltong-user-rounds" sur
    ON sur."userId" = gm."userId"
   AND sur."mode" = p_mode
   AND sur."date" = p_date
  LEFT JOIN public.profiles pf
    ON pf.id = gm."userId"
  WHERE gm."groupId" = p_group
  ORDER BY sur."solvedTurn" ASC NULLS LAST, sur."endedAt" DESC NULLS LAST$$;


ALTER FUNCTION "public"."get_group_members_rounds"("p_group" "uuid", "p_date" "text", "p_mode" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."increment_group_member_count"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$BEGIN
  RAISE NOTICE 'Incrementing memberCount for groupId: %', NEW."groupId";
  
  UPDATE public.groups 
  SET "memberCount" = COALESCE("memberCount", 0) + 1
  WHERE id = NEW."groupId";
  
  RAISE NOTICE 'Updated rows: %', FOUND;
  
  RETURN NEW;
END;$$;


ALTER FUNCTION "public"."increment_group_member_count"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_group_admin"("p_user" "uuid", "p_group" "uuid") RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.group_members gm
    WHERE gm."groupId" = p_group AND gm."userId" = p_user AND gm.role = 'admin'
  );
$$;


ALTER FUNCTION "public"."is_group_admin"("p_user" "uuid", "p_group" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."is_group_admin"("p_user" "uuid", "p_group" "uuid") IS 'Returns true if user is an admin of the group. SECURITY DEFINER to avoid RLS recursion.';



CREATE OR REPLACE FUNCTION "public"."is_group_member"("p_user" "uuid", "p_group" "uuid") RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.group_members gm
    WHERE gm."groupId" = p_group AND gm."userId" = p_user
  );
$$;


ALTER FUNCTION "public"."is_group_member"("p_user" "uuid", "p_group" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."is_group_member"("p_user" "uuid", "p_group" "uuid") IS 'Returns true if user is a member of the group. SECURITY DEFINER to avoid RLS recursion.';



CREATE OR REPLACE FUNCTION "public"."prevent_last_admin_removal"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  admin_count int;
  grp_exists boolean;
BEGIN
  -- Only check if deleting an admin
  IF OLD.role = 'admin' THEN
    -- If the group row does not exist (e.g. group is being deleted in the same transaction),
    -- allow deletion of the last admin.
    SELECT EXISTS (
      SELECT 1 FROM public.groups g
      WHERE g.id = OLD."groupId"
    ) INTO grp_exists;

    IF NOT grp_exists THEN
      -- Group is gone / being deleted — allow the member delete
      RETURN OLD;
    END IF;

    -- Count remaining admins after this deletion
    SELECT COUNT(*) INTO admin_count
    FROM public.group_members
    WHERE "groupId" = OLD."groupId"
      AND role = 'admin'
      AND NOT ("groupId" = OLD."groupId" AND "userId" = OLD."userId");

    IF admin_count = 0 THEN
      RAISE EXCEPTION 'Cannot remove the last admin from a group';
    END IF;
  END IF;

  RETURN OLD;
END;
$$;


ALTER FUNCTION "public"."prevent_last_admin_removal"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."rls_auto_enable"() RETURNS "event_trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'pg_catalog'
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$$;


ALTER FUNCTION "public"."rls_auto_enable"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW."updatedAt" = now();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."group_members" (
    "groupId" "uuid" NOT NULL,
    "userId" "uuid" NOT NULL,
    "role" "text" DEFAULT 'member'::"text" NOT NULL,
    "joinedAt" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "valid_role" CHECK (("role" = ANY (ARRAY['admin'::"text", 'member'::"text"])))
);


ALTER TABLE "public"."group_members" OWNER TO "postgres";


COMMENT ON TABLE "public"."group_members" IS 'Members of groups with their roles';



CREATE TABLE IF NOT EXISTS "public"."groups" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "avatarUrl" "text",
    "createdAt" timestamp with time zone DEFAULT "now"() NOT NULL,
    "createdBy" "uuid",
    "updatedAt" timestamp with time zone DEFAULT "now"() NOT NULL,
    "isPublic" boolean DEFAULT false,
    "invitesEnabled" boolean DEFAULT true,
    "inviteCode" "text" NOT NULL,
    "memberCount" integer DEFAULT 0,
    "hideUnsolvedMembers" boolean DEFAULT false NOT NULL,
    CONSTRAINT "name_length" CHECK ((("char_length"(TRIM(BOTH FROM "name")) >= 3) AND ("char_length"(TRIM(BOTH FROM "name")) <= 50)))
);


ALTER TABLE "public"."groups" OWNER TO "postgres";


COMMENT ON TABLE "public"."groups" IS 'Groups for organizing players into private or public leaderboards';



CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "username" "text" NOT NULL,
    "display_name" "text",
    "avatar_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "profiles_display_name_length" CHECK ((("display_name" IS NULL) OR (("char_length"("display_name") >= 1) AND ("char_length"("display_name") <= 32)))),
    CONSTRAINT "profiles_username_format" CHECK ((("username" ~ '^[a-z0-9_.-]+$'::"text") AND ("username" !~ '\\.\\.'::"text") AND ("username" !~ '^\\.'::"text") AND ("username" !~ '\\.$'::"text"))),
    CONSTRAINT "profiles_username_length" CHECK ((("char_length"("username") >= 2) AND ("char_length"("username") <= 32)))
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."saltong-hex-rounds" (
    "date" "text" NOT NULL,
    "rootWord" "text",
    "centerLetter" "text",
    "roundId" bigint NOT NULL,
    "numPangrams" bigint,
    "numWords" bigint,
    "maxScore" bigint,
    "words" "text",
    "createdAt" timestamp with time zone,
    "wordId" bigint
);


ALTER TABLE "public"."saltong-hex-rounds" OWNER TO "postgres";


COMMENT ON TABLE "public"."saltong-hex-rounds" IS 'Round data for the Hex Game';



COMMENT ON COLUMN "public"."saltong-hex-rounds"."wordId" IS 'Integer defining the charset used for this round. Can get the letters through bitwise operations (each bit signifies a letter)';



CREATE TABLE IF NOT EXISTS "public"."saltong-hex-user-rounds" (
    "userId" "uuid" NOT NULL,
    "guessedWords" "text",
    "liveScore" numeric,
    "startedAt" timestamp with time zone,
    "updatedAt" timestamp with time zone,
    "isRevealed" boolean,
    "isTopRank" boolean,
    "isTopRankWhileLive" boolean,
    "date" "text" NOT NULL,
    "vaultScore" numeric
);


ALTER TABLE "public"."saltong-hex-user-rounds" OWNER TO "postgres";


COMMENT ON TABLE "public"."saltong-hex-user-rounds" IS 'User Round data for the Hex Game';



CREATE TABLE IF NOT EXISTS "public"."saltong-main-rounds" (
    "date" "text" NOT NULL,
    "word" "text" NOT NULL,
    "gameId" bigint NOT NULL,
    "createdAt" timestamp with time zone NOT NULL
);


ALTER TABLE "public"."saltong-main-rounds" OWNER TO "postgres";


COMMENT ON TABLE "public"."saltong-main-rounds" IS 'Deprecated: use saltong-rounds instead';



CREATE TABLE IF NOT EXISTS "public"."saltong-max-rounds" (
    "date" "text" NOT NULL,
    "word" "text" NOT NULL,
    "gameId" bigint NOT NULL,
    "createdAt" timestamp with time zone NOT NULL
);


ALTER TABLE "public"."saltong-max-rounds" OWNER TO "postgres";


COMMENT ON TABLE "public"."saltong-max-rounds" IS 'Deprecated: use saltong-rounds instead';



CREATE TABLE IF NOT EXISTS "public"."saltong-mini-rounds" (
    "date" "text" NOT NULL,
    "word" "text" NOT NULL,
    "gameId" bigint NOT NULL,
    "createdAt" timestamp with time zone NOT NULL
);


ALTER TABLE "public"."saltong-mini-rounds" OWNER TO "postgres";


COMMENT ON TABLE "public"."saltong-mini-rounds" IS 'Deprecated: use saltong-rounds instead';



CREATE TABLE IF NOT EXISTS "public"."saltong-rounds" (
    "mode" "text" NOT NULL,
    "date" "text" NOT NULL,
    "word" "text" NOT NULL,
    "roundId" bigint NOT NULL,
    "createdAt" timestamp with time zone
);


ALTER TABLE "public"."saltong-rounds" OWNER TO "postgres";


COMMENT ON TABLE "public"."saltong-rounds" IS 'Round data for the Saltong Games';



CREATE TABLE IF NOT EXISTS "public"."saltong-user-rounds" (
    "userId" "uuid" NOT NULL,
    "startedAt" timestamp with time zone NOT NULL,
    "answer" "text" NOT NULL,
    "endedAt" timestamp with time zone,
    "date" "text" NOT NULL,
    "mode" "text" NOT NULL,
    "grid" "text",
    "isCorrect" boolean,
    "solvedLive" boolean,
    "solvedTurn" bigint,
    "updatedAt" timestamp with time zone
);


ALTER TABLE "public"."saltong-user-rounds" OWNER TO "postgres";


COMMENT ON TABLE "public"."saltong-user-rounds" IS 'User Round Data for Saltong';



CREATE TABLE IF NOT EXISTS "public"."saltong-user-stats" (
    "userId" "uuid" NOT NULL,
    "createdAt" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT "now"() NOT NULL,
    "mode" "text" NOT NULL,
    "totalWins" bigint DEFAULT '0'::bigint,
    "totalLosses" bigint DEFAULT '0'::bigint,
    "currentWinStreak" bigint DEFAULT '0'::bigint,
    "longestWinStreak" bigint DEFAULT '0'::bigint,
    "winTurns" json[],
    "lastGameDate" timestamp with time zone,
    "lastRoundId" bigint
);


ALTER TABLE "public"."saltong-user-stats" OWNER TO "postgres";


COMMENT ON TABLE "public"."saltong-user-stats" IS 'User Statistics for the Saltong Games';



ALTER TABLE ONLY "public"."group_members"
    ADD CONSTRAINT "group_members_groupId_userId_key" UNIQUE ("groupId", "userId");



ALTER TABLE ONLY "public"."group_members"
    ADD CONSTRAINT "group_members_pkey" PRIMARY KEY ("groupId", "userId");



ALTER TABLE ONLY "public"."groups"
    ADD CONSTRAINT "groups_inviteCode_key" UNIQUE ("inviteCode");



ALTER TABLE ONLY "public"."groups"
    ADD CONSTRAINT "groups_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."saltong-rounds"
    ADD CONSTRAINT "saltong-game-data_pkey" PRIMARY KEY ("mode", "date");



ALTER TABLE ONLY "public"."saltong-hex-rounds"
    ADD CONSTRAINT "saltong-hex-rounds_pkey" PRIMARY KEY ("date");



ALTER TABLE ONLY "public"."saltong-hex-user-rounds"
    ADD CONSTRAINT "saltong-hex-user-rounds_pkey" PRIMARY KEY ("userId", "date");



ALTER TABLE ONLY "public"."saltong-main-rounds"
    ADD CONSTRAINT "saltong-main-rounds_gameId_key" UNIQUE ("gameId");



ALTER TABLE ONLY "public"."saltong-main-rounds"
    ADD CONSTRAINT "saltong-main-rounds_pkey" PRIMARY KEY ("date");



ALTER TABLE ONLY "public"."saltong-max-rounds"
    ADD CONSTRAINT "saltong-max-rounds_gameId_key" UNIQUE ("gameId");



ALTER TABLE ONLY "public"."saltong-max-rounds"
    ADD CONSTRAINT "saltong-max-rounds_pkey" PRIMARY KEY ("date");



ALTER TABLE ONLY "public"."saltong-mini-rounds"
    ADD CONSTRAINT "saltong-mini-rounds_gameId_key" UNIQUE ("gameId");



ALTER TABLE ONLY "public"."saltong-mini-rounds"
    ADD CONSTRAINT "saltong-mini-rounds_pkey" PRIMARY KEY ("date");



ALTER TABLE ONLY "public"."saltong-user-rounds"
    ADD CONSTRAINT "saltong-user-rounds_pkey" PRIMARY KEY ("userId", "date", "mode");



ALTER TABLE ONLY "public"."saltong-user-stats"
    ADD CONSTRAINT "saltong-user-stats_pkey" PRIMARY KEY ("userId", "mode");



CREATE INDEX "idx_group_members_admin" ON "public"."group_members" USING "btree" ("groupId", "role") WHERE ("role" = 'admin'::"text");



CREATE INDEX "idx_group_members_user" ON "public"."group_members" USING "btree" ("userId");



CREATE INDEX "idx_groups_invite_code_active" ON "public"."groups" USING "btree" ("inviteCode") WHERE ("invitesEnabled" = true);



CREATE INDEX "idx_groups_public" ON "public"."groups" USING "btree" ("isPublic", "createdAt" DESC) WHERE ("isPublic" = true);



CREATE UNIQUE INDEX "idx_profiles_username" ON "public"."profiles" USING "btree" ("username");



CREATE OR REPLACE TRIGGER "add_creator_as_admin_trigger" AFTER INSERT ON "public"."groups" FOR EACH ROW EXECUTE FUNCTION "public"."add_creator_as_admin"();



CREATE OR REPLACE TRIGGER "on_group_member_created" AFTER INSERT ON "public"."group_members" FOR EACH ROW EXECUTE FUNCTION "public"."increment_group_member_count"();



CREATE OR REPLACE TRIGGER "on_group_member_deleted" AFTER DELETE ON "public"."group_members" FOR EACH ROW EXECUTE FUNCTION "public"."decrement_group_member_count"();



CREATE OR REPLACE TRIGGER "prevent_last_admin_removal_trigger" BEFORE DELETE ON "public"."group_members" FOR EACH ROW EXECUTE FUNCTION "public"."prevent_last_admin_removal"();



CREATE OR REPLACE TRIGGER "trg_profiles_set_updated_at" BEFORE UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "update_groups_updated_at" BEFORE UPDATE ON "public"."groups" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."group_members"
    ADD CONSTRAINT "group_members_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."groups"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."group_members"
    ADD CONSTRAINT "group_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."group_members"
    ADD CONSTRAINT "group_members_userid_fkey" FOREIGN KEY ("userId") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."groups"
    ADD CONSTRAINT "groups_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."saltong-hex-user-rounds"
    ADD CONSTRAINT "saltong-hex-user-rounds_date_fkey" FOREIGN KEY ("date") REFERENCES "public"."saltong-hex-rounds"("date");



ALTER TABLE ONLY "public"."saltong-hex-user-rounds"
    ADD CONSTRAINT "saltong-hex-user-rounds_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."saltong-user-rounds"
    ADD CONSTRAINT "saltong-user-rounds_date_mode_fkey" FOREIGN KEY ("date", "mode") REFERENCES "public"."saltong-rounds"("date", "mode");



ALTER TABLE ONLY "public"."saltong-user-rounds"
    ADD CONSTRAINT "saltong-user-rounds_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."saltong-user-stats"
    ADD CONSTRAINT "saltong-user-stats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Admins can add members AND Users can join a group with an invit" ON "public"."group_members" FOR INSERT TO "authenticated" WITH CHECK (("public"."is_group_admin"(( SELECT "auth"."uid"() AS "uid"), "groupId") OR (EXISTS ( SELECT 1
   FROM "public"."groups" "g"
  WHERE (("g"."id" = "group_members"."groupId") AND ("g"."inviteCode" = (("current_setting"('request.headers'::"text", true))::json ->> 'x-supabase-request-invite-code'::"text")))))));



CREATE POLICY "Admins can delete their groups" ON "public"."groups" FOR DELETE USING ("public"."is_group_admin"(( SELECT "auth"."uid"() AS "uid"), "id"));



CREATE POLICY "Admins can update member roles" ON "public"."group_members" FOR UPDATE USING ("public"."is_group_admin"(( SELECT "auth"."uid"() AS "uid"), "groupId")) WITH CHECK ("public"."is_group_admin"(( SELECT "auth"."uid"() AS "uid"), "groupId"));



CREATE POLICY "Allow Admin to Insert" ON "public"."saltong-hex-rounds" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = '6d7fc575-9db8-4b6f-b335-12f46d6c56c9'::"uuid"));



CREATE POLICY "Authenticated users can create groups" ON "public"."groups" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable Insert for Admin" ON "public"."saltong-rounds" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = '6d7fc575-9db8-4b6f-b335-12f46d6c56c9'::"uuid"));



CREATE POLICY "Enable insert for authenticated users on saltong_user_stats" ON "public"."saltong-user-stats" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "userId"));



CREATE POLICY "Enable insert for authenticated users only" ON "public"."groups" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."saltong-hex-user-rounds" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."saltong-user-rounds" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable read access for all users" ON "public"."saltong-hex-rounds" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."saltong-main-rounds" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."saltong-max-rounds" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."saltong-mini-rounds" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."saltong-rounds" FOR SELECT USING (true);



CREATE POLICY "Enable users to view their own data only" ON "public"."saltong-hex-user-rounds" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Enable users to view their own data only" ON "public"."saltong-user-rounds" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Members can view group members" ON "public"."group_members" FOR SELECT USING (("public"."is_group_member"(( SELECT "auth"."uid"() AS "uid"), "groupId") OR (EXISTS ( SELECT 1
   FROM "public"."groups" "g"
  WHERE (("g"."id" = "group_members"."groupId") AND ("g"."isPublic" = true))))));



CREATE POLICY "Members can view their groups" ON "public"."groups" FOR SELECT TO "anon", "authenticated" USING (((( SELECT "auth"."uid"() AS "uid") = "createdBy") OR "public"."is_group_member"(( SELECT "auth"."uid"() AS "uid"), "id") OR ("inviteCode" = (("current_setting"('request.headers'::"text", true))::json ->> 'x-supabase-request-invite-code'::"text"))));



CREATE POLICY "Public groups are viewable by everyone" ON "public"."groups" FOR SELECT USING (("isPublic" = true));



CREATE POLICY "Users can update their own saltong_hex_user_rounds" ON "public"."saltong-hex-user-rounds" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "userId")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "userId"));



CREATE POLICY "Users can update their own saltong_user_rounds" ON "public"."saltong-user-rounds" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "userId")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "userId"));



CREATE POLICY "Users can update their own saltong_user_stats" ON "public"."saltong-user-stats" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "userId")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "userId"));



CREATE POLICY "Users can view their own saltong_user_stats" ON "public"."saltong-user-stats" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "userId"));



ALTER TABLE "public"."group_members" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."groups" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "public_can_select_profiles" ON "public"."profiles" FOR SELECT USING (true);



ALTER TABLE "public"."saltong-hex-rounds" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."saltong-hex-user-rounds" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."saltong-main-rounds" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."saltong-max-rounds" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."saltong-mini-rounds" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."saltong-rounds" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."saltong-user-rounds" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."saltong-user-stats" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "users_can_insert_own_profile" ON "public"."profiles" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "users_can_update_own_profile" ON "public"."profiles" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "id")) WITH CHECK (("auth"."uid"() = "id"));



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."add_creator_as_admin"() TO "anon";
GRANT ALL ON FUNCTION "public"."add_creator_as_admin"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."add_creator_as_admin"() TO "service_role";



GRANT ALL ON FUNCTION "public"."decrement_group_member_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."decrement_group_member_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."decrement_group_member_count"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_group_members_hex_rounds"("p_group" "uuid", "p_date" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_group_members_hex_rounds"("p_group" "uuid", "p_date" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_group_members_hex_rounds"("p_group" "uuid", "p_date" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_group_members_rounds"("p_group" "uuid", "p_date" "text", "p_mode" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_group_members_rounds"("p_group" "uuid", "p_date" "text", "p_mode" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_group_members_rounds"("p_group" "uuid", "p_date" "text", "p_mode" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."increment_group_member_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."increment_group_member_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."increment_group_member_count"() TO "service_role";



GRANT ALL ON FUNCTION "public"."is_group_admin"("p_user" "uuid", "p_group" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."is_group_admin"("p_user" "uuid", "p_group" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_group_admin"("p_user" "uuid", "p_group" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."is_group_member"("p_user" "uuid", "p_group" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."is_group_member"("p_user" "uuid", "p_group" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_group_member"("p_user" "uuid", "p_group" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."prevent_last_admin_removal"() TO "anon";
GRANT ALL ON FUNCTION "public"."prevent_last_admin_removal"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."prevent_last_admin_removal"() TO "service_role";



GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "anon";
GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."group_members" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."group_members" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."group_members" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."groups" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."groups" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."groups" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."profiles" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."profiles" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."profiles" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."saltong-hex-rounds" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."saltong-hex-rounds" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."saltong-hex-rounds" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."saltong-hex-user-rounds" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."saltong-hex-user-rounds" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."saltong-hex-user-rounds" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."saltong-main-rounds" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."saltong-main-rounds" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."saltong-main-rounds" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."saltong-max-rounds" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."saltong-max-rounds" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."saltong-max-rounds" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."saltong-mini-rounds" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."saltong-mini-rounds" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."saltong-mini-rounds" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."saltong-rounds" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."saltong-rounds" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."saltong-rounds" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."saltong-user-rounds" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."saltong-user-rounds" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."saltong-user-rounds" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."saltong-user-stats" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."saltong-user-stats" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."saltong-user-stats" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO "service_role";







