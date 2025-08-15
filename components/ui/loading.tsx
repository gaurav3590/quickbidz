import { cn } from "@/lib/utils";

interface LoadingProps {
  fullScreen?: boolean;
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export function Loading({
  fullScreen = false,
  size = "md",
  text,
  className,
}: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const containerClasses = cn(
    "flex items-center justify-center",
    fullScreen ? "min-h-screen" : "min-h-[200px]",
    className
  );

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center gap-2">
        <div
          className={cn(
            "animate-spin rounded-full border-t-2 border-b-2 border-primary",
            sizeClasses[size]
          )}
        />
        {text && <p className="text-sm text-muted-foreground">{text}</p>}
      </div>
    </div>
  );
}
