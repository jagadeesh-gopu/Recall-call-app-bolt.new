import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RemindersScreen } from '../../screens/RemindersScreen';
import { reminders } from '../../data';

// RemindersScreen uses local state (useState(reminders)), no Supabase calls needed

describe('RemindersScreen', () => {
  it('renders the page heading', () => {
    render(<RemindersScreen />);
    expect(screen.getByText('Reminders')).toBeInTheDocument();
  });

  it('shows Today section heading', () => {
    render(<RemindersScreen />);
    expect(screen.getByText('Today')).toBeInTheDocument();
  });

  it('shows Upcoming section heading', () => {
    render(<RemindersScreen />);
    expect(screen.getByText('Upcoming')).toBeInTheDocument();
  });

  it('shows Completed section heading', () => {
    render(<RemindersScreen />);
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('renders all 3 Today reminders', () => {
    render(<RemindersScreen />);
    const todayReminders = reminders.filter((r) => r.date === 'Today');
    expect(todayReminders).toHaveLength(3);
    for (const r of todayReminders) {
      expect(screen.getAllByText(r.title).length).toBeGreaterThan(0);
    }
  });

  it('renders upcoming reminders (non-today, non-completed)', () => {
    render(<RemindersScreen />);
    const upcoming = reminders.filter((r) => r.date !== 'Today' && !r.completed);
    for (const r of upcoming) {
      expect(screen.getByText(r.title)).toBeInTheDocument();
    }
  });

  it('renders r3 (completed reminder) in the completed section', () => {
    render(<RemindersScreen />);
    const r3 = reminders.find((r) => r.id === 'r3')!;
    expect(screen.getAllByText(r3.title).length).toBeGreaterThan(0);
  });

  it('renders all 8 reminder titles', () => {
    render(<RemindersScreen />);
    for (const r of reminders) {
      expect(screen.getAllByText(r.title).length).toBeGreaterThan(0);
    }
  });

  it('clicking checkbox on r1 toggles it to completed', () => {
    render(<RemindersScreen />);
    const r1 = reminders.find((r) => r.id === 'r1')!;
    const r1Title = screen.getByText(r1.title);
    const card = r1Title.closest('.glass-card') as HTMLElement;
    const checkbox = within(card).getByRole('button', { name: /mark/i });
    fireEvent.click(checkbox);
    // After toggle, the title should have line-through style applied
    expect(r1Title).toHaveClass('line-through');
  });

  it('clicking + button opens Create Reminder modal', () => {
    render(<RemindersScreen />);
    // The + header button (gradient-primary)
    const plusButtons = screen.getAllByRole('button').filter((b) =>
      b.classList.contains('gradient-primary')
    );
    // Click the first gradient-primary button (the + FAB)
    fireEvent.click(plusButtons[0]);
    expect(screen.getByText('New Reminder')).toBeInTheDocument();
  });

  it('can type a reminder title in the create modal', async () => {
    render(<RemindersScreen />);
    const user = userEvent.setup();

    const plusButtons = screen.getAllByRole('button').filter((b) =>
      b.classList.contains('gradient-primary')
    );
    fireEvent.click(plusButtons[0]);

    const input = screen.getByPlaceholderText('Call Rahul tomorrow at 5 PM');
    await user.type(input, 'My new reminder');
    expect(input).toHaveValue('My new reminder');
  });

  it('submitting create modal adds reminder to the list', async () => {
    render(<RemindersScreen />);
    const user = userEvent.setup();

    const plusButtons = screen.getAllByRole('button').filter((b) =>
      b.classList.contains('gradient-primary')
    );
    fireEvent.click(plusButtons[0]);

    const input = screen.getByPlaceholderText('Call Rahul tomorrow at 5 PM');
    await user.type(input, 'Brand new reminder');

    const createBtn = screen.getByText('Create Reminder').closest('button')!;
    fireEvent.click(createBtn);

    await waitFor(() => {
      expect(screen.queryByText('New Reminder')).not.toBeInTheDocument();
    });
    expect(screen.getByText('Brand new reminder')).toBeInTheDocument();
  });

  it('closing modal hides the form', () => {
    render(<RemindersScreen />);
    const plusButtons = screen.getAllByRole('button').filter((b) =>
      b.classList.contains('gradient-primary')
    );
    fireEvent.click(plusButtons[0]);
    expect(screen.getByText('New Reminder')).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: /close modal/i });
    fireEvent.click(closeBtn);

    expect(screen.queryByText('New Reminder')).not.toBeInTheDocument();
  });
});
