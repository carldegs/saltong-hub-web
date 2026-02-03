import { notFound } from "next/navigation";
import { getBlogPosts, getBlogPost, isAdmin } from "../utils";
import { Navbar } from "@/components/shared/navbar";
import HomeNavbarBrand from "@/app/components/home-navbar-brand";
import { User, ArrowLeft, Info } from "lucide-react";
import { CustomMDX } from "@/mdx-components";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { TableOfContents } from "./components/table-of-contents";
import { BlogDate } from "../components/blog-date";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createClient } from "@/lib/supabase/server";

// Extract headings from markdown content for table of contents
function extractHeadings(content: string) {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: { level: number; text: string; id: string }[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    headings.push({ level, text, id });
  }

  return headings;
}

export async function generateStaticParams() {
  const posts = getBlogPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const isAdminUser = await isAdmin(supabase);
  const post = getBlogPost(slug, isAdminUser);
  if (!post) {
    return;
  }

  const { title, publishedAt, summary, image } = post.metadata;

  return {
    title,
    description: summary,
    openGraph: {
      title,
      description: summary,
      type: "article",
      publishedTime: publishedAt,
      images: image ? [{ url: image }] : [],
    },
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const isAdminUser = await isAdmin(supabase);
  const post = getBlogPost(slug, isAdminUser);

  if (!post) {
    notFound();
  }

  const headings = extractHeadings(post.content);

  return (
    <>
      <Navbar>
        <HomeNavbarBrand />
      </Navbar>
      <main className="dark:from-background dark:via-muted/60 dark:to-muted/80 relative min-h-[100dvh] bg-gradient-to-br from-[#f8fafc] via-[#e0e7ef] to-[#f1f5f9]">
        {/* Hero Image with Title and Back Button */}
        <div className="relative h-[60vh] w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-400 dark:to-gray-600">
          <Image
            src={post.metadata.heroImage ?? "/patch-notes/bg.jpg"}
            alt={post.metadata.title}
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

          {/* Back Button Overlay */}
          <div className="absolute top-0 right-0 left-0 px-4 py-6 sm:px-6">
            <Link href="/patch-notes">
              <Button variant="secondary" size="sm" className="group gap-2">
                <ArrowLeft
                  size={16}
                  className="transition-transform group-hover:-translate-x-1"
                />
                Back to List
              </Button>
            </Link>
          </div>

          {/* Title Overlay */}
          <div className="absolute right-0 bottom-0 left-0 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="max-w-4xl">
                {/* Tags */}
                {post.metadata.tags && post.metadata.tags.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {post.metadata.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/30 bg-white/20 px-3 py-1 text-xs font-semibold tracking-wide text-white uppercase shadow-lg backdrop-blur-sm transition-all hover:bg-white/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <h1 className="mb-4 text-3xl leading-tight font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                  {post.metadata.title}
                </h1>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-white/90">
                  {post.metadata.author && (
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      <span>{post.metadata.author}</span>
                    </div>
                  )}
                  <BlogDate date={post.metadata.publishedAt} iconSize={16} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content with Sidebar */}
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex gap-12">
            {/* Article Content */}
            <article className="min-w-0 flex-1">
              {/* Draft Banner */}
              {post.metadata.draft && (
                <Alert className="mb-8 border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20">
                  <Info className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
                  <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                    This is a draft post and is only visible to administrators.
                  </AlertDescription>
                </Alert>
              )}

              {/* Summary */}
              {post.metadata.summary && (
                <p className="text-muted-foreground mb-8 text-xl leading-relaxed">
                  {post.metadata.summary}
                </p>
              )}

              {/* Content */}
              <div className="prose prose-lg dark:prose-invert prose-headings:scroll-mt-24 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-lg mx-auto max-w-none">
                <CustomMDX source={post.content} />
              </div>

              {/* Footer */}
              <footer className="border-muted mt-16 border-t pt-8">
                <div className="flex flex-col items-center gap-6 text-center">
                  <div>
                    <h3 className="mb-2 text-lg font-semibold">
                      Have questions or feedback?
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      We&apos;d love to hear from you!
                    </p>
                  </div>
                  <a href="mailto:carl@carldegs.com">
                    <Button variant="default" size="lg" className="gap-2">
                      <User size={16} />
                      Contact Us
                    </Button>
                  </a>
                  <Link href="/patch-notes" className="mt-4">
                    <Button variant="outline" className="gap-2">
                      <ArrowLeft size={16} />
                      Back to All Posts
                    </Button>
                  </Link>
                </div>
              </footer>
            </article>

            {/* Table of Contents */}
            <TableOfContents headings={headings} />
          </div>
        </div>
      </main>
    </>
  );
}
