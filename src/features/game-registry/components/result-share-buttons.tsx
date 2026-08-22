"use client";

import ShareButton from "@/components/shared/share-button";
import { CopyIcon, Share2Icon } from "lucide-react";

export default function ResultShareButtons({
  onShare,
  onCopy,
}: {
  onShare: () => void;
  onCopy: () => void;
}) {
  return (
    <div className="mx-auto flex items-center justify-evenly gap-2">
      <ShareButton
        icon={<Share2Icon />}
        label="Share Results"
        className="w-full min-w-22"
        onClick={onShare}
      />
      <ShareButton
        icon={<CopyIcon />}
        label="Copy Text"
        className="w-full min-w-22"
        onClick={onCopy}
      />
    </div>
  );
}
