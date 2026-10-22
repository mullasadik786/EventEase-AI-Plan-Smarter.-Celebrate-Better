import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Navbar } from '../../src/components/Navbar';
import { SEED_EVENTS } from '../../src/data/seedData';

const mockEvent = SEED_EVENTS[0];

describe('Navbar Component', () => {
  it('renders branding and primary navigation items', () => {
    const handleSetView = vi.fn();
    render(
      <Navbar
        currentView="dashboard"
        setCurrentView={handleSetView}
        events={[mockEvent]}
        activeEvent={mockEvent}
        onSelectEvent={vi.fn()}
        onOpenNewEventWizard={vi.fn()}
        onResetDemo={vi.fn()}
      />
    );

    expect(screen.getAllByText(/EventEase/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/Demo Mode Active/i)).toBeInTheDocument();
    expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Budget').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Timeline').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Vendors').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Guests').length).toBeGreaterThan(0);
  });

  it('triggers view switch when navigation button is clicked', () => {
    const handleSetView = vi.fn();
    render(
      <Navbar
        currentView="dashboard"
        setCurrentView={handleSetView}
        events={[mockEvent]}
        activeEvent={mockEvent}
        onSelectEvent={vi.fn()}
        onOpenNewEventWizard={vi.fn()}
        onResetDemo={vi.fn()}
      />
    );

    const budgetNavBtn = screen.getAllByRole('button', { name: /Budget/i })[0];
    fireEvent.click(budgetNavBtn);
    expect(handleSetView).toHaveBeenCalledWith('budget');
  });

  it('opens new event wizard when + New Event button is clicked', () => {
    const handleOpenWizard = vi.fn();
    render(
      <Navbar
        currentView="dashboard"
        setCurrentView={vi.fn()}
        events={[mockEvent]}
        activeEvent={mockEvent}
        onSelectEvent={vi.fn()}
        onOpenNewEventWizard={handleOpenWizard}
        onResetDemo={vi.fn()}
      />
    );

    const newEventBtn = screen.getAllByRole('button', { name: /Plan Event/i })[0];
    fireEvent.click(newEventBtn);
    expect(handleOpenWizard).toHaveBeenCalled();
  });

  it('opens confirmation modal and triggers onResetDemo when confirmed', () => {
    const handleReset = vi.fn();
    render(
      <Navbar
        currentView="dashboard"
        setCurrentView={vi.fn()}
        events={[mockEvent]}
        activeEvent={mockEvent}
        onSelectEvent={vi.fn()}
        onOpenNewEventWizard={vi.fn()}
        onResetDemo={handleReset}
      />
    );

    const resetBtn = screen.getByRole('button', { name: /Reset demo to initial data/i });
    fireEvent.click(resetBtn);

    // Modal should be open
    expect(screen.getByText(/Reset Demo to Initial State\?/i)).toBeInTheDocument();

    const confirmBtn = screen.getByRole('button', { name: /Reset Demo Data/i });
    fireEvent.click(confirmBtn);

    expect(handleReset).toHaveBeenCalled();
  });
});
