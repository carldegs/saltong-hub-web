import { canonicalUrl, SITE_URL } from "./seo";

type BreadcrumbItem = { name: string; path: string };

type GameData = {
  name: string;
  description: string;
  path: string;
  genre?: string;
};

type ArticleData = {
  title: string;
  description: string;
  path: string;
  publishedAt: string;
  author?: string;
};

export function siteJsonLd() {
  const creatorId = `${SITE_URL}/#carl-de-guia`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: "Saltong Hub",
        url: canonicalUrl("/"),
        description: "Daily Filipino word games and puzzles.",
        publisher: { "@id": creatorId },
      },
      {
        "@type": "Person",
        "@id": creatorId,
        name: "Carl de Guia",
        url: canonicalUrl("/about"),
      },
    ],
  };
}

export function gameJsonLd({
  name,
  description,
  path,
  genre = "Word game",
}: GameData) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name,
    description,
    url: canonicalUrl(path),
    applicationCategory: "GameApplication",
    genre,
    inLanguage: "fil",
    isAccessibleForFree: true,
    author: { "@id": `${SITE_URL}/#carl-de-guia` },
  };
}

export function articleJsonLd({
  title,
  description,
  path,
  publishedAt,
  author = "Saltong Hub",
}: ArticleData) {
  const url = canonicalUrl(path);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    mainEntityOfPage: url,
    datePublished: publishedAt,
    author: { "@type": "Person", name: author },
    publisher: { "@id": `${SITE_URL}/#website` },
  };
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: canonicalUrl(item.path),
    })),
  };
}
