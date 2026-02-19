import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export const FloatingBadge = () => {
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    document.getElementById("precos")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <button
      onClick={handleClick}
      aria-label="50% OFF - Ver preços"
      className={cn(
        "fixed z-50 w-16 h-16 rounded-full bg-nello-gold text-nello-graphite font-bold text-xs flex flex-col items-center justify-center shadow-xl transition-all duration-500 cursor-pointer hover:scale-110",
        isMobile ? "bottom-24 right-4" : "bottom-8 right-8",
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none",
        "animate-pulse"
      )}
    >
      <span className="text-lg font-extrabold leading-none">50%</span>
      <span className="text-[10px] font-bold leading-none">OFF</span>
    </button>
  );
};
