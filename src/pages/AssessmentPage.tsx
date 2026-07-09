import { CheckCircle2, ClipboardList, FileText, FileUp, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { assignmentBrief, rubric, sampleSubmission } from '../data/mockData';
import { Card, ConfidenceBadge, LoadingPill } from '../components/ui';

export default function AssessmentPage() {
  const [draftFile, setDraftFile] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [feedback, setFeedback] = useState(false);

  function uploadDraft(name: string) {
    setDraftFile(name);
    setProcessing(true);
    setFeedback(false);
    setTimeout(() => {
      setProcessing(false);
      setFeedback(true);
    }, 1100);
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-xs font-semibold uppercase text-companion">Assessment Feedback Mode</p>
          <h2 className="font-display text-3xl font-bold">Draft feedback before final submission</h2>
        </div>
        <ConfidenceBadge />
      </div>

      <div className="mb-6 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-cardinal-tint p-3 text-cardinal"><ClipboardList size={22} /></div>
            <div>
              <p className="font-mono text-xs font-semibold uppercase text-slate-soft">Sample assignment brief</p>
              <h3 className="font-display text-xl font-bold">{assignmentBrief.title}</h3>
            </div>
          </div>
          <p className="mt-4 text-sm font-semibold text-slate-copy">{assignmentBrief.due}</p>
          <p className="mt-4 text-sm leading-6 text-slate-copy">{assignmentBrief.task}</p>
          <div className="mt-5 space-y-2">
            {assignmentBrief.requirements.map((requirement) => (
              <div key={requirement} className="rounded-2xl bg-paper p-3 text-sm font-semibold">{requirement}</div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-companion-tint p-3 text-companion"><FileText size={22} /></div>
            <div>
              <p className="font-mono text-xs font-semibold uppercase text-slate-soft">Sample student submission</p>
              <h3 className="font-display text-xl font-bold">{sampleSubmission.filename}</h3>
            </div>
          </div>
          <div className="mt-5 rounded-2xl bg-paper p-4">
            <p className="text-sm leading-7 text-slate-copy">"{sampleSubmission.excerpt}"</p>
          </div>
          <p className="mt-4 text-xs leading-5 text-slate-copy">
            Demo note: students see their brief, their draft, and formative feedback. Lecturer marking guides and lecturer-side approval controls are not shown here.
          </p>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-companion-tint p-3 text-companion"><FileUp size={22} /></div>
            <div>
              <h3 className="font-display text-xl font-bold">Draft Submission</h3>
              <p className="text-sm text-slate-copy">AI Formative Feedback, never AI marking</p>
            </div>
          </div>
          <button
            onClick={() => uploadDraft('CIVL301_BMD_reflection_draft.pdf')}
            className="mt-6 flex min-h-52 w-full flex-col items-center justify-center rounded-[28px] border-2 border-dashed border-line bg-paper text-center transition hover:border-companion hover:bg-companion-tint"
          >
            <FileUp className="mb-3 text-companion" size={34} />
            <span className="font-bold">Drag and drop draft, section, calculation image, or PDF</span>
            <span className="mt-2 text-sm text-slate-copy">Click to simulate upload</span>
          </button>
          {draftFile && (
            <div className="mt-5 rounded-2xl bg-paper p-4">
              <p className="font-semibold">{draftFile}</p>
              <p className="text-sm text-slate-copy">PDF document · formative review only</p>
              {processing && <div className="mt-3"><LoadingPill label="Analysing against approved rubric" /></div>}
            </div>
          )}
          <div className="mt-5 rounded-2xl border border-success/20 bg-success-tint p-4">
            <div className="flex items-center gap-2 font-bold text-success"><ShieldCheck size={18} /> AI Facilitates Learning, Not Assessment Completion</div>
            <p className="mt-2 text-sm leading-6 text-slate-copy">Feedback identifies what to revisit and how to deepen reasoning. It never writes sentences, solves assessment questions, or gives marks.</p>
          </div>
        </Card>

        <Card>
          <h3 className="font-display text-xl font-bold">Final Submission</h3>
          <p className="mt-2 text-sm leading-6 text-slate-copy">Upload the final version when ready. After final submission, there is no further AI discussion or drafting support.</p>
          <div className="mt-6 grid gap-3">
            {['Student final submission', 'Submission complete', 'Lecturer marking', 'Official feedback released'].map((step, index) => (
              <div key={step} className="flex items-center gap-3 rounded-2xl bg-paper p-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white font-mono text-xs font-bold text-companion">{index + 1}</span>
                <span className="font-semibold">{step}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-[28px] border-2 border-dashed border-line bg-paper p-6 text-center">
            <FileUp className="mx-auto mb-3 text-cardinal" size={32} />
            <p className="font-bold">Final report upload area</p>
            <p className="mt-2 text-sm text-slate-copy">Final_Report_CIVL301.pdf · ready to submit</p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-success-tint px-4 py-2 text-sm font-bold text-success">
              <CheckCircle2 size={16} />
              Submission complete
            </div>
            <p className="mt-4 text-xs leading-5 text-slate-copy">Your final submission is now awaiting lecturer marking. AI formative feedback is no longer available for this attempt.</p>
          </div>
        </Card>
      </div>

      {feedback && (
        <section className="mt-6">
          <h3 className="mb-4 font-display text-2xl font-bold">Student-facing AI formative feedback</h3>
          <div className="grid gap-4 lg:grid-cols-4">
            {rubric.map((item) => (
              <Card key={item.title}>
                <h4 className="font-display text-lg font-bold">{item.title}</h4>
                <p className="mt-4 text-sm font-bold text-success">What is working</p>
                <p className="mt-1 text-sm leading-6 text-slate-copy">{item.positive}</p>
                <p className="mt-4 text-sm font-bold text-warn">Develop further</p>
                <p className="mt-1 text-sm leading-6 text-slate-copy">{item.improvement}</p>
                <p className="mt-4 text-sm font-bold text-companion">Suggested direction</p>
                <p className="mt-1 text-sm leading-6 text-slate-copy">{item.direction}</p>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
