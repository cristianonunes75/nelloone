import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowRight, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResultsFloatingMenuProps {
  basePath: string;
  onShare?: () => void;
  onContinue?: () => void;
  showContinue?: boolean;
  className?: string;
}

export function ResultsFloatingMenu({
  basePath,
  onShare,
  onContinue,
  showContinue = true,
  className,
}: ResultsFloatingMenuProps) {
  const navigate = useNavigate();

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 flex flex-col gap-2 items-end",
        className
      )}
    >
      {/* Share button */}
      {onShare && (
        <Button
          size="icon"
          variant="outline"
          onClick={onShare}
          className="h-12 w-12 rounded-full shadow-lg bg-background/95 backdrop-blur-sm border-border hover:bg-accent"
          title="Compartilhar"
        >
          <Share2 className="h-5 w-5" />
        </Button>
      )}

      {/* Continue journey button */}
      {showContinue && onContinue && (
        <Button
          size="icon"
          variant="default"
          onClick={onContinue}
          className="h-12 w-12 rounded-full shadow-lg"
          title="Próximo teste"
        >
          <ArrowRight className="h-5 w-5" />
        </Button>
      )}

      {/* Back to Cliente */}
      <Button
        size="icon"
        variant="secondary"
        onClick={() => navigate(`${basePath}/cliente`)}
        className="h-14 w-14 rounded-full shadow-xl border border-border"
        title="Área do Cliente"
      >
        <Home className="h-6 w-6" />
      </Button>
    </div>
  );
}
