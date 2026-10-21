import {
  AppEvent,
  BudgetItem,
  TimelineTask,
  Vendor,
  Guest,
  DayOfScheduleItem,
  InspirationItem
} from '../types';
import {
  SEED_EVENTS,
  SEED_BUDGET_ITEMS,
  SEED_TASKS,
  SEED_VENDORS,
  SEED_GUESTS,
  SEED_DAY_OF_SCHEDULE,
  SEED_INSPIRATIONS
} from '../data/seedData';

const STORAGE_KEYS = {
  EVENTS: 'eventease_events_v1',
  ACTIVE_EVENT_ID: 'eventease_active_event_id_v1',
  BUDGET_ITEMS: 'eventease_budget_items_v1',
  TASKS: 'eventease_tasks_v1',
  VENDORS: 'eventease_vendors_v1',
  GUESTS: 'eventease_guests_v1',
  DAY_OF_SCHEDULE: 'eventease_day_of_schedule_v1',
  INSPIRATIONS: 'eventease_inspirations_v1',
  FAVORITES: 'eventease_favorites_v1'
};

// Safe JSON parser helper
function getStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Failed to parse localStorage key "${key}":`, e);
    return fallback;
  }
}

function setStored<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to write localStorage key "${key}":`, e);
  }
}

export const StorageService = {
  // Initialize storage if empty
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
      setStored(STORAGE_KEYS.EVENTS, SEED_EVENTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ACTIVE_EVENT_ID)) {
      setStored(STORAGE_KEYS.ACTIVE_EVENT_ID, SEED_EVENTS[0].id);
    }
    if (!localStorage.getItem(STORAGE_KEYS.BUDGET_ITEMS)) {
      setStored(STORAGE_KEYS.BUDGET_ITEMS, SEED_BUDGET_ITEMS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.TASKS)) {
      setStored(STORAGE_KEYS.TASKS, SEED_TASKS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.VENDORS)) {
      setStored(STORAGE_KEYS.VENDORS, SEED_VENDORS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.GUESTS)) {
      setStored(STORAGE_KEYS.GUESTS, SEED_GUESTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.DAY_OF_SCHEDULE)) {
      setStored(STORAGE_KEYS.DAY_OF_SCHEDULE, SEED_DAY_OF_SCHEDULE);
    }
    if (!localStorage.getItem(STORAGE_KEYS.INSPIRATIONS)) {
      setStored(STORAGE_KEYS.INSPIRATIONS, SEED_INSPIRATIONS);
    }
  },

  resetToDemo() {
    setStored(STORAGE_KEYS.EVENTS, SEED_EVENTS);
    setStored(STORAGE_KEYS.ACTIVE_EVENT_ID, SEED_EVENTS[0].id);
    setStored(STORAGE_KEYS.BUDGET_ITEMS, SEED_BUDGET_ITEMS);
    setStored(STORAGE_KEYS.TASKS, SEED_TASKS);
    setStored(STORAGE_KEYS.VENDORS, SEED_VENDORS);
    setStored(STORAGE_KEYS.GUESTS, SEED_GUESTS);
    setStored(STORAGE_KEYS.DAY_OF_SCHEDULE, SEED_DAY_OF_SCHEDULE);
    setStored(STORAGE_KEYS.INSPIRATIONS, SEED_INSPIRATIONS);
    setStored(STORAGE_KEYS.FAVORITES, []);
    return true;
  },

  // Events
  getEvents(): AppEvent[] {
    return getStored<AppEvent[]>(STORAGE_KEYS.EVENTS, SEED_EVENTS);
  },

  getActiveEventId(): string {
    return getStored<string>(STORAGE_KEYS.ACTIVE_EVENT_ID, SEED_EVENTS[0].id);
  },

  setActiveEventId(id: string): void {
    setStored(STORAGE_KEYS.ACTIVE_EVENT_ID, id);
  },

  getActiveEvent(): AppEvent | undefined {
    const events = this.getEvents();
    const activeId = this.getActiveEventId();
    return events.find(e => e.id === activeId) || events[0];
  },

  saveEvent(event: AppEvent): void {
    const events = this.getEvents();
    const index = events.findIndex(e => e.id === event.id);
    if (index >= 0) {
      events[index] = event;
    } else {
      events.unshift(event);
    }
    setStored(STORAGE_KEYS.EVENTS, events);
    this.setActiveEventId(event.id);
  },

  deleteEvent(eventId: string): void {
    let events = this.getEvents();
    events = events.filter(e => e.id !== eventId);
    setStored(STORAGE_KEYS.EVENTS, events);

    // Also clean up associated records
    this.saveBudgetItems(this.getBudgetItems().filter(b => b.eventId !== eventId));
    this.saveTasks(this.getTasks().filter(t => t.eventId !== eventId));
    this.saveVendors(this.getVendors().filter(v => v.eventId !== eventId));
    this.saveGuests(this.getGuests().filter(g => g.eventId !== eventId));
    this.saveDayOfSchedule(this.getDayOfSchedule().filter(s => s.eventId !== eventId));

    if (events.length > 0) {
      this.setActiveEventId(events[0].id);
    }
  },

  // Budget
  getBudgetItems(eventId?: string): BudgetItem[] {
    const all = getStored<BudgetItem[]>(STORAGE_KEYS.BUDGET_ITEMS, SEED_BUDGET_ITEMS);
    return eventId ? all.filter(item => item.eventId === eventId) : all;
  },

  saveBudgetItems(items: BudgetItem[]): void {
    setStored(STORAGE_KEYS.BUDGET_ITEMS, items);
  },

  addBudgetItem(item: BudgetItem): void {
    const all = this.getBudgetItems();
    all.push(item);
    this.saveBudgetItems(all);
  },

  updateBudgetItem(item: BudgetItem): void {
    const all = this.getBudgetItems();
    const idx = all.findIndex(b => b.id === item.id);
    if (idx >= 0) {
      all[idx] = item;
      this.saveBudgetItems(all);
    }
  },

  deleteBudgetItem(id: string): void {
    const all = this.getBudgetItems().filter(b => b.id !== id);
    this.saveBudgetItems(all);
  },

  // Tasks
  getTasks(eventId?: string): TimelineTask[] {
    const all = getStored<TimelineTask[]>(STORAGE_KEYS.TASKS, SEED_TASKS);
    return eventId ? all.filter(item => item.eventId === eventId) : all;
  },

  saveTasks(tasks: TimelineTask[]): void {
    setStored(STORAGE_KEYS.TASKS, tasks);
  },

  addTask(task: TimelineTask): void {
    const all = this.getTasks();
    all.push(task);
    this.saveTasks(all);
  },

  updateTask(task: TimelineTask): void {
    const all = this.getTasks();
    const idx = all.findIndex(t => t.id === task.id);
    if (idx >= 0) {
      all[idx] = task;
      this.saveTasks(all);
    }
  },

  deleteTask(id: string): void {
    const all = this.getTasks().filter(t => t.id !== id);
    this.saveTasks(all);
  },

  // Vendors
  getVendors(eventId?: string): Vendor[] {
    const all = getStored<Vendor[]>(STORAGE_KEYS.VENDORS, SEED_VENDORS);
    return eventId ? all.filter(v => v.eventId === eventId) : all;
  },

  saveVendors(vendors: Vendor[]): void {
    setStored(STORAGE_KEYS.VENDORS, vendors);
  },

  addVendor(vendor: Vendor): void {
    const all = this.getVendors();
    all.push(vendor);
    this.saveVendors(all);
  },

  updateVendor(vendor: Vendor): void {
    const all = this.getVendors();
    const idx = all.findIndex(v => v.id === vendor.id);
    if (idx >= 0) {
      all[idx] = vendor;
      this.saveVendors(all);
    }
  },

  deleteVendor(id: string): void {
    const all = this.getVendors().filter(v => v.id !== id);
    this.saveVendors(all);
  },

  // Guests
  getGuests(eventId?: string): Guest[] {
    const all = getStored<Guest[]>(STORAGE_KEYS.GUESTS, SEED_GUESTS);
    return eventId ? all.filter(g => g.eventId === eventId) : all;
  },

  saveGuests(guests: Guest[]): void {
    setStored(STORAGE_KEYS.GUESTS, guests);
  },

  addGuest(guest: Guest): void {
    const all = this.getGuests();
    all.push(guest);
    this.saveGuests(all);
  },

  updateGuest(guest: Guest): void {
    const all = this.getGuests();
    const idx = all.findIndex(g => g.id === guest.id);
    if (idx >= 0) {
      all[idx] = guest;
      this.saveGuests(all);
    }
  },

  deleteGuest(id: string): void {
    const all = this.getGuests().filter(g => g.id !== id);
    this.saveGuests(all);
  },

  // Day-of schedule
  getDayOfSchedule(eventId?: string): DayOfScheduleItem[] {
    const all = getStored<DayOfScheduleItem[]>(STORAGE_KEYS.DAY_OF_SCHEDULE, SEED_DAY_OF_SCHEDULE);
    return eventId ? all.filter(s => s.eventId === eventId) : all;
  },

  saveDayOfSchedule(items: DayOfScheduleItem[]): void {
    setStored(STORAGE_KEYS.DAY_OF_SCHEDULE, items);
  },

  addDayOfScheduleItem(item: DayOfScheduleItem): void {
    const all = this.getDayOfSchedule();
    all.push(item);
    this.saveDayOfSchedule(all);
  },

  updateDayOfScheduleItem(item: DayOfScheduleItem): void {
    const all = this.getDayOfSchedule();
    const idx = all.findIndex(s => s.id === item.id);
    if (idx >= 0) {
      all[idx] = item;
      this.saveDayOfSchedule(all);
    }
  },

  deleteDayOfScheduleItem(id: string): void {
    const all = this.getDayOfSchedule().filter(s => s.id !== id);
    this.saveDayOfSchedule(all);
  },

  // Inspirations & Favorites
  getInspirations(): InspirationItem[] {
    return getStored<InspirationItem[]>(STORAGE_KEYS.INSPIRATIONS, SEED_INSPIRATIONS);
  },

  getFavoriteIds(): string[] {
    return getStored<string[]>(STORAGE_KEYS.FAVORITES, ['insp-01', 'insp-03']);
  },

  toggleFavorite(id: string): string[] {
    const favs = this.getFavoriteIds();
    const next = favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id];
    setStored(STORAGE_KEYS.FAVORITES, next);
    return next;
  }
};
