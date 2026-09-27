import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, User } from "lucide-react";

import HomeNavbarBrand from "@/app/components/home-navbar-brand";
import { Navbar } from "@/components/shared/navbar";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { ArticleMarkdown } from "@/features/articles/markdown/article-markdown";
import { extractArticleHeadings } from "@/features/articles/markdown/headings";
import { getPublicArticleBySlug } from "@/features/articles/repository";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/structured-data";
import { createClient } from "@/lib/supabase/server";

import { BlogDate } from "../components/blog-date";
import { TableOfContents } from "./components/table-of-contents";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getPublicArticleBySlug(await createClient(), slug);
  if (!article) return;
  return { title: article.title, description: article.summary };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getPublicArticleBySlug(await createClient(), slug);
  if (!article) notFound();

  const publishedAt =
    article.publishedAt ?? article.scheduledFor ?? article.createdAt;

  return (
    <>
      <Navbar>
        <HomeNavbarBrand />
      </Navbar>
      <JsonLd
        data={articleJsonLd({
          title: article.title,
          description: article.summary,
          path: `/patch-notes/${article.slug}`,
          publishedAt,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Patch Notes", path: "/patch-notes" },
          { name: article.title, path: `/patch-notes/${article.slug}` },
        ])}
      />
      <main className="dark:from-background dark:via-muted/60 dark:to-muted/80 min-h-[100dvh] bg-gradient-to-br from-[#f8fafc] via-[#e0e7ef] to-[#f1f5f9]">
        <div className="relative h-[60vh] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          <Image
            src={article.legacyHeroImage ?? "/patch-notes/bg.jpg"}
            alt={article.title}
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
          <div className="absolute top-0 right-0 left-0 p-6">
            <Button variant="secondary" size="sm" asChild>
              <Link href="/patch-notes">
                <ArrowLeft size={16} />
                Back to List
              </Link>
            </Button>
          </div>
          <div className="absolute right-0 bottom-0 left-0 p-8 text-white">
            <div className="mx-auto max-w-7xl">
              <div className="mb-4 flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/30 bg-white/20 px-3 py-1 text-xs font-semibold uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="mb-4 text-4xl font-bold">{article.title}</h1>
              <BlogDate date={publishedAt} iconSize={16} />
            </div>
          </div>
        </div>
        <div className="mx-auto flex max-w-7xl gap-12 px-4 py-12 sm:px-6">
          <article className="min-w-0 flex-1">
            <p className="text-muted-foreground mb-8 text-xl">
              {article.summary}
            </p>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <ArticleMarkdown content={article.contentMarkdown} />
            </div>
            <footer className="border-muted mt-16 border-t pt-8 text-center">
              <p className="mb-4">Have questions or feedback?</p>
              <Button asChild>
                <a href="mailto:carl@carldegs.com">
                  <User size={16} />
                  Contact Us
                </a>
              </Button>
            </footer>
          </article>
          <TableOfContents
            headings={extractArticleHeadings(article.contentMarkdown)}
          />
        </div>
      </main>
    </>
  );
}
