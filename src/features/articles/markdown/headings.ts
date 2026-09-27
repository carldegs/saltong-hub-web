export type ArticleHeading = { level: number; text: string; id: string };

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function extractArticleHeadings(content: string): ArticleHeading[] {
  return [...content.matchAll(/^(#{2,3})\s+(.+)$/gm)].map((match) => ({
    level: match[1].length,
    text: match[2].trim(),
    id: slugify(match[2]),
  }));
}
