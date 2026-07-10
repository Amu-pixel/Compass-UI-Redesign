import { BarChart3, BookOpenCheck, HelpCircle, Inbox, Lightbulb, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { analytics, connectors, dashboardQuestions, lecturerInbox, misunderstoodTopics, teachingActions } from '../data/mockData';
import { Button, Card, ConfidenceBadge, Toast } from '../components/ui';

type DashboardSection = 'overview' | 'statistics' | 'topics' | 'questions' | 'recommendations' | 'report' | 'setup' | 'queue';

const sections: Array<{ id: DashboardSection; title: string; detail: string; icon: typeof BarChart3 }> = [
  { id: 'overview', title: 'Overview', detail: 'This week at a glance', icon: TrendingUp },
  { id: 'statistics', title: 'Statistics', detail: 'Usage, confidence, quiz trends', icon: BarChart3 },
  { id: 'topics', title: 'Misunderstood topics', detail: 'Where students are stuck', icon: HelpCircle },
  { id: 'questions', title: 'Common questions', detail: 'Frequently asked by cohort', icon: Inbox },
  { id: 'recommendations', title: 'Teaching actions', detail: 'AI-suggested interventions', icon: Lightbulb },
  { id: 'report', title: 'Weekly report', detail: 'Summary for teaching review', icon: BookOpenCheck },
  { id: 'setup', title: 'Unit setup', detail: 'Connected materials and maturity', icon: BookOpenCheck },
  { id: 'queue', title: 'Review queue', detail: 'Low-confidence AI questions', icon: Inbox },
];

export default function DashboardPage({ initialTab = 'overview' }: { initialTab?: DashboardSection | 'analytics' }) {
  const [active, setActive] = useState<DashboardSection>(initialTab === 'analytics' ? 'overview' : initialTab);
  const [toast, setToast] = useState('');
  const [editing, setEditing] = useState(0);
  const [answer, setAnswer] = useState(lecturerInbox[0].answer);

  function notify(message: string) {
    setToast(message);
    setTimeout(() => setToast(''), 1800);
  }

  useEffect(() => {
    setActive(initialTab === 'analytics' ? 'overview' : initialTab);
  }, [initialTab]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
      {toast && <Toast message={toast} />}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-xs font-semibold uppercase text-companion">Lecturer Dashboard</p>
          <h2 className="font-display text-3xl font-bold">Simple cohort insight, one section at a time</h2>
        </div>
        <ConfidenceBadge />
      </div>

      <div className="grid gap-3 md:grid-cols-4" role="tablist" aria-label="Lecturer dashboard sections">
        {sections.map(({ id, title, detail, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active === id}
            onClick={() => setActive(id)}
            className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 ${active === id ? 'border-companion bg-companion-tint shadow-sm' : 'border-line bg-white hover:border-companion/50'}`}
          >
            <Icon className="mb-4 text-companion" size={21} />
            <p className="font-display text-base font-bold">{title}</p>
            <p className="mt-1 text-xs leading-5 text-slate-copy">{detail}</p>
          </button>
        ))}
      </div>

      <div className="mt-6">
        {active === 'overview' && <OverviewSection />}
        {active === 'statistics' && <StatisticsSection />}
        {active === 'topics' && <TopicsSection />}
        {active === 'questions' && <QuestionsSection />}
        {active === 'recommendations' && <RecommendationsSection notify={notify} />}
        {active === 'report' && <ReportSection />}
        {active === 'setup' && <SetupSection />}
        {active === 'queue' && <QueueSection editing={editing} setEditing={setEditing} answer={answer} setAnswer={setAnswer} notify={notify} />}
      </div>
    </div>
  );
}

function OverviewSection() {
  return (
    <Card>
      <h3 className="font-display text-xl font-bold">This week at a glance</h3>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {[
          ['Main teaching issue', 'Bending moment diagrams remain the clearest pain point.'],
          ['Suggested next step', 'Release one worked example and a short quiz before tutorial.'],
          ['Student support', '36 students were referred to PASS, mentoring, or lecturer catch-up.'],
        ].map(([title, detail]) => (
          <div key={title} className="rounded-2xl bg-paper p-4">
            <p className="font-bold">{title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-copy">{detail}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

function StatisticsSection() {
  return (
    <Card>
      <h3 className="font-display text-xl font-bold">Statistics</h3>
      <div className="mt-5 grid gap-4 md:grid-cols-4">
        {analytics.map((item) => (
          <div key={item.label} className="rounded-2xl bg-paper p-4">
            <p className="font-mono text-xs font-semibold uppercase text-slate-soft">{item.label}</p>
            <p className="mt-3 font-display text-4xl font-bold">{item.value}</p>
            <p className="mt-2 text-sm text-slate-copy">{item.detail}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

function TopicsSection() {
  return (
    <Card>
      <h3 className="font-display text-xl font-bold">Most misunderstood topics</h3>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {misunderstoodTopics.map((topic) => <p key={topic} className="rounded-2xl bg-paper p-4 text-sm font-semibold">{topic}</p>)}
      </div>
    </Card>
  );
}

function QuestionsSection() {
  return (
    <Card>
      <h3 className="font-display text-xl font-bold">Frequently asked questions</h3>
      <div className="mt-5 space-y-3">
        {dashboardQuestions.map((question) => <p key={question} className="rounded-2xl bg-companion-tint p-4 text-sm font-semibold text-companion">{question}</p>)}
      </div>
    </Card>
  );
}

function RecommendationsSection({ notify }: { notify: (message: string) => void }) {
  return (
    <Card>
      <h3 className="font-display text-xl font-bold">Teaching recommendations</h3>
      <p className="mt-2 text-sm leading-6 text-slate-copy">Choose one action to respond to the current cohort pattern.</p>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {teachingActions.map((action) => (
          <Button key={action} variant="secondary" onClick={() => notify(`${action} queued for CIVL301`)}>
            {action}
          </Button>
        ))}
      </div>
    </Card>
  );
}

function ReportSection() {
  return (
    <Card>
      <h3 className="font-display text-xl font-bold">Weekly report</h3>
      <div className="mt-5 grid gap-4 md:grid-cols-4">
        {['42% asked follow-ups about bending moment diagrams', '17 questions escalated to lecturer', '6 rubric weaknesses clustered around justification', '4 knowledge base updates approved'].map((item) => (
          <div key={item} className="rounded-2xl bg-paper p-4 text-sm font-semibold leading-6">{item}</div>
        ))}
      </div>
    </Card>
  );
}

function SetupSection() {
  return (
    <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <Card>
        <h3 className="font-display text-xl font-bold">Connected unit materials</h3>
        <div className="mt-4 space-y-3">
          {connectors.map(([name, status]) => (
            <div key={name} className="flex items-center justify-between rounded-2xl bg-paper p-3 text-sm">
              <span className="font-semibold">{name}</span>
              <span className={`font-mono text-xs font-bold ${status === 'Connected' ? 'text-success' : 'text-warn'}`}>{status}</span>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <h3 className="font-display text-xl font-bold">Knowledge Base Maturity</h3>
        <div className="mt-6">
          <div className="flex justify-between text-sm font-bold"><span>Current maturity</span><span>62%</span></div>
          <div className="mt-2 h-3 rounded-full bg-paper-dim"><div className="h-3 w-[62%] rounded-full bg-companion" /></div>
          <p className="mt-3 font-mono text-xs text-slate-copy">28% {'->'} 47% {'->'} 62% across three semesters</p>
        </div>
      </Card>
    </div>
  );
}

function QueueSection({
  editing,
  setEditing,
  answer,
  setAnswer,
  notify,
}: {
  editing: number;
  setEditing: (index: number) => void;
  answer: string;
  setAnswer: (value: string) => void;
  notify: (message: string) => void;
}) {
  return (
    <Card>
      <h3 className="font-display text-xl font-bold">Lecturer review queue</h3>
      <p className="mt-2 text-sm text-slate-copy">Approved answers become part of the lecturer-approved knowledge base.</p>
      <div className="mt-5 space-y-4">
        {lecturerInbox.map((item, index) => (
          <div key={item.question} className="rounded-2xl border border-line p-4">
            <p className="font-bold">{item.question}</p>
            {editing === index ? (
              <textarea value={answer} onChange={(event) => setAnswer(event.target.value)} aria-label={`Edit answer for question ${index + 1}`} className="mt-3 min-h-28 w-full rounded-2xl border border-line p-3 text-sm" />
            ) : (
              <p className="mt-3 text-sm leading-6 text-slate-copy">{index === 0 ? answer : item.answer}</p>
            )}
            <p className="mt-3 font-mono text-xs font-bold text-companion">Source: {item.source}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => notify('Answer approved and added to knowledge base')}>Approve</Button>
              <Button variant="secondary" onClick={() => setEditing(index)}>Edit answer</Button>
              <Button variant="ghost" onClick={() => notify('Suggested answer rejected')}>Reject</Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
