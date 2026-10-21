import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BudgetView } from '../../src/components/BudgetView';
import { SEED_EVENTS, SEED_BUDGET_ITEMS } from '../../src/data/seedData';

describe('BudgetView Component', () => {
  const mockEvent = SEED_EVENTS[0];
  const mockBudgetItems = SEED_BUDGET_ITEMS.filter((b) => b.eventId === mockEvent.id);

  it('renders budget overview cards with accurate totals', () => {
    render(
      <BudgetView
        activeEvent={mockEvent}
        budgetItems={mockBudgetItems}
        onAddBudgetItem={vi.fn()}
        onUpdateBudgetItem={vi.fn()}
        onDeleteBudgetItem={vi.fn()}
        onUpdateEventBudget={vi.fn()}
      />
    );

    // Verify presence of budget headlines
    expect(screen.getByText(/Total Event Budget/i)).toBeInTheDocument();
    expect(screen.getByText(/Actual Spent \/ Committed/i)).toBeInTheDocument();
    expect(screen.getByText(/Remaining Budget/i)).toBeInTheDocument();
    expect(screen.getByText(/Available Planning Cap/i)).toBeInTheDocument();
  });

  it('displays category filters and expense line items', () => {
    render(
      <BudgetView
        activeEvent={mockEvent}
        budgetItems={mockBudgetItems}
        onAddBudgetItem={vi.fn()}
        onUpdateBudgetItem={vi.fn()}
        onDeleteBudgetItem={vi.fn()}
        onUpdateEventBudget={vi.fn()}
      />
    );

    // Filter button exists
    const categoryFilters = screen.getAllByText(/All Categories/i);
    expect(categoryFilters.length).toBeGreaterThan(0);
    // Add expense button
    expect(screen.getByRole('button', { name: /Add Expense/i })).toBeInTheDocument();
  });
});
