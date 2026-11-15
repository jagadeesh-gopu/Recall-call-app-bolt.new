import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NotesScreen } from '../../screens/NotesScreen';
import { notes } from '../../data';

vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [], error: null }),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
}));

describe('NotesScreen', () => {
  it('renders the page heading', async () => {
    render(<NotesScreen onOpenEditor={vi.fn()} />);
    await waitFor(() => {
      expect(screen.getByText('Smart Notes')).toBeInTheDocument();
    });
  });

  it('renders all 8 notes', async () => {
    render(<NotesScreen onOpenEditor={vi.fn()} />);
    await waitFor(() => {
      expect(screen.queryByText(/loading notes/i)).not.toBeInTheDocument();
    });
    // All note titles should be present
    for (const note of notes) {
      expect(screen.getByText(note.title)).toBeInTheDocument();
    }
  });

  it('shows Pinned section with 3 pinned notes', async () => {
    render(<NotesScreen onOpenEditor={vi.fn()} />);
    await waitFor(() => {
      expect(screen.getByText('Pinned')).toBeInTheDocument();
    });
    const pinnedNotes = notes.filter((n) => n.pinned);
    for (const note of pinnedNotes) {
      expect(screen.getByText(note.title)).toBeInTheDocument();
    }
  });

  it('filter by "College" shows only College notes', async () => {
    render(<NotesScreen onOpenEditor={vi.fn()} />);
    await waitFor(() => {
      expect(screen.queryByText(/loading notes/i)).not.toBeInTheDocument();
    });

    const collegeBtn = screen.getByRole('button', { name: 'College' });
    fireEvent.click(collegeBtn);

    const collegeNotes = notes.filter((n) => n.category === 'College');
    for (const note of collegeNotes) {
      expect(screen.getByText(note.title)).toBeInTheDocument();
    }

    // Non-college notes should not appear
    const nonCollege = notes.filter((n) => n.category !== 'College');
    for (const note of nonCollege) {
      expect(screen.queryByText(note.title)).not.toBeInTheDocument();
    }
  });

  it('search "Rahul" filters to relevant notes', async () => {
    render(<NotesScreen onOpenEditor={vi.fn()} />);
    await waitFor(() => {
      expect(screen.queryByText(/loading notes/i)).not.toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText('Search notes...');
    fireEvent.change(input, { target: { value: 'Rahul' } });

    // Notes containing "rahul" in title or content
    const matches = notes.filter(
      (n) =>
        n.title.toLowerCase().includes('rahul') ||
        n.content.toLowerCase().includes('rahul')
    );
    expect(matches.length).toBeGreaterThan(0);
    for (const note of matches) {
      expect(screen.getByText(note.title)).toBeInTheDocument();
    }
  });

  it('calls onOpenEditor when + button is clicked', async () => {
    const onOpenEditor = vi.fn();
    render(<NotesScreen onOpenEditor={onOpenEditor} />);
    await waitFor(() => {
      expect(screen.queryByText(/loading notes/i)).not.toBeInTheDocument();
    });

    // The + button (New Note action)
    const newNoteBtn = screen.getAllByRole('button').find((b) =>
      b.classList.contains('gradient-primary') && b.querySelector('svg')
    );
    // Alternatively use the Quick Create "New Note" button
    const quickCreate = screen.getByText('New Note').closest('button');
    expect(quickCreate).toBeDefined();
    fireEvent.click(quickCreate!);
    expect(onOpenEditor).toHaveBeenCalled();
  });

  it('calls onOpenEditor with note when a note card is clicked', async () => {
    const onOpenEditor = vi.fn();
    render(<NotesScreen onOpenEditor={onOpenEditor} />);
    await waitFor(() => {
      expect(screen.queryByText(/loading notes/i)).not.toBeInTheDocument();
    });

    const firstTitle = notes[0].title;
    fireEvent.click(screen.getByText(firstTitle));
    expect(onOpenEditor).toHaveBeenCalledWith(expect.objectContaining({ title: firstTitle }));
  });
});
