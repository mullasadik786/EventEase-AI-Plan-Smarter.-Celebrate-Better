import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ExportModal } from '../../src/components/ExportModal';
import { SEED_EVENTS, SEED_BUDGET_ITEMS, SEED_TASKS, SEED_GUESTS, SEED_VENDORS } from '../../src/data/seedData';

describe('ExportModal Component', () => {
  const mockEvent = SEED_EVENTS[0];
  const mockBudget = SEED_BUDGET_ITEMS.filter((b) => b.eventId === mockEvent.id);
  const mockTasks = SEED_TASKS.filter((t) => t.eventId === mockEvent.id);
  const mockGuests = SEED_GUESTS.filter((g) => g.eventId === mockEvent.id);
  const mockVendors = SEED_VENDORS.filter((v) => v.eventId === mockEvent.id);

  it('renders export modal with download and copy options', () => {
    render(
      <ExportModal
        isOpen={true}
        onClose={vi.fn()}
        activeEvent={mockEvent}
        budgetItems={mockBudget}
        tasks={mockTasks}
        guests={mockGuests}
        vendors={mockVendors}
      />
    );

    expect(screen.getByText(/Export Event Brief & Data/i)).toBeInTheDocument();
    expect(screen.getByText(/Event Summary Brief/i)).toBeInTheDocument();
    expect(screen.getByText(/Budget & Expense Sheet/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Print/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Close/i })).toBeInTheDocument();
  });
});
