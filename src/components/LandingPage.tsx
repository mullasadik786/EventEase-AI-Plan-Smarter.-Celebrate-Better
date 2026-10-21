import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Calendar,
  DollarSign,
  CheckCircle,
  Users,
  Store,
  Compass,
  Clock,
  ShieldCheck,
  Heart,
  ChevronDown,
  Gift,
  HelpCircle,
  PlayCircle
} from 'lucide-react';
import { EventType } from '../types';

interface LandingPageProps {
  onStartPlanning: (initialType?: EventType) => void;
  onExploreDemo: () => void;
  onSelectSampleEvent: (eventId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartPlanning,
  onExploreDemo,
  onSelectSampleEvent
}) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const categories: { type: EventType; icon: string; title: string; desc: string; img: string }[] = [
    {
      type: 'Wedding',
      icon: '💍',
      title: 'Weddings & Engagements',
      desc: 'Bespoke ceremonies, mandap decor, guest logistics, and vendor harmony.',
      img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80'
    },
    {
      type: 'Birthday',
      icon: '🎂',
      title: 'Birthdays & Milestones',
      desc: 'From magical 1st birthdays to galactic 10th bashes and 50th galas.',
      img: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80'
    },
    {
      type: 'Anniversary',
      icon: '🥂',
      title: 'Anniversaries & Vow Renewals',
      desc: 'Intimate candlelit dinners, silver jubilee feasts, and memory revivals.',
      img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80'
    },
    {
      type: 'Community Festival',
      icon: '🪔',
      title: 'Community Festivals',
      desc: 'Diwali, cultural fairs, charity walks, and society gatherings.',
      img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80'
    },
    {
      type: 'Baby Shower',
      icon: '🍼',
      title: 'Baby Showers & Naming',
      desc: 'Sweet pastel themes, floral cradles, and memory keepsake books.',
      img: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=600&q=80'
    },
    {
      type: 'Corporate Event',
      icon: '💼',
      title: 'Corporate Events & Galas',
      desc: 'Annual townhalls, product launches, offsites, and award ceremonies.',
      img: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const steps = [
    {
      num: '01',
      title: 'Tell Us About Your Event',
      desc: 'Share your occasion, preferred date, city, estimated guests, and budget target.'
    },
    {
      num: '02',
      title: 'Generate Personalized AI Plan',
      desc: 'Our Gemini AI crafts a cohesive vision, color palette, decoration ideas, and tailored agenda.'
    },
    {
      num: '03',
      title: 'Organize Budget & Timeline',
      desc: 'Dynamic categories, contingency buffer, milestone checklists, and expense tracking.'
    },
    {
      num: '04',
      title: 'Manage Vendors & Guests',
      desc: 'Track quotes, compare shortlisted partners, monitor RSVPs, and record dietary preferences.'
    },
    {
      num: '05',
      title: 'Celebrate With Confidence',
      desc: 'Generate run sheets and emergency contact cards to enjoy every single moment stress-free.'
    }
  ];

  const features = [
    {
      icon: Sparkles,
      color: 'from-[#5B5CF0] to-[#7B61FF]',
      title: 'GenAI Planning Assistant',
      desc: 'Instant structured concepts, theme moodboards, and cost-reduction ideas tailored to your budget.'
    },
    {
      icon: DollarSign,
      color: 'from-[#10B981] to-[#059669]',
      title: 'Intelligent Budget Engine',
      desc: 'Deterministic math, contingency reserves, category progress bars, and overrun warnings.'
    },
    {
      icon: Clock,
      color: 'from-[#F59E0B] to-[#D97706]',
      title: 'Timeline & Milestones',
      desc: 'Countdown days, task dependencies, priority tags, and deadline alerts to prevent last-minute chaos.'
    },
    {
      icon: Store,
      color: 'from-[#EC4899] to-[#BE185D]',
      title: 'Vendor Discovery & Comparison',
      desc: 'Shortlist caterers, venues, decorators, and photographers. Compare side-by-side quotes.'
    },
    {
      icon: Users,
      color: 'from-[#6366F1] to-[#4F46E5]',
      title: 'Guest List & Dietary Tracking',
      desc: 'RSVP management, table seating, plus-ones, and vegetarian / Jain / halal meal tally.'
    },
    {
      icon: Compass,
      color: 'from-[#8B5CF6] to-[#6D28D9]',
      title: 'Visual Inspiration Board',
      desc: 'Pinterest-style photo collections with color palettes you can directly apply to your event in 1 click.'
    }
  ];

  const faqs = [
    {
      q: 'Can I plan an event without creating an account or providing an API key?',
      a: 'Yes, absolutely! EventEase AI comes with a comprehensive offline Demo Mode featuring seeded sample celebrations, interactive budgets, and deterministic AI planning so you can test every feature immediately.'
    },
    {
      q: 'How does the AI create realistic budget estimates?',
      a: 'The planning wizard takes your total budget and intelligently splits it across key categories (venue, catering, decor, photography) based on typical industry ratios for your event type and guest count. All math is deterministic, and you can edit any item anytime.'
    },
    {
      q: 'Can I export my plan, budget, or guest list?',
      a: 'Yes! You can export your full budget as CSV, download guest RSVP lists as CSV, and print clean run-sheets or event briefs for your family and venue coordinators.'
    },
    {
      q: 'Is my event data private?',
      a: 'Yes. In demo mode, your data is stored locally in your browser storage. No private guest details or financial records are uploaded to public databases.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#14213D] selection:bg-[#5B5CF0] selection:text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 bg-gradient-to-b from-[#FFF9F0]/80 via-white to-[#FFFDF9]">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-indigo-200/30 via-pink-100/40 to-amber-100/30 blur-3xl -z-10 pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headlines & Call to Actions */}
            <div className="lg:col-span-7 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100/80 text-indigo-700 text-xs font-bold tracking-wide uppercase mb-6 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#5B5CF0]" />
                <span>Next-Gen Event Planning Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#14213D] tracking-tight font-heading leading-[1.12]">
                Your Perfect Event <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5B5CF0] via-[#7B61FF] to-[#FF7799]">
                  Starts Right Here.
                </span>
              </h1>

              <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed font-normal">
                From unforgettable weddings to joyful birthdays and meaningful community celebrations, let AI turn your ideas into beautifully organized events.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={() => onStartPlanning()}
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-[#5B5CF0] to-[#7B61FF] hover:from-[#4C4DD8] hover:to-[#684FE0] shadow-lg shadow-indigo-500/25 transition transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Plan My Event</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                <button
                  onClick={onExploreDemo}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-bold text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-xs transition cursor-pointer"
                >
                  <PlayCircle className="w-5 h-5 text-[#5B5CF0]" />
                  <span>Explore Live Demo</span>
                </button>
              </div>

              {/* Highlights bar */}
              <div className="mt-10 pt-8 border-t border-slate-200/70 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <p className="text-2xl font-black text-[#14213D] font-heading">100%</p>
                  <p className="text-xs text-slate-500 font-medium">Free Demo Mode</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-[#14213D] font-heading">₹ / $</p>
                  <p className="text-xs text-slate-500 font-medium">Multi-Currency</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-[#14213D] font-heading">Zero Stress</p>
                  <p className="text-xs text-slate-500 font-medium">End-to-End Control</p>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Card Mockup */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Background decorative card */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-[#5B5CF0] via-[#FF7799] to-[#F5BD55] rounded-3xl blur-lg opacity-30 animate-pulse" />

                <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
                  {/* Card Header with real venue photo */}
                  <div className="relative h-48 bg-slate-900 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80"
                      alt="Celebration Venue"
                      className="w-full h-full object-cover opacity-90 hover:scale-105 transition duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-slate-900 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                      <span>Live Event Planning</span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <p className="text-xs uppercase tracking-wider text-amber-300 font-bold">Featured Plan</p>
                      <h4 className="text-base font-bold truncate">Royal South Indian Wedding</h4>
                      <p className="text-xs text-slate-200">Dec 18, 2026 • Hyderabad • 300 Guests</p>
                    </div>
                  </div>

                  {/* Card Body: Interactive Glance */}
                  <div className="p-5 space-y-4 bg-white">
                    {/* Budget row */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div>
                        <p className="text-[11px] text-slate-500 font-semibold uppercase">Total Budget</p>
                        <p className="text-lg font-black text-[#5B5CF0] font-heading">₹15,00,000</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] text-slate-500 font-semibold uppercase">Contingency Reserve</p>
                        <p className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
                          ₹1,50,000 (10%)
                        </p>
                      </div>
                    </div>

                    {/* Progress bars preview */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1 font-semibold text-slate-700">
                        <span>Milestone Readiness</span>
                        <span className="text-[#5B5CF0]">65% Completed</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div className="bg-gradient-to-r from-[#5B5CF0] to-[#FF7799] h-2.5 rounded-full w-[65%]" />
                      </div>
                    </div>

                    {/* AI Insight Chip */}
                    <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100/80 flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#5B5CF0] text-white flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div className="text-xs">
                        <span className="font-bold text-slate-900 block">AI Recommendation</span>
                        <span className="text-slate-600">
                          "Shortlist catering tasting session this week to lock seasonal mango & payasam menu options."
                        </span>
                      </div>
                    </div>

                    {/* Interactive CTA to preview sample plan */}
                    <button
                      onClick={() => onSelectSampleEvent('evt-wedding-01')}
                      className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Inspect This Sample Plan</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#5B5CF0] mb-2 font-heading">
              Every Celebration Deserves Brilliance
            </h2>
            <h3 className="text-3xl sm:text-4xl font-black text-[#14213D] font-heading">
              What Are You Celebrating?
            </h3>
            <p className="mt-3 text-base text-slate-600">
              Select an event category to launch a tailored AI planning experience with custom checklists and smart budgets.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                role="button"
                tabIndex={0}
                aria-label={`Plan ${cat.title}`}
                onClick={() => onStartPlanning(cat.type)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onStartPlanning(cat.type);
                  }
                }}
                className="group relative rounded-2xl bg-[#FFFDF9] border border-slate-200/80 hover:border-indigo-300 p-5 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#5B5CF0]"
              >
                <div className="relative h-40 rounded-xl overflow-hidden mb-4 bg-slate-100">
                  <img
                    src={cat.img}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-xs text-base w-8 h-8 rounded-lg flex items-center justify-center shadow-xs" aria-hidden="true">
                    {cat.icon}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-slate-900 font-heading group-hover:text-[#5B5CF0] transition">
                    {cat.title}
                  </h4>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#5B5CF0]">
                  <span>Plan {cat.type}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" aria-hidden="true" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-[#FFFDF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#5B5CF0] mb-2 font-heading">
              Effortless 5-Step Process
            </h2>
            <h3 className="text-3xl sm:text-4xl font-black text-[#14213D] font-heading">
              How EventEase AI Works
            </h3>
            <p className="mt-3 text-base text-slate-600">
              From initial brainstorm to the moment guests arrive, here is how we make your celebration unforgettable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs relative flex flex-col justify-between"
              >
                <div>
                  <span className="text-3xl font-black text-indigo-100 font-heading block mb-2">
                    {step.num}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 font-heading">
                    {step.title}
                  </h4>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#5B5CF0] mb-2 font-heading">
              Designed For Perfection
            </h2>
            <h3 className="text-3xl sm:text-4xl font-black text-[#14213D] font-heading">
              Everything You Need Under One Roof
            </h3>
            <p className="mt-3 text-base text-slate-600">
              No more messy spreadsheets, lost vendor receipts, or scattered WhatsApp chats.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-[#FFFDF9] border border-slate-200/70 hover:border-indigo-200 shadow-2xs hover:shadow-md transition"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${feat.color} text-white flex items-center justify-center mb-5 shadow-sm`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 font-heading">
                    {feat.title}
                  </h4>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sample Event Plans Preview */}
      <section className="py-20 bg-[#FFF9F0]/60 border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#5B5CF0] mb-2 font-heading">
                Ready-to-Explore Blueprints
              </h2>
              <h3 className="text-3xl sm:text-4xl font-black text-[#14213D] font-heading">
                Sample Event Plans
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Explore how full budgets, timelines, and vendors are structured across different celebrations.
              </p>
            </div>
            <button
              onClick={onExploreDemo}
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs font-bold text-[#5B5CF0] hover:text-indigo-800"
            >
              <span>View All Seeded Events</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Wedding */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition">
              <div className="h-44 relative">
                <img
                  src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80"
                  alt="Wedding Plan"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-md">
                  Wedding • 300 Guests
                </div>
              </div>
              <div className="p-5">
                <h4 className="text-base font-bold text-slate-900 font-heading">
                  Priya & Aarav's Royal South Indian Wedding
                </h4>
                <p className="mt-1 text-xs text-slate-500">
                  Hyderabad • Budget: ₹15,00,000 • Traditional Heritage
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-emerald-600 font-semibold">10% Contingency</span>
                  <button
                    onClick={() => onSelectSampleEvent('evt-wedding-01')}
                    className="text-xs font-bold text-[#5B5CF0] hover:underline"
                  >
                    Open Plan →
                  </button>
                </div>
              </div>
            </div>

            {/* Birthday */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition">
              <div className="h-44 relative">
                <img
                  src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80"
                  alt="Birthday Plan"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-md">
                  Birthday • 50 Guests
                </div>
              </div>
              <div className="p-5">
                <h4 className="text-base font-bold text-slate-900 font-heading">
                  Leo's 10th Superhero Galactic Birthday
                </h4>
                <p className="mt-1 text-xs text-slate-500">
                  Bengaluru • Budget: ₹1,20,000 • Laser Arena & Cake
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-emerald-600 font-semibold">10% Contingency</span>
                  <button
                    onClick={() => onSelectSampleEvent('evt-bday-02')}
                    className="text-xs font-bold text-[#5B5CF0] hover:underline"
                  >
                    Open Plan →
                  </button>
                </div>
              </div>
            </div>

            {/* Festival */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition">
              <div className="h-44 relative">
                <img
                  src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80"
                  alt="Community Festival Plan"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-md">
                  Festival • 450 Guests
                </div>
              </div>
              <div className="p-5">
                <h4 className="text-base font-bold text-slate-900 font-heading">
                  Diwali Community Festival of Lights
                </h4>
                <p className="mt-1 text-xs text-slate-500">
                  Mumbai • Budget: ₹6,50,000 • Cultural Stalls & Sound
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-emerald-600 font-semibold">12% Contingency</span>
                  <button
                    onClick={() => onSelectSampleEvent('evt-fest-03')}
                    className="text-xs font-bold text-[#5B5CF0] hover:underline"
                  >
                    Open Plan →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials (Fictional Demo Data Clearly Identified) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-block bg-amber-50 text-amber-700 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              Illustrative Community Feedback
            </span>
            <h3 className="text-3xl font-black text-[#14213D] font-heading">
              Loved By Organizers & Families
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              (Sample demo reviews illustrating typical user workflows)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {'★'.repeat(5)}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "Planning a 300-guest South Indian wedding felt daunting. The AI budget allocation saved us ₹80,000 by balancing catering live counters with seasonal mandap florals."
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-200/60 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                  AR
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Ananya & Rohit</p>
                  <p className="text-[10px] text-slate-500">Wedding Hosts, Hyderabad</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {'★'.repeat(5)}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "The day-of run sheet was an absolute lifesaver. Our sound engineer, cake decorator, and emcee all knew their exact arrival minutes."
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-200/60 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-pink-100 text-pink-700 font-bold text-xs flex items-center justify-center">
                  KM
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Kavita Menon</p>
                  <p className="text-[10px] text-slate-500">Parent Organizer, Bengaluru</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {'★'.repeat(5)}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "Our society Diwali festival needed permits, sound stages, and food stalls. Having the vendor quote comparisons and task assignments in one place made it effortless."
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-200/60 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 font-bold text-xs flex items-center justify-center">
                  SD
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Sunil Deshmukh</p>
                  <p className="text-[10px] text-slate-500">Community Chairman, Mumbai</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-20 bg-slate-50 border-t border-slate-200/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-black text-[#14213D] font-heading">
              Frequently Asked Questions
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              Everything you need to know about EventEase AI.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-2xs"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-indigo-600 transition"
                  >
                    <span className="text-sm sm:text-base">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 bg-gradient-to-r from-[#14213D] via-[#1D2D50] to-[#14213D] text-white text-center relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#5B5CF0]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#FF7799]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black font-heading leading-tight">
            Ready to Plan Something <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF7799] to-[#F5BD55]">
              Truly Unforgettable?
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-xl mx-auto">
            Let EventEase AI calculate your budget, organize vendor checklists, and keep your entire celebration timeline on track.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onStartPlanning()}
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold bg-[#5B5CF0] hover:bg-[#4B4CCF] text-white shadow-xl shadow-indigo-500/30 transition transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>Start Planning Free</span>
            </button>
            <button
              onClick={onExploreDemo}
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition cursor-pointer"
            >
              Explore Demo Mode
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
