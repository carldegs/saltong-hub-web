import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { BlogPost } from "@/app/patch-notes/utils";
import { BlogDate } from "@/app/patch-notes/components/blog-date";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const MAX_RECENT_POSTS = 5;
const FALLBACK_IMAGE = "/patch-notes/bg.jpg";

export default function PatchNotesCarousel({ posts }: { posts: BlogPost[] }) {
  const recentPosts = posts.slice(0, MAX_RECENT_POSTS);

  if (recentPosts.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="patch-notes-heading">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div className="max-w-2xl">
          <h2
            id="patch-notes-heading"
            className="scroll-m-20 pb-0 text-2xl font-semibold tracking-tight"
          >
            Patch Notes
          </h2>
          <p className="text-muted-foreground mt-2 leading-relaxed">
            Read more about the latest changes on the hub, some explainers on
            how the games are made, and tips and tricks on improving your puzzle
            skills.
          </p>
        </div>
        <Link
          href="/patch-notes"
          className="text-primary hover:text-primary/80 mt-1 inline-flex shrink-0 items-center gap-1 text-sm font-semibold transition-colors"
        >
          See All
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </header>

      <Carousel opts={{ align: "start", dragFree: true }}>
        <CarouselContent>
          {recentPosts.map((post) => {
            const image =
              post.metadata.heroImage ?? post.metadata.image ?? FALLBACK_IMAGE;

            return (
              <CarouselItem
                key={post.slug}
                className="basis-[84%] lg:basis-[30rem]"
              >
                <Link
                  href={`/patch-notes/${post.slug}`}
                  className="group relative block aspect-[16/10] overflow-hidden rounded-xl bg-slate-900"
                >
                  <Image
                    src={image}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 82vw, (max-width: 1024px) 46vw, 320px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/5" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <BlogDate
                        date={post.metadata.publishedAt}
                        showIcon={false}
                        className="text-xs font-medium text-white/75"
                      />
                      {post.metadata.tags?.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-white/15 px-2 py-0.5 text-[0.65rem] font-semibold tracking-wide text-white/90 uppercase"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="line-clamp-2 text-lg leading-tight font-bold tracking-tight text-white sm:text-xl">
                      {post.metadata.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/80">
                      {post.metadata.summary}
                    </p>
                  </div>
                </Link>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
