import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GuestsView } from '../../src/components/GuestsView';
import { SEED_EVENTS, SEED_GUESTS } from '../../src/data/seedData';

describe('GuestsView Component', () => {
  const mockEvent = SEED_EVENTS[0];
  const mockGuests = SEED_GUESTS.filter((g) => g.eventId === mockEvent.id);

  it('renders guest counters and RSVP metrics', () => {
    render(
      <GuestsView
        activeEvent={mockEvent}
        guests={mockGuests}
        onAddGuest={vi.fn()}
        onUpdateGuest={vi.fn()}
        onDeleteGuest={vi.fn()}
        onBulkAddGuests={vi.fn()}
      />
    );

    // Verify stats cards exist
    expect(screen.getByText(/Confirmed Attendees/i)).toBeInTheDocument();
    expect(screen.getByText(/Pending Responses/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Guest/i })).toBeInTheDocument();
  });

  it('renders dietary preferences breakdown section and search field', () => {
    render(
      <GuestsView
        activeEvent={mockEvent}
        guests={mockGuests}
        onAddGuest={vi.fn()}
        onUpdateGuest={vi.fn()}
        onDeleteGuest={vi.fn()}
        onBulkAddGuests={vi.fn()}
      />
    );

    const cateringHeaders = screen.getAllByText(/Confirmed Catering Count Breakdown/i);
    expect(cateringHeaders.length).toBeGreaterThan(0);
    expect(screen.getByPlaceholderText(/Search guest by name/i)).toBeInTheDocument();
  });
});
