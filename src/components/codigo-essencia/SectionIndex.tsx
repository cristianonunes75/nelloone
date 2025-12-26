import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface Section {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface SectionIndexProps {
  sections: Section[];
  language?: string;
}

export const SectionIndex = ({ sections, language = "pt" }: SectionIndexProps) => {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i].id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const labels = {
    title: { pt: "Navegação", "pt-pt": "Navegação", en: "Navigation" }
  };

  const lang = language === "en" ? "en" : language === "pt-pt" ? "pt-pt" : "pt";

  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4 sticky top-24">
      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3 font-medium">
        {labels.title[lang]}
      </p>
      <nav className="space-y-1">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={cn(
              "w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2",
              activeSection === section.id
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {section.icon && <span className="w-4 h-4 flex-shrink-0">{section.icon}</span>}
            <span className="truncate">{section.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};
