import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EventDayView } from '../../src/components/EventDayView';
import { SEED_EVENTS, SEED_DAY_OF_SCHEDULE, SEED_VENDORS, SEED_BUDGET_ITEMS } from '../../src/data/seedData';

describe('EventDayView Component', () => {
  const mockEvent = SEED_EVENTS[0];
  const mockSchedule = SEED_DAY_OF_SCHEDULE.filter((s) => s.eventId === mockEvent.id);
  const mockVendors = SEED_VENDORS.filter((v) => v.eventId === mockEvent.id);
  const mockBudget = SEED_BUDGET_ITEMS.filter((b) => b.eventId === mockEvent.id);

  it('renders Day-Of Command Center headline and run sheet', () => {
    render(
      <EventDayView
        activeEvent={mockEvent}
        scheduleItems={mockSchedule}
        vendors={mockVendors}
        budgetItems={mockBudget}
        onToggleScheduleItem={vi.fn()}
        onAddScheduleItem={vi.fn()}
        onDeleteScheduleItem={vi.fn()}
      />
    );

    expect(screen.getByText(/Event-Day Command Center/i)).toBeInTheDocument();
    expect(screen.getByText(/Official Day-Of Master Run Sheet/i)).toBeInTheDocument();
  });

  it('renders schedule buttons and agenda actions', () => {
    render(
      <EventDayView
        activeEvent={mockEvent}
        scheduleItems={mockSchedule}
        vendors={mockVendors}
        budgetItems={mockBudget}
        onToggleScheduleItem={vi.fn()}
        onAddScheduleItem={vi.fn()}
        onDeleteScheduleItem={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /Add Agenda Slot/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Print Clean Run Sheet/i })).toBeInTheDocument();
  });
});
