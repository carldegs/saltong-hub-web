import { AvatarImage, Avatar } from "@/components/ui/avatar";
import { BORING_AVATAR_COLORS, isBoringAvatarUrl } from "@/utils/user";

import BoringAvatar from "boring-avatars";

export default function ProfileAvatar({
  path,
  fallback,
  className,
}: {
  path: string;
  fallback: string;
  className?: string;
  fallbackClassName?: string;
}) {
  const isBoringAvatar = isBoringAvatarUrl(path);
  const boringAvatarName = isBoringAvatar ? path.slice(5) : fallback;

  const sizeMatch = className?.match(/size-(\d+)/);
  const boringAvatarSize = sizeMatch
    ? parseInt(sizeMatch[1], 10) * 4
    : undefined;

  return (
    <Avatar className={className}>
      {!isBoringAvatar && <AvatarImage src={path} alt={fallback} />}
      <BoringAvatar
        data-slot={isBoringAvatar ? "avatar-image" : "avatar-fallback"}
        name={boringAvatarName || "User"}
        variant="beam"
        colors={BORING_AVATAR_COLORS}
        size={boringAvatarSize}
      />
    </Avatar>
  );
}
