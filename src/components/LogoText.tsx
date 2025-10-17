interface LogoTextProps {
  className?: string;
  variant?: "default" | "outline" | "solid";
}

export const LogoText = ({ className = "", variant = "default" }: LogoTextProps) => {
  const baseStyles = "font-light tracking-[0.2em] uppercase";
  
  const variantStyles = {
    default: "text-foreground",
    outline: "text-transparent [-webkit-text-stroke:1.5px_currentColor] stroke-current",
    solid: "text-gold",
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      <span className="font-extralight">Essentia</span>
    </div>
  );
};
