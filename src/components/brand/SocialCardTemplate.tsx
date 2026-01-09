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
  backgroundImage?: string;
  imageOpacity?: number;
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
  className,
  backgroundImage,
  imageOpacity = 0.3
}: SocialCardTemplateProps) => {
  const dimensions = formatDimensions[format];
  const isLight = theme === "light";
  
  const bgClass = backgroundImage 
    ? "" 
    : isLight 
      ? "bg-gradient-to-br from-[#FAF8F5] to-[#F0EDE8]" 
      : "bg-gradient-to-br from-[#1C1917] to-[#292524]";
  
  const textPrimary = isLight ? "text-[#1C1917]" : "text-white";
  const textSecondary = isLight ? "text-[#57534e]" : "text-white/80";
  const accentColor = isLight ? "text-[#C9A227]" : "text-[#D4AF37]";
  
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
      {/* Background Image Layer */}
      {backgroundImage && (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              opacity: imageOpacity
            }}
          />
          {/* Overlay for text readability */}
          <div 
            className={cn(
              "absolute inset-0",
              isLight 
                ? "bg-gradient-to-br from-[#FAF8F5]/80 to-[#F0EDE8]/70" 
                : "bg-gradient-to-br from-[#1C1917]/80 to-[#292524]/70"
            )}
          />
        </>
      )}
      
      {/* Subtle decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className={cn(
            "absolute -top-20 -right-20 w-40 h-40 rounded-full",
            isLight ? "bg-[#C9A227]/10" : "bg-white/5"
          )} 
        />
        <div 
          className={cn(
            "absolute -bottom-10 -left-10 w-32 h-32 rounded-full",
            isLight ? "bg-[#C9A227]/5" : "bg-white/3"
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

export const SocialCardPreview = ({ showLabel = false, ...props }: CardPreviewProps) => {
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
