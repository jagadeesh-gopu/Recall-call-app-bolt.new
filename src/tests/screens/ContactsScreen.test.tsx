import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ContactsScreen } from '../../screens/ContactsScreen';
import { contacts } from '../../data';

describe('ContactsScreen', () => {
  it('renders heading and contact count', () => {
    render(<ContactsScreen onOpenContact={vi.fn()} />);
    expect(screen.getByText('Contact Memory')).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`${contacts.length} contacts`, 'i'))).toBeInTheDocument();
  });

  it('renders contact list items with initials and memory summaries', () => {
    render(<ContactsScreen onOpenContact={vi.fn()} />);
    for (const c of contacts) {
      expect(screen.getByText(c.name)).toBeInTheDocument();
    }
  });

  it('filters contacts by search query', () => {
    render(<ContactsScreen onOpenContact={vi.fn()} />);
    const input = screen.getByPlaceholderText(/Search contacts/i);
    fireEvent.change(input, { target: { value: 'Priya' } });

    expect(screen.getByText('Priya Patel')).toBeInTheDocument();
    expect(screen.queryByText('Dr. Mehta')).not.toBeInTheDocument();
  });

  it('filters by Unknown Numbers button', () => {
    render(<ContactsScreen onOpenContact={vi.fn()} />);
    const unknownBtn = screen.getByText(/Unknown Numbers/i);
    fireEvent.click(unknownBtn);

    expect(screen.getByText('Unknown Number')).toBeInTheDocument();
    expect(screen.queryByText('Rahul Sharma')).not.toBeInTheDocument();
  });

  it('opens Add Contact Memory modal on + click', () => {
    render(<ContactsScreen onOpenContact={vi.fn()} />);
    const addBtn = screen.getByLabelText(/Add new contact/i);
    fireEvent.click(addBtn);

    expect(screen.getByText('New Contact Memory')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e\.g\. Rahul Sharma/i)).toBeInTheDocument();
  });

  it('calls onOpenContact when a contact card is clicked', () => {
    const onOpenContact = vi.fn();
    render(<ContactsScreen onOpenContact={onOpenContact} />);

    fireEvent.click(screen.getByText('Rahul Sharma'));
    expect(onOpenContact).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Rahul Sharma' })
    );
  });
});
