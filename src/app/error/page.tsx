"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// TODO: Improve UI
export default function ErrorPage() {
  return (
    <Card className="mx-auto mt-10 max-w-md space-y-4 p-4">
      <CardHeader>
        <h1 className="text-xl font-bold">Error</h1>
      </CardHeader>
      <CardContent>
        <p className="text-red-600">Something went wrong!</p>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </CardContent>
    </Card>
  );
}
