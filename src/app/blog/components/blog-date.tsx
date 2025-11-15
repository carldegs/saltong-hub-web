import { Calendar } from "lucide-react";
import { formatDate } from "../utils";

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
  const { display, full } = formatDate(date, true);

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
