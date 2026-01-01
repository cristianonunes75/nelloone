import { cn } from "@/lib/utils";
import { NelloWordmark } from "./NelloWordmark";
import { NelloSymbolOne } from "./NelloSymbol";

type CardFormat = "instagram-feed" | "instagram-portrait" | "stories" | "linkedin";
type CardType = "institutional" | "educational" | "quote" | "cta" | "feature";
type CardTheme = "light" | "dark";

interface SocialCardTemplateProps {
  format: CardFormat;
  type: CardType;
  theme?: CardTheme;
  title?: string;
  subtitle?: string;
  content?: string;
  scripture?: string;
  scriptureRef?: string;
  ctaText?: string;
  className?: string;
}

const formatDimensions = {
  "instagram-feed": { width: 400, height: 400, ratio: "1:1" },
  "instagram-portrait": { width: 400, height: 500, ratio: "4:5" },
  "stories": { width: 270, height: 480, ratio: "9:16" },
  "linkedin": { width: 520, height: 273, ratio: "1.91:1" }
};

export const SocialCardTemplate = ({
  format,
  type,
  theme = "light",
  title,
  subtitle,
  content,
  scripture,
  scriptureRef,
  ctaText,
  className
}: SocialCardTemplateProps) => {
  const dimensions = formatDimensions[format];
  const isLight = theme === "light";
  
  const bgClass = isLight 
    ? "bg-gradient-to-br from-[hsl(40,30%,97%)] to-[hsl(38,25%,92%)]" 
    : "bg-gradient-to-br from-[hsl(30,15%,12%)] to-[hsl(25,12%,18%)]";
  
  const textPrimary = isLight ? "text-ink-deep" : "text-white";
  const textSecondary = isLight ? "text-ink-light" : "text-white/70";
  const accentColor = "text-primary";
  
  const renderContent = () => {
    switch (type) {
      case "institutional":
        return (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <NelloSymbolOne 
              size={format === "stories" ? 48 : 64} 
              variant={isLight ? "default" : "light"} 
            />
            <div className="mt-6">
              <NelloWordmark 
                variant="nello-one" 
                colorVariant={isLight ? "dark" : "light"}
                size={format === "stories" ? "md" : "lg"}
              />
            </div>
            {subtitle && (
              <p className={cn("mt-4 font-sans text-sm tracking-wide", textSecondary)}>
                {subtitle}
              </p>
            )}
          </div>
        );
      
      case "educational":
        return (
          <div className="flex flex-col justify-between h-full p-6">
            <div>
              {subtitle && (
                <p className={cn("font-sans text-xs uppercase tracking-widest mb-2", accentColor)}>
                  {subtitle}
                </p>
              )}
              {title && (
                <h2 className={cn("font-heading text-xl leading-tight", textPrimary)}>
                  {title}
                </h2>
              )}
            </div>
            {content && (
              <p className={cn("font-sans text-sm leading-relaxed my-4", textSecondary)}>
                {content}
              </p>
            )}
            <div className="flex items-center justify-between">
              <NelloWordmark 
                variant="nello-dot-one" 
                colorVariant={isLight ? "dark" : "light"}
                size="sm"
              />
            </div>
          </div>
        );
      
      case "quote":
        return (
          <div className="flex flex-col justify-center h-full p-8 text-center">
            <div className={cn("text-4xl mb-4", accentColor)}>"</div>
            {content && (
              <blockquote className={cn(
                "font-scripture text-lg leading-relaxed italic",
                textPrimary
              )}>
                {content}
              </blockquote>
            )}
            {scripture && (
              <p className={cn("mt-6 font-scripture text-sm italic", textSecondary)}>
                "{scripture}"
              </p>
            )}
            {scriptureRef && (
              <p className={cn("mt-1 font-sans text-xs tracking-wide", accentColor)}>
                — {scriptureRef}
              </p>
            )}
            <div className="mt-8">
              <NelloWordmark 
                variant="nello-dot-one" 
                colorVariant={isLight ? "dark" : "light"}
                size="sm"
              />
            </div>
          </div>
        );
      
      case "cta":
        return (
          <div className="flex flex-col justify-between h-full p-6">
            <div>
              <NelloSymbolOne 
                size={32} 
                variant={isLight ? "default" : "light"} 
              />
            </div>
            <div className="text-center">
              {title && (
                <h2 className={cn("font-heading text-2xl leading-tight mb-3", textPrimary)}>
                  {title}
                </h2>
              )}
              {content && (
                <p className={cn("font-sans text-sm mb-6", textSecondary)}>
                  {content}
                </p>
              )}
              {ctaText && (
                <div className={cn(
                  "inline-block px-6 py-2 rounded-full font-sans text-sm font-medium",
                  isLight ? "bg-primary text-white" : "bg-white text-ink-deep"
                )}>
                  {ctaText}
                </div>
              )}
            </div>
            <div className="flex justify-center">
              <NelloWordmark 
                variant="nello-dot-one" 
                colorVariant={isLight ? "dark" : "light"}
                size="sm"
              />
            </div>
          </div>
        );
      
      case "feature":
        return (
          <div className="flex flex-col h-full p-6">
            <div className="flex items-center gap-2 mb-4">
              <NelloSymbolOne 
                size={24} 
                variant={isLight ? "default" : "light"} 
              />
              <NelloWordmark 
                variant="nello" 
                colorVariant={isLight ? "dark" : "light"}
                size="sm"
              />
            </div>
            <div className="flex-1 flex flex-col justify-center">
              {subtitle && (
                <p className={cn("font-sans text-xs uppercase tracking-widest mb-2", accentColor)}>
                  {subtitle}
                </p>
              )}
              {title && (
                <h2 className={cn("font-heading text-xl leading-tight mb-3", textPrimary)}>
                  {title}
                </h2>
              )}
              {content && (
                <p className={cn("font-sans text-sm leading-relaxed", textSecondary)}>
                  {content}
                </p>
              )}
            </div>
            <div className="mt-4">
              <p className={cn("font-sans text-xs", textSecondary)}>
                nello.one
              </p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-lg shadow-lg",
        bgClass,
        className
      )}
      style={{
        width: dimensions.width,
        height: dimensions.height
      }}
    >
      {/* Subtle decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className={cn(
            "absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-10",
            isLight ? "bg-primary" : "bg-white"
          )} 
        />
        <div 
          className={cn(
            "absolute -bottom-10 -left-10 w-32 h-32 rounded-full opacity-5",
            isLight ? "bg-primary" : "bg-white"
          )} 
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 h-full">
        {renderContent()}
      </div>
    </div>
  );
};

// Preview wrapper with format label
interface CardPreviewProps extends SocialCardTemplateProps {
  showLabel?: boolean;
}

export const SocialCardPreview = ({ showLabel = true, ...props }: CardPreviewProps) => {
  const dimensions = formatDimensions[props.format];
  
  return (
    <div className="flex flex-col items-center">
      <SocialCardTemplate {...props} />
      {showLabel && (
        <p className="mt-2 text-xs text-muted-foreground font-sans">
          {props.format.replace("-", " ")} ({dimensions.ratio})
        </p>
      )}
    </div>
  );
};
