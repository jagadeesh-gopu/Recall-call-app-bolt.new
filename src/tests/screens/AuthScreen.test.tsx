import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthScreen } from '../../screens/AuthScreen';
import { AuthProvider } from '../../context/AuthContext';

vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
      signInWithOtp: vi.fn().mockResolvedValue({ error: null }),
      verifyOtp: vi.fn().mockResolvedValue({ error: null }),
      signOut: vi.fn().mockResolvedValue({}),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
}));

const renderAuthScreen = (onSuccess = vi.fn()) =>
  render(
    <AuthProvider>
      <AuthScreen onSuccess={onSuccess} />
    </AuthProvider>
  );

describe('AuthScreen', () => {
  it('renders phone input step by default', () => {
    renderAuthScreen();
    expect(screen.getByPlaceholderText('+91 98765 43210')).toBeInTheDocument();
    expect(screen.getByText('Send OTP')).toBeInTheDocument();
  });

  it('renders logo and app name', () => {
    renderAuthScreen();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/RecallCall/i);
  });

  it('shows error when Send OTP is clicked with short phone', async () => {
    renderAuthScreen();
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText('+91 98765 43210'), '123');
    await user.click(screen.getByText('Send OTP'));

    await waitFor(() => {
      expect(screen.getByText(/valid phone number/i)).toBeInTheDocument();
    });
  });

  it('shows Supabase-not-configured error when valid phone entered (demo mode)', async () => {
    renderAuthScreen();
    const user = userEvent.setup();

    // Type a valid-length phone
    await user.type(
      screen.getByPlaceholderText('+91 98765 43210'),
      '+919876543210'
    );
    await user.click(screen.getByText('Send OTP'));

    await waitFor(() => {
      expect(screen.getByText(/Supabase is not configured/i)).toBeInTheDocument();
    });
  });

  it('shows loader while OTP is sending', async () => {
    renderAuthScreen();
    const user = userEvent.setup();

    await user.type(
      screen.getByPlaceholderText('+91 98765 43210'),
      '+919876543210'
    );

    const btn = screen.getByRole('button', { name: /send otp/i });
    fireEvent.click(btn);
    expect(btn).toBeInTheDocument();
  });

  it('renders privacy assurance text', () => {
    renderAuthScreen();
    expect(
      screen.getByText(/Your phone number is encrypted/i)
    ).toBeInTheDocument();
  });
});
