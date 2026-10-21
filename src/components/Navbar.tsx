import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  DollarSign,
  CheckSquare,
  Users,
  Store,
  Compass,
  Clock,
  PlusCircle,
  RotateCcw,
  Menu,
  X,
  ChevronDown,
  Printer
} from 'lucide-react';
import { AppEvent } from '../types';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  events: AppEvent[];
  activeEvent?: AppEvent;
  onSelectEvent: (eventId: string) => void;
  onOpenNewEventWizard: () => void;
  onResetDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  events,
  activeEvent,
  onSelectEvent,
  onOpenNewEventWizard,
  onResetDemo
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [eventDropdownOpen, setEventDropdownOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Calendar },
    { id: 'ai-planner', label: 'AI Planner', icon: Sparkles, badge: 'AI' },
    { id: 'budget', label: 'Budget', icon: DollarSign },
    { id: 'timeline', label: 'Timeline', icon: CheckSquare },
    { id: 'vendors', label: 'Vendors', icon: Store },
    { id: 'guests', label: 'Guests', icon: Users },
    { id: 'inspiration', label: 'Inspiration', icon: Compass },
    { id: 'day-of', label: 'Day-Of Sheet', icon: Clock }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs no-print">
      {/* Top Banner for Demo Mode & Notice */}
      <div className="bg-gradient-to-r from-[#5B5CF0] via-[#7B61FF] to-[#FF7799] text-white text-xs py-1.5 px-4 font-medium flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase">
            Demo Mode Active
          </span>
          <span className="truncate hidden sm:inline">
            EventEase AI is running with seeded realistic data and deterministic AI planning. No API key required!
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setResetModalOpen(true)}
            className="flex items-center gap-1 text-[11px] bg-white/15 hover:bg-white/25 transition px-2.5 py-0.5 rounded-md text-white font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-white"
            title="Reset to initial demo data"
            aria-label="Reset demo to initial data"
          >
            <RotateCcw className="w-3 h-3" aria-hidden="true" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setCurrentView('landing')}
              className="flex items-center gap-2.5 text-left group transition focus:outline-none focus:ring-2 focus:ring-[#5B5CF0] rounded-xl p-1"
              aria-label="EventEase AI Home"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#5B5CF0] to-[#FF7799] flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition">
                <Sparkles className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-[#14213D] block font-heading">
                  EventEase <span className="text-[#5B5CF0]">AI</span>
                </span>
                <span className="text-[10px] text-slate-500 block font-medium tracking-wider uppercase -mt-0.5">
                  Plan Smarter. Celebrate Better.
                </span>
              </div>
            </button>

            {/* Event Switcher Dropdown (when not on landing) */}
            {currentView !== 'landing' && (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setEventDropdownOpen(!eventDropdownOpen)}
                  aria-haspopup="listbox"
                  aria-expanded={eventDropdownOpen}
                  aria-label="Select active event"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-800 transition max-w-[240px] focus:outline-none focus:ring-2 focus:ring-[#5B5CF0]"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true"></span>
                  <span className="truncate text-left">{activeEvent?.title || 'Select Event'}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                </button>

                {eventDropdownOpen && (
                  <div
                    role="listbox"
                    aria-label="Available events"
                    className="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 text-xs"
                    onMouseLeave={() => setEventDropdownOpen(false)}
                  >
                    <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Your Events ({events.length})
                    </div>
                    {events.map((e) => (
                      <button
                        key={e.id}
                        role="option"
                        aria-selected={e.id === activeEvent?.id}
                        onClick={() => {
                          onSelectEvent(e.id);
                          setEventDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left flex items-start gap-2 hover:bg-slate-50 transition cursor-pointer focus:outline-none focus:bg-indigo-50 ${
                          e.id === activeEvent?.id ? 'bg-indigo-50/70 text-[#5B5CF0] font-semibold' : 'text-slate-700'
                        }`}
                      >
                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" aria-hidden="true"></span>
                        <div className="overflow-hidden">
                          <p className="truncate font-medium">{e.title}</p>
                          <p className="text-[10px] text-slate-400">{e.eventType} • {e.date}</p>
                        </div>
                      </button>
                    ))}
                    <div className="border-t border-slate-100 my-1"></div>
                    <button
                      onClick={() => {
                        setEventDropdownOpen(false);
                        onOpenNewEventWizard();
                      }}
                      className="w-full px-3 py-2 text-left flex items-center gap-2 text-[#5B5CF0] font-semibold hover:bg-indigo-50 transition cursor-pointer focus:outline-none focus:bg-indigo-50"
                    >
                      <PlusCircle className="w-4 h-4" aria-hidden="true" />
                      <span>Create New Event</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition cursor-pointer relative focus:outline-none focus:ring-2 focus:ring-[#5B5CF0] ${
                    isActive
                      ? 'text-[#5B5CF0] bg-indigo-50/80 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#5B5CF0]' : 'text-slate-500'}`} aria-hidden="true" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-0.5 text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-linear-to-r from-[#5B5CF0] to-[#FF7799] text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Actions & New Event Button */}
          <div className="hidden sm:flex items-center gap-3">
            {currentView === 'landing' ? (
              <button
                onClick={() => setCurrentView('dashboard')}
                className="text-xs font-bold text-slate-700 hover:text-indigo-600 px-3 py-2 rounded-lg hover:bg-slate-100 transition"
              >
                Go to Dashboard
              </button>
            ) : null}

            <button
              onClick={onOpenNewEventWizard}
              className="flex items-center gap-2 bg-gradient-to-r from-[#5B5CF0] to-[#7B61FF] hover:from-[#4D4ED8] hover:to-[#6A4FE8] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-indigo-500/25 transition transform active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Plan Event</span>
            </button>
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onOpenNewEventWizard}
              className="p-2 text-[#5B5CF0] bg-indigo-50 rounded-lg hover:bg-indigo-100 transition sm:hidden"
              title="Create Event"
            >
              <PlusCircle className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-[#14213D]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl animate-in fade-in slide-in-from-top duration-200">
          <div className="mb-4 pb-3 border-b border-slate-100">
            <p className="text-xs font-semibold text-slate-400 mb-2 uppercase">Active Event</p>
            <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg">
              <div>
                <p className="text-sm font-bold text-slate-800">{activeEvent?.title}</p>
                <p className="text-xs text-slate-500">{activeEvent?.eventType} • {activeEvent?.date}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setCurrentView('landing');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-2.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 transition"
            >
              <Sparkles className="w-4 h-4 text-[#5B5CF0]" />
              <span>Home / Landing</span>
            </button>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-semibold transition ${
                    isActive
                      ? 'text-[#5B5CF0] bg-indigo-50 font-bold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4 text-slate-500" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenNewEventWizard();
              }}
              className="w-full flex items-center justify-center gap-2 bg-[#5B5CF0] text-white py-2.5 rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Plan New Event</span>
            </button>
          </div>
        </div>
      )}

      {/* Reset Demo Modal */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-heading">
              Reset Demo to Initial State?
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              This will restore the 3 seeded sample events (Priya & Aarav's Wedding, Leo's Superhero Birthday, and Diwali Festival) along with their curated budgets, guest lists, and timelines.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setResetModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onResetDemo();
                  setResetModalOpen(false);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-md transition"
              >
                Reset Demo Data
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
