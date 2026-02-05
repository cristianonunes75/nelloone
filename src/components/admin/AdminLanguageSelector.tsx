import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export type AdminLanguage = "pt" | "en" | "pt-pt";

interface AdminLanguageSelectorProps {
  value: AdminLanguage;
  onChange: (language: AdminLanguage) => void;
  className?: string;
}

const LANGUAGES: { value: AdminLanguage; label: string; flag: string; country: string }[] = [
  { value: "pt", label: "PT-BR", flag: "🇧🇷", country: "Brasil" },
  { value: "en", label: "EN", flag: "🇬🇧", country: "English" },
  { value: "pt-pt", label: "PT-PT", flag: "🇵🇹", country: "Portugal" },
];

export function AdminLanguageSelector({ value, onChange, className }: AdminLanguageSelectorProps) {
  return (
    <div className={className}>
      <Tabs value={value} onValueChange={(v) => onChange(v as AdminLanguage)}>
        <TabsList className="grid grid-cols-3 h-auto p-1">
          {LANGUAGES.map((lang) => (
            <TabsTrigger
              key={lang.value}
              value={lang.value}
              className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="font-medium">{lang.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <p className="text-xs text-muted-foreground mt-2 text-center">
        Editando conteúdo em: <Badge variant="outline" className="ml-1">{LANGUAGES.find(l => l.value === value)?.country}</Badge>
      </p>
    </div>
  );
}
