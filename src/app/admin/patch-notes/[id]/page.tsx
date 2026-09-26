import { notFound } from "next/navigation";

import { ArticleEditorForm } from "@/features/articles/editor/article-editor-form";
import { listAdminArticles } from "@/features/articles/repository";
import { createClient } from "@/lib/supabase/server";

export default async function EditPatchNotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = (await listAdminArticles(await createClient())).find(
    (item) => item.id === id
  );
  if (!article) notFound();
  return (
    <main className="container mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Edit patch note</h1>
      <ArticleEditorForm article={article} />
    </main>
  );
}
