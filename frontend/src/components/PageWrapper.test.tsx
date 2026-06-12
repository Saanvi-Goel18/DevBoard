import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PageWrapper from './PageWrapper';

describe('PageWrapper Component', () => {
  it('renders children correctly', () => {
    render(
      <PageWrapper>
        <div data-testid="child">Test Child</div>
      </PageWrapper>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <PageWrapper className="custom-test-class">
        Content
      </PageWrapper>
    );
    expect(container.firstChild).toHaveClass('custom-test-class');
  });
});
