# 🎉 EventEase AI — Plan Smarter. Celebrate Better.

EventEase AI is an intelligent, GenAI-powered event planning platform designed to organize weddings, birthdays, anniversaries, community festivals, and corporate galas without the stress of budgets, vendors, schedules, or creative decisions.

---

## 🌟 Key Features

1. **AI Event Creation Wizard (5-Step Engine)**
   - Event Details: Occasion type, guest count, city, venue setting, date & duration.
   - Budget & Finances: Multi-currency support (INR `₹`, USD `$`, EUR `€`, GBP `£`), contingency reserve (10%), and expense priorities.
   - Style & Preferences: Curated themes, color palette swatches, cultural and regional traditions, catering styles, dietary preferences, and eco-sustainability goals.
   - Planning Preferences: DIY, hybrid, or full-service options.
   - Review & Generate: Instant Gemini AI structured planning with realistic fallback demo mode.

2. **Generative AI Event Planner & Conversational Assistant**
   - Theme concept and color palette hex harmonies.
   - Category-by-category budget allocations with priorities and rationale.
   - Milestone preparation roadmap leading up to the celebration day.
   - Vendor checklist and scope specifications.
   - Creative signature ideas and cost estimates.
   - Risk management checklist with rain contingency mitigations.
   - Integrated real-time chat assistant powered by Gemini 3.8 Flash for instant cost cuts, menu recommendations, and entertainment ideas.

3. **Smart Budget Planner (Deterministic Financial Control)**
   - Strict arithmetic guarantees:
     - `Remaining Budget = Total Budget - Total Actual Expenses`
     - `Available Planning Budget = Total Budget - Reserved Contingency`
   - Category progress tracking with visual budget overrun alerts.
   - Tracks estimated costs, actual committed expenses, deposit payments, and balance due.
   - 1-click CSV export and printable reports.

4. **Timeline & Milestone Management**
   - List View & Milestone Phase Flow.
   - Filter by status (`To Do`, `In Progress`, `Completed`) and priority (`High`, `Medium`, `Low`).
   - Task owners, deadlines, checklist toggles, and notes.

5. **Vendor Discovery & Side-by-Side Comparison**
   - Categories: Venues, Caterers, Decorators, Photographers, Videographers, Florists, Makeup, DJs & Musicians, Bakers, Transport.
   - Compare quotes, ratings, and inclusions side-by-side for up to 3 shortlisted partners.
   - Track quoted amounts, deposit advances, contract status, and lead coordinator phone numbers.

6. **Guest List & Catering RSVP Engine**
   - Attendee RSVP tracking (`Confirmed`, `Pending`, `Declined`, `Invited`).
   - Plus-one management and automated seat calculations.
   - Catering dietary tally: Vegetarian, Non-Vegetarian, Jain, Vegan, Halal, Gluten-Free.
   - Table and seating assignments.
   - Import and export guest rosters via CSV.

7. **Visual Inspiration Gallery (Pinterest-Style Moodboards)**
   - High-fidelity event photography across luxury weddings, minimalist celebrations, vibrant birthdays, and cultural festivals.
   - Harmonic color palette chips with hex swatches.
   - "Apply Theme to Active Event" updates event styling in 1 click.
   - AI Theme Moodboard Architect generates bespoke concepts from text descriptions.

8. **Event-Day Command Center (Day-Of Master Run Sheet)**
   - Hour-by-hour operational run sheet with lead coordinator names and venue zones.
   - Emergency contacts directory (Lead coordinator, venue manager, family leads).
   - Day-of vendor settlement balance reminders.
   - Print-friendly layout (`Ctrl+P` / `Cmd+P` or via the Print button).

9. **Deterministic Demo Mode & Local Persistence**
   - Fully functional without an external API key or paid subscription.
   - Pre-seeded with 3 realistic celebrations:
     - *Priya & Aarav's Royal South Indian Wedding* (Hyderabad, ₹15,00,000 budget, 300 guests)
     - *Leo's 10th Superhero Galactic Birthday* (Bengaluru, ₹1,20,000 budget, 50 guests)
     - *Diwali Community Festival of Lights* (Mumbai, ₹6,50,000 budget, 450 guests)
   - 1-click "Reset Demo Data" button to restore initial state anytime.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, TypeScript (Strict Mode), Tailwind CSS v4, Lucide Icons, Canvas Confetti
- **Backend:** Node.js, Express, tsx
- **AI Integration:** `@google/genai` TypeScript SDK (`gemini-3.8-flash`) with server-side proxy routes and resilient deterministic fallbacks
- **Architecture:** Repository pattern for storage abstraction with browser persistence and multi-event switching

---

## 🚀 Quickstart & Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file (or copy from `.env.example`):
```bash
cp .env.example .env
```
*(Optional) If you have a Gemini API key:*
```env
GEMINI_API_KEY="your-gemini-api-key-here"
```
*Note: EventEase AI functions seamlessly in demo mode even without an API key!*

### 3. Start Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 4. Run Automated Tests
```bash
npm test
```

### 5. Production Build
```bash
npm run build
npm start
```
