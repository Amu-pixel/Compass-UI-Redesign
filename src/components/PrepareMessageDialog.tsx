import { CheckCircle2, Clipboard, ExternalLink, Mail, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from './ui';

type PrepareMessageDialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  recipientLabel: string;
  recipientValue: string;
  unitCode: string;
  context: string;
  defaultSubject: string;
  defaultMessage: string;
  email?: string;
};

export default function PrepareMessageDialog({
  open,
  onClose,
  title,
  recipientLabel,
  recipientValue,
  unitCode,
  context,
  defaultSubject,
  defaultMessage,
  email = 'teaching-team@university.example',
}: PrepareMessageDialogProps) {
  const [subject, setSubject] = useState(defaultSubject);
  const [message, setMessage] = useState(defaultMessage);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);
  const subjectRef = useRef<HTMLInputElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    setSubject(defaultSubject);
    setMessage(defaultMessage);
    setCopied(false);
    setError('');
    window.requestAnimationFrame(() => subjectRef.current?.focus());
    return () => previousFocusRef.current?.focus();
  }, [defaultMessage, defaultSubject, open]);

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

  const preparedMessage = useMemo(() => {
    return [
      message.trim(),
      '',
      `Context: ${unitCode} - ${context}`,
      '',
      'Prepared in Compass AI. No message has been sent by the application.',
    ].join('\n');
  }, [context, message, unitCode]);

  const mailtoHref = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(preparedMessage)}`;

  async function copyMessage() {
    if (!subject.trim() || !message.trim()) {
      setError('Add a subject and message before copying.');
      return;
    }
    setError('');
    const content = `To: ${email}\nSubject: ${subject}\n\n${preparedMessage}`;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(content);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = content;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        const copiedWithFallback = document.execCommand('copy');
        textarea.remove();
        if (!copiedWithFallback) throw new Error('Copy unavailable');
      }
      setCopied(true);
    } catch {
      setError('Copy was blocked by this browser. Use Open in email or select the message manually.');
    }
  }

  function openEmail() {
    if (!subject.trim() || !message.trim()) {
      setError('Add a subject and message before opening email.');
      return;
    }
    setError('');
    window.location.href = mailtoHref;
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-night/72 p-3 backdrop-blur-sm sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="prepare-message-title" className="modal-enter max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-line bg-white p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-companion-tint text-companion">
              <Mail size={19} />
            </span>
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-companion">Communication draft</p>
              <h2 id="prepare-message-title" className="mt-1 font-display text-2xl font-bold text-ink">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-copy">This prepares a message locally. Compass AI does not send messages or publish announcements without a backend.</p>
            </div>
          </div>
          <button type="button" aria-label="Close communication dialog" onClick={onClose} className="premium-focus grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line text-slate-copy outline-none hover:border-companion hover:text-ink">
            <X size={16} />
          </button>
        </div>

        <div className="mt-5 grid gap-3 rounded-xl border border-line bg-paper p-4 sm:grid-cols-3">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase text-slate-soft">{recipientLabel}</p>
            <p className="mt-1 text-sm font-bold text-ink">{recipientValue}</p>
          </div>
          <div>
            <p className="font-mono text-[10px] font-bold uppercase text-slate-soft">Unit</p>
            <p className="mt-1 text-sm font-bold text-ink">{unitCode}</p>
          </div>
          <div>
            <p className="font-mono text-[10px] font-bold uppercase text-slate-soft">Destination</p>
            <p className="mt-1 break-all text-sm font-bold text-ink">{email}</p>
          </div>
        </div>

        <label className="mt-5 block text-sm font-bold text-ink">
          Subject
          <input ref={subjectRef} value={subject} onChange={(event) => setSubject(event.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-line bg-white px-3 text-sm font-semibold outline-none transition focus:border-companion focus:ring-2 focus:ring-companion/20" />
        </label>
        <label className="mt-4 block text-sm font-bold text-ink">
          Message body
          <textarea value={message} onChange={(event) => setMessage(event.target.value)} className="mt-2 min-h-36 w-full rounded-xl border border-line bg-white p-3 text-sm leading-6 outline-none transition focus:border-companion focus:ring-2 focus:ring-companion/20" />
        </label>

        {error && <p role="alert" className="mt-3 rounded-xl border border-danger/20 bg-danger-tint px-3 py-2 text-sm font-semibold text-danger">{error}</p>}
        {copied && <p role="status" className="mt-3 flex items-center gap-2 rounded-xl border border-success/20 bg-success-tint px-3 py-2 text-sm font-semibold text-success"><CheckCircle2 size={15} />Message copied. Nothing has been sent.</p>}

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="secondary" onClick={copyMessage}><Clipboard size={15} />Copy message</Button>
          <Button onClick={openEmail}><ExternalLink size={15} />Open in email</Button>
        </div>
      </div>
    </div>
  );
}
