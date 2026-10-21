import { describe, it, expect, beforeEach } from 'vitest';
import { StorageService } from '../src/services/storage';

describe('StorageService CRUD & Persistence', () => {
  beforeEach(() => {
    localStorage.clear();
    StorageService.init();
  });

  it('initializes default seed data when storage is empty', () => {
    const events = StorageService.getEvents();
    expect(events.length).toBeGreaterThan(0);
    expect(events[0].title).toBeDefined();

    const activeId = StorageService.getActiveEventId();
    expect(activeId).toBe(events[0].id);

    const budget = StorageService.getBudgetItems(activeId);
    expect(budget.length).toBeGreaterThan(0);

    const guests = StorageService.getGuests(activeId);
    expect(guests.length).toBeGreaterThan(0);
  });

  it('creates and retrieves a new custom event', () => {
    const newEvent = {
      id: 'custom-event-99',
      title: 'Aarav 1st Birthday Bash',
      eventType: 'Birthday' as const,
      date: '2027-04-10',
      time: '17:00',
      city: 'Bangalore',
      location: 'Palm Meadows Club',
      venueType: 'Outdoor' as const,
      guestCount: 80,
      currency: 'INR' as const,
      totalBudget: 250000,
      contingencyPercent: 10,
      theme: 'Jungle Safari Adventure',
      colorPalette: ['#2E7D32', '#FFB300', '#FFF8DC'],
      vision: 'Fun jungle adventure for family and kids',
      coverImage: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d',
      status: 'Planning' as const,
      culturalPreferences: 'South Indian & Modern Fusion',
      dietary: 'Vegetarian & Kids Specials',
      style: 'Playful & Colorful',
      planningPreferences: {
        diyVsPro: 'Hybrid' as const,
        priorities: ['Theme Decor', 'Custom Cake', 'Kids Entertainment'],
      },
      emergencyContacts: [
        { name: 'Dr. Ramesh', role: 'Pediatrician', phone: '+91 98888 11111' },
      ],
      createdAt: new Date().toISOString(),
    };

    StorageService.saveEvent(newEvent);
    const events = StorageService.getEvents();
    const retrieved = events.find((e) => e.id === 'custom-event-99');

    expect(retrieved).toBeDefined();
    expect(retrieved?.title).toBe('Aarav 1st Birthday Bash');
    expect(retrieved?.totalBudget).toBe(250000);
  });

  it('updates and deletes budget items correctly', () => {
    const activeId = StorageService.getActiveEventId();
    const newItem = {
      id: 'test-budget-item-1',
      eventId: activeId,
      category: 'Entertainment',
      name: 'Kids Magic Show',
      estimatedCost: 15000,
      actualCost: 14000,
      paidAmount: 5000,
      status: 'deposit_paid' as const,
      priority: 'high' as const,
      notes: '45-minute stage illusion',
    };

    StorageService.addBudgetItem(newItem);
    let items = StorageService.getBudgetItems(activeId);
    const found = items.find((i) => i.id === 'test-budget-item-1');
    expect(found).toBeDefined();
    expect(found?.estimatedCost).toBe(15000);

    // Delete
    StorageService.deleteBudgetItem('test-budget-item-1');
    items = StorageService.getBudgetItems(activeId);
    expect(items.find((i) => i.id === 'test-budget-item-1')).toBeUndefined();
  });

  it('adds and updates guest records accurately', () => {
    const activeId = StorageService.getActiveEventId();
    const newGuest = {
      id: 'test-guest-1',
      eventId: activeId,
      name: 'Sunita Rao',
      email: 'sunita@example.com',
      phone: '+91 99999 88888',
      group: 'VIP' as const,
      rsvpStatus: 'confirmed' as const,
      plusOnes: 1,
      mealPreference: 'Vegetarian' as const,
      tableNumber: 'Table 5',
    };

    StorageService.addGuest(newGuest);
    let guests = StorageService.getGuests(activeId);
    const found = guests.find((g) => g.id === 'test-guest-1');
    expect(found).toBeDefined();
    expect(found?.name).toBe('Sunita Rao');
    expect(found?.tableNumber).toBe('Table 5');

    // Delete
    StorageService.deleteGuest('test-guest-1');
    guests = StorageService.getGuests(activeId);
    expect(guests.find((g) => g.id === 'test-guest-1')).toBeUndefined();
  });

  it('resets cleanly back to demo mode without data loss', () => {
    StorageService.resetToDemo();
    const events = StorageService.getEvents();
    expect(events.length).toBeGreaterThan(0);
    expect(events[0].id).toBe('evt-wedding-01');
  });
});
