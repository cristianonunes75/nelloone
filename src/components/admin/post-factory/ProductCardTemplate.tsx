import { cn } from "@/lib/utils";
import { NelloWordmark } from "@/components/brand/NelloWordmark";
import { NelloSymbolOne } from "@/components/brand/NelloSymbol";
import { 
  NelloProduct, 
  CardFormat, 
  CardType, 
  CardTheme,
  CardLogoVariant,
  PRODUCT_CONFIGS,
  FORMAT_DIMENSIONS
} from "./types";

interface ProductCardTemplateProps {
  product: NelloProduct;
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
  logoVariant?: CardLogoVariant;
  testimonialAuthor?: string;
}

export const ProductCardTemplate = ({
  product,
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
  imageOpacity = 0.3,
  logoVariant = "nello-dot-one",
  testimonialAuthor
}: ProductCardTemplateProps) => {
  const dimensions = FORMAT_DIMENSIONS[format];
  const productConfig = PRODUCT_CONFIGS[product];
  const isLight = theme === "light";
  
  // Dynamic colors based on product
  const primaryColor = productConfig.colors.primary;
  const secondaryColor = productConfig.colors.secondary;
  
  const bgClass = backgroundImage 
    ? "" 
    : isLight 
      ? "bg-gradient-to-br from-[#FAF8F5] to-[#F0EDE8]" 
      : `bg-gradient-to-br from-[${primaryColor}] to-[#292524]`;
  
  const textPrimary = isLight ? "text-[#1C1917]" : "text-white";
  const textSecondary = isLight ? "text-[#57534e]" : "text-white/80";

  // Render the selected logo
  const renderLogo = (size: "sm" | "md" = "sm") => {
    if (logoVariant === "none") return null;
    
    const colorVariant = isLight ? "dark" : "light";
    
    return (
      <NelloWordmark 
        variant={logoVariant as any}
        colorVariant={colorVariant}
        size={size}
      />
    );
  };
  
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
              <h2 className={cn("font-heading text-xl", textPrimary)}>
                {productConfig.name}
              </h2>
              <p 
                className="text-sm font-medium mt-1"
                style={{ color: secondaryColor }}
              >
                {productConfig.description.split(' - ')[1]}
              </p>
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
                <p 
                  className="font-sans text-xs uppercase tracking-widest mb-2"
                  style={{ color: secondaryColor }}
                >
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
              {renderLogo()}
              <div 
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: secondaryColor }}
              />
            </div>
          </div>
        );
      
      case "quote":
        return (
          <div className="flex flex-col justify-center h-full p-8 text-center">
            <div 
              className="text-4xl mb-4"
              style={{ color: secondaryColor }}
            >
              "
            </div>
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
              <p 
                className="mt-1 font-sans text-xs tracking-wide"
                style={{ color: secondaryColor }}
              >
                — {scriptureRef}
              </p>
            )}
            <div className="mt-8">
              {renderLogo()}
            </div>
          </div>
        );
      
      case "cta":
        return (
          <div className="flex flex-col justify-between h-full p-6">
            <div className="flex items-center gap-2">
              <NelloSymbolOne 
                size={24} 
                variant={isLight ? "default" : "light"} 
              />
              <span 
                className="text-xs font-medium"
                style={{ color: secondaryColor }}
              >
                {productConfig.name}
              </span>
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
                <div 
                  className="inline-block px-6 py-2 rounded-full font-sans text-sm font-medium"
                  style={{ 
                    backgroundColor: secondaryColor,
                    color: isLight ? '#fff' : primaryColor
                  }}
                >
                  {ctaText}
                </div>
              )}
            </div>
            <div className="flex justify-center">
              {renderLogo()}
            </div>
          </div>
        );
      
        return (
          <div className="flex flex-col h-full p-6">
            <div className="flex items-center gap-2 mb-4">
              <NelloSymbolOne 
                size={24} 
                variant={isLight ? "default" : "light"} 
              />
              {renderLogo()}
            </div>
            <div className="flex-1 flex flex-col justify-center">
              {subtitle && (
                <p 
                  className="font-sans text-xs uppercase tracking-widest mb-2"
                  style={{ color: secondaryColor }}
                >
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
            <div className="mt-4 flex items-center justify-between">
              <p className={cn("font-sans text-xs", textSecondary)}>
                {product}.nello.one
              </p>
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: secondaryColor }}
              />
            </div>
          </div>
        );

      case "testimonial":
        return (
          <div className="flex flex-col justify-between h-full p-6">
            <div className="flex items-center gap-2">
              <NelloSymbolOne 
                size={24} 
                variant={isLight ? "default" : "light"} 
              />
              <span 
                className="text-xs font-medium"
                style={{ color: secondaryColor }}
              >
                Depoimento
              </span>
            </div>
            <div className="flex-1 flex flex-col justify-center px-2">
              <div 
                className="text-3xl mb-2 leading-none"
                style={{ color: secondaryColor }}
              >
                "
              </div>
              {content && (
                <p className={cn(
                  "font-sans text-sm leading-relaxed italic",
                  textPrimary
                )}>
                  {content.length > 200 ? content.slice(0, 200) + '…' : content}
                </p>
              )}
              {testimonialAuthor && (
                <p 
                  className="mt-3 font-sans text-xs font-semibold tracking-wide"
                  style={{ color: secondaryColor }}
                >
                  — {testimonialAuthor}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between">
              {renderLogo()}
              <span className={cn("text-[10px] font-sans", textSecondary)}>
                identity.nello.one
              </span>
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
        "relative rounded-lg shadow-lg overflow-hidden",
        bgClass,
        className
      )}
      style={{
        width: dimensions.width,
        height: dimensions.height,
      }}
    >
      {/* Background Image Layer */}
      {backgroundImage && (
        <>
          <div 
            className={cn(
              "absolute inset-0 bg-cover bg-center",
              !isLight && "grayscale brightness-50"
            )}
            style={{
              backgroundImage: `url(${backgroundImage})`,
              opacity: imageOpacity,
              filter: !isLight ? 'grayscale(30%) brightness(0.4)' : undefined
            }}
          />
          <div 
            className={cn(
              "absolute inset-0",
              isLight 
                ? "bg-gradient-to-br from-[#FAF8F5]/80 to-[#F0EDE8]/70" 
                : "bg-gradient-to-br from-[#0a0a0a]/90 to-[#1a1a1a]/85"
            )}
          />
        </>
      )}
      
      {/* Decorative elements with product color */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full"
          style={{ 
            backgroundColor: secondaryColor,
            opacity: isLight ? 0.1 : 0.05
          }}
        />
        <div 
          className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full"
          style={{ 
            backgroundColor: secondaryColor,
            opacity: isLight ? 0.05 : 0.03
          }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 h-full">
        {renderContent()}
      </div>
    </div>
  );
};
