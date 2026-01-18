import { useNavigate } from "react-router-dom";

interface LogoTextProps {
  className?: string;
  variant?: "default" | "light" | "dark" | "solid" | "outline";
  clickable?: boolean;
}

export const LogoText = ({ className = "", variant = "default", clickable = true }: LogoTextProps) => {
  const navigate = useNavigate();
  
  const variantStyles = {
    default: {
      nello: "text-foreground",
      one: "text-muted-foreground"
    },
    light: {
      nello: "text-white",
      one: "text-white/60"
    },
    dark: {
      nello: "text-ink-deep",
      one: "text-ink-light"
    },
    solid: {
      nello: "text-ink-deep",
      one: "text-ink-light"
    },
    outline: {
      nello: "text-transparent [-webkit-text-stroke:1.5px_currentColor]",
      one: "text-transparent [-webkit-text-stroke:1px_currentColor] opacity-60"
    },
  };

  const handleClick = () => {
    if (clickable) {
      navigate("/");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const styles = variantStyles[variant];

  return (
    <div 
      className={`font-sans tracking-wide ${clickable ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''} ${className}`}
      onClick={handleClick}
    >
      <span className={`font-bold ${styles.nello}`}>NELLO</span>
      <span className={`font-normal ml-1 ${styles.one}`}>IDENTITY</span>
    </div>
  );
};
