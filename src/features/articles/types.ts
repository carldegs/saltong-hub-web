export type ArticleStatus = "draft" | "scheduled" | "published";

export type Article = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  contentMarkdown: string;
  status: ArticleStatus;
  scheduledFor: string | null;
  publishedAt: string | null;
  legacyHeroImage: string | null;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ArticleEditorInput = {
  title: string;
  slug: string;
  summary: string;
  tags: string[];
  contentMarkdown: string;
  status: ArticleStatus;
  scheduledFor: string | null;
};
