import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function AnalysisSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <Card className="bg-[#5a6088]/80 border-[#a8c5db]/30">
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <Skeleton className="h-4 w-4/5" />
               <div className="flex gap-2">
                <Skeleton className="h-12 w-36 rounded-lg" />
                <Skeleton className="h-12 w-36 rounded-lg" />
               </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
