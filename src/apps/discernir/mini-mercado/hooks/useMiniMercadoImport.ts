import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { extractFromFiles } from '../utils/fileExtract';
import type { MMServoKind } from '../types';

export interface ImportPerson {
  name: string;
  nickname?: string | null;
  phone?: string | null;
  birth_date?: string | null;
  wedding_date?: string | null;
  kind?: MMServoKind;
  role?: string | null;
  spouse_name?: string | null;
  include?: boolean; // marcado na revisao
}

export interface ImportTeam {
  name: string;
  people: ImportPerson[];
}

export interface ParseResult {
  teams: ImportTeam[];
  warnings: string[];
}

const norm = (s: string) => (s || '').trim().toLowerCase();

export function useMiniMercadoImport(eventId: string | null) {
  const qc = useQueryClient();

  // Le os arquivos no cliente e manda pra IA estruturar.
  const parseFiles = async (files: File[], movementHint?: string | null): Promise<ParseResult> => {
    const { text, images, warnings } = await extractFromFiles(files);
    if (!text && images.length === 0) {
      throw new Error('Nenhum conteúdo legível nos arquivos enviados.');
    }
    const { data, error } = await supabase.functions.invoke('mm-import-roster', {
      body: { text, images, movementHint: movementHint || null },
    });
    if (error) throw error;
    if (!data?.success) throw new Error(data?.error || 'Não consegui ler o arquivo.');
    const teams: ImportTeam[] = (data.teams || []).map((t: any) => ({
      name: t.name || 'Sem equipe',
      people: (t.people || []).map((p: any) => ({
        name: p.name || '',
        nickname: p.nickname || null,
        phone: p.phone || null,
        birth_date: p.birth_date || null,
        wedding_date: p.wedding_date || null,
        kind: (p.kind as MMServoKind) || 'individual',
        role: p.role || null,
        spouse_name: p.spouse_name || null,
        include: !!(p.name && p.name.trim()),
      })),
    }));
    return { teams, warnings };
  };

  // Grava as equipes/trabalhadores revisados e vincula conjuges.
  const commit = async (teams: ImportTeam[]) => {
    if (!eventId) throw new Error('Sem retiro ativo');

    // 1. Equipes existentes -> mapa nome->id
    const { data: existingTeams } = await (supabase as any)
      .from('mm_teams')
      .select('id, name')
      .eq('event_id', eventId);
    const teamMap = new Map<string, string>();
    (existingTeams || []).forEach((t: any) => teamMap.set(norm(t.name), t.id));

    // Cria equipes que faltam
    const teamsToCreate = teams.filter((t) => t.name && !teamMap.has(norm(t.name)));
    if (teamsToCreate.length) {
      const { data: created, error } = await (supabase as any)
        .from('mm_teams')
        .insert(teamsToCreate.map((t) => ({ event_id: eventId, name: t.name.trim() })))
        .select('id, name');
      if (error) throw error;
      (created || []).forEach((t: any) => teamMap.set(norm(t.name), t.id));
    }

    // 2. Servos existentes (evita duplicar em reimportacao)
    const { data: existingServos } = await (supabase as any)
      .from('mm_servos')
      .select('id, name')
      .eq('event_id', eventId);
    const servoIdByName = new Map<string, string>();
    (existingServos || []).forEach((s: any) => servoIdByName.set(norm(s.name), s.id));

    // 3. Monta linhas a inserir (so quem foi marcado e ainda nao existe)
    const spousePairs: { name: string; spouse: string }[] = [];
    const rows: any[] = [];
    for (const team of teams) {
      const teamId = teamMap.get(norm(team.name)) || null;
      for (const p of team.people) {
        if (!p.include || !p.name?.trim()) continue;
        if (p.spouse_name) spousePairs.push({ name: norm(p.name), spouse: norm(p.spouse_name) });
        if (servoIdByName.has(norm(p.name))) continue; // ja existe
        rows.push({
          event_id: eventId,
          team_id: teamId,
          name: p.name.trim(),
          nickname: p.nickname?.trim() || null,
          phone: p.phone?.trim() || null,
          kind: p.kind || 'individual',
          birth_date: p.birth_date || null,
          wedding_date: p.wedding_date || null,
        });
      }
    }

    let inserted = 0;
    if (rows.length) {
      const { data: ins, error } = await (supabase as any)
        .from('mm_servos')
        .insert(rows)
        .select('id, name');
      if (error) throw error;
      inserted = ins?.length || 0;
      (ins || []).forEach((s: any) => servoIdByName.set(norm(s.name), s.id));
    }

    // 4. Vincula conjuges (spouse_servo_id nos dois lados)
    let linked = 0;
    for (const pair of spousePairs) {
      const selfId = servoIdByName.get(pair.name);
      const spouseId = servoIdByName.get(pair.spouse);
      if (selfId && spouseId) {
        const { error } = await (supabase as any)
          .from('mm_servos')
          .update({ spouse_servo_id: spouseId })
          .eq('id', selfId);
        if (!error) linked++;
      }
    }

    qc.invalidateQueries({ queryKey: ['mm', 'servos', eventId] });
    qc.invalidateQueries({ queryKey: ['mm', 'teams', eventId] });

    return { inserted, teamsCreated: teamsToCreate.length, linked };
  };

  return { parseFiles, commit };
}
