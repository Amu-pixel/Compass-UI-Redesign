import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../utils/classNames';

export function Button({
  children,
  to,
  variant = 'primary',
  onClick,
  type = 'button',
}: {
  children: ReactNode;
  to?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  onClick?: () => void;
  type?: 'button' | 'submit';
}) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 focus:outline-2',
    variant === 'primary' && 'bg-ink text-white shadow-sm hover:bg-cardinal-dark',
    variant === 'secondary' && 'border border-line bg-white text-ink hover:border-companion hover:text-companion',
    variant === 'ghost' && 'text-slate-copy hover:bg-paper-dim',
  );
  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={classes} onClick={onClick}>
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
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn('rounded-2xl border border-line bg-white p-5 shadow-sm', className)}>{children}</div>;
}

export function FeatureCard({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <Card className="transition hover:-translate-y-1 hover:border-companion/40">
      <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-companion-tint text-companion">
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
        'inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[11px] font-semibold',
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
      <div className={cn('max-w-[86%] rounded-2xl px-4 py-3 text-sm leading-6', isAi ? 'bg-companion-tint text-ink' : 'bg-ink text-white')}>
        <p>{text}</p>
        {source && <p className="mt-3 font-mono text-[11px] font-semibold text-companion">Source: {source}</p>}
      </div>
    </div>
  );
}

export function LoadingPill({ label }: { label: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-companion-tint px-3 py-1.5 text-xs font-semibold text-companion">
      <Loader2 className="animate-spin" size={14} />
      {label}
    </div>
  );
}

export function Toast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-24 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white shadow-xl md:bottom-8">
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
