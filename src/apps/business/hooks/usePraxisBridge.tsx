/**
 * Hook for managing the Praxis-Business bridge.
 * Handles company_operators, company_programs, company_program_members.
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useOperatorWorkspace } from './useOperatorWorkspace';
import { useBusinessAuth } from './useBusinessAuth';
import { toast } from 'sonner';

// ─── Types ────────────────────────────────────────────────────

export interface CompanyOperator {
  id: string;
  company_id: string;
  operator_workspace_id: string;
  role_in_company: string;
  status: string;
  started_at: string;
  created_at: string;
  updated_at: string;
}

export interface CompanyProgram {
  id: string;
  company_id: string;
  operator_workspace_id: string;
  program_name: string;
  description: string | null;
  methodology_name: string | null;
  start_date: string | null;
  end_date: string | null;
  status: string;
  max_participants: number | null;
  created_at: string;
  updated_at: string;
}

export interface CompanyProgramMember {
  id: string;
  company_program_id: string;
  user_id: string;
  consent_status: string;
  consent_given_at: string | null;
  consent_revoked_at: string | null;
  joined_at: string;
  created_at: string;
  updated_at: string;
}

// ─── Hook: Operator's company view (Praxis side) ──────────────

export function useOperatorCompanies() {
  const { workspace } = useOperatorWorkspace();
  const [assignments, setAssignments] = useState<CompanyOperator[]>([]);
  const [programs, setPrograms] = useState<CompanyProgram[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!workspace?.id) {
      setAssignments([]);
      setPrograms([]);
      setIsLoading(false);
      return;
    }

    try {
      const [assignRes, progRes] = await Promise.all([
        supabase
          .from('company_operators')
          .select('*')
          .eq('operator_workspace_id', workspace.id)
          .eq('status', 'active'),
        supabase
          .from('company_programs')
          .select('*')
          .eq('operator_workspace_id', workspace.id)
          .order('created_at', { ascending: false }),
      ]);

      if (assignRes.error) throw assignRes.error;
      if (progRes.error) throw progRes.error;

      setAssignments((assignRes.data || []) as CompanyOperator[]);
      setPrograms((progRes.data || []) as CompanyProgram[]);
    } catch (err) {
      console.error('Error fetching operator companies:', err);
    } finally {
      setIsLoading(false);
    }
  }, [workspace?.id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const createProgram = async (data: Partial<CompanyProgram>): Promise<CompanyProgram | null> => {
    if (!workspace?.id) return null;
    try {
      const { data: newProg, error } = await supabase
        .from('company_programs')
        .insert({
          company_id: data.company_id!,
          operator_workspace_id: workspace.id,
          program_name: data.program_name || '',
          description: data.description,
          methodology_name: data.methodology_name,
          start_date: data.start_date,
          end_date: data.end_date,
          status: data.status || 'draft',
          max_participants: data.max_participants,
        })
        .select()
        .single();
      if (error) throw error;
      const prog = newProg as CompanyProgram;
      setPrograms(prev => [prog, ...prev]);
      toast.success('Programa criado');
      return prog;
    } catch (err) {
      console.error('Error creating program:', err);
      toast.error('Erro ao criar programa');
      return null;
    }
  };

  return { assignments, programs, isLoading, refetch: fetchData, createProgram };
}

// ─── Hook: Program members (used by both sides) ──────────────

export function useProgramMembers(programId: string | null) {
  const [members, setMembers] = useState<CompanyProgramMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMembers = useCallback(async () => {
    if (!programId) {
      setMembers([]);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('company_program_members')
        .select('*')
        .eq('company_program_id', programId)
        .order('joined_at', { ascending: false });

      if (error) throw error;
      setMembers((data || []) as CompanyProgramMember[]);
    } catch (err) {
      console.error('Error fetching members:', err);
    } finally {
      setIsLoading(false);
    }
  }, [programId]);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  const addMember = async (userId: string): Promise<boolean> => {
    if (!programId) return false;
    try {
      const { error } = await supabase
        .from('company_program_members')
        .insert({
          company_program_id: programId,
          user_id: userId,
          consent_status: 'pending',
        });
      if (error) throw error;
      await fetchMembers();
      toast.success('Colaborador adicionado ao programa');
      return true;
    } catch (err) {
      console.error('Error adding member:', err);
      toast.error('Erro ao adicionar colaborador');
      return false;
    }
  };

  return { members, isLoading, refetch: fetchMembers, addMember };
}

// ─── Hook: Company programs (Business side) ────────────────────

export function useCompanyPrograms(companyId: string | null) {
  const [programs, setPrograms] = useState<CompanyProgram[]>([]);
  const [operators, setOperators] = useState<CompanyOperator[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!companyId) {
      setPrograms([]);
      setOperators([]);
      setIsLoading(false);
      return;
    }

    try {
      const [progRes, opsRes] = await Promise.all([
        supabase
          .from('company_programs')
          .select('*')
          .eq('company_id', companyId)
          .order('created_at', { ascending: false }),
        supabase
          .from('company_operators')
          .select('*')
          .eq('company_id', companyId),
      ]);

      if (progRes.error) throw progRes.error;
      if (opsRes.error) throw opsRes.error;

      setPrograms((progRes.data || []) as CompanyProgram[]);
      setOperators((opsRes.data || []) as CompanyOperator[]);
    } catch (err) {
      console.error('Error fetching company programs:', err);
    } finally {
      setIsLoading(false);
    }
  }, [companyId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { programs, operators, isLoading, refetch: fetchData };
}
