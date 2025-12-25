import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Share2, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TestResultItem {
  testType: string;
  testName: string;
  summary: string;
  completedAt?: string;
  userTestId?: string;
}

interface JourneyResultsSummaryProps {
  results: TestResultItem[];
  onViewResult: (userTestId: string) => void;
  onShareResult: (result: TestResultItem) => void;
}

export function JourneyResultsSummary({ 
  results, 
  onViewResult, 
  onShareResult 
}: JourneyResultsSummaryProps) {
  if (results.length === 0) return null;

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <Trophy className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base md:text-lg">Seus Resultados</CardTitle>
            <CardDescription className="text-xs md:text-sm">
              {results.length} teste{results.length > 1 ? "s" : ""} concluído{results.length > 1 ? "s" : ""}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid gap-3 sm:grid-cols-2">
          {results.map((result) => (
            <div
              key={result.testType}
              className="flex flex-col gap-2 p-3 bg-card/50 border border-border rounded-lg hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-medium text-muted-foreground truncate">
                    {result.testName}
                  </h4>
                  <p className="text-sm font-semibold text-foreground truncate">
                    {result.summary}
                  </p>
                  {result.completedAt && (
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Concluído {formatDistanceToNow(new Date(result.completedAt), { 
                        addSuffix: true, 
                        locale: ptBR 
                      })}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {result.userTestId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs flex-1"
                    onClick={() => onViewResult(result.userTestId!)}
                  >
                    <Eye className="w-3.5 h-3.5 mr-1" />
                    Ver
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs flex-1"
                  onClick={() => onShareResult(result)}
                >
                  <Share2 className="w-3.5 h-3.5 mr-1" />
                  Compartilhar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
