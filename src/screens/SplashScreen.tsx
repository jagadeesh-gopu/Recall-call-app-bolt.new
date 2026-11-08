import { LogoMark } from '../components/Logo';

export function SplashScreen({ onDone }: { onDone: () => void }) {
  return (
    <div
      className="gradient-splash min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      onClick={onDone}
    >
      {/* Decorative orbs */}
      <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-lavender-300/30 blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-52 h-52 rounded-full bg-navy-300/30 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-lavender-400/20 blur-2xl animate-float" style={{ animationDelay: '2s' }} />

      <div className="relative flex flex-col items-center gap-6 animate-scale-in">
        <div className="relative">
          <div className="absolute inset-0 rounded-3xl gradient-primary blur-2xl opacity-50 animate-pulse-slow" />
          <div className="relative animate-float">
            <LogoMark size={96} animated />
          </div>
        </div>

        <div className="text-center flex flex-col gap-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-navy-900 dark:text-white">
            Recall<span className="gradient-text">Call</span>
          </h1>
          <p className="text-navy-500 dark:text-navy-200 text-base font-medium">
            Your memory, always within reach.
          </p>
        </div>
      </div>

      <div className="absolute bottom-12 flex flex-col items-center gap-4 animate-fade-in" style={{ animationDelay: '0.8s' }}>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full gradient-primary animate-bounce-subtle"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
        <p className="text-xs text-navy-400 dark:text-navy-300">Tap to continue</p>
      </div>
    </div>
  );
}
