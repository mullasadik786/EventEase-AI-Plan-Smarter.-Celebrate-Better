import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TimelineView } from '../../src/components/TimelineView';
import { SEED_EVENTS, SEED_TASKS } from '../../src/data/seedData';

describe('TimelineView Component', () => {
  const mockEvent = SEED_EVENTS[0];
  const mockTasks = SEED_TASKS.filter((t) => t.eventId === mockEvent.id);

  it('renders timeline tasks and milestone progress', () => {
    render(
      <TimelineView
        activeEvent={mockEvent}
        tasks={mockTasks}
        onAddTask={vi.fn()}
        onUpdateTask={vi.fn()}
        onDeleteTask={vi.fn()}
      />
    );

    expect(screen.getByText(/Timeline & Tasks/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Task/i })).toBeInTheDocument();
  });

  it('renders search input and task items', () => {
    render(
      <TimelineView
        activeEvent={mockEvent}
        tasks={mockTasks}
        onAddTask={vi.fn()}
        onUpdateTask={vi.fn()}
        onDeleteTask={vi.fn()}
      />
    );

    expect(screen.getByPlaceholderText(/Search tasks.../i)).toBeInTheDocument();
  });
});
