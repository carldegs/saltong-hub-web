DROP POLICY IF EXISTS "Admins can add members AND Users can join a group with an invit"
  ON "public"."group_members";

CREATE POLICY "Admins can add members AND Users can join with an active invite"
  ON "public"."group_members"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (
    "public"."is_group_admin"((SELECT "auth"."uid"()), "groupId")
    OR EXISTS (
      SELECT 1
      FROM "public"."groups" AS "g"
      WHERE "g"."id" = "group_members"."groupId"
        AND "g"."invitesEnabled" = true
        AND "g"."inviteCode" = (
          ("current_setting"('request.headers', true))::json ->>
          'x-supabase-request-invite-code'
        )
    )
  );

DROP POLICY IF EXISTS "Members can view their groups" ON "public"."groups";

CREATE POLICY "Members can view their groups"
  ON "public"."groups"
  FOR SELECT
  TO "anon", "authenticated"
  USING (
    (SELECT "auth"."uid"()) = "createdBy"
    OR "public"."is_group_member"((SELECT "auth"."uid"()), "id")
    OR (
      "invitesEnabled" = true
      AND "inviteCode" = (
        ("current_setting"('request.headers', true))::json ->>
        'x-supabase-request-invite-code'
      )
    )
  );
