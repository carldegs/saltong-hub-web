"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef } from "react";
import { createGroupAction } from "../actions";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";

const createGroupFormSchema = z.object({
  name: z.string().min(3).max(50),
});

type CreateGroupFormData = z.infer<typeof createGroupFormSchema>;

export default function CreateGroupForm() {
  const router = useRouter();
  const form = useForm<CreateGroupFormData>({
    resolver: zodResolver(createGroupFormSchema),
    defaultValues: {
      name: "",
    },
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: CreateGroupFormData) => {
      return createGroupAction(data.name);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to create group"
      );
    },
    onSuccess: (data) => {
      router.push(`/groups/${data.group.id}`);
    },
  });

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="container grid h-[60dvh] w-full max-w-2xl flex-1 items-center gap-6 py-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => mutate(data))}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-2xl font-light">
                  Let&apos;s start by naming your group
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Group Name"
                    className="rounded-md py-6 text-3xl font-bold md:text-3xl"
                    {...field}
                    ref={inputRef}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            size="lg"
            className="mt-4 self-end"
            type="submit"
            disabled={isPending}
          >
            {isPending && <Loader2Icon className="animate-spin" />}
            {isPending ? "Creating..." : "Create Group"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
