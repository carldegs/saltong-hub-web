import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, AlertCircle } from "lucide-react";

interface GeneratorCardProps {
  isGenerating: boolean;
  onGenerate: (count: number) => void;
}

export function GeneratorCard({
  isGenerating,
  onGenerate,
}: GeneratorCardProps) {
  const [count, setCount] = useState<number>(0);
  const MAX_ROUNDS = 200;

  return (
    <Card className="shrink-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-5 w-5" />
          Generate Rounds
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-3">
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <Input
              type="number"
              min={1}
              max={MAX_ROUNDS}
              value={count || ""}
              onChange={(e) => setCount(parseInt(e.target.value || "0", 10))}
              placeholder={`Number of rounds (max ${MAX_ROUNDS})`}
              className={`h-9 ${count > MAX_ROUNDS ? "border-destructive" : ""}`}
            />
            {count > MAX_ROUNDS && (
              <p className="text-destructive mt-1 flex items-center gap-1 text-xs">
                <AlertCircle className="h-3 w-3" />
                Maximum {MAX_ROUNDS} rounds allowed
              </p>
            )}
          </div>
          <Button
            size="sm"
            className="h-9 gap-2"
            disabled={!count || count > MAX_ROUNDS || isGenerating}
            onClick={() => onGenerate(count)}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                AI Scoring...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate with AI
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
