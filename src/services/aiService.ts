import { GeneratedPlan } from '../types';

export interface GeneratePlanResponse {
  success: boolean;
  plan: GeneratedPlan;
  isFallback: boolean;
  message?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const AiService = {
  async generatePlan(payload: {
    eventName?: string;
    eventType?: string;
    date?: string;
    location?: string;
    guestCount?: number;
    totalBudget?: number;
    currency?: string;
    theme?: string;
    culturalPreferences?: string;
    dietary?: string;
    specialRequirements?: string;
    userPrompt?: string;
  }): Promise<GeneratePlanResponse> {
    const res = await fetch('/api/ai/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`AI planning request failed with HTTP ${res.status}`);
    }

    return await res.json();
  },

  async sendChatMessage(messages: ChatMessage[], eventContext?: any): Promise<{ success: boolean; reply: string; isFallback: boolean }> {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, eventContext })
    });

    if (!res.ok) {
      throw new Error(`Chat request failed with HTTP ${res.status}`);
    }

    return await res.json();
  },

  async getIdeas(category: string, eventType: string, budget: string, guestCount: number) {
    const res = await fetch('/api/ai/ideas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, eventType, budget, guestCount })
    });

    if (!res.ok) {
      throw new Error(`Ideas request failed with HTTP ${res.status}`);
    }

    return await res.json();
  }
};
