export const FILIPINO_WORDLE_LANDING_COPY = {
  title: "Saltong Hub: Daily Filipino Word Games",
  description:
    "Discover daily Filipino word games from Saltong Hub, including Saltong, Saltong Mini, Saltong Max, and Saltong Hex.",
  hero: "Discover Filipino Word Games on Saltong Hub",
  introduction:
    "Play a fresh Filipino word game every day with Saltong, Saltong Mini, Saltong Max, and Saltong Hex.",
  searchCopy:
    "Looking for a Filipino Wordle, Tagalog Wordle, or Filipino Spelling Bee? Saltong Hub is a collection of independent daily Filipino word games with a fresh puzzle to solve every day.",
  history:
    "Saltong Hub is home to a collection of daily Filipino word games. I created Saltong during COVID while I was stuck in my room. Inspired by Wordle, I wanted to make that shared daily ritual feel Filipino. Saltong Hex later added a Filipino word-finding challenge inspired by the Spelling Bee format. What began as a tiny personal project has grown into a community of more than 650,000 players and over 12 million pageviews.",
  independenceNotice:
    "Saltong Hub is independently created and is not affiliated with or endorsed by Wordle, Spelling Bee, or The New York Times.",
  playLabel: "Play Saltong",
} as const;

export const LANDING_GAMES = [
  {
    name: "Saltong",
    href: "/play",
    icon: "/main.svg",
    color: "green",
  },
  {
    name: "Saltong Mini",
    href: "/play/mini",
    icon: "/mini.svg",
    color: "blue",
  },
  {
    name: "Saltong Max",
    href: "/play/max",
    icon: "/max.svg",
    color: "red",
  },
  {
    name: "Saltong Hex",
    href: "/play/hex",
    icon: "/hex.svg",
    color: "purple",
  },
] as const;
