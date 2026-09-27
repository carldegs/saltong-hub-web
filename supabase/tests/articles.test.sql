begin;

select plan(8);

select has_table('public', 'articles', 'articles table exists');
select has_column('public', 'articles', 'content_markdown', 'article body is Markdown');

delete from public.articles;

insert into public.articles (
  slug,
  title,
  summary,
  content_markdown,
  status,
  published_at
)
values (
  'published-note',
  'Published note',
  'A visible note',
  '## Visible',
  'published',
  now() - interval '1 minute'
);

select throws_ok(
  $$ insert into public.articles (slug, title, summary, content_markdown, status) values ('published-note', 'Duplicate', 'Duplicate', 'Duplicate', 'draft') $$,
  '23505',
  null,
  'duplicate slugs are rejected'
);

select throws_ok(
  $$ insert into public.articles (slug, title, summary, content_markdown, status) values ('invalid-status', 'Invalid', 'Invalid', 'Invalid', 'archived') $$,
  '23514',
  null,
  'invalid statuses are rejected'
);

insert into public.articles (
  slug,
  title,
  summary,
  content_markdown,
  status
)
values (
  'draft-note',
  'Draft note',
  'A private note',
  '## Draft',
  'draft'
);

insert into public.articles (
  slug,
  title,
  summary,
  content_markdown,
  status,
  scheduled_for
)
values
  (
    'due-note',
    'Due note',
    'A note ready to show',
    '## Due',
    'scheduled',
    now() - interval '1 minute'
  ),
  (
    'future-note',
    'Future note',
    'A note still private',
    '## Future',
    'scheduled',
    now() + interval '1 hour'
  );

set local role anon;

select results_eq(
  $$ select slug from public.articles order by slug $$,
  $$ values ('due-note'::text), ('published-note'::text) $$,
  'anonymous readers see published and due scheduled articles only'
);

select throws_ok(
  $$ insert into public.articles (slug, title, summary, content_markdown, status) values ('unauthorized', 'No', 'No', 'No', 'draft') $$,
  '42501',
  'permission denied for table articles',
  'anonymous readers cannot insert articles'
);

select throws_ok(
  $$ update public.articles set title = 'No' where slug = 'published-note' $$,
  '42501',
  'permission denied for table articles',
  'anonymous readers cannot update articles'
);

select throws_ok(
  $$ delete from public.articles where slug = 'published-note' $$,
  '42501',
  'permission denied for table articles',
  'anonymous readers cannot delete articles'
);

select * from finish();

rollback;
