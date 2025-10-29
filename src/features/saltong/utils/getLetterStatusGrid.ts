import { LetterStatus } from "../types";

export function getLetterStatusGrid({
  gridStr,
  word,
  wordLen,
}: {
  gridStr: string;
  word: string;
  wordLen: number;
}) {
  const guessList = gridStr.match(new RegExp(`.{1,${wordLen}}`, "g")) || [];
  let finalResults = "";

  for (let i = 0; i < guessList.length; i++) {
    const guess = guessList[i];
    const result = Array(wordLen).fill(LetterStatus.Incorrect);

    const answerLetters: (string | null)[] = word.split("");
    const guessLetters: (string | null)[] = guess.split("");

    // check for correct letters
    for (let j = 0; j < wordLen; j++) {
      if (answerLetters[j] === guessLetters[j]) {
        result[j] = LetterStatus.Correct;
        answerLetters[j] = null;
        guessLetters[j] = null;
      }
    }

    // check for partial letters
    for (let j = 0; j < wordLen; j++) {
      if (guessLetters[j] === null) {
        continue;
      }

      const index = answerLetters.indexOf(guessLetters[j]);

      if (index !== -1) {
        result[j] = LetterStatus.Partial;
        answerLetters[index] = null;
      }
    }

    finalResults += result.join("");
  }

  return finalResults;
}
