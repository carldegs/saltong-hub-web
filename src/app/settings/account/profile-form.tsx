"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface ProfileFormProps {
  username: string;
  avatarUrl: string;
  email: string;
  avatarOptions: {
    value: string;
    label?: string;
  }[];
}

export default function ProfileForm({
  username: initialUsername,
  avatarUrl: initialAvatarUrl,
  email,
  avatarOptions,
}: ProfileFormProps) {
  const [username, setUsername] = React.useState(initialUsername);
  const [avatarUrl, setAvatarUrl] = React.useState(initialAvatarUrl);

  // TODO: Add save logic to update profile
  return (
    <form className="flex items-center gap-8">
      {(!!avatarUrl || avatarOptions?.length) && (
        <div className="flex flex-col items-center gap-4">
          <Select value={avatarUrl} onValueChange={setAvatarUrl}>
            <SelectTrigger className="h-20 w-32">
              <SelectValue>
                <div className="flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={avatarUrl}
                    alt="avatar"
                    className="size-18 rounded-full border"
                  />
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {avatarOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={option.value}
                      alt="avatar"
                      className="size-6 rounded-full border"
                    />
                    <span className="truncate">
                      {option.label ?? option.value}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="username" className="text-sm font-medium">
            Username
          </Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <Input id="email" value={email} disabled className="bg-muted/50" />
        </div>
      </div>
      {/* Add save button and logic as needed */}
    </form>
  );
}
