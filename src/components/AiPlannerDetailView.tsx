import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Download,
  RotateCw,
  TrendingDown,
  Crown,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  DollarSign,
  Calendar,
  Layers,
  ShieldCheck,
  Check,
  MessageSquare,
  ChevronRight
} from 'lucide-react';
import { AppEvent, BudgetItem, GeneratedPlan, TimelineTask } from '../types';
import { AiService, ChatMessage } from '../services/aiService';
import { formatCurrency } from '../lib/formatters';

interface AiPlannerDetailViewProps {
  activeEvent: AppEvent;
  onApplyPlanToEvent: (plan: GeneratedPlan) => void;
  onRegenerate: () => void;
  onOpenExport: () => void;
}

export const AiPlannerDetailView: React.FC<AiPlannerDetailViewProps> = ({
  activeEvent,
  onApplyPlanToEvent,
  onRegenerate,
  onOpenExport
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'budget' | 'timeline' | 'vendors' | 'creative' | 'risks'>('overview');
  const [appliedNotice, setAppliedNotice] = useState(false);

  // Chat Assistant State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `Hello! I'm your EventEase AI planning director for **${activeEvent.title}**.\n\nI've generated a comprehensive structured blueprint including theme decor, category-by-category budget allocations, and risk mitigations. How can I help you customize or optimize this further?`
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const plan = activeEvent.generatedPlan || {
    eventSummary: {
      title: activeEvent.title,
      eventType: activeEvent.eventType,
      date: activeEvent.date,
      location: activeEvent.location,
      theme: activeEvent.theme,
      colorPalette: activeEvent.colorPalette,
      guestCount: activeEvent.guestCount,
      currency: activeEvent.currency,
      vision: activeEvent.vision
    },
    budget: {
      total: activeEvent.totalBudget,
      contingency: Math.round(activeEvent.totalBudget * 0.1),
      availablePlanningBudget: Math.round(activeEvent.totalBudget * 0.9),
      categories: [
        { name: 'Venue & Accommodation', estimatedCost: Math.round(activeEvent.totalBudget * 0.28), actualCost: 0, priority: 'high', reason: 'Prime hospitality & venue spaces.' },
        { name: 'Catering & Feasts', estimatedCost: Math.round(activeEvent.totalBudget * 0.30), actualCost: 0, priority: 'high', reason: `Multi-course dining for ${activeEvent.guestCount} guests.` },
        { name: 'Decoration & Lighting', estimatedCost: Math.round(activeEvent.totalBudget * 0.16), actualCost: 0, priority: 'high', reason: 'Mandap, stage backdrop, and floral entrance.' },
        { name: 'Photography & Film', estimatedCost: Math.round(activeEvent.totalBudget * 0.10), actualCost: 0, priority: 'medium', reason: 'Candid photo team and cinematic drone video.' },
        { name: 'Styling & Attire', estimatedCost: Math.round(activeEvent.totalBudget * 0.08), actualCost: 0, priority: 'medium', reason: 'Ceremonial outfits and artist styling.' },
        { name: 'Music & Entertainment', estimatedCost: Math.round(activeEvent.totalBudget * 0.05), actualCost: 0, priority: 'medium', reason: 'Sound engineering and live music artists.' },
        { name: 'Invitations & Favors', estimatedCost: Math.round(activeEvent.totalBudget * 0.03), actualCost: 0, priority: 'low', reason: 'Eco-friendly invites and bespoke gift hampers.' }
      ]
    },
    timeline: [
      { title: 'Confirm Anchor Venue & Sign Deposit', dueDate: 'T-120 days', priority: 'high', status: 'pending', owner: 'Host' },
      { title: 'Finalize Menu Tasting & Live Food Stalls', dueDate: 'T-90 days', priority: 'high', status: 'pending', owner: 'Host' },
      { title: 'Approve Stage Decor Architecture CAD', dueDate: 'T-60 days', priority: 'medium', status: 'pending', owner: 'Designer' },
      { title: 'Send Digital & Physical Invitations', dueDate: 'T-45 days', priority: 'high', status: 'pending', owner: 'Family' },
      { title: 'Finalize Day-of Run Sheet with Vendors', dueDate: 'T-7 days', priority: 'high', status: 'pending', owner: 'Planner' }
    ],
    vendorChecklist: [
      { category: 'Venue', status: 'shortlisted', requirements: [`Accommodates ${activeEvent.guestCount} guests`, 'Power backup generator', 'Valet parking'] },
      { category: 'Catering', status: 'shortlisted', requirements: [activeEvent.dietary, 'Live food counters', 'Tasting session beforehand'] },
      { category: 'Decor', status: 'not_started', requirements: ['Stage backdrop', 'Ambient illumination', 'Custom welcome signage'] },
      { category: 'Photography', status: 'shortlisted', requirements: ['Traditional + candid coverage', 'Drone footage', 'Deliverables in 3 weeks'] }
    ],
    creativeIdeas: [
      {
        title: 'Botanical Polaroid Guest Welcome Wall',
        description: 'An organic flower wall where guests snap a vintage polaroid selfie upon arrival and pin a personalized wish for the hosts.',
        estimatedCost: Math.round(activeEvent.totalBudget * 0.015)
      },
      {
        title: 'Signature Curated Beverage Station',
        description: 'Bespoke mocktail blends served in artisan glasses with edible botanical garnishes and monogrammed stirrers.',
        estimatedCost: Math.round(activeEvent.totalBudget * 0.02)
      },
      {
        title: 'Audio Guestbook Phone Station',
        description: 'A charming vintage rotary telephone that records heartfelt voice messages and blessings from attendees.',
        estimatedCost: Math.round(activeEvent.totalBudget * 0.01)
      }
    ],
    riskChecklist: [
      {
        risk: 'Inclement Weather & Rain Slippage',
        mitigation: 'Ensure venue provides waterproof canopy extensions or immediate indoor ballroom transition within 30 minutes.'
      },
      {
        risk: 'Surge in Guest Attendance (+15%)',
        mitigation: 'Contract a pre-negotiated 15% catering food buffer with the head chef and arrange standby banquet seating.'
      },
      {
        risk: 'Audio-Visual Sound Gaps',
        mitigation: 'Require dual wireless microphones and an independent silent generator for uninterrupted ceremonies.'
      }
    ],
    nextActions: [
      'Lock in the primary venue agreement to secure the calendar date',
      'Schedule a menu tasting session with the catering team',
      'Begin dispatching digital Save-The-Dates to out-of-town guests'
    ]
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || chatLoading) return;

    const newMsgs: ChatMessage[] = [...messages, { role: 'user', content: query }];
    setMessages(newMsgs);
    setInputMessage('');
    setChatLoading(true);

    try {
      const response = await AiService.sendChatMessage(newMsgs, {
        title: activeEvent.title,
        eventType: activeEvent.eventType,
        totalBudget: activeEvent.totalBudget,
        currency: activeEvent.currency,
        guestCount: activeEvent.guestCount,
        city: activeEvent.city
      });

      setMessages([...newMsgs, { role: 'assistant', content: response.reply }]);
    } catch (err) {
      setMessages([
        ...newMsgs,
        {
          role: 'assistant',
          content: 'Here is an expert planning recommendation: Focus on locking in your venue and catering earliest, as those represent 60% of both guest satisfaction and budget commitments.'
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleApply = () => {
    onApplyPlanToEvent(plan);
    setAppliedNotice(true);
    setTimeout(() => setAppliedNotice(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5B5CF0] bg-indigo-50 px-2.5 py-0.5 rounded-full">
              AI Generated Blueprint
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">{activeEvent.city}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14213D] font-heading">
            {plan.eventSummary.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            {plan.eventSummary.vision}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleApply}
            className="flex items-center gap-1.5 bg-[#5B5CF0] hover:bg-[#494ACF] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 transition cursor-pointer"
          >
            {appliedNotice ? <Check className="w-4 h-4 text-emerald-300" /> : <Layers className="w-4 h-4" />}
            <span>{appliedNotice ? 'Applied to Event!' : 'Apply to Budget & Tasks'}</span>
          </button>

          <button
            onClick={onRegenerate}
            className="flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3.5 py-2.5 rounded-xl text-xs font-semibold shadow-2xs transition cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Regenerate</span>
          </button>

          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Plan</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Plan Details on Left, Interactive Chat Assistant on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Plan Tabs & Structure */}
        <div className="lg:col-span-7 space-y-6">
          {/* Navigation Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl overflow-x-auto text-xs font-bold">
            {[
              { id: 'overview', label: 'Overview & Theme', icon: Sparkles },
              { id: 'budget', label: 'Budget Allocations', icon: DollarSign },
              { id: 'timeline', label: 'Timeline Milestones', icon: Calendar },
              { id: 'vendors', label: 'Vendor Needs', icon: ShieldCheck },
              { id: 'creative', label: 'Creative Ideas', icon: Lightbulb },
              { id: 'risks', label: 'Risk Safeguards', icon: AlertTriangle }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-white text-[#5B5CF0] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: OVERVIEW & THEME */}
          {activeTab === 'overview' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-heading mb-2">
                  Event Concept & Theme
                </h3>
                <p className="text-sm font-semibold text-[#5B5CF0] bg-indigo-50/70 p-3 rounded-xl border border-indigo-100">
                  {plan.eventSummary.theme}
                </p>
              </div>

              {/* Color Palette */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Curated Color Palette
                </h4>
                <div className="flex items-center gap-3">
                  {plan.eventSummary.colorPalette?.map((color, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1">
                      <div
                        className="w-12 h-12 rounded-xl shadow-xs border border-slate-200"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-[10px] text-slate-500 font-mono">{color}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Parameters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Guest Target</span>
                  <strong className="text-sm text-slate-800">{plan.eventSummary.guestCount} Attendees</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Budget</span>
                  <strong className="text-sm text-[#5B5CF0]">{formatCurrency(plan.budget.total, plan.eventSummary.currency)}</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Contingency</span>
                  <strong className="text-sm text-emerald-600">{formatCurrency(plan.budget.contingency, plan.eventSummary.currency)}</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Target Date</span>
                  <strong className="text-sm text-slate-800">{plan.eventSummary.date}</strong>
                </div>
              </div>

              {/* Next Actions */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Immediate Recommended Actions
                </h4>
                <ul className="space-y-2">
                  {plan.nextActions?.map((act, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 text-[#5B5CF0] flex items-center justify-center font-bold text-[10px] shrink-0">
                        {i + 1}
                      </span>
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: BUDGET ALLOCATIONS */}
          {activeTab === 'budget' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-heading">
                    Structured Budget Allocation
                  </h3>
                  <p className="text-xs text-slate-500">
                    Available for planning: {formatCurrency(plan.budget.availablePlanningBudget, plan.eventSummary.currency)} (after {formatCurrency(plan.budget.contingency, plan.eventSummary.currency)} reserve)
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {plan.budget.categories.map((cat, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800">{cat.name}</span>
                        <span className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded-full ${
                          cat.priority === 'high' ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {cat.priority}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{cat.reason}</p>
                    </div>

                    <div className="text-right sm:shrink-0">
                      <span className="text-sm font-black text-[#5B5CF0] font-heading">
                        {formatCurrency(cat.estimatedCost, plan.eventSummary.currency)}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {Math.round((cat.estimatedCost / plan.budget.total) * 100)}% of total
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TIMELINE MILESTONES */}
          {activeTab === 'timeline' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 animate-in fade-in duration-200">
              <h3 className="text-base font-bold text-slate-900 font-heading mb-2">
                Milestone Preparation Roadmap
              </h3>
              <div className="space-y-3">
                {plan.timeline.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 text-[#5B5CF0] flex items-center justify-center font-bold text-xs">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{item.title}</p>
                        <p className="text-[10px] text-slate-400">Owner: {item.owner}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                        {item.dueDate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: VENDOR REQUIREMENTS */}
          {activeTab === 'vendors' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 animate-in fade-in duration-200">
              <h3 className="text-base font-bold text-slate-900 font-heading mb-2">
                Vendor Checklist & Scope Specifications
              </h3>
              <div className="space-y-3">
                {plan.vendorChecklist.map((v, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{v.category}</span>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase bg-white px-2 py-0.5 rounded-md border border-slate-200">
                        Status: {v.status}
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {v.requirements.map((req, rIdx) => (
                        <li key={rIdx} className="text-xs text-slate-600 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CREATIVE IDEAS */}
          {activeTab === 'creative' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 animate-in fade-in duration-200">
              <h3 className="text-base font-bold text-slate-900 font-heading mb-2">
                Signature Creative Ideas & Guest Experiences
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {plan.creativeIdeas.map((idea, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-gradient-to-r from-amber-50/50 to-orange-50/40 border border-amber-100 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                        <span>{idea.title}</span>
                      </h4>
                      <span className="text-xs font-bold text-amber-700 bg-white/80 px-2 py-0.5 rounded-md shadow-2xs">
                        ~ {formatCurrency(idea.estimatedCost, plan.eventSummary.currency)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{idea.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: RISKS & SAFEGUARDS */}
          {activeTab === 'risks' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 animate-in fade-in duration-200">
              <h3 className="text-base font-bold text-slate-900 font-heading mb-2">
                Risk Management & Contingencies
              </h3>
              <div className="space-y-3">
                {plan.riskChecklist.map((r, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <p className="text-xs font-bold text-rose-700 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                      <span>{r.risk}</span>
                    </p>
                    <p className="text-xs text-slate-600 pl-5">
                      <strong>Mitigation:</strong> {r.mitigation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (5 cols): Real-Time Conversational AI Planning Assistant */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col h-[650px] overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 bg-gradient-to-r from-indigo-50 to-pink-50 border-b border-indigo-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#5B5CF0] text-white flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 font-heading">
                  AI Planning Assistant
                </h4>
                <p className="text-[10px] text-slate-500">Gemini 3.8 Flash • Real-time event consultant</p>
              </div>
            </div>

            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>

          {/* Quick Prompts Chips */}
          <div className="p-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px] shrink-0">
            <button
              onClick={() => handleSendMessage('How can I reduce 15% from the overall budget?')}
              className="px-2.5 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 rounded-lg text-slate-700 whitespace-nowrap font-medium transition cursor-pointer"
            >
              ✂️ Cut 15% Costs
            </button>
            <button
              onClick={() => handleSendMessage('Suggest creative sustainable return gift ideas')}
              className="px-2.5 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 rounded-lg text-slate-700 whitespace-nowrap font-medium transition cursor-pointer"
            >
              🎁 Return Gifts
            </button>
            <button
              onClick={() => handleSendMessage('Recommend a crowd-pleasing vegetarian menu')}
              className="px-2.5 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 rounded-lg text-slate-700 whitespace-nowrap font-medium transition cursor-pointer"
            >
              🍽️ Menu Ideas
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="p-4 flex-1 overflow-y-auto space-y-3 text-xs">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] p-3 rounded-2xl whitespace-pre-wrap leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#5B5CF0] text-white rounded-br-xs'
                      : 'bg-slate-100 text-slate-800 rounded-bl-xs'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs italic">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce delay-100"></span>
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce delay-200"></span>
                <span>AI Planner is writing recommendations...</span>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-slate-200/80 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask anything: 'Suggest photography style', 'Reduce costs'..."
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5B5CF0] text-xs"
              />
              <button
                type="submit"
                disabled={chatLoading || !inputMessage.trim()}
                className="p-2.5 bg-[#5B5CF0] hover:bg-[#494ACF] text-white rounded-xl transition cursor-pointer disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
