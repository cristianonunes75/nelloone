import { useNavigate } from "react-router-dom";

interface LogoTextProps {
  className?: string;
  variant?: "default" | "outline" | "solid";
  clickable?: boolean;
}

export const LogoText = ({ className = "", variant = "default", clickable = true }: LogoTextProps) => {
  const navigate = useNavigate();
  const baseStyles = "font-serif font-light tracking-[0.3em] uppercase";
  
  const variantStyles = {
    default: "text-foreground",
    outline: "text-transparent [-webkit-text-stroke:1.5px_currentColor] stroke-current",
    solid: "text-gold",
  };

  const handleClick = () => {
    if (clickable) {
      navigate("/");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div 
      className={`${baseStyles} ${variantStyles[variant]} ${clickable ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''} ${className}`}
      onClick={handleClick}
    >
      <span>Essentia</span>
    </div>
  );
};
