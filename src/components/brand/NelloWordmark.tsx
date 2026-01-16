import { cn } from "@/lib/utils";

type WordmarkVariant = 
  | "nello-one" 
  | "nello-one-mixed" 
  | "nello" 
  | "nello-dot-one"
  | "nello-one-identity"
  | "nello-one-life"
  | "nello-one-flow"
  | "nello-one-business"
  | "nello-one-praxis";

type ColorVariant = "default" | "light" | "dark" | "mono-dark" | "mono-light";

interface NelloWordmarkProps {
  variant?: WordmarkVariant;
  colorVariant?: ColorVariant;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

// Module accent colors
const moduleColors = {
  identity: "text-amber-600",
  life: "text-emerald-600",
  flow: "text-violet-600",
  business: "text-blue-600",
  praxis: "text-rose-600",
};

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
        // NELLO ONE - Marca Mãe Institucional
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

      // ========== MÓDULOS DO ECOSSISTEMA ==========
      
      case "nello-one-identity":
        // NELLO ONE | Identity
        return (
          <span className="font-sans tracking-wide flex items-center">
            <span className={cn("font-bold", colors.primary)}>NELLO</span>
            <span className={cn("font-normal ml-[0.3em]", colors.secondary)}>ONE</span>
            <span className={cn("font-light mx-[0.4em] opacity-30", colors.secondary)}>|</span>
            <span className={cn("font-light tracking-wider", moduleColors.identity)}>Identity</span>
          </span>
        );
      
      case "nello-one-life":
        // NELLO ONE | Life
        return (
          <span className="font-sans tracking-wide flex items-center">
            <span className={cn("font-bold", colors.primary)}>NELLO</span>
            <span className={cn("font-normal ml-[0.3em]", colors.secondary)}>ONE</span>
            <span className={cn("font-light mx-[0.4em] opacity-30", colors.secondary)}>|</span>
            <span className={cn("font-light tracking-wider", moduleColors.life)}>Life</span>
          </span>
        );
      
      case "nello-one-flow":
        // NELLO ONE | Flow
        return (
          <span className="font-sans tracking-wide flex items-center">
            <span className={cn("font-bold", colors.primary)}>NELLO</span>
            <span className={cn("font-normal ml-[0.3em]", colors.secondary)}>ONE</span>
            <span className={cn("font-light mx-[0.4em] opacity-30", colors.secondary)}>|</span>
            <span className={cn("font-light tracking-wider", moduleColors.flow)}>Flow</span>
          </span>
        );
      
      case "nello-one-business":
        // NELLO ONE | Business
        return (
          <span className="font-sans tracking-wide flex items-center">
            <span className={cn("font-bold", colors.primary)}>NELLO</span>
            <span className={cn("font-normal ml-[0.3em]", colors.secondary)}>ONE</span>
            <span className={cn("font-light mx-[0.4em] opacity-30", colors.secondary)}>|</span>
            <span className={cn("font-light tracking-wider", moduleColors.business)}>Business</span>
          </span>
        );
      
      case "nello-one-praxis":
        // NELLO ONE | Praxis
        return (
          <span className="font-sans tracking-wide flex items-center">
            <span className={cn("font-bold", colors.primary)}>NELLO</span>
            <span className={cn("font-normal ml-[0.3em]", colors.secondary)}>ONE</span>
            <span className={cn("font-light mx-[0.4em] opacity-30", colors.secondary)}>|</span>
            <span className={cn("font-light tracking-wider", moduleColors.praxis)}>Praxis</span>
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

// Module badge component for cards
interface ModuleBadgeProps {
  module: "identity" | "life" | "flow" | "business" | "praxis";
  className?: string;
}

export const ModuleBadge = ({ module, className }: ModuleBadgeProps) => {
  const moduleNames = {
    identity: "Identity",
    life: "Life",
    flow: "Flow",
    business: "Business",
    praxis: "Praxis",
  };

  const moduleBgColors = {
    identity: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    life: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
    flow: "bg-violet-500/10 text-violet-700 border-violet-500/20",
    business: "bg-blue-500/10 text-blue-700 border-blue-500/20",
    praxis: "bg-rose-500/10 text-rose-700 border-rose-500/20",
  };

  return (
    <span className={cn(
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border",
      moduleBgColors[module],
      className
    )}>
      NELLO ONE | {moduleNames[module]}
    </span>
  );
};