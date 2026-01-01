import { cn } from "@/lib/utils";

interface NelloSymbolProps {
  size?: number;
  variant?: "default" | "light" | "dark" | "gradient";
  className?: string;
}

export const NelloSymbol = ({ 
  size = 48, 
  variant = "default",
  className 
}: NelloSymbolProps) => {
  const colorVariants = {
    default: {
      primary: "hsl(38 70% 50%)",
      secondary: "hsl(30 15% 25%)"
    },
    light: {
      primary: "#FFFFFF",
      secondary: "rgba(255,255,255,0.6)"
    },
    dark: {
      primary: "hsl(30 15% 18%)",
      secondary: "hsl(30 15% 35%)"
    },
    gradient: {
      primary: "url(#nelloGradient)",
      secondary: "hsl(38 70% 50%)"
    }
  };

  const colors = colorVariants[variant];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("", className)}
    >
      <defs>
        <linearGradient id="nelloGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(38 70% 50%)" />
          <stop offset="100%" stopColor="hsl(40 75% 40%)" />
        </linearGradient>
      </defs>
      
      {/* Portal/Column concept with central space - represents unity and consciousness */}
      <rect
        x="15"
        y="10"
        width="16"
        height="80"
        rx="2"
        fill={colors.primary}
      />
      <rect
        x="69"
        y="10"
        width="16"
        height="80"
        rx="2"
        fill={colors.primary}
      />
      
      {/* Central line - represents the ONE, identity, center */}
      <rect
        x="46"
        y="25"
        width="8"
        height="50"
        rx="1"
        fill={colors.secondary}
        opacity="0.8"
      />
      
      {/* Top connection - unity */}
      <rect
        x="31"
        y="10"
        width="38"
        height="6"
        rx="1"
        fill={colors.primary}
        opacity="0.4"
      />
    </svg>
  );
};

// Alternative N-based symbol
export const NelloSymbolN = ({ 
  size = 48, 
  variant = "default",
  className 
}: NelloSymbolProps) => {
  const colorVariants = {
    default: "hsl(38 70% 50%)",
    light: "#FFFFFF",
    dark: "hsl(30 15% 18%)",
    gradient: "url(#nelloGradientN)"
  };

  const color = colorVariants[variant];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("", className)}
    >
      <defs>
        <linearGradient id="nelloGradientN" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(38 70% 50%)" />
          <stop offset="100%" stopColor="hsl(40 75% 40%)" />
        </linearGradient>
      </defs>
      
      {/* Geometric N */}
      <path
        d="M20 85V15h12l36 50V15h12v70H68L32 35v50H20z"
        fill={color}
      />
    </svg>
  );
};

// Minimal circle with line - represents ONE
export const NelloSymbolOne = ({ 
  size = 48, 
  variant = "default",
  className 
}: NelloSymbolProps) => {
  const colorVariants = {
    default: {
      stroke: "hsl(38 70% 50%)",
      fill: "hsl(38 70% 50%)"
    },
    light: {
      stroke: "#FFFFFF",
      fill: "#FFFFFF"
    },
    dark: {
      stroke: "hsl(30 15% 18%)",
      fill: "hsl(30 15% 18%)"
    },
    gradient: {
      stroke: "hsl(38 70% 50%)",
      fill: "url(#nelloGradientOne)"
    }
  };

  const colors = colorVariants[variant];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("", className)}
    >
      <defs>
        <linearGradient id="nelloGradientOne" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(38 70% 50%)" />
          <stop offset="100%" stopColor="hsl(40 75% 40%)" />
        </linearGradient>
      </defs>
      
      {/* Circle outline - unity, wholeness */}
      <circle
        cx="50"
        cy="50"
        r="40"
        stroke={colors.stroke}
        strokeWidth="4"
        fill="none"
      />
      
      {/* Vertical line - the ONE, center, identity */}
      <rect
        x="46"
        y="22"
        width="8"
        height="56"
        rx="4"
        fill={colors.fill}
      />
    </svg>
  );
};
