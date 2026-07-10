import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { ArrowRight, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../utils/classNames';

export function Button({
  children,
  to,
  variant = 'primary',
  size = 'md',
  onClick,
  type = 'button',
  disabled = false,
  className,
  ariaLabel,
}: {
  children: ReactNode;
  to?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'ai' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}) {
  const classes = cn(
    'premium-focus inline-flex shrink-0 items-center justify-center gap-2 rounded-full border text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ai-cyan/70 focus-visible:ring-offset-2 focus-visible:ring-offset-night disabled:pointer-events-none disabled:opacity-50',
    size === 'sm' && 'min-h-9 px-3.5 py-2 text-xs',
    size === 'md' && 'min-h-11 px-5 py-3',
    size === 'lg' && 'min-h-12 px-6 py-3.5',
    size === 'icon' && 'h-11 w-11 p-0',
    variant === 'primary' && 'border-ink bg-ink text-white shadow-sm hover:bg-cardinal-dark',
    variant === 'secondary' && 'border-line bg-white text-ink hover:border-companion hover:text-companion',
    variant === 'ghost' && 'border-transparent text-slate-copy hover:bg-paper-dim',
    variant === 'ai' && 'border-ai-cyan/30 bg-gradient-to-r from-ai-cyan/18 via-ai-violet/18 to-ai-rose/18 text-mist shadow-[0_0_28px_rgba(109,231,242,0.14)] hover:border-ai-cyan/60',
    variant === 'danger' && 'border-danger/20 bg-danger-tint text-danger hover:border-danger/40',
    className,
  );
  if (to) {
    return (
      <Link to={to} className={classes} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled} aria-label={ariaLabel}>
      {children}
    </button>
  );
}

export function Section({
  eyebrow,
  id,
  title,
  children,
  className,
}: {
  eyebrow?: string;
  id?: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn('mx-auto w-full max-w-7xl px-5 py-16 sm:px-8', className)}>
      <div className="mb-9 max-w-3xl">
        {eyebrow && <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider text-companion">{eyebrow}</p>}
        <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export function Card({
  children,
  className,
  variant = 'default',
}: {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'dark' | 'ai' | 'flat';
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border p-5 transition-colors',
        variant === 'default' && 'border-line bg-white text-ink shadow-sm',
        variant === 'dark' && 'border-line-dark bg-night-panel text-mist shadow-premium',
        variant === 'ai' && 'border-ai-cyan/24 bg-gradient-to-br from-night-panel via-night-soft to-night text-mist shadow-[0_22px_70px_rgba(109,231,242,0.10)]',
        variant === 'flat' && 'border-line bg-paper text-ink shadow-none',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function FeatureCard({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <Card className="premium-focus hover:border-companion/40">
      <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-companion-tint text-companion shadow-sm">
        <Icon size={21} />
      </div>
      <h3 className="mb-2 font-display text-lg font-bold">{title}</h3>
      <p className="text-sm leading-6 text-slate-copy">{text}</p>
    </Card>
  );
}

export function ConfidenceBadge({ state = 'grounded' }: { state?: 'grounded' | 'escalated' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[11px] font-semibold shadow-sm',
        state === 'grounded' && 'border-success/20 bg-success-tint text-success',
        state === 'escalated' && 'border-warn/20 bg-warn-tint text-warn',
      )}
    >
      <span className={cn('h-2 w-2 rounded-full', state === 'grounded' ? 'bg-success' : 'bg-warn')} />
      {state === 'grounded' ? 'Grounded in unit content' : 'Escalated to lecturer'}
    </span>
  );
}

export function ChatBubble({ role, text, source }: { role: string; text: string; source?: string }) {
  const isAi = role === 'ai';
  return (
    <div className={cn('flex', isAi ? 'justify-start' : 'justify-end')}>
      <div className={cn('animate-ai-response max-w-[86%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm', isAi ? 'bg-companion-tint text-ink' : 'bg-ink text-white')}>
        <p>{text}</p>
        {source && <p className="mt-3 font-mono text-[11px] font-semibold text-companion">Source: {source}</p>}
      </div>
    </div>
  );
}

export function LoadingPill({ label }: { label: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-companion-tint px-3 py-1.5 text-xs font-semibold text-companion" role="status" aria-live="polite">
      <Loader2 className="animate-spin" size={14} />
      {label}
    </div>
  );
}

export function Toast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-24 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-ink px-5 py-3 text-sm font-semibold text-white shadow-xl md:bottom-8" role="status" aria-live="polite">
      <CheckCircle2 size={17} />
      {message}
    </div>
  );
}

export function InlineLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="inline-flex items-center gap-1 font-semibold text-companion hover:text-cardinal">
      {children} <ArrowRight size={15} />
    </Link>
  );
}

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'ai' | 'success' | 'warning' | 'danger';
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[11px] font-semibold',
        tone === 'neutral' && 'border-line bg-white text-slate-copy',
        tone === 'ai' && 'border-ai-cyan/30 bg-ai-cyan/10 text-ai-cyan',
        tone === 'success' && 'border-success/20 bg-success-tint text-success',
        tone === 'warning' && 'border-warn/20 bg-warn-tint text-warn',
        tone === 'danger' && 'border-danger/20 bg-danger-tint text-danger',
      )}
    >
      {tone === 'ai' && <Sparkles size={12} />}
      {children}
    </span>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('mb-6 flex flex-wrap items-start justify-between gap-4', className)}>
      <div className="max-w-3xl">
        {eyebrow && <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-companion">{eyebrow}</p>}
        <h1 className="mt-2 font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">{title}</h1>
        {description && <p className="mt-3 text-sm leading-6 text-slate-copy sm:text-base">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Tabs({
  items,
  active,
  onChange,
  label,
}: {
  items: string[];
  active: string;
  onChange: (item: string) => void;
  label: string;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto rounded-full border border-line bg-white/80 p-1 shadow-sm" role="tablist" aria-label={label}>
      {items.map((item) => {
        const selected = active === item;
        return (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(item)}
            className={cn(
              'premium-focus whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold outline-none focus-visible:ring-2 focus-visible:ring-ai-cyan/70',
              selected ? 'bg-ink text-white shadow-sm' : 'text-slate-copy hover:bg-paper-dim hover:text-ink',
            )}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}

export function EmptyState({
  icon: Icon = Sparkles,
  title,
  text,
  action,
}: {
  icon?: LucideIcon;
  title: string;
  text: string;
  action?: ReactNode;
}) {
  return (
    <Card className="grid place-items-center px-6 py-10 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-companion-tint text-companion">
        <Icon size={22} />
      </div>
      <h3 className="font-display text-xl font-bold">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-copy">{text}</p>
      {action && <div className="mt-5">{action}</div>}
    </Card>
  );
}

export function PlaceholderState({
  title = 'Feature preview',
  text = 'This workflow is prepared for the product experience and will be connected in a later phase.',
}: {
  title?: string;
  text?: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-companion/35 bg-companion-tint/70 p-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-companion shadow-sm">
          <Sparkles size={16} />
        </div>
        <div>
          <p className="font-display text-sm font-bold text-ink">{title}</p>
          <p className="mt-1 text-sm leading-6 text-slate-copy">{text}</p>
        </div>
      </div>
    </div>
  );
}

export function SkeletonBlock({ className }: { className?: string }) {
  return <div className={cn('skeleton-premium h-4 rounded-full', className)} aria-hidden="true" />;
}
