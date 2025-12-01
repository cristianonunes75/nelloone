import { useLanguage, Language } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const languages: { code: Language; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
];

export function LanguageToggle({ variant = 'default' }: { variant?: 'default' | 'minimal' }) {
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const current = languages.find(l => l.code === language);

  const handleLanguageChange = (newLang: Language) => {
    if (newLang === language) return;
    
    setLanguage(newLang);
    
    // Update URL to reflect language change
    const currentPath = location.pathname;
    let newPath: string;
    
    if (newLang === 'en') {
      // Switching to English - add /en prefix
      if (currentPath.startsWith('/en')) {
        newPath = currentPath; // Already has /en
      } else {
        newPath = `/en${currentPath === '/' ? '' : currentPath}`;
      }
    } else {
      // Switching to Portuguese - remove /en prefix
      if (currentPath.startsWith('/en')) {
        newPath = currentPath.replace(/^\/en/, '') || '/';
      } else {
        newPath = currentPath;
      }
    }
    
    navigate(newPath, { replace: true });
  };

  if (variant === 'minimal') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
            <Globe className="w-4 h-4" strokeWidth={1.5} />
            <span className="text-xs font-medium uppercase">{language}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[140px]">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={language === lang.code ? 'bg-bruma' : ''}
            >
              <span className="mr-2">{lang.flag}</span>
              {lang.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 rounded-full border-border/60">
          <span>{current?.flag}</span>
          <span className="text-sm">{current?.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={language === lang.code ? 'bg-bruma' : ''}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
