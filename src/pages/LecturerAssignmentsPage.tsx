import { CheckCircle2, ClipboardCheck, Edit3, FileText, ShieldCheck, XCircle } from 'lucide-react';
import { useState } from 'react';
import { assignmentBrief, lecturerAssignmentView, rubric, sampleSubmission } from '../data/mockData';
import { Button, Card, ConfidenceBadge, Toast } from '../components/ui';

export default function LecturerAssignmentsPage() {
  const [toast, setToast] = useState('');
  const [selected, setSelected] = useState(lecturerAssignmentView.finalSubmissions[0]);

  function notify(message: string) {
    setToast(message);
    setTimeout(() => setToast(''), 1800);
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
      {toast && <Toast message={toast} />}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-xs font-semibold uppercase text-companion">Lecturer Assignments</p>
          <h2 className="font-display text-3xl font-bold">Final submissions and AI feedback recommendations</h2>
        </div>
        <ConfidenceBadge />
      </div>

      <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
        <Card className="h-fit">
          <h3 className="font-display text-xl font-bold">Final submissions</h3>
          <div className="mt-5 space-y-3">
            {lecturerAssignmentView.finalSubmissions.map((submission) => (
              <button
                key={submission.file}
                type="button"
                aria-pressed={selected.file === submission.file}
                onClick={() => setSelected(submission)}
                className={`w-full rounded-2xl border p-4 text-left transition ${selected.file === submission.file ? 'border-companion bg-companion-tint' : 'border-line hover:border-companion'}`}
              >
                <p className="font-bold">{submission.student}</p>
                <p className="mt-1 text-xs text-slate-copy">{submission.file}</p>
                <p className="mt-2 font-mono text-[11px] font-semibold text-companion">{submission.status}</p>
              </button>
            ))}
          </div>
        </Card>

        <section className="space-y-5">
          <Card>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs font-semibold uppercase text-slate-soft">Selected final submission</p>
                <h3 className="mt-1 font-display text-2xl font-bold">{selected.student}</h3>
                <p className="mt-2 text-sm text-slate-copy">{selected.file} · submitted {selected.submitted}</p>
              </div>
              <div className="rounded-full bg-success-tint px-4 py-2 text-sm font-bold text-success">{selected.status}</div>
            </div>
          </Card>

          <div className="grid gap-5 lg:grid-cols-2">
            <Card>
              <div className="flex items-center gap-3">
                <FileText className="text-cardinal" />
                <h3 className="font-display text-xl font-bold">Assignment brief</h3>
              </div>
              <p className="mt-4 font-bold">{assignmentBrief.title}</p>
              <p className="mt-3 text-sm leading-6 text-slate-copy">{assignmentBrief.task}</p>
            </Card>
            <Card>
              <div className="flex items-center gap-3">
                <ClipboardCheck className="text-companion" />
                <h3 className="font-display text-xl font-bold">Student draft excerpt</h3>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-copy">"{sampleSubmission.excerpt}"</p>
            </Card>
          </div>

          <Card>
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-companion" />
              <h3 className="font-display text-xl font-bold">AI formative feedback context</h3>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-copy">
              This shows the formative feedback the AI gave the student during draft review. It is useful context for the lecturer, but it is not a mark and does not replace lecturer judgement.
            </p>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {rubric.map((item) => (
                <div key={item.title} className="rounded-2xl bg-paper p-4">
                  <p className="font-bold">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-copy">{item.improvement}</p>
                  <p className="mt-2 font-mono text-xs font-semibold text-companion">Revisit: {item.direction}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-display text-xl font-bold">Lecturer-side AI recommendation</h3>
            <div className="mt-4 rounded-2xl border border-companion/20 bg-companion-tint p-4">
              <p className="text-sm leading-6 text-slate-copy">{lecturerAssignmentView.aiRecommendation}</p>
            </div>
            <div className="mt-4 rounded-2xl bg-paper p-4">
              <p className="font-bold">Marking guide available to AI</p>
              <p className="mt-2 text-sm leading-6 text-slate-copy">{lecturerAssignmentView.markingGuide}</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {[
                ['Accept recommendation', CheckCircle2],
                ['Edit feedback', Edit3],
                ['Override', ShieldCheck],
                ['Reject', XCircle],
              ].map(([label, Icon]) => {
                const TypedIcon = Icon as typeof CheckCircle2;
                return (
                  <Button key={label as string} variant={label === 'Reject' ? 'ghost' : 'secondary'} onClick={() => notify(`${label} recorded`)}>
                    <TypedIcon size={16} />
                    {label as string}
                  </Button>
                );
              })}
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
