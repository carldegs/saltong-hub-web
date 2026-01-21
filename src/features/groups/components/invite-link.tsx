"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";

export default function InviteLink({
  value,
  label,
}: {
  value: string;
  label?: string;
}) {
  const [, copyToClipboard] = useCopyToClipboard();

  return (
    <Card className="w-full gap-2">
      <CardHeader>
        <CardTitle>Or, send an invite link:</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Input
          readOnly
          value={value}
          aria-label={label ? `Invite link for ${label}` : "Invite link"}
        />
        <Button
          className="flex-grow"
          onClick={() => {
            copyToClipboard(`Join my SaltongHub group ${label}: ${value}`).then(
              (value) => {
                if (value) {
                  toast.success("Invite link copied to clipboard!");
                }
              }
            );
          }}
        >
          <CopyIcon /> Copy Link
        </Button>
      </CardContent>
    </Card>
  );
}
