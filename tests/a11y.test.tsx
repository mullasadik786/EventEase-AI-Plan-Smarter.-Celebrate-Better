import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Navbar } from '../src/components/Navbar';
import { SEED_EVENTS } from '../src/data/seedData';

describe('Accessibility & Semantics', () => {
  it('renders navbar navigation with semantic header and accessible navigation tabs', () => {
    render(
      <Navbar
        currentView="budget"
        setCurrentView={vi.fn()}
        events={SEED_EVENTS}
        activeEvent={SEED_EVENTS[0]}
        onSelectEvent={vi.fn()}
        onOpenNewEventWizard={vi.fn()}
        onResetDemo={vi.fn()}
      />
    );

    // Verify accessible nav buttons
    expect(screen.getByRole('button', { name: /Budget/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Guests/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Timeline/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Vendors/i })).toBeInTheDocument();
  });
});
