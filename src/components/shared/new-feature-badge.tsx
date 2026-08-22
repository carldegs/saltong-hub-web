import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

const NewFeatureBadge = ({ className }: { className?: string }) => {
  return (
    <Badge
      className={cn(
        "ml-2 bg-blue-200 py-[1px] text-[0.6rem] text-blue-800 hover:bg-blue-400 hover:text-white",
        className
      )}
    >
      NEW
    </Badge>
  );
};
export default NewFeatureBadge;
