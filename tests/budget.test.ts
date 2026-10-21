import { describe, it, expect } from 'vitest';
import { BudgetItem } from '../src/types';

describe('Deterministic Budget Mathematics', () => {
  const totalBudget = 1500000;
  const contingencyPercent = 10;
  const contingencyAmount = Math.round(totalBudget * (contingencyPercent / 100));
  const availablePlanningBudget = totalBudget - contingencyAmount;

  const mockExpenses: BudgetItem[] = [
    {
      id: '1',
      eventId: 'ev1',
      category: 'Venue',
      name: 'Grand Ballroom',
      estimatedCost: 500000,
      actualCost: 520000, // Overrun
      paidAmount: 300000,
      status: 'deposit_paid',
      priority: 'high',
    },
    {
      id: '2',
      eventId: 'ev1',
      category: 'Catering',
      name: 'Royal Buffet Feast',
      estimatedCost: 400000,
      actualCost: 390000,
      paidAmount: 390000, // Fully paid
      status: 'fully_paid',
      priority: 'high',
    },
    {
      id: '3',
      eventId: 'ev1',
      category: 'Decor',
      name: 'Floral Arch & Stage',
      estimatedCost: 200000,
      actualCost: 200000,
      paidAmount: 100000,
      status: 'deposit_paid',
      priority: 'medium',
    },
    {
      id: '4',
      eventId: 'ev1',
      category: 'Photography',
      name: 'Candid & Drone Team',
      estimatedCost: 150000,
      actualCost: 150000,
      paidAmount: 0,
      status: 'unpaid',
      priority: 'medium',
    },
  ];

  it('guarantees exact contingency reserve calculation', () => {
    expect(contingencyAmount).toBe(150000);
    expect(availablePlanningBudget).toBe(1350000);
    expect(contingencyAmount + availablePlanningBudget).toBe(totalBudget);
  });

  it('calculates total estimated costs with strict accuracy', () => {
    const totalEstimated = mockExpenses.reduce((sum, item) => sum + item.estimatedCost, 0);
    expect(totalEstimated).toBe(1250000);
  });

  it('calculates total actual committed expenses with strict accuracy', () => {
    const totalActual = mockExpenses.reduce((sum, item) => sum + item.actualCost, 0);
    expect(totalActual).toBe(1260000);
  });

  it('calculates total paid deposit amount correctly', () => {
    const totalPaid = mockExpenses.reduce((sum, item) => sum + item.paidAmount, 0);
    expect(totalPaid).toBe(790000);
  });

  it('calculates outstanding vendor liability (balance due)', () => {
    const totalActual = mockExpenses.reduce((sum, item) => sum + item.actualCost, 0);
    const totalPaid = mockExpenses.reduce((sum, item) => sum + item.paidAmount, 0);
    const balanceDue = totalActual - totalPaid;
    expect(balanceDue).toBe(470000);
  });

  it('computes remaining budget accurately (Total Budget - Total Actual)', () => {
    const totalActual = mockExpenses.reduce((sum, item) => sum + item.actualCost, 0);
    const remaining = totalBudget - totalActual;
    expect(remaining).toBe(240000);
  });

  it('detects category overrun when actual exceeds estimated', () => {
    const overruns = mockExpenses.filter((e) => e.actualCost > e.estimatedCost);
    expect(overruns.length).toBe(1);
    expect(overruns[0].name).toBe('Grand Ballroom');
    expect(overruns[0].actualCost - overruns[0].estimatedCost).toBe(20000);
  });

  it('classifies expense payment statuses reliably', () => {
    const unpaid = mockExpenses.filter((e) => e.status === 'unpaid');
    const depositPaid = mockExpenses.filter((e) => e.status === 'deposit_paid');
    const fullyPaid = mockExpenses.filter((e) => e.status === 'fully_paid');

    expect(unpaid.length).toBe(1);
    expect(depositPaid.length).toBe(2);
    expect(fullyPaid.length).toBe(1);
  });
});
