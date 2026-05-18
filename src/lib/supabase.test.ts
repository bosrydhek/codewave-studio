import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  getUserProfile,
  syncUserData
} from '../lib/supabase'
import { supabase } from '../lib/supabase'

// Mock the underlying Supabase client creator
vi.mock('@/utils/supabase/client', () => {
  const mockSupabase = {
    auth: {
      getUser: vi.fn(),
      signUp: vi.fn(),
      signInWithOtp: vi.fn(),
      signInWithOAuth: vi.fn(),
      signInWithPassword: vi.fn(),
    },
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    upsert: vi.fn().mockReturnThis(),
  }
  return {
    createClient: () => mockSupabase,
  }
})

describe('Supabase Data Layer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it.skip('getUserProfile should fetch profile for authenticated user', async () => {
    const mockUser = { id: '123', email: 'test@example.com' }
    const mockProfile = { id: '123', settings: { theme: 'dark' } }

    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: { user: mockUser as any },
      error: null,
    })

    vi.mocked(supabase.from).mockReturnValue({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: mockProfile, error: null }),
        }),
      }),
    } as any)

    const profile = await getUserProfile()
    expect(profile).toEqual(mockProfile)
    expect(supabase.auth.getUser).toHaveBeenCalled()
  })

  it.skip('syncUserData should upsert data for authenticated user', async () => {
    const mockUser = { id: '123', email: 'test@example.com' }

    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: { user: mockUser as any },
      error: null,
    })

    const selectSpy = vi.fn().mockResolvedValue({ data: { id: '123' }, error: null })
    const upsertSpy = vi.fn().mockReturnValue({ select: selectSpy })

    vi.mocked(supabase.from).mockReturnValue({
      upsert: upsertSpy,
    } as any)

    await syncUserData({ theme: 'light' }, [])

    expect(upsertSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: '123',
        settings: { theme: 'light' },
      }),
    )
    expect(selectSpy).toHaveBeenCalled()
  })
})
