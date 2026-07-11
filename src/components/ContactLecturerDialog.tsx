import { CheckCircle2, Clipboard, ExternalLink, GraduationCap, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from './ui';

type ContactLecturerDialogProps = {
  open: boolean;
  onClose: () => void;
  lecturerName?: string;
  lecturerEmail?: string;
  unitCode: string;
  unitTitle: string;
  context: string;
  defaultSubject?: string;
  defaultMessage?: string;
};

export default function ContactLecturerDialog({
  open,
  onClose,
  lecturerName = 'Dr Avery Tan',
  lecturerEmail = 'avery.tan@university.example',
  unitCode,
  unitTitle,
  context,
  defaultSubject,
  defaultMessage,
}: ContactLecturerDialogProps) {
  const [subject, setSubject] = useState(defaultSubject ?? `${unitCode}: Question about ${context}`);
  const [message, setMessage] = useState(defaultMessage ?? '');
  const [includeContext, setIncludeContext] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);
  const subjectRef = useRef<HTMLInputElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    setSubject(defaultSubject ?? `${unitCode}: Question about ${context}`);
    setMessage(defaultMessage ?? '');
    setIncludeContext(true);
    setCopied(false);
    setError('');
    window.requestAnimationFrame(() => subjectRef.current?.focus());
    return () => previousFocusRef.current?.focus();
  }, [context, defaultMessage, defaultSubject, open, unitCode]);

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
    const parts = [
      `Hello ${lecturerName},`,
      '',
      message.trim() || 'I would like to clarify the point below.',
      '',
      includeContext ? `Context: ${unitCode} ${unitTitle} - ${context}` : '',
      '',
      'Thank you.',
    ].filter((part, index, list) => part || list[index - 1]);
    return parts.join('\n');
  }, [context, includeContext, lecturerName, message, unitCode, unitTitle]);

  const mailtoHref = `mailto:${encodeURIComponent(lecturerEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(preparedMessage)}`;

  async function copyMessage() {
    if (!subject.trim() || !message.trim()) {
      setError('Add a subject and a short question before copying the message.');
      return;
    }
    setError('');
    const content = `To: ${lecturerEmail}\nSubject: ${subject}\n\n${preparedMessage}`;
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
        if (!copiedWithFallback) throw new Error('Copy command unavailable');
      }
      setCopied(true);
    } catch {
      setError('Copy was blocked by this browser. Use Open in email or select the message text manually.');
    }
  }

  function openEmail() {
    if (!subject.trim() || !message.trim()) {
      setError('Add a subject and a short question before opening your email application.');
      return;
    }
    setError('');
    window.location.href = mailtoHref;
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-night/72 p-3 backdrop-blur-sm sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="contact-lecturer-title" className="modal-enter max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-line bg-white p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-companion-tint text-companion">
              <GraduationCap size={21} />
            </span>
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-companion">Contact lecturer</p>
              <h2 id="contact-lecturer-title" className="mt-1 font-display text-2xl font-bold text-ink">Prepare a message for {lecturerName}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-copy">Your email application will open with this message prepared. Copy message is available as a fallback.</p>
            </div>
          </div>
          <button type="button" aria-label="Close contact lecturer dialog" onClick={onClose} className="premium-focus grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line text-slate-copy outline-none hover:border-companion hover:text-ink">
            <X size={16} />
          </button>
        </div>

        <div className="mt-5 grid gap-3 rounded-2xl border border-line bg-paper p-4 sm:grid-cols-3">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase text-slate-soft">Lecturer</p>
            <p className="mt-1 text-sm font-bold text-ink">{lecturerName}</p>
          </div>
          <div>
            <p className="font-mono text-[10px] font-bold uppercase text-slate-soft">Email</p>
            <p className="mt-1 break-all text-sm font-bold text-ink">{lecturerEmail}</p>
          </div>
          <div>
            <p className="font-mono text-[10px] font-bold uppercase text-slate-soft">Unit context</p>
            <p className="mt-1 text-sm font-bold text-ink">{unitCode}</p>
          </div>
        </div>

        <label className="mt-5 block text-sm font-bold text-ink">
          Subject
          <input ref={subjectRef} value={subject} onChange={(event) => setSubject(event.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-line bg-white px-3 text-sm font-semibold outline-none transition focus:border-companion focus:ring-2 focus:ring-companion/20" />
        </label>
        <label className="mt-4 block text-sm font-bold text-ink">
          Message
          <textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Describe what you have tried, where you are stuck, and what you want to clarify." className="mt-2 min-h-36 w-full rounded-xl border border-line bg-white p-3 text-sm leading-6 outline-none transition focus:border-companion focus:ring-2 focus:ring-companion/20" />
        </label>
        <label className="mt-4 flex items-start gap-3 rounded-xl border border-line bg-paper p-3 text-sm font-semibold text-ink">
          <input type="checkbox" checked={includeContext} onChange={(event) => setIncludeContext(event.target.checked)} className="mt-1 h-4 w-4 accent-companion" />
          Include lesson or assignment context: {context}
        </label>

        {error && <p role="alert" className="mt-3 rounded-xl border border-danger/20 bg-danger-tint px-3 py-2 text-sm font-semibold text-danger">{error}</p>}
        {copied && <p role="status" className="mt-3 flex items-center gap-2 rounded-xl border border-success/20 bg-success-tint px-3 py-2 text-sm font-semibold text-success"><CheckCircle2 size={15} />Message copied.</p>}

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="secondary" onClick={copyMessage}><Clipboard size={15} />Copy message</Button>
          <Button onClick={openEmail}><ExternalLink size={15} />Open in email</Button>
        </div>
      </div>
    </div>
  );
}
