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

  const textColor = variant === "dark" ? "text-white/80" : "text-foreground/90";
  const checkColor = "text-nello-gold";
  const bgColor = variant === "dark" ? "bg-white/10 backdrop-blur-sm" : "bg-background/80 backdrop-blur-sm";

  return (
    <div className={`flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4 py-3 rounded-full ${bgColor}`}>
      {benefits.map((benefit, index) => (
        <div key={index} className="flex items-center gap-1.5">
          <Check className={`w-4 h-4 ${checkColor}`} strokeWidth={2.5} />
          <span className={`text-sm font-medium ${textColor}`}>{benefit}</span>
        </div>
      ))}
    </div>
  );
};
