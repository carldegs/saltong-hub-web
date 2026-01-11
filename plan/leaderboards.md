# Leaderboards Implementation Plan

## Overview

Implement a three-tier leaderboard system for Saltong Hub with global rankings, monthly seasons, and private group leaderboards using Supabase PostgreSQL with efficient caching strategies.

## Requirements Summary

### Global Leaderboards

- Show top 10 players per round for each game type
- **Saltong (Classic/Max/Mini)**: Ranked by fewest turns, then fastest solve time
- **Hex**: Ranked by highest score

### Monthly Seasons

- Aggregate player performance across all games in a month
- Ranking criteria (in order):
  1. Most games played (rewards consistency)
  2. Lowest average turns (rewards skill)
  3. Fastest average time (rewards speed)

### Private Group Leaderboards

- Users can create groups and invite others via shareable links
- Invite links expire after 7 days (admin-configurable)
- Only group members can view the leaderboard
- Shows all historical rounds + seasonal stats for group members

## Database Architecture

### New Tables

#### 1. Groups Table

```sql
CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  invite_link TEXT UNIQUE,
  link_expiry TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 2. Group Members Table

```sql
CREATE TABLE group_members (
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (group_id, user_id)
);
```

#### 3. Leaderboard Cache Table

```sql
CREATE TABLE leaderboard_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_type TEXT NOT NULL, -- 'saltong' | 'hex'
  mode TEXT, -- 'classic' | 'max' | 'mini' (null for hex)
  round_date DATE NOT NULL,
  rankings_json JSONB NOT NULL, -- [{userId, rank, score, time, username, avatarUrl}, ...]
  cached_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(game_type, mode, round_date)
);
```

### Required Indexes

```sql
-- For Saltong per-round leaderboards (global & group)
CREATE INDEX idx_saltong_rounds_leaderboard
ON "saltong-user-rounds" (mode, date, solvedTurn ASC, startedAt ASC)
WHERE isCorrect = true;

-- For Hex per-round leaderboards
CREATE INDEX idx_hex_rounds_leaderboard
ON "saltong-hex-user-rounds" (date, liveScore DESC);

-- For group member queries
CREATE INDEX idx_group_members_user ON group_members(user_id);

-- For monthly season queries (optional, may already be covered by PK)
CREATE INDEX idx_saltong_rounds_monthly
ON "saltong-user-rounds" (mode, date, userId, isCorrect);
```

## Implementation Steps

### Phase 1: Database Setup

1. Create migration file for new tables (`groups`, `group_members`, `leaderboard_cache`)
2. Create indexes for leaderboard queries
3. Set up Row Level Security (RLS) policies:
   - Groups: Users can only modify groups they created
   - Group members: Users can join groups with valid invite links
   - Leaderboard cache: Public read access

### Phase 2: Query Functions

#### Global Leaderboards

**Per-Round Saltong Leaderboard:**

```typescript
async function getGlobalSaltongLeaderboard(
  mode: "classic" | "max" | "mini",
  date: string // YYYY-MM-DD
): Promise<LeaderboardEntry[]> {
  // 1. Check cache first
  const cached = await supabase
    .from("leaderboard_cache")
    .select("rankings_json")
    .eq("game_type", "saltong")
    .eq("mode", mode)
    .eq("round_date", date)
    .single();

  if (cached && isWithinHour(cached.cached_at)) {
    return cached.rankings_json;
  }

  // 2. Compute from user-rounds
  const { data } = await supabase
    .from("saltong-user-rounds")
    .select(
      "userId, solvedTurn, startedAt, endedAt, profiles(username, avatarUrl)"
    )
    .eq("mode", mode)
    .eq("date", date)
    .eq("isCorrect", true)
    .order("solvedTurn", { ascending: true })
    .order("startedAt", { ascending: true })
    .limit(10);

  // 3. Apply RANK() for ties
  const ranked = applyRanking(data);

  // 4. Update cache
  await updateCache("saltong", mode, date, ranked);

  return ranked;
}
```

**Per-Round Hex Leaderboard:**

```typescript
async function getGlobalHexLeaderboard(
  date: string
): Promise<LeaderboardEntry[]> {
  // Similar pattern as Saltong, but order by liveScore DESC
}
```

#### Monthly Season Leaderboards

```typescript
async function getMonthlySeasonLeaderboard(
  mode: 'classic' | 'max' | 'mini',
  yearMonth: string // YYYY-MM
): Promise<SeasonLeaderboardEntry[]> {
  const [year, month] = yearMonth.split('-');
  const startDate = `${year}-${month}-01`;
  const endDate = getLastDayOfMonth(year, month);

  const { data } = await supabase.rpc('compute_monthly_season_rankings', {
    p_mode: mode,
    p_start_date: startDate,
    p_end_date: endDate
  });

  return data;
}

-- PostgreSQL function for aggregation
CREATE OR REPLACE FUNCTION compute_monthly_season_rankings(
  p_mode TEXT,
  p_start_date DATE,
  p_end_date DATE
)
RETURNS TABLE (
  user_id UUID,
  username TEXT,
  avatar_url TEXT,
  games_played BIGINT,
  avg_turns NUMERIC,
  avg_time NUMERIC,
  rank BIGINT
) AS $$
BEGIN
  RETURN QUERY
  WITH user_stats AS (
    SELECT
      r.userId,
      COUNT(*) as games_played,
      AVG(r.solvedTurn) as avg_turns,
      AVG(EXTRACT(EPOCH FROM (r.endedAt::timestamp - r.startedAt::timestamp))) as avg_time
    FROM "saltong-user-rounds" r
    WHERE r.mode = p_mode
      AND r.date >= p_start_date
      AND r.date <= p_end_date
      AND r.isCorrect = true
    GROUP BY r.userId
  )
  SELECT
    s.userId,
    p.username,
    p.avatarUrl,
    s.games_played,
    s.avg_turns,
    s.avg_time,
    RANK() OVER (
      ORDER BY s.games_played DESC, s.avg_turns ASC, s.avg_time ASC
    ) as rank
  FROM user_stats s
  JOIN profiles p ON p.id = s.userId
  ORDER BY rank
  LIMIT 100;
END;
$$ LANGUAGE plpgsql;
```

#### Private Group Leaderboards

```typescript
async function getGroupLeaderboard(
  groupId: string,
  mode: "classic" | "max" | "mini",
  date: string
): Promise<LeaderboardEntry[]> {
  // 1. Get group members
  const { data: members } = await supabase
    .from("group_members")
    .select("user_id")
    .eq("group_id", groupId);

  const userIds = members.map((m) => m.user_id);

  // 2. Fetch rounds for all members (on-demand, no cache)
  const { data } = await supabase
    .from("saltong-user-rounds")
    .select(
      "userId, solvedTurn, startedAt, endedAt, profiles(username, avatarUrl)"
    )
    .eq("mode", mode)
    .eq("date", date)
    .in("userId", userIds)
    .eq("isCorrect", true)
    .order("solvedTurn", { ascending: true })
    .order("startedAt", { ascending: true });

  return applyRanking(data);
}
```

#### Group Management Functions

```typescript
async function createGroup(name: string, userId: string) {
  const inviteLink = generateRandomToken();
  const linkExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const { data: group } = await supabase
    .from("groups")
    .insert({
      name,
      created_by: userId,
      invite_link: inviteLink,
      link_expiry: linkExpiry,
    })
    .select()
    .single();

  // Auto-join creator
  await supabase
    .from("group_members")
    .insert({ group_id: group.id, user_id: userId });

  return group;
}

async function joinGroup(inviteLink: string, userId: string) {
  // 1. Validate link
  const { data: group } = await supabase
    .from("groups")
    .select("id, link_expiry")
    .eq("invite_link", inviteLink)
    .single();

  if (!group || new Date(group.link_expiry) < new Date()) {
    throw new Error("Invalid or expired invite link");
  }

  // 2. Add member
  await supabase
    .from("group_members")
    .insert({ group_id: group.id, user_id: userId });

  return group;
}
```

### Phase 3: Caching Strategy

| Leaderboard Type       | Strategy         | TTL           | Reasoning                                    |
| ---------------------- | ---------------- | ------------- | -------------------------------------------- |
| Global daily (current) | Hourly cache     | 1 hour        | High traffic, expensive query (1K-10K users) |
| Global historical      | Permanent cache  | Never expires | Immutable data, frequently accessed          |
| Private groups         | On-demand        | None          | Fast with indexes (10-50 users), low traffic |
| Monthly seasons        | Time-based cache | 15-30 min     | Moderate cost, changes throughout month      |

**Cache Refresh Implementation:**

```typescript
// Supabase Edge Function or cron job
export async function refreshLeaderboardCache() {
  const today = new Date().toISOString().split("T")[0];
  const modes = ["classic", "max", "mini"];

  // Refresh Saltong leaderboards
  for (const mode of modes) {
    await getGlobalSaltongLeaderboard(mode, today); // Will update cache
  }

  // Refresh Hex leaderboard
  await getGlobalHexLeaderboard(today);
}

// Schedule: Run every hour via Supabase cron or external service
```

### Phase 4: API Endpoints

```typescript
// GET /api/leaderboards/global/[gameType]?mode=classic&date=2026-01-11
// GET /api/leaderboards/seasons/[yearMonth]/[mode]
// GET /api/leaderboards/groups/[groupId]?mode=classic&date=2026-01-11

// POST /api/groups (create group)
// GET /api/groups (list user's groups)
// GET /api/groups/[groupId] (get group details + members)
// DELETE /api/groups/[groupId] (leave/delete group)
// POST /api/groups/join (join via invite link)
```

### Phase 5: UI Components

1. **Global Leaderboard View**
   - Tabs: Daily Round | Monthly Season
   - Game type selector (Saltong Classic/Max/Mini, Hex)
   - Top 10 list with rank, username, avatar, score/time
   - User's personal rank (if not in top 10)

2. **Group Management**
   - Create group modal (name input)
   - Group list (user's groups)
   - Invite link display with copy button
   - Join group modal (paste invite link)
   - Member list with leave button

3. **Private Group Leaderboard**
   - Similar to global view but scoped to group members
   - Shows historical rounds + seasonal stats
   - Members-only access (enforced by RLS)

## Data Retention & Cleanup

- **Monthly season data**: Delete aggregated rankings 30 days after season ends (cost savings)
- **Leaderboard cache**: Keep for 90 days, then archive or delete old entries
- **Group data**: Cascade delete members when group is deleted
- **Expired invite links**: Clean up weekly via scheduled job

## Performance Considerations

### Expected Query Times (with indexes)

- Global daily leaderboard (cached): <10ms
- Global daily leaderboard (uncached): ~50-100ms (1K-10K users)
- Private group leaderboard: ~20-50ms (10-50 users)
- Monthly season ranking: ~100-200ms (aggregating 30 days of data)

### Scale Limits

- **Free Tier (500 MB)**: Supports ~10K active users
- **Pro Tier (8 GB)**: Supports ~100K+ active users
- Indexes add ~20-30% storage overhead

## Future Enhancements

1. **Real-time updates**: Use Supabase Realtime for live leaderboard updates
2. **Pagination**: Support top 100, top 1000, etc.
3. **Filters**: Filter by country, date range, etc.
4. **Achievements**: Badge system for leaderboard milestones
5. **Social features**: Follow users, friend leaderboards
6. **Analytics**: Track leaderboard engagement, popular groups

## Security & Privacy

- **RLS Policies**: Enforce member-only access to private group leaderboards
- **Invite link validation**: Check expiry before allowing joins
- **Rate limiting**: Prevent abuse of leaderboard API endpoints
- **Data privacy**: Only show public profile data (username, avatar) in leaderboards

## Testing Strategy

1. Unit tests for ranking logic (handle ties, edge cases)
2. Integration tests for database queries
3. Load testing for leaderboard cache performance
4. E2E tests for group creation and joining flow

## Rollout Plan

1. **Phase 1**: Deploy database migrations and indexes
2. **Phase 2**: Implement and test query functions
3. **Phase 3**: Build API endpoints with rate limiting
4. **Phase 4**: Build UI components (feature flag enabled)
5. **Phase 5**: Enable for beta testers
6. **Phase 6**: Public release with announcement

---

**Document Version**: 1.0  
**Last Updated**: January 11, 2026  
**Status**: Planning Complete
