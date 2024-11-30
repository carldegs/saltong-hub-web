import { Button } from "@/components/ui/button";
import { DeleteIcon, ShuffleIcon, PlayIcon } from "lucide-react";
import { HexRound } from "../types";
import HexGrid from "./hex-grid";
import useHexStore from "../hooks/useHexStore";

export default function HexKeyboard({
  centerLetter,
  onSubmit,
  onChange,
}: Pick<HexRound, "rootWord" | "centerLetter"> & {
  onSubmit: () => void;
  onChange: (event: KeyboardEvent | { key: string }) => void;
}) {
  const { letters, shuffleLetters } = useHexStore((store) => store);

  return (
    <div className="flex flex-col">
      <HexGrid
        letters={letters}
        centerLetter={centerLetter!}
        onClick={(letter) => {
          onChange({ key: letter });
        }}
      />
      <div className="mt-4 flex justify-center gap-4">
        <Button
          size="icon"
          className="rounded-full"
          onClick={() => {
            onChange({ key: "Backspace" });
          }}
        >
          <DeleteIcon size={16} />
        </Button>
        <Button size="icon" className="rounded-full" onClick={shuffleLetters}>
          <ShuffleIcon size={16} />
        </Button>
        <Button size="icon" className="rounded-full" onClick={onSubmit}>
          <PlayIcon size={16} />
        </Button>
      </div>
    </div>
  );
}
