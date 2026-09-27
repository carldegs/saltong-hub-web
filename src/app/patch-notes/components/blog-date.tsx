import { Calendar } from "lucide-react";
import { format, formatDistanceToNow, differenceInDays } from "date-fns";

interface BlogDateProps {
  date: string;
  showIcon?: boolean;
  className?: string;
  iconSize?: number;
}

export function BlogDate({
  date,
  showIcon = true,
  className = "",
  iconSize = 14,
}: BlogDateProps) {
  const targetDate = new Date(date);
  const full = format(targetDate, "MMMM d, yyyy");
  const display =
    differenceInDays(new Date(), targetDate) <= 7
      ? formatDistanceToNow(targetDate, {
          addSuffix: true,
          includeSeconds: true,
        })
      : full;

  return (
    <time
      dateTime={date}
      className={`flex items-center gap-1.5 ${className}`}
      title={full}
    >
      {showIcon && <Calendar size={iconSize} />}
      {display}
    </time>
  );
}
