import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  to?: string;
  label?: string;
  className?: string;
  onClick?: () => void;
}

export const BackButton = ({ to, label, className, onClick }: BackButtonProps) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  
  const defaultLabel = language === 'en' ? 'Back' : 'Voltar';
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };
  
  return (
    <Button 
      variant="ghost" 
      size="sm"
      onClick={handleClick}
      className={cn(
        "hover:bg-transparent hover:text-primary gap-2",
        className
      )}
    >
      <ArrowLeft className="w-4 h-4" />
      {label || defaultLabel}
    </Button>
  );
};
