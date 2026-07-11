import {
  AlertTriangle,
  ArrowDownUp,
  ArrowLeft,
  Brain,
  CheckCircle2,
  ClipboardCheck,
  Edit3,
  FileText,
  History,
  Mail,
  RotateCcw,
  Save,
  Search,
  ShieldCheck,
  Sparkles,
  XCircle,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  assignmentBrief,
  finalRubric,
  lecturerAssignmentView,
  rubric,
  sampleSubmission,
  unit,
} from '../data/mockData';
import { Badge, Button, Card, Toast } from '../components/ui';
import PrepareMessageDialog from '../components/PrepareMessageDialog';
import { cn } from '../utils/classNames';

type Decision = '' | 'accepted' | 'edited' | 'overridden' | 'rejected' | 'revision' | 'draftSaved' | 'finalised';
type QueueFilter = 'all' | 'draft' | 'final' | 'needs-review' | 'ready';
type SortMode = 'priority' | 'time';

type Submission = (typeof lecturerAssignmentView.finalSubmissions)[number] & {
  id: string;
  assignment: string;
  type: 'Draft' | 'Final';
  version: string;
  reviewStatus: 'Ready' | 'AI recommendation' | 'Manual review' | 'Revision requested';
  evidenceQuality: 'High' | 'Medium' | 'Concern';
  risk: 'Low' | 'Medium' | 'High';
  aiStatus: 'Guidance ready' | 'Needs lecturer check' | 'Insufficient evidence';
  decisionStatus: string;
  priority: number;
};

const queueRows: Submission[] = [
  {
    ...lecturerAssignmentView.finalSubmissions[0],
    id: 'david-final',
    assignment: assignmentBrief.title,
    type: 'Final',
    version: 'v3 final',
    reviewStatus: 'Ready',
    evidenceQuality: 'High',
    risk: 'Low',
    aiStatus: 'Guidance ready',
    decisionStatus: 'Not finalised',
    priority: 3,
  },
  {
    ...lecturerAssignmentView.finalSubmissions[1],
    id: 'amelia-final',
    assignment: assignmentBrief.title,
    type: 'Final',
    version: 'v2 final',
    reviewStatus: 'AI recommendation',
    evidenceQuality: 'Medium',
    risk: 'Medium',
    aiStatus: 'Needs lecturer check',
    decisionStatus: 'Feedback draft open',
    priority: 2,
  },
  {
    ...lecturerAssignmentView.finalSubmissions[2],
    id: 'marcus-final',
    assignment: assignmentBrief.title,
    type: 'Final',
    version: 'v1 final',
    reviewStatus: 'Manual review',
    evidenceQuality: 'Concern',
    risk: 'High',
    aiStatus: 'Insufficient evidence',
    decisionStatus: 'Manual judgement required',
    priority: 1,
  },
  {
    student: 'Nadia Rahman',
    file: 'CIVL301_Assignment2_NadiaRahman_Draft.pdf',
    submitted: '17 Sep 2026, 9:18 am',
    status: 'Lecturer review required',
    id: 'nadia-draft',
    assignment: assignmentBrief.title,
    type: 'Draft',
    version: 'v2 draft',
    reviewStatus: 'Revision requested',
    evidenceQuality: 'Medium',
    risk: 'Medium',
    aiStatus: 'Needs lecturer check',
    decisionStatus: 'Revision requested',
    priority: 2,
  },
];

const submissionHistory = [
  'Draft v1 uploaded 14 Sep 2026, 8:42 pm',
  'Formative AI feedback generated 15 Sep 2026, 9:02 am',
  'Draft v2 uploaded 17 Sep 2026, 9:18 am',
  'Final version uploaded 18 Sep 2026, 4:42 pm',
];

export default function LecturerAssignmentsPage() {
  const [toast, setToast] = useState('');
  const [selected, setSelected] = useState<Submission>(queueRows[0]);
  const [decision, setDecision] = useState<Decision>('');
  const [editingFeedback, setEditingFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState('Your explanation of maximum bending moment is clear. Strengthen the final feedback by explicitly linking the signed shear area to the central moment peak and identifying one design implication.');
  const [rubricFeedback, setRubricFeedback] = useState<Record<string, string>>(() => Object.fromEntries(rubric.map((item) => [item.title, item.improvement])));
  const [saveState, setSaveState] = useState<'saved' | 'unsaved'>('saved');
  const [auditHistory, setAuditHistory] = useState<string[]>(['Local session opened review workspace.']);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<QueueFilter>('all');
  const [sortMode, setSortMode] = useState<SortMode>('priority');
  const [messageOpen, setMessageOpen] = useState(false);

  function notify(message: string) {
    setToast(message);
    setTimeout(() => setToast(''), 2200);
  }

  function record(action: string) {
    setAuditHistory((items) => [`${new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })} - ${action}`, ...items].slice(0, 6));
  }

  function chooseSubmission(submission: Submission) {
    setSelected(submission);
    setDecision('');
    setEditingFeedback(false);
    setFeedbackText('Your explanation of maximum bending moment is clear. Strengthen the final feedback by explicitly linking the signed shear area to the central moment peak and identifying one design implication.');
    setRubricFeedback(Object.fromEntries(rubric.map((item) => [item.title, item.improvement])));
    setSaveState('saved');
    record(`Opened ${submission.student} submission.`);
  }

  function handleDecision(action: Decision, label: string) {
    if (action === 'edited') {
      setEditingFeedback(true);
      setSaveState('unsaved');
      record('Opened lecturer feedback editor.');
      return;
    }
    setDecision(action);
    record(`${label} recorded locally for ${selected.student}.`);
    notify(`${label} recorded for this local session.`);
  }

  function saveDraftFeedback() {
    if (!feedbackText.trim()) {
      notify('Feedback cannot be empty.');
      return;
    }
    setDecision('draftSaved');
    setSaveState('saved');
    setEditingFeedback(false);
    record(`Draft feedback saved for ${selected.student}.`);
  }

  function updateRubricFeedback(key: string, value: string) {
    setRubricFeedback((items) => ({ ...items, [key]: value }));
    setSaveState('unsaved');
  }

  const filteredRows = useMemo(() => {
    return queueRows
      .filter((row) => {
        const matchesQuery = `${row.student} ${row.assignment} ${row.file} ${row.reviewStatus}`.toLowerCase().includes(query.toLowerCase());
        const matchesFilter =
          filter === 'all' ||
          (filter === 'draft' && row.type === 'Draft') ||
          (filter === 'final' && row.type === 'Final') ||
          (filter === 'needs-review' && (row.risk === 'High' || row.reviewStatus === 'Manual review')) ||
          (filter === 'ready' && row.reviewStatus === 'Ready');
        return matchesQuery && matchesFilter;
      })
      .sort((a, b) => sortMode === 'priority' ? a.priority - b.priority : b.submitted.localeCompare(a.submitted));
  }, [filter, query, sortMode]);

  return (
    <div className="animate-page mx-auto max-w-7xl px-5 py-6 sm:px-8">
      {toast && <Toast message={toast} />}
      <PrepareMessageDialog
        open={messageOpen}
        onClose={() => setMessageOpen(false)}
        title="Prepare student message"
        recipientLabel="Student"
        recipientValue={selected.student}
        unitCode={unit.code}
        context={`${assignmentBrief.title} - ${selected.version} - ${selected.reviewStatus}`}
        defaultSubject={`${unit.code}: Feedback clarification for ${assignmentBrief.title}`}
        defaultMessage={`I am reviewing your ${selected.type.toLowerCase()} submission and need to clarify one point before feedback is finalised. Please revisit the evidence linked to your bending moment reasoning.`}
      />

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-companion">Lecturer workbench / Assignment queue</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-ink">High-volume review surface</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-copy">
            Search, filter, select, and review submissions. AI guidance remains advisory until a lecturer saves or finalises feedback.
          </p>
        </div>
        <Button to="/lecturer/review" variant="secondary"><InboxIcon />Review Queue</Button>
      </div>

      <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Assignment queue summary">
        {[
          ['Awaiting review', '4', 'Includes draft and final submissions', 'warning'],
          ['Manual judgement', '1', 'Evidence concern or uncertainty', 'danger'],
          ['Draft feedback open', '1', 'Quiet save state active', 'ai'],
          ['Ready to finalise', '1', 'Lecturer decision still required', 'success'],
        ].map(([label, value, detail, tone]) => (
          <div key={label} className="rounded-xl border border-line bg-white p-4 shadow-sm">
            <p className="font-mono text-[10px] font-bold uppercase text-slate-soft">{label}</p>
            <div className="mt-2 flex items-end justify-between gap-3">
              <p className="font-display text-3xl font-bold">{value}</p>
              <Badge tone={tone as 'warning' | 'danger' | 'ai' | 'success'}>{tone}</Badge>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-copy">{detail}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1.45fr)]">
        <Card className="h-fit p-0">
          <div className="border-b border-line p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-mono text-xs font-bold uppercase text-slate-soft">Submission queue</p>
                <h2 className="mt-1 font-display text-xl font-bold">Readable at cohort scale</h2>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSortMode(sortMode === 'priority' ? 'time' : 'priority')}>
                <ArrowDownUp size={14} />Sort: {sortMode}
              </Button>
            </div>
            <label className="mt-4 flex min-h-11 items-center gap-2 rounded-xl border border-line bg-paper px-3 text-sm">
              <Search size={16} className="text-slate-soft" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search student, file, status" aria-label="Search assignment queue" className="w-full bg-transparent outline-none" />
            </label>
            <div className="mt-3 flex flex-wrap gap-2" role="list" aria-label="Queue filters">
              {[
                ['all', 'All'],
                ['final', 'Final'],
                ['draft', 'Draft'],
                ['needs-review', 'Needs review'],
                ['ready', 'Ready'],
              ].map(([id, label]) => (
                <button key={id} type="button" aria-pressed={filter === id} onClick={() => setFilter(id as QueueFilter)} className={cn('rounded-full border px-3 py-1.5 text-xs font-bold transition', filter === id ? 'border-ink bg-ink text-white' : 'border-line bg-white text-slate-copy hover:border-companion')}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="max-w-full overflow-x-auto">
            <table className="min-w-[920px] w-full border-collapse text-left text-sm">
              <thead className="border-b border-line bg-paper text-xs uppercase text-slate-soft">
                <tr>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Submitted</th>
                  <th className="px-4 py-3">Review</th>
                  <th className="px-4 py-3">Evidence</th>
                  <th className="px-4 py-3">Risk</th>
                  <th className="px-4 py-3">Next</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredRows.map((submission) => {
                  const active = selected.id === submission.id;
                  return (
                    <tr key={submission.id} className={cn('queue-row-select transition', active ? 'bg-companion-tint/70' : 'hover:bg-paper')}>
                      <td className="px-4 py-4">
                        <button type="button" onClick={() => chooseSubmission(submission)} className="text-left font-bold text-ink hover:text-companion">
                          {submission.student}
                        </button>
                        <p className="mt-1 text-xs text-slate-soft">{submission.file}</p>
                      </td>
                      <td className="px-4 py-4"><Badge tone="neutral">{submission.type}</Badge></td>
                      <td className="px-4 py-4 text-slate-copy">{submission.submitted}</td>
                      <td className="px-4 py-4">{submission.reviewStatus}</td>
                      <td className="px-4 py-4">{submission.evidenceQuality}</td>
                      <td className="px-4 py-4"><Badge tone={submission.risk === 'High' ? 'danger' : submission.risk === 'Medium' ? 'warning' : 'success'}>{submission.risk}</Badge></td>
                      <td className="px-4 py-4"><Button size="sm" variant={active ? 'primary' : 'secondary'} onClick={() => chooseSubmission(submission)}>Open submission</Button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredRows.length === 0 && (
            <div className="p-5">
              <div className="rounded-xl border border-dashed border-line bg-paper p-5 text-sm text-slate-copy">
                No submissions match this filter. Clear search or choose All to return to the queue.
              </div>
            </div>
          )}
        </Card>

        <ReviewWorkbench
          selected={selected}
          decision={decision}
          editingFeedback={editingFeedback}
          feedbackText={feedbackText}
          rubricFeedback={rubricFeedback}
          saveState={saveState}
          auditHistory={auditHistory}
          onBackToQueue={() => document.querySelector<HTMLDivElement>('main')?.scrollTo({ top: 0, behavior: 'smooth' })}
          onDecision={handleDecision}
          onFeedbackChange={(value) => { setFeedbackText(value); setSaveState('unsaved'); }}
          onRubricFeedbackChange={updateRubricFeedback}
          onSaveDraft={saveDraftFeedback}
          onCancelEdit={() => { setEditingFeedback(false); setSaveState('saved'); }}
          onReset={() => {
            setDecision('');
            setEditingFeedback(false);
            setSaveState('saved');
            record(`Decision reset for ${selected.student}.`);
          }}
          onContact={() => setMessageOpen(true)}
        />
      </div>
    </div>
  );
}

function InboxIcon() {
  return <ClipboardCheck size={15} />;
}

function ReviewWorkbench({
  selected,
  decision,
  editingFeedback,
  feedbackText,
  rubricFeedback,
  saveState,
  auditHistory,
  onBackToQueue,
  onDecision,
  onFeedbackChange,
  onRubricFeedbackChange,
  onSaveDraft,
  onCancelEdit,
  onReset,
  onContact,
}: {
  selected: Submission;
  decision: Decision;
  editingFeedback: boolean;
  feedbackText: string;
  rubricFeedback: Record<string, string>;
  saveState: 'saved' | 'unsaved';
  auditHistory: string[];
  onBackToQueue: () => void;
  onDecision: (action: Decision, label: string) => void;
  onFeedbackChange: (value: string) => void;
  onRubricFeedbackChange: (key: string, value: string) => void;
  onSaveDraft: () => void;
  onCancelEdit: () => void;
  onReset: () => void;
  onContact: () => void;
}) {
  return (
    <section className="space-y-5" aria-label="Lecturer review workbench">
      <Card className="p-0">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line p-5">
          <div>
            <p className="font-mono text-xs font-bold uppercase text-companion">Selected submission</p>
            <h2 className="mt-1 font-display text-2xl font-bold">{selected.student}</h2>
            <p className="mt-1 text-sm text-slate-copy">{selected.assignment} - {selected.version} - submitted {selected.submitted}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge tone={selected.risk === 'High' ? 'danger' : selected.risk === 'Medium' ? 'warning' : 'success'}>{selected.risk} support signal</Badge>
            <Badge tone={saveState === 'saved' ? 'success' : 'warning'}>{saveState === 'saved' ? 'Saved' : 'Unsaved changes'}</Badge>
          </div>
        </div>
        <div className="grid gap-4 p-5 md:grid-cols-4">
          {[
            ['Course/unit', `${unit.code} ${unit.name}`],
            ['Assignment', selected.assignment],
            ['Draft/final', `${selected.type} - ${selected.version}`],
            ['Decision state', decision ? decision.replace(/([A-Z])/g, ' $1') : selected.decisionStatus],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-line bg-paper p-3">
              <p className="font-mono text-[10px] font-bold uppercase text-slate-soft">{label}</p>
              <p className="mt-1 text-sm font-bold leading-5">{value}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <div className="flex items-center gap-3">
            <FileText size={18} className="text-cardinal" />
            <h3 className="font-display text-lg font-bold">Assignment requirements</h3>
          </div>
          <p className="mt-4 font-semibold">{assignmentBrief.title}</p>
          <p className="mt-3 text-sm leading-6 text-slate-copy">{assignmentBrief.task}</p>
          <div className="mt-4 grid gap-2">
            {assignmentBrief.requirements.map((item) => (
              <p key={item} className="flex gap-2 text-sm leading-6 text-slate-copy"><CheckCircle2 size={15} className="mt-1 shrink-0 text-success" />{item}</p>
            ))}
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <History size={18} className="text-companion" />
            <h3 className="font-display text-lg font-bold">Submission history</h3>
          </div>
          <div className="mt-4 space-y-2">
            {submissionHistory.map((item) => (
              <p key={item} className="rounded-xl border border-line bg-paper p-3 text-sm font-semibold text-slate-copy">{item}</p>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center gap-3">
          <ClipboardCheck size={18} className="text-companion" />
          <h3 className="font-display text-lg font-bold">Student submission preview</h3>
        </div>
        <div className="mt-4 rounded-xl border border-line bg-paper p-4">
          <p className="font-mono text-[10px] font-bold uppercase text-slate-soft">Excerpt from {selected.file}</p>
          <p className="mt-3 text-sm leading-7 italic text-slate-copy">"{sampleSubmission.excerpt}"</p>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {['Evidence: labelled BMD and SFD', 'Citation: Week 4 Slide 18 referenced', 'Gap: design implication needs stronger reasoning'].map((item) => (
            <div key={item} className="rounded-xl border border-line bg-white p-3 text-sm font-semibold text-slate-copy">{item}</div>
          ))}
        </div>
      </Card>

      <Card className="border-companion/20 bg-companion-tint/60">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Brain size={18} className="text-companion" />
            <div>
              <h3 className="font-display text-lg font-bold">AI-assisted recommendation</h3>
              <p className="text-xs text-slate-soft">Guidance only. No AI output becomes final lecturer feedback automatically.</p>
            </div>
          </div>
          <Badge tone={selected.risk === 'High' ? 'warning' : 'success'}>{selected.risk === 'High' ? 'Manual review required' : 'Confidence: clear but advisory'}</Badge>
        </div>
        <p className="rounded-xl border border-companion/20 bg-white p-4 text-sm leading-7 text-slate-copy">{lecturerAssignmentView.aiRecommendation}</p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            ['Supporting evidence', 'Draft excerpt, rubric criteria, and Week 4 source alignment.'],
            ['Source basis', lecturerAssignmentView.markingGuide],
            ['Uncertainty', selected.risk === 'High' ? 'Sign convention and evidence trace require human review.' : 'No grade should be inferred from this guidance.'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-companion/15 bg-white/80 p-3">
              <p className="font-mono text-[10px] font-bold uppercase text-companion">{label}</p>
              <p className="mt-2 text-xs leading-5 text-slate-copy">{value}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-lg font-bold">Lecturer feedback editor</h3>
            <p className="mt-1 text-sm text-slate-copy">Routine saves use the quiet saved indicator above.</p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => onDecision('edited', 'Edit recommendation')}><Edit3 size={14} />Edit feedback</Button>
        </div>
        {editingFeedback ? (
          <div className="mt-4 space-y-4">
            {rubric.map((item) => (
              <label key={item.title} className="block text-sm font-bold text-ink">
                {item.title}
                <textarea value={rubricFeedback[item.title]} onChange={(event) => onRubricFeedbackChange(item.title, event.target.value)} className="mt-2 min-h-20 w-full rounded-xl border border-line bg-paper p-3 text-sm font-normal leading-6 outline-none focus:border-companion focus:ring-2 focus:ring-companion/20" />
              </label>
            ))}
            <label className="block text-sm font-bold text-ink">
              Overall comments
              <textarea value={feedbackText} onChange={(event) => onFeedbackChange(event.target.value)} rows={5} className="mt-2 w-full rounded-xl border border-line bg-paper p-4 text-sm font-normal leading-6 outline-none focus:border-companion focus:ring-2 focus:ring-companion/20" />
            </label>
            <div className="flex flex-wrap gap-2">
              <Button onClick={onSaveDraft}><Save size={15} />Save draft feedback</Button>
              <Button variant="secondary" onClick={() => onDecision('finalised', 'Finalise feedback')}><CheckCircle2 size={15} />Finalise feedback</Button>
              <Button variant="ghost" onClick={onCancelEdit}>Cancel</Button>
            </div>
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-line bg-paper p-4">
            <p className="text-sm leading-7 text-slate-copy">{feedbackText}</p>
          </div>
        )}
      </Card>

      {decision === 'accepted' && (
        <Card className="border-success/20 bg-success-tint">
          <p className="font-mono text-xs font-bold uppercase text-success">Accepted recommendation - suggested breakdown visible for review</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {finalRubric.map((item) => (
              <div key={item.criterion} className="rounded-xl border border-success/20 bg-white p-4">
                <p className="font-bold">{item.criterion}</p>
                <p className="mt-1 font-mono text-lg font-bold text-success">{item.score}</p>
                <p className="mt-2 text-xs leading-5 text-slate-copy">{item.comment}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <div className="flex items-start gap-3 rounded-xl border border-warn/20 bg-warn-tint p-4">
          <AlertTriangle size={16} className="mt-0.5 shrink-0 text-warn" />
          <div>
            <p className="text-sm font-bold text-ink">Human decision boundary</p>
            <p className="mt-1 text-xs leading-5 text-slate-copy">Accept, edit, override, reject, request revision, save draft, and finalise are lecturer actions. The AI never releases grades or sends feedback.</p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button onClick={() => onDecision('accepted', 'Accept recommendation')}><CheckCircle2 size={15} />Accept recommendation</Button>
          <Button variant="secondary" onClick={() => onDecision('edited', 'Edit recommendation')}><Edit3 size={15} />Edit recommendation</Button>
          <Button variant="secondary" onClick={() => onDecision('overridden', 'Override')}><ShieldCheck size={15} />Override</Button>
          <Button variant="secondary" onClick={() => onDecision('revision', 'Request revision')}><RotateCcw size={15} />Request revision</Button>
          <Button variant="ghost" onClick={() => onDecision('rejected', 'Reject recommendation')}><XCircle size={15} />Reject</Button>
          <Button variant="secondary" onClick={onContact}><Mail size={15} />Contact student</Button>
          <Button variant="ghost" onClick={onReset}><ArrowLeft size={15} />Reset decision</Button>
        </div>
        {decision && (
          <p role="status" className="mt-4 rounded-xl border border-success/20 bg-success-tint px-4 py-3 text-sm font-bold text-success">
            Current local decision: {decision.replace(/([A-Z])/g, ' $1')}. This has not been sent to a server.
          </p>
        )}
      </Card>

      <Card>
        <h3 className="flex items-center gap-2 font-display text-lg font-bold"><History size={17} />Audit/history</h3>
        <div className="mt-4 space-y-2">
          {auditHistory.map((item) => (
            <p key={item} className="rounded-xl border border-line bg-paper p-3 text-xs font-semibold text-slate-copy">{item}</p>
          ))}
        </div>
        <Button className="mt-4" variant="ghost" size="sm" onClick={onBackToQueue}>Return to queue</Button>
      </Card>
    </section>
  );
}
