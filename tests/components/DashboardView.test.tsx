import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DashboardView } from '../../src/components/DashboardView';
import { SEED_EVENTS, SEED_BUDGET_ITEMS, SEED_TASKS, SEED_GUESTS } from '../../src/data/seedData';

describe('DashboardView Component', () => {
  const mockEvent = SEED_EVENTS[0];
  const mockBudget = SEED_BUDGET_ITEMS.filter((b) => b.eventId === mockEvent.id);
  const mockTasks = SEED_TASKS.filter((t) => t.eventId === mockEvent.id);
  const mockGuests = SEED_GUESTS.filter((g) => g.eventId === mockEvent.id);

  it('renders event countdown banner and KPI overview metrics', () => {
    render(
      <DashboardView
        events={SEED_EVENTS}
        activeEvent={mockEvent}
        budgetItems={mockBudget}
        tasks={mockTasks}
        guests={mockGuests}
        onSelectEvent={vi.fn()}
        onNavigate={vi.fn()}
        onOpenNewEventWizard={vi.fn()}
      />
    );

    expect(screen.getAllByText(mockEvent.title)[0]).toBeInTheDocument();
    expect(screen.getByText(/Total Planned Budget/i)).toBeInTheDocument();
    expect(screen.getByText(/Task Progress/i)).toBeInTheDocument();
    expect(screen.getByText(/Guest RSVPs/i)).toBeInTheDocument();
  });

  it('renders quick action buttons and upcoming milestones', () => {
    render(
      <DashboardView
        events={SEED_EVENTS}
        activeEvent={mockEvent}
        budgetItems={mockBudget}
        tasks={mockTasks}
        guests={mockGuests}
        onSelectEvent={vi.fn()}
        onNavigate={vi.fn()}
        onOpenNewEventWizard={vi.fn()}
      />
    );

    expect(screen.getByText(/Upcoming Deadlines/i)).toBeInTheDocument();
    expect(screen.getByText(/Your Events Portfolio/i)).toBeInTheDocument();
  });

  it('renders visual task completion progress bar with percentage calculation', () => {
    render(
      <DashboardView
        events={SEED_EVENTS}
        activeEvent={mockEvent}
        budgetItems={mockBudget}
        tasks={mockTasks}
        guests={mockGuests}
        onSelectEvent={vi.fn()}
        onNavigate={vi.fn()}
        onOpenNewEventWizard={vi.fn()}
      />
    );

    expect(screen.getByText(/Task Completion Rate/i)).toBeInTheDocument();
    const progressbar = screen.getByRole('progressbar', { name: /Event tasks completion progress/i });
    expect(progressbar).toBeInTheDocument();
    expect(progressbar).toHaveAttribute('aria-valuenow');
  });
});
