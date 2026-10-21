import { describe, it, expect } from 'vitest';
import { Guest } from '../src/types';

describe('Guest List and Catering RSVP Calculations', () => {
  const mockGuests: Guest[] = [
    {
      id: 'g1',
      eventId: 'ev1',
      name: 'Aditya & Priya Sharma',
      email: 'aditya@example.com',
      phone: '+91 98765 43210',
      group: 'Family',
      rsvpStatus: 'confirmed',
      plusOnes: 2, // 3 total headcount
      mealPreference: 'Vegetarian',
      tableNumber: 'Table 1',
    },
    {
      id: 'g2',
      eventId: 'ev1',
      name: 'Rohan Mehta',
      email: 'rohan@example.com',
      phone: '+91 98765 11111',
      group: 'Friends',
      rsvpStatus: 'confirmed',
      plusOnes: 1, // 2 total headcount
      mealPreference: 'Jain',
      tableNumber: 'Table 2',
    },
    {
      id: 'g3',
      eventId: 'ev1',
      name: 'Vikram Singh',
      email: 'vikram@example.com',
      phone: '+91 98765 22222',
      group: 'Colleagues',
      rsvpStatus: 'confirmed',
      plusOnes: 0, // 1 total headcount
      mealPreference: 'Non-Vegetarian',
      tableNumber: 'Table 3',
    },
    {
      id: 'g4',
      eventId: 'ev1',
      name: 'Ananya Reddy',
      email: 'ananya@example.com',
      phone: '+91 98765 33333',
      group: 'Friends',
      rsvpStatus: 'pending',
      plusOnes: 1,
      mealPreference: 'Vegan',
    },
    {
      id: 'g5',
      eventId: 'ev1',
      name: 'Sameer Joshi',
      email: 'sameer@example.com',
      phone: '+91 98765 44444',
      group: 'VIP',
      rsvpStatus: 'declined',
      plusOnes: 0,
      mealPreference: 'Standard',
    },
  ];

  it('calculates total confirmed headcount including plus-ones', () => {
    const confirmedCount = mockGuests
      .filter((g) => g.rsvpStatus === 'confirmed')
      .reduce((sum, g) => sum + 1 + g.plusOnes, 0);

    // g1: 1+2=3, g2: 1+1=2, g3: 1+0=1 => Total = 6
    expect(confirmedCount).toBe(6);
  });

  it('aggregates total guest invitations and statuses correctly', () => {
    const totalInvited = mockGuests.reduce((sum, g) => sum + 1 + g.plusOnes, 0);
    const pendingGuests = mockGuests.filter((g) => g.rsvpStatus === 'pending');
    const declinedGuests = mockGuests.filter((g) => g.rsvpStatus === 'declined');

    expect(totalInvited).toBe(9); // 3 + 2 + 1 + 2 + 1
    expect(pendingGuests.length).toBe(1);
    expect(declinedGuests.length).toBe(1);
  });

  it('calculates catering meal breakdown accurately for confirmed attendees', () => {
    const mealTallies: Record<string, number> = {};

    mockGuests
      .filter((g) => g.rsvpStatus === 'confirmed')
      .forEach((g) => {
        mealTallies[g.mealPreference] =
          (mealTallies[g.mealPreference] || 0) + (1 + g.plusOnes);
      });

    expect(mealTallies['Vegetarian']).toBe(3);
    expect(mealTallies['Jain']).toBe(2);
    expect(mealTallies['Non-Vegetarian']).toBe(1);
    expect(mealTallies['Vegan']).toBeUndefined(); // Pending guest's meal not counted yet
  });

  it('identifies guests needing seating table assignment', () => {
    const unassignedConfirmed = mockGuests.filter(
      (g) => g.rsvpStatus === 'confirmed' && !g.tableNumber
    );
    expect(unassignedConfirmed.length).toBe(0);

    const pendingUnassigned = mockGuests.filter(
      (g) => g.rsvpStatus === 'pending' && !g.tableNumber
    );
    expect(pendingUnassigned.length).toBe(1);
  });
});
