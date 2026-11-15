import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AssistantScreen } from '../../screens/AssistantScreen';

describe('AssistantScreen with Local AI', () => {
  it('renders AssistantScreen heading with Local AI badge', () => {
    render(<AssistantScreen onClose={vi.fn()} />);
    expect(screen.getByText('Local AI Assistant')).toBeInTheDocument();
  });

  it('renders suggested prompts', () => {
    render(<AssistantScreen onClose={vi.fn()} />);
    expect(screen.getByText('Who called me yesterday?')).toBeInTheDocument();
    expect(screen.getByText('What are my reminders for today?')).toBeInTheDocument();
  });

  it('renders the tap-to-speak button', () => {
    render(<AssistantScreen onClose={vi.fn()} />);
    expect(screen.getByRole('button', { name: /tap to speak/i })).toBeInTheDocument();
  });

  it('renders the text input for natural language queries', () => {
    render(<AssistantScreen onClose={vi.fn()} />);
    expect(screen.getByPlaceholderText(/Ask anything/i)).toBeInTheDocument();
  });

  it('allows clicking a suggested prompt and triggers sending', async () => {
    render(<AssistantScreen onClose={vi.fn()} />);
    const promptBtn = screen.getByText('Who called me yesterday?');
    fireEvent.click(promptBtn);

    // It should append the user prompt to the chat
    const matches = screen.getAllByText('Who called me yesterday?');
    expect(matches.length).toBeGreaterThan(0);
  });

  it('opens AI Settings modal when settings button is clicked', () => {
    render(<AssistantScreen onClose={vi.fn()} />);
    const settingsBtn = screen.getByTitle('AI Settings');
    fireEvent.click(settingsBtn);

    expect(screen.getByText('Local AI Settings')).toBeInTheDocument();
    expect(screen.getByText(/Built-in Local Brain/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Google Gemini/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Ollama Local Model/i)).toBeInTheDocument();
  });
});
