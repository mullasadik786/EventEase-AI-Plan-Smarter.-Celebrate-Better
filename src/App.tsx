import React, { useState, useEffect } from 'react';
import { StorageService } from './services/storage';
import {
  AppEvent,
  BudgetItem,
  TimelineTask,
  Vendor,
  Guest,
  DayOfScheduleItem,
  InspirationItem,
  EventType,
  GeneratedPlan
} from './types';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { DashboardView } from './components/DashboardView';
import { AiPlannerWizard } from './components/AiPlannerWizard';
import { AiPlannerDetailView } from './components/AiPlannerDetailView';
import { BudgetView } from './components/BudgetView';
import { TimelineView } from './components/TimelineView';
import { VendorsView } from './components/VendorsView';
import { GuestsView } from './components/GuestsView';
import { InspirationView } from './components/InspirationView';
import { EventDayView } from './components/EventDayView';
import { ExportModal } from './components/ExportModal';

export const App: React.FC = () => {
  // Navigation State
  const [currentView, setCurrentView] = useState<string>('landing');

  // Core Data State
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [activeEventId, setActiveEventId] = useState<string>('');
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [tasks, setTasks] = useState<TimelineTask[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [dayOfSchedule, setDayOfSchedule] = useState<DayOfScheduleItem[]>([]);
  const [inspirations, setInspirations] = useState<InspirationItem[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // Wizard & Export Modal State
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardInitialType, setWizardInitialType] = useState<EventType>('Wedding');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    StorageService.init();
    refreshAllData();
  }, []);

  const refreshAllData = () => {
    const loadedEvents = StorageService.getEvents();
    const activeId = StorageService.getActiveEventId();
    setEvents(loadedEvents);
    setActiveEventId(activeId);

    setBudgetItems(StorageService.getBudgetItems(activeId));
    setTasks(StorageService.getTasks(activeId));
    setVendors(StorageService.getVendors(activeId));
    setGuests(StorageService.getGuests(activeId));
    setDayOfSchedule(StorageService.getDayOfSchedule(activeId));
    setInspirations(StorageService.getInspirations());
    setFavoriteIds(StorageService.getFavoriteIds());
  };

  // Switch active event
  const handleSelectEvent = (eventId: string) => {
    StorageService.setActiveEventId(eventId);
    setActiveEventId(eventId);
    setBudgetItems(StorageService.getBudgetItems(eventId));
    setTasks(StorageService.getTasks(eventId));
    setVendors(StorageService.getVendors(eventId));
    setGuests(StorageService.getGuests(eventId));
    setDayOfSchedule(StorageService.getDayOfSchedule(eventId));
  };

  const activeEvent = events.find((e) => e.id === activeEventId) || events[0];

  // Reset Demo State
  const handleResetDemo = () => {
    StorageService.resetToDemo();
    refreshAllData();
    setCurrentView('dashboard');
  };

  // Launch New Event Wizard
  const handleStartPlanning = (initialType: EventType = 'Wedding') => {
    setWizardInitialType(initialType);
    setIsWizardOpen(true);
  };

  // Event Created from Wizard
  const handleEventCreated = (newEvent: AppEvent, plan?: GeneratedPlan) => {
    StorageService.saveEvent(newEvent);

    // If a plan was generated, seed initial budget and tasks from the plan
    if (plan) {
      const generatedBudgetItems: BudgetItem[] = plan.budget.categories.map((c, i) => ({
        id: `b-gen-${Date.now()}-${i}`,
        eventId: newEvent.id,
        category: c.name,
        name: `${c.name} Allocation`,
        estimatedCost: c.estimatedCost,
        actualCost: 0,
        paidAmount: 0,
        status: 'unpaid',
        priority: c.priority,
        notes: c.reason
      }));

      const generatedTasks: TimelineTask[] = plan.timeline.map((t, i) => ({
        id: `t-gen-${Date.now()}-${i}`,
        eventId: newEvent.id,
        title: t.title,
        dueDate: t.dueDate,
        category: 'Milestone',
        priority: t.priority,
        status: 'todo',
        owner: t.owner
      }));

      const existingBudget = StorageService.getBudgetItems();
      const existingTasks = StorageService.getTasks();

      StorageService.saveBudgetItems([...existingBudget, ...generatedBudgetItems]);
      StorageService.saveTasks([...existingTasks, ...generatedTasks]);
    }

    refreshAllData();
    handleSelectEvent(newEvent.id);
    setCurrentView('ai-planner');
  };

  // Apply Generated Plan directly to budget and tasks
  const handleApplyPlanToEvent = (plan: GeneratedPlan) => {
    if (!activeEvent) return;

    // Convert plan categories to budget items
    const newBudgetItems: BudgetItem[] = plan.budget.categories.map((cat, i) => ({
      id: `b-plan-${Date.now()}-${i}`,
      eventId: activeEvent.id,
      category: cat.name,
      name: `${cat.name} Package`,
      estimatedCost: cat.estimatedCost,
      actualCost: 0,
      paidAmount: 0,
      status: 'unpaid',
      priority: cat.priority,
      notes: cat.reason
    }));

    // Convert plan timeline to tasks
    const newTasks: TimelineTask[] = plan.timeline.map((item, i) => ({
      id: `t-plan-${Date.now()}-${i}`,
      eventId: activeEvent.id,
      title: item.title,
      dueDate: item.dueDate,
      category: 'Planning',
      priority: item.priority,
      status: 'todo',
      owner: item.owner
    }));

    // Save and merge
    const currentBudget = StorageService.getBudgetItems().filter((b) => b.eventId !== activeEvent.id);
    const currentTasks = StorageService.getTasks().filter((t) => t.eventId !== activeEvent.id);

    StorageService.saveBudgetItems([...currentBudget, ...newBudgetItems]);
    StorageService.saveTasks([...currentTasks, ...newTasks]);

    // Update active event's theme and palette if needed
    const updatedEvent: AppEvent = {
      ...activeEvent,
      theme: plan.eventSummary.theme || activeEvent.theme,
      colorPalette: plan.eventSummary.colorPalette || activeEvent.colorPalette,
      generatedPlan: plan
    };
    StorageService.saveEvent(updatedEvent);

    refreshAllData();
  };

  // Budget Handlers
  const handleAddBudgetItem = (item: BudgetItem) => {
    StorageService.addBudgetItem(item);
    setBudgetItems(StorageService.getBudgetItems(activeEventId));
  };

  const handleUpdateBudgetItem = (item: BudgetItem) => {
    StorageService.updateBudgetItem(item);
    setBudgetItems(StorageService.getBudgetItems(activeEventId));
  };

  const handleDeleteBudgetItem = (id: string) => {
    StorageService.deleteBudgetItem(id);
    setBudgetItems(StorageService.getBudgetItems(activeEventId));
  };

  const handleUpdateEventBudget = (newBudget: number, contingencyPercent: number) => {
    if (!activeEvent) return;
    const updated: AppEvent = {
      ...activeEvent,
      totalBudget: newBudget,
      contingencyPercent: contingencyPercent
    };
    StorageService.saveEvent(updated);
    refreshAllData();
  };

  // Task Handlers
  const handleAddTask = (task: TimelineTask) => {
    StorageService.addTask(task);
    setTasks(StorageService.getTasks(activeEventId));
  };

  const handleUpdateTask = (task: TimelineTask) => {
    StorageService.updateTask(task);
    setTasks(StorageService.getTasks(activeEventId));
  };

  const handleDeleteTask = (id: string) => {
    StorageService.deleteTask(id);
    setTasks(StorageService.getTasks(activeEventId));
  };

  // Vendor Handlers
  const handleAddVendor = (vendor: Vendor) => {
    StorageService.addVendor(vendor);
    setVendors(StorageService.getVendors(activeEventId));
  };

  const handleUpdateVendor = (vendor: Vendor) => {
    StorageService.updateVendor(vendor);
    setVendors(StorageService.getVendors(activeEventId));
  };

  const handleDeleteVendor = (id: string) => {
    StorageService.deleteVendor(id);
    setVendors(StorageService.getVendors(activeEventId));
  };

  // Guest Handlers
  const handleAddGuest = (guest: Guest) => {
    StorageService.addGuest(guest);
    setGuests(StorageService.getGuests(activeEventId));
  };

  const handleUpdateGuest = (guest: Guest) => {
    StorageService.updateGuest(guest);
    setGuests(StorageService.getGuests(activeEventId));
  };

  const handleDeleteGuest = (id: string) => {
    StorageService.deleteGuest(id);
    setGuests(StorageService.getGuests(activeEventId));
  };

  const handleBulkAddGuests = (newGuests: Guest[]) => {
    const current = StorageService.getGuests();
    StorageService.saveGuests([...current, ...newGuests]);
    setGuests(StorageService.getGuests(activeEventId));
  };

  // Schedule Handlers
  const handleToggleScheduleItem = (id: string) => {
    const item = dayOfSchedule.find((s) => s.id === id);
    if (item) {
      const updated = { ...item, completed: !item.completed };
      StorageService.updateDayOfScheduleItem(updated);
      setDayOfSchedule(StorageService.getDayOfSchedule(activeEventId));
    }
  };

  const handleAddScheduleItem = (item: DayOfScheduleItem) => {
    StorageService.addDayOfScheduleItem(item);
    setDayOfSchedule(StorageService.getDayOfSchedule(activeEventId));
  };

  const handleDeleteScheduleItem = (id: string) => {
    StorageService.deleteDayOfScheduleItem(id);
    setDayOfSchedule(StorageService.getDayOfSchedule(activeEventId));
  };

  // Inspiration Handlers
  const handleToggleFavorite = (id: string) => {
    const nextFavs = StorageService.toggleFavorite(id);
    setFavoriteIds(nextFavs);
  };

  const handleApplyThemeToEvent = (theme: string, colorPalette: string[]) => {
    if (!activeEvent) return;
    const updated: AppEvent = {
      ...activeEvent,
      theme,
      colorPalette
    };
    StorageService.saveEvent(updated);
    refreshAllData();
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#14213D] flex flex-col font-sans selection:bg-[#5B5CF0] selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        events={events}
        activeEvent={activeEvent}
        onSelectEvent={handleSelectEvent}
        onOpenNewEventWizard={() => handleStartPlanning()}
        onResetDemo={handleResetDemo}
      />

      {/* Main View Router */}
      <main id="main-content" className="flex-1 focus:outline-none" tabIndex={-1}>
        {currentView === 'landing' && (
          <LandingPage
            onStartPlanning={handleStartPlanning}
            onExploreDemo={() => setCurrentView('dashboard')}
            onSelectSampleEvent={(evtId) => {
              handleSelectEvent(evtId);
              setCurrentView('dashboard');
            }}
          />
        )}

        {currentView === 'dashboard' && activeEvent && (
          <DashboardView
            events={events}
            activeEvent={activeEvent}
            budgetItems={budgetItems}
            tasks={tasks}
            guests={guests}
            onSelectEvent={handleSelectEvent}
            onNavigate={(view) => setCurrentView(view)}
            onOpenNewEventWizard={() => handleStartPlanning()}
          />
        )}

        {currentView === 'ai-planner' && activeEvent && (
          <AiPlannerDetailView
            activeEvent={activeEvent}
            onApplyPlanToEvent={handleApplyPlanToEvent}
            onRegenerate={() => handleStartPlanning(activeEvent.eventType)}
            onOpenExport={() => setIsExportModalOpen(true)}
          />
        )}

        {currentView === 'budget' && activeEvent && (
          <BudgetView
            activeEvent={activeEvent}
            budgetItems={budgetItems}
            onAddBudgetItem={handleAddBudgetItem}
            onUpdateBudgetItem={handleUpdateBudgetItem}
            onDeleteBudgetItem={handleDeleteBudgetItem}
            onUpdateEventBudget={handleUpdateEventBudget}
          />
        )}

        {currentView === 'timeline' && activeEvent && (
          <TimelineView
            activeEvent={activeEvent}
            tasks={tasks}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        )}

        {currentView === 'vendors' && activeEvent && (
          <VendorsView
            activeEvent={activeEvent}
            vendors={vendors}
            onAddVendor={handleAddVendor}
            onUpdateVendor={handleUpdateVendor}
            onDeleteVendor={handleDeleteVendor}
          />
        )}

        {currentView === 'guests' && activeEvent && (
          <GuestsView
            activeEvent={activeEvent}
            guests={guests}
            onAddGuest={handleAddGuest}
            onUpdateGuest={handleUpdateGuest}
            onDeleteGuest={handleDeleteGuest}
            onBulkAddGuests={handleBulkAddGuests}
          />
        )}

        {currentView === 'inspiration' && activeEvent && (
          <InspirationView
            activeEvent={activeEvent}
            inspirations={inspirations}
            favoriteIds={favoriteIds}
            onToggleFavorite={handleToggleFavorite}
            onApplyThemeToEvent={handleApplyThemeToEvent}
          />
        )}

        {currentView === 'day-of' && activeEvent && (
          <EventDayView
            activeEvent={activeEvent}
            scheduleItems={dayOfSchedule}
            vendors={vendors}
            budgetItems={budgetItems}
            onToggleScheduleItem={handleToggleScheduleItem}
            onAddScheduleItem={handleAddScheduleItem}
            onDeleteScheduleItem={handleDeleteScheduleItem}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-8 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900 font-heading">EventEase AI</span>
            <span>—</span>
            <span className="italic">Plan Smarter. Celebrate Better.</span>
          </div>

          <p className="text-[11px] text-slate-400">
            Powered by Gemini AI • Deterministic Budgeting • Offline Demo Capable
          </p>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <button onClick={() => setCurrentView('landing')} className="hover:text-indigo-600 transition">
              Home
            </button>
            <button onClick={() => setCurrentView('dashboard')} className="hover:text-indigo-600 transition">
              Dashboard
            </button>
            <button onClick={handleResetDemo} className="hover:text-amber-600 transition">
              Reset Demo
            </button>
          </div>
        </div>
      </footer>

      {/* AI Event Creation Wizard Modal */}
      {isWizardOpen && (
        <AiPlannerWizard
          isOpen={isWizardOpen}
          onClose={() => setIsWizardOpen(false)}
          onEventCreated={handleEventCreated}
          initialType={wizardInitialType}
        />
      )}

      {/* Export Modal */}
      {isExportModalOpen && activeEvent && (
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          activeEvent={activeEvent}
          budgetItems={budgetItems}
          tasks={tasks}
          guests={guests}
          vendors={vendors}
        />
      )}
    </div>
  );
};
export default App;
