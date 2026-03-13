import { describe, it, expect } from 'vitest'
import {
  testPrices,
  bundlePrices,
  getCurrencyForLanguage,
  validateCurrencyMatch,
  getPriceForLanguage,
  getStrictPriceId,
} from '@/lib/priceConfig'

describe('Price Configuration', () => {
  describe('Test Prices Structure', () => {
    it('should have all required products with price IDs', () => {
      const requiredProducts = [
        'arquetipos',
        'disc',
        'mbti',
        'eneagrama',
        'temperamentos',
        'linguagens_amor',
        'inteligencias_multiplas',
        'codigo_da_essencia',
        'ativacao_codigo',
      ]

      requiredProducts.forEach(product => {
        expect(testPrices[product]).toBeDefined()
        expect(testPrices[product].brl).toBeDefined()
        expect(testPrices[product].usd).toBeDefined()
        expect(testPrices[product].eur).toBeDefined()
      })
    })

    it('should have valid BRL price IDs for all products', () => {
      Object.entries(testPrices).forEach(([key, product]) => {
        if (product.brl.priceId) {
          expect(product.brl.priceId).toMatch(/^price_/)
        }
      })
    })

    it('should have valid USD price IDs for all products', () => {
      Object.entries(testPrices).forEach(([key, product]) => {
        if (product.usd.priceId) {
          expect(product.usd.priceId).toMatch(/^price_/)
        }
      })
    })

    it('should have valid EUR price IDs for all products', () => {
      Object.entries(testPrices).forEach(([key, product]) => {
        if (product.eur.priceId) {
          expect(product.eur.priceId).toMatch(/^price_/)
        }
      })
    })
  })

  describe('Bundle Prices', () => {
    it('should have bundle prices for all currencies', () => {
      expect(bundlePrices.brl.price).toBe(648.50)
      expect(bundlePrices.usd.price).toBe(198.50)
      expect(bundlePrices.eur.price).toBe(148.50)
    })

    it('should have valid bundle price IDs', () => {
      expect(bundlePrices.brl.priceId).toMatch(/^price_/)
      expect(bundlePrices.usd.priceId).toMatch(/^price_/)
      expect(bundlePrices.eur.priceId).toMatch(/^price_/)
    })
  })

  describe('Identity Couple Premium Prices', () => {
    it('should have correct high-ticket pricing', () => {
      expect(identityCouplePremiumPrices.brl.price).toBe(997)
      expect(identityCouplePremiumPrices.usd.price).toBe(297)
      expect(identityCouplePremiumPrices.eur.price).toBe(247)
    })

    it('should have installment options', () => {
      expect(identityCouplePremiumPrices.brl.installments).toBe(12)
      expect(identityCouplePremiumPrices.brl.installmentPrice).toBe(99)
    })
  })

  describe('Anti-Crosstrade Currency Functions', () => {
    it('should return correct currency for each language', () => {
      expect(getCurrencyForLanguage('pt')).toBe('BRL')
      expect(getCurrencyForLanguage('en')).toBe('USD')
      expect(getCurrencyForLanguage('pt-pt')).toBe('EUR')
    })

    it('should validate currency match correctly', () => {
      expect(validateCurrencyMatch('pt', 'BRL').valid).toBe(true)
      expect(validateCurrencyMatch('pt', 'USD').valid).toBe(false)
      expect(validateCurrencyMatch('en', 'USD').valid).toBe(true)
      expect(validateCurrencyMatch('en', 'BRL').valid).toBe(false)
      expect(validateCurrencyMatch('pt-pt', 'EUR').valid).toBe(true)
    })

    it('should return correct price for language', () => {
      const brPrice = getPriceForLanguage('disc', 'pt')
      expect(brPrice?.price).toBe(97)

      const usPrice = getPriceForLanguage('disc', 'en')
      expect(usPrice?.price).toBe(47)

      const euPrice = getPriceForLanguage('disc', 'pt-pt')
      expect(euPrice?.price).toBe(17.90)
    })

    it('should return correct activation_individual prices', () => {
      const brPrice = getPriceForLanguage('activation_individual', 'pt')
      expect(brPrice?.price).toBe(197)

      const usPrice = getPriceForLanguage('activation_individual', 'en')
      expect(usPrice?.price).toBe(57)

      const euPrice = getPriceForLanguage('activation_individual', 'pt-pt')
      expect(euPrice?.price).toBe(47)
    })

    it('should return strict price ID for language', () => {
      const brPriceId = getStrictPriceId('disc', 'pt')
      expect(brPriceId).toMatch(/^price_/)

      const usPriceId = getStrictPriceId('disc', 'en')
      expect(usPriceId).toMatch(/^price_/)
    })
  })

  describe('No Placeholder Prices', () => {
    it('should have no null price IDs in critical products', () => {
      const criticalProducts = [
        'codigo_da_essencia',
        'activation_individual',
        'identity_couple_premium',
      ]

      criticalProducts.forEach(product => {
        const prices = testPrices[product]
        expect(prices.brl.priceId).not.toBeNull()
        expect(prices.usd.priceId).not.toBeNull()
        expect(prices.eur.priceId).not.toBeNull()
      })
    })
  })
})
