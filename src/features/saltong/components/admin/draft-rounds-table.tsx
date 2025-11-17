import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Hash, Loader2, RefreshCw } from "lucide-react";
import { format, addDays, parse } from "date-fns";
import { DifficultyBadge } from "./difficulty-badge";
import { DraftRound } from "../../types";

interface DraftRoundsTableProps {
  drafts: DraftRound[];
  lastDate: string;
  nextRoundId: number;
  isSubmitting: boolean;
  onRegenerateWord: (index: number) => void;
  onClearAll: () => void;
  onSubmit: () => void;
}

export function DraftRoundsTable({
  drafts,
  lastDate,
  nextRoundId,
  isSubmitting,
  onRegenerateWord,
  onClearAll,
  onSubmit,
}: DraftRoundsTableProps) {
  if (drafts.length === 0) {
    return null;
  }

  return (
    <Card className="flex min-h-0 flex-1 flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Draft Rounds</CardTitle>
            <CardDescription>
              Starting{" "}
              {format(
                addDays(parse(lastDate, "yyyy-MM-dd", new Date()), 1),
                "MMM dd, yyyy"
              )}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="gap-1">
              <Hash className="h-3 w-3" />
              {nextRoundId}–{nextRoundId + drafts.length - 1}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 p-0">
        <ScrollArea className="h-full">
          <Table>
            <TableHeader className="bg-background sticky top-0 [&>tr>th:first-child]:pl-6 [&>tr>th:last-child]:pr-6">
              <TableRow>
                <TableHead className="w-20">Round</TableHead>
                <TableHead className="w-28">Date</TableHead>
                <TableHead>Word</TableHead>
                <TableHead className="w-32">Difficulty</TableHead>
                <TableHead className="w-20 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="[&>tr>td:first-child]:pl-6 [&>tr>td:last-child]:pr-6">
              {drafts.map((draft, index) => (
                <TableRow key={draft.date}>
                  <TableCell>
                    <Badge variant="secondary" className="font-mono">
                      #{draft.roundId}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm tabular-nums">
                    {draft.date}
                  </TableCell>
                  <TableCell>
                    <span className="font-mono font-medium tracking-wide uppercase">
                      {draft.word}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DifficultyBadge
                      score={draft.score}
                      explanation={draft.explanation}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onRegenerateWord(index)}
                      className="h-8 w-8"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </Button>
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
          Clear All
        </Button>
        <Button onClick={onSubmit} disabled={isSubmitting} className="gap-2">
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
    </Card>
  );
}
