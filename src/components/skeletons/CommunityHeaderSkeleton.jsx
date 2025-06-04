import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CommunityHeaderSkeleton = () => {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-24 w-full bg-gradient-to-r from-gray-300 to-gray-400 dark:from-zinc-700 dark:to-zinc-800" />
      
      <div className="p-4 flex items-start">
        <div className="relative -mt-12 mr-4">
          <Skeleton className="h-16 w-16 rounded-full border-4 border-white dark:border-zinc-900" />
        </div>
        
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <div className="flex items-center">
                <Skeleton className="h-8 w-40 mb-2" />
                <Skeleton className="h-5 w-16 ml-2" />
              </div>
              <Skeleton className="h-4 w-24" />
            </div>
            
            <div className="mt-3 sm:mt-0">
              <Skeleton className="h-10 w-28" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CommunityHeaderSkeleton;
