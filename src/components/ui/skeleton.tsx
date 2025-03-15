
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gradient-to-r from-yellow-100/50 via-orange-200/50 to-yellow-100/50 dark:from-yellow-900/20 dark:via-orange-800/20 dark:to-yellow-900/20 bg-[length:200%_100%] animate-[loading_2s_ease-in-out_infinite]",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
