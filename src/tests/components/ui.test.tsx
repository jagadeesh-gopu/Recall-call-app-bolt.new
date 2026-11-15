import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Avatar,
  CallTypeIcon,
  CallTypeBadge,
  DurationDisplay,
  CategoryTag,
  EmptyState,
  SkeletonCard,
} from '../../components/ui';
import { Search } from 'lucide-react';

// ─── Avatar ──────────────────────────────────────────────────────────────────
describe('Avatar', () => {
  it('renders initials text', () => {
    render(<Avatar initials="RS" color="from-indigo-400 to-violet-400" />);
    expect(screen.getByText('RS')).toBeInTheDocument();
  });

  it('applies sm size class', () => {
    const { container } = render(
      <Avatar initials="AB" color="from-indigo-400 to-violet-400" size="sm" />
    );
    expect(container.firstChild).toHaveClass('w-9');
    expect(container.firstChild).toHaveClass('h-9');
  });

  it('applies md size class by default', () => {
    const { container } = render(
      <Avatar initials="AB" color="from-indigo-400 to-violet-400" />
    );
    expect(container.firstChild).toHaveClass('w-11');
    expect(container.firstChild).toHaveClass('h-11');
  });

  it('applies lg size class', () => {
    const { container } = render(
      <Avatar initials="AB" color="from-indigo-400 to-violet-400" size="lg" />
    );
    expect(container.firstChild).toHaveClass('w-14');
    expect(container.firstChild).toHaveClass('h-14');
  });
});

// ─── CallTypeIcon ─────────────────────────────────────────────────────────────
describe('CallTypeIcon', () => {
  it('renders without crashing for incoming', () => {
    const { container } = render(<CallTypeIcon type="incoming" />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders without crashing for outgoing', () => {
    const { container } = render(<CallTypeIcon type="outgoing" />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders without crashing for missed', () => {
    const { container } = render(<CallTypeIcon type="missed" />);
    expect(container.firstChild).toBeTruthy();
  });
});

// ─── CallTypeBadge ────────────────────────────────────────────────────────────
describe('CallTypeBadge', () => {
  it('renders "Incoming" text for incoming type', () => {
    render(<CallTypeBadge type="incoming" />);
    expect(screen.getByText('Incoming')).toBeInTheDocument();
  });

  it('renders "Outgoing" text for outgoing type', () => {
    render(<CallTypeBadge type="outgoing" />);
    expect(screen.getByText('Outgoing')).toBeInTheDocument();
  });

  it('renders "Missed" text for missed type', () => {
    render(<CallTypeBadge type="missed" />);
    expect(screen.getByText('Missed')).toBeInTheDocument();
  });

  it('applies green style for incoming', () => {
    const { container } = render(<CallTypeBadge type="incoming" />);
    expect(container.firstChild).toHaveClass('bg-emerald-100');
  });

  it('applies red style for missed', () => {
    const { container } = render(<CallTypeBadge type="missed" />);
    expect(container.firstChild).toHaveClass('bg-rose-100');
  });
});

// ─── DurationDisplay ──────────────────────────────────────────────────────────
describe('DurationDisplay', () => {
  it('renders the duration string', () => {
    render(<DurationDisplay duration="12:45" />);
    expect(screen.getByText('12:45')).toBeInTheDocument();
  });
});

// ─── CategoryTag ──────────────────────────────────────────────────────────────
describe('CategoryTag', () => {
  it('renders category name', () => {
    render(<CategoryTag category="College" />);
    expect(screen.getByText('College')).toBeInTheDocument();
  });
});

// ─── EmptyState ───────────────────────────────────────────────────────────────
describe('EmptyState', () => {
  it('renders title and subtitle', () => {
    render(
      <EmptyState icon={Search} title="No calls found" subtitle="Try a different filter." />
    );
    expect(screen.getByText('No calls found')).toBeInTheDocument();
    expect(screen.getByText('Try a different filter.')).toBeInTheDocument();
  });
});

// ─── SkeletonCard ─────────────────────────────────────────────────────────────
describe('SkeletonCard', () => {
  it('renders skeleton divs', () => {
    const { container } = render(<SkeletonCard />);
    const skeletons = container.querySelectorAll('.skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
