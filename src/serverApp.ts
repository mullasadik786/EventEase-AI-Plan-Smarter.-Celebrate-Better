import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

export const app = express();

// Request body parser with size limits
app.use(express.json({ limit: '1mb' }));

// Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'EventEase AI',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    aiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY')
  });
});

function withTimeout<T>(promise: Promise<T>, ms: number, timeoutMsg: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(timeoutMsg)), ms))
  ]);
}

// Helper to get Gemini client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

// Fallback generator for realistic deterministic event plans when offline/no API key
export function generateDeterministicPlan(params: {
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
}) {
  const type = (params.eventType || 'wedding').toLowerCase();
  const currency = params.currency || 'INR';
  const guests = params.guestCount || (type.includes('wedding') ? 250 : type.includes('birthday') ? 50 : 150);
  const budget = params.totalBudget || (currency === 'INR' ? (type.includes('wedding') ? 1200000 : 80000) : 15000);
  const contingency = Math.round(budget * 0.1);
  const allocable = budget - contingency;

  const isWedding = type.includes('wedding') || type.includes('engagement') || type.includes('anniversary');
  const isBirthday = type.includes('birthday');

  const themeName = params.theme || (isWedding ? 'Royal Heritage & Floral Elegance' : isBirthday ? 'Enchanted Golden Celebration' : 'Vibrant Community Carnival');
  const colorPalette = isWedding
    ? ['#D4AF37', '#800020', '#FFF8DC', '#2E8B57', '#FF7799']
    : isBirthday
    ? ['#5B5CF0', '#FF7799', '#F5BD55', '#CFF5E8', '#14213D']
    : ['#E65100', '#FFB300', '#2E7D32', '#5B5CF0', '#FFFFFF'];

  const categories = isWedding ? [
    { name: 'Venue & Accommodation', share: 0.28, priority: 'high', reason: 'Prime venue booking with comfortable hospitality for out-of-town guests.' },
    { name: 'Catering & Beverages', share: 0.30, priority: 'high', reason: `Multi-course feast tailored for ${guests} guests including welcome drinks and dessert counter.` },
    { name: 'Decoration & Lighting', share: 0.16, priority: 'high', reason: 'Mandap/Stage backdrop, entrance floral archway, ambient mood lighting, and table centerpieces.' },
    { name: 'Photography & Videography', share: 0.10, priority: 'medium', reason: 'Full candid coverage, drone shots, cinematic trailer, and photo album.' },
    { name: 'Attire, Jewelry & Makeup', share: 0.06, priority: 'medium', reason: 'Ceremonial bridal & groom styling plus family artist bookings.' },
    { name: 'Entertainment & Music', share: 0.05, priority: 'medium', reason: 'Live acoustic band, DJ console, sound engineering, and folk entrance troupe.' },
    { name: 'Invitations & Favors', share: 0.03, priority: 'low', reason: 'Eco-friendly printed cards, digital animated invite, and handcrafted guest favor boxes.' },
    { name: 'Miscellaneous & Logistics', share: 0.02, priority: 'low', reason: 'Guest transport shuttles, welcome kits, and emergency contingency.' }
  ] : isBirthday ? [
    { name: 'Venue Rental', share: 0.25, priority: 'high', reason: 'Party hall / lawn with dedicated kids activity zone.' },
    { name: 'Catering & Custom Cake', share: 0.35, priority: 'high', reason: 'Custom 3-tier celebration cake, finger snacks, buffet meal, and mocktails.' },
    { name: 'Theme Decor & Balloons', share: 0.18, priority: 'high', reason: 'Organic balloon garland arch, photo backdrop, and themed table arrangements.' },
    { name: 'Entertainment & Games', share: 0.12, priority: 'medium', reason: 'Game coordinator, magician / caricaturist, and music setup.' },
    { name: 'Photography', share: 0.05, priority: 'low', reason: '2-hour party photo coverage.' },
    { name: 'Favors & Goodie Bags', share: 0.05, priority: 'low', reason: 'Personalized gift hampers for young and adult guests.' }
  ] : [
    { name: 'Venue & Grounds Permit', share: 0.22, priority: 'high', reason: 'Community ground reservation, sanitation, and municipal permissions.' },
    { name: 'Stage, Light & Sound', share: 0.28, priority: 'high', reason: 'Professional stage, PA system, LED backdrop, and safety barriers.' },
    { name: 'Community Food Stalls', share: 0.25, priority: 'high', reason: 'Live snack counters and beverage distribution.' },
    { name: 'Cultural Artists & MC', share: 0.15, priority: 'medium', reason: 'Performance honorariums and master of ceremonies.' },
    { name: 'Signage & PR', share: 0.05, priority: 'low', reason: 'Banners, flyers, and volunteer badges.' },
    { name: 'Security & Medical First Aid', share: 0.05, priority: 'high', reason: 'Security personnel, first-aid tent, and crowd control.' }
  ];

  const budgetCategories = categories.map(cat => ({
    name: cat.name,
    estimatedCost: Math.round(allocable * cat.share),
    actualCost: 0,
    priority: cat.priority,
    reason: cat.reason
  }));

  const timeline = [
    { title: 'Confirm Date & Finalize Guest Capacity', dueDate: 'T-180 days', priority: 'high', status: 'completed', owner: 'Host' },
    { title: 'Shortlist & Book Anchor Venue', dueDate: 'T-150 days', priority: 'high', status: 'pending', owner: 'Host' },
    { title: 'Lock In Caterer & Menu Tasting Session', dueDate: 'T-120 days', priority: 'high', status: 'pending', owner: 'Planner' },
    { title: 'Hire Photographer & Videographer', dueDate: 'T-90 days', priority: 'medium', status: 'pending', owner: 'Host' },
    { title: 'Finalize Decor Moodboard & Florals', dueDate: 'T-60 days', priority: 'medium', status: 'pending', owner: 'Designer' },
    { title: 'Dispatch Digital & Physical Invitations', dueDate: 'T-45 days', priority: 'high', status: 'pending', owner: 'Family' },
    { title: 'Confirm Guest RSVPs & Dietary Counts', dueDate: 'T-21 days', priority: 'high', status: 'pending', owner: 'Host' },
    { title: 'Conduct Venue Walkthrough & Sound Check', dueDate: 'T-7 days', priority: 'medium', status: 'pending', owner: 'Coordinator' },
    { title: 'Prepare Day-of Run Sheet & Vendor Contacts', dueDate: 'T-3 days', priority: 'high', status: 'pending', owner: 'Lead Coordinator' },
    { title: 'Event Day Morning Final Setup', dueDate: 'T-0 days', priority: 'high', status: 'pending', owner: 'Team' }
  ];

  const vendorChecklist = [
    { category: 'Venue', status: 'shortlisted', requirements: [`Accommodates ${guests} guests`, 'Power backup generator', 'Ample valet parking'] },
    { category: 'Catering', status: 'not_started', requirements: [params.dietary || 'Customized multi-cuisine menu', 'Live counters', 'Tasting session beforehand'] },
    { category: 'Decor & Florist', status: 'not_started', requirements: ['Stage floral backdrop', 'Entrance welcome signage', 'Custom table centerpieces'] },
    { category: 'Photography', status: 'shortlisted', requirements: ['Traditional + candid coverage', 'Drone footage', 'Deliverables within 3 weeks'] },
    { category: 'Sound & Entertainment', status: 'not_started', requirements: ['Wireless microphones', 'Ambient playlist & live DJ', 'Emergency backup speaker'] }
  ];

  const creativeIdeas = [
    {
      title: 'Interactive Guest Welcome Wall',
      description: 'A botanical flower wall with polaroid photo clips where arriving guests snap a selfie and write a heartfelt congratulatory note.',
      estimatedCost: Math.round(budget * 0.015)
    },
    {
      title: 'Curated Signature Welcome Beverage',
      description: 'A bespoke cooling signature beverage served in artisanal glasses with personalized monogrammed stirrers.',
      estimatedCost: Math.round(budget * 0.02)
    },
    {
      title: 'Eco-Friendly Plantable Seed Favors',
      description: 'Seed balls or potted mini succulents in jute gift wrap as takeaway gifts that grow memories long after the event.',
      estimatedCost: Math.round(budget * 0.01)
    }
  ];

  const riskChecklist = [
    {
      risk: 'Unforeseen weather change or rain at outdoor area',
      mitigation: 'Mandate waterproof canopy stretch tent and standby indoor hall with venue manager.',
      severity: 'high'
    },
    {
      risk: 'Guest count surge beyond RSVP confirmations (+15%)',
      mitigation: 'Caterer contracted for +10% buffer food preparation with dynamic table arrangement.',
      severity: 'medium'
    },
    {
      risk: 'Power fluctuation or sound equipment trip',
      mitigation: 'Dedicated 62kVA silent generator unit and redundant cordless lapel & hand microphones.',
      severity: 'high'
    }
  ];

  const nextActions = [
    'Schedule initial site visit at shortlisted venues this week.',
    'Confirm tasting menu with caterer focusing on dietary requests.',
    'Review photographer portfolio and lock in booking deposit.'
  ];

  return {
    eventSummary: {
      title: params.eventName || `${params.eventType || 'Celebration'} Spectacular`,
      eventType: params.eventType || 'Wedding',
      date: params.date || 'Upcoming 2026',
      location: params.location || 'Hyderabad',
      theme: themeName,
      colorPalette,
      guestCount: guests,
      currency,
      vision: `A meticulously orchestrated ${params.eventType || 'event'} delivering warmth, memorable hospitality, and seamless timeline execution.`
    },
    budget: {
      total: budget,
      contingency,
      availablePlanningBudget: allocable,
      categories: budgetCategories
    },
    timeline,
    vendorChecklist,
    creativeIdeas,
    riskChecklist,
    nextActions
  };
}

// POST /api/ai/plan - Full AI Event Planning Engine
app.post('/api/ai/plan', async (req: Request, res: Response) => {
  try {
    const {
      eventName,
      eventType,
      date,
      location,
      guestCount,
      totalBudget,
      currency = 'INR',
      theme,
      culturalPreferences,
      dietary,
      specialRequirements,
      userPrompt
    } = req.body;

    const gemini = getGeminiClient();

    if (!gemini) {
      const plan = generateDeterministicPlan({
        eventName,
        eventType,
        date,
        location,
        guestCount: Number(guestCount),
        totalBudget: Number(totalBudget),
        currency,
        theme,
        culturalPreferences,
        dietary,
        specialRequirements
      });

      return res.json({
        success: true,
        plan,
        isFallback: true,
        message: 'Plan crafted using EventEase deterministic intelligence engine.'
      });
    }

    const systemPrompt = `You are EventEase AI, a world-class luxury and cultural event planner and financial strategist.
Generate a structured, deterministic JSON plan matching the requested format:
{
  "eventSummary": {
    "title": "String",
    "eventType": "String",
    "date": "String",
    "location": "String",
    "theme": "String",
    "colorPalette": ["HexColorString"],
    "guestCount": Number,
    "currency": "${currency}",
    "vision": "String"
  },
  "budget": {
    "total": Number,
    "contingency": Number,
    "availablePlanningBudget": Number,
    "categories": [
      {
        "name": "String",
        "estimatedCost": Number,
        "actualCost": 0,
        "priority": "high" | "medium" | "low",
        "reason": "String"
      }
    ]
  },
  "timeline": [
    {
      "title": "String",
      "dueDate": "String",
      "priority": "high" | "medium" | "low",
      "status": "pending" | "completed",
      "owner": "String"
    }
  ],
  "vendorChecklist": [
    {
      "category": "String",
      "status": "not_started" | "shortlisted" | "booked",
      "requirements": ["String"]
    }
  ],
  "creativeIdeas": [
    {
      "title": "String",
      "description": "String",
      "estimatedCost": Number
    }
  ],
  "riskChecklist": [
    {
      "risk": "String",
      "mitigation": "String",
      "severity": "high" | "medium" | "low"
    }
  ],
  "nextActions": ["String"]
}

Ensure all arithmetic adds up properly. Do not include markdown code block ticks in the response text if possible.`;

    const userContent = userPrompt || `Plan a ${eventType || 'event'} named "${eventName || 'My Celebration'}" in ${location || 'Hyderabad'} for ${guestCount || 200} guests.
Budget: ${currency} ${totalBudget || 1000000}.
Date: ${date || 'in 4 months'}.
Theme: ${theme || 'Elegant Traditional'}.
Cultural Preferences: ${culturalPreferences || 'Regional classic'}.
Dietary: ${dietary || 'Vegetarian and non-vegetarian mix'}.
Special Requirements: ${specialRequirements || 'Accessible seating, memorable photo ops'}.`;

    const response = await withTimeout(
      gemini.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userContent,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json'
        }
      }),
      8000,
      'Gemini planning request timed out'
    );

    const text = response.text || '';
    let parsedPlan;
    try {
      const cleanJson = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsedPlan = JSON.parse(cleanJson);
    } catch {
      parsedPlan = generateDeterministicPlan({
        eventName,
        eventType,
        date,
        location,
        guestCount: Number(guestCount),
        totalBudget: Number(totalBudget),
        currency,
        theme,
        culturalPreferences,
        dietary,
        specialRequirements
      });
    }

    return res.json({
      success: true,
      plan: parsedPlan,
      isFallback: false,
      message: 'Plan crafted by Gemini 3.8 Flash AI.'
    });

  } catch (error: any) {
    console.error('AI Planning Error:', error);
    const plan = generateDeterministicPlan(req.body);
    return res.json({
      success: true,
      plan,
      isFallback: true,
      message: 'Notice: Fallback plan activated without interruption.'
    });
  }
});

// POST /api/ai/chat - Conversational planner assistant
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  try {
    const { messages, eventContext } = req.body;
    const gemini = getGeminiClient();

    const latestMessage = messages && messages.length > 0
      ? messages[messages.length - 1].content
      : 'Help me optimize this event plan.';

    if (!gemini) {
      const query = latestMessage.toLowerCase();
      let reply = '';

      if (query.includes('save') || query.includes('reduce') || query.includes('budget') || query.includes('cost')) {
        reply = `💡 **Budget Optimization Recommendations for ${eventContext?.title || 'your event'}:**\n\n` +
          `1. **Opt for Seasonal & Locally Sourced Florals:** Replacing imported flowers with seasonal blooms cuts decor expenditure by 25-35%.\n` +
          `2. **Consolidate Vendor Packages:** Ask your photographer for a combined drone + cinematic video + candid album bundle, saving 15-20%.\n` +
          `3. **Streamline Catering Appetizers:** Keeping 4 signature hot appetizers instead of 8 reduces wasted food prep fees.\n` +
          `4. **Digital Save-The-Dates:** Send animated interactive invites on WhatsApp or email.`;
      } else if (query.includes('catering') || query.includes('food') || query.includes('menu')) {
        reply = `🍽️ **Curated Menu Recommendations:**\n\n` +
          `• **Welcome Sips:** Tender coconut punch with mint, or spiced saffron thandai shots.\n` +
          `• **Live Counters:** Artisanal chaat station, live woodfired mini kulchas or dosas.\n` +
          `• **Main Course:** Balance 2 hearty gravies, aromatic dum biryani, layered breads.\n` +
          `• **Dessert Theatre:** Hot jalebi with cold rabdi counter and artisanal gelato cups.`;
      } else {
        reply = `✨ **EventEase AI Planner Advice:**\n\n` +
          `For ${eventContext?.title || 'your celebration'}, focus on guest flow and comfort. Ensure the ceremony or main celebration begins within 20 minutes of guest arrival to keep energy high.`;
      }

      return res.json({
        success: true,
        reply,
        isFallback: true
      });
    }

    const systemPrompt = `You are EventEase AI, a witty, warm luxury event planner and budget strategist. Current event context: ${JSON.stringify(eventContext || {})}`;

    const chatResponse = await withTimeout(
      gemini.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: latestMessage,
        config: { systemInstruction: systemPrompt }
      }),
      8000,
      'Gemini chat request timed out'
    );

    return res.json({
      success: true,
      reply: chatResponse.text,
      isFallback: false
    });

  } catch (error: any) {
    return res.json({
      success: true,
      reply: "Always maintain a 10% contingency reserve for last-minute guest additions, overtime audio permits, and extra meal plates. This guarantees zero stress on the celebration day!",
      isFallback: true
    });
  }
});

// POST /api/ai/ideas - Personalized ideas generator
app.post('/api/ai/ideas', async (req: Request, res: Response) => {
  try {
    const { category, eventType, budget, guestCount } = req.body;
    const gemini = getGeminiClient();

    if (!gemini) {
      return res.json({
        success: true,
        ideas: [
          { title: 'Personalized Scent Bar', desc: 'Guests choose essential oil notes to blend their custom celebration perfume roll-on.', estimatedSavings: 'Memorable high-touch favor' },
          { title: 'Interactive Live Acoustic Corner', desc: 'A duo playing gentle acoustic renditions during cocktail hour.', estimatedSavings: 'Budget-friendly alternative to full band' },
          { title: 'Midnight Snack Food Truck / Street Cart', desc: 'Surprise guests at 11 PM with warm mini sliders or churros.', estimatedSavings: 'Delights guests without full buffet overtime' },
          { title: 'Digital Memory Tree', desc: 'A display screen showing real-time guest uploads tagged with your event QR code.', estimatedSavings: 'Zero printing cost' }
        ],
        isFallback: true
      });
    }

    const prompt = `Suggest 4 distinctive ideas for event category: "${category || 'decor & entertainment'}" for a ${eventType || 'celebration'} with ${guestCount || 100} guests and budget ${budget || 'moderate'}. Return JSON array with keys: "title", "desc", "estimatedSavings".`;

    const response = await gemini.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    const parsed = JSON.parse(response.text || '[]');
    return res.json({ success: true, ideas: parsed, isFallback: false });
  } catch (err) {
    return res.json({
      success: true,
      ideas: [
        { title: 'Curated Welcome Station', desc: 'Artisanal sips and handwritten guest cards upon entry.', estimatedSavings: 'High perceived value' },
        { title: 'Vintage Photo Booth', desc: 'Retro camera props with immediate takeaway strips.', estimatedSavings: 'Doubles as favor & entertainment' }
      ],
      isFallback: true
    });
  }
});
