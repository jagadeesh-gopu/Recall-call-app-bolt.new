import { BrainCircuit } from 'lucide-react';

export function Logo({ size = 'md', animated = false }: { size?: 'sm' | 'md' | 'lg'; animated?: boolean }) {
  const sizes = {
    sm: { box: 'w-8 h-8', icon: 18, text: 'text-lg' },
    md: { box: 'w-12 h-12', icon: 26, text: 'text-2xl' },
    lg: { box: 'w-20 h-20', icon: 42, text: 'text-4xl' },
  };
  const s = sizes[size];

  return (
    <div className="flex items-center gap-3">
      <div className={`${s.box} rounded-2xl gradient-primary flex items-center justify-center shadow-glow ${animated ? 'animate-pulse-slow' : ''}`}>
        <BrainCircuit size={s.icon} className="text-white" strokeWidth={2.2} />
      </div>
      <div className="flex flex-col leading-none">
        <span className={`${s.text} font-display font-extrabold tracking-tight text-navy-900 dark:text-white`}>
          Recall<span className="gradient-text">Call</span>
        </span>
      </div>
    </div>
  );
}

export function LogoMark({ size = 48, animated = false }: { size?: number; animated?: boolean }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-3xl gradient-primary flex items-center justify-center shadow-glow ${animated ? 'animate-pulse-slow' : ''}`}
    >
      <BrainCircuit size={size * 0.55} className="text-white" strokeWidth={2.2} />
    </div>
  );
}
