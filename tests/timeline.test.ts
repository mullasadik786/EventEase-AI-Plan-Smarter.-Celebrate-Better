import { describe, it, expect } from 'vitest';
import { TimelineTask } from '../src/types';

describe('Timeline and Milestone Progress Calculations', () => {
  const mockTasks: TimelineTask[] = [
    {
      id: 't1',
      eventId: 'ev1',
      title: 'Book Royal Palace Venue',
      dueDate: '2026-08-01',
      category: 'Venue',
      priority: 'high',
      status: 'completed',
      owner: 'Aditya & Priya',
    },
    {
      id: 't2',
      eventId: 'ev1',
      title: 'Confirm Catering Menu & Tasting',
      dueDate: '2026-09-15',
      category: 'Catering',
      priority: 'high',
      status: 'completed',
      owner: 'Priya',
    },
    {
      id: 't3',
      eventId: 'ev1',
      title: 'Finalize Stage & Mandap Florals',
      dueDate: '2026-10-20',
      category: 'Decor',
      priority: 'medium',
      status: 'in_progress',
      owner: 'Wedding Planner',
    },
    {
      id: 't4',
      eventId: 'ev1',
      title: 'Dispatch Digital RSVP Invites',
      dueDate: '2026-11-01',
      category: 'Invitations',
      priority: 'high',
      status: 'todo',
      owner: 'Aditya',
    },
    {
      id: 't5',
      eventId: 'ev1',
      title: 'Final Day-Of Run of Show Rehearsal',
      dueDate: '2026-12-15',
      category: 'Coordination',
      priority: 'high',
      status: 'todo',
      owner: 'Lead Coordinator',
    },
  ];

  it('calculates task completion percentage accurately', () => {
    const completed = mockTasks.filter((t) => t.status === 'completed').length;
    const progress = Math.round((completed / mockTasks.length) * 100);

    expect(completed).toBe(2);
    expect(progress).toBe(40);
  });

  it('filters high-priority pending items for urgent action', () => {
    const urgentPending = mockTasks.filter(
      (t) => t.priority === 'high' && t.status !== 'completed'
    );
    expect(urgentPending.length).toBe(2);
    expect(urgentPending.map((t) => t.title)).toContain('Dispatch Digital RSVP Invites');
    expect(urgentPending.map((t) => t.title)).toContain('Final Day-Of Run of Show Rehearsal');
  });

  it('groups tasks by category correctly', () => {
    const byCategory = mockTasks.reduce<Record<string, number>>((acc, task) => {
      acc[task.category] = (acc[task.category] || 0) + 1;
      return acc;
    }, {});

    expect(byCategory['Venue']).toBe(1);
    expect(byCategory['Catering']).toBe(1);
    expect(byCategory['Decor']).toBe(1);
  });
});
