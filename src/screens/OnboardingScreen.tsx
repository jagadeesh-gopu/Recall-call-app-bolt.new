import { useState } from 'react';
import { Phone, StickyNote, Search, Bell, ArrowRight, BrainCircuit } from 'lucide-react';
import { onboardingSlides } from '../data';

const iconMap: Record<string, any> = { Phone, StickyNote, Search, Bell };

export function OnboardingScreen({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const slide = onboardingSlides[step];
  const Icon = iconMap[slide.icon] ?? BrainCircuit;
  const isLast = step === onboardingSlides.length - 1;

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-navy-950 relative overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center px-8 relative">
        {/* Background decorative */}
        <div className={`absolute inset-0 bg-gradient-to-b ${slide.color} opacity-[0.07] transition-all duration-500`} />
        <div className={`absolute top-20 right-10 w-48 h-48 rounded-full bg-gradient-to-br ${slide.color} opacity-20 blur-3xl transition-all duration-500`} />

        {/* Skip */}
        {!isLast && (
          <button
            onClick={onDone}
            className="absolute top-12 right-6 text-sm font-medium text-navy-400 dark:text-navy-300 hover:text-navy-600 transition-colors z-10"
          >
            Skip
          </button>
        )}

        {/* Illustration */}
        <div className="relative flex flex-col items-center gap-8 animate-scale-in" key={step}>
          <div className="relative">
            <div className={`absolute inset-0 rounded-[2.5rem] bg-gradient-to-br ${slide.color} opacity-30 blur-2xl`} />
            <div className={`relative w-32 h-32 rounded-[2.5rem] bg-gradient-to-br ${slide.color} flex items-center justify-center shadow-glow`}>
              <Icon size={56} className="text-white" strokeWidth={1.8} />
            </div>
            {/* Orbiting dots */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-40 h-40 rounded-full border border-dashed border-navy-200 dark:border-navy-700 animate-spin-slow" />
            </div>
          </div>

          <div className="text-center flex flex-col gap-3 max-w-xs animate-slide-up" style={{ animationDelay: '0.15s' }}>
            <h2 className="font-display text-2xl font-bold text-navy-900 dark:text-white">
              {slide.title}
            </h2>
            <p className="text-sm text-navy-500 dark:text-navy-300 leading-relaxed">
              {slide.description}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="px-8 pb-10 pt-4 flex flex-col items-center gap-6">
        {/* Progress dots */}
        <div className="flex gap-2">
          {onboardingSlides.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step ? 'w-8 gradient-primary' : 'w-2 bg-navy-200 dark:bg-navy-700'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => (isLast ? onDone() : setStep(step + 1))}
          className="w-full max-w-xs h-14 rounded-2xl gradient-primary text-white font-semibold text-base shadow-float flex items-center justify-center gap-2 transition-all hover:shadow-glow-lg active:scale-[0.98]"
        >
          {isLast ? 'Get Started' : 'Next'}
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
