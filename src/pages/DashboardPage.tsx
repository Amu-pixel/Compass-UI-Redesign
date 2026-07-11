import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  CheckCircle2,
  ClipboardCheck,
  Database,
  FileText,
  HelpCircle,
  Inbox,
  Lightbulb,
  Mail,
  Megaphone,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { analytics, connectors, dashboardQuestions, lecturerInbox, misunderstoodTopics, teachingActions, unit } from '../data/mockData';
import { Badge, Button, Card, Toast } from '../components/ui';
import PrepareMessageDialog from '../components/PrepareMessageDialog';
import { cn } from '../utils/classNames';

type DashboardSection = 'overview' | 'workload' | 'gaps' | 'questions' | 'actions' | 'report' | 'setup' | 'queue';
type QueueStatus = 'pending' | 'in-review' | 'revision' | 'resolved';

const sections: Array<{ id: DashboardSection; title: string; detail: string; icon: typeof BarChart3 }> = [
  { id: 'overview', title: 'Today', detail: 'Required decisions', icon: ClipboardCheck },
  { id: 'workload', title: 'Workload', detail: 'Review pressure', icon: BarChart3 },
  { id: 'gaps', title: 'Learning gaps', detail: 'Teaching response', icon: HelpCircle },
  { id: 'questions', title: 'Questions', detail: 'Cohort patterns', icon: Inbox },
  { id: 'actions', title: 'Operations', detail: 'Announcements and sources', icon: Lightbulb },
  { id: 'report', title: 'Weekly report', detail: 'Academic summary', icon: BookOpenCheck },
  { id: 'setup', title: 'Source setup', detail: 'AI permissions', icon: Database },
  { id: 'queue', title: 'Review Queue', detail: 'Human decisions', icon: ShieldCheck },
];

const teachingPriorities = [
  {
    label: 'P0',
    title: 'Review Marcus Lee before tutorial',
    detail: 'Manual review required: sign convention issue appears in the final submission and two AI answers were low confidence.',
    action: 'Open review queue',
    to: '/lecturer/review',
    tone: 'danger',
  },
  {
    label: 'P1',
    title: 'Validate Week 5 design implication source',
    detail: 'Four students are asking about material efficiency. The AI can cite the pending reading only after lecturer validation.',
    action: 'Validate source',
    to: '/lecturer/knowledge',
    tone: 'warning',
  },
  {
    label: 'P1',
    title: 'Prepare cohort announcement',
    detail: '42% of Week 4 questions relate to moment maxima. A short pre-tutorial note will reduce repeated support load.',
    action: 'Prepare announcement',
    tone: 'ai',
  },
];

const workloadRows = [
  { label: 'Awaiting review', value: '17', detail: '12 final, 5 draft escalations', tone: 'danger' },
  { label: 'Overdue reviews', value: '3', detail: 'Older than 48 hours', tone: 'warning' },
  { label: 'Evidence concerns', value: '6', detail: 'Citation or source mismatch', tone: 'warning' },
  { label: 'Ready to publish', value: '8', detail: 'Feedback draft prepared', tone: 'success' },
];

const cohortSignals = [
  {
    concept: 'Moment maximum at zero shear',
    students: '31 students',
    content: 'Week 4 Slide 18',
    action: 'Release one annotated worked example before Friday tutorial.',
  },
  {
    concept: 'Unit conversion in moment calculations',
    students: '18 students',
    content: 'Week 3 Tutorial Q4',
    action: 'Add a one-page convention note to the module resources.',
  },
  {
    concept: 'Design implication from peak moment',
    students: '24 students',
    content: 'Week 5 Reading Section 2',
    action: 'Validate reading and prepare a short cohort announcement.',
  },
];

const reviewQueueSeed = [
  {
    id: 'rq-marcus',
    priority: 'Urgent',
    student: 'Marcus Lee',
    type: 'Final submission',
    reason: 'Low-confidence AI recommendation and sign convention mismatch.',
    confidence: 'Uncertain',
    age: '2d 4h',
    required: 'Manual judgement',
    status: 'pending' as QueueStatus,
  },
  {
    id: 'rq-amelia',
    priority: 'High',
    student: 'Amelia Brooks',
    type: 'Draft escalation',
    reason: 'Engineering justification is thin but recoverable.',
    confidence: 'Medium',
    age: '18h',
    required: 'Feedback direction',
    status: 'in-review' as QueueStatus,
  },
  {
    id: 'rq-david',
    priority: 'Normal',
    student: 'David Chen',
    type: 'Final submission',
    reason: 'Ready for final review; recommendation aligns with rubric.',
    confidence: 'High',
    age: '5h',
    required: 'Publish feedback',
    status: 'pending' as QueueStatus,
  },
];

export default function DashboardPage({ initialTab = 'overview' }: { initialTab?: DashboardSection | 'analytics' }) {
  const [active, setActive] = useState<DashboardSection>(initialTab === 'analytics' ? 'overview' : initialTab);
  const [toast, setToast] = useState('');
  const [editing, setEditing] = useState(0);
  const [answer, setAnswer] = useState(lecturerInbox[0].answer);
  const [queueItems, setQueueItems] = useState(reviewQueueSeed);
  const [messageDialog, setMessageDialog] = useState<null | 'student' | 'cohort'>(null);

  function notify(message: string) {
    setToast(message);
    setTimeout(() => setToast(''), 1800);
  }

  function updateQueueStatus(id: string, status: QueueStatus) {
    setQueueItems((items) => items.map((item) => item.id === id ? { ...item, status } : item));
    notify(status === 'resolved' ? 'Queue item marked resolved for this local session.' : 'Queue item updated for this local session.');
  }

  useEffect(() => {
    setActive(initialTab === 'analytics' ? 'overview' : initialTab);
  }, [initialTab]);

  const pendingCount = useMemo(() => queueItems.filter((item) => item.status !== 'resolved').length, [queueItems]);

  return (
    <div className="animate-page min-h-[calc(100vh-88px)] bg-paper px-5 py-6 text-ink sm:px-8">
      {toast && <Toast message={toast} />}
      <PrepareMessageDialog
        open={messageDialog !== null}
        onClose={() => setMessageDialog(null)}
        title={messageDialog === 'student' ? 'Prepare student message' : 'Prepare cohort announcement'}
        recipientLabel={messageDialog === 'student' ? 'Student' : 'Cohort'}
        recipientValue={messageDialog === 'student' ? 'Marcus Lee' : `${unit.code} enrolled students`}
        unitCode={unit.code}
        context={messageDialog === 'student' ? 'Manual review: sign convention and feedback clarification' : 'Week 4 cohort support: bending moment diagrams'}
        defaultSubject={messageDialog === 'student' ? `${unit.code}: Feedback clarification for Assignment 2` : `${unit.code}: Week 4 bending moment support before tutorial`}
        defaultMessage={messageDialog === 'student'
          ? 'I have reviewed your submission signals and would like you to revisit the sign convention around the central load before tutorial.'
          : 'Several students are asking about where maximum bending moment occurs. Please revisit Week 4 Slide 18 and bring one annotated diagram question to tutorial.'}
      />
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 grid gap-4 xl:grid-cols-[1fr_360px]">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-companion">Lecturer workbench / {unit.code}</p>
            <h1 className="mt-2 font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">Teaching operations for today</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-copy">
              Decisions, review pressure, cohort learning gaps, and source validation for {unit.name}. AI remains advisory; lecturer judgement is the final authority.
            </p>
          </div>
          <Card className="h-fit border-companion/20 bg-companion-tint">
            <p className="font-mono text-xs font-bold uppercase text-companion">Next required action</p>
            <h2 className="mt-2 font-display text-xl font-bold text-ink">Review {pendingCount} active queue items</h2>
            <p className="mt-2 text-sm leading-6 text-slate-copy">Start with manual judgement items before preparing cohort communication.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button to="/lecturer/review" size="sm">Review queue <ArrowRight size={14} /></Button>
              <Button variant="secondary" size="sm" onClick={() => setMessageDialog('cohort')}><Megaphone size={14} />Prepare announcement</Button>
            </div>
          </Card>
        </div>

        <section className="mb-5 grid gap-4 lg:grid-cols-3" aria-label="Teaching priorities">
          {teachingPriorities.map((item) => (
            <Card key={item.title} className={cn('p-4', item.tone === 'danger' && 'border-danger/25', item.tone === 'warning' && 'border-warn/25', item.tone === 'ai' && 'border-companion/25')}>
              <div className="flex items-start justify-between gap-3">
                <Badge tone={item.tone === 'danger' ? 'danger' : item.tone === 'warning' ? 'warning' : 'ai'}>{item.label}</Badge>
                <span className="font-mono text-[10px] font-bold uppercase text-slate-soft">Today</span>
              </div>
              <h2 className="mt-3 font-display text-lg font-bold text-ink">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-copy">{item.detail}</p>
              {item.to ? (
                <Link to={item.to} className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-companion hover:underline">{item.action}<ArrowRight size={14} /></Link>
              ) : (
                <button type="button" onClick={() => setMessageDialog('cohort')} className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-companion hover:underline">{item.action}<ArrowRight size={14} /></button>
              )}
            </Card>
          ))}
        </section>

        <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Review workload">
          {workloadRows.map((item) => (
            <div key={item.label} className="rounded-xl border border-line bg-white p-4 shadow-sm">
              <p className="font-mono text-[10px] font-bold uppercase text-slate-soft">{item.label}</p>
              <div className="mt-2 flex items-end justify-between gap-3">
                <p className="font-display text-3xl font-bold text-ink">{item.value}</p>
                <Badge tone={item.tone as 'danger' | 'warning' | 'success'}>{item.tone}</Badge>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-copy">{item.detail}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-2 overflow-x-auto rounded-xl border border-line bg-white p-2 shadow-sm md:grid-cols-4" role="tablist" aria-label="Lecturer workbench sections">
          {sections.map(({ id, title, detail, icon: Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active === id}
              onClick={() => setActive(id)}
              className={cn(
                'premium-focus min-w-44 rounded-lg border px-3 py-3 text-left outline-none transition focus-visible:ring-2 focus-visible:ring-ai-cyan/70',
                active === id ? 'border-ink bg-ink text-white shadow-sm' : 'border-transparent bg-white text-ink hover:border-line hover:bg-paper',
              )}
            >
              <span className="flex items-center gap-2">
                <Icon size={17} className={active === id ? 'text-ai-cyan' : 'text-slate-soft'} />
                <span className="text-sm font-bold">{title}</span>
              </span>
              <span className={cn('mt-1 block text-xs', active === id ? 'text-white/64' : 'text-slate-soft')}>{detail}</span>
            </button>
          ))}
        </div>

        <div className="mt-5">
          {active === 'overview' && <OverviewSection onMessage={() => setMessageDialog('student')} />}
          {active === 'workload' && <WorkloadSection />}
          {active === 'gaps' && <GapsSection />}
          {active === 'questions' && <QuestionsSection />}
          {active === 'actions' && <RecommendationsSection notify={notify} onAnnouncement={() => setMessageDialog('cohort')} />}
          {active === 'report' && <ReportSection />}
          {active === 'setup' && <SetupSection notify={notify} />}
          {active === 'queue' && <QueueSection items={queueItems} updateStatus={updateQueueStatus} editing={editing} setEditing={setEditing} answer={answer} setAnswer={setAnswer} notify={notify} />}
        </div>
      </div>
    </div>
  );
}

function OverviewSection({ onMessage }: { onMessage: () => void }) {
  return (
    <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
      <Card className="p-0">
        <div className="border-b border-line px-5 py-4">
          <p className="font-mono text-xs font-bold uppercase text-companion">Cohort learning signals</p>
          <h2 className="mt-1 font-display text-xl font-bold">Teaching decisions attached to evidence</h2>
        </div>
        <div className="divide-y divide-line">
          {cohortSignals.map((signal) => (
            <div key={signal.concept} className="grid gap-3 p-4 md:grid-cols-[1fr_150px_1fr]">
              <div>
                <p className="font-bold text-ink">{signal.concept}</p>
                <p className="mt-1 text-xs text-slate-soft">{signal.content}</p>
              </div>
              <Badge tone="warning">{signal.students}</Badge>
              <p className="text-sm leading-6 text-slate-copy">{signal.action}</p>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <p className="font-mono text-xs font-bold uppercase text-slate-soft">Communication preparation</p>
        <h2 className="mt-2 font-display text-xl font-bold">Messages are prepared, not sent</h2>
        <p className="mt-2 text-sm leading-6 text-slate-copy">Use local message preparation for students or the cohort. No backend delivery is claimed.</p>
        <div className="mt-4 grid gap-2">
          <Button onClick={onMessage}><Mail size={15} />Contact student</Button>
          <Button variant="secondary" to="/lecturer/knowledge"><Database size={15} />Validate source</Button>
          <Button variant="secondary" to="/lecturer/assignments"><ClipboardCheck size={15} />Open assignment queue</Button>
        </div>
      </Card>
    </div>
  );
}

function WorkloadSection() {
  return (
    <Card>
      <h2 className="font-display text-xl font-bold">Review workload</h2>
      <div className="mt-5 overflow-x-auto">
        <table className="min-w-[760px] w-full border-collapse text-left text-sm">
          <thead className="border-b border-line text-xs uppercase text-slate-soft">
            <tr>
              <th className="py-3 pr-4">Work item</th>
              <th className="py-3 pr-4">Count</th>
              <th className="py-3 pr-4">Risk</th>
              <th className="py-3 pr-4">Lecturer action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {workloadRows.map((row) => (
              <tr key={row.label}>
                <td className="py-3 pr-4 font-bold">{row.label}</td>
                <td className="py-3 pr-4">{row.value}</td>
                <td className="py-3 pr-4">{row.detail}</td>
                <td className="py-3 pr-4 text-companion">{row.label === 'Ready to publish' ? 'Finalise feedback' : 'Review evidence'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function GapsSection() {
  return (
    <Card>
      <h2 className="font-display text-xl font-bold">Cohort learning gaps</h2>
      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        {cohortSignals.map((signal) => (
          <div key={signal.concept} className="rounded-xl border border-line bg-paper p-4">
            <p className="font-bold">{signal.concept}</p>
            <p className="mt-2 text-sm text-slate-copy">{signal.students} affected</p>
            <p className="mt-3 text-xs font-bold uppercase text-companion">{signal.content}</p>
            <p className="mt-2 text-sm leading-6 text-slate-copy">{signal.action}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

function QuestionsSection() {
  return (
    <Card>
      <h2 className="font-display text-xl font-bold">Frequently asked questions</h2>
      <div className="mt-5 grid gap-3">
        {dashboardQuestions.map((question) => <p key={question} className="rounded-xl border border-companion/20 bg-companion-tint p-4 text-sm font-semibold text-ink">{question}</p>)}
      </div>
    </Card>
  );
}

function RecommendationsSection({ notify, onAnnouncement }: { notify: (message: string) => void; onAnnouncement: () => void }) {
  return (
    <Card>
      <h2 className="font-display text-xl font-bold">Teaching operations</h2>
      <p className="mt-2 text-sm leading-6 text-slate-copy">Each action either opens a working route or records an honest local prototype state.</p>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {teachingActions.map((action) => (
          <Button key={action} variant={action === 'Announcement' ? 'primary' : 'secondary'} onClick={action === 'Announcement' ? onAnnouncement : () => notify(`${action} prepared for this local demonstration.`)}>
            {action === 'Announcement' ? <Megaphone size={15} /> : <Lightbulb size={15} />}
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
      <h2 className="font-display text-xl font-bold">Weekly teaching report</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {['42% asked follow-ups about bending moment diagrams', '17 questions escalated to lecturer', '6 rubric weaknesses clustered around justification', '4 knowledge base updates require approval'].map((item) => (
          <div key={item} className="rounded-xl border border-line bg-paper p-4 text-sm font-semibold leading-6 text-slate-copy">{item}</div>
        ))}
      </div>
    </Card>
  );
}

function SetupSection({ notify }: { notify: (message: string) => void }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <Card>
        <h2 className="font-display text-xl font-bold">What the AI is allowed to know</h2>
        <div className="mt-4 space-y-3">
          {connectors.map(([name, status]) => (
            <div key={name} className="flex items-center justify-between gap-4 rounded-xl border border-line bg-paper p-3 text-sm">
              <span className="font-semibold text-ink">{name}</span>
              <Badge tone={status === 'Connected' ? 'success' : 'warning'}>{status}</Badge>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <h2 className="font-display text-xl font-bold">Validation boundary</h2>
        <p className="mt-2 text-sm leading-6 text-slate-copy">Only lecturer-approved materials can be reused in future AI answers. Local approval controls show session feedback only.</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button to="/lecturer/knowledge"><Database size={15} />Open Knowledge Base</Button>
          <Button variant="secondary" onClick={() => notify('Validation reminder prepared locally; no message was sent.')}>Prepare reminder</Button>
        </div>
      </Card>
    </div>
  );
}

function QueueSection({
  items,
  updateStatus,
  editing,
  setEditing,
  answer,
  setAnswer,
  notify,
}: {
  items: typeof reviewQueueSeed;
  updateStatus: (id: string, status: QueueStatus) => void;
  editing: number;
  setEditing: (index: number) => void;
  answer: string;
  setAnswer: (value: string) => void;
  notify: (message: string) => void;
}) {
  const activeItems = items.filter((item) => item.status !== 'resolved');

  return (
    <div className="space-y-5">
      <Card className="p-0">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            <p className="font-mono text-xs font-bold uppercase text-companion">Review Queue</p>
            <h2 className="mt-1 font-display text-xl font-bold">Efficient academic decisions</h2>
          </div>
          {activeItems.length === 0 ? <Badge tone="success">Caught up</Badge> : <Badge tone="warning">{activeItems.length} active</Badge>}
        </div>
        {activeItems.length === 0 ? (
          <div className="p-6">
            <div className="rounded-xl border border-success/20 bg-success-tint p-5">
              <p className="font-bold text-success">Review queue caught up</p>
              <p className="mt-2 text-sm leading-6 text-slate-copy">No pending decisions are visible in this local demonstration state.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[920px] w-full border-collapse text-left text-sm">
              <thead className="border-b border-line bg-paper text-xs uppercase text-slate-soft">
                <tr>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Submission</th>
                  <th className="px-4 py-3">Reason</th>
                  <th className="px-4 py-3">Confidence</th>
                  <th className="px-4 py-3">Age</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {activeItems.map((item) => (
                  <tr key={item.id} className="transition hover:bg-companion-tint/35">
                    <td className="px-4 py-4"><Badge tone={item.priority === 'Urgent' ? 'danger' : item.priority === 'High' ? 'warning' : 'neutral'}>{item.priority}</Badge></td>
                    <td className="px-4 py-4"><p className="font-bold">{item.student}</p><p className="text-xs text-slate-soft">{item.type}</p></td>
                    <td className="px-4 py-4 text-slate-copy">{item.reason}</td>
                    <td className="px-4 py-4">{item.confidence}</td>
                    <td className="px-4 py-4">{item.age}</td>
                    <td className="px-4 py-4">{item.status.replace('-', ' ')}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="secondary" to="/lecturer/assignments">Open</Button>
                        <Button size="sm" variant="ghost" onClick={() => updateStatus(item.id, 'resolved')}>Resolve</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card>
        <h2 className="font-display text-xl font-bold">Pending AI questions</h2>
        <p className="mt-2 text-sm text-slate-copy">Approved answers become part of the lecturer-approved knowledge base. This remains a local prototype state.</p>
        <div className="mt-5 space-y-4">
          {lecturerInbox.map((item, index) => (
            <div key={item.question} className="rounded-xl border border-line bg-paper p-4">
              <p className="font-bold">{item.question}</p>
              {editing === index ? (
                <textarea value={answer} onChange={(event) => setAnswer(event.target.value)} aria-label={`Edit answer for question ${index + 1}`} className="mt-3 min-h-28 w-full rounded-xl border border-line bg-white p-3 text-sm text-ink outline-none focus:border-companion focus:ring-2 focus:ring-companion/20" />
              ) : (
                <p className="mt-3 text-sm leading-6 text-slate-copy">{index === 0 ? answer : item.answer}</p>
              )}
              <p className="mt-3 font-mono text-xs font-bold text-companion">Source: {item.source}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button size="sm" onClick={() => notify('Answer approved for this local session. Permanent reuse requires backend persistence.')}>Approve</Button>
                <Button size="sm" variant="secondary" onClick={() => setEditing(index)}>Edit answer</Button>
                <Button size="sm" variant="ghost" onClick={() => notify('Suggested answer rejected for this local session.')}>Reject</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
