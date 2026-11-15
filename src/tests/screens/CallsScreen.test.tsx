import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CallsScreen } from '../../screens/CallsScreen';
import { calls } from '../../data';

describe('CallsScreen', () => {
  it('renders the page heading', () => {
    render(<CallsScreen />);
    expect(screen.getByText('Call History')).toBeInTheDocument();
  });

  it('shows all calls by default (filter = All)', () => {
    render(<CallsScreen />);
    for (const call of calls) {
      const els = screen.getAllByText(call.contactName);
      expect(els.length).toBeGreaterThan(0);
    }
  });

  it('shows call count badge', () => {
    render(<CallsScreen />);
    expect(screen.getByText(`${calls.length} call records`)).toBeInTheDocument();
  });

  it('filter "Incoming" shows only incoming calls', () => {
    render(<CallsScreen />);
    const incomingBtn = screen.getAllByRole('button').find((b) =>
      b.textContent?.includes('Incoming')
    );
    expect(incomingBtn).toBeDefined();
    fireEvent.click(incomingBtn!);

    const incomingCount = calls.filter((c) => c.type === 'incoming').length;
    expect(screen.getByText(`${incomingCount} call records`)).toBeInTheDocument();
  });

  it('filter "Missed" shows only missed calls', () => {
    render(<CallsScreen />);
    const missedBtn = screen.getAllByRole('button').find((b) =>
      b.textContent?.includes('Missed')
    );
    expect(missedBtn).toBeDefined();
    fireEvent.click(missedBtn!);

    const missedCount = calls.filter((c) => c.type === 'missed').length;
    expect(screen.getByText(`${missedCount} call records`)).toBeInTheDocument();
  });

  it('search by name filters results', () => {
    render(<CallsScreen />);
    const input = screen.getByPlaceholderText(/Search by name/i);
    fireEvent.change(input, { target: { value: 'Rahul' } });

    const rahulCalls = calls.filter((c) =>
      c.contactName.toLowerCase().includes('rahul')
    );
    expect(screen.getByText(`${rahulCalls.length} call records`)).toBeInTheDocument();
  });

  it('shows empty state when search matches nothing', () => {
    render(<CallsScreen />);
    const input = screen.getByPlaceholderText(/Search by name/i);
    fireEvent.change(input, { target: { value: 'zzz_no_match_zzz' } });

    expect(screen.getByText('No calls found')).toBeInTheDocument();
  });

  it('renders filter buttons for all types', () => {
    render(<CallsScreen />);
    expect(screen.getByText(/All \(\d+\)/)).toBeInTheDocument();
    expect(screen.getByText(/Incoming \(\d+\)/)).toBeInTheDocument();
    expect(screen.getByText(/Outgoing \(\d+\)/)).toBeInTheDocument();
    expect(screen.getByText(/Missed \(\d+\)/)).toBeInTheDocument();
  });

  it('opens Log Call modal when + button is clicked', () => {
    render(<CallsScreen />);
    const addBtn = screen.getByLabelText(/Log call record/i);
    fireEvent.click(addBtn);

    expect(screen.getByText('Log Call Record')).toBeInTheDocument();
  });
});
