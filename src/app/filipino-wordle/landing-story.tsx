import { FILIPINO_WORDLE_LANDING_COPY } from "./copy";

export function LandingStory() {
  return (
    <div className="mt-8 border-t pt-6">
      <h2 className="text-lg font-bold">How Saltong began</h2>
      <p className="text-muted-foreground mt-2">
        {FILIPINO_WORDLE_LANDING_COPY.history}
      </p>
    </div>
  );
}
