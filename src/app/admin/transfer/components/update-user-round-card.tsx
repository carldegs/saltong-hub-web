"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SALTONG_MODES } from "@/features/saltong/constants";
import { SaltongMode } from "@/features/saltong/types";

type UpdateUserRoundFormState = {
  userIdentifier: string;
  mode: SaltongMode;
  roundDate: string;
  roundId: string;
  prescribedAnswer: string;
  notes: string;
};

const DEFAULT_FORM_STATE: UpdateUserRoundFormState = {
  userIdentifier: "",
  mode: "classic",
  roundDate: "",
  roundId: "",
  prescribedAnswer: "",
  notes: "",
};

export default function UpdateUserRoundCard() {
  const [formState, setFormState] = useState(DEFAULT_FORM_STATE);
  const [isPending, startTransition] = useTransition();

  const handleChange = <K extends keyof UpdateUserRoundFormState>(
    key: K,
    value: UpdateUserRoundFormState[K]
  ) => {
    setFormState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(() => {
      // TODO: Replace this console log with a Supabase mutation when wiring up the API.
      console.info("Requested saltong-user-round update", formState);
    });
  };

  const handleReset = () => setFormState(DEFAULT_FORM_STATE);

  const canSubmit = Boolean(
    formState.userIdentifier.trim() && formState.roundDate && formState.roundId
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Current Saltong Round</CardTitle>
        <CardDescription>
          Attach the user to a specific round when they run into corrupted or
          missing progress. The actual mutation will be added in a later step.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="userIdentifier">User identifier</Label>
            <Input
              id="userIdentifier"
              placeholder="UUID or email"
              value={formState.userIdentifier}
              onChange={(event) =>
                handleChange("userIdentifier", event.currentTarget.value)
              }
              autoComplete="off"
            />
            <p className="text-muted-foreground text-xs">
              Copy the UUID from Supabase or paste the user&apos;s email - we
              will resolve it when we hook up the API.
            </p>
          </div>

          <div className="grid gap-2">
            <Label>Game mode</Label>
            <Select
              value={formState.mode}
              onValueChange={(value) =>
                handleChange("mode", value as SaltongMode)
              }
            >
              <SelectTrigger id="mode">
                <SelectValue placeholder="Select a mode" />
              </SelectTrigger>
              <SelectContent>
                {SALTONG_MODES.map((mode) => (
                  <SelectItem key={mode} value={mode} className="capitalize">
                    {mode}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="roundDate">Round date</Label>
              <Input
                id="roundDate"
                type="date"
                value={formState.roundDate}
                onChange={(event) =>
                  handleChange("roundDate", event.currentTarget.value)
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="roundId">Round ID</Label>
              <Input
                id="roundId"
                type="number"
                inputMode="numeric"
                value={formState.roundId}
                onChange={(event) =>
                  handleChange("roundId", event.currentTarget.value)
                }
              />
              <p className="text-muted-foreground text-xs">
                Use the round ID from the master round list to keep things in
                sync with the vault.
              </p>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="prescribedAnswer">Target answer (optional)</Label>
            <Input
              id="prescribedAnswer"
              placeholder="ex. ASIM"
              value={formState.prescribedAnswer}
              onChange={(event) =>
                handleChange("prescribedAnswer", event.currentTarget.value)
              }
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Describe why this adjustment is needed."
              value={formState.notes}
              onChange={(event) =>
                handleChange("notes", event.currentTarget.value)
              }
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="ghost"
            className="w-full sm:w-auto"
            onClick={handleReset}
            disabled={isPending}
          >
            Reset
          </Button>
          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={!canSubmit || isPending}
          >
            {isPending ? "Queuing request..." : "Save update"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
