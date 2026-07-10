import { BarChart3, BookOpenCheck, HelpCircle, Inbox, Lightbulb, TrendingUp, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { analytics, connectors, dashboardQuestions, lecturerInbox, misunderstoodTopics, teachingActions } from '../data/mockData';
import { Badge, Button, Card, ConfidenceBadge, Toast } from '../components/ui';

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
    <div className="min-h-[calc(100vh-88px)] bg-night px-5 py-6 text-mist sm:px-8">
      {toast && <Toast message={toast} />}
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 grid gap-5 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-ai-cyan">Lecturer dashboard</p>
            <h2 className="mt-2 font-display text-4xl font-bold text-mist">Teaching command center</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-mist-muted">
              A focused view of review work, cohort progress, assignment signals, and AI-supported teaching actions for CIVL301.
            </p>
          </div>
          <div className="flex flex-wrap items-start gap-2 lg:justify-end">
            <ConfidenceBadge />
            <Badge tone="ai">Privacy-aware cohort signals</Badge>
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          {[
            ['Review queue', '17 items need lecturer judgement', Inbox],
            ['Cohort progress', '71% average quiz accuracy', Users],
            ['AI insight', 'Bending moment diagrams remain the priority', Lightbulb],
          ].map(([title, detail, Icon]) => {
            const TypedIcon = Icon as typeof Inbox;
            return (
              <div key={title as string} className="rounded-[24px] border border-white/10 bg-white/[0.045] p-5">
                <TypedIcon className="text-ai-cyan" size={21} />
                <p className="mt-4 font-display text-lg font-bold text-mist">{title as string}</p>
                <p className="mt-2 text-sm leading-6 text-mist-muted">{detail as string}</p>
              </div>
            );
          })}
        </div>

        <div className="grid gap-3 md:grid-cols-4" role="tablist" aria-label="Lecturer dashboard sections">
          {sections.map(({ id, title, detail, icon: Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active === id}
              onClick={() => setActive(id)}
              className={`premium-focus rounded-2xl border p-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-ai-cyan/70 ${
                active === id
                  ? 'border-ai-cyan/45 bg-ai-cyan/10 shadow-[0_0_30px_rgba(109,231,242,0.10)]'
                  : 'border-white/10 bg-white/[0.04] hover:border-white/24 hover:bg-white/[0.065]'
              }`}
            >
              <Icon className={active === id ? 'mb-4 text-ai-cyan' : 'mb-4 text-mist-soft'} size={21} />
              <p className="font-display text-base font-bold text-mist">{title}</p>
              <p className="mt-1 text-xs leading-5 text-mist-muted">{detail}</p>
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
    </div>
  );
}

function OverviewSection() {
  return (
    <Card variant="dark">
      <h3 className="font-display text-xl font-bold text-mist">This week at a glance</h3>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {[
          ['Main teaching issue', 'Bending moment diagrams remain the clearest pain point.'],
          ['Suggested next step', 'Release one worked example and a short quiz before tutorial.'],
          ['Student support', '36 students were referred to PASS, mentoring, or lecturer catch-up.'],
        ].map(([title, detail]) => (
          <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
            <p className="font-bold text-mist">{title}</p>
            <p className="mt-2 text-sm leading-6 text-mist-muted">{detail}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

function StatisticsSection() {
  return (
    <Card variant="dark">
      <h3 className="font-display text-xl font-bold text-mist">Statistics</h3>
      <div className="mt-5 grid gap-4 md:grid-cols-4">
        {analytics.map((item) => (
          <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
            <p className="font-mono text-xs font-semibold uppercase text-mist-soft">{item.label}</p>
            <p className="mt-3 font-display text-4xl font-bold text-mist">{item.value}</p>
            <p className="mt-2 text-sm text-mist-muted">{item.detail}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

function TopicsSection() {
  return (
    <Card variant="dark">
      <h3 className="font-display text-xl font-bold text-mist">Most misunderstood topics</h3>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {misunderstoodTopics.map((topic) => <p key={topic} className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 text-sm font-semibold text-mist-muted">{topic}</p>)}
      </div>
    </Card>
  );
}

function QuestionsSection() {
  return (
    <Card variant="dark">
      <h3 className="font-display text-xl font-bold text-mist">Frequently asked questions</h3>
      <div className="mt-5 space-y-3">
        {dashboardQuestions.map((question) => <p key={question} className="rounded-2xl border border-ai-cyan/20 bg-ai-cyan/10 p-4 text-sm font-semibold text-mist">{question}</p>)}
      </div>
    </Card>
  );
}

function RecommendationsSection({ notify }: { notify: (message: string) => void }) {
  return (
    <Card variant="dark">
      <h3 className="font-display text-xl font-bold text-mist">Teaching recommendations</h3>
      <p className="mt-2 text-sm leading-6 text-mist-muted">Choose one action to respond to the current cohort pattern.</p>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {teachingActions.map((action) => (
          <Button key={action} variant="ai" onClick={() => notify(`${action} queued for CIVL301`)}>
            {action}
          </Button>
        ))}
      </div>
    </Card>
  );
}

function ReportSection() {
  return (
    <Card variant="dark">
      <h3 className="font-display text-xl font-bold text-mist">Weekly report</h3>
      <div className="mt-5 grid gap-4 md:grid-cols-4">
        {['42% asked follow-ups about bending moment diagrams', '17 questions escalated to lecturer', '6 rubric weaknesses clustered around justification', '4 knowledge base updates approved'].map((item) => (
          <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 text-sm font-semibold leading-6 text-mist-muted">{item}</div>
        ))}
      </div>
    </Card>
  );
}

function SetupSection() {
  return (
    <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <Card variant="dark">
        <h3 className="font-display text-xl font-bold text-mist">Connected unit materials</h3>
        <div className="mt-4 space-y-3">
          {connectors.map(([name, status]) => (
            <div key={name} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.045] p-3 text-sm">
              <span className="font-semibold text-mist-muted">{name}</span>
              <span className={`font-mono text-xs font-bold ${status === 'Connected' ? 'text-[#79E2A0]' : 'text-[#F2B56B]'}`}>{status}</span>
            </div>
          ))}
        </div>
      </Card>
      <Card variant="dark">
        <h3 className="font-display text-xl font-bold text-mist">Knowledge Base Maturity</h3>
        <div className="mt-6">
          <div className="flex justify-between text-sm font-bold text-mist"><span>Current maturity</span><span>62%</span></div>
          <div className="mt-2 h-3 rounded-full bg-white/10"><div className="h-3 w-[62%] rounded-full bg-gradient-to-r from-ai-cyan to-ai-violet" /></div>
          <p className="mt-3 font-mono text-xs text-mist-muted">28% {'->'} 47% {'->'} 62% across three semesters</p>
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
    <Card variant="dark">
      <h3 className="font-display text-xl font-bold text-mist">Lecturer review queue</h3>
      <p className="mt-2 text-sm text-mist-muted">Approved answers become part of the lecturer-approved knowledge base.</p>
      <div className="mt-5 space-y-4">
        {lecturerInbox.map((item, index) => (
          <div key={item.question} className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
            <p className="font-bold text-mist">{item.question}</p>
            {editing === index ? (
              <textarea value={answer} onChange={(event) => setAnswer(event.target.value)} aria-label={`Edit answer for question ${index + 1}`} className="mt-3 min-h-28 w-full rounded-2xl border border-white/10 bg-night-panel p-3 text-sm text-mist outline-none focus:border-ai-cyan/55 focus:ring-2 focus:ring-ai-cyan/20" />
            ) : (
              <p className="mt-3 text-sm leading-6 text-mist-muted">{index === 0 ? answer : item.answer}</p>
            )}
            <p className="mt-3 font-mono text-xs font-bold text-ai-cyan">Source: {item.source}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="ai" onClick={() => notify('Answer approved and added to knowledge base')}>Approve</Button>
              <Button variant="secondary" onClick={() => setEditing(index)}>Edit answer</Button>
              <Button variant="ghost" onClick={() => notify('Suggested answer rejected')}>Reject</Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
