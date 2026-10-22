import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { App } from '../src/App';

describe('App Root Component', () => {
  it('renders landing page by default with key hero call-to-actions', () => {
    render(<App />);

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getAllByText(/EventEase/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /Explore Live Demo/i })).toBeInTheDocument();
  });

  it('navigates from landing to dashboard when Explore Live Demo is clicked', async () => {
    render(<App />);

    const exploreBtn = screen.getByRole('button', { name: /Explore Live Demo/i });
    fireEvent.click(exploreBtn);

    await waitFor(() => {
      // Dashboard should display upcoming deadlines and active budget summary
      expect(screen.getByText(/Total Planned Budget/i)).toBeInTheDocument();
      expect(screen.getByText(/Upcoming Deadlines/i)).toBeInTheDocument();
    });
  });

  it('allows navigation across views via navbar items', async () => {
    render(<App />);

    // Go to dashboard first
    const exploreBtn = screen.getByRole('button', { name: /Explore Live Demo/i });
    fireEvent.click(exploreBtn);

    // Click Budget nav item
    const budgetNav = screen.getAllByRole('button', { name: /Budget/i })[0];
    fireEvent.click(budgetNav);

    await waitFor(() => {
      expect(screen.getByText(/Smart Budget Planner/i)).toBeInTheDocument();
    });

    // Click Guests nav item
    const guestsNav = screen.getAllByRole('button', { name: /Guests/i })[0];
    fireEvent.click(guestsNav);

    await waitFor(() => {
      expect(screen.getByText(/Guest List & RSVPs/i)).toBeInTheDocument();
    });
  });
});
