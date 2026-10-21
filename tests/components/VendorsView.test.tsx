import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VendorsView } from '../../src/components/VendorsView';
import { SEED_EVENTS, SEED_VENDORS } from '../../src/data/seedData';

describe('VendorsView Component', () => {
  const mockEvent = SEED_EVENTS[0];
  const mockVendors = SEED_VENDORS.filter((v) => v.eventId === mockEvent.id);

  it('renders vendor management and category tabs', () => {
    render(
      <VendorsView
        activeEvent={mockEvent}
        vendors={mockVendors}
        onAddVendor={vi.fn()}
        onUpdateVendor={vi.fn()}
        onDeleteVendor={vi.fn()}
      />
    );

    expect(screen.getByText(/Vendor Directory & Quotes/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Custom Vendor/i })).toBeInTheDocument();
  });

  it('renders search input for vendor discovery', () => {
    render(
      <VendorsView
        activeEvent={mockEvent}
        vendors={mockVendors}
        onAddVendor={vi.fn()}
        onUpdateVendor={vi.fn()}
        onDeleteVendor={vi.fn()}
      />
    );

    expect(screen.getByPlaceholderText(/Search vendor or city.../i)).toBeInTheDocument();
  });
});
