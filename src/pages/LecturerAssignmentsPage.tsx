import {
  AlertTriangle,
  BarChart3,
  Brain,
  CheckCircle2,
  ClipboardCheck,
  Edit3,
  FileText,
  Info,
  Loader2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';
import {
  assignmentBrief,
  finalRubric,
  lecturerAssignmentView,
  rubric,
  sampleSubmission,
  unit,
} from '../data/mockData';
import { Badge, Button, Card, ConfidenceBadge, Toast } from '../components/ui';
import { cn } from '../utils/classNames';

type Decision = '' | 'accepted' | 'edited' | 'overridden' | 'rejected';

export default function LecturerAssignmentsPage() {
  const [toast, setToast] = useState('');
  const [selected, setSelected] = useState(lecturerAssignmentView.finalSubmissions[0]);
  const [decision, setDecision] = useState<Decision>('');
  const [editingFeedback, setEditingFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function notify(message: string) {
    setToast(message);
    setTimeout(() => setToast(''), 2200);
  }

  function handleDecision(action: Decision, label: string) {
    if (action === 'edited') {
      setEditingFeedback(true);
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setDecision(action);
      setSubmitting(false);
      notify(`${label} recorded for ${selected.student}`);
    }, 900);
  }

  function submitEditedFeedback() {
    if (!feedbackText.trim()) {
      notify('Please enter your feedback before saving.');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setDecision('edited');
      setEditingFeedback(false);
      setSubmitting(false);
      notify(`Edited feedback saved for ${selected.student}`);
    }, 900);
  }

  return (
    <div className="animate-page mx-auto max-w-7xl px-5 py-6 sm:px-8">
      {toast && <Toast message={toast} />}

      {/* ── Page header ── */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-semibold uppercase text-companion">
            Lecturer workspace — {unit.code}
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold text-ink">
            Final submissions and AI recommendations
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-copy">
            {assignmentBrief.title} · {lecturerAssignmentView.finalSubmissions.length} submissions
          </p>
        </div>
        <ConfidenceBadge />
      </div>

      {/* ── Cohort signals ── */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        {[
          { icon: Users, label: 'Submissions', value: '3', sub: 'of 28 enrolled', tone: 'blue' },
          { icon: CheckCircle2, label: 'Ready to mark', value: '1', sub: 'no flags', tone: 'green' },
          { icon: Sparkles, label: 'AI recommended', value: '1', sub: 'review required', tone: 'purple' },
          { icon: AlertTriangle, label: 'Lecturer action', value: '1', sub: 'manual review needed', tone: 'amber' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-4 rounded-2xl border border-line bg-white p-4 shadow-sm"
          >
            <div
              className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                stat.tone === 'blue' && 'bg-companion-tint text-companion',
                stat.tone === 'green' && 'bg-success-tint text-success',
                stat.tone === 'purple' && 'bg-[#f3e8ff] text-ai-violet',
                stat.tone === 'amber' && 'bg-warn-tint text-warn',
              )}
            >
              <stat.icon size={18} />
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-ink">{stat.value}</p>
              <p className="text-xs font-semibold text-slate-copy">{stat.label}</p>
              <p className="text-xs text-slate-soft">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main layout ── */}
      <div className="grid gap-5 xl:grid-cols-[300px_1fr]">
        {/* Submission queue */}
        <Card className="h-fit">
          <p className="mb-4 font-mono text-xs font-semibold uppercase text-slate-soft">
            Submission queue
          </p>
          <div className="space-y-3">
            {lecturerAssignmentView.finalSubmissions.map((submission) => {
              const isSelected = selected.file === submission.file;
              return (
                <button
                  key={submission.file}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => {
                    setSelected(submission);
                    setDecision('');
                    setEditingFeedback(false);
                    setFeedbackText('');
                  }}
                  className={cn(
                    'w-full rounded-xl border p-4 text-left transition',
                    isSelected
                      ? 'border-companion bg-companion-tint'
                      : 'border-line hover:border-companion hover:bg-companion-tint/40',
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-ink">{submission.student}</p>
                    {submission.status === 'Ready for marking' && (
                      <span className="shrink-0 rounded-full bg-success-tint px-2 py-0.5 font-mono text-[10px] font-bold text-success border border-success/20">
                        Ready
                      </span>
                    )}
                    {submission.status === 'AI recommendation generated' && (
                      <span className="shrink-0 rounded-full bg-companion-tint px-2 py-0.5 font-mono text-[10px] font-bold text-companion border border-companion/20">
                        AI rec.
                      </span>
                    )}
                    {submission.status === 'Lecturer review required' && (
                      <span className="shrink-0 rounded-full bg-warn-tint px-2 py-0.5 font-mono text-[10px] font-bold text-warn border border-warn/20">
                        Review
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-soft">{submission.file}</p>
                  <p className="mt-1 font-mono text-[10px] font-semibold text-slate-soft">
                    {submission.submitted}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Cohort analytics CTA */}
          <div className="mt-5 rounded-xl border border-dashed border-line bg-paper p-4">
            <div className="flex items-center gap-2">
              <BarChart3 size={15} className="text-companion" />
              <p className="text-sm font-bold text-ink">Cohort signals</p>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-copy">
              71% quiz accuracy on moment maxima. 42% of Week 4 questions relate to BMDs.
            </p>
            <button
              type="button"
              onClick={() => notify('Full cohort analytics are available in the Lecturer Dashboard.')}
              className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-companion hover:underline"
            >
              <TrendingUp size={12} /> View dashboard analytics
            </button>
          </div>
        </Card>

        {/* Review workspace */}
        <section className="space-y-5">
          {/* Selected submission header */}
          <Card>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs font-semibold uppercase text-slate-soft">
                  Selected submission
                </p>
                <h2 className="mt-1 font-display text-2xl font-bold text-ink">{selected.student}</h2>
                <p className="mt-1 text-sm text-slate-copy">
                  {selected.file} · submitted {selected.submitted}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {decision === 'accepted' && (
                  <Badge tone="success">Recommendation accepted</Badge>
                )}
                {decision === 'edited' && (
                  <Badge tone="success">Feedback edited and saved</Badge>
                )}
                {decision === 'overridden' && (
                  <Badge tone="warning">Overridden by lecturer</Badge>
                )}
                {decision === 'rejected' && (
                  <Badge tone="danger">Recommendation rejected</Badge>
                )}
                {decision === '' && (
                  <span className="rounded-full border border-success/20 bg-success-tint px-4 py-2 text-sm font-bold text-success">
                    {selected.status}
                  </span>
                )}
              </div>
            </div>
          </Card>

          {/* Brief + excerpt */}
          <div className="grid gap-5 lg:grid-cols-2">
            <Card>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cardinal-tint text-cardinal">
                  <FileText size={16} />
                </div>
                <h3 className="font-display text-lg font-bold">Assignment brief</h3>
              </div>
              <p className="mt-4 font-semibold text-ink">{assignmentBrief.title}</p>
              <p className="mt-3 text-sm leading-6 text-slate-copy">{assignmentBrief.task}</p>
            </Card>
            <Card>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-companion-tint text-companion">
                  <ClipboardCheck size={16} />
                </div>
                <h3 className="font-display text-lg font-bold">Student draft excerpt</h3>
              </div>
              <div className="mt-4 rounded-xl bg-paper p-4">
                <p className="text-sm leading-7 italic text-slate-copy">
                  "{sampleSubmission.excerpt}"
                </p>
              </div>
            </Card>
          </div>

          {/* AI formative feedback context */}
          <Card>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-companion-tint text-companion">
                <ShieldCheck size={16} />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold">AI formative feedback — student received</h3>
                <p className="text-xs text-slate-soft">Context only — not a mark · lecturer judgement required</p>
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {rubric.map((item) => (
                <div key={item.title} className="rounded-xl bg-paper p-4">
                  <p className="font-bold text-ink">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-copy">{item.improvement}</p>
                  <p className="mt-2 font-mono text-xs font-semibold text-companion">
                    Direction: {item.direction}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* AI recommendation */}
          <Card>
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-companion-tint text-companion">
                  <Brain size={16} />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold">Lecturer-side AI recommendation</h3>
                  <p className="text-xs text-slate-soft">AI-generated · requires lecturer review and approval</p>
                </div>
              </div>
              {/* Confidence indicator */}
              <div className="flex items-center gap-2 rounded-xl border border-success/20 bg-success-tint px-3 py-2">
                <div className="h-2 w-2 rounded-full bg-success" />
                <p className="font-mono text-[11px] font-semibold text-success">High confidence</p>
              </div>
            </div>

            {/* Recommendation box */}
            <div className="rounded-xl border border-companion/20 bg-companion-tint p-5">
              <div className="flex items-start gap-2">
                <Sparkles size={15} className="mt-0.5 shrink-0 text-companion" />
                <p className="text-sm leading-7 text-slate-copy">
                  {lecturerAssignmentView.aiRecommendation}
                </p>
              </div>
            </div>

            {/* Evidence / marking guide */}
            <div className="mt-4 rounded-xl bg-paper p-5">
              <div className="flex items-center gap-2">
                <Info size={14} className="text-slate-soft" />
                <p className="font-semibold text-ink">Marking guide context</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-copy">
                {lecturerAssignmentView.markingGuide}
              </p>
            </div>

            {/* Final rubric — shown after acceptance */}
            {decision === 'accepted' && (
              <div className="mt-5">
                <p className="mb-3 font-mono text-xs font-semibold uppercase text-slate-soft">
                  Accepted — suggested grade breakdown
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {finalRubric.map((item) => (
                    <div key={item.criterion} className="rounded-xl border border-success/20 bg-success-tint p-4">
                      <p className="font-bold text-ink">{item.criterion}</p>
                      <p className="mt-1 font-mono text-lg font-bold text-success">{item.score}</p>
                      <p className="mt-2 text-xs leading-5 text-slate-copy">{item.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Feedback editor */}
            {editingFeedback && (
              <div className="mt-5">
                <p className="mb-2 font-mono text-xs font-semibold uppercase text-slate-soft">
                  Edit feedback
                </p>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  rows={5}
                  aria-label="Edit student feedback"
                  placeholder="Enter your feedback for this student…"
                  className="w-full rounded-xl border border-line bg-paper p-4 text-sm leading-6 text-ink outline-none focus:border-companion"
                />
                <div className="mt-3 flex gap-2">
                  {submitting ? (
                    <div className="flex items-center gap-2 text-sm font-semibold text-companion">
                      <Loader2 size={15} className="animate-spin" /> Saving…
                    </div>
                  ) : (
                    <>
                      <Button onClick={submitEditedFeedback}>
                        <CheckCircle2 size={15} /> Save feedback
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setEditingFeedback(false)}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Human review boundary */}
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-warn/20 bg-warn-tint p-4">
              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-warn" />
              <div>
                <p className="text-sm font-bold text-ink">Human review boundary</p>
                <p className="mt-1 text-xs leading-5 text-slate-copy">
                  The AI recommendation is advisory only. All grades, feedback, and decisions are the
                  sole responsibility of the lecturer. Accept, edit, or override below.
                </p>
              </div>
            </div>

            {/* Decision actions */}
            {!editingFeedback && decision === '' && (
              <div className="mt-5">
                <p className="mb-3 font-mono text-xs font-semibold uppercase text-slate-soft">
                  Lecturer decision
                </p>
                <div className="flex flex-wrap gap-2">
                  {submitting ? (
                    <div className="flex items-center gap-2 text-sm font-semibold text-companion">
                      <Loader2 size={15} className="animate-spin" /> Recording decision…
                    </div>
                  ) : (
                    <>
                      <Button
                        variant="primary"
                        onClick={() => handleDecision('accepted', 'Accept recommendation')}
                      >
                        <CheckCircle2 size={15} /> Accept recommendation
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => handleDecision('edited', 'Edit feedback')}
                      >
                        <Edit3 size={15} /> Edit feedback
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => handleDecision('overridden', 'Override')}
                      >
                        <ShieldCheck size={15} /> Override
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleDecision('rejected', 'Reject recommendation')}
                      >
                        <XCircle size={15} /> Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Post-decision actions */}
            {decision !== '' && !editingFeedback && (
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <div
                  className={cn(
                    'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold',
                    decision === 'accepted' &&
                      'border border-success/20 bg-success-tint text-success',
                    decision === 'edited' &&
                      'border border-success/20 bg-success-tint text-success',
                    decision === 'overridden' &&
                      'border border-warn/20 bg-warn-tint text-warn',
                    decision === 'rejected' &&
                      'border border-danger/20 bg-danger-tint text-danger',
                  )}
                >
                  <CheckCircle2 size={15} />
                  Decision recorded
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setDecision('');
                    setFeedbackText('');
                  }}
                >
                  Reset decision
                </Button>
              </div>
            )}
          </Card>
        </section>
      </div>
    </div>
  );
}
