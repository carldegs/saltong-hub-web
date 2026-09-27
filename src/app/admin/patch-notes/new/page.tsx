import { ArticleEditorForm } from "@/features/articles/editor/article-editor-form";

export default function NewPatchNotePage() {
  return (
    <main className="container mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-3xl font-bold">New patch note</h1>
      <ArticleEditorForm />
    </main>
  );
}
