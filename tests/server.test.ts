import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';

vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: class {
      models = {
        generateContent: vi.fn().mockImplementation(async ({ config }) => {
          if (config?.responseMimeType === 'application/json') {
            return {
              text: JSON.stringify({
                eventSummary: {
                  title: 'Test Anniversary Celebration',
                  eventType: 'Anniversary',
                  date: '2027-01-15',
                  location: 'Goa Beach Resort',
                  theme: 'Coastal Sunset Romance',
                  colorPalette: ['#FF7799', '#5B5CF0'],
                  guestCount: 100,
                  currency: 'INR',
                  vision: 'An unforgettable celebration.'
                },
                budget: {
                  total: 800000,
                  contingency: 80000,
                  availablePlanningBudget: 720000,
                  categories: [
                    { name: 'Venue', estimatedCost: 300000, actualCost: 0, priority: 'high', reason: 'Beachfront resort' }
                  ]
                },
                timeline: [
                  { title: 'Book Venue', dueDate: '2026-12-01', priority: 'high', status: 'pending', owner: 'Host' }
                ],
                vendorChecklist: [
                  { category: 'Venue', status: 'shortlisted', requirements: ['Beach access'] }
                ],
                creativeIdeas: [
                  { title: 'Sunset Mocktails', description: 'Tropical mocktails', estimatedCost: 40000 }
                ],
                riskChecklist: [
                  { risk: 'High tide', mitigation: 'Indoor ballroom backup', severity: 'medium' }
                ],
                nextActions: ['Finalize catering menu']
              })
            };
          }
          return {
            text: '💡 Consider seasonal florals and package bundling to save up to 25% on your budget.'
          };
        })
      };
    }
  };
});

import { app } from '../src/serverApp';

describe('Server API Endpoints', () => {
  it('GET /api/health returns status 200 and application health metadata', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.app).toBe('EventEase AI');
    expect(res.body.version).toBeDefined();
  });

  it('POST /api/ai/plan generates structured plan with fallback support', async () => {
    const res = await request(app)
      .post('/api/ai/plan')
      .send({
        eventName: 'Test Anniversary Celebration',
        eventType: 'Anniversary',
        date: '2027-01-15',
        location: 'Goa Beach Resort',
        guestCount: 100,
        totalBudget: 800000,
        currency: 'INR',
        theme: 'Coastal Sunset Romance'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.plan).toBeDefined();
    expect(res.body.plan.eventSummary.title).toBe('Test Anniversary Celebration');
    expect(res.body.plan.budget.total).toBe(800000);
    expect(res.body.plan.budget.contingency).toBe(80000); // 10%
  });

  it('POST /api/ai/chat returns helpful advice for budget optimization query', async () => {
    const res = await request(app)
      .post('/api/ai/chat')
      .send({
        messages: [{ role: 'user', content: 'How can I save budget on wedding florals?' }],
        eventContext: { title: 'Priya & Aarav Wedding', totalBudget: 1500000 }
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.reply).toBeTruthy();
  });
});
