import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AiPlannerWizard } from '../../src/components/AiPlannerWizard';

describe('AiPlannerWizard Component', () => {
  it('renders wizard step 1 with event details inputs', () => {
    render(
      <AiPlannerWizard
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        initialType="Wedding"
      />
    );

    expect(screen.getByText(/AI Event Creation Wizard/i)).toBeInTheDocument();
    expect(screen.getByText(/Quick Load Demo Template/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e\.g\. Priya & Aarav's Royal Wedding/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Continue/i })).toBeInTheDocument();
  });

  it('navigates through steps when clicking continue', () => {
    render(
      <AiPlannerWizard
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
        initialType="Birthday"
      />
    );

    // Fill in event name
    const nameInput = screen.getByPlaceholderText(/e\.g\. Priya & Aarav's Royal Wedding/i);
    fireEvent.change(nameInput, { target: { value: 'Aarav 5th Birthday' } });

    // Click Continue
    const nextBtn = screen.getByRole('button', { name: /Continue/i });
    fireEvent.click(nextBtn);

    // Should now be on Step 2 (Budget)
    expect(screen.getByText(/Budget & Finances/i)).toBeInTheDocument();
  });
});
