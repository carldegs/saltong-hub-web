import { cva } from "class-variance-authority";

export const playPageBackgroundVariants = cva("bg-linear-to-br", {
  variants: {
    colorScheme: {
      green:
        "from-saltong-green-50 via-background to-saltong-green-100/40 dark:from-saltong-green-950/30 dark:via-background dark:to-background",
      purple:
        "from-saltong-purple-50 via-background to-saltong-purple-100/40 dark:from-saltong-purple-950/30 dark:via-background dark:to-background",
      blue: "from-saltong-blue-50 via-background to-saltong-blue-100/40 dark:from-saltong-blue-950/30 dark:via-background dark:to-background",
      red: "from-saltong-red-50 via-background to-saltong-red-100/40 dark:from-saltong-red-950/30 dark:via-background dark:to-background",
      orange:
        "from-saltong-orange-50 via-background to-saltong-orange-100/40 dark:from-saltong-orange-950/30 dark:via-background dark:to-background",
      teal: "from-saltong-teal-50 via-background to-saltong-teal-100/40 dark:from-saltong-teal-950/30 dark:via-background dark:to-background",
    },
  },
});
