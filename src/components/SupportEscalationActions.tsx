import { CalendarClock, CheckCircle2, Clipboard, GraduationCap, Mail, Users, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { supportEscalationOptions, type SupportEscalationId } from '../data/learningTutor';
import { cn } from '../utils/classNames';
import { Button } from './ui';

const optionIcons: Record<SupportEscalationId, typeof GraduationCap> = {
  mentor: GraduationCap,
  group: Users,
  email: Mail,
  catchup: CalendarClock,
};

const requestCopy: Record<Exclude<SupportEscalationId, 'email'>, {
  title: string;
  eyebrow: string;
  detail: string;
  action: string;
}> = {
  mentor: {
    title: '1-on-1 Mentor Session',
    eyebrow: 'Mentor support request',
    detail: 'This creates a request draft for a study mentor. No session is booked until you send the request through your university support channel.',
    action: 'Request mentor support',
  },
  group: {
    title: 'Group Study Session',
    eyebrow: 'Group study request',
    detail: 'This prepares a request to join a study discussion for the current topic. In this local demo, it does not add you to a live group.',
    action: 'Prepare group request',
  },
  catchup: {
    title: 'Lecturer Catch-up Session',
    eyebrow: 'Lecturer catch-up request',
    detail: 'This prepares a catch-up request for conceptual clarification. It does not confirm an appointment or calendar booking.',
    action: 'Prepare catch-up request',
  },
};

export function SupportEscalationActions({
  onSelect,
  className,
}: {
  onSelect: (id: SupportEscalationId) => void;
  className?: string;
}) {
  return (
    <div className={cn('grid gap-3 sm:grid-cols-2', className)} aria-label="Human support options">
      {supportEscalationOptions.map((option) => {
        const Icon = optionIcons[option.id];
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect(option.id)}
            className="premium-focus group min-w-0 rounded-2xl border border-line bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-companion hover:bg-companion-tint focus-visible:outline-none"
          >
            <span className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-companion/20 bg-companion-tint text-companion transition group-hover:bg-white">
                <Icon size={17} aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold text-ink">{option.title}</span>
                <span className="mt-1 block text-xs leading-5 text-slate-copy">{option.description}</span>
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function SupportRequestDialog({
  open,
  type,
  onClose,
  unitCode,
  unitTitle,
  context,
  studentMessage,
}: {
  open: boolean;
  type: Exclude<SupportEscalationId, 'email'> | null;
  onClose: () => void;
  unitCode: string;
  unitTitle: string;
  context: string;
  studentMessage?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const config = type ? requestCopy[type] : null;
  const draft = useMemo(() => {
    if (!config) return '';
    return [
      `${config.title} request`,
      '',
      `Unit: ${unitCode} ${unitTitle}`,
      `Context: ${context}`,
      studentMessage ? `Student note: ${studentMessage}` : 'Student note: I am still confused and would like help understanding the current topic.',
      '',
      'I would like help clarifying the concept before I continue with practice or assessment work.',
    ].join('\n');
  }, [config, context, studentMessage, unitCode, unitTitle]);

  useEffect(() => {
    if (!open) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    setCopied(false);
    setError('');
    window.requestAnimationFrame(() => closeRef.current?.focus());
    return () => previousFocusRef.current?.focus();
  }, [open, type]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab') return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose, open]);

  async function copyRequest() {
    setCopied(false);
    setError('');
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(draft);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = draft;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        const copiedWithFallback = document.execCommand('copy');
        textarea.remove();
        if (!copiedWithFallback) throw new Error('Copy command unavailable');
      }
      setCopied(true);
    } catch {
      setError('Copy was blocked by this browser. Select the request draft text manually.');
    }
  }

  if (!open || !config) return null;

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-night/72 p-3 backdrop-blur-sm sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="support-request-title" className="modal-enter max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-line bg-white p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-companion">{config.eyebrow}</p>
            <h2 id="support-request-title" className="mt-1 font-display text-2xl font-bold text-ink">{config.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-copy">{config.detail}</p>
          </div>
          <button ref={closeRef} type="button" aria-label="Close support request dialog" onClick={onClose} className="premium-focus grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line text-slate-copy outline-none hover:border-companion hover:text-ink">
            <X size={16} />
          </button>
        </div>

        <div className="mt-5 rounded-2xl border border-line bg-paper p-4">
          <p className="font-mono text-[10px] font-bold uppercase text-slate-soft">Prepared request draft</p>
          <pre className="mt-3 whitespace-pre-wrap break-words rounded-xl border border-line bg-white p-3 text-xs leading-5 text-ink">{draft}</pre>
        </div>

        {error && <p role="alert" className="mt-3 rounded-xl border border-danger/20 bg-danger-tint px-3 py-2 text-sm font-semibold text-danger">{error}</p>}
        {copied && (
          <p role="status" className="mt-3 flex items-center gap-2 rounded-xl border border-success/20 bg-success-tint px-3 py-2 text-sm font-semibold text-success">
            <CheckCircle2 size={15} />Request copied. No booking has been confirmed in this local demo.
          </p>
        )}

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={onClose}>Close</Button>
          <Button onClick={copyRequest}><Clipboard size={15} />{config.action}</Button>
        </div>
      </div>
    </div>
  );
}
