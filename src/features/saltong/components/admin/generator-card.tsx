import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";
import { ADMIN_CONSTANTS } from "../../constants";

interface GeneratorCardProps {
  isGenerating: boolean;
  isDictLoading: boolean;
  onGenerate: (count: number) => void;
}

export function GeneratorCard({
  isGenerating,
  isDictLoading,
  onGenerate,
}: GeneratorCardProps) {
  const [count, setCount] = useState<number>(0);

  const isCountValid =
    count > 0 && count <= ADMIN_CONSTANTS.MAX_ROUNDS_PER_GENERATION;

  const handleGenerate = () => {
    if (isCountValid) {
      onGenerate(count);
    }
  };

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
              max={ADMIN_CONSTANTS.MAX_ROUNDS_PER_GENERATION}
              value={count || ""}
              onChange={(e) => setCount(parseInt(e.target.value || "0", 10))}
              placeholder={`Number of rounds (max ${ADMIN_CONSTANTS.MAX_ROUNDS_PER_GENERATION})`}
              className={`h-9 ${count > ADMIN_CONSTANTS.MAX_ROUNDS_PER_GENERATION ? "border-destructive" : ""}`}
            />
            {count > ADMIN_CONSTANTS.MAX_ROUNDS_PER_GENERATION && (
              <p className="text-destructive mt-1 flex items-center gap-1 text-xs">
                <AlertCircle className="h-3 w-3" />
                Maximum {ADMIN_CONSTANTS.MAX_ROUNDS_PER_GENERATION} rounds
                allowed
              </p>
            )}
          </div>
          <Button
            size="sm"
            className="h-9 gap-2"
            disabled={!isCountValid || isGenerating || isDictLoading}
            onClick={handleGenerate}
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
