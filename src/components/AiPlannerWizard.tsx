import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Calendar,
  DollarSign,
  Palette,
  ClipboardList,
  Check,
  Loader2,
  X,
  HeartHandshake,
  ShieldAlert,
  Flame
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AppEvent, Currency, EventType, GeneratedPlan } from '../types';
import { AiService } from '../services/aiService';
import { formatCurrency } from '../lib/formatters';

interface AiPlannerWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: (event: AppEvent, generatedPlan?: GeneratedPlan) => void;
  initialType?: EventType;
}

export const AiPlannerWizard: React.FC<AiPlannerWizardProps> = ({
  isOpen,
  onClose,
  onEventCreated,
  initialType = 'Wedding'
}) => {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Form State
  // Step 1: Details
  const [eventName, setEventName] = useState('');
  const [eventType, setEventType] = useState<EventType>(initialType);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00 AM - 10:00 PM');
  const [city, setCity] = useState('Hyderabad');
  const [location, setLocation] = useState('');
  const [venueType, setVenueType] = useState<'Indoor' | 'Outdoor' | 'Hybrid'>('Hybrid');
  const [guestCount, setGuestCount] = useState<number>(200);
  const [language, setLanguage] = useState('English & Regional');

  // Step 2: Budget & Finances
  const [currency, setCurrency] = useState<Currency>('INR');
  const [totalBudget, setTotalBudget] = useState<number>(1200000);
  const [spendingLevel, setSpendingLevel] = useState<'Budget' | 'Moderate' | 'Premium' | 'Luxury'>('Premium');
  const [budgetFlexibility, setBudgetFlexibility] = useState<'Strict' | 'Moderate (±10%)' | 'Flexible'>('Moderate (±10%)');
  const [contingencyPercent, setContingencyPercent] = useState<number>(10);
  const [expensePriorities, setExpensePriorities] = useState<string[]>([
    'Venue & Hospitality',
    'Catering & Live Counters',
    'Stage Decor & Florals'
  ]);

  // Step 3: Style & Preferences
  const [theme, setTheme] = useState('Traditional Heritage with Modern Florals');
  const [style, setStyle] = useState('Traditional Royal');
  const [culturalPreferences, setCulturalPreferences] = useState('Vedic South Indian ceremonies with evening reception');
  const [foodPreferences, setFoodPreferences] = useState('Pure vegetarian feast with live dessert theatre');
  const [dietary, setDietary] = useState('Vegetarian, Jain counter, Gluten-Free options');
  const [accessibility, setAccessibility] = useState('Wheelchair ramp for elders & ground level seating');
  const [musicPreferences, setMusicPreferences] = useState('Live acoustic instruments + evening DJ console');
  const [sustainability, setSustainability] = useState('Eco-friendly banana leaf dining & seed-paper invites');
  const [colorPalette, setColorPalette] = useState<string[]>([
    '#D4AF37', '#800020', '#FFF8DC', '#2E8B57', '#FF7799'
  ]);

  // Step 4: Planning Preferences
  const [diyVsPro, setDiyVsPro] = useState<'DIY' | 'Hybrid' | 'Full Service'>('Full Service');
  const [specialRequirements, setSpecialRequirements] = useState(
    'Candid cinematic drone video, memorable guest photo-op booth, backup rain canopy'
  );

  // Quick Preset Handlers
  const handleApplyPreset = (type: EventType) => {
    setEventType(type);
    if (type === 'Wedding') {
      setEventName('Priya & Rohan’s Royal Wedding');
      setTotalBudget(1500000);
      setGuestCount(300);
      setTheme('Royal Indian Heritage & Temple Florals');
      setStyle('Traditional Royal');
      setColorPalette(['#D4AF37', '#800020', '#FFF8DC', '#2E8B57', '#FF7799']);
    } else if (type === 'Birthday') {
      setEventName('Aarav’s 10th Cosmic Adventure Birthday');
      setTotalBudget(120000);
      setGuestCount(50);
      setTheme('Galactic Superhero & Laser Quest');
      setStyle('Playful & Energetic');
      setColorPalette(['#5B5CF0', '#FF7799', '#00F0FF', '#F5BD55', '#14213D']);
    } else if (type === 'Community Festival') {
      setEventName('Diwali Festival of Lights Gala');
      setTotalBudget(600000);
      setGuestCount(400);
      setTheme('Luminescence & Floral Rangoli');
      setStyle('Festive Cultural');
      setColorPalette(['#FF9933', '#138808', '#D4AF37', '#5B5CF0', '#FFFFFF']);
    }
  };

  const handleGeneratePlan = async () => {
    setLoading(true);
    setErrorNotice(null);

    const targetDate = date || new Date(Date.now() + 120 * 24 * 3600 * 1000).toISOString().split('T')[0];
    const targetName = eventName || `${eventType} Celebration`;

    try {
      const response = await AiService.generatePlan({
        eventName: targetName,
        eventType,
        date: targetDate,
        location: location || `${city} Selected Venue`,
        guestCount,
        totalBudget,
        currency,
        theme,
        culturalPreferences,
        dietary,
        specialRequirements
      });

      const newEvent: AppEvent = {
        id: `evt-${Date.now()}`,
        title: targetName,
        eventType,
        date: targetDate,
        time,
        city,
        location: location || `${city} Premium Venue`,
        venueType,
        guestCount,
        currency,
        totalBudget,
        contingencyPercent,
        theme,
        colorPalette,
        vision: response.plan?.eventSummary?.vision || `A magnificently coordinated ${eventType} celebration.`,
        coverImage: eventType.includes('Wedding')
          ? 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'
          : eventType.includes('Birthday')
          ? 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80'
          : 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
        status: 'Planning',
        culturalPreferences,
        dietary,
        style,
        planningPreferences: {
          diyVsPro,
          priorities: expensePriorities
        },
        emergencyContacts: [
          { name: 'Lead Host', role: 'Main Organizer', phone: '+91 98000 00000' },
          { name: 'Venue Manager', role: 'Operations', phone: '+91 99000 00000' }
        ],
        generatedPlan: response.plan,
        createdAt: new Date().toISOString()
      };

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}

      onEventCreated(newEvent, response.plan);
      onClose();
    } catch (err: any) {
      console.error('Plan generation failed:', err);
      setErrorNotice('Notice: Error connecting to live AI provider. Using resilient local fallback plan.');
      // Fallback local save
      const fallbackEvent: AppEvent = {
        id: `evt-${Date.now()}`,
        title: targetName,
        eventType,
        date: targetDate,
        time,
        city,
        location: location || `${city} Venue`,
        venueType,
        guestCount,
        currency,
        totalBudget,
        contingencyPercent,
        theme,
        colorPalette,
        vision: `A beautifully organized ${eventType} in ${city} for ${guestCount} guests.`,
        coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
        status: 'Planning',
        culturalPreferences,
        dietary,
        style,
        planningPreferences: { diyVsPro, priorities: expensePriorities },
        emergencyContacts: [{ name: 'Lead Organizer', role: 'Host', phone: '+91 98000 00000' }],
        createdAt: new Date().toISOString()
      };
      onEventCreated(fallbackEvent);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Wizard Header */}
        <div className="p-6 bg-gradient-to-r from-[#14213D] via-[#1D2D50] to-[#14213D] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#5B5CF0] to-[#FF7799] flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-heading">
                AI Event Creation Wizard
              </h2>
              <p className="text-xs text-slate-300">
                Step {step} of 5 • {
                  step === 1 ? 'Event Details' :
                  step === 2 ? 'Budget & Finances' :
                  step === 3 ? 'Style & Preferences' :
                  step === 4 ? 'Planning Preferences' :
                  'Review & Generate Plan'
                }
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5 shrink-0">
          <div
            className="bg-gradient-to-r from-[#5B5CF0] to-[#FF7799] h-1.5 transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Wizard Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-sm">
          {errorNotice && (
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{errorNotice}</span>
            </div>
          )}

          {/* ================= STEP 1: EVENT DETAILS ================= */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Presets Bar */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Quick Load Demo Template
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('Wedding')}
                    className="px-3 py-1.5 rounded-lg border text-xs font-semibold bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 transition cursor-pointer"
                  >
                    💍 South Indian Wedding
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('Birthday')}
                    className="px-3 py-1.5 rounded-lg border text-xs font-semibold bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 transition cursor-pointer"
                  >
                    🎂 Superhero Birthday
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('Community Festival')}
                    className="px-3 py-1.5 rounded-lg border text-xs font-semibold bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 transition cursor-pointer"
                  >
                    🪔 Diwali Festival
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Event Name *
                  </label>
                  <input
                    type="text"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="e.g. Priya & Aarav's Royal Wedding"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5B5CF0] text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Event Type *
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => handleApplyPreset(e.target.value as EventType)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5B5CF0] text-sm bg-white"
                  >
                    <option value="Wedding">Wedding</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Engagement">Engagement</option>
                    <option value="Anniversary">Anniversary</option>
                    <option value="Baby Shower">Baby Shower</option>
                    <option value="Graduation">Graduation Party</option>
                    <option value="Community Festival">Community Festival</option>
                    <option value="Fundraiser">Fundraiser</option>
                    <option value="Corporate Event">Corporate Event</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Target Date *
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5B5CF0] text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Event Timing / Duration
                  </label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g. 09:00 AM - 10:00 PM"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5B5CF0] text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    City / Destination *
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Hyderabad, Bengaluru, Mumbai"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5B5CF0] text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Specific Venue / Area (Optional)
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Taj Falaknuma Lawns"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5B5CF0] text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Estimated Guest Count *
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={5000}
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5B5CF0] text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Setting Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Indoor', 'Outdoor', 'Hybrid'] as const).map((vt) => (
                      <button
                        key={vt}
                        type="button"
                        onClick={() => setVenueType(vt)}
                        className={`py-2 text-xs font-semibold rounded-lg border transition cursor-pointer ${
                          venueType === vt
                            ? 'bg-[#5B5CF0] text-white border-[#5B5CF0]'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {vt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 2: BUDGET & FINANCES ================= */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-[#5B5CF0] shrink-0 mt-0.5" />
                <p className="text-xs text-slate-700">
                  EventEase AI performs deterministic financial calculations. A 10% contingency reserve is automatically reserved so you never face unexpected budget overruns.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as Currency)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5B5CF0] text-sm bg-white"
                  >
                    <option value="INR">INR (₹ Indian Rupee)</option>
                    <option value="USD">USD ($ US Dollar)</option>
                    <option value="EUR">EUR (€ Euro)</option>
                    <option value="GBP">GBP (£ British Pound)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Total Event Budget *
                  </label>
                  <input
                    type="number"
                    step={1000}
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5B5CF0] text-sm"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Formatted: <strong className="text-slate-800">{formatCurrency(totalBudget, currency)}</strong>
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Spending Level
                  </label>
                  <select
                    value={spendingLevel}
                    onChange={(e) => setSpendingLevel(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5B5CF0] text-sm bg-white"
                  >
                    <option value="Budget">Budget-Conscious / Smart Value</option>
                    <option value="Moderate">Balanced Mid-Tier</option>
                    <option value="Premium">Premium Elegance</option>
                    <option value="Luxury">Ultra Luxury Royal</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Contingency Emergency Reserve (%)
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={25}
                    value={contingencyPercent}
                    onChange={(e) => setContingencyPercent(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5B5CF0] text-sm"
                  />
                  <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
                    Reserved: {formatCurrency(Math.round(totalBudget * (contingencyPercent / 100)), currency)}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Expense Priorities (Select What Matters Most)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    'Venue & Hospitality',
                    'Catering & Live Counters',
                    'Stage Decor & Florals',
                    'Cinematic Photography',
                    'Attire & Styling',
                    'Live Music & Entertainment'
                  ].map((item) => {
                    const isChecked = expensePriorities.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          if (isChecked) {
                            setExpensePriorities(expensePriorities.filter((p) => p !== item));
                          } else {
                            setExpensePriorities([...expensePriorities, item]);
                          }
                        }}
                        className={`p-2.5 rounded-xl text-xs font-medium text-left border flex items-center justify-between transition cursor-pointer ${
                          isChecked
                            ? 'bg-indigo-50 border-[#5B5CF0] text-[#5B5CF0]'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="truncate">{item}</span>
                        {isChecked && <Check className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 3: STYLE & PREFERENCES ================= */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Event Theme Concept
                  </label>
                  <input
                    type="text"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    placeholder="e.g. Royal Heritage with Temple Florals"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5B5CF0] text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Aesthetic Style
                  </label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5B5CF0] text-sm bg-white"
                  >
                    <option value="Traditional Royal">Traditional Royal</option>
                    <option value="Modern Minimalist">Modern Minimalist</option>
                    <option value="Boho Botanical">Boho Botanical</option>
                    <option value="Vibrant Playful">Vibrant Playful</option>
                    <option value="Festive Cultural">Festive Cultural</option>
                    <option value="Contemporary Luxury">Contemporary Luxury</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Cultural & Regional Traditions
                  </label>
                  <input
                    type="text"
                    value={culturalPreferences}
                    onChange={(e) => setCulturalPreferences(e.target.value)}
                    placeholder="e.g. Telugu / Tamil Vedic muhurtham with Nadaswaram"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5B5CF0] text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Catering & Food Preferences
                  </label>
                  <input
                    type="text"
                    value={foodPreferences}
                    onChange={(e) => setFoodPreferences(e.target.value)}
                    placeholder="e.g. Traditional banana leaf sadhya with live jalebi"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5B5CF0] text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Dietary Restrictions
                  </label>
                  <input
                    type="text"
                    value={dietary}
                    onChange={(e) => setDietary(e.target.value)}
                    placeholder="e.g. Pure vegetarian, Jain food station, Gluten-Free"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5B5CF0] text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Music & Entertainment
                  </label>
                  <input
                    type="text"
                    value={musicPreferences}
                    onChange={(e) => setMusicPreferences(e.target.value)}
                    placeholder="e.g. Live Carnatic fusion, acoustic singer, DJ"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5B5CF0] text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Eco-Friendly & Sustainability
                  </label>
                  <input
                    type="text"
                    value={sustainability}
                    onChange={(e) => setSustainability(e.target.value)}
                    placeholder="e.g. Zero-plastic decor, plantable seed cards"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5B5CF0] text-sm"
                  />
                </div>
              </div>

              {/* Color Palette Swatches */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Theme Color Palette
                </label>
                <div className="flex items-center gap-2">
                  {colorPalette.map((hex, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1">
                      <div
                        className="w-10 h-10 rounded-xl shadow-xs border border-black/10"
                        style={{ backgroundColor: hex }}
                      />
                      <span className="text-[10px] text-slate-500 font-mono">{hex}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 4: PLANNING PREFERENCES ================= */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Planning Approach
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: 'DIY', label: 'DIY Self-Planned', desc: 'You coordinate vendors directly with AI checklists.' },
                    { key: 'Hybrid', label: 'Hybrid Collaboration', desc: 'Mix of family help and specialized vendor leads.' },
                    { key: 'Full Service', label: 'Full Professional Service', desc: 'Turnkey execution with master planner coordination.' }
                  ].map((mode) => (
                    <button
                      key={mode.key}
                      type="button"
                      onClick={() => setDiyVsPro(mode.key as any)}
                      className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                        diyVsPro === mode.key
                          ? 'border-[#5B5CF0] bg-indigo-50/70 text-[#5B5CF0] ring-1 ring-[#5B5CF0]'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="font-bold text-xs block mb-1">{mode.label}</span>
                      <span className="text-[11px] text-slate-500 leading-tight block">{mode.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Accessibility & Guest Comfort
                </label>
                <input
                  type="text"
                  value={accessibility}
                  onChange={(e) => setAccessibility(e.target.value)}
                  placeholder="e.g. Wheelchair ramps, ample seating for seniors, shaded lounge"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5B5CF0] text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Special Features & Non-Negotiables
                </label>
                <textarea
                  rows={3}
                  value={specialRequirements}
                  onChange={(e) => setSpecialRequirements(e.target.value)}
                  placeholder="e.g. Dedicated photobooth with instant prints, backup generator, traditional brass samai lighting ceremony"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5B5CF0] text-sm resize-none"
                />
              </div>
            </div>
          )}

          {/* ================= STEP 5: REVIEW & GENERATE ================= */}
          {step === 5 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
                <h3 className="text-base font-bold text-slate-900 font-heading">
                  Event Plan Blueprint Summary
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Event Name</span>
                    <strong className="text-slate-800">{eventName || `${eventType} Celebration`}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Type & Guests</span>
                    <strong className="text-slate-800">{eventType} • {guestCount} Guests</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Total Budget</span>
                    <strong className="text-[#5B5CF0]">{formatCurrency(totalBudget, currency)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">City & Setting</span>
                    <strong className="text-slate-800">{city} ({venueType})</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Contingency</span>
                    <strong className="text-emerald-600">{contingencyPercent}% Reserved</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Theme</span>
                    <strong className="text-slate-800 truncate block">{theme}</strong>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-pink-50 border border-indigo-100 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#5B5CF0] shrink-0 mt-0.5" />
                <div className="text-xs text-slate-700 leading-relaxed">
                  <span className="font-bold text-slate-900 block mb-0.5">What the AI Will Build For You:</span>
                  1. A complete budget allocation with exact category caps.<br />
                  2. A chronological preparation timeline with milestones.<br />
                  3. Key vendor checklists with specific service requirements.<br />
                  4. Signature creative concepts, photo ops, and rain contingency mitigations.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Controls */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              disabled={loading}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 transition cursor-pointer disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
          ) : (
            <div></div>
          )}

          <div className="flex items-center gap-3">
            {step < 5 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#5B5CF0] hover:bg-[#4C4DCF] text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGeneratePlan}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#5B5CF0] via-[#7B61FF] to-[#FF7799] hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-indigo-500/30 transition cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Gemini AI is Architecting Your Event...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Complete Event Plan</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
