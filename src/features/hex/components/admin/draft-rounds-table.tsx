import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  Sparkles,
  RefreshCw,
  ListIcon,
  Hash,
  AlertCircle,
} from "lucide-react";
import { getCharSet } from "../../utils";
import { DraftHexRound } from "../../hooks/draft-rounds";

interface DraftRoundsTableProps {
  drafts: DraftHexRound[];
  isGenerating: boolean;
  isSubmitting: boolean;
  onGenerate: (count: number) => void;
  onRegenerateRound: (index: number) => void;
  onViewWords: (round: DraftHexRound) => void;
  onClearAll: () => void;
  onSubmit: () => void;
}

export function DraftRoundsTable({
  drafts,
  isGenerating,
  isSubmitting,
  onGenerate,
  onRegenerateRound,
  onViewWords,
  onClearAll,
  onSubmit,
}: DraftRoundsTableProps) {
  const [count, setCount] = useState<number>(0);
  const MAX_ROUNDS = 200;
  const hasDrafts = drafts.length > 0;

  return (
    <Card
      className={`flex shrink-0 flex-col ${hasDrafts ? "min-h-0 flex-1" : ""}`}
    >
      <CardHeader>
        {hasDrafts ? (
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Preview Selected Rounds
              </CardTitle>
              <CardDescription>
                Review and adjust before confirming
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="gap-1">
                <Hash className="h-3 w-3" />
                {drafts.length} rounds
              </Badge>
            </div>
          </div>
        ) : (
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-5 w-5" />
            Generate Rounds
          </CardTitle>
        )}
      </CardHeader>
      <CardContent className={hasDrafts ? "pt-0 pb-3" : "pt-0 pb-3"}>
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
      {hasDrafts && (
        <>
          <Separator />
          <CardContent className="min-h-0 flex-1 p-0">
            <ScrollArea className="h-full">
              <Table>
                <TableHeader className="bg-background sticky top-0 [&>tr>th:first-child]:pl-6 [&>tr>th:last-child]:pr-6">
                  <TableRow>
                    <TableHead className="w-20">Round</TableHead>
                    <TableHead className="w-28">Date</TableHead>
                    <TableHead>Word ID</TableHead>
                    <TableHead>Root Word</TableHead>
                    <TableHead>Center</TableHead>
                    <TableHead className="w-16">Words</TableHead>
                    <TableHead className="w-16">Pangrams</TableHead>
                    <TableHead className="w-16">Letters</TableHead>
                    <TableHead className="w-32">Difficulty</TableHead>
                    <TableHead className="w-24 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="[&>tr>td:first-child]:pl-6 [&>tr>td:last-child]:pr-6">
                  {drafts.map((d, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Badge variant="secondary" className="font-mono">
                          #{d.roundId}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm tabular-nums">
                        {d.date}
                      </TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">
                        {d.wordId}
                      </TableCell>
                      <TableCell>
                        <span className="font-mono font-medium tracking-wide uppercase">
                          {d.rootWord}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono font-medium tracking-wide uppercase">
                          {d.centerLetter}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm tabular-nums">
                        {d.numWords ?? "-"}
                      </TableCell>
                      <TableCell className="text-sm tabular-nums">
                        {d.numPangrams ?? "-"}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm tabular-nums">
                        {d.rootWord ? getCharSet(d.rootWord).length : "-"}
                      </TableCell>
                      <TableCell>
                        {d.score !== undefined ? (
                          <Badge
                            variant={
                              d.score === 0
                                ? "destructive"
                                : d.score <= 2
                                  ? "default"
                                  : d.score === 3
                                    ? "secondary"
                                    : "outline"
                            }
                            className={`gap-1.5 ${
                              d.score === 0
                                ? "bg-red-500 hover:bg-red-600"
                                : d.score <= 2
                                  ? "bg-green-500 hover:bg-green-600"
                                  : d.score === 3
                                    ? "text-foreground bg-yellow-500 hover:bg-yellow-600"
                                    : "border-orange-500 bg-orange-500 text-white hover:bg-orange-600"
                            }`}
                          >
                            <div className="flex gap-0.5">
                              {Array.from({ length: 5 }).map((_, idx) => (
                                <div
                                  key={idx}
                                  className={`h-2 w-1 rounded-full ${
                                    idx < d.score!
                                      ? "bg-current"
                                      : "bg-current opacity-20"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs font-medium">
                              {d.score}/5
                            </span>
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="gap-1.5 opacity-50"
                          >
                            <div className="flex gap-0.5">
                              {Array.from({ length: 5 }).map((_, idx) => (
                                <div
                                  key={idx}
                                  className="h-2 w-1 rounded-full bg-current opacity-20"
                                />
                              ))}
                            </div>
                            <span className="text-xs font-medium">-/5</span>
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => onViewWords(d)}
                            className="h-8 w-8"
                            title="View words"
                          >
                            <ListIcon className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => onRegenerateRound(i)}
                            className="h-8 w-8"
                            title="Regenerate"
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
          <Separator />
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={onClearAll}>
              Cancel
            </Button>
            <Button
              onClick={onSubmit}
              disabled={isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                `Submit ${drafts.length} Round${drafts.length !== 1 ? "s" : ""}`
              )}
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
