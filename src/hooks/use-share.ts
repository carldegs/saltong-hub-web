import { useCallback, useMemo } from "react";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";

export default function useShare({
  title,
  message,
}: {
  title?: string;
  message: string;
}) {
  const [, copyToClipboard] = useCopyToClipboard();

  const canShare = useMemo(() => !!window?.navigator?.canShare, []);

  const share = useCallback(() => {
    return window?.navigator?.share({
      title,
      text: message,
    });
  }, [message, title]);

  const copy = useCallback(() => {
    copyToClipboard(message);
    toast.success("Copied to clipboard!");
  }, [copyToClipboard, message]);

  return useMemo(
    () => ({
      canShare,
      share,
      copy,
    }),
    [canShare, copy, share]
  );
}
