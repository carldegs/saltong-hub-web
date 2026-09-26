import Link from "next/link";
import { formatInTimeZone } from "date-fns-tz";

import { Button } from "@/components/ui/button";
import { listAdminArticles } from "@/features/articles/repository";
import { createClient } from "@/lib/supabase/server";
import { PH_TIMEZONE } from "@/utils/time";

function displayDate(value: string | null) {
  return value
    ? formatInTimeZone(value, PH_TIMEZONE, "MMM d, yyyy h:mm a 'PHT'")
    : "—";
}

export default async function AdminPatchNotesPage() {
  const articles = await listAdminArticles(await createClient());

  return (
    <main className="container mx-auto max-w-5xl space-y-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Patch Notes</h1>
          <p className="text-muted-foreground">
            Draft, schedule, and publish articles.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/patch-notes/new">New article</Link>
        </Button>
      </div>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left">
            <tr>
              <th className="p-3">Title</th>
              <th>Status</th>
              <th>Visibility</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id} className="border-t">
                <td className="p-3 font-medium">
                  <Link
                    className="hover:underline"
                    href={`/admin/patch-notes/${article.id}`}
                  >
                    {article.title}
                  </Link>
                </td>
                <td className="capitalize">{article.status}</td>
                <td>
                  {displayDate(
                    article.status === "scheduled"
                      ? article.scheduledFor
                      : article.publishedAt
                  )}
                </td>
                <td>{displayDate(article.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
