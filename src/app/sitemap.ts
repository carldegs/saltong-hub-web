import { MetadataRoute } from "next";
import { getBlogPosts } from "./patch-notes/utils";

const baseUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://saltong.com"
).replace(/\/$/, "");

// Play game variants
const playVariants = ["", "mini", "max", "hex"];

export default function sitemap(): MetadataRoute.Sitemap {
  // Get all published blog posts
  const blogPosts = getBlogPosts(false); // false = exclude drafts

  // Map blog posts to sitemap entries
  const blogs = blogPosts.map((post) => ({
    url: `${baseUrl}/patch-notes/${post.slug}`,
    lastModified: new Date(post.metadata.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Generate play pages dynamically - Priority 1.0
  const playPages = playVariants.map((variant) => ({
    url: `${baseUrl}/play${variant ? `/${variant}` : ""}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 1.0,
  }));

  // Generate vault pages dynamically - Priority 0.8
  const vaultPages = playVariants.map((variant) => ({
    url: `${baseUrl}/play${variant ? `/${variant}` : ""}/vault`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Static routes sorted by priority
  const routes = [
    // Home page - Priority 0.9
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    // Contribute - Priority 0.8
    {
      url: `${baseUrl}/contribute`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    // Other pages - Priority 0.3
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/patch-notes`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/policies`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/policies/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/policies/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/policies/cookies`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ];

  return [...playPages, ...routes, ...vaultPages, ...blogs];
}
