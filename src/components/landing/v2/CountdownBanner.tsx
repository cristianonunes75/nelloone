import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Clock } from "lucide-react";

const FLASH_SALE_END = new Date("2026-02-28T23:59:59-03:00").getTime();

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownBanner = () => {
  const { language } = useLanguage();
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const calc = () => {
      const diff = FLASH_SALE_END - Date.now();
      if (diff <= 0) {
        setExpired(true);
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, []);

  if (expired) return null;
  if (!timeLeft) return null;

  const label = language === "en"
    ? "February Flash Sale — 50% OFF"
    : "Flash Sale Fevereiro — 50% OFF";

  const endLabel = language === "en"
    ? "Ends in:"
    : "Termina em:";

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="w-full bg-nello-graphite text-white py-2.5 px-4 z-40 relative">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-nello-gold" strokeWidth={2} />
          <span className="text-xs sm:text-sm font-semibold text-nello-gold tracking-wide uppercase">
            {label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/70">{endLabel}</span>
          <div className="flex gap-1">
            {[
              { val: timeLeft.days, unit: "d" },
              { val: timeLeft.hours, unit: "h" },
              { val: timeLeft.minutes, unit: "m" },
              { val: timeLeft.seconds, unit: "s" },
            ].map(({ val, unit }) => (
              <span key={unit} className="bg-white/10 rounded px-1.5 py-0.5 text-xs sm:text-sm font-mono font-bold text-nello-gold">
                {pad(val)}<span className="text-white/50 text-[10px]">{unit}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
