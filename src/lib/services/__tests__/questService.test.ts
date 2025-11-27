import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createQuest, getQuest, publishQuest } from '../questService';
import { supabase } from '../../supabase';

// Mock Supabase
vi.mock('../../supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe('questService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createQuest', () => {
    it('should create a quest with default values', async () => {
      const mockQuest = {
        id: '123',
        creator_id: 'user-123',
        title: 'Test Quest',
        quest_type: 'christmas_calendar',
        status: 'draft',
        is_public: true,
        requires_auth: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const mockInsert = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: mockQuest, error: null }),
        }),
      });

      (supabase.from as any).mockReturnValue({
        insert: mockInsert,
      });

      const result = await createQuest({
        creator_id: 'user-123',
        title: 'Test Quest',
        quest_type: 'christmas_calendar',
      });

      expect(result).toEqual(mockQuest);
      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Quest',
          quest_type: 'christmas_calendar',
          status: 'draft',
          is_public: true,
          requires_auth: false,
        })
      );
    });
  });

  describe('getQuest', () => {
    it('should return null when quest not found', async () => {
      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { code: 'PGRST116' },
          }),
        }),
      });

      (supabase.from as any).mockReturnValue({
        select: mockSelect,
      });

      const result = await getQuest('non-existent-id');

      expect(result).toBeNull();
    });
  });
});

