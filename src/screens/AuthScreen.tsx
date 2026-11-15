import { useState, useRef, useEffect } from 'react';
import { Phone, ArrowRight, Shield, Sparkles, AlertCircle, Loader2, KeyRound, ChevronLeft } from 'lucide-react';
import { LogoMark } from '../components/Logo';
import { useAuth } from '../context/AuthContext';

export function AuthScreen({ onSuccess }: { onSuccess?: () => void }) {
  const { sendOtp, verifyOtp } = useAuth();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const formatPhone = (raw: string) => {
    // Strip all non‑digit characters
    const digits = raw.replace(/\D/g, '');
    if (!digits) return '';
    // Ensure the number is in E.164 format (+<countrycode><number>)
    // Limit length to 15 digits as per E.164 spec
    return '+' + digits.slice(0, 15);
  };

  // Validate that a phone string is a proper E.164 number
  const isValidPhone = (phoneStr: string) => {
    const e164 = /^\+\d{10,15}$/;
    return e164.test(phoneStr);
  };

  const handleSendOtp = async () => {
    setError(null);
    setInfo(null);
    if (!isValidPhone(phone)) {
      setError('Please enter a valid phone number in international format, e.g., +91 98765 43210.');
      return;
    }
    console.log('Sending OTP to', phone);
    setLoading(true);
    const { error: err } = await sendOtp(phone);
    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    setInfo('OTP sent! Check your messages for the 6-digit code.');
    setStep('otp');
    setResendTimer(60);
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  };

  const handleVerifyOtp = async () => {
    setError(null);
    setInfo(null);
    const code = otp.join('');
    if (code.length !== 6) {
      setError('Please enter all 6 digits of the OTP.');
      return;
    }
    const formattedPhone = phone.startsWith('+') ? phone : '+' + phone.replace(/\D/g, '');
    setLoading(true);
    const { error: err } = await verifyOtp(formattedPhone, code);
    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    setInfo('Verified! Welcome to RecallCall.');
    // Navigate to home after a brief success message
    setTimeout(() => onSuccess?.(), 800);
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setError(null);
    setInfo(null);
    const formattedPhone = phone.startsWith('+') ? phone : '+' + phone.replace(/\D/g, '');
    if (!isValidPhone(formattedPhone)) {
      setError('Invalid phone number.');
      return;
    }
    setLoading(true);
    const { error: err } = await sendOtp(formattedPhone);
    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    setInfo('OTP resent! Check your messages.');
    setResendTimer(60);
  };

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length > 0) {
      const newOtp = ['', '', '', '', '', ''];
      pasted.split('').forEach((d, i) => { newOtp[i] = d; });
      setOtp(newOtp);
      if (pasted.length === 6) {
        otpRefs.current[5]?.focus();
      } else {
        otpRefs.current[pasted.length]?.focus();
      }
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
          {step === 'phone' ? (
            <>
              <h2 className="font-display text-xl font-bold text-navy-900 dark:text-white mb-1">
                Welcome
              </h2>
              <p className="text-sm text-navy-400 dark:text-navy-300 mb-6">
                Enter your phone number to sign in or create an account
              </p>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-navy-500 dark:text-navy-300 mb-1.5 block">Phone Number</label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-300 dark:text-navy-500" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(formatPhone(e.target.value))}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
                      placeholder="+91 98765 43210"
                      autoComplete="tel"
                      className="w-full h-12 pl-12 pr-4 rounded-2xl bg-navy-50 dark:bg-navy-800/50 border border-navy-100 dark:border-navy-700 text-sm text-navy-900 dark:text-white placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-navy-400 transition-all"
                    />
                  </div>
                  <p className="text-[11px] text-navy-300 dark:text-navy-500 mt-1.5">
                    Include your country code (e.g. +91 for India, +1 for US)
                  </p>
                </div>

                <button
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="w-full h-13 py-3.5 rounded-2xl gradient-primary text-white font-semibold text-sm shadow-float flex items-center justify-center gap-2 transition-all hover:shadow-glow-lg active:scale-[0.98] disabled:opacity-60"
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      Send OTP
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                <div className="relative flex items-center justify-center my-3">
                  <div className="border-t border-navy-100 dark:border-navy-700 w-full" />
                  <span className="bg-white dark:bg-navy-900 px-2 text-[10px] text-navy-400 uppercase tracking-wider absolute">or</span>
                </div>

                <button
                  type="button"
                  onClick={() => onSuccess?.()}
                  className="w-full h-11 rounded-2xl bg-navy-50 dark:bg-navy-800 text-navy-600 dark:text-navy-200 font-semibold text-xs transition-all hover:bg-navy-100 dark:hover:bg-navy-700"
                >
                  Continue in Demo Mode (Skip Auth)
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => { setStep('phone'); setOtp(['', '', '', '', '', '']); setError(null); setInfo(null); }}
                className="flex items-center gap-1 text-xs font-medium text-navy-400 hover:text-navy-600 dark:text-lavender-400 transition-colors mb-4"
              >
                <ChevronLeft size={16} />
                Change number
              </button>

              <h2 className="font-display text-xl font-bold text-navy-900 dark:text-white mb-1">
                Verify your number
              </h2>
              <p className="text-sm text-navy-400 dark:text-navy-300 mb-6">
                Enter the 6-digit code sent to <span className="font-semibold text-navy-600 dark:text-navy-200">{phone}</span>
              </p>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-navy-500 dark:text-navy-300 mb-1.5 block">Verification Code</label>
                  <div className="flex gap-2 justify-between">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => { otpRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        onPaste={i === 0 ? handleOtpPaste : undefined}
                        className="w-11 h-14 rounded-2xl bg-navy-50 dark:bg-navy-800/50 border-2 border-navy-100 dark:border-navy-700 text-center text-xl font-bold text-navy-900 dark:text-white focus:outline-none focus:border-navy-400 dark:focus:border-lavender-400 transition-all"
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="w-full h-13 py-3.5 rounded-2xl gradient-primary text-white font-semibold text-sm shadow-float flex items-center justify-center gap-2 transition-all hover:shadow-glow-lg active:scale-[0.98] disabled:opacity-60"
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      <KeyRound size={18} />
                      Verify & Continue
                    </>
                  )}
                </button>

                <div className="text-center">
                  {resendTimer > 0 ? (
                    <p className="text-xs text-navy-300 dark:text-navy-500">
                      Resend code in {resendTimer}s
                    </p>
                  ) : (
                    <button
                      onClick={handleResendOtp}
                      disabled={loading}
                      className="text-xs font-semibold gradient-text"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Privacy reassurance */}
        <div className="mt-auto pb-8 pt-4 flex items-center justify-center gap-2 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Shield size={14} className="text-emerald-500" />
          <p className="text-xs text-navy-400 dark:text-navy-400 flex items-center gap-1">
            Your phone number is encrypted and never shared
          </p>
          <Sparkles size={12} className="text-lavender-400" />
        </div>
      </div>
    </div>
  );
}
