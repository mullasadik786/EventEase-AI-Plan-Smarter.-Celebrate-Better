import React from 'react';
import {
  Sparkles,
  Calendar,
  DollarSign,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  PlusCircle,
  Users,
  Store,
  ChevronRight,
  MapPin
} from 'lucide-react';
import { AppEvent, BudgetItem, TimelineTask, Guest } from '../types';
import { formatCurrency, formatDate, getDaysRemaining } from '../lib/formatters';

interface DashboardViewProps {
  events: AppEvent[];
  activeEvent?: AppEvent;
  budgetItems: BudgetItem[];
  tasks: TimelineTask[];
  guests: Guest[];
  onSelectEvent: (eventId: string) => void;
  onNavigate: (view: string) => void;
  onOpenNewEventWizard: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  events,
  activeEvent,
  budgetItems,
  tasks,
  guests,
  onSelectEvent,
  onNavigate,
  onOpenNewEventWizard
}) => {
  if (!activeEvent) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">No active event selected</h2>
        <button
          onClick={onOpenNewEventWizard}
          className="mt-4 px-4 py-2 bg-[#5B5CF0] text-white rounded-xl text-sm font-semibold"
        >
          Create New Event
        </button>
      </div>
    );
  }

  // Calculate deterministic financial totals
  const totalBudget = activeEvent.totalBudget;
  const currency = activeEvent.currency;
  const contingencyPercent = activeEvent.contingencyPercent || 10;
  const contingencyAmount = Math.round(totalBudget * (contingencyPercent / 100));
  const availablePlanningBudget = totalBudget - contingencyAmount;

  const totalEstimatedCost = budgetItems.reduce((acc, item) => acc + (item.estimatedCost || 0), 0);
  const totalActualCost = budgetItems.reduce((acc, item) => acc + (item.actualCost || 0), 0);
  const totalPaid = budgetItems.reduce((acc, item) => acc + (item.paidAmount || 0), 0);
  const remainingBudget = totalBudget - totalActualCost;

  // Task statistics
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const taskProgressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Guests statistics
  const confirmedGuests = guests
    .filter((g) => g.rsvpStatus === 'confirmed')
    .reduce((acc, g) => acc + 1 + (g.plusOnes || 0), 0);
  const pendingGuests = guests.filter((g) => g.rsvpStatus === 'pending').length;

  const daysLeft = getDaysRemaining(activeEvent.date);

  // Category breakdown for budget
  const categoryMap: { [cat: string]: { estimated: number; actual: number } } = {};
  budgetItems.forEach((item) => {
    if (!categoryMap[item.category]) {
      categoryMap[item.category] = { estimated: 0, actual: 0 };
    }
    categoryMap[item.category].estimated += item.estimatedCost || 0;
    categoryMap[item.category].actual += item.actualCost || 0;
  });

  const categoryEntries = Object.entries(categoryMap);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5B5CF0] bg-indigo-50 px-2.5 py-0.5 rounded-full">
              {activeEvent.eventType}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-medium text-slate-500">
              {activeEvent.city}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14213D] font-heading">
            Let's plan something unforgettable.
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Managing <span className="font-semibold text-slate-900">{activeEvent.title}</span> on{' '}
            <span className="font-semibold text-slate-900">{formatDate(activeEvent.date)}</span> ({activeEvent.guestCount} guests)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Countdown Badge */}
          <div className="bg-gradient-to-br from-[#14213D] to-[#1E2D4A] text-white px-4 py-2.5 rounded-2xl shadow-sm text-center">
            <span className="text-xs text-slate-300 block font-medium">Countdown</span>
            <span className="text-xl font-black text-amber-300 font-heading">
              {daysLeft > 0 ? `${daysLeft} Days` : daysLeft === 0 ? 'Today!' : 'Completed'}
            </span>
          </div>

          <button
            onClick={() => onNavigate('ai-planner')}
            className="flex items-center gap-2 bg-[#5B5CF0] hover:bg-[#4A4BCF] text-white px-4 py-2.5 rounded-2xl text-xs font-bold shadow-md shadow-indigo-500/20 transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Event Assistant</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Budget */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Planned Budget</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-[#5B5CF0] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#14213D] font-heading">
            {formatCurrency(totalBudget, currency)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Contingency reserve: <span className="font-semibold text-slate-700">{formatCurrency(contingencyAmount, currency)} ({contingencyPercent}%)</span>
          </p>
          <div className="mt-3 text-[11px] bg-slate-50 text-slate-600 px-2.5 py-1 rounded-md border border-slate-100 flex items-center justify-between">
            <span>Available for planning:</span>
            <span className="font-bold">{formatCurrency(availablePlanningBudget, currency)}</span>
          </div>
        </div>

        {/* Card 2: Actual Expenses & Remaining */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Actual Spent / Committed</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#14213D] font-heading">
            {formatCurrency(totalActualCost, currency)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Paid deposits: <span className="font-semibold text-slate-700">{formatCurrency(totalPaid, currency)}</span>
          </p>
          <div className={`mt-3 text-[11px] px-2.5 py-1 rounded-md border flex items-center justify-between font-semibold ${
            remainingBudget >= 0
              ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
              : 'bg-rose-50 border-rose-100 text-rose-700'
          }`}>
            <span>Remaining Budget:</span>
            <span className="font-bold">{formatCurrency(remainingBudget, currency)}</span>
          </div>
        </div>

        {/* Card 3: Tasks & Milestones */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Task Progress</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-black text-[#14213D] font-heading">
              {completedTasks} / {totalTasks}
            </div>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              {taskProgressPct}%
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-400 to-[#5B5CF0] h-2 rounded-full transition-all duration-500"
              style={{ width: `${taskProgressPct}%` }}
            />
          </div>
          <button
            onClick={() => onNavigate('timeline')}
            className="mt-3 text-[11px] font-bold text-[#5B5CF0] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Manage All Tasks</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 4: Guest Attendance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Guest RSVPs</span>
            <div className="w-8 h-8 rounded-lg bg-pink-50 text-[#FF7799] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#14213D] font-heading">
            {confirmedGuests} <span className="text-xs font-normal text-slate-400">confirmed</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Target: <span className="font-semibold text-slate-700">{activeEvent.guestCount} guests</span> • Pending: <span className="font-semibold text-amber-600">{pendingGuests}</span>
          </p>
          <button
            onClick={() => onNavigate('guests')}
            className="mt-3 text-[11px] font-bold text-[#5B5CF0] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Open Guest List & Meals</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* AI Recommendation Banner */}
      <div className="bg-gradient-to-r from-[#EEEAFE] via-white to-[#FFF9F0] p-5 rounded-2xl border border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#5B5CF0] to-[#FF7799] text-white flex items-center justify-center shrink-0 shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 font-heading">
              AI Event Recommendation for {activeEvent.title}
            </h4>
            <p className="text-xs text-slate-600 mt-0.5 max-w-3xl">
              "You have allocated {categoryEntries.length} major budget buckets. Current actual costs are within planning budget limits. Consider approving the floral mandap render to reserve fresh seasonal tuberose with the florist."
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('ai-planner')}
          className="shrink-0 text-xs font-bold text-white bg-[#5B5CF0] hover:bg-[#4A4BCF] px-4 py-2 rounded-xl shadow-xs transition cursor-pointer"
        >
          View Full AI Plan
        </button>
      </div>

      {/* Main Grid: Budget Allocation & Upcoming Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Category Spending Progress */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Budget Allocation & Expenses
              </h3>
              <p className="text-xs text-slate-500">Planned estimates vs committed actual costs</p>
            </div>
            <button
              onClick={() => onNavigate('budget')}
              className="text-xs font-bold text-[#5B5CF0] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Detailed Budget</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {categoryEntries.slice(0, 6).map(([category, amounts], idx) => {
              const pct = amounts.estimated > 0 ? Math.min(100, Math.round((amounts.actual / amounts.estimated) * 100)) : 0;
              const isOver = amounts.actual > amounts.estimated;
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{category}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">
                        {formatCurrency(amounts.actual, currency)} / {formatCurrency(amounts.estimated, currency)}
                      </span>
                      {isOver && (
                        <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-1.5 py-0.2 rounded-sm">
                          Overrun
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        isOver
                          ? 'bg-rose-500'
                          : pct >= 80
                          ? 'bg-amber-500'
                          : 'bg-[#5B5CF0]'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Total Estimated: <strong className="text-slate-800">{formatCurrency(totalEstimatedCost, currency)}</strong></span>
            <span>Total Committed: <strong className="text-slate-800">{formatCurrency(totalActualCost, currency)}</strong></span>
          </div>
        </div>

        {/* Right Column: Upcoming Milestone Deadlines */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-heading">
                  Upcoming Deadlines
                </h3>
                <p className="text-xs text-slate-500">Critical tasks leading to event day</p>
              </div>
              <button
                onClick={() => onNavigate('timeline')}
                className="text-xs font-bold text-[#5B5CF0] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>All Tasks</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {tasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  className={`p-3 rounded-xl border flex items-start justify-between gap-3 ${
                    task.status === 'completed'
                      ? 'bg-slate-50/70 border-slate-100 opacity-60'
                      : task.priority === 'high'
                      ? 'bg-amber-50/40 border-amber-200/70'
                      : 'bg-white border-slate-100'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                      task.status === 'completed'
                        ? 'bg-emerald-500 text-white'
                        : 'border border-slate-300'
                    }`}>
                      {task.status === 'completed' && '✓'}
                    </div>
                    <div>
                      <p className={`text-xs font-semibold ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                        {task.title}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        Due: {task.dueDate} • Owner: {task.owner}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    task.priority === 'high'
                      ? 'bg-rose-100 text-rose-700'
                      : task.priority === 'medium'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('day-of')}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Clock className="w-4 h-4" />
            <span>Open Event-Day Command Center</span>
          </button>
        </div>
      </div>

      {/* Your Events Carousel / Grid */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-heading">
              Your Events Portfolio ({events.length})
            </h3>
            <p className="text-xs text-slate-500">Switch between celebrations or add a new one</p>
          </div>
          <button
            onClick={onOpenNewEventWizard}
            className="flex items-center gap-1.5 text-xs font-bold text-[#5B5CF0] hover:bg-indigo-50 px-3 py-1.5 rounded-xl transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Event</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((evt) => {
            const isSelected = evt.id === activeEvent.id;
            return (
              <div
                key={evt.id}
                onClick={() => onSelectEvent(evt.id)}
                className={`group rounded-2xl border p-4 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#5B5CF0] bg-indigo-50/20 shadow-md ring-2 ring-indigo-500/20'
                    : 'border-slate-200/80 hover:border-slate-300 hover:shadow-sm bg-white'
                }`}
              >
                <div>
                  <div className="relative h-32 rounded-xl overflow-hidden mb-3 bg-slate-100">
                    <img
                      src={evt.coverImage}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-xs text-[10px] font-bold px-2 py-0.5 rounded-md text-slate-900">
                      {evt.eventType}
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-[#5B5CF0] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                        Active
                      </div>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 font-heading line-clamp-1 group-hover:text-[#5B5CF0] transition">
                    {evt.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span className="truncate">{evt.city}</span>
                    <span>•</span>
                    <span>{formatDate(evt.date)}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Budget</span>
                    <span className="font-bold text-slate-800">{formatCurrency(evt.totalBudget, evt.currency)}</span>
                  </div>
                  <span className={`text-[11px] font-bold ${isSelected ? 'text-[#5B5CF0]' : 'text-slate-600'}`}>
                    {isSelected ? 'Currently Viewing' : 'Switch Event →'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
