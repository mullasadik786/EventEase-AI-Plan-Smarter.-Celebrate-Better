import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AiService } from '../src/services/aiService';

describe('AiService API Client', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('calls /api/ai/plan with correct payload structure', async () => {
    const mockPlan = {
      eventSummary: {
        title: 'Golden Jubilee Celebration',
        eventType: 'Anniversary',
        date: '2026-11-20',
        location: 'Mumbai',
        theme: 'Vintage Gold & Ivory',
        colorPalette: ['#D4AF37', '#FFF8DC'],
        guestCount: 120,
        currency: 'INR' as const,
        vision: 'Grand 50th golden anniversary celebration',
      },
      budget: {
        total: 800000,
        contingency: 80000,
        availablePlanningBudget: 720000,
        categories: [],
      },
      timeline: [],
      vendorChecklist: [],
      creativeIdeas: [],
      riskChecklist: [],
      nextActions: [],
    };

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        plan: mockPlan,
        isFallback: false,
      }),
    } as any);

    const res = await AiService.generatePlan({
      eventName: 'Golden Jubilee Celebration',
      eventType: 'Anniversary',
      totalBudget: 800000,
      currency: 'INR',
    });

    expect(fetchSpy).toHaveBeenCalledWith(
      '/api/ai/plan',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
    );
    expect(res.success).toBe(true);
    expect(res.plan.eventSummary.title).toBe('Golden Jubilee Celebration');
  });

  it('handles chat messages and queries through /api/ai/chat', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        reply: 'Consider replacing imported orchids with seasonal marigolds to save 30%.',
        isFallback: false,
      }),
    } as any);

    const res = await AiService.sendChatMessage([
      { role: 'user', content: 'How can I save on florals?' },
    ]);

    expect(fetchSpy).toHaveBeenCalledWith(
      '/api/ai/chat',
      expect.objectContaining({ method: 'POST' })
    );
    expect(res.reply).toContain('marigolds');
  });

  it('fetches category inspiration ideas through /api/ai/ideas', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        ideas: [{ title: 'Scent Bar', desc: 'Custom fragrance station' }],
        isFallback: false,
      }),
    } as any);

    const res = await AiService.getIdeas('decor', 'wedding', 'moderate', 150);

    expect(fetchSpy).toHaveBeenCalledWith(
      '/api/ai/ideas',
      expect.objectContaining({ method: 'POST' })
    );
    expect(res.ideas.length).toBe(1);
  });
});
