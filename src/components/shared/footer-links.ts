export const FOOTER_LINK_GROUPS = [
  {
    label: "Games",
    links: [
      { href: "/play", label: "Saltong" },
      { href: "/play/mini", label: "Mini" },
      { href: "/play/max", label: "Max" },
      { href: "/play/hex", label: "Hex" },
      { href: "/play/sudoku", label: "Sudoku" },
      { href: "/play/mathinik", label: "Mathinik" },
    ],
  },
  {
    label: "Explore",
    links: [{ href: "/patch-notes", label: "Patch Notes" }],
  },
  {
    label: "Project",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/contribute", label: "Contribute" },
    ],
  },
  {
    label: "Legal",
    links: [
      { href: "/policies/privacy", label: "Privacy" },
      { href: "/policies/terms", label: "Terms" },
      { href: "/policies/cookies", label: "Cookies" },
    ],
  },
] as const;
