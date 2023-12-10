import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    (<div
      className={cn("animate-pulse rounded-md bg-gray-500 dark:bg-gray-900", className)}
      {...props} />)
  );
}

export { Skeleton }
