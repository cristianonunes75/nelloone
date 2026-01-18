import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useCodigoEssencia } from '@/hooks/useCodigoEssencia';

export type DoorType = 'visionary' | 'seeker' | 'executor' | 'unknown';
export type NelloApp = 'identity' | 'life' | 'flow' | 'business' | 'praxis';
export type ActivityType = 'insight' | 'action' | 'milestone' | 'chat' | 'reflection';

interface UserActivity {
  app_source: NelloApp;
  activity_type: ActivityType;
  title: string;
  content: string | null;
  created_at: string;
}

interface EssenceData {
  temperamento_principal: string | null;
  perfil_disc: string | null;
  arquetipo_dominante: string | null;
  dom_essencial: string | null;
  chamado_vida: string | null;
}

export interface NelloUnifiedProfile {
  // Core Identity
  userId: string | null;
  fullName: string | null;
  
  // Essence Profile Data
  essenceData: EssenceData;
  doorType: DoorType;
  doorName: string;
  hasEssenceData: boolean;
  
  // Cross-Module Memory
  lastActivities: UserActivity[];
  lastActivityFromApp: (app: NelloApp) => UserActivity | null;
  
  // Activity Tracking
  logActivity: (activity: {
    appSource: NelloApp;
    activityType: ActivityType;
    title: string;
    content?: string;
    metadata?: Record<string, any>;
  }) => Promise<void>;
  
  // Loading State
  isLoading: boolean;
  
  // AI Context Builder
  buildAIContext: () => {
    temperamento: string | null;
    disc: string | null;
    arquetipo: string | null;
    dom: string | null;
    chamado: string | null;
    doorType: DoorType;
    recentActivities: UserActivity[];
  };
}

// Door mapping based on profiles
const VISIONARY_PROFILES = {
  disc: ['D', 'I', 'DI', 'ID'],
  archetypes: ['mago', 'amante', 'explorador', 'criador', 'heroi'],
  temperaments: ['colerico', 'sanguineo'],
};

const SEEKER_PROFILES = {
  disc: ['S', 'IS', 'SI', 'SC'],
  archetypes: ['inocente', 'cuidador', 'sabio', 'amante'],
  temperaments: ['melancolico', 'fleumatico'],
};

const EXECUTOR_PROFILES = {
  disc: ['C', 'CD', 'DC', 'CS'],
  archetypes: ['governante', 'heroi', 'cara-comum'],
  temperaments: ['fleumatico', 'colerico'],
};

const DOOR_NAMES: Record<DoorType, string> = {
  visionary: 'Visionário',
  seeker: 'Buscador',
  executor: 'Executor',
  unknown: 'Explorador',
};

function extractFromSections(sections: any[], fieldNames: string[]): string | null {
  for (const fieldName of fieldNames) {
    const section = sections?.find(s => 
      s.id?.toLowerCase().includes(fieldName.toLowerCase()) || 
      s.title?.toLowerCase().includes(fieldName.toLowerCase())
    );
    
    if (section?.content) {
      const content = typeof section.content === 'string' 
        ? section.content 
        : Array.isArray(section.content) && section.content.length > 0
          ? section.content[0]
          : null;
      
      if (content && typeof content === 'string' && content.length > 5) {
        return content.slice(0, 300);
      }
    }
  }
  return null;
}

function determineDoorType(
  disc: string | null, 
  temperament: string | null, 
  archetype: string | null
): DoorType {
  let visionaryScore = 0;
  let seekerScore = 0;
  let executorScore = 0;
  
  if (disc) {
    if (VISIONARY_PROFILES.disc.some(d => disc.toUpperCase().includes(d))) visionaryScore += 3;
    if (SEEKER_PROFILES.disc.some(d => disc.toUpperCase().includes(d))) seekerScore += 3;
    if (EXECUTOR_PROFILES.disc.some(d => disc.toUpperCase().includes(d))) executorScore += 3;
  }
  
  if (temperament) {
    const temp = temperament.toLowerCase();
    if (VISIONARY_PROFILES.temperaments.some(t => temp.includes(t))) visionaryScore += 2;
    if (SEEKER_PROFILES.temperaments.some(t => temp.includes(t))) seekerScore += 2;
    if (EXECUTOR_PROFILES.temperaments.some(t => temp.includes(t))) executorScore += 2;
  }
  
  if (archetype) {
    const arch = archetype.toLowerCase();
    if (VISIONARY_PROFILES.archetypes.some(a => arch.includes(a))) visionaryScore += 2;
    if (SEEKER_PROFILES.archetypes.some(a => arch.includes(a))) seekerScore += 2;
    if (EXECUTOR_PROFILES.archetypes.some(a => arch.includes(a))) executorScore += 2;
  }
  
  const maxScore = Math.max(visionaryScore, seekerScore, executorScore);
  
  if (maxScore === 0) return 'unknown';
  if (visionaryScore === maxScore) return 'visionary';
  if (seekerScore === maxScore) return 'seeker';
  return 'executor';
}

export function useNelloUnifiedProfile(): NelloUnifiedProfile {
  const { user, profile } = useAuth();
  const { savedCodigo, isLoading: essenceLoading } = useCodigoEssencia();
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);

  // Fetch recent activities
  useEffect(() => {
    if (!user?.id) {
      setIsLoadingActivities(false);
      return;
    }

    const fetchActivities = async () => {
      try {
        const { data } = await supabase
          .from('nello_user_activity')
          .select('app_source, activity_type, title, content, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20);
        
        if (data) {
          setActivities(data as UserActivity[]);
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setIsLoadingActivities(false);
      }
    };

    fetchActivities();
  }, [user?.id]);

  // Extract essence data from saved codigo
  const essenceData = useMemo<EssenceData>(() => {
    const sections = savedCodigo?.sections || [];
    
    return {
      temperamento_principal: extractFromSections(sections, ['temperament', 'temperamento']),
      perfil_disc: extractFromSections(sections, ['disc']),
      arquetipo_dominante: extractFromSections(sections, ['archetype', 'arquetipo']),
      dom_essencial: extractFromSections(sections, ['dom', 'talento', 'gift']),
      chamado_vida: extractFromSections(sections, ['chamado', 'calling', 'missao', 'mission']),
    };
  }, [savedCodigo]);

  // Determine door type
  const doorType = useMemo(() => {
    return determineDoorType(
      essenceData.perfil_disc,
      essenceData.temperamento_principal,
      essenceData.arquetipo_dominante
    );
  }, [essenceData]);

  const hasEssenceData = useMemo(() => {
    return !!(
      essenceData.perfil_disc || 
      essenceData.temperamento_principal || 
      essenceData.arquetipo_dominante ||
      essenceData.dom_essencial ||
      essenceData.chamado_vida
    );
  }, [essenceData]);

  // Log activity to database
  const logActivity = useCallback(async ({
    appSource,
    activityType,
    title,
    content,
    metadata,
  }: {
    appSource: NelloApp;
    activityType: ActivityType;
    title: string;
    content?: string;
    metadata?: Record<string, any>;
  }) => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('nello_user_activity')
        .insert({
          user_id: user.id,
          app_source: appSource,
          activity_type: activityType,
          title,
          content: content || null,
          metadata: metadata || {},
        })
        .select()
        .single();

      if (!error && data) {
        setActivities(prev => [data as UserActivity, ...prev.slice(0, 19)]);
      }
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }, [user?.id]);

  // Get last activity from a specific app
  const lastActivityFromApp = useCallback((app: NelloApp): UserActivity | null => {
    return activities.find(a => a.app_source === app) || null;
  }, [activities]);

  // Build AI context for edge functions
  const buildAIContext = useCallback(() => {
    return {
      temperamento: essenceData.temperamento_principal,
      disc: essenceData.perfil_disc,
      arquetipo: essenceData.arquetipo_dominante,
      dom: essenceData.dom_essencial,
      chamado: essenceData.chamado_vida,
      doorType,
      recentActivities: activities.slice(0, 5),
    };
  }, [essenceData, doorType, activities]);

  return {
    userId: user?.id || null,
    fullName: profile?.full_name || null,
    essenceData,
    doorType,
    doorName: DOOR_NAMES[doorType],
    hasEssenceData,
    lastActivities: activities,
    lastActivityFromApp,
    logActivity,
    isLoading: essenceLoading || isLoadingActivities,
    buildAIContext,
  };
}
