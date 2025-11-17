import {
  Card,
  CardContent,
  CardDescription,
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ListIcon } from "lucide-react";
import { buildCharsetMask } from "../../utils";
import { HexRound } from "../../types";

interface RecentRoundsTableProps {
  rounds: HexRound[];
  onViewWords?: (round: HexRound) => void;
}

export function RecentRoundsTable({
  rounds,
  onViewWords,
}: RecentRoundsTableProps) {
  return (
    <Card className="flex h-full flex-col lg:min-w-[400px]">
      <CardHeader>
        <CardTitle>Recent Rounds</CardTitle>
        <CardDescription>
          Last {rounds.length} rounds in the database
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 p-0">
        <ScrollArea className="h-full max-h-[calc(100vh-200px)]">
          <Table>
            <TableHeader className="bg-background sticky top-0 [&>tr>th:first-child]:pl-6 [&>tr>th:last-child]:pr-6">
              <TableRow>
                <TableHead className="w-28">Round</TableHead>
                <TableHead className="w-36">Date</TableHead>
                <TableHead>Root Word</TableHead>
                <TableHead>Center Letter</TableHead>
                <TableHead>Word ID</TableHead>
                {onViewWords && <TableHead className="w-24">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody className="[&>tr>td:first-child]:pl-6 [&>tr>td:last-child]:pr-6">
              {rounds.map((r) => {
                const computedWordId =
                  r.wordId ??
                  (r.rootWord ? buildCharsetMask(r.rootWord) : null);
                return (
                  <TableRow key={`${r.date}`}>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        #{r.roundId}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="tabular-nums">{r.date}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono font-medium tracking-wide uppercase">
                        {r.rootWord}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono font-medium tracking-wide uppercase">
                        {r.centerLetter}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground font-mono text-xs">
                        {computedWordId ?? "-"}
                      </span>
                    </TableCell>
                    {onViewWords && (
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewWords(r)}
                          title="View words"
                        >
                          <ListIcon className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
              {!rounds.length && (
                <TableRow>
                  <TableCell
                    colSpan={onViewWords ? 6 : 5}
                    className="text-muted-foreground h-32 text-center"
                  >
                    No rounds found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
