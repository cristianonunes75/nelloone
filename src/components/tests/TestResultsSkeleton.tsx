import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface TestResultsSkeletonProps {
  stage: "test" | "answers" | "calculating";
}

const stageMessages = {
  test: "Carregando informações do teste...",
  answers: "Carregando suas respostas...",
  calculating: "Calculando seu resultado..."
};

export function TestResultsSkeleton({ stage }: TestResultsSkeletonProps) {
  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6 animate-in fade-in duration-500">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-44" />
        </div>
      </div>

      {/* Progress indicator */}
      <div className="flex flex-col items-center gap-3 py-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
          <span className="text-sm text-muted-foreground">{stageMessages[stage]}</span>
        </div>
        <div className="flex gap-1">
          <div className={`h-1.5 w-8 rounded-full transition-colors ${stage === "test" ? "bg-primary" : "bg-muted"}`} />
          <div className={`h-1.5 w-8 rounded-full transition-colors ${stage === "answers" ? "bg-primary" : stage === "calculating" ? "bg-primary" : "bg-muted"}`} />
          <div className={`h-1.5 w-8 rounded-full transition-colors ${stage === "calculating" ? "bg-primary" : "bg-muted"}`} />
        </div>
      </div>

      {/* Main card skeleton */}
      <Card>
        <CardHeader className="bg-primary/10">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div>
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4 mt-1" />
          </div>
          <div className="border-t pt-4">
            <Skeleton className="h-5 w-28 mb-4" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Skeleton className="h-3 w-24 mb-1" />
                <Skeleton className="h-8 w-12" />
              </div>
              <div>
                <Skeleton className="h-3 w-20 mb-1" />
                <Skeleton className="h-8 w-10" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results card skeleton */}
      <Card className="border-none shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 pb-8">
          <div className="text-center space-y-4">
            <Skeleton className="h-14 w-14 rounded-full mx-auto" />
            <Skeleton className="h-8 w-48 mx-auto" />
            <Skeleton className="h-5 w-64 mx-auto" />
          </div>
        </CardHeader>
        <CardContent className="pt-8 space-y-6">
          <div className="space-y-2 max-w-2xl mx-auto">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4 mx-auto" />
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-8 w-24 rounded-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
