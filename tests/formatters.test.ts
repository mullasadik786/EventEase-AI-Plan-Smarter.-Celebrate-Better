import { describe, it, expect, vi } from 'vitest';
import { formatCurrency, formatDate, getDaysRemaining, exportToCSV, sanitizeCSVCell } from '../src/lib/formatters';

describe('formatCurrency', () => {
  it('formats INR correctly with rupee symbol and Indian numbering', () => {
    const res = formatCurrency(1500000, 'INR');
    expect(res).toContain('₹');
    expect(res).toMatch(/15,00,000|1,500,000/);
  });

  it('formats USD correctly with dollar sign', () => {
    const res = formatCurrency(25000, 'USD');
    expect(res).toContain('$');
    expect(res).toContain('25,000');
  });

  it('formats EUR correctly with euro symbol', () => {
    const res = formatCurrency(12000, 'EUR');
    expect(res).toContain('€');
    expect(res).toContain('12,000');
  });

  it('formats GBP correctly with pound symbol', () => {
    const res = formatCurrency(8500, 'GBP');
    expect(res).toContain('£');
    expect(res).toContain('8,500');
  });

  it('handles zero amount smoothly', () => {
    const res = formatCurrency(0, 'INR');
    expect(res).toContain('₹0');
  });

  it('handles negative balances gracefully', () => {
    const res = formatCurrency(-5000, 'USD');
    expect(res).toContain('-$5,000');
  });
});

describe('formatDate', () => {
  it('formats ISO date string into readable format', () => {
    const res = formatDate('2026-12-18');
    expect(res).toContain('Dec');
    expect(res).toContain('18');
    expect(res).toContain('2026');
  });

  it('returns empty string when date is empty or invalid', () => {
    expect(formatDate('')).toBe('');
    expect(formatDate('invalid-date')).toBe('invalid-date');
  });
});

describe('getDaysRemaining', () => {
  it('calculates days remaining for future dates', () => {
    const future = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const diff = getDaysRemaining(future);
    expect(diff).toBeGreaterThanOrEqual(4);
    expect(diff).toBeLessThanOrEqual(6);
  });

  it('returns 0 or negative for today or past dates', () => {
    const past = '2020-01-01';
    const diff = getDaysRemaining(past);
    expect(diff).toBeLessThan(0);
  });
});

describe('exportToCSV and sanitizeCSVCell', () => {
  it('triggers CSV download with sanitized headers and rows', () => {
    const createObjectURLMock = vi.fn().mockReturnValue('blob:mock-url');
    const revokeObjectURLMock = vi.fn();
    window.URL.createObjectURL = createObjectURLMock;
    window.URL.revokeObjectURL = revokeObjectURLMock;

    const appendChildSpy = vi.spyOn(document.body, 'appendChild');
    const removeChildSpy = vi.spyOn(document.body, 'removeChild');

    import('../src/lib/formatters').then(({ exportToCSV }) => {
      exportToCSV('test.csv', [
        ['Name', 'Amount', 'Formula'],
        ['Priya', 5000, '=cmd| /C calc']
      ]);

      expect(createObjectURLMock).toHaveBeenCalled();
      expect(appendChildSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();
      expect(revokeObjectURLMock).toHaveBeenCalled();
    });
  });
});
