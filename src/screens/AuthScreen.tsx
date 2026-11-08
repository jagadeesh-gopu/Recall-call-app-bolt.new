import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield, Sparkles, User, AlertCircle, Loader2 } from 'lucide-react';
import { LogoMark } from '../components/Logo';
import { useAuth } from '../context/AuthContext';

export function AuthScreen() {
  const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [showReset, setShowReset] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setInfo(null);

    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    if (mode === 'signup' && !fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    setLoading(true);
    if (mode === 'login') {
      const { error: err } = await signIn(email, password);
      if (err) setError(err);
    } else {
      const { error: err } = await signUp(email, password, fullName);
      if (err) setError(err);
      else setInfo('Account created! You are now signed in.');
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setError(null);
    setLoading(true);
    const { error: err } = await signInWithGoogle();
    if (err) {
      setError(err);
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email.trim()) {
      setError('Enter your email above first, then tap reset.');
      return;
    }
    setLoading(true);
    setError(null);
    const { error: err } = await resetPassword(email);
    setLoading(false);
    if (err) setError(err);
    else {
      setInfo('Password reset email sent. Check your inbox.');
      setShowReset(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-navy-950 flex flex-col relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-72 gradient-splash opacity-50" />
      <div className="absolute top-10 right-10 w-48 h-48 rounded-full bg-lavender-300/20 blur-3xl" />
      <div className="absolute top-32 left-5 w-32 h-32 rounded-full bg-navy-300/20 blur-2xl" />

      <div className="relative flex-1 flex flex-col px-6 pt-16">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-10 animate-scale-in">
          <LogoMark size={64} />
          <div className="text-center">
            <h1 className="font-display text-2xl font-extrabold text-navy-900 dark:text-white">
              Recall<span className="gradient-text">Call</span>
            </h1>
            <p className="text-xs text-navy-400 dark:text-navy-300 mt-0.5">Your memory, always within reach.</p>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-3 mx-1 flex items-start gap-2 p-3 rounded-2xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 animate-slide-up">
            <AlertCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
            <p className="text-xs text-rose-700 dark:text-rose-300">{error}</p>
          </div>
        )}

        {/* Info message */}
        {info && (
          <div className="mb-3 mx-1 flex items-start gap-2 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 animate-slide-up">
            <Shield size={16} className="text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-xs text-emerald-700 dark:text-emerald-300">{info}</p>
          </div>
        )}

        {/* Form card */}
        <div className="glass-card rounded-3xl p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="font-display text-xl font-bold text-navy-900 dark:text-white mb-1">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="text-sm text-navy-400 dark:text-navy-300 mb-6">
            {mode === 'login' ? 'Sign in to access your memories' : 'Start remembering everything that matters'}
          </p>

          <div className="space-y-4">
            {mode === 'signup' && (
              <div className="animate-slide-down">
                <label className="text-xs font-medium text-navy-500 dark:text-navy-300 mb-1.5 block">Full Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-300 dark:text-navy-500" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full h-12 pl-12 pr-4 rounded-2xl bg-navy-50 dark:bg-navy-800/50 border border-navy-100 dark:border-navy-700 text-sm text-navy-900 dark:text-white placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-navy-400 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-navy-500 dark:text-navy-300 mb-1.5 block">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-300 dark:text-navy-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full h-12 pl-12 pr-4 rounded-2xl bg-navy-50 dark:bg-navy-800/50 border border-navy-100 dark:border-navy-700 text-sm text-navy-900 dark:text-white placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-navy-400 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-navy-500 dark:text-navy-300">Password</label>
                {mode === 'login' && (
                  <button
                    onClick={() => setShowReset(!showReset)}
                    className="text-xs font-medium text-navy-400 hover:text-navy-600 dark:text-lavender-400 transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-300 dark:text-navy-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  placeholder="••••••••"
                  className="w-full h-12 pl-12 pr-12 rounded-2xl bg-navy-50 dark:bg-navy-800/50 border border-navy-100 dark:border-navy-700 text-sm text-navy-900 dark:text-white placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-navy-400 transition-all"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-navy-300 hover:text-navy-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {showReset && (
              <div className="animate-slide-down">
                <button
                  onClick={handleResetPassword}
                  disabled={loading}
                  className="w-full h-11 rounded-2xl bg-lavender-100 dark:bg-lavender-900/30 text-lavender-700 dark:text-lavender-300 font-medium text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : 'Send Reset Link'}
                </button>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full h-13 py-3.5 rounded-2xl gradient-primary text-white font-semibold text-sm shadow-float flex items-center justify-center gap-2 transition-all hover:shadow-glow-lg active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-navy-100 dark:bg-navy-700" />
            <span className="text-xs text-navy-300 dark:text-navy-500">or continue with</span>
            <div className="flex-1 h-px bg-navy-100 dark:bg-navy-700" />
          </div>

          {/* Google login */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full h-12 rounded-2xl bg-white dark:bg-navy-800 border border-navy-200 dark:border-navy-700 font-medium text-sm text-navy-700 dark:text-navy-100 flex items-center justify-center gap-3 transition-all hover:bg-navy-50 dark:hover:bg-navy-700/50 active:scale-[0.98] disabled:opacity-60"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>
        </div>

        {/* Switch mode */}
        <div className="text-center mt-6 mb-4">
          <p className="text-sm text-navy-400 dark:text-navy-300">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null); setInfo(null); }}
              className="font-semibold gradient-text"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        {/* Privacy reassurance */}
        <div className="mt-auto pb-8 pt-4 flex items-center justify-center gap-2 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Shield size={14} className="text-emerald-500" />
          <p className="text-xs text-navy-400 dark:text-navy-400 flex items-center gap-1">
            End-to-end encrypted · Your memories stay private
          </p>
          <Sparkles size={12} className="text-lavender-400" />
        </div>
      </div>
    </div>
  );
}
