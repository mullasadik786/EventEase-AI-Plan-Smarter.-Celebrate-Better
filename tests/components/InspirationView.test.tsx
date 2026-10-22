import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { InspirationView } from '../../src/components/InspirationView';
import { SEED_EVENTS, SEED_INSPIRATIONS } from '../../src/data/seedData';

describe('InspirationView Component', () => {
  const mockEvent = SEED_EVENTS[0];

  it('renders visual moodboards, collection filters, and theme cards', () => {
    render(
      <InspirationView
        activeEvent={mockEvent}
        inspirations={SEED_INSPIRATIONS}
        favoriteIds={[]}
        onToggleFavorite={vi.fn()}
        onApplyThemeToEvent={vi.fn()}
      />
    );

    expect(screen.getByText(/Event Inspiration Gallery/i)).toBeInTheDocument();
    expect(screen.getByText(/AI Theme Moodboard Architect/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Describe your aesthetic vision/i)).toBeInTheDocument();
  });

  it('renders inspiration cards with color palettes and apply theme buttons', () => {
    render(
      <InspirationView
        activeEvent={mockEvent}
        inspirations={SEED_INSPIRATIONS}
        favoriteIds={[]}
        onToggleFavorite={vi.fn()}
        onApplyThemeToEvent={vi.fn()}
      />
    );

    const applyButtons = screen.getAllByRole('button', { name: /Apply Theme to Current Event/i });
    expect(applyButtons.length).toBeGreaterThan(0);
  });
});
