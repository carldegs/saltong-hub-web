"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { Profile } from "../types";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import AvatarSelectionModal from "@/app/settings/account/avatar-selection-modal";
import BoringAvatar from "boring-avatars";
import { BORING_AVATAR_COLORS, isBoringAvatarUrl } from "@/utils/user";
import { profileValidationSchema } from "../schemas";

type BaseProfile = Omit<Profile, "id" | "created_at" | "updated_at">;

type ProfileFormData = z.infer<typeof profileValidationSchema>;

interface ProfileEditorFormProps {
  initialData?: Partial<BaseProfile>;
  onSubmit: (data: BaseProfile) => Promise<void>;
  onSuccess?: (data: BaseProfile) => void;
  onError?: (error: Error) => void;
  isLoading?: boolean;
  email?: string;
  avatarOptions?: {
    value: string;
    label?: string;
  }[];
}

export default function ProfileEditorForm({
  initialData,
  onSubmit,
  onSuccess,
  onError,
  isLoading,
  avatarOptions = [],
}: ProfileEditorFormProps) {
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileValidationSchema),
    defaultValues: {
      username: initialData?.username || "",
      display_name: initialData?.display_name || "",
      avatar_url: initialData?.avatar_url || "",
    },
  });

  const onSubmitHandler = async (data: ProfileFormData) => {
    try {
      // Clean up optional empty strings
      const cleanedData: BaseProfile = {
        username: data.username,
        display_name: data.display_name || null,
        avatar_url: data.avatar_url || null,
      };

      await onSubmit(cleanedData);
      onSuccess?.(cleanedData);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to save profile");
      form.setError("root", {
        type: "manual",
        message: error.message,
      });
      onError?.(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-6">
        <FormField
          control={form.control}
          name="avatar_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avatar</FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                  {field.value ? (
                    isBoringAvatarUrl(field.value) ? (
                      <BoringAvatar
                        name={field.value.slice(5)}
                        variant="beam"
                        size={80}
                        colors={BORING_AVATAR_COLORS}
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={field.value}
                        alt="Avatar"
                        className="size-20 min-w-20 rounded-full border"
                      />
                    )
                  ) : (
                    <BoringAvatar
                      name={""}
                      variant="beam"
                      size={64}
                      colors={BORING_AVATAR_COLORS}
                    />
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setAvatarModalOpen(true)}
                    disabled={isLoading}
                  >
                    Choose Avatar
                  </Button>
                  <AvatarSelectionModal
                    open={avatarModalOpen}
                    onOpenChange={setAvatarModalOpen}
                    email={field.value || ""}
                    currentAvatarUrl={field.value || ""}
                    avatarOptions={avatarOptions}
                    onSelect={field.onChange}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Username <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="juan_dela_cruz"
                  disabled={isLoading}
                  {...field}
                  onChange={(e) => field.onChange(e.target.value.toLowerCase())}
                />
              </FormControl>
              <FormDescription>
                2-32 characters: lowercase letters, numbers, underscores,
                dashes, periods. Cannot start/end with period or have
                consecutive periods.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="display_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Name</FormLabel>
              <FormControl>
                <Input placeholder="Juan D." disabled={isLoading} {...field} />
              </FormControl>
              <FormDescription>1-32 characters.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </Form>
  );
}
