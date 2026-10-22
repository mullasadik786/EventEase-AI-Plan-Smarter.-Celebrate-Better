import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AiPlannerDetailView } from '../../src/components/AiPlannerDetailView';
import { SEED_EVENTS } from '../../src/data/seedData';

describe('AiPlannerDetailView Component', () => {
  const mockEvent = SEED_EVENTS[0];

  it('renders AI Blueprint header, tabs, and export buttons', () => {
    render(
      <AiPlannerDetailView
        activeEvent={mockEvent}
        onApplyPlanToEvent={vi.fn()}
        onRegenerate={vi.fn()}
        onOpenExport={vi.fn()}
      />
    );

    expect(screen.getByText(/AI Generated Blueprint/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Export Plan/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Regenerate/i })).toBeInTheDocument();
  });

  it('renders interactive AI chat strategist panel', () => {
    render(
      <AiPlannerDetailView
        activeEvent={mockEvent}
        onApplyPlanToEvent={vi.fn()}
        onRegenerate={vi.fn()}
        onOpenExport={vi.fn()}
      />
    );

    expect(screen.getByPlaceholderText(/Ask anything/i)).toBeInTheDocument();
  });
});
