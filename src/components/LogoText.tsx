import { useNavigate } from "react-router-dom";

interface LogoTextProps {
  className?: string;
  variant?: "default" | "outline" | "solid";
  clickable?: boolean;
}

export const LogoText = ({ className = "", variant = "default", clickable = true }: LogoTextProps) => {
  const navigate = useNavigate();
  const baseStyles = "font-sans font-semibold tracking-[0.15em] uppercase";
  
  const variantStyles = {
    default: "text-foreground",
    outline: "text-transparent [-webkit-text-stroke:1.5px_currentColor] stroke-current",
    solid: "text-ink-blue",
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
      <span className="font-semibold">NELLO</span>
      <span className="font-light ml-1 opacity-70">ONE</span>
    </div>
  );
};
