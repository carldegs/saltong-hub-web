"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";

import {
  LinkIcon,
  DownloadIcon,
  MoreVertical,
  QrCodeIcon,
  Share2Icon,
  UsersIcon,
  UserMinus2Icon,
  UserStarIcon,
  StarOffIcon,
  StarIcon,
} from "lucide-react";
import ShareButton from "@/components/shared/share-button";
import { useCopyToClipboard } from "usehooks-ts";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useGroupMembers } from "@/features/groups/hooks/use-group-members";
import { useToggleGroupAdmin } from "@/features/groups/hooks/use-toggle-admin";
import { useRemoveGroupMember } from "@/features/groups/hooks/use-remove-member";
import { Separator } from "@/components/ui/separator";
import { MemberRowSkeleton, MemberRow } from "@/components/shared/member-row";
import { SaltongQrCodeSvg } from "@/components/shared/saltong-qr-code-svg";
import { downloadStyledQrPng } from "@/features/groups/utils/qr";
import React, { useState, useRef, useMemo } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function GroupMembersDialog({
  inviteCode,
  groupName,
  groupId,
  userId,
}: {
  inviteCode: string;
  groupName?: string;
  groupId: string;
  userId: string;
}) {
  const inviteUrl =
    typeof window !== "undefined"
      ? window.location.origin + `/j/${inviteCode}`
      : "";
  const [, copyToClipboard] = useCopyToClipboard();
  const [qrOpen, setQrOpen] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const handleClickDownload = () => {
    const svg = svgRef.current;
    if (!svg) return;
    downloadStyledQrPng(svg, groupName);
  };
  const [open, setOpen] = React.useState(false);
  const { data, isPending } = useGroupMembers(groupId, open);
  const { mutate: toggleAdmin, isPending: isToggling } = useToggleGroupAdmin();
  const { mutate: removeMember, isPending: isRemoving } =
    useRemoveGroupMember();
  const router = useRouter();

  const isUserAdmin = useMemo(() => {
    if (!data) return false;
    const member = data.find((member) => member.userId === userId);
    return member?.role === "admin";
  }, [data, userId]);

  // Sort members: current user first, then others
  const sortedMembers = React.useMemo(() => {
    if (!data) return [];
    const current = data.find((m) => m.userId === userId);
    const others = data.filter((m) => m.userId !== userId);
    return current ? [current, ...others] : others;
  }, [data, userId]);

  // Only admins can manage others
  const isOnlyAdmin = React.useMemo(() => {
    if (!data) return false;
    const admins = data.filter((m) => m.role === "admin");
    return admins.length === 1 && admins[0].userId === userId;
  }, [data, userId]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="icon">
          <UsersIcon className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <DialogTitle className="flex-1 border-0">Members</DialogTitle>
          </div>
          <div className="no-scrollbar bg-muted/80 dark:bg-muted/40 max-h-[50vh] overflow-y-auto rounded-lg p-4">
            {isPending
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="py-2">
                    <MemberRowSkeleton />
                  </div>
                ))
              : sortedMembers.map((member) => (
                  <React.Fragment key={member.userId}>
                    <div
                      key={member.userId}
                      className="flex items-center justify-between gap-2 py-2"
                    >
                      <div>
                        <MemberRow
                          avatarUrl={member.profiles?.avatar_url ?? null}
                          displayName={
                            member.profiles?.display_name ??
                            member.profiles?.username ??
                            member.userId
                          }
                          username={member.profiles?.username ?? member.userId}
                          icon={
                            member.role === "admin" ? (
                              <StarIcon
                                fill="currentColor"
                                className="size-4 opacity-30 hover:opacity-100"
                              />
                            ) : null
                          }
                        />
                      </div>
                      {/* Action menu */}
                      <div>
                        {member.userId === userId ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                disabled={isOnlyAdmin}
                              >
                                <MoreVertical className="size-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                disabled={isOnlyAdmin}
                                onSelect={() => {
                                  const confirmed = window.confirm(
                                    "Are you sure you want to leave this group?"
                                  );
                                  if (confirmed) {
                                    removeMember(
                                      {
                                        groupId,
                                        targetUserId: userId,
                                      },
                                      {
                                        onSuccess: () => {
                                          setOpen(false);
                                          toast.success(
                                            "You have left the group."
                                          );
                                          router.push("/groups");
                                        },
                                        onError: (error) => {
                                          toast.error(
                                            `Failed to leave group: ${error.message}`
                                          );
                                        },
                                      }
                                    );
                                  }
                                }}
                              >
                                Leave group
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : isUserAdmin ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical fontSize={12} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {member.role === "admin" ? (
                                <DropdownMenuItem
                                  disabled={isToggling}
                                  onSelect={() => {
                                    toggleAdmin({
                                      groupId,
                                      targetUserId: member.userId,
                                      role: "member",
                                    });
                                  }}
                                >
                                  <StarOffIcon />
                                  Remove admin
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  disabled={isToggling}
                                  onSelect={() => {
                                    toggleAdmin({
                                      groupId,
                                      targetUserId: member.userId,
                                      role: "admin",
                                    });
                                  }}
                                >
                                  <UserStarIcon />
                                  Make admin
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                disabled={isRemoving}
                                onSelect={() => {
                                  removeMember(
                                    {
                                      groupId,
                                      targetUserId: member.userId,
                                    },
                                    {
                                      onSuccess: () => {
                                        toast.success(
                                          "Member removed from group."
                                        );
                                      },
                                      onError: (error) => {
                                        toast.error(
                                          `Failed to remove member: ${error.message}`
                                        );
                                      },
                                    }
                                  );
                                }}
                              >
                                <UserMinus2Icon />
                                Remove from group
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : null}
                      </div>
                    </div>
                    <Separator
                      className="my-2 last:hidden"
                      key={`separator-${member.userId}`}
                    />
                  </React.Fragment>
                ))}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <DialogTitle className="border-0">Invite your tropa!</DialogTitle>
          <div className="bg-muted/80 dark:bg-muted/40 flex items-center justify-center gap-4 rounded-lg p-4">
            <div className="grid grid-cols-3 gap-4">
              <ShareButton
                onClick={async () => {
                  if (navigator.share) {
                    try {
                      await navigator.share({
                        title: groupName
                          ? `Join ${groupName} on Saltong Hub`
                          : "Join my group on Saltong Hub",
                        url: inviteUrl,
                      });
                    } catch (e) {
                      if (
                        e instanceof Error &&
                        (e.name === "AbortError" ||
                          e.message === "Share canceled")
                      ) {
                        // User cancelled share, do nothing
                        return;
                      }
                      console.error("Share failed:", e);
                    }
                  } else {
                    toast.error("Sharing is not supported on this device.");
                  }
                }}
                icon={<Share2Icon />}
                label="Share"
              />
              <ShareButton
                onClick={() => {
                  copyToClipboard(inviteUrl).then((value) => {
                    if (value)
                      toast.success("Invite link copied to clipboard!");
                  });
                }}
                icon={<LinkIcon />}
                label="Copy Link"
              />
              <ShareButton
                onClick={() => setQrOpen(true)}
                icon={<QrCodeIcon />}
                label="QR Code"
              />
              <Drawer open={qrOpen} onOpenChange={setQrOpen}>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle className="border-0 text-center text-xl">
                      Invite by QR Code
                    </DrawerTitle>
                    <DrawerDescription className="mt-0 text-center">
                      Scan the QR Code to join {groupName ?? "this group"}.
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="flex flex-col items-center gap-4 py-4">
                    <SaltongQrCodeSvg
                      ref={svgRef}
                      value={inviteUrl}
                      marginSize={2}
                      level="M"
                      size={220}
                      fgColor="#252827"
                      bgColor="#ffffff"
                      className="rounded-lg"
                      imageSize={60}
                    />
                  </div>
                  <DrawerFooter>
                    <Button
                      onClick={handleClickDownload}
                      className="mx-auto w-full max-w-xl"
                    >
                      <DownloadIcon /> Download QR Code
                    </Button>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
        </div>
        {isUserAdmin && (
          <div className="flex flex-col gap-1">
            <DialogTitle className="border-0">Admin Settings</DialogTitle>
            <div className="bg-muted/80 dark:bg-muted/40 flex-flex-col gap-2 rounded-lg p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <div className="font-bold">Delete Group</div>
                  <div className="text-sm">
                    Once deleted, there is no going back.
                  </div>
                </div>
                <Button variant="destructive" size="sm">
                  Delete Group
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
