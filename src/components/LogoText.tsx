import { useNavigate } from "react-router-dom";

interface LogoTextProps {
  className?: string;
  variant?: "default" | "light" | "dark" | "solid" | "outline";
  clickable?: boolean;
}

export const LogoText = ({ className = "", variant = "default", clickable = true }: LogoTextProps) => {
  const navigate = useNavigate();
  
  const variantStyles = {
    default: "text-foreground",
    light: "text-white",
    dark: "text-ink-brown",
    solid: "text-ink-deep",
    outline: "text-transparent [-webkit-text-stroke:1.5px_currentColor] stroke-current",
  };

  const handleClick = () => {
    if (clickable) {
      navigate("/");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div 
      className={`font-heading tracking-[0.08em] uppercase ${variantStyles[variant]} ${clickable ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''} ${className}`}
      onClick={handleClick}
    >
      <span className="font-semibold">NELLO</span>
      <span className="font-normal ml-1.5 opacity-70">ONE</span>
    </div>
  );
};
