import { Skeleton } from "./ui/skeleton";

function LoadingSkeleton() {
  return (
    <div>
      <div className="space-y-2">
        <Skeleton className="w-full h-4 md:h-6" />
        <Skeleton className="w-[80%] h-4 md:h-6" />
        <Skeleton className="w-[60%] h-4 md:h-6" />
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 mt-4">
        <Skeleton className="w-full max-w-64 h-6 md:h-8" />
        <Skeleton className="w-full max-w-64 h-6 md:h-8" />
      </div>
    </div>
  );
}

export default LoadingSkeleton;
