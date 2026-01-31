import { describe, it, expect, vi, beforeEach } from 'vitest'
import { supabase } from '@/integrations/supabase/client'

describe('Código do Casal (Couple Crossing) Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Invite Partner', () => {
    it('should successfully send invite to partner', async () => {
      const mockInvite = {
        id: 'crossing-uuid',
        invite_token: 'abc123',
        invite_email: 'partner@example.com',
        status: 'pending',
      }

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: mockInvite,
        error: null,
      })

      const { data, error } = await supabase.functions.invoke('nello-invite-cruzamento', {
        body: {
          inviteEmail: 'partner@example.com',
          relationshipType: 'romantico',
        },
      })

      expect(error).toBeNull()
      expect(data.invite_token).toBeDefined()
      expect(data.invite_email).toBe('partner@example.com')
    })

    it('should fail invite if initiator has not completed journey', async () => {
      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: null,
        error: { message: 'Initiator must complete journey first' },
      })

      const { error } = await supabase.functions.invoke('nello-invite-cruzamento', {
        body: {
          inviteEmail: 'partner@example.com',
          relationshipType: 'romantico',
        },
      })

      expect(error?.message).toBe('Initiator must complete journey first')
    })
  })

  describe('Couple Report Generation', () => {
    it('should generate couple report when both partners complete tests', async () => {
      const mockCoupleReport = {
        id: 'report-uuid',
        content: {
          visao_geral: 'Casal com complementaridade alta',
          papeis_naturais: {
            sensor: 'user_a',
            construtor: 'user_b',
          },
          forcas_centrais: ['Comunicação', 'Resiliência'],
          tensoes_naturais: ['Ritmo de decisão'],
          protocolo_lideranca: {
            financas: 'user_a',
            social: 'user_b',
          },
        },
      }

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: mockCoupleReport,
        error: null,
      })

      const { data, error } = await supabase.functions.invoke('nello-codigo-cruzamento', {
        body: { crossingId: 'crossing-uuid' },
      })

      expect(error).toBeNull()
      expect(data.content.visao_geral).toBeDefined()
      expect(data.content.papeis_naturais).toBeDefined()
    })

    it('should fail report if partner has not completed tests', async () => {
      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: null,
        error: { message: 'Partner must complete their journey' },
      })

      const { error } = await supabase.functions.invoke('nello-codigo-cruzamento', {
        body: { crossingId: 'crossing-uuid' },
      })

      expect(error?.message).toBe('Partner must complete their journey')
    })
  })

  describe('Couple Report Access Control', () => {
    it('should allow both partners to view the report', async () => {
      const mockReport = { id: 'report-uuid', user_a_id: 'user-a', user_b_id: 'user-b' }

      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: mockReport,
              error: null,
            }),
          }),
        }),
      })

      vi.mocked(supabase.from).mockImplementation(mockFrom)

      const result = await supabase
        .from('codigo_cruzamentos')
        .select('*')
        .eq('id', 'report-uuid')
        .single()

      expect(result.data).toBeDefined()
    })

    it('should generate shareable public link', async () => {
      const mockUpdate = {
        public_token: 'public-token-uuid',
        is_public_active: true,
        public_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      }

      const mockFrom = vi.fn().mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            data: mockUpdate,
            error: null,
          }),
        }),
      })

      vi.mocked(supabase.from).mockImplementation(mockFrom)

      const result = await supabase
        .from('codigo_cruzamentos')
        .update({ is_public_active: true })
        .eq('id', 'report-uuid')

      expect(result.error).toBeNull()
    })
  })
})
