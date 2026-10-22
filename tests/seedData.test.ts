import { describe, it, expect } from 'vitest';
import {
  SEED_EVENTS,
  SEED_BUDGET_ITEMS,
  SEED_TASKS,
  SEED_VENDORS,
  SEED_GUESTS,
  SEED_DAY_OF_SCHEDULE,
  SEED_INSPIRATIONS,
} from '../src/data/seedData';

describe('Seed Data Integrity', () => {
  it('contains valid and complete seed events', () => {
    expect(SEED_EVENTS.length).toBeGreaterThanOrEqual(3);
    for (const evt of SEED_EVENTS) {
      expect(evt.id).toBeDefined();
      expect(evt.title).toBeTruthy();
      expect(evt.eventType).toBeTruthy();
      expect(evt.totalBudget).toBeGreaterThan(0);
      expect(evt.contingencyPercent).toBeGreaterThanOrEqual(5);
      expect(evt.emergencyContacts.length).toBeGreaterThan(0);
    }
  });

  it('contains valid seed budget items with non-negative costs', () => {
    expect(SEED_BUDGET_ITEMS.length).toBeGreaterThan(0);
    for (const item of SEED_BUDGET_ITEMS) {
      expect(item.id).toBeTruthy();
      expect(item.eventId).toBeTruthy();
      expect(item.estimatedCost).toBeGreaterThanOrEqual(0);
      expect(item.actualCost).toBeGreaterThanOrEqual(0);
      expect(item.paidAmount).toBeGreaterThanOrEqual(0);
    }
  });

  it('contains valid seed tasks with priorities and due dates', () => {
    expect(SEED_TASKS.length).toBeGreaterThan(0);
    for (const task of SEED_TASKS) {
      expect(task.id).toBeTruthy();
      expect(task.title).toBeTruthy();
      expect(['high', 'medium', 'low']).toContain(task.priority);
      expect(['todo', 'in_progress', 'completed']).toContain(task.status);
    }
  });

  it('contains valid seed guests with RSVP statuses and meal preferences', () => {
    expect(SEED_GUESTS.length).toBeGreaterThan(0);
    for (const guest of SEED_GUESTS) {
      expect(guest.id).toBeTruthy();
      expect(guest.name).toBeTruthy();
      expect(['invited', 'confirmed', 'declined', 'pending']).toContain(guest.rsvpStatus);
      expect(guest.mealPreference).toBeTruthy();
    }
  });

  it('contains rich inspirations with color palettes and budget tiers', () => {
    expect(SEED_INSPIRATIONS.length).toBeGreaterThan(0);
    for (const item of SEED_INSPIRATIONS) {
      expect(item.id).toBeTruthy();
      expect(item.title).toBeTruthy();
      expect(item.colorPalette.length).toBeGreaterThanOrEqual(2);
      expect(item.image).toBeTruthy();
    }
  });
});
