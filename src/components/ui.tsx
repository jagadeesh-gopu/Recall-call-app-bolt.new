import { PhoneIncoming, PhoneOutgoing, PhoneMissed, Clock } from 'lucide-react';
import type { CallType } from '../types';

export function CallTypeIcon({ type, size = 16 }: { type: CallType; size?: number }) {
  if (type === 'incoming') return <PhoneIncoming size={size} className="text-emerald-500" />;
  if (type === 'outgoing') return <PhoneOutgoing size={size} className="text-sky-500" />;
  return <PhoneMissed size={size} className="text-rose-500" />;
}

export function Avatar({ initials, color, size = 'md' }: { initials: string; color: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-9 h-9 text-xs', md: 'w-11 h-11 text-sm', lg: 'w-14 h-14 text-base' };
  return (
    <div className={`${sizes[size]} rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center font-semibold text-white shadow-soft shrink-0`}>
      {initials}
    </div>
  );
}

export function CallTypeBadge({ type }: { type: CallType }) {
  const styles = {
    incoming: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    outgoing: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
    missed: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  };
  return (
    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${styles[type]}`}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
}

export function DurationDisplay({ duration }: { duration: string }) {
  return (
    <div className="flex items-center gap-1 text-xs text-navy-400 dark:text-navy-300">
      <Clock size={11} />
      <span>{duration}</span>
    </div>
  );
}

export function CategoryTag({ category }: { category: string }) {
  return (
    <span className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-lavender-100 text-lavender-700 dark:bg-lavender-900/30 dark:text-lavender-300">
      {category}
    </span>
  );
}

export function PinIndicator() {
  return (
    <div className="absolute top-3 right-3 w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-amber-500">
        <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
      </svg>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, subtitle }: { icon: any; title: string; subtitle: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-3xl bg-lavender-100 dark:bg-lavender-900/30 flex items-center justify-center mb-4">
        <Icon size={28} className="text-lavender-400" />
      </div>
      <h3 className="font-display font-semibold text-navy-700 dark:text-navy-100 mb-1">{title}</h3>
      <p className="text-sm text-navy-400 dark:text-navy-300 max-w-xs">{subtitle}</p>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="flex items-center gap-3">
        <div className="skeleton w-11 h-11 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-3 w-2/3 rounded-full" />
          <div className="skeleton h-2 w-1/2 rounded-full" />
        </div>
      </div>
    </div>
  );
}
