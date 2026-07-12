import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Brain,
  CalendarClock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Download,
  ExternalLink,
  FileText,
  GraduationCap,
  Info,
  Lock,
  Megaphone,
  Play,
  Send,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ContactLecturerDialog from '../components/ContactLecturerDialog';
import { SupportEscalationActions, SupportRequestDialog } from '../components/SupportEscalationActions';
import {
  aiResponses,
  announcements,
  quickActions,
  slides,
  unit,
  unitTabs,
} from '../data/mockData';
import { Badge, Button, Card, ChatBubble, ConfidenceBadge, LoadingPill, Tabs, Toast } from '../components/ui';
import { buildTutorResponse, isConfusionEscalationIntent, type SupportEscalationId } from '../data/learningTutor';
import { cn } from '../utils/classNames';

type Message = { role: string; text: string; source?: string; supportEscalation?: boolean; supportSeed?: string };

export default function UnitPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Unit Materials');
  const [activeSlideIndex, setActiveSlideIndex] = useState(3);
  const [currentSlide, setCurrentSlide] = useState(18);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [showSupport, setShowSupport] = useState(false);
  const [toast, setToast] = useState('');
  const [contactOpen, setContactOpen] = useState(false);
  const [contactQuestion, setContactQuestion] = useState('');
  const [supportRequestType, setSupportRequestType] = useState<Exclude<SupportEscalationId, 'email'> | null>(null);
  const [supportRequestSeed, setSupportRequestSeed] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem('ailc-memory');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Message[];
        setMessages(parsed);
        setShowSupport(parsed.some((message) => message.supportEscalation));
      } catch {
        setMessages(getWelcomeMessage(user?.name));
      }
    } else {
      setMessages(getWelcomeMessage(user?.name));
    }
  }, [user?.name]);

  useEffect(() => {
    if (messages.length) {
      window.localStorage.setItem('ailc-memory', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  function notify(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  }

  function getWelcomeMessage(name?: string): Message[] {
    return [
      {
        role: 'ai',
        text: `Welcome ${name || 'back'}. I am ready to help with ${unit.topic}. Last time we discussed how shear force changes the bending moment diagram. Ask a question or use a quick action below.`,
        source: 'Week 4 Lecture, Slide 18',
      },
    ];
  }

  function ask(action: string) {
    const response = aiResponses[action] ?? aiResponses['Explain this slide'];
    setMessages((items) => [...items, { role: 'student', text: action }]);
    setLoading(true);
    setTimeout(() => {
      setMessages((items) => [
        ...items,
        { role: 'ai', text: response, source: 'Week 4 Lecture Slides, Slide 18' },
      ]);
      setLoading(false);
    }, 650);
  }

  function selectLectureWeek(index: number) {
    setActiveSlideIndex(index);
    setCurrentSlide(index === 3 ? 18 : index + 1);
  }

  function submitQuestion() {
    if (!question.trim()) return;
    const incoming = question;
    setQuestion('');
    if (isConfusionEscalationIntent(incoming)) {
      const response = buildTutorResponse(incoming);
      setShowSupport(true);
      setMessages((items) => [
        ...items,
        { role: 'student', text: incoming },
        {
          role: 'ai',
          text: response.text,
          source: response.source,
          supportEscalation: true,
          supportSeed: incoming,
        },
      ]);
      return;
    }
    const low = incoming.toLowerCase();
    if (low.includes('internet') || low.includes('answer')) {
      setMessages((items) => [
        ...items,
        { role: 'student', text: incoming },
        {
          role: 'ai',
          text: "I'm not confident enough to answer this using the approved unit materials. I recommend asking your lecturer or PASS facilitator — I have flagged this question for lecturer review.",
          source: 'Escalated to lecturer review queue',
        },
      ]);
      return;
    }
    ask('Explain this slide');
  }

  function handleSupportEscalation(id: SupportEscalationId, seed?: string) {
    const studentContext = seed?.trim() || `I am still confused about ${unit.topic}.`;
    setSupportRequestSeed(studentContext);
    if (id === 'email') {
      setContactQuestion(`I am still confused about ${unit.topic}, especially around Slide ${currentSlide}.\n\nWhat I asked the AI Companion:\n${studentContext}\n\nCould you please help me understand where my reasoning is breaking down?`);
      setContactOpen(true);
      return;
    }
    setSupportRequestType(id);
  }

  return (
    <div className="animate-page mx-auto max-w-7xl px-5 py-6 sm:px-8">
      {toast && <Toast message={toast} />}
      <ContactLecturerDialog
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        unitCode={unit.code}
        unitTitle={unit.name}
        context={`${unit.week} ${unit.topic}`}
        defaultSubject={`${unit.code}: Question about ${unit.topic}`}
        defaultMessage={contactQuestion}
      />
      <SupportRequestDialog
        open={Boolean(supportRequestType)}
        type={supportRequestType}
        onClose={() => setSupportRequestType(null)}
        unitCode={unit.code}
        unitTitle={unit.name}
        context={`${unit.week} ${unit.topic} - Slide ${currentSlide}`}
        studentMessage={supportRequestSeed}
      />

      {/* ── Course identity header ── */}
      <div className="mb-5 overflow-hidden rounded-[24px] border border-line bg-white shadow-sm">
        {/* Course image strip */}
        <div className="relative h-24 border-b border-companion/30 bg-night sm:h-28">
          <div className="absolute left-5 top-4 flex items-center gap-2 sm:left-6">
            <span className="rounded-full border border-white/12 bg-white/10 px-3 py-1 font-mono text-xs font-bold text-white">
              {unit.code}
            </span>
            <span className="rounded-full border border-white/12 bg-white/10 px-3 py-1 font-mono text-xs font-semibold text-white/80">
              Semester 2, 2026
            </span>
          </div>
          <div className="absolute bottom-4 right-5 flex items-center gap-2 sm:right-6">
            <ConfidenceBadge />
          </div>
        </div>

        {/* Course meta */}
        <div className="px-5 py-4 sm:px-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              {/* Breadcrumb */}
              <nav aria-label="Breadcrumb" className="mb-2 flex flex-wrap items-center gap-1.5">
                <Link to="/courses" className="font-mono text-xs font-semibold text-slate-soft hover:text-companion">
                  Courses
                </Link>
                <span className="text-xs text-slate-soft">/</span>
                <span className="font-mono text-xs font-semibold text-ink">{unit.code}</span>
              </nav>
              <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">{unit.name}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 text-sm text-slate-copy">
                  <GraduationCap size={15} className="text-slate-soft" />
                  Dr Avery Tan
                </div>
                <div className="flex items-center gap-1.5 text-sm text-slate-copy">
                  <CalendarClock size={15} className="text-slate-soft" />
                  {unit.week} — {unit.topic}
                </div>
                <div className="flex items-center gap-1.5 text-sm text-slate-copy">
                  <TrendingUp size={15} className="text-success" />
                  <span className="font-semibold text-success">68% progress</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button to="/demo/assessment" variant="secondary" size="sm">
                <ClipboardList size={14} />
                Assignments
              </Button>
              <Button to="/demo/learn" variant="ai" size="sm">
                <Brain size={14} />
                AI Tutor
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setContactOpen(true)}>
                <GraduationCap size={14} />
                Contact lecturer
              </Button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="mb-1.5 flex justify-between text-xs font-semibold">
              <span className="text-slate-copy">Course progress</span>
              <span className="text-ink">68%</span>
            </div>
            <div className="h-2 rounded-full bg-paper-dim">
              <div className="h-2 rounded-full bg-companion" style={{ width: '68%' }} />
            </div>
          </div>

          <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_320px]">
            <div className="rounded-2xl border border-line bg-paper p-4">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-companion">Next learning action</p>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-display text-lg font-bold text-ink">Continue Week 4: Bending Moment Diagrams</p>
                  <p className="mt-1 text-sm leading-6 text-slate-copy">Resume the current lesson and connect shear area to moment change.</p>
                </div>
                <Button to="/demo/learn" size="sm">Continue learning <ArrowRight size={14} /></Button>
              </div>
            </div>
            <div className="rounded-2xl border border-line bg-paper p-4">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-cardinal">Upcoming assessment</p>
              <p className="mt-2 font-display text-lg font-bold text-ink">Draft design reflection</p>
              <p className="mt-1 text-sm leading-6 text-slate-copy">20% weighting. Draft due Monday 9 am.</p>
              <Button to="/demo/assessment" variant="secondary" size="sm" className="mt-3">Open assessment</Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-5">
            <Tabs items={unitTabs} active={activeTab} onChange={setActiveTab} label="Unit sections" />
          </div>
        </div>
      </div>

      {/* ── Tab content ── */}
      {activeTab === 'Unit Materials' && (
        <UnitMaterialsTab
          slides={slides}
          activeSlideIndex={activeSlideIndex}
          currentSlide={currentSlide}
          messages={messages}
          loading={loading}
          showSupport={showSupport}
          question={question}
          setQuestion={setQuestion}
          onSelectWeek={selectLectureWeek}
          onAsk={ask}
          onSubmitQuestion={submitQuestion}
          onSupportAction={handleSupportEscalation}
          chatEndRef={chatEndRef}
          onSetCurrentSlide={setCurrentSlide}
          onNotify={notify}
        />
      )}
      {activeTab === 'Overview' && <OverviewTab onNotify={notify} />}
      {activeTab === 'Assessments' && <AssessmentsTab />}
      {activeTab === 'Announcements' && <AnnouncementsTab />}
      {activeTab === 'Resources' && <ResourcesTab onNotify={notify} />}
    </div>
  );
}

/* ── Unit Materials Tab ── */

function UnitMaterialsTab({
  slides: slideList,
  activeSlideIndex,
  currentSlide,
  messages,
  loading,
  showSupport,
  question,
  setQuestion,
  onSelectWeek,
  onAsk,
  onSubmitQuestion,
  onSupportAction,
  chatEndRef,
  onSetCurrentSlide,
  onNotify,
}: {
  slides: typeof import('../data/mockData').slides;
  activeSlideIndex: number;
  currentSlide: number;
  messages: Message[];
  loading: boolean;
  showSupport: boolean;
  question: string;
  setQuestion: (v: string) => void;
  onSelectWeek: (index: number) => void;
  onAsk: (action: string) => void;
  onSubmitQuestion: () => void;
  onSupportAction: (id: SupportEscalationId, seed?: string) => void;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
  onSetCurrentSlide: React.Dispatch<React.SetStateAction<number>>;
  onNotify: (msg: string) => void;
}) {
  return (
    <div className="grid gap-5 xl:grid-cols-[220px_1fr_340px]">
      {/* Week selector */}
      <Card className="h-fit">
        <p className="mb-4 font-mono text-xs font-semibold uppercase text-slate-soft">Lecture weeks</p>
        <div className="space-y-2">
          {slideList.map((slide, index) => {
            const isActive = activeSlideIndex === index;
            const statusColor =
              slide.status === 'Complete'
                ? 'text-success'
                : slide.status === 'Current'
                ? 'text-companion'
                : slide.status === 'Next'
                ? 'text-warn'
                : 'text-slate-soft';
            return (
              <button
                key={slide.title}
                type="button"
                aria-pressed={isActive}
                onClick={() => onSelectWeek(index)}
                className={cn(
                  'w-full rounded-xl border px-3 py-3 text-left text-sm transition',
                  isActive
                    ? 'border-cardinal bg-cardinal-tint text-cardinal'
                    : 'border-line hover:border-companion hover:bg-companion-tint',
                )}
              >
                <span className="block font-semibold text-ink">
                  {isActive ? slide.title : slide.title}
                </span>
                <span className={cn('mt-1 block text-xs font-semibold', isActive ? 'text-cardinal' : statusColor)}>
                  {isActive ? '● Selected' : slide.status}
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Slide viewer */}
      <section>
        <Card className="overflow-hidden p-0">
          {/* Slide header */}
          <div className="border-b border-line bg-white px-5 py-4">
            <p className="font-mono text-xs font-semibold uppercase text-companion">
              {unit.week} · Lecture Slides · Slide {currentSlide}
            </p>
            <h2 className="mt-1 font-display text-xl font-bold text-ink sm:text-2xl">{unit.topic}</h2>
          </div>

          {/* Slide content */}
          <div className="grid min-h-[480px] place-items-center bg-paper-dim p-5 sm:p-8">
            <div className="w-full max-w-3xl rounded-[24px] bg-white p-7 shadow-sm">
              <div className="mb-1 flex items-center justify-between">
                <p className="font-mono text-xs font-semibold text-slate-soft">
                  {unit.code} · {unit.week}
                </p>
                <p className="font-mono text-xs font-semibold text-slate-soft">Slide {currentSlide}</p>
              </div>
              <h3 className="mt-5 font-display text-2xl font-bold leading-tight text-ink sm:text-3xl">
                Moment changes according to the area under the shear force diagram.
              </h3>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-line bg-paper p-5">
                  <p className="font-mono text-xs font-semibold uppercase text-slate-soft">Key idea</p>
                  <p className="mt-3 text-sm leading-6 text-slate-copy">
                    Positive shear increases moment. Negative shear decreases moment. A zero-shear
                    point often marks a maximum or minimum moment.
                  </p>
                </div>
                <div className="rounded-xl border border-companion/25 bg-companion-tint p-5">
                  <p className="flex items-center gap-2 font-mono text-xs font-semibold uppercase text-companion">
                    <Sparkles size={12} /> AI Companion
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-copy">
                    This slide is indexed for grounded explanations, worked examples, quizzes, and
                    lecturer escalation.
                  </p>
                </div>
              </div>
              {/* Diagram placeholder */}
              <div className="mt-6 flex h-28 items-center justify-center rounded-xl border border-dashed border-companion/30 bg-paper">
                <p className="font-mono text-xs font-semibold text-slate-soft">
                  Shear / Moment diagram
                </p>
              </div>
            </div>
          </div>

          {/* Slide controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-white px-5 py-4">
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onSetCurrentSlide((s) => Math.max(1, s - 1))}
              >
                <ChevronLeft size={15} /> Prev
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onSetCurrentSlide((s) => s + 1)}
              >
                Next <ChevronRight size={15} />
              </Button>
            </div>
            <Button to="/demo/learn">
              <Brain size={15} /> Open AI Tutor
            </Button>
          </div>
        </Card>
      </section>

      {/* AI Companion panel */}
      <Card className="h-fit border-companion/25 bg-white">
        {/* Panel header */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-companion/20 bg-white text-companion shadow-sm">
              <Brain size={15} />
            </div>
            <h2 className="font-display text-base font-bold text-ink">AI Companion</h2>
          </div>
          <ConfidenceBadge />
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-2">
          {quickActions.slice(0, 6).map((action) => (
            <button
              key={action}
              type="button"
              onClick={() => onAsk(action)}
              className="rounded-xl border border-white/80 bg-white/85 px-3 py-2.5 text-left text-xs font-semibold text-ink transition hover:border-companion hover:bg-white"
            >
              {action}
            </button>
          ))}
        </div>

        {/* Chat area */}
        <div className="mt-4 max-h-[300px] space-y-3 overflow-y-auto rounded-xl bg-white/70 p-3">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className="space-y-3">
              <ChatBubble {...message} />
              {message.supportEscalation && (
                <SupportEscalationActions onSelect={(id) => onSupportAction(id, message.supportSeed)} />
              )}
            </div>
          ))}
          {loading && <LoadingPill label="Searching approved unit material" />}
          <div ref={chatEndRef} />
        </div>

        {/* Further learning options */}
        <div className="mt-4 rounded-xl border border-companion/20 bg-white/80 p-3">
          <p className="flex items-center gap-2 font-mono text-[10px] font-semibold uppercase text-companion">
            <Sparkles size={12} /> Further learning options
          </p>
          {!showSupport ? (
            <p className="mt-2 text-xs leading-5 text-slate-copy">
              These appear when you tell the companion you are still confused or still do not
              understand the topic.
            </p>
          ) : (
            <div className="mt-2 grid gap-2">
              <SupportEscalationActions onSelect={(id) => onSupportAction(id, 'I am still confused about the shear-to-moment relationship.')} />
              <div className="rounded-lg bg-companion-tint px-3 py-2 text-xs leading-5 text-slate-copy">
                Bring: "Can you check my shear-to-moment link?", "Where should maximum moment
                occur?", and "How can I explain this without an assessment answer?"
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="mt-4 flex gap-2 rounded-full border border-companion/20 bg-white/90 p-2">
          <input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && onSubmitQuestion()}
            className="min-w-0 flex-1 bg-transparent px-2 text-sm text-ink placeholder:text-slate-soft outline-none"
            placeholder="Ask about this slide…"
            aria-label="Ask a question about this slide"
          />
          <button
            type="button"
            onClick={onSubmitQuestion}
            aria-label="Send slide question"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-companion text-white hover:bg-companion/90 transition"
          >
            <Send size={14} />
          </button>
        </div>
      </Card>
    </div>
  );
}

/* ── Overview Tab ── */

function OverviewTab({ onNotify }: { onNotify: (msg: string) => void }) {
  const objectives = [
    'Construct bending moment diagrams from shear force data',
    'Identify maximum moment location using zero-shear principle',
    'Link moment demand to structural design implications',
    'Explain shear-to-moment derivation using equilibrium',
  ];

  const moduleMap = [
    { week: 'Week 1', title: 'Loads and supports', status: 'complete' },
    { week: 'Week 2', title: 'Equilibrium review', status: 'complete' },
    { week: 'Week 3', title: 'Shear force diagrams', status: 'complete' },
    { week: 'Week 4', title: 'Bending moment diagrams', status: 'current' },
    { week: 'Week 5', title: 'Design implications', status: 'next' },
  ];

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
      <div className="space-y-5">
        {/* Module map */}
        <Card>
          <p className="font-mono text-xs font-semibold uppercase text-slate-soft">Module map</p>
          <h3 className="mt-2 font-display text-xl font-bold">Unit structure</h3>
          <div className="mt-5 space-y-2">
            {moduleMap.map((mod) => {
              const isComplete = mod.status === 'complete';
              const isCurrent = mod.status === 'current';
              const isNext = mod.status === 'next';
              const content = (
                <>
                  {isComplete && <CheckCircle2 size={18} className="shrink-0 text-success" />}
                  {isCurrent && <Play size={18} className="shrink-0 text-companion" />}
                  {isNext && <Lock size={18} className="shrink-0 text-slate-soft" />}
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-xs font-semibold text-slate-soft">{mod.week}</p>
                    <p className="mt-0.5 font-semibold text-ink">{mod.title}</p>
                  </div>
                  {isComplete && (
                    <span className="rounded-full bg-success-tint px-2.5 py-0.5 font-mono text-[10px] font-bold text-success border border-success/20">
                      Complete
                    </span>
                  )}
                  {isCurrent && (
                    <span className="rounded-full bg-companion-tint px-2.5 py-0.5 font-mono text-[10px] font-bold text-companion border border-companion/20">
                      In progress
                    </span>
                  )}
                </>
              );
              if (isNext) {
                return (
                  <button
                    key={mod.week}
                    type="button"
                    onClick={() => onNotify(`${mod.week}: ${mod.title} — not yet unlocked. Complete Week 4 to continue.`)}
                    className={cn(
                      'flex w-full items-center gap-4 rounded-xl border p-4 text-left transition',
                      'border-line bg-paper hover:border-slate-soft',
                    )}
                  >
                    {content}
                  </button>
                );
              }
              return (
                <Link
                  key={mod.week}
                  to="/demo"
                  className={cn(
                    'flex items-center gap-4 rounded-xl border p-4 transition',
                    isComplete && 'border-success/20 bg-success-tint hover:border-success/40',
                    isCurrent && 'border-companion/25 bg-companion-tint hover:border-companion/50',
                  )}
                >
                  {content}
                </Link>
              );
            })}
          </div>
        </Card>

        {/* Learning objectives */}
        <Card>
          <p className="font-mono text-xs font-semibold uppercase text-slate-soft">Learning objectives</p>
          <h3 className="mt-2 font-display text-xl font-bold">Week 4 outcomes</h3>
          <div className="mt-5 space-y-3">
            {objectives.map((obj, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-companion-tint font-mono text-xs font-bold text-companion">
                  {i + 1}
                </span>
                <p className="text-sm leading-6 text-slate-copy">{obj}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="space-y-5">
        {/* Next action */}
        <Card className="border-cardinal/20 bg-cardinal-tint">
          <Badge tone="danger">Due Monday 9 am</Badge>
          <h3 className="mt-3 font-display text-lg font-bold">Draft design reflection</h3>
          <p className="mt-2 text-sm leading-6 text-slate-copy">
            Upload your draft to receive AI formative feedback before final submission Friday 5 pm.
          </p>
          <div className="mt-4">
            <Button to="/demo/assessment" variant="primary">
              Open assessment <ArrowRight size={15} />
            </Button>
          </div>
        </Card>

        {/* AI availability */}
        <Card className="border-companion/25 bg-companion-tint">
          <div className="flex items-center gap-2">
            <Brain size={18} className="text-companion" />
            <p className="font-display text-base font-bold">AI Tutor available</p>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-copy">
            The AI Tutor is indexed on Week 4 lecture slides and can help explain bending moment
            diagrams, check your reasoning, and prepare support questions.
          </p>
          <div className="mt-4">
            <Button to="/demo/learn" variant="ai">
              <Sparkles size={15} /> Open AI Tutor
            </Button>
          </div>
        </Card>

        {/* Unit info */}
        <Card>
          <p className="font-mono text-xs font-semibold uppercase text-slate-soft">Unit info</p>
          <div className="mt-4 space-y-3">
            {[
              ['Unit code', unit.code],
              ['Lecturer', 'Dr Avery Tan'],
              ['Term', 'Semester 2, 2026'],
              ['Campus', 'Bentley · Engineering Building'],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-soft">{label}</p>
                <p className="text-sm font-semibold text-ink">{value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ── Assessments Tab ── */

function AssessmentsTab() {
  const assessments = [
    {
      code: 'A1',
      title: 'Shear force analysis',
      type: 'Report',
      weight: '15%',
      due: 'Submitted — Week 3',
      status: 'submitted',
    },
    {
      code: 'A2',
      title: 'Draft design reflection',
      type: 'Reflection',
      weight: '20%',
      due: 'Draft due Mon 9 am · Final due Fri 5 pm',
      status: 'open',
    },
    {
      code: 'A3',
      title: 'Final structural analysis report',
      type: 'Report',
      weight: '40%',
      due: 'Opens Week 8',
      status: 'upcoming',
    },
    {
      code: 'Q1-5',
      title: 'Online quizzes',
      type: 'Quiz',
      weight: '15%',
      due: 'Weekly · Quiz 5 opens Wednesday',
      status: 'open',
    },
    {
      code: 'EX',
      title: 'Final examination',
      type: 'Exam',
      weight: '10%',
      due: 'Examination period',
      status: 'upcoming',
    },
  ];

  return (
    <div className="space-y-5">
      <div className="grid gap-4">
        {assessments.map((a) => (
          <div
            key={a.code}
            className={cn(
              'rounded-2xl border p-5',
              a.status === 'submitted' && 'border-success/20 bg-success-tint',
              a.status === 'open' && 'border-line bg-white shadow-sm',
              a.status === 'upcoming' && 'border-line bg-paper',
            )}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-mono text-xs font-bold',
                    a.status === 'submitted' && 'bg-success-tint text-success',
                    a.status === 'open' && 'bg-companion-tint text-companion',
                    a.status === 'upcoming' && 'bg-paper-dim text-slate-soft',
                  )}
                >
                  {a.code}
                </div>
                <div>
                  <p className="font-display text-lg font-bold text-ink">{a.title}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-line bg-paper px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-copy">
                      {a.type}
                    </span>
                    <span className="rounded-full border border-line bg-paper px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-copy">
                      {a.weight}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-copy">{a.due}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {a.status === 'submitted' && (
                  <span className="flex items-center gap-1.5 rounded-full bg-success-tint px-3 py-1 font-mono text-xs font-bold text-success border border-success/20">
                    <CheckCircle2 size={13} /> Submitted
                  </span>
                )}
                {a.status === 'open' && a.code !== 'Q1-5' && (
                  <Button to="/demo/assessment" variant="primary" size="sm">
                    Open
                  </Button>
                )}
                {a.status === 'open' && a.code === 'Q1-5' && (
                  <QuizPlaceholderButton />
                )}
                {a.status === 'upcoming' && (
                  <span className="rounded-full border border-line bg-paper px-3 py-1 font-mono text-xs font-semibold text-slate-soft">
                    Upcoming
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuizPlaceholderButton() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <Button variant="secondary" size="sm" onClick={() => setOpen((v) => !v)}>
        <Info size={13} /> Quiz info
      </Button>
      {open && (
        <div className="absolute right-0 top-11 z-10 w-72 rounded-2xl border border-line bg-white p-4 shadow-xl">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-companion-tint text-companion">
              <Sparkles size={16} />
            </div>
            <div>
              <p className="font-display text-sm font-bold">Online quiz schedule</p>
              <p className="mt-1 text-xs leading-5 text-slate-copy">
                Quiz 5 opens Wednesday. This panel shows the official timing only; the quiz itself is not opened from this local demo.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-3 text-xs font-semibold text-companion hover:underline"
          >
            Got it
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Announcements Tab ── */

function AnnouncementsTab() {
  const announcementDetails = [
    { text: announcements[0], type: 'Logistics', date: '8 Jul 2026', icon: Info },
    { text: announcements[1], type: 'Study support', date: '8 Jul 2026', icon: AlertCircle },
    { text: announcements[2], type: 'Assessment', date: '6 Jul 2026', icon: ClipboardList },
  ];

  return (
    <div className="space-y-4">
      {announcementDetails.map((item, i) => (
        <div
          key={i}
          className="flex items-start gap-4 rounded-2xl border border-line bg-white p-5 shadow-sm"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cardinal-tint text-cardinal">
            <Megaphone size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-line bg-paper px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-copy">
                {item.type}
              </span>
              <span className="font-mono text-[10px] text-slate-soft">{item.date}</span>
            </div>
            <p className="mt-2 font-semibold text-ink">{item.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Resources Tab ── */

function ResourcesTab({ onNotify }: { onNotify: (msg: string) => void }) {
  const resources = [
    {
      title: 'PASS timetable',
      sub: 'Fri 2:00 pm · Engineering Studio 2.13',
      icon: Play,
      tone: 'success' as const,
      action: 'Download',
    },
    {
      title: 'Week 4 worked examples',
      sub: 'Bending moment diagrams · PDF · 14 slides',
      icon: FileText,
      tone: 'companion' as const,
      action: 'Open',
    },
    {
      title: 'Discussion board',
      sub: 'Week 4 thread · 12 student posts',
      icon: BookOpen,
      tone: 'companion' as const,
      action: 'View',
    },
    {
      title: 'Week 3 shear recap',
      sub: 'Prerequisite · Tutorial question set',
      icon: FileText,
      tone: 'slate' as const,
      action: 'Open',
    },
  ];

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {resources.map((res) => (
          <div
            key={res.title}
            className="flex flex-col rounded-2xl border border-line bg-white p-5 shadow-sm"
          >
            <div
              className={cn(
                'mb-4 flex h-10 w-10 items-center justify-center rounded-xl',
                res.tone === 'success' && 'bg-success-tint text-success',
                res.tone === 'companion' && 'bg-companion-tint text-companion',
                res.tone === 'slate' && 'bg-paper-dim text-slate-copy',
              )}
            >
              <res.icon size={18} />
            </div>
            <h3 className="font-display text-lg font-bold text-ink">{res.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-6 text-slate-copy">{res.sub}</p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => onNotify(`${res.title} — ${res.action} is available from the full LMS resource library.`)}
                className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ink hover:border-companion hover:text-companion transition"
              >
                {res.action === 'Download' ? <Download size={12} /> : <ExternalLink size={12} />}
                {res.action}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-companion/20 bg-companion-tint p-5">
        <div className="flex items-center gap-2">
          <Brain size={18} className="text-companion" />
          <p className="font-display text-base font-bold text-ink">AI Tutor can help you use these resources</p>
        </div>
        <p className="mt-2 text-sm leading-6 text-slate-copy">
          The AI Tutor is indexed on the above materials and can guide you through worked examples, suggest practice questions, and prepare questions for PASS or tutorial sessions.
        </p>
        <div className="mt-4">
          <Button to="/demo/learn" variant="ai" size="sm">
            <Sparkles size={14} /> Open full AI Tutor workspace
          </Button>
        </div>
      </div>
    </div>
  );
}
