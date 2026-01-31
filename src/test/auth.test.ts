import { describe, it, expect, vi, beforeEach } from 'vitest'
import { supabase } from '@/integrations/supabase/client'

describe('Authentication Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('User Registration', () => {
    it('should successfully register a new user with valid credentials', async () => {
      const mockUser = { id: 'test-uuid', email: 'test@example.com' }
      
      vi.mocked(supabase.auth.signUp).mockResolvedValueOnce({
        data: { user: mockUser, session: null },
        error: null,
      } as any)

      const { data, error } = await supabase.auth.signUp({
        email: 'test@example.com',
        password: 'SecurePassword123!',
      })

      expect(error).toBeNull()
      expect(data.user).toBeDefined()
      expect(data.user?.email).toBe('test@example.com')
    })

    it('should fail registration with weak password', async () => {
      vi.mocked(supabase.auth.signUp).mockResolvedValueOnce({
        data: { user: null, session: null },
        error: { message: 'Password should be at least 6 characters' },
      } as any)

      const { data, error } = await supabase.auth.signUp({
        email: 'test@example.com',
        password: '123',
      })

      expect(error).toBeDefined()
      expect(data.user).toBeNull()
    })

    it('should fail registration with duplicate email', async () => {
      vi.mocked(supabase.auth.signUp).mockResolvedValueOnce({
        data: { user: null, session: null },
        error: { message: 'User already registered' },
      } as any)

      const { error } = await supabase.auth.signUp({
        email: 'existing@example.com',
        password: 'SecurePassword123!',
      })

      expect(error?.message).toBe('User already registered')
    })
  })

  describe('User Login', () => {
    it('should successfully login with valid credentials', async () => {
      const mockSession = {
        access_token: 'test-token',
        user: { id: 'test-uuid', email: 'test@example.com' },
      }

      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValueOnce({
        data: { session: mockSession, user: mockSession.user },
        error: null,
      } as any)

      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'SecurePassword123!',
      })

      expect(error).toBeNull()
      expect(data.session).toBeDefined()
      expect(data.session?.access_token).toBe('test-token')
    })

    it('should fail login with invalid credentials', async () => {
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValueOnce({
        data: { session: null, user: null },
        error: { message: 'Invalid login credentials' },
      } as any)

      const { error } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'wrongpassword',
      })

      expect(error?.message).toBe('Invalid login credentials')
    })
  })

  describe('User Logout', () => {
    it('should successfully logout user', async () => {
      vi.mocked(supabase.auth.signOut).mockResolvedValueOnce({
        error: null,
      } as any)

      const { error } = await supabase.auth.signOut()

      expect(error).toBeNull()
    })
  })
})
