import { Home, Search, StickyNote, Users, User, ChevronLeft } from 'lucide-react';
import type { Screen } from '../types';

const navItems: { screen: Screen; label: string; icon: any }[] = [
  { screen: 'home', label: 'Home', icon: Home },
  { screen: 'search', label: 'Search', icon: Search },
  { screen: 'notes', label: 'Notes', icon: StickyNote },
  { screen: 'contacts', label: 'Memories', icon: Users },
  { screen: 'profile', label: 'Profile', icon: User },
];

export function BottomNav({
  current,
  onNavigate,
  onBack,
}: {
  current: Screen;
  onNavigate: (s: Screen) => void;
  onBack?: () => void;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none">
      <div className="max-w-[440px] mx-auto px-3 pb-3 pointer-events-auto">
        <div className="glass-card rounded-3xl px-2 py-2 flex items-center justify-around">
          {navItems.map((item) => {
            const active = current === item.screen;
            const Icon = item.icon;
            return (
              <button
                key={item.screen}
                onClick={() => onNavigate(item.screen)}
                className="relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all duration-300"
              >
                <div className={`transition-all duration-300 ${active ? 'scale-110' : 'scale-100'}`}>
                  <Icon
                    size={22}
                    strokeWidth={active ? 2.5 : 2}
                    className={active ? 'text-navy-600 dark:text-lavender-400' : 'text-navy-300 dark:text-navy-500'}
                  />
                </div>
                <span className={`text-[10px] font-medium transition-colors ${active ? 'text-navy-600 dark:text-lavender-400' : 'text-navy-300 dark:text-navy-500'}`}>
                  {item.label}
                </span>
                {active && (
                  <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full gradient-primary" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function FloatingVoiceButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 group"
      aria-label="Open AI Voice Assistant"
    >
      <div className="relative">
        <div className="absolute inset-0 rounded-full gradient-primary blur-xl opacity-60 animate-pulse-slow" />
        <div className="relative w-16 h-16 rounded-full gradient-primary flex items-center justify-center shadow-float transition-transform duration-300 group-hover:scale-110 group-active:scale-95">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="22" />
          </svg>
        </div>
      </div>
    </button>
  );
}

export function BackButton({ onBack }: { onBack: () => void }) {
  return (
    <button
      onClick={onBack}
      className="fixed top-4 left-4 z-40 w-10 h-10 rounded-2xl glass-card flex items-center justify-center shadow-soft transition-all hover:scale-105 active:scale-95 animate-scale-in"
      aria-label="Go back"
    >
      <ChevronLeft size={22} className="text-navy-600 dark:text-navy-200" />
    </button>
  );
}
