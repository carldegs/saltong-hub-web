export const HEX_HOW_TO_PLAY_COPY = {
  rules: [
    "Words must be at least four letters long.",
    "Words must contain the center letter.",
    "You may reuse letters as often as you need.",
    "Proper nouns, hyphenated terms, or obscene words are filtered out of the official list.",
    "Duplicate submissions don't add points.",
  ],
  scoring: [
    "4-letter words are worth 1 point.",
    "Longer words earn 1 point per letter (e.g., MANONG = 6 pts).",
    "Pangrams add an extra 7 points on top of their length.",
  ],
  pangramExplanation:
    "A pangram uses every letter in the puzzle, including the center letter.",
  example: {
    letters: "K T O R E S P",
    centerLetter: "O",
    entries: [
      {
        word: "KESO",
        pointsLabel: "1 pt.",
        description: "is worth 1 pt.",
        guideDescription: "A four-letter word earns 1 point.",
      },
      {
        word: "TORPE",
        pointsLabel: "5 pts.",
        description: "is worth 5 pts.",
        guideDescription: "A five-letter word earns 5 points.",
      },
      {
        word: "EKSPORT",
        pointsLabel: "14 pts.",
        description:
          "is worth 14 pts because it's 7 letters long and a pangram.",
        guideDescription:
          "Its seven letters earn 7 points, plus 7 more for the pangram.",
      },
      {
        word: "EKSPERTO",
        pointsLabel: "15 pts.",
        description: "is worth 15 pts.",
        guideDescription:
          "Its eight letters earn 8 points, plus 7 for the pangram.",
      },
    ],
  },
} as const;
