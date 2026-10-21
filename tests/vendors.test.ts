import { describe, it, expect } from 'vitest';
import { Vendor } from '../src/types';

describe('Vendor Management and Financial Settlements', () => {
  const mockVendors: Vendor[] = [
    {
      id: 'v1',
      eventId: 'ev1',
      name: 'Taj Falaknuma Palace',
      category: 'Venue & Accommodation',
      location: 'Hyderabad',
      priceRange: '₹₹₹₹',
      serviceDescription: 'Heritage palace venue and royal dining',
      quotedAmount: 600000,
      depositPaid: 300000,
      status: 'booked',
      rating: 4.9,
      contactPerson: 'Sanjay Verma',
      contactPhone: '+91 98111 00001',
      contactEmail: 'events@tajfalaknuma.example.com',
      notes: 'Final banquet tasting on Nov 15',
      isSample: true,
    },
    {
      id: 'v2',
      eventId: 'ev1',
      name: 'Stories by Joseph Radhik',
      category: 'Photography & Videography',
      location: 'Mumbai / Hyderabad',
      priceRange: '₹₹₹',
      serviceDescription: 'Candid photography and cinematic documentary film',
      quotedAmount: 250000,
      depositPaid: 250000, // Fully settled
      status: 'booked',
      rating: 4.9,
      contactPerson: 'Joseph',
      contactPhone: '+91 98111 00002',
      contactEmail: 'contact@stories.example.com',
      notes: 'Drone license confirmed',
      isSample: true,
    },
    {
      id: 'v3',
      eventId: 'ev1',
      name: 'Artisan Floral Alchemy',
      category: 'Decoration & Lighting',
      location: 'Banjara Hills',
      priceRange: '₹₹₹',
      serviceDescription: 'Botanical decor, floral mandap, entrance installation',
      quotedAmount: 220000,
      depositPaid: 0,
      status: 'shortlisted',
      rating: 4.7,
      contactPerson: 'Kavita Das',
      contactPhone: '+91 98111 00003',
      contactEmail: 'kavita@floralalchemy.example.com',
      notes: 'Sent quote revision',
      isSample: true,
    },
  ];

  it('calculates total commitments and balances due for booked vendors', () => {
    const booked = mockVendors.filter((v) => v.status === 'booked');
    const totalCommitted = booked.reduce((sum, v) => sum + v.quotedAmount, 0);
    const totalPaid = booked.reduce((sum, v) => sum + v.depositPaid, 0);
    const balanceDue = totalCommitted - totalPaid;

    expect(booked.length).toBe(2);
    expect(totalCommitted).toBe(850000);
    expect(totalPaid).toBe(550000);
    expect(balanceDue).toBe(300000);
  });

  it('filters vendors by category correctly', () => {
    const venues = mockVendors.filter((v) => v.category.includes('Venue'));
    expect(venues.length).toBe(1);
    expect(venues[0].name).toBe('Taj Falaknuma Palace');
  });

  it('verifies shortlisted vendors for comparison matrix', () => {
    const shortlisted = mockVendors.filter((v) => v.status === 'shortlisted');
    expect(shortlisted.length).toBe(1);
    expect(shortlisted[0].quotedAmount).toBe(220000);
  });
});
