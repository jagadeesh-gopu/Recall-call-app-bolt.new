import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchScreen } from '../../screens/SearchScreen';

describe('SearchScreen — Universal Search', () => {
  it('renders Universal Search header and search bar', () => {
    render(<SearchScreen />);
    expect(screen.getByText('Universal Search')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Search across all your records/i)
    ).toBeInTheDocument();
  });

  it('renders Recent Searches when query is empty', () => {
    render(<SearchScreen />);
    expect(screen.getByText('Recent Searches')).toBeInTheDocument();
    expect(screen.getByText('Rahul')).toBeInTheDocument();
  });

  it('searches across contacts, notes, calls, and reminders on query input', () => {
    render(<SearchScreen />);
    const input = screen.getByPlaceholderText(/Search across all your records/i);
    fireEvent.change(input, { target: { value: 'Rahul' } });

    // Should find results and show results count
    expect(screen.getByText(/results for "Rahul"/i)).toBeInTheDocument();
    // Rahul Sharma contact
    expect(screen.getAllByText(/Rahul Sharma/i).length).toBeGreaterThan(0);
  });

  it('navigates to contact when contact search result is clicked', () => {
    const onOpenContact = vi.fn();
    render(<SearchScreen onOpenContact={onOpenContact} />);
    const input = screen.getByPlaceholderText(/Search across all your records/i);
    fireEvent.change(input, { target: { value: 'Rahul' } });

    const contactResult = screen.getAllByText('Rahul Sharma')[0];
    fireEvent.click(contactResult);
    expect(onOpenContact).toHaveBeenCalled();
  });

  it('filters by category tab (e.g. Notes)', () => {
    render(<SearchScreen />);
    const input = screen.getByPlaceholderText(/Search across all your records/i);
    fireEvent.change(input, { target: { value: 'Project' } });

    // Click Notes tab
    const notesTab = screen.getByRole('button', { name: /Notes \(\d+\)/i });
    fireEvent.click(notesTab);

    expect(screen.getByText('Project Deadline Reminder')).toBeInTheDocument();
  });

  it('shows empty state when no records match', () => {
    render(<SearchScreen />);
    const input = screen.getByPlaceholderText(/Search across all your records/i);
    fireEvent.change(input, { target: { value: 'nonexistent_query_xyz' } });

    expect(screen.getByText('No matching records')).toBeInTheDocument();
  });
});
