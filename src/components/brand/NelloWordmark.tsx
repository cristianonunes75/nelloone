import { cn } from "@/lib/utils";

type WordmarkVariant = "nello-one" | "nello-one-mixed" | "nello" | "nello-dot-one";
type ColorVariant = "default" | "light" | "dark" | "mono-dark" | "mono-light";

interface NelloWordmarkProps {
  variant?: WordmarkVariant;
  colorVariant?: ColorVariant;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const NelloWordmark = ({
  variant = "nello-one",
  colorVariant = "default",
  size = "md",
  className
}: NelloWordmarkProps) => {
  const sizeStyles = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
    xl: "text-6xl"
  };

  const colorStyles = {
    default: {
      primary: "text-foreground",
      secondary: "text-muted-foreground"
    },
    light: {
      primary: "text-white",
      secondary: "text-white/60"
    },
    dark: {
      primary: "text-ink-deep",
      secondary: "text-ink-light"
    },
    "mono-dark": {
      primary: "text-ink-deep",
      secondary: "text-ink-deep"
    },
    "mono-light": {
      primary: "text-white",
      secondary: "text-white"
    }
  };

  const colors = colorStyles[colorVariant];

  const renderWordmark = () => {
    switch (variant) {
      case "nello-one":
        // NELLO ONE - Institucional
        return (
          <span className="font-sans tracking-wide">
            <span className={cn("font-bold", colors.primary)}>NELLO</span>
            <span className={cn("font-normal ml-[0.3em]", colors.secondary)}>ONE</span>
          </span>
        );
      
      case "nello-one-mixed":
        // Nello One - Social/Editorial
        return (
          <span className="font-sans tracking-normal">
            <span className={cn("font-semibold", colors.primary)}>Nello</span>
            <span className={cn("font-normal ml-[0.25em]", colors.secondary)}>One</span>
          </span>
        );
      
      case "nello":
        // NELLO - Avatar/App/Favicon
        return (
          <span className={cn("font-sans font-bold tracking-wide", colors.primary)}>
            NELLO
          </span>
        );
      
      case "nello-dot-one":
        // nello.one - Técnico/Rodapé
        return (
          <span className="font-sans tracking-normal">
            <span className={cn("font-medium", colors.primary)}>nello</span>
            <span className={cn("font-normal", colors.secondary)}>.one</span>
          </span>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={cn(sizeStyles[size], className)}>
      {renderWordmark()}
    </div>
  );
};

// Combined logo with symbol
interface NelloLogoProps extends NelloWordmarkProps {
  showSymbol?: boolean;
  symbolPosition?: "left" | "top";
}

export const NelloLogo = ({
  variant = "nello-one",
  colorVariant = "default",
  size = "md",
  showSymbol = false,
  symbolPosition = "left",
  className
}: NelloLogoProps) => {
  const containerClass = symbolPosition === "top" 
    ? "flex flex-col items-center gap-2" 
    : "flex items-center gap-3";

  return (
    <div className={cn(containerClass, className)}>
      {showSymbol && (
        <div className="flex-shrink-0">
          {/* Symbol would be rendered here */}
        </div>
      )}
      <NelloWordmark 
        variant={variant} 
        colorVariant={colorVariant} 
        size={size} 
      />
    </div>
  );
};
