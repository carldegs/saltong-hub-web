import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/shared/navbar";
import HomeNavbarBrand from "../components/home-navbar-brand";
import { getBlogPosts } from "./utils";
import { ArrowRight } from "lucide-react";
import { BlogDate } from "./components/blog-date";

export const metadata = {
  title: "Blog | Saltong Hub",
  description:
    "Read the latest updates, announcements, and stories from Saltong Hub",
};

export default function BlogPage() {
  const posts = getBlogPosts().sort(
    (a, b) =>
      new Date(b.metadata.publishedAt).getTime() -
      new Date(a.metadata.publishedAt).getTime()
  );

  return (
    <>
      <Navbar>
        <HomeNavbarBrand />
      </Navbar>
      <main className="dark:from-background dark:via-muted/60 dark:to-muted/80 relative min-h-[100dvh] bg-gradient-to-br from-[#f8fafc] via-[#e0e7ef] to-[#f1f5f9]">
        {/* Header */}
        <div className="border-muted bg-background/70 border-b backdrop-blur-sm">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
            <h1 className="mb-3 text-4xl font-bold tracking-tight sm:text-5xl">
              Blog
            </h1>
            <p className="text-muted-foreground mt-0 text-lg">
              Updates, announcements, and stories from Saltong Hub
            </p>
          </div>
        </div>

        {/* Posts */}
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-muted-foreground text-lg">
                No blog posts yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {posts.map((post, index) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group decoration-none block"
                >
                  <article className="bg-card border-muted hover:border-primary/50 flex flex-col gap-6 rounded-lg border p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg sm:flex-row sm:gap-8">
                    {/* Image */}
                    {post.metadata.heroImage && (
                      <div className="relative aspect-[20/9] w-full shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 sm:w-80 dark:from-gray-800 dark:to-gray-900">
                        <Image
                          src={post.metadata.heroImage}
                          alt={post.metadata.title}
                          fill
                          className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-105"
                          sizes="(max-width: 720px) 100vw, 320px"
                          priority={index === 0}
                          unoptimized
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex flex-1 flex-col justify-between gap-3">
                      {/* Meta */}
                      <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-sm">
                        <BlogDate date={post.metadata.publishedAt} />
                      </div>

                      {/* Title & Summary */}
                      <div>
                        <h3 className="group-hover:text-primary mb-2 text-xl leading-tight font-bold transition-colors sm:text-3xl">
                          {post.metadata.title}
                        </h3>
                        {post.metadata.summary && (
                          <p className="text-muted-foreground mt-0 line-clamp-2 text-base leading-relaxed">
                            {post.metadata.summary}
                          </p>
                        )}
                      </div>

                      {/* Tags & Read More */}
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        {post.metadata.tags &&
                          post.metadata.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {post.metadata.tags
                                .slice(0, 3)
                                .map((tag: string) => (
                                  <span
                                    key={tag}
                                    className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide uppercase transition-all"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              {post.metadata.tags.length > 3 && (
                                <span className="text-muted-foreground rounded-full px-2 py-1 text-xs font-medium">
                                  +{post.metadata.tags.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        <div className="group-hover:text-primary text-muted-foreground flex items-center gap-0.5 text-sm font-medium transition-colors">
                          <span>Read article</span>
                          <ArrowRight
                            size={16}
                            className="transition-transform group-hover:translate-x-1"
                          />
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
