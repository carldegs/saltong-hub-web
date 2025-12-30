import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, Hash, PlayIcon, ChevronDown } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { HexLookupTableItem } from "../../types";
import { LookupTableMetadata } from "../../queries/hex-lookup-table";
import { HEX_CONFIG } from "../../config";

interface LookupTableCardProps {
  filteredLookupTable: HexLookupTableItem[];
  metadata: LookupTableMetadata | null;
  isLoadingMetadata: boolean;
  isRegenerating: boolean;
  onRegenerate: () => void;
  onRefetchMetadata: () => void;
}

export function LookupTableCard({
  filteredLookupTable,
  metadata,
  isLoadingMetadata,
  isRegenerating,
  onRegenerate,
  onRefetchMetadata,
}: LookupTableCardProps) {
  const [showLookupPreview, setShowLookupPreview] = useState(false);

  return (
    <Card className="shrink-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Hash className="h-5 w-5" />
          Hex Lookup Table
        </CardTitle>
        <CardDescription>
          Regenerate the hex lookup table from all dictionaries
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 pb-3">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="outline"
              className="h-9 gap-2"
              disabled={isRegenerating || isLoadingMetadata}
              onClick={onRegenerate}
            >
              {isRegenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <PlayIcon className="h-4 w-4" />
                  Regenerate
                </>
              )}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-9 gap-2"
              disabled={isLoadingMetadata}
              onClick={onRefetchMetadata}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <div className="text-muted-foreground flex-1 text-xs">
              {metadata?.status === "completed" && metadata.completedAt && (
                <div>
                  <div>
                    Generated{" "}
                    {formatDistanceToNow(new Date(metadata.completedAt), {
                      addSuffix: true,
                    })}
                    {metadata.recordCount && (
                      <span className="text-muted-foreground/70">
                        {" "}
                        ({metadata.recordCount.toLocaleString()})
                      </span>
                    )}
                  </div>
                  <div className="text-muted-foreground/70 mt-0.5">
                    Limit: ≤{HEX_CONFIG.numWordsLimit} words · Pangram:{" "}
                    {HEX_CONFIG.minPangramLetters}–
                    {HEX_CONFIG.maxPangramLetters} · List:{" "}
                    {HEX_CONFIG.minWordListLetters}–
                    {HEX_CONFIG.maxWordListLetters}
                  </div>
                </div>
              )}
              {metadata?.status === "generating" && (
                <span>Generating lookup table...</span>
              )}
              {metadata?.status === "error" && (
                <span className="text-destructive">
                  Error: {metadata.error}
                </span>
              )}
              {!metadata && <span>Never generated</span>}
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="h-9 gap-2"
              onClick={() => setShowLookupPreview(!showLookupPreview)}
            >
              {showLookupPreview ? "Hide" : "Show"} Preview
              <ChevronDown
                className={`h-4 w-4 transition-transform ${showLookupPreview ? "rotate-180" : ""}`}
              />
            </Button>
          </div>
          {showLookupPreview && (
            <>
              <div className="text-muted-foreground text-xs">
                {filteredLookupTable.length} available (excluding recent rounds)
              </div>
              {filteredLookupTable.length > 0 ? (
                <ScrollArea className="h-[250px]">
                  <Table>
                    <TableHeader className="bg-background sticky top-0 [&>tr>th:first-child]:pl-6 [&>tr>th:last-child]:pr-6">
                      <TableRow>
                        <TableHead>Word ID</TableHead>
                        <TableHead>Center</TableHead>
                        <TableHead>Words</TableHead>
                        <TableHead>Pangrams</TableHead>
                        <TableHead>Root</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="[&>tr>td:first-child]:pl-6 [&>tr>td:last-child]:pr-6">
                      {filteredLookupTable.slice(0, 100).map((row, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-mono text-xs">
                            {row.wordId}
                          </TableCell>
                          <TableCell className="font-mono">
                            {row.centerLetter.toUpperCase()}
                          </TableCell>
                          <TableCell>{row.numWords}</TableCell>
                          <TableCell>{row.numPangrams}</TableCell>
                          <TableCell className="font-mono">
                            {row.rootWord?.toUpperCase() ?? ""}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              ) : (
                <div className="text-muted-foreground flex h-20 items-center justify-center text-sm">
                  No lookup table data available.
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
