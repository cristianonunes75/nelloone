import { Check } from "lucide-react";

interface FreePlanBenefitsProps {
  variant?: "light" | "dark";
}

export const FreePlanBenefits = ({ variant = "light" }: FreePlanBenefitsProps) => {
  const benefits = [
    "Gratuito para começar",
    "Sem cartão de crédito",
    "Cancele quando quiser"
  ];

  const textColor = variant === "dark" ? "text-white/70" : "text-foreground/60";
  const checkColor = variant === "dark" ? "text-nello-gold" : "text-nello-gold";

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
      {benefits.map((benefit, index) => (
        <div key={index} className="flex items-center gap-1.5">
          <Check className={`w-4 h-4 ${checkColor}`} strokeWidth={2} />
          <span className={`text-sm ${textColor}`}>{benefit}</span>
        </div>
      ))}
    </div>
  );
};
