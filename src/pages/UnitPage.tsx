import { ChevronLeft, ChevronRight, FileText, Megaphone, Play, Send, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { aiResponses, announcements, quickActions, slides, supportPathways, unit, unitTabs } from '../data/mockData';
import { Button, Card, ChatBubble, ConfidenceBadge, LoadingPill } from '../components/ui';

type Message = { role: string; text: string; source?: string };

export default function UnitPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Unit Materials');
  const [currentSlide, setCurrentSlide] = useState(18);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [showSupport, setShowSupport] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem('ailc-memory');
    if (stored) {
      setMessages(JSON.parse(stored) as Message[]);
    } else {
      setMessages([
        {
          role: 'ai',
          text: `Welcome ${user?.name || 'back'}. I am ready to help with ${unit.topic}. Last time we discussed how shear force changes the bending moment diagram.`,
          source: 'Week 4 Lecture, Slide 18',
        },
      ]);
    }
  }, [user?.name]);

  useEffect(() => {
    if (messages.length) {
      window.localStorage.setItem('ailc-memory', JSON.stringify(messages));
    }
  }, [messages]);

  function ask(action: string) {
    const response = aiResponses[action] || aiResponses['Explain this slide'];
    setMessages((items) => [...items, { role: 'student', text: action }]);
    setLoading(true);
    setTimeout(() => {
      setMessages((items) => [...items, { role: 'ai', text: response, source: 'Week 4 Lecture Slides, Slide 18' }]);
      setLoading(false);
    }, 650);
  }

  function submitQuestion() {
    if (!question.trim()) return;
    const incoming = question;
    const low = incoming.toLowerCase();
    setQuestion('');
    if (low.includes('still confused') || low.includes("still don't understand") || low.includes('still do not understand') || low.includes('still stuck') || low.includes('confused')) {
      setShowSupport(true);
      setMessages((items) => [
        ...items,
        { role: 'student', text: incoming },
        {
          role: 'ai',
          text:
            'Thanks for telling me. Since this is still unclear, I recommend moving into a support stream: group discussion to compare reasoning, 1 on 1 mentoring for study strategy, or a lecturer catch-up if the issue is about assessment expectations. Bring these questions: where does shear become moment, how do I identify maximum moment, and how can I explain my reasoning without getting an assessment answer?',
          source: 'Week 4 Lecture Slides, Slide 18',
        },
      ]);
      return;
    }
    if (low.includes('internet') || low.includes('answer')) {
      setMessages((items) => [
        ...items,
        { role: 'student', text: incoming },
        {
          role: 'ai',
          text: "I'm not confident enough to answer this using the approved unit materials. I recommend asking your lecturer or PASS facilitator, and I have flagged this question for lecturer review.",
          source: 'Escalated to lecturer review queue',
        },
      ]);
      return;
    }
    ask('Explain this slide');
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
      <div className="mb-5 rounded-[28px] border border-line bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs font-semibold uppercase text-slate-soft">Course content</p>
            <h2 className="mt-1 font-display text-3xl font-bold">{unit.name}</h2>
            <p className="mt-2 text-slate-copy">A familiar Blackboard unit page with AI assistance embedded directly into materials and assessments.</p>
          </div>
          <ConfidenceBadge />
        </div>
        <div className="mt-5 flex gap-2 overflow-x-auto">
          {unitTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition ${activeTab === tab ? 'bg-ink text-white' : 'border border-line bg-white text-slate-copy hover:border-companion'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'Unit Materials' && (
        <div className="grid gap-5 xl:grid-cols-[250px_1fr_360px]">
          <Card className="h-fit">
            <p className="mb-4 font-mono text-xs font-semibold uppercase text-slate-soft">Lecture weeks</p>
            <div className="space-y-2">
              {slides.map((slide) => (
                <button
                  key={slide.title}
                  className={`w-full rounded-2xl border px-3 py-3 text-left text-sm transition ${slide.status === 'Current' ? 'border-cardinal bg-cardinal-tint text-cardinal' : 'border-line hover:bg-paper'}`}
                >
                  <span className="font-semibold">{slide.title}</span>
                  <span className="mt-1 block text-xs text-slate-copy">{slide.status}</span>
                </button>
              ))}
            </div>
          </Card>

          <section>
            <Card className="overflow-hidden p-0">
              <div className="border-b border-line bg-white px-5 py-4">
                <p className="font-mono text-xs font-semibold uppercase text-companion">{unit.week} / Lecture Slides / Slide {currentSlide}</p>
                <h2 className="mt-1 font-display text-2xl font-bold">{unit.topic}</h2>
              </div>
              <div className="grid min-h-[510px] place-items-center bg-paper-dim p-6">
                <div className="w-full max-w-3xl rounded-[28px] bg-white p-8 shadow-sm">
                  <p className="font-mono text-xs font-semibold text-slate-soft">MOCK PDF VIEWER</p>
                  <h3 className="mt-5 font-display text-3xl font-bold">Moment changes according to the area under the shear force diagram.</h3>
                  <div className="mt-8 grid gap-5 md:grid-cols-2">
                    <div className="rounded-2xl border border-line p-5">
                      <p className="text-sm font-bold">Key idea</p>
                      <p className="mt-2 text-sm leading-6 text-slate-copy">Positive shear increases moment. Negative shear decreases moment. A zero shear point often marks a maximum or minimum moment.</p>
                    </div>
                    <div className="rounded-2xl border border-companion/25 bg-gradient-to-br from-companion-tint to-white p-5 shadow-[0_0_30px_rgba(52,84,209,0.12)]">
                      <p className="flex items-center gap-2 text-sm font-bold text-companion"><Sparkles size={16} /> AI Companion available</p>
                      <p className="mt-2 text-sm leading-6 text-slate-copy">This slide is indexed for grounded explanations, scenarios, quizzes, and lecturer escalation.</p>
                    </div>
                  </div>
                  <div className="mt-8 h-28 rounded-2xl border border-dashed border-companion/40 bg-gradient-to-r from-white via-companion-tint to-[#f3e8ff]" />
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-4">
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => setCurrentSlide((s) => Math.max(1, s - 1))}><ChevronLeft size={16} />Prev</Button>
                  <Button variant="secondary" onClick={() => setCurrentSlide((s) => s + 1)}>Next<ChevronRight size={16} /></Button>
                </div>
                <Button onClick={() => ask('Explain this slide')}>Ask AI Learning Companion</Button>
              </div>
            </Card>
          </section>

          <Card className="h-fit border-companion/25 bg-gradient-to-br from-white to-companion-tint/70 shadow-[0_0_36px_rgba(52,84,209,0.12)]">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold"><Sparkles className="text-companion" size={18} /> AI Companion</h2>
              <ConfidenceBadge />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => (
                <button key={action} onClick={() => ask(action)} className="rounded-2xl border border-white bg-white/85 px-3 py-3 text-left text-xs font-semibold transition hover:border-companion hover:bg-white">
                  {action}
                </button>
              ))}
            </div>
            <div className="mt-5 max-h-[360px] space-y-3 overflow-y-auto rounded-2xl bg-white/70 p-3">
              {messages.map((message, index) => <ChatBubble key={`${message.text}-${index}`} {...message} />)}
              {loading && <LoadingPill label="Searching lecturer-approved unit material" />}
            </div>
            <div className="mt-4 rounded-2xl border border-companion/20 bg-white/80 p-3">
              <p className="flex items-center gap-2 text-xs font-bold uppercase text-companion"><Sparkles size={14} /> Further learning options</p>
              {!showSupport ? (
                <p className="mt-2 text-xs leading-5 text-slate-copy">
                  These appear when you tell the companion you are still confused or still do not understand the topic.
                </p>
              ) : (
                <div className="mt-3 grid gap-2">
                  {supportPathways.slice(0, 3).map((support) => (
                    <button key={support.name} onClick={() => ask('Prepare support questions for me')} className="rounded-xl bg-paper px-3 py-2 text-left text-xs font-semibold hover:bg-companion-tint">
                      {support.name}
                      <span className="block pt-1 font-normal leading-4 text-slate-copy">{support.detail}</span>
                    </button>
                  ))}
                  <div className="rounded-xl bg-companion-tint px-3 py-2 text-xs leading-5 text-slate-copy">
                    Bring: "Can you check my shear-to-moment link?", "Where should maximum moment occur?", and "How can I explain this without an assessment answer?"
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4 flex gap-2 rounded-full border border-line bg-white p-2">
              <input value={question} onChange={(event) => setQuestion(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && submitQuestion()} className="min-w-0 flex-1 px-2 text-sm" placeholder="Ask about this slide" />
              <button onClick={submitQuestion} className="rounded-full bg-companion p-2 text-white"><Send size={16} /></button>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'Overview' && <OverviewTab />}
      {activeTab === 'Assessments' && <AssessmentsTab />}
      {activeTab === 'Announcements' && <AnnouncementsTab />}
      {activeTab === 'Resources' && <ResourcesTab />}
    </div>
  );
}

function OverviewTab() {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {['Week 4 focus: bending moment diagrams', 'AI remembers previous learning', 'Lecturer-approved answers only'].map((item) => (
        <Card key={item}>
          <h3 className="font-display text-xl font-bold">{item}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-copy">Students keep using the LMS normally while contextual intelligence appears beside the content they already rely on.</p>
        </Card>
      ))}
    </div>
  );
}

function AssessmentsTab() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <Card>
        <FileText className="mb-4 text-companion" />
        <h3 className="font-display text-xl font-bold">Draft design reflection</h3>
        <p className="mt-2 text-sm text-slate-copy">AI formative feedback is open until Monday 9 am.</p>
        <div className="mt-5"><Button to="/demo/assessment">Open assessment submission</Button></div>
      </Card>
      <Card>
        <FileText className="mb-4 text-cardinal" />
        <h3 className="font-display text-xl font-bold">Final structural analysis report</h3>
        <p className="mt-2 text-sm text-slate-copy">Final submission closes Friday 5 pm. No AI discussion after final upload.</p>
      </Card>
    </div>
  );
}

function AnnouncementsTab() {
  return (
    <div className="grid gap-4">
      {announcements.map((item) => (
        <Card key={item} className="flex items-center gap-4">
          <Megaphone className="text-cardinal" />
          <p className="font-semibold">{item}</p>
        </Card>
      ))}
    </div>
  );
}

function ResourcesTab() {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {['PASS timetable', 'Worked examples', 'Discussion board'].map((item, index) => (
        <Card key={item}>
          {index === 0 ? <Play className="mb-4 text-success" /> : <BookIcon />}
          <h3 className="font-display text-xl font-bold">{item}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-copy">Available inside the unit. The AI can recommend these supports but does not create new official services.</p>
        </Card>
      ))}
      <Link to="/demo/learn" className="font-semibold text-companion">Open full Learning Mode</Link>
    </div>
  );
}

function BookIcon() {
  return <FileText className="mb-4 text-companion" />;
}
