import { AvatarImage, Avatar } from "@/components/ui/avatar";
import {
  BORING_AVATAR_COLORS,
  BORING_AVATAR_GROUP_COLORS,
  isBoringAvatarUrl,
} from "@/utils/user";

import BoringAvatar from "boring-avatars";
import { ComponentProps } from "react";

type ProfileType = "user" | "group";

const variantMap: Record<
  ProfileType,
  ComponentProps<typeof BoringAvatar>["variant"]
> = {
  user: "beam",
  group: "marble",
};

const colorsMap: Record<ProfileType, string[]> = {
  user: BORING_AVATAR_COLORS,
  group: BORING_AVATAR_GROUP_COLORS,
};

export default function ProfileAvatar({
  path,
  fallback,
  className,
  profileType = "user",
  fallbackClassName,
}: {
  path: string;
  fallback: string;
  className?: string;
  fallbackClassName?: string;
  profileType?: ProfileType;
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
        variant={variantMap[profileType]}
        colors={colorsMap[profileType]}
        size={boringAvatarSize}
        className={fallbackClassName}
      />
    </Avatar>
  );
}
