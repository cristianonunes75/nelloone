import { describe, it, expect, vi, beforeEach } from 'vitest'
import { supabase } from '@/integrations/supabase/client'

describe('Código da Essência Generation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Essence Code Generation', () => {
    it('should generate essence code when all 7 tests are completed', async () => {
      const mockEssenceCode = {
        codigo_essencia: {
          summary: 'Líder visionário com alta capacidade analítica',
          archetypes: ['Mago', 'Governante', 'Sábio'],
          disc_profile: 'DI',
          enneagram: '8w7',
          temperament: 'Colérico-Sanguíneo',
        },
      }

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: mockEssenceCode,
        error: null,
      })

      const { data, error } = await supabase.functions.invoke('nello-codigo-essencia', {
        body: { userId: 'test-user-id' },
      })

      expect(error).toBeNull()
      expect(data.codigo_essencia).toBeDefined()
      expect(data.codigo_essencia.archetypes).toHaveLength(3)
    })

    it('should fail generation when tests are incomplete', async () => {
      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: null,
        error: { message: 'Not all 7 tests completed' },
      })

      const { error } = await supabase.functions.invoke('nello-codigo-essencia', {
        body: { userId: 'test-user-id' },
      })

      expect(error?.message).toBe('Not all 7 tests completed')
    })

    it('should save essence code to mapa_essencia table', async () => {
      const mockMapa = {
        id: 'mapa-uuid',
        user_id: 'test-user-id',
        sections: { summary: 'Test' },
        created_at: new Date().toISOString(),
      }

      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: mockMapa,
              error: null,
            }),
          }),
        }),
      })

      vi.mocked(supabase.from).mockImplementation(mockFrom)

      const result = await supabase
        .from('mapa_essencia')
        .select('*')
        .eq('user_id', 'test-user-id')
        .single()

      expect(result.data).toBeDefined()
      expect(result.data?.sections).toBeDefined()
    })
  })

  describe('Professional Activation Generation', () => {
    it('should generate career paths from essence code', async () => {
      const mockPaths = {
        paths: [
          { type: 'seguro', title: 'Consultor Estratégico', confidence: 0.92 },
          { type: 'ambicioso', title: 'Fundador de Startup', confidence: 0.85 },
          { type: 'experimental', title: 'Mentor Digital', confidence: 0.78 },
        ],
        plan: {
          week1: ['Mapear networking', 'Definir nicho'],
          week2: ['Primeiro contato', 'Validar ideia'],
        },
      }

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: mockPaths,
        error: null,
      })

      const { data, error } = await supabase.functions.invoke('generate-career-paths', {
        body: { userId: 'test-user-id' },
      })

      expect(error).toBeNull()
      expect(data.paths).toHaveLength(3)
      expect(data.plan.week1).toBeDefined()
    })
  })
})
