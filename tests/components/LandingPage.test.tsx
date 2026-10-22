import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LandingPage } from '../../src/components/LandingPage';

describe('LandingPage Component', () => {
  it('renders hero section, headlines, and call-to-action buttons', () => {
    const onStartPlanning = vi.fn();
    const onExploreDemo = vi.fn();
    const onSelectSampleEvent = vi.fn();

    render(
      <LandingPage
        onStartPlanning={onStartPlanning}
        onExploreDemo={onExploreDemo}
        onSelectSampleEvent={onSelectSampleEvent}
      />
    );

    expect(screen.getByText(/Your Perfect Event/i)).toBeInTheDocument();
    expect(screen.getByText(/Starts Right Here\./i)).toBeInTheDocument();

    const planButtons = screen.getAllByRole('button', { name: /Plan My Event/i });
    expect(planButtons.length).toBeGreaterThan(0);
    fireEvent.click(planButtons[0]);
    expect(onStartPlanning).toHaveBeenCalled();
  });

  it('triggers sample event selection when sample card is clicked', () => {
    const onSelectSampleEvent = vi.fn();

    render(
      <LandingPage
        onStartPlanning={vi.fn()}
        onExploreDemo={vi.fn()}
        onSelectSampleEvent={onSelectSampleEvent}
      />
    );

    const openPlanButtons = screen.getAllByRole('button', { name: /Open Plan →/i });
    expect(openPlanButtons.length).toBeGreaterThan(0);
    fireEvent.click(openPlanButtons[0]);
    expect(onSelectSampleEvent).toHaveBeenCalledWith('evt-wedding-01');
  });
});
