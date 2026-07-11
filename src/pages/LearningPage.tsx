import {
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Bookmark,
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
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ContactLecturerDialog from '../components/ContactLecturerDialog';
import {
  aiResponses,
  chatSeed,
  unit,
} from '../data/mockData';
import { Badge, Button, Card, ConfidenceBadge, LoadingPill } from '../components/ui';
import { LearningExperienceStudio, learningMethodOptions, type LearningMethod } from '../components/LearningExperienceStudio';
import { buildTutorResponse, type TutorAction, type TutorIntent } from '../data/learningTutor';
import { cn } from '../utils/classNames';

type MessageState = 'grounded' | 'uncertain' | 'unsupported' | 'escalated';
type Message = {
  role: string;
  text: string;
  source?: string;
  state?: MessageState;
  intent?: TutorIntent;
  followUps?: Array<TutorAction | string>;
  pinned?: boolean;
};

const defaultLearningActions = buildTutorResponse('What is bending moment?').followUps;

const slidePromptActions = [
  'Explain this.',
  'Why does this work?',
  'Give example.',
  'Simplify.',
  'Show formula.',
  'Show intuition.',
  'Explain like beginner.',
  'Explain mathematically.',
  'Compare with previous lecture.',
  'How would this appear in exam?',
  'Common mistakes?',
  'Applications?',
  'Visual explanation?',
  'Generate practice question.',
  'Related concept.',
];

const learningCommandActions: Array<TutorAction> = [
  { label: 'Review difficult concepts', kind: 'ask', value: 'What difficult concepts should I review next?' },
  { label: 'Generate quiz', kind: 'method', value: 'practice' },
  { label: 'Generate flashcards', kind: 'method', value: 'flashcards' },
  { label: 'Summarise lesson', kind: 'ask', value: 'Summarise this slide.' },
  { label: 'Open podcast', kind: 'method', value: 'podcast' },
  { label: 'Open video', kind: 'method', value: 'video' },
  { label: 'Ask Tutor', kind: 'ask', value: 'Explain this slide.' },
  { label: 'Practice questions', kind: 'method', value: 'practice' },
  { label: 'Revision plan', kind: 'method', value: 'revision' },
  { label: 'Visual explanation', kind: 'method', value: 'diagram' },
  { label: 'Formula sheet', kind: 'ask', value: 'Show formula.' },
  { label: 'Common mistakes', kind: 'ask', value: 'Common mistakes?' },
  { label: 'Exam strategy', kind: 'ask', value: 'How would this appear in exam?' },
  { label: 'Real-world applications', kind: 'ask', value: 'Applications?' },
];

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
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [messages, setMessages] = useState<Message[]>(chatSeed);
  const [input, setInput] = useState(() => searchParams.get('question') ?? '');
  const [loading, setLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState<Message | null>(null);
  const [showSupport, setShowSupport] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<LearningMethod>(() => {
    const requested = searchParams.get('method');
    return learningMethodOptions.some((item) => item.id === requested)
      ? requested as LearningMethod
      : 'simple';
  });
  const [contextExpanded, setContextExpanded] = useState(false);
  const [toast, setToast] = useState('');
  const [contactOpen, setContactOpen] = useState(false);
  const [contactReason, setContactReason] = useState('Concept clarification');
  const [contactQuestion, setContactQuestion] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const streamTimerRef = useRef<number | null>(null);
  const queryHandledRef = useRef(false);

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
    const question = searchParams.get('question');
    if (!question || queryHandledRef.current) return;
    queryHandledRef.current = true;
    const timer = window.setTimeout(() => sendMessage(question), 150);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const requested = searchParams.get('method');
    if (!requested) {
      setSelectedMethod('simple');
      return;
    }
    if (!learningMethodOptions.some((item) => item.id === requested)) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete('method');
      setSearchParams(nextParams, { replace: true });
      setSelectedMethod('simple');
      return;
    }
    setSelectedMethod(requested as LearningMethod);
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    window.localStorage.setItem('ailc-memory', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, streamingMessage]);

  useEffect(() => () => {
    if (streamTimerRef.current) window.clearInterval(streamTimerRef.current);
  }, []);

  function notify(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  }

  function selectMethod(method: LearningMethod) {
    setSelectedMethod(method);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('method', method);
    setSearchParams(nextParams);
    notify(`${learningMethodOptions.find((item) => item.id === method)?.label} opened with approved Week 4 sources.`);
  }

  function sendMessage(text = input) {
    const question = text.trim();
    if (!question || loading) return;
    setMessages((items) => [...items, { role: 'student', text: question }]);
    setInput('');
    setLoading(true);
    setAnnouncement('AI Tutor is checking approved unit content.');
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
          "I'm not confident enough to answer this using the approved unit materials. I recommend PASS, tutorial discussion, or preparing a contextual request for your lecturer.";
        responseText =
          "I'm not confident enough to answer this using the approved unit materials. I recommend PASS, tutorial discussion, or preparing a contextual request for your lecturer from Human support.";
        responseSource = 'Approved unit materials insufficient for a grounded answer';
      } else if (scripted) {
        responseText = scripted;
        responseSource = 'Week 4 Lecture Slides, Slide 18';
      } else {
        responseText =
          'Let us use a worked example. First find reactions, then draw shear, then use the shear areas to build the bending moment diagram. If the answer still feels uncertain, I can prepare questions for your tutorial or PASS session.';
        responseSource = 'Week 4 Lecture, Slide 18';
      }

      const deterministicResponse = buildTutorResponse(question);
      responseText = deterministicResponse.text;
      responseSource = deterministicResponse.source;
      setShowSupport(Boolean(deterministicResponse.showSupport));
      const state = deterministicResponse.state ?? classifyResponse(responseText, responseSource);
      const followUps = deterministicResponse.followUps;

      const words = responseText.split(' ');
      let cursor = 0;
      setStreamingMessage({ role: 'ai', text: '', source: responseSource, state, intent: deterministicResponse.intent });
      streamTimerRef.current = window.setInterval(() => {
        cursor = Math.min(words.length, cursor + 3);
        const partial = words.slice(0, cursor).join(' ');
        setStreamingMessage({ role: 'ai', text: partial, source: responseSource, state, intent: deterministicResponse.intent });
        if (cursor >= words.length) {
          if (streamTimerRef.current) window.clearInterval(streamTimerRef.current);
          streamTimerRef.current = null;
          setMessages((items) => [
            ...items,
            { role: 'ai', text: responseText, source: responseSource, state, intent: deterministicResponse.intent, followUps },
          ]);
          setStreamingMessage(null);
          setLoading(false);
          setAnnouncement(`AI Tutor response ready: ${responseText}`);
          window.requestAnimationFrame(() => inputRef.current?.focus());
        }
      }, 42);
    }, 850);
  }

  function togglePinned(index: number) {
    setMessages((items) =>
      items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, pinned: !item.pinned } : item,
      ),
    );
  }

  function handleTutorAction(action: TutorAction | string) {
    if (typeof action === 'string') {
      sendMessage(action);
      return;
    }
    if (action.kind === 'ask') {
      sendMessage(action.value);
      return;
    }
    if (action.kind === 'method') {
      selectMethod(action.value as LearningMethod);
      window.requestAnimationFrame(() => {
        document.getElementById('studio-title')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      return;
    }
    if (action.kind === 'navigate') {
      navigate(action.value);
      return;
    }
    setContactReason(action.value);
    setContactOpen(true);
  }

  function addPassReminder() {
    window.localStorage.setItem('civl301-pass-reminder', 'Fri 2:00 pm - Studio 2.13');
    notify('PASS session reminder added on this device.');
  }

  const hasMessages = messages.length > 0;
  const latestLearningActions = [...messages]
    .reverse()
    .find((message) => message.role === 'ai' && message.followUps?.length)?.followUps
    ?? defaultLearningActions;

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

      {/* Main workspace */}
      <ContactLecturerDialog
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        unitCode={unit.code}
        unitTitle={unit.name}
        context={`${unit.week} ${unit.topic} - ${contactReason}`}
        defaultSubject={`${unit.code}: ${contactReason}`}
        defaultMessage={contactQuestion}
      />

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
                AI Tutor - {unit.topic}
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

        <div className="grid gap-3 rounded-2xl border border-line bg-white p-4 shadow-sm md:grid-cols-4">
          {[
            ['Current lesson', `${unit.week}: ${unit.topic}`],
            ['Objective', 'Use shear area to construct moment'],
            ['Progress', '68% through Structural Analysis 301'],
            ['Next action', 'Apply reasoning to Assignment 2'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-line bg-paper px-4 py-3">
              <p className="font-mono text-[10px] font-semibold uppercase text-slate-soft">{label}</p>
              <p className="mt-1 text-sm font-bold leading-5 text-ink">{value}</p>
            </div>
          ))}
        </div>

        <AcademicLessonCanvas onNotify={notify} onAsk={sendMessage} />

        <LearningExperienceStudio
          selectedMethod={selectedMethod}
          onSelect={selectMethod}
          onAsk={sendMessage}
        />

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
          <div aria-label="AI Tutor conversation" aria-busy={loading} className="min-h-[420px] space-y-4 overflow-y-auto px-5 py-5" style={{ maxHeight: '52vh' }}>
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

            {messages.some((message) => message.pinned) && (
              <div className="rounded-xl border border-companion/25 bg-companion-tint/60 p-3">
                <p className="flex items-center gap-2 text-xs font-bold text-companion"><Bookmark size={13} />Pinned answers</p>
                <div className="mt-2 space-y-2">
                  {messages.filter((message) => message.pinned).map((message) => <p key={message.text} className="line-clamp-2 text-xs leading-5 text-slate-copy">{message.text}</p>)}
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <AiTutorMessage
                key={`${message.role}-${index}`}
                message={message}
                onFollowUp={handleTutorAction}
                onPin={message.role === 'ai' ? () => togglePinned(index) : undefined}
              />
            ))}

            {loading && !streamingMessage && <ThinkingIndicator />}
            {streamingMessage && <AiTutorMessage message={streamingMessage} onFollowUp={handleTutorAction} streaming />}
            <div ref={messagesEndRef} />
          </div>
          <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</div>

          {/* Composer */}
          <div className="border-t border-line px-5 py-4">
            <div className="flex gap-2 rounded-2xl border border-line bg-paper p-2 transition focus-within:border-companion focus-within:shadow-sm">
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    sendMessage();
                  }
                }}
                className="min-w-0 flex-1 bg-transparent px-3 text-sm text-ink placeholder:text-slate-soft outline-none"
                placeholder={`Ask about ${unit.topic}...`}
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

      {/* Right sidebar */}
      <aside className="space-y-4">
        {/* Quick actions */}
        <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-companion-tint text-companion">
              <Lightbulb size={15} />
            </div>
            <div>
              <h2 className="font-display text-base font-bold">Learning commands</h2>
              <p className="text-xs text-slate-soft">Every option opens a method, asks the tutor, or navigates to real content.</p>
            </div>
          </div>
          <div className="grid gap-2">
            {learningCommandActions.map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={() => handleTutorAction(action)}
                disabled={loading}
                className="group flex items-center justify-between gap-3 rounded-xl border border-line px-4 py-3 text-left text-sm font-semibold text-ink transition hover:border-companion hover:bg-companion-tint disabled:opacity-50"
              >
                <span>{action.label}</span>
                <ArrowRight size={14} className="shrink-0 text-slate-soft transition group-hover:text-companion" />
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
              { label: 'Week 4 Lecture Slides', sub: 'Slide 18 - currently indexed', active: true },
              { label: 'Week 3 Tutorial', sub: 'Question 4 - shear diagrams' },
              { label: 'Assignment 2 Brief', sub: 'Bending moment reflection' },
              { label: 'Assessment rubric', sub: '4 criteria - formative only' },
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

          <p className="mb-3 text-xs leading-5 text-slate-copy">
            Actions adapt to the most recent question and open the relevant method, response, or course destination.
          </p>
          <div className="space-y-2">
            {latestLearningActions.map((action) => {
              const label = typeof action === 'string' ? action : action.label;
              return (
                <button
                  key={`${label}-${typeof action === 'string' ? 'ask' : action.kind}`}
                  type="button"
                  onClick={() => handleTutorAction(action)}
                  disabled={loading}
                  className="flex w-full items-center justify-between gap-3 rounded-xl border border-line p-3 text-left text-sm font-semibold text-ink transition hover:border-companion hover:bg-companion-tint disabled:opacity-50"
                >
                  <span>{label}</span>
                  <ArrowRight size={14} className="shrink-0 text-companion" />
                </button>
              );
            })}
          </div>
          {showSupport && (
            <div className="mt-4 rounded-xl border border-warn/20 bg-warn-tint p-4">
              <p className="text-xs font-bold text-warn">Human and prerequisite support is available now.</p>
              <p className="mt-1 text-xs leading-5 text-slate-copy">Choose Contact lecturer above, or return to the Week 3 shear-force prerequisite.</p>
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
              { icon: GraduationCap, label: 'Contact Dr Avery Tan', sub: 'Prepare a contextual support request', action: () => { setContactOpen(true); } },
              { icon: Users, label: 'Add PASS reminder', sub: 'Fri 2:00 pm - Studio 2.13', action: addPassReminder },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={item.action}
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

function AcademicLessonCanvas({ onNotify, onAsk }: { onNotify: (message: string) => void; onAsk: (question: string) => void }) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-white px-5 py-4">
        <div>
          <p className="font-mono text-xs font-semibold uppercase text-slate-soft">Official lesson material</p>
          <h2 className="mt-1 font-display text-2xl font-bold text-ink">Slide 18 - Shear area creates moment change</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" onClick={() => onNotify('Previous lesson: Week 3 shear force diagrams.')}>
            <ArrowLeft size={14} /> Previous
          </Button>
          <Button variant="secondary" size="sm" onClick={() => onNotify('Next lesson preview: Week 5 design implications.')}>
            Next <ArrowRight size={14} />
          </Button>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="bg-paper-dim p-5 sm:p-7">
          <div className="rounded-[28px] border border-line bg-white p-5 shadow-sm sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-xs font-semibold text-slate-soft">{unit.code} - {unit.week} - Lecture Slides</p>
              <Badge tone="neutral">Slide 18</Badge>
            </div>
            <h3 className="mt-5 max-w-3xl font-display text-2xl font-bold leading-tight text-ink sm:text-3xl">
              Moment increases or decreases according to the signed area under the shear force diagram.
            </h3>
            <div className="mt-7 grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
              <div className="space-y-3">
                {[
                  ['Positive shear', 'Moment rises as distance increases.'],
                  ['Zero shear', 'A local maximum or minimum moment often occurs.'],
                  ['Negative shear', 'Moment falls as the signed area accumulates.'],
                ].map(([title, text]) => (
                  <div key={title} className="rounded-2xl border border-line bg-paper p-4">
                    <p className="text-sm font-bold text-ink">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-copy">{text}</p>
                  </div>
                ))}
              </div>
              <BeamDiagram />
            </div>
          </div>
        </div>

        <div className="border-t border-line bg-white p-5 lg:border-l lg:border-t-0">
          <p className="font-mono text-xs font-semibold uppercase text-slate-soft">Source context</p>
          <div className="mt-4 space-y-3">
            {[
              ['Primary source', 'Week 4 Lecture Slides, Slide 18'],
              ['Prerequisite', 'Week 3 Tutorial, Question 4'],
              ['Assessment link', 'Assignment 2 rubric: diagram construction'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-line bg-paper p-4">
                <p className="font-mono text-[10px] font-semibold uppercase text-slate-soft">{label}</p>
                <p className="mt-1 text-sm font-semibold leading-5 text-ink">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-2xl border border-success/20 bg-success-tint p-4">
            <div className="flex items-center gap-2 text-sm font-bold text-success">
              <ShieldCheck size={15} />
              Academic boundary
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-copy">
              AI guidance can explain and check reasoning, but the student's assessment work remains their responsibility.
            </p>
          </div>
          <div className="mt-4 rounded-2xl border border-companion/20 bg-companion-tint p-4">
            <div className="flex items-center gap-2 text-sm font-bold text-companion">
              <Brain size={15} />
              Explain this slide
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-copy">
              Ask a targeted prompt. Each response is deterministic and grounded in the current lesson.
            </p>
            <div className="mt-3 grid gap-2">
              {slidePromptActions.slice(0, 8).map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => onAsk(prompt)}
                  className="rounded-lg border border-companion/20 bg-white px-3 py-2 text-left text-xs font-bold text-ink transition hover:border-companion hover:text-companion"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-line bg-paper px-5 py-4">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-slate-soft">More prompts</p>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {slidePromptActions.slice(8).map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => onAsk(prompt)}
              className="premium-focus shrink-0 rounded-full border border-line bg-white px-3 py-2 text-xs font-bold text-slate-copy hover:border-companion hover:text-companion"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}

function BeamDiagram({ large = false }: { large?: boolean }) {
  return (
    <div className={cn('rounded-[22px] border border-line bg-white p-4 shadow-sm', large && 'p-5')}>
      <svg viewBox="0 0 520 260" role="img" aria-label="Beam shear and bending moment diagram" className="h-auto w-full">
        <rect x="20" y="20" width="480" height="220" rx="20" fill="#FAFAF8" />
        <line x1="70" y1="78" x2="450" y2="78" stroke="#15161A" strokeWidth="8" strokeLinecap="round" />
        <polygon points="82,92 62,132 102,132" fill="#9E1B32" opacity="0.9" />
        <polygon points="438,92 418,132 458,132" fill="#9E1B32" opacity="0.9" />
        <line x1="260" y1="38" x2="260" y2="78" stroke="#3454D1" strokeWidth="5" strokeLinecap="round" />
        <polygon points="260,86 246,62 274,62" fill="#3454D1" />
        <text x="272" y="55" fill="#3454D1" fontSize="14" fontWeight="700">12 kN load</text>
        <path d="M80 170 L260 122 L440 170" fill="none" stroke="#157F3C" strokeWidth="5" strokeLinecap="round" />
        <path d="M80 202 C170 144 350 144 440 202" fill="none" stroke="#3454D1" strokeWidth="5" strokeLinecap="round" />
        <circle cx="260" cy="122" r="7" fill="#3454D1" />
        <line x1="260" y1="122" x2="260" y2="214" stroke="#3454D1" strokeDasharray="6 6" />
        <text x="286" y="134" fill="#15161A" fontSize="13" fontWeight="700">zero shear / peak moment</text>
        <text x="82" y="160" fill="#157F3C" fontSize="13" fontWeight="700">shear trend</text>
        <text x="82" y="226" fill="#3454D1" fontSize="13" fontWeight="700">moment diagram</text>
      </svg>
    </div>
  );
}

/* Sub-components */

function AiTutorMessage({
  message,
  onFollowUp,
  onPin,
  streaming = false,
}: {
  message: Message;
  onFollowUp: (action: TutorAction | string) => void;
  onPin?: () => void;
  streaming?: boolean;
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
                Uncertain - human review recommended
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
                Lecturer support recommended
              </span>
            )}
            {onPin && (
              <button type="button" aria-label={message.pinned ? 'Unpin this answer' : 'Pin this answer'} aria-pressed={message.pinned} onClick={onPin} className="ml-auto grid h-7 w-7 place-items-center rounded-full text-slate-soft transition hover:bg-white hover:text-companion">
                <Bookmark size={13} fill={message.pinned ? 'currentColor' : 'none'} />
              </button>
            )}
          </div>

          <p>{message.text}{streaming && <span className="ml-1 inline-block h-4 w-1 animate-pulse bg-companion align-middle" aria-hidden="true" />}</p>

          {message.source && (
            <p className="mt-3 font-mono text-[11px] font-semibold text-companion">
              Source: {message.source}
            </p>
          )}
        </div>

        {/* Suggested follow-ups */}
        {message.followUps && message.followUps.length > 0 && (
          <div className="ml-1 flex flex-wrap gap-2">
            {message.followUps.map((followUp) => {
              const label = typeof followUp === 'string' ? followUp : followUp.label;
              return (
              <button
                key={label}
                type="button"
                onClick={() => onFollowUp(followUp)}
                className="rounded-full border border-companion/25 bg-companion-tint px-3 py-1 text-xs font-semibold text-companion transition hover:border-companion hover:bg-white"
              >
                {label}
              </button>
              );
            })}
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
        <span>Checking approved unit content...</span>
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
