import React, { useState } from 'react';
import {
  Compass,
  Heart,
  Sparkles,
  Layers,
  Filter,
  Check,
  Send,
  Loader2,
  ExternalLink,
  Crown
} from 'lucide-react';
import { AppEvent, InspirationItem } from '../types';
import { AiService } from '../services/aiService';

interface InspirationViewProps {
  activeEvent: AppEvent;
  inspirations: InspirationItem[];
  favoriteIds: string[];
  onToggleFavorite: (id: string) => void;
  onApplyThemeToEvent: (theme: string, colorPalette: string[]) => void;
}

export const InspirationView: React.FC<InspirationViewProps> = ({
  activeEvent,
  inspirations,
  favoriteIds,
  onToggleFavorite,
  onApplyThemeToEvent
}) => {
  const [selectedCollection, setSelectedCollection] = useState<string>('All');
  const [selectedTier, setSelectedTier] = useState<string>('All');
  const [appliedId, setAppliedId] = useState<string | null>(null);

  // AI Theme generator state
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [customThemes, setCustomThemes] = useState<InspirationItem[]>([]);

  const collections = [
    'All',
    'Luxury Weddings',
    'Traditional Indian Weddings',
    'Minimalist Celebrations',
    'Birthday Themes',
    'Cultural Celebrations',
    'Elegant Table Settings'
  ];

  const allItems = [...customThemes, ...inspirations];

  const filteredItems = allItems.filter((item) => {
    if (selectedCollection !== 'All' && item.collection !== selectedCollection) return false;
    if (selectedTier !== 'All' && item.budgetTier !== selectedTier) return false;
    return true;
  });

  const handleApply = (item: InspirationItem) => {
    onApplyThemeToEvent(item.title, item.colorPalette);
    setAppliedId(item.id);
    setTimeout(() => setAppliedId(null), 3000);
  };

  const handleGenerateAiTheme = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim() || aiLoading) return;

    setAiLoading(true);
    try {
      const res = await AiService.getIdeas(
        'Theme & Aesthetics',
        activeEvent.eventType,
        aiPrompt,
        activeEvent.guestCount
      );

      const generatedIdeas = res.ideas || [];
      const newItems: InspirationItem[] = generatedIdeas.map((idea: any, i: number) => ({
        id: `insp-ai-${Date.now()}-${i}`,
        title: idea.title || `${aiPrompt} Concept`,
        collection: 'Custom AI Moodboard',
        image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80',
        description: idea.desc || 'AI engineered theme with harmonic floral lighting and tailored table arrangements.',
        colorPalette: ['#5B5CF0', '#FF7799', '#F5BD55', '#CFF5E8', '#14213D'],
        budgetTier: 'Mid-Range',
        tags: ['AI Generated', 'Custom Theme', activeEvent.eventType]
      }));

      setCustomThemes([...newItems, ...customThemes]);
      setAiPrompt('');
    } catch {
      // Fallback custom theme item
      const fallbackItem: InspirationItem = {
        id: `insp-ai-${Date.now()}`,
        title: `Bespoke: ${aiPrompt}`,
        collection: 'Custom AI Moodboard',
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
        description: `An evocative design moodboard custom styled around "${aiPrompt}".`,
        colorPalette: ['#800020', '#D4AF37', '#FFF8DC', '#2E8B57', '#FF7799'],
        budgetTier: 'Luxury',
        tags: ['Custom', 'AI Concept']
      };
      setCustomThemes([fallbackItem, ...customThemes]);
      setAiPrompt('');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5B5CF0] bg-indigo-50 px-2.5 py-0.5 rounded-full">
              Visual Moodboards
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">Active Theme: {activeEvent.theme}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14213D] font-heading">
            Event Inspiration Gallery
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Explore editorial event setups, color harmonies, and apply any theme directly to your celebration
          </p>
        </div>
      </div>

      {/* AI Custom Moodboard Generator Box */}
      <div className="bg-gradient-to-r from-indigo-50 via-white to-pink-50 p-6 rounded-3xl border border-indigo-100 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-[#5B5CF0]" />
          <h3 className="text-base font-bold text-slate-900 font-heading">
            AI Theme Moodboard Architect
          </h3>
        </div>
        <p className="text-xs text-slate-600 max-w-2xl mb-4">
          Describe any dream ambiance (e.g. "Golden twilight rooftop with floating candles and blush peonies"), and Gemini AI will generate cohesive theme concepts and color palettes for your event.
        </p>

        <form onSubmit={handleGenerateAiTheme} className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="Describe your aesthetic vision (e.g. 'Royal Rajasthani night with brass lanterns and crimson velvet')..."
            className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-[#5B5CF0] shadow-2xs w-full"
          />
          <button
            type="submit"
            disabled={aiLoading || !aiPrompt.trim()}
            className="w-full sm:w-auto px-6 py-3 bg-[#5B5CF0] hover:bg-[#494ACF] text-white rounded-2xl text-xs font-bold shadow-md shadow-indigo-500/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {aiLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Designing Theme...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Concept</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto text-xs font-semibold">
          {collections.map((col) => {
            const isSelected = selectedCollection === col;
            return (
              <button
                key={col}
                onClick={() => setSelectedCollection(col)}
                className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
                  isSelected
                    ? 'bg-[#5B5CF0] text-white shadow-xs font-bold'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {col}
              </button>
            );
          })}
        </div>

        <select
          value={selectedTier}
          onChange={(e) => setSelectedTier(e.target.value)}
          className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700"
        >
          <option value="All">All Budget Tiers</option>
          <option value="Budget-Friendly">Budget-Friendly</option>
          <option value="Mid-Range">Mid-Range</option>
          <option value="Luxury">Luxury</option>
          <option value="Ultra-Luxury">Ultra-Luxury</option>
        </select>
      </div>

      {/* Gallery Cards Grid (Pinterest-style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const isFav = favoriteIds.includes(item.id);
          const isApplied = appliedId === item.id;
          return (
            <div
              key={item.id}
              className="group bg-white rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Photo with Overlay Badge */}
                <div className="relative h-60 bg-slate-100 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />

                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-[10px] font-bold px-2.5 py-0.5 rounded-full text-slate-800 shadow-2xs">
                    {item.collection}
                  </div>

                  <button
                    onClick={() => onToggleFavorite(item.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center transition hover:scale-110 shadow-2xs cursor-pointer"
                    title="Save to favorites"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'text-rose-500 fill-current' : 'text-slate-400'}`} />
                  </button>

                  <div className="absolute bottom-3 left-3 right-3 text-white opacity-0 group-hover:opacity-100 transition duration-300">
                    <span className="text-[10px] font-semibold bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs">
                      {item.budgetTier} Tier
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 space-y-3">
                  <h4 className="text-base font-bold text-slate-900 font-heading leading-tight group-hover:text-[#5B5CF0] transition">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Palette Swatches */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Harmonic Palette
                    </span>
                    <div className="flex items-center gap-2">
                      {item.colorPalette.map((hex, idx) => (
                        <div
                          key={idx}
                          className="w-7 h-7 rounded-lg shadow-2xs border border-black/10 transition hover:scale-110"
                          style={{ backgroundColor: hex }}
                          title={hex}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.tags.map((t, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-50 text-slate-500 px-2 py-0.5 rounded-md border border-slate-100">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-4 bg-slate-50/70 border-t border-slate-100">
                <button
                  onClick={() => handleApply(item)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    isApplied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#5B5CF0] hover:bg-[#494ACF] text-white shadow-xs'
                  }`}
                >
                  {isApplied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Theme Applied to Event!</span>
                    </>
                  ) : (
                    <>
                      <Layers className="w-3.5 h-3.5" />
                      <span>Apply Theme to Current Event</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
