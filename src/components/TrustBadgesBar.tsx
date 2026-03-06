import { ShieldCheck, Gem, RefreshCw, Palette, CreditCard, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrustBadge {
  icon: string;
  title: string;
  description: string;
}

interface TrustBadgesBarProps {
  badges: TrustBadge[];
  variant?: 'strip' | 'full';
}

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  'shield-check': ShieldCheck,
  'gem': Gem,
  'refresh-cw': RefreshCw,
  'palette': Palette,
  'credit-card': CreditCard,
  'wrench': Wrench,
};

export default function TrustBadgesBar({ badges, variant = 'strip' }: TrustBadgesBarProps) {
  if (variant === 'strip') {
    return (
      <div className="py-4 border-y border-[var(--color-text)]/5">
        <div className="flex gap-6 overflow-x-auto scrollbar-hide px-1">
          {badges.map((badge) => {
            const Icon = iconMap[badge.icon];
            return (
              <div key={badge.title} className="flex items-center gap-2 shrink-0">
                {Icon && <Icon size={16} className="text-[var(--color-primary)]" />}
                <span className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider whitespace-nowrap">
                  {badge.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className="section">
      <div className="container-site">
        <h2
          className="text-2xl md:text-3xl font-bold text-gradient text-center mb-10"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Why Trust Devi Shresta
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {badges.map((badge) => {
            const Icon = iconMap[badge.icon];
            return (
              <div
                key={badge.title}
                className={cn(
                  'glass rounded-[var(--radius-md)] p-5 text-center',
                  'hover:border-[var(--color-primary)]/30 transition-all duration-300',
                  'group'
                )}
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 flex items-center justify-center group-hover:bg-[var(--color-primary)]/20 transition-colors">
                  {Icon && <Icon size={22} className="text-[var(--color-primary)]" />}
                </div>
                <h3 className="text-sm font-semibold text-[var(--color-text)] mb-1">{badge.title}</h3>
                <p className="text-[11px] text-[var(--color-text-muted)] leading-relaxed">{badge.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
