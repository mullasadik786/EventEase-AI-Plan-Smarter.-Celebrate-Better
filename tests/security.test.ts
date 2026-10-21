import { describe, it, expect } from 'vitest';
import { sanitizeCSVCell } from '../src/lib/formatters';

describe('Security: CSV Formula Injection & Sanitization', () => {
  it('neutralizes formulas starting with equal sign (=cmd|...)', () => {
    const malicious = '=1+2';
    const sanitized = sanitizeCSVCell(malicious);
    expect(sanitized.startsWith("'=")).toBe(true);
  });

  it('neutralizes formulas starting with plus (+...)', () => {
    const malicious = '+SUM(A1:A10)';
    const sanitized = sanitizeCSVCell(malicious);
    expect(sanitized.startsWith("'+")).toBe(true);
  });

  it('neutralizes formulas starting with minus (-...)', () => {
    const malicious = '-5';
    const sanitized = sanitizeCSVCell(malicious);
    expect(sanitized.startsWith("'-")).toBe(true);
  });

  it('neutralizes formulas starting with at sign (@SUM...)', () => {
    const malicious = '@dangerous';
    const sanitized = sanitizeCSVCell(malicious);
    expect(sanitized.startsWith("'@")).toBe(true);

    const maliciousWithComma = '@SUM(1,2)';
    const sanitizedWithComma = sanitizeCSVCell(maliciousWithComma);
    expect(sanitizedWithComma).toContain("'@SUM");
  });

  it('safely escapes commas and double quotes per RFC 4180 standard', () => {
    const textWithQuotes = 'Aditya "The Groom" Sharma';
    const sanitized = sanitizeCSVCell(textWithQuotes);
    expect(sanitized).toBe('"Aditya ""The Groom"" Sharma"');

    const textWithComma = 'Banjara Hills, Hyderabad';
    const sanitizedComma = sanitizeCSVCell(textWithComma);
    expect(sanitizedComma).toBe('"Banjara Hills, Hyderabad"');
  });

  it('handles null, undefined, and empty values without crashing', () => {
    expect(sanitizeCSVCell(null as any)).toBe('');
    expect(sanitizeCSVCell(undefined as any)).toBe('');
    expect(sanitizeCSVCell('')).toBe('');
  });
});
