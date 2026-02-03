"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCwIcon, PencilIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useUpdateGroup } from "@/features/groups/hooks/use-update-group";
import { groupValidationSchema } from "@/features/groups/schemas";
import ProfileAvatar from "@/app/components/profile-avatar";
import { getBoringAvatarUrl } from "@/utils/user";
import { useRouter } from "next/navigation";

const groupEditSchema = groupValidationSchema.pick({ name: true });

type GroupEditFormData = z.infer<typeof groupEditSchema>;

interface GroupEditDialogProps {
  groupId: string;
  groupName: string;
  groupAvatarUrl: string | null;
  isAdmin: boolean;
}

export default function GroupEditDialog({
  groupId,
  groupName,
  groupAvatarUrl,
  isAdmin,
}: GroupEditDialogProps) {
  const [open, setOpen] = useState(false);
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState(
    groupAvatarUrl || ""
  );
  const { mutate: updateGroup, isPending } = useUpdateGroup();
  const router = useRouter();

  const form = useForm<GroupEditFormData>({
    resolver: zodResolver(groupEditSchema),
    defaultValues: {
      name: groupName,
    },
  });

  const handleRegenerateAvatar = () => {
    const newSeed = crypto.randomUUID();
    const newAvatarUrl = getBoringAvatarUrl(newSeed);
    setCurrentAvatarUrl(newAvatarUrl);
  };

  const onSubmit = (data: GroupEditFormData) => {
    const updates: {
      name?: string;
      avatarUrl?: string;
    } = {};

    if (data.name !== groupName) {
      updates.name = data.name;
    }

    if (currentAvatarUrl !== (groupAvatarUrl || "")) {
      updates.avatarUrl = currentAvatarUrl;
    }

    // Only update if something changed
    if (Object.keys(updates).length === 0) {
      setOpen(false);
      return;
    }

    updateGroup(
      { groupId, updates },
      {
        onSuccess: () => {
          toast.success("Group updated successfully!");
          setOpen(false);
          router.refresh();
        },
        onError: (error) => {
          toast.error(`Failed to update group: ${error.message}`);
        },
      }
    );
  };

  // Don't render if user is not admin
  if (!isAdmin) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="icon">
          <PencilIcon className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="border-0">Edit Group</DialogTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Avatar Section */}
            <div className="space-y-4">
              <Label>Group Avatar</Label>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <ProfileAvatar
                    path={currentAvatarUrl}
                    fallback={groupName}
                    profileType="group"
                    className="size-16"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRegenerateAvatar}
                  className="flex items-center gap-2"
                >
                  <RefreshCwIcon className="size-4" />
                  Regenerate
                </Button>
              </div>
            </div>

            {/* Name Section */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter group name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
