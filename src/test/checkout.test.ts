import { describe, it, expect, vi, beforeEach } from 'vitest'
import { supabase } from '@/integrations/supabase/client'

describe('Checkout and Purchase Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Checkout Session Creation', () => {
    it('should create checkout session for authenticated user', async () => {
      const mockCheckoutUrl = 'https://checkout.stripe.com/session/test'

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: { url: mockCheckoutUrl },
        error: null,
      })

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          priceId: 'price_1SeL7gDjhZZxZELMKuDFTI5t',
          productType: 'jornada_completa',
          currency: 'brl',
        },
      })

      expect(error).toBeNull()
      expect(data.url).toBe(mockCheckoutUrl)
    })

    it('should fail checkout for unauthenticated user', async () => {
      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: null,
        error: { message: 'User not authenticated' },
      })

      const { error } = await supabase.functions.invoke('create-checkout', {
        body: {
          priceId: 'price_1SeL7gDjhZZxZELMKuDFTI5t',
          productType: 'jornada_completa',
        },
      })

      expect(error?.message).toBe('User not authenticated')
    })

    it('should apply valid coupon to checkout', async () => {
      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: { 
          url: 'https://checkout.stripe.com/session/test',
          discountApplied: true,
          finalPrice: 197,
        },
        error: null,
      })

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          priceId: 'price_1SeL7gDjhZZxZELMKuDFTI5t',
          productType: 'jornada_completa',
          couponCode: 'DESCONTO100',
        },
      })

      expect(error).toBeNull()
      expect(data.discountApplied).toBe(true)
    })

    it('should reject invalid coupon code', async () => {
      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: null,
        error: { message: 'COUPON_INVALID', code: 'COUPON_INVALID' },
      })

      const { error } = await supabase.functions.invoke('create-checkout', {
        body: {
          priceId: 'price_1SeL7gDjhZZxZELMKuDFTI5t',
          productType: 'jornada_completa',
          couponCode: 'INVALIDO123',
        },
      })

      expect(error).toBeDefined()
      expect(error?.message).toContain('COUPON_INVALID')
    })
  })

  describe('Purchase Verification', () => {
    it('should verify successful purchase and unlock access', async () => {
      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: { 
          success: true,
          accessGranted: ['jornada_completa', 'codigo_essencia'],
        },
        error: null,
      })

      const { data, error } = await supabase.functions.invoke('verify-checkout', {
        body: { sessionId: 'cs_test_session123' },
      })

      expect(error).toBeNull()
      expect(data.success).toBe(true)
      expect(data.accessGranted).toContain('jornada_completa')
    })
  })
})
