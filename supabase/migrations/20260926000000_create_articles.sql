create table public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  title text not null check (length(trim(title)) > 0),
  summary text not null check (length(trim(summary)) > 0),
  tags text[] not null default '{}',
  content_markdown text not null check (length(trim(content_markdown)) > 0),
  status text not null default 'draft',
  scheduled_for timestamptz,
  published_at timestamptz,
  legacy_hero_image text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint articles_slug_key unique (slug),
  constraint articles_slug_format_check check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint articles_status_check check (status in ('draft', 'scheduled', 'published')),
  constraint articles_publication_state_check check (
    (status = 'draft' and scheduled_for is null)
    or (status = 'scheduled' and scheduled_for is not null)
    or (status = 'published' and published_at is not null)
  )
);

create index articles_publication_index
  on public.articles (status, scheduled_for desc, published_at desc);

create trigger articles_set_updated_at
  before update on public.articles
  for each row execute function public.set_updated_at();

alter table public.articles enable row level security;

revoke all on public.articles from anon, authenticated;
grant select on public.articles to anon, authenticated;

create policy articles_public_select
  on public.articles
  for select
  to anon, authenticated
  using (
    status = 'published'
    or (status = 'scheduled' and scheduled_for <= now())
  );

insert into public.articles (
  slug,
  title,
  summary,
  tags,
  content_markdown,
  status,
  published_at,
  legacy_hero_image
)
values
  (
    'introducing-saltong-hub',
    'Introducing Saltong Hub: The New Home for Filipino Word Games',
    'Starting January 1, 2026, Saltong is moving to its new, permanent home at saltong.com! Check out the exciting new features like saved progress, playing on any device, and access to all past puzzles',
    array['announcement'],
    $markdown$
After years of sharing your daily word puzzle fix, Saltong is getting a huge, exciting upgrade!

Starting January 1, 2026, the original Saltong site at saltong.carldegs.com will close its doors, and all the fun will move to our new, permanent address: **[Saltong Hub at saltong.com](https://saltong.com)**!

But you don't have to wait! Saltong Hub is ready to play NOW in Open Beta. Start exploring the new features today, and help us find and fix any small issues before the official launch on January 1.

## What is Saltong Hub?

The old Saltong was simple, but it had a big problem: your progress and streaks were only saved on the one device and browser you were using. If your phone broke or you switched computers, your stats were gone forever.

Saltong Hub fixes this by moving your game into the cloud. This means everything is securely saved online under your account.

Here’s what that means for you:

- 🎮 **All Games in One Place:** Easily switch between Saltong (5-letter), Mini (4-letter), Max (6-letter), and Hex from one easy-to-use site.
- 📊 **Stats You'll Never Lose:** Track your progress, win streaks, and best scores. Everything is linked to your account.
- 🎨 **Better Look and Feel:** We redesigned the site to be cleaner, faster, and easier to play on mobile.

### 🏛️ Access the Vault

Play all past Saltong puzzles whenever you want. When you create an account, The Vault gives you unlimited access to every puzzle we have published.

### ☁️ Play on Any Device (Seamless Sync)

Your game automatically saves online and syncs everywhere. Start a puzzle on your phone while commuting and finish it on your laptop when you get home.

### 🏆 More Features Coming Soon

- **Earn Achievements:** Collect badges for hitting milestones.
- **Groups:** Create private groups to see who gets the best scores each week.

## About Your Old Progress

Progress from saltong.carldegs.com will **not** transfer to Saltong Hub. The old site stored progress only inside your browser, so there is no safe way to move it into the new system.

## What Happens to the Old Site?

The original site will stop hosting new puzzles and will automatically send you to the new home at [saltong.com](https://saltong.com).

## Found a Bug? Need Help?

Please contact me directly at [carl@carldegs.com](mailto:carl@carldegs.com). You can also [contribute and donate](https://saltong.com/contribute) to help keep Saltong free and ad-free.
$markdown$,
    'published',
    '2025-11-15T12:00:00+08:00',
    '/patch-notes/saltong-hub-cover.jpg'
  ),
  (
    'leaderboards-valentines-update',
    'Ignite some Heated Rivalries with Saltong''s New Leaderboards and Profiles!',
    'Our latest valentine''s update brings profiles, groups, and leaderboards to Saltong! Challenge friends, compare daily results, and see who has the best bokabularyo.',
    array['announcement', 'update'],
    $markdown$
We're here to interrupt your *bebe time* to share Saltong's Valentine's update! Along with fixes and performance improvements, this update introduces **profiles**, **groups**, and **leaderboards** to make Saltong more social, competitive, and fun.

## Leaderboards are Here!

Leaderboards let you **create groups**, **invite your friends and family**, and compete on **daily rankings** across all Saltong games.

All games now support leaderboards:

- **Saltong Classic, Mini, and Max:** rankings are based on how many turns you took to solve the puzzle. Fewer turns means a higher rank.
- **Saltong Hex:** rankings are based on your score at the end of the round.

To create or join groups and leaderboards, a **Saltong account** is required. You can create one for free [here](https://saltong.com/auth?signup=1).

### Creating a Group

Making a group is quick and easy:

- Click **Create Group** from the sidebar.
- Use the **Create Group** button on the Groups page.
- Visit [saltong.com/groups/create](https://saltong.com/groups/create).

You only need a **group name** to get started. After creating a group, you can share an invite link or QR code and start inviting friends and family right away.

![Create a group](/patch-notes/create-group-1.jpg)

![Create a group](/patch-notes/create-group-2.jpg)

### Joining a Group

- Open the invite link or scan the QR code.
- Confirm that you want to join the group.
- Complete your profile if prompted.

Once you are in, you can see the group leaderboard, other members, and your current rank and daily results.

![Join a group](/patch-notes/join-group.jpg)

## Profiles

Profiles are required to join groups and appear on leaderboards. A profile includes an avatar, username, and display name. You can edit your profile anytime from the **Settings** page.

## Other Fixes and Improvements

- Updated the Saltong UI so the grid uses more screen space on mobile.
- **Saltong Hex** now includes **6-letter rounds**.
- Faster load times across the site.

## What’s Next?

- Global leaderboards so you can compete with everyone.
- Achievements and badges you can earn and show off on your profile.
- A new game is in the works 👀.

Thanks for all the love and support. If you have feedback or suggestions, feel free to reach out at [carl@carldegs.com](mailto:carl@carldegs.com).
$markdown$,
    'published',
    '2026-02-13T12:00:00+08:00',
    null
  ),
  (
    'saltong-tips-and-tricks',
    'Saltong Tips and Tricks for Competitive Folks Like You',
    'Five Filipino word-game patterns to help you solve Saltong faster and make every guess count.',
    array['guide', 'saltong'],
    $markdown$
As we get closer to the 2000th Saltong round, we’re starting to find patterns and little tricks that can help solve the puzzle faster and with fewer guesses.

Personally, I started with **ITLOG** for the classic game, **PALABOK** for Saltong Max, and **BATI** for Saltong Mini. They worked for me, though, and after a while they became part of the routine.

## 1. Get to know your PaPa

Okay, not that *papa*. I’m talking about your **pantig** and **panlapi**.

**Pantig** is a syllable, or one beat of pronunciation. **Panlapi** are affixes added to a root word to change its meaning or grammatical function.

- **Unlapi** or prefix: **mag**-aral
- **Gitlapi** or infix: s**um**ayaw
- **Hulapi** or suffix: basa**han**
- A combination: **pag** + **sum** + *sikap* + **an** = **pagsumikapan**

Filipino syllables are generally built around vowels. Look for chunks such as **MA-**, **PA-**, **-UM-**, **-IN-**, and **-AN** rather than treating every letter as separate.

| Pattern | Examples |
| --- | --- |
| P | **a**-**a**-sa |
| KP | gi-ta-ra |
| PKK | eks-tra |
| KKP | tse-ke, dra-ku-la |
| KKPKK | tsart |

## 2. Tagalog loves its As

The modern Filipino alphabet has **28 letters**, while the older *Abakada* had 20 and treated **Ng** as a separate letter. **A** is especially common, so testing **A** is often not a bad idea. Once you find it, think about familiar combinations like **KA**, **MA**, **NA**, **PA**, **SA**, and **-AN**.

## 3. Keep common consonant combinations in mind

**Ng** remains one of the most recognizable sound combinations in Filipino. Other useful combinations include **MB** and **MP** (*samba*, *lampa*, *tampo*) and **NT**, **ND**, and **NS** (*banta*, *banda*, *bansa*).

## 4. We really like to repeat stuff

Reduplication, or repeating all or part of a word, is a major feature of Filipino. Think of words like **susulat** and **tatakbo**. Don’t assume every blank needs a new letter.

## 5. Choose your starter word

If **A** is already extremely common, perhaps a starting word should test vowels that are harder to find or useful affixes. Or maybe the best starting word is the same thing we should do to corrupt politicians: **PUKSAIN**.

Ready to test these tips? Pick a game and play today's puzzle.

:::play-games{games="classic mini max"}
:::
$markdown$,
    'published',
    '2026-09-01T12:00:00+08:00',
    null
  );
