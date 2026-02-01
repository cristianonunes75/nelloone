// Lead types for Mini CRM

export type LeadStatus = 
  | 'novo'
  | 'qualificado'
  | 'conversa_marcada'
  | 'proposta_enviada'
  | 'em_decisao'
  | 'fechado_ganho'
  | 'fechado_perdido';

export type LeadSource = 
  | 'instagram'
  | 'indicacao'
  | 'conteudo'
  | 'site'
  | 'outro';

export type ActivityType = 
  | 'note'
  | 'call'
  | 'whatsapp'
  | 'meeting'
  | 'stage_change'
  | 'created';

export interface Lead {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  instagram_handle: string | null;
  source: LeadSource;
  status: LeadStatus;
  owner_user_id: string | null;
  value_estimate: number;
  notes: string | null;
  next_action: string | null;
  next_action_date: string | null;
  lost_reason: string | null;
  associated_purchase_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeadActivity {
  id: string;
  lead_id: string;
  type: ActivityType;
  summary: string | null;
  created_by: string | null;
  created_at: string;
}

export interface SalesPlaybook {
  id: string;
  section_key: string;
  title: string;
  content: string;
  order_index: number;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export const leadStatusLabels: Record<LeadStatus, string> = {
  novo: 'Novo',
  qualificado: 'Qualificado',
  conversa_marcada: 'Conversa Marcada',
  proposta_enviada: 'Proposta Enviada',
  em_decisao: 'Em Decisão',
  fechado_ganho: 'Fechado Ganho',
  fechado_perdido: 'Fechado Perdido',
};

export const leadStatusColors: Record<LeadStatus, string> = {
  novo: 'bg-blue-100 text-blue-800',
  qualificado: 'bg-purple-100 text-purple-800',
  conversa_marcada: 'bg-amber-100 text-amber-800',
  proposta_enviada: 'bg-orange-100 text-orange-800',
  em_decisao: 'bg-indigo-100 text-indigo-800',
  fechado_ganho: 'bg-green-100 text-green-800',
  fechado_perdido: 'bg-red-100 text-red-800',
};

export const leadSourceLabels: Record<LeadSource, string> = {
  instagram: 'Instagram',
  indicacao: 'Indicação',
  conteudo: 'Conteúdo',
  site: 'Site',
  outro: 'Outro',
};

export const activityTypeLabels: Record<ActivityType, string> = {
  note: 'Nota',
  call: 'Ligação',
  whatsapp: 'WhatsApp',
  meeting: 'Reunião',
  stage_change: 'Mudança de Estágio',
  created: 'Lead Criado',
};

export const activityTypeIcons: Record<ActivityType, string> = {
  note: '📝',
  call: '📞',
  whatsapp: '💬',
  meeting: '📅',
  stage_change: '🔄',
  created: '✨',
};

// Pipeline columns in order
export const pipelineColumns: LeadStatus[] = [
  'novo',
  'qualificado',
  'conversa_marcada',
  'proposta_enviada',
  'em_decisao',
  'fechado_ganho',
  'fechado_perdido',
];
