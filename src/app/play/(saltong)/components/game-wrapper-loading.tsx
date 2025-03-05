"use client";

import Keyboard from "./keyboard";
import SaltongGrid from "./saltong-grid";

export default function GameWrapperLoading({
  maxTries,
  wordLen,
}: {
  maxTries: number;
  wordLen: number;
}) {
  return (
    <>
      <main className="my-6 flex h-full flex-grow flex-col items-center justify-center gap-8">
        <SaltongGrid maxTries={maxTries} wordLen={wordLen} isLoading />
      </main>
      <Keyboard status={{}} onKeyClick={() => {}} disabled />
    </>
  );
}
