// Types for the Post Factory system

export type NelloProduct = 'identity' | 'life' | 'flow' | 'business' | 'praxis';
export type CardFormat = "instagram-feed" | "instagram-portrait" | "stories" | "linkedin";
export type CardType = "institutional" | "educational" | "quote" | "cta" | "feature" | "testimonial";
export type CardTheme = "light" | "dark";
export type CardLanguage = "pt" | "en";
export type PostStatus = 'draft' | 'scheduled' | 'published' | 'failed';

// Logo variants for posts
export type CardLogoVariant = 
  | "none"
  | "nello-one" 
  | "nello-dot-one"
  | "nello"
  | "nello-one-identity"
  | "nello-one-life"
  | "nello-one-flow"
  | "nello-one-business"
  | "nello-one-praxis";

export const LOGO_OPTIONS: { value: CardLogoVariant; label: string }[] = [
  { value: "none", label: "Sem logo" },
  { value: "nello-one", label: "NELLO ONE" },
  { value: "nello-dot-one", label: "nello.one" },
  { value: "nello", label: "NELLO" },
  { value: "nello-one-identity", label: "NELLO ONE | Identity" },
  { value: "nello-one-life", label: "NELLO ONE | Life" },
  { value: "nello-one-flow", label: "NELLO ONE | Flow" },
  { value: "nello-one-business", label: "NELLO ONE | Business" },
  { value: "nello-one-praxis", label: "NELLO ONE | Praxis" },
];

export interface ProductConfig {
  id: NelloProduct;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent?: string;
  };
  toneOfVoice: {
    pt: string;
    en: string;
  };
  contentTypes: CardType[];
  defaultCtas: {
    pt: string[];
    en: string[];
  };
}

export interface SocialMediaPost {
  id?: string;
  product: NelloProduct;
  content_type: CardType;
  format: CardFormat;
  copy: string;
  title?: string;
  subtitle?: string;
  scripture?: string;
  scripture_ref?: string;
  cta_text?: string;
  theme: CardTheme;
  background_image_url?: string;
  image_opacity: number;
  generated_image_url?: string;
  scheduled_at?: string;
  published_at?: string;
  platforms: string[];
  status: PostStatus;
  ai_generated: boolean;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AICopySuggestion {
  title?: string;
  subtitle?: string;
  content?: string;
  scripture?: string;
  scriptureRef?: string;
  cta?: string;
  caption?: string;
}

// Product configurations with brand identity
export const PRODUCT_CONFIGS: Record<NelloProduct, ProductConfig> = {
  identity: {
    id: 'identity',
    name: 'Nello Identity',
    description: 'Código da Essência - Autoconhecimento profundo',
    colors: {
      primary: '#0A192F', // Ink deep
      secondary: '#D4AF37', // Gold
      accent: '#C9A227',
    },
    toneOfVoice: {
      pt: 'Reflexivo, profundo, acolhedor. Foca em identidade, essência e autodescoberta.',
      en: 'Reflective, deep, welcoming. Focuses on identity, essence and self-discovery.',
    },
    contentTypes: ['institutional', 'educational', 'quote', 'cta', 'feature', 'testimonial'],
    defaultCtas: {
      pt: ['Descubra sua essência', 'Começar jornada', 'Conhecer-se melhor', 'Fazer o teste'],
      en: ['Discover your essence', 'Start journey', 'Know yourself better', 'Take the test'],
    },
  },
  life: {
    id: 'life',
    name: 'Nello Life',
    description: 'Jornada de Vida - Propósito e direção',
    colors: {
      primary: '#0A192F',
      secondary: '#27AE60', // Green
      accent: '#2ECC71',
    },
    toneOfVoice: {
      pt: 'Inspirador, motivador, prático. Foca em propósito, metas e crescimento pessoal.',
      en: 'Inspiring, motivating, practical. Focuses on purpose, goals and personal growth.',
    },
    contentTypes: ['institutional', 'educational', 'quote', 'cta', 'feature'],
    defaultCtas: {
      pt: ['Encontre seu propósito', 'Trace seu caminho', 'Definir metas', 'Crescer agora'],
      en: ['Find your purpose', 'Chart your path', 'Set goals', 'Grow now'],
    },
  },
  flow: {
    id: 'flow',
    name: 'Nello Flow',
    description: 'Inteligência Adaptativa - Produtividade e performance',
    colors: {
      primary: '#0A192F',
      secondary: '#3498DB', // Blue
      accent: '#2980B9',
    },
    toneOfVoice: {
      pt: 'Dinâmico, estratégico, focado. Foca em produtividade, fluxo e alta performance.',
      en: 'Dynamic, strategic, focused. Focuses on productivity, flow and high performance.',
    },
    contentTypes: ['institutional', 'educational', 'cta', 'feature'],
    defaultCtas: {
      pt: ['Entrar no fluxo', 'Otimizar rotina', 'Maximizar foco', 'Performar melhor'],
      en: ['Enter the flow', 'Optimize routine', 'Maximize focus', 'Perform better'],
    },
  },
  business: {
    id: 'business',
    name: 'Nello Business',
    description: 'Inteligência Empresarial - Equipes e liderança',
    colors: {
      primary: '#0A192F',
      secondary: '#8E44AD', // Purple
      accent: '#9B59B6',
    },
    toneOfVoice: {
      pt: 'Profissional, estratégico, visionário. Foca em liderança, equipes e cultura organizacional.',
      en: 'Professional, strategic, visionary. Focuses on leadership, teams and organizational culture.',
    },
    contentTypes: ['institutional', 'educational', 'cta', 'feature'],
    defaultCtas: {
      pt: ['Liderar com propósito', 'Conhecer sua equipe', 'Cultura de excelência', 'Contratar certo'],
      en: ['Lead with purpose', 'Know your team', 'Culture of excellence', 'Hire right'],
    },
  },
  praxis: {
    id: 'praxis',
    name: 'Nello Praxis',
    description: 'Prática Integrada - Aplicação e transformação',
    colors: {
      primary: '#0A192F',
      secondary: '#E67E22', // Orange
      accent: '#D35400',
    },
    toneOfVoice: {
      pt: 'Prático, transformador, aplicável. Foca em ação, implementação e mudança real.',
      en: 'Practical, transformative, applicable. Focuses on action, implementation and real change.',
    },
    contentTypes: ['institutional', 'educational', 'quote', 'cta', 'feature'],
    defaultCtas: {
      pt: ['Aplicar agora', 'Transformar vida', 'Praticar diário', 'Mudar hoje'],
      en: ['Apply now', 'Transform life', 'Practice daily', 'Change today'],
    },
  },
};

export const FORMAT_DIMENSIONS: Record<CardFormat, { width: number; height: number; ratio: string }> = {
  "instagram-feed": { width: 400, height: 400, ratio: "1:1" },
  "instagram-portrait": { width: 400, height: 500, ratio: "4:5" },
  "stories": { width: 270, height: 480, ratio: "9:16" },
  "linkedin": { width: 520, height: 273, ratio: "1.91:1" }
};

export const TYPE_LABELS: Record<CardLanguage, Record<CardType, string>> = {
  pt: {
    institutional: 'Institucional',
    educational: 'Educativo',
    quote: 'Frase/Reflexão',
    cta: 'Chamada p/ Ação',
    feature: 'Funcionalidade',
    testimonial: 'Depoimento',
  },
  en: {
    institutional: 'Institutional',
    educational: 'Educational',
    quote: 'Quote/Reflection',
    cta: 'Call to Action',
    feature: 'Feature',
    testimonial: 'Testimonial',
  },
};
