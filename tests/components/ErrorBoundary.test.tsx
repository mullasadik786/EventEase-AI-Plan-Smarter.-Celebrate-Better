import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '../../src/components/ErrorBoundary';

const GoodChild: React.FC = () => <div>All Systems Operational</div>;
const ProblematicChild: React.FC = () => {
  throw new Error('Test Simulation Error');
};

describe('ErrorBoundary Component', () => {
  it('renders children smoothly when no error is thrown', () => {
    render(
      <ErrorBoundary>
        <GoodChild />
      </ErrorBoundary>
    );

    expect(screen.getByText('All Systems Operational')).toBeInTheDocument();
  });

  it('renders recovery screen when child throws an exception', () => {
    // Suppress console.error during expected throw
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ProblematicChild />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Something went slightly off track/i)).toBeInTheDocument();
    expect(screen.getByText(/Reload Page/i)).toBeInTheDocument();
    expect(screen.getByText(/Reset to Clean Demo/i)).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});
