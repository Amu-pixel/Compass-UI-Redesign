import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Brain,
  ChevronDown,
  ChevronUp,
  CircleAlert,
  ClipboardCheck,
  GraduationCap,
  Lightbulb,
  Loader2,
  MessageSquare,
  Send,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  aiResponses,
  chatSeed,
  learningStyles,
  quickActions,
  supportPathways,
  unit,
} from '../data/mockData';
import { Badge, Button, ConfidenceBadge } from '../components/ui';
import { cn } from '../utils/classNames';

type MessageState = 'grounded' | 'uncertain' | 'unsupported' | 'escalated';
type Message = {
  role: string;
  text: string;
  source?: string;
  state?: MessageState;
  followUps?: string[];
};

const SUGGESTED_FOLLOW_UPS: Record<string, string[]> = {
  grounded: [
    'Can you give me a worked example?',
    'How does this connect to Week 3?',
    'Quiz me on this concept',
  ],
  uncertain: [
    'Prepare support questions for me',
    'Recommend support option',
    'Summarise lecture',
  ],
  unsupported: [
    'Explain this slide',
    'Connect previous topics',
    'Summarise lecture',
  ],
  escalated: [
    'Prepare support questions for me',
    'Recommend support option',
    'Practice question',
  ],
};

function classifyResponse(text: string, source?: string): MessageState {
  const t = text.toLowerCase();
  if (source?.toLowerCase().includes('escalated')) return 'escalated';
  if (
    t.includes("i'm not confident") ||
    t.includes('not confident enough') ||
    t.includes('recommend asking your lecturer')
  )
    return 'uncertain';
  if (t.includes('cannot draft') || t.includes('academic integrity'))
    return 'unsupported';
  return 'grounded';
}

export default function LearningPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>(chatSeed);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('Text');
  const [contextExpanded, setContextExpanded] = useState(false);
  const [toast, setToast] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem('ailc-memory');
    if (stored) {
      try {
        setMessages(JSON.parse(stored) as Message[]);
      } catch {
        setMessages(chatSeed);
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem('ailc-memory', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  function notify(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  }

  function sendMessage(text = input) {
    if (!text.trim()) return;
    setMessages((items) => [...items, { role: 'student', text }]);
    setInput('');
    setLoading(true);
    setTimeout(() => {
      const low = text.toLowerCase();
      const scripted = aiResponses[text];
      const isStillConfused =
        low.includes('still confused') ||
        low.includes("still don't understand") ||
        low.includes('still do not understand') ||
        low.includes('still stuck') ||
        low.includes('confused');

      if (isStillConfused) setShowSupport(true);

      let responseText: string;
      let responseSource: string | undefined;

      if (isStillConfused) {
        responseText =
          'Thanks for saying that. Since this still feels unclear, I recommend moving from explanation into support. Try a group discussion to compare reasoning, a 1-on-1 mentoring session for study strategy, or a lecturer catch-up if the confusion is about expectations. Bring these questions: 1. Where exactly does shear become moment? 2. How do I identify the maximum moment location? 3. How can I explain my reasoning without asking for an assessment answer?';
        responseSource = 'Week 4 Lecture Slides, Slide 18';
      } else if (low.includes('assignment')) {
        responseText =
          'I can help you understand the concept so you can discuss it confidently, but I cannot draft assessment content. Focus on explaining how load position changes shear, and how shear changes the bending moment shape.';
        responseSource = 'Assessment Brief, Academic Integrity Guidance';
      } else if (low.includes('internet') || low.includes('answer')) {
        responseText =
          "I'm not confident enough to answer this using the approved unit materials. I recommend PASS, tutorial discussion, or lecturer consultation — and this question has entered the lecturer review queue.";
        responseSource = 'Escalated to lecturer review queue';
      } else if (scripted) {
        responseText = scripted;
        responseSource = 'Week 4 Lecture Slides, Slide 18';
      } else {
        responseText =
          'Let us use a worked example. First find reactions, then draw shear, then use the shear areas to build the bending moment diagram. If the answer still feels uncertain, I can prepare questions for your tutorial or PASS session.';
        responseSource = 'Week 4 Lecture, Slide 18';
      }

      const state = classifyResponse(responseText, responseSource);
      const followUps = SUGGESTED_FOLLOW_UPS[state];

      setMessages((items) => [
        ...items,
        { role: 'ai', text: responseText, source: responseSource, state, followUps },
      ]);
      setLoading(false);
    }, 850);
  }

  const hasMessages = messages.length > 0;

  return (
    <div className="animate-page mx-auto grid max-w-7xl gap-5 px-5 py-6 sm:px-8 xl:grid-cols-[1fr_340px]">
      {/* Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full border border-white/10 bg-ink px-5 py-3 text-sm font-semibold text-white shadow-xl md:bottom-8"
        >
          {toast}
        </div>
      )}

      {/* ── Main workspace ── */}
      <section className="space-y-4">
        {/* Context bar */}
        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
          <div className="flex items-center justify-between gap-3 px-5 py-4">
            <div className="min-w-0">
              <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5">
                <Link to="/courses" className="font-mono text-xs font-semibold text-slate-soft hover:text-companion">
                  Courses
                </Link>
                <span className="text-xs text-slate-soft">/</span>
                <Link to="/demo" className="font-mono text-xs font-semibold text-slate-soft hover:text-companion">
                  {unit.code}
                </Link>
                <span className="text-xs text-slate-soft">/</span>
                <span className="font-mono text-xs font-semibold text-companion">{unit.week}</span>
                <span className="text-xs text-slate-soft">/</span>
                <span className="font-mono text-xs font-semibold text-ink">AI Tutor</span>
              </nav>
              <h1 className="mt-2 font-display text-2xl font-bold leading-tight text-ink sm:text-3xl">
                AI Tutor — {unit.topic}
              </h1>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2">
              <ConfidenceBadge />
              <button
                type="button"
                aria-expanded={contextExpanded}
                aria-controls="context-details"
                onClick={() => setContextExpanded((v) => !v)}
                className="flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold text-slate-soft hover:bg-paper hover:text-ink"
              >
                Context {contextExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>
            </div>
          </div>

          {contextExpanded && (
            <div id="context-details" className="border-t border-line bg-paper px-5 py-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="font-mono text-[10px] font-semibold uppercase text-slate-soft">Unit</p>
                  <p className="mt-1 text-sm font-semibold">{unit.name}</p>
                  <p className="text-xs text-slate-soft">Dr Avery Tan</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] font-semibold uppercase text-slate-soft">Current week</p>
                  <p className="mt-1 text-sm font-semibold">{unit.week}: {unit.topic}</p>
                  <p className="text-xs text-slate-soft">Lecture Slides, Slide 18</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] font-semibold uppercase text-slate-soft">Learning objective</p>
                  <p className="mt-1 text-sm font-semibold">Construct bending moment diagrams from shear force</p>
                  <p className="text-xs text-slate-soft">Assessed in Assignment 2</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <div className="flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-slate-copy">
                  <BookOpen size={12} className="text-companion" />
                  Week 4 Lecture Slides indexed
                </div>
                <div className="flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-slate-copy">
                  <ShieldCheck size={12} className="text-success" />
                  Lecturer-approved content only
                </div>
                <div className="flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-slate-copy">
                  <ClipboardCheck size={12} className="text-warn" />
                  Academic integrity enforced
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Learning mode selector */}
        <div className="rounded-2xl border border-line bg-white px-5 py-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-mono text-xs font-semibold uppercase text-slate-soft">Learning mode</p>
              <p className="mt-0.5 text-sm font-semibold text-ink">
                {selectedStyle === 'Text'
                  ? 'Text — grounded explanations with source citations'
                  : `${selectedStyle} — same academic guardrails, adapted delivery`}
              </p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {learningStyles.map((style) => (
              <button
                key={style}
                type="button"
                aria-pressed={selectedStyle === style}
                onClick={() => setSelectedStyle(style)}
                className={cn(
                  'rounded-full border px-3.5 py-1.5 text-xs font-semibold transition',
                  selectedStyle === style
                    ? 'border-companion bg-companion-tint text-companion shadow-sm'
                    : 'border-line bg-white text-slate-copy hover:border-companion hover:text-companion',
                )}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation area */}
        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
          {/* Conversation header */}
          <div className="flex items-center justify-between border-b border-line px-5 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-companion/20 bg-companion-tint text-companion">
                <Brain size={16} />
              </div>
              <div>
                <p className="text-sm font-bold text-ink">AI Tutor</p>
                <p className="text-[11px] text-slate-soft">Grounded in {unit.code} approved content</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone="ai">AI Companion</Badge>
              {hasMessages && (
                <button
                  type="button"
                  aria-label="Clear conversation history"
                  onClick={() => {
                    window.localStorage.removeItem('ailc-memory');
                    setMessages(chatSeed);
                    setShowSupport(false);
                    notify('Conversation cleared. Starting fresh.');
                  }}
                  className="rounded-full p-1.5 text-slate-soft hover:bg-paper hover:text-ink"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="min-h-[420px] space-y-4 overflow-y-auto px-5 py-5" style={{ maxHeight: '52vh' }}>
            {messages.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-companion/20 bg-companion-tint text-companion">
                  <Sparkles size={26} />
                </div>
                <h3 className="font-display text-xl font-bold text-ink">Start a conversation</h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-copy">
                  Ask about {unit.topic}. The AI Tutor will explain concepts using
                  Week 4 lecture slides and cite its sources.
                </p>
                <p className="mt-4 text-xs text-slate-soft">
                  Or use a quick action on the right to begin.
                </p>
              </div>
            )}

            {messages.map((message, index) => (
              <AiTutorMessage
                key={`${message.role}-${index}`}
                message={message}
                onFollowUp={sendMessage}
              />
            ))}

            {loading && <ThinkingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Composer */}
          <div className="border-t border-line px-5 py-4">
            <div className="flex gap-2 rounded-2xl border border-line bg-paper p-2 transition focus-within:border-companion focus-within:shadow-sm">
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && !event.shiftKey && sendMessage()}
                className="min-w-0 flex-1 bg-transparent px-3 text-sm text-ink placeholder:text-slate-soft outline-none"
                placeholder={`Ask about ${unit.topic}…`}
                aria-label="Ask the AI Tutor a question"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => sendMessage()}
                aria-label="Send learning question"
                disabled={loading || !input.trim()}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-xl transition',
                  input.trim() && !loading
                    ? 'bg-companion text-white hover:bg-companion/90'
                    : 'bg-paper-dim text-slate-soft',
                )}
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </div>

            <div className="mt-3 flex items-start gap-2 rounded-xl border border-line bg-paper px-3 py-2">
              <ShieldCheck size={13} className="mt-0.5 shrink-0 text-success" />
              <p className="text-[11px] leading-5 text-slate-copy">
                The AI Tutor explains underlying concepts and cites approved unit sources. It does not
                write assignment content, complete reports, or provide final answers.
              </p>
            </div>
          </div>
        </div>

        {/* Adaptive learning loop */}
        <div className="rounded-2xl border border-line bg-white px-5 py-4 shadow-sm">
          <p className="font-mono text-xs font-semibold uppercase text-slate-soft">How it works</p>
          <h3 className="mt-2 font-display text-lg font-bold">Adaptive learning loop</h3>
          <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
            {['Ask', 'AI explains', 'Practise', 'Quiz', 'Reflect', 'Support'].map((step, i) => (
              <div
                key={step}
                className="relative rounded-xl bg-paper p-3 text-center text-xs font-bold text-ink"
              >
                {step}
                {i < 5 && (
                  <ArrowRight
                    size={12}
                    className="absolute -right-1.5 top-1/2 -translate-y-1/2 text-slate-soft"
                    aria-hidden="true"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Right sidebar ── */}
      <aside className="space-y-4">
        {/* Quick actions */}
        <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-companion-tint text-companion">
              <Lightbulb size={15} />
            </div>
            <h2 className="font-display text-base font-bold">Quick actions</h2>
          </div>
          <div className="grid gap-2">
            {quickActions.map((action) => (
              <button
                key={action}
                type="button"
                onClick={() => sendMessage(action)}
                disabled={loading}
                className="rounded-xl border border-line px-4 py-3 text-left text-sm font-semibold text-ink transition hover:border-companion hover:bg-companion-tint disabled:opacity-50"
              >
                {action}
              </button>
            ))}
          </div>
        </div>

        {/* Contextual resources */}
        <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-paper-dim text-slate-copy">
              <BookOpen size={15} />
            </div>
            <h2 className="font-display text-base font-bold">Unit resources</h2>
          </div>
          <div className="space-y-2">
            {[
              { label: 'Week 4 Lecture Slides', sub: 'Slide 18 · currently indexed', active: true },
              { label: 'Week 3 Tutorial', sub: 'Question 4 · shear diagrams' },
              { label: 'Assignment 2 Brief', sub: 'Bending moment reflection' },
              { label: 'Assessment rubric', sub: '4 criteria · formative only' },
            ].map((res) => (
              <button
                key={res.label}
                type="button"
                onClick={() => notify(`${res.label} is indexed and used to ground AI Tutor responses.`)}
                className={cn(
                  'w-full rounded-xl border px-3 py-2.5 text-left transition',
                  res.active
                    ? 'border-companion/30 bg-companion-tint'
                    : 'border-line bg-paper hover:border-companion hover:bg-companion-tint',
                )}
              >
                <p className="text-sm font-semibold text-ink">{res.label}</p>
                <p className="mt-0.5 text-xs text-slate-soft">{res.sub}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Further learning / support */}
        <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-warn-tint text-warn">
              <AlertTriangle size={15} />
            </div>
            <h2 className="font-display text-base font-bold">Further learning options</h2>
          </div>

          {!showSupport ? (
            <div className="rounded-xl border border-dashed border-line bg-paper px-4 py-4 text-center">
              <p className="text-sm font-semibold text-ink">Support pathways available</p>
              <p className="mt-2 text-xs leading-5 text-slate-copy">
                These appear when you tell the AI you are still confused or stuck. Try: "I'm still
                confused about bending moment diagrams."
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {supportPathways.map(({ name, detail, icon: Icon }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => notify(`${name}: ${detail}`)}
                  className="flex w-full gap-3 rounded-xl border border-line p-3 text-left transition hover:border-companion hover:bg-companion-tint"
                >
                  <Icon className="mt-0.5 shrink-0 text-companion" size={16} />
                  <div>
                    <p className="text-sm font-bold text-ink">{name}</p>
                    <p className="mt-0.5 text-xs leading-5 text-slate-soft">{detail}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {showSupport && (
            <div className="mt-4 rounded-xl border border-companion/20 bg-companion-tint p-4">
              <div className="flex items-center gap-2 text-sm font-bold text-companion">
                <Sparkles size={14} />
                Questions to bring
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-copy">
                Ask: "Can you check my shear-to-moment link?", "Where should I look for maximum
                moment?", and "How can I explain my reasoning without getting an assessment answer?"
              </p>
            </div>
          )}

          {showSupport && (
            <div className="mt-3 grid gap-2">
              <Button
                variant="secondary"
                onClick={() => sendMessage('Prepare support questions for me')}
              >
                <MessageSquare size={15} />
                Prepare support questions
              </Button>
            </div>
          )}
        </div>

        {/* Next recommended action */}
        <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
          <p className="font-mono text-[10px] font-semibold uppercase text-slate-soft">Recommended next step</p>
          <div className="mt-3 flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cardinal-tint text-cardinal">
              <ClipboardCheck size={16} />
            </div>
            <div>
              <p className="text-sm font-bold text-ink">Open Assignment 2</p>
              <p className="mt-1 text-xs leading-5 text-slate-copy">
                Upload your draft for AI formative feedback before the Monday 9 am checkpoint.
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Button to="/demo/assessment" variant="secondary" className="w-full justify-center">
              Open assessment <ArrowRight size={15} />
            </Button>
          </div>
        </div>

        {/* Escalation / support pathway */}
        <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
          <p className="font-mono text-[10px] font-semibold uppercase text-slate-soft">Human support</p>
          <div className="mt-3 space-y-2">
            {[
              { icon: GraduationCap, label: 'Dr Avery Tan', sub: 'Tue 1:30 pm · Room 5.204' },
              { icon: Users, label: 'PASS session', sub: 'Fri 2:00 pm · Studio 2.13' },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => notify(`${item.label} — ${item.sub}`)}
                className="flex w-full items-center gap-3 rounded-xl border border-line px-3 py-2.5 text-left transition hover:border-companion hover:bg-companion-tint"
              >
                <item.icon size={15} className="shrink-0 text-slate-soft" />
                <div>
                  <p className="text-sm font-semibold text-ink">{item.label}</p>
                  <p className="text-xs text-slate-soft">{item.sub}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

/* ── Sub-components ── */

function AiTutorMessage({
  message,
  onFollowUp,
}: {
  message: Message;
  onFollowUp: (text: string) => void;
}) {
  const isAi = message.role === 'ai';

  if (!isAi) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl bg-ink px-4 py-3 text-sm leading-6 text-white shadow-sm">
          {message.text}
        </div>
      </div>
    );
  }

  const state = message.state ?? classifyResponse(message.text, message.source);

  return (
    <div className="animate-ai-response flex justify-start">
      <div className="max-w-[90%] space-y-3">
        {/* AI message bubble */}
        <div
          className={cn(
            'rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm',
            state === 'grounded' && 'bg-companion-tint text-ink',
            state === 'uncertain' && 'border border-warn/20 bg-warn-tint text-ink',
            state === 'unsupported' && 'border border-danger/15 bg-danger-tint text-ink',
            state === 'escalated' && 'border border-warn/20 bg-warn-tint text-ink',
          )}
        >
          {/* State indicator */}
          <div className="mb-2 flex items-center gap-2">
            {state === 'grounded' && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-success/20 bg-success-tint px-2 py-0.5 font-mono text-[10px] font-semibold text-success">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                Grounded in unit content
              </span>
            )}
            {state === 'uncertain' && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-warn/20 bg-warn-tint px-2 py-0.5 font-mono text-[10px] font-semibold text-warn">
                <CircleAlert size={10} />
                Uncertain — human review recommended
              </span>
            )}
            {state === 'unsupported' && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-danger/20 bg-danger-tint px-2 py-0.5 font-mono text-[10px] font-semibold text-danger">
                <ShieldCheck size={10} />
                Academic integrity boundary
              </span>
            )}
            {state === 'escalated' && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-warn/20 bg-warn-tint px-2 py-0.5 font-mono text-[10px] font-semibold text-warn">
                <AlertTriangle size={10} />
                Escalated to lecturer queue
              </span>
            )}
          </div>

          <p>{message.text}</p>

          {message.source && (
            <p className="mt-3 font-mono text-[11px] font-semibold text-companion">
              Source: {message.source}
            </p>
          )}
        </div>

        {/* Suggested follow-ups */}
        {message.followUps && message.followUps.length > 0 && (
          <div className="ml-1 flex flex-wrap gap-2">
            {message.followUps.map((fu) => (
              <button
                key={fu}
                type="button"
                onClick={() => onFollowUp(fu)}
                className="rounded-full border border-companion/25 bg-companion-tint px-3 py-1 text-xs font-semibold text-companion transition hover:border-companion hover:bg-white"
              >
                {fu}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ThinkingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="inline-flex items-center gap-2.5 rounded-2xl border border-companion/20 bg-companion-tint px-4 py-3 text-sm font-semibold text-companion">
        <Loader2 size={15} className="animate-spin" />
        <span>Checking approved unit content…</span>
        <span
          aria-label="AI thinking"
          role="status"
          aria-live="polite"
          className="sr-only"
        >
          AI is preparing a response
        </span>
      </div>
    </div>
  );
}
