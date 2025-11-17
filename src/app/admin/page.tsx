import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminLandingPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto max-w-3xl p-6">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">Manage Saltong game modes</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Rounds</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/admin/classic">Classic</Link>
          </Button>

          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/admin/max">Max</Link>
          </Button>

          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/admin/mini">Mini</Link>
          </Button>

          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/admin/hex">Hex</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
