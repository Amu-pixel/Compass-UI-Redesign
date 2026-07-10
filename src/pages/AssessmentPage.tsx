import {
  AlertTriangle,
  ArrowRight,
  Brain,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  FileText,
  FileUp,
  Info,
  Loader2,
  Lock,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { assignmentBrief, rubric, sampleSubmission, unit } from '../data/mockData';
import { Badge, Button, Card, ConfidenceBadge, Toast } from '../components/ui';
import { cn } from '../utils/classNames';

type UploadState =
  | 'idle'
  | 'selected'
  | 'uploading'
  | 'processing'
  | 'success'
  | 'error';

export default function AssessmentPage() {
  const [draftFile, setDraftFile] = useState<string | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [finalState, setFinalState] = useState<'idle' | 'confirming' | 'submitted'>('idle');
  const [feedback, setFeedback] = useState(false);
  const [rubricOpen, setRubricOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [dragOver, setDragOver] = useState(false);

  function notify(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  }

  function uploadDraft(name: string) {
    setDraftFile(name);
    setUploadState('selected');
    setTimeout(() => {
      setUploadState('uploading');
      setTimeout(() => {
        setUploadState('processing');
        setTimeout(() => {
          setUploadState('success');
          setFeedback(true);
        }, 900);
      }, 700);
    }, 400);
  }

  function handleDrop(event: React.DragEvent) {
    event.preventDefault();
    setDragOver(false);
    uploadDraft('CIVL301_BMD_reflection_draft.pdf');
  }

  function submitFinal() {
    if (uploadState !== 'success') return;
    setFinalState('confirming');
    setTimeout(() => setFinalState('submitted'), 1200);
  }

  const isSubmitted = finalState === 'submitted';

  return (
    <div className="animate-page mx-auto max-w-7xl px-5 py-6 sm:px-8">
      {toast && <Toast message={toast} />}

      {/* ── Page header ── */}
      <div className="mb-6">
        <nav aria-label="Breadcrumb" className="mb-3 flex flex-wrap items-center gap-1.5">
          <Link to="/courses" className="font-mono text-xs font-semibold text-slate-soft hover:text-companion">
            Courses
          </Link>
          <span className="text-xs text-slate-soft">/</span>
          <Link to="/demo" className="font-mono text-xs font-semibold text-slate-soft hover:text-companion">
            {unit.code}
          </Link>
          <span className="text-xs text-slate-soft">/</span>
          <span className="font-mono text-xs font-semibold text-ink">Assessment</span>
        </nav>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs font-semibold uppercase text-companion">
              Assessment — {unit.code}
            </p>
            <h1 className="mt-1 font-display text-3xl font-bold text-ink">
              {assignmentBrief.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Badge tone="warning">Draft closes Monday 9 am</Badge>
              <Badge tone="neutral">Weight: 20%</Badge>
              {isSubmitted && <Badge tone="success">Submitted</Badge>}
              {!isSubmitted && uploadState === 'success' && (
                <Badge tone="ai">Draft ready</Badge>
              )}
            </div>
          </div>
          <ConfidenceBadge />
        </div>
      </div>

      {/* ── Brief + submission timeline ── */}
      <div className="mb-6 grid gap-5 lg:grid-cols-[1fr_340px]">
        {/* Assignment brief */}
        <Card>
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cardinal-tint text-cardinal">
              <ClipboardList size={20} />
            </div>
            <div>
              <p className="font-mono text-xs font-semibold uppercase text-slate-soft">Assignment brief</p>
              <h2 className="mt-1 font-display text-xl font-bold">{assignmentBrief.title}</h2>
            </div>
          </div>
          <p className="mt-4 text-sm font-semibold text-slate-copy">{assignmentBrief.due}</p>
          <p className="mt-4 text-sm leading-7 text-slate-copy">{assignmentBrief.task}</p>

          {/* Requirements */}
          <div className="mt-5 space-y-2">
            {assignmentBrief.requirements.map((req, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl bg-paper p-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-companion-tint font-mono text-[10px] font-bold text-companion">
                  {i + 1}
                </span>
                <p className="text-sm leading-5 text-ink">{req}</p>
              </div>
            ))}
          </div>

          {/* Rubric accordion */}
          <button
            type="button"
            aria-expanded={rubricOpen}
            aria-controls="rubric-preview"
            onClick={() => setRubricOpen((v) => !v)}
            className="mt-5 flex w-full items-center justify-between rounded-xl border border-line bg-paper px-4 py-3 text-sm font-semibold text-ink hover:border-companion hover:bg-companion-tint transition"
          >
            <span className="flex items-center gap-2">
              <ClipboardList size={15} className="text-companion" />
              Marking rubric (4 criteria)
            </span>
            {rubricOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>

          {rubricOpen && (
            <div id="rubric-preview" className="mt-3 grid gap-3 sm:grid-cols-2">
              {rubric.map((item) => (
                <div key={item.title} className="rounded-xl border border-line bg-white p-4">
                  <p className="font-display text-sm font-bold text-ink">{item.title}</p>
                  <p className="mt-2 text-xs leading-5 text-slate-copy">{item.improvement}</p>
                  <p className="mt-2 font-mono text-[10px] font-semibold text-companion">
                    Direction: {item.direction}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Submission timeline */}
        <div className="space-y-4">
          {/* Current submission status */}
          <Card>
            <p className="font-mono text-xs font-semibold uppercase text-slate-soft">Submission status</p>
            <div className="mt-4 space-y-3">
              {[
                {
                  label: 'Draft upload',
                  detail: 'AI formative feedback',
                  done: uploadState === 'success' || isSubmitted,
                },
                {
                  label: 'AI feedback available',
                  detail: 'After draft upload',
                  done: feedback,
                },
                {
                  label: 'Final submission',
                  detail: 'Due Friday 5:00 pm',
                  done: isSubmitted,
                },
                {
                  label: 'Lecturer marking',
                  detail: 'After final submission',
                  done: false,
                },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className={cn(
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold',
                      step.done
                        ? 'bg-success text-white'
                        : 'bg-paper-dim text-slate-soft',
                    )}
                  >
                    {step.done ? <CheckCircle2 size={14} /> : i + 1}
                  </div>
                  <div>
                    <p className={cn('text-sm font-semibold', step.done ? 'text-ink' : 'text-slate-soft')}>
                      {step.label}
                    </p>
                    <p className="text-xs text-slate-soft">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Sample submission excerpt */}
          <Card className="border-companion/20 bg-companion-tint/40">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-companion-tint text-companion">
                <FileText size={16} />
              </div>
              <div>
                <p className="font-mono text-xs font-semibold uppercase text-slate-soft">Your draft excerpt</p>
                <p className="mt-1 font-semibold text-ink">{sampleSubmission.filename}</p>
              </div>
            </div>
            <p className="mt-4 rounded-xl bg-white/70 p-4 text-sm leading-7 italic text-slate-copy">
              "{sampleSubmission.excerpt}"
            </p>
          </Card>
        </div>
      </div>

      {/* ── Upload + final submission ── */}
      <div className="mb-6 grid gap-5 xl:grid-cols-2">
        {/* Draft upload */}
        <Card>
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-companion-tint text-companion">
              <FileUp size={20} />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold">Draft Submission</h2>
              <p className="text-sm text-slate-copy">AI formative feedback — not final marking</p>
            </div>
          </div>

          {/* Upload zone */}
          <button
            type="button"
            aria-label="Simulate draft upload for AI formative feedback"
            onClick={() => uploadDraft('CIVL301_BMD_reflection_draft.pdf')}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            disabled={uploadState === 'uploading' || uploadState === 'processing'}
            className={cn(
              'mt-6 flex min-h-48 w-full flex-col items-center justify-center rounded-[24px] border-2 border-dashed text-center transition',
              dragOver && 'border-companion bg-companion-tint',
              uploadState === 'idle' &&
                !dragOver &&
                'border-line bg-paper hover:border-companion hover:bg-companion-tint',
              uploadState === 'selected' && 'border-companion bg-companion-tint',
              (uploadState === 'uploading' || uploadState === 'processing') &&
                'border-companion/50 bg-companion-tint cursor-wait',
              uploadState === 'success' && 'border-success/40 bg-success-tint cursor-default',
              uploadState === 'error' && 'border-danger/40 bg-danger-tint',
            )}
          >
            {uploadState === 'idle' && (
              <>
                <FileUp className="mb-3 text-companion" size={34} />
                <span className="font-bold text-ink">Drag and drop your draft, or click to select</span>
                <span className="mt-2 text-sm text-slate-copy">PDF, DOCX, or image · Simulated upload</span>
              </>
            )}
            {uploadState === 'selected' && (
              <>
                <FileText className="mb-3 text-companion" size={34} />
                <span className="font-bold text-ink">File selected</span>
                <span className="mt-2 text-sm text-slate-soft">CIVL301_BMD_reflection_draft.pdf</span>
              </>
            )}
            {uploadState === 'uploading' && (
              <>
                <Loader2 className="mb-3 animate-spin text-companion" size={34} />
                <span className="font-bold text-companion">Uploading…</span>
                <span className="mt-2 text-sm text-slate-soft">Transferring file securely</span>
              </>
            )}
            {uploadState === 'processing' && (
              <>
                <Sparkles className="mb-3 text-companion" size={34} />
                <span className="font-bold text-companion">Analysing against approved rubric…</span>
                <span className="mt-2 text-sm text-slate-soft">Checking lecturer-approved marking criteria</span>
              </>
            )}
            {uploadState === 'success' && (
              <>
                <CheckCircle2 className="mb-3 text-success" size={34} />
                <span className="font-bold text-success">Draft received — formative feedback ready</span>
                <span className="mt-2 text-sm text-slate-copy">CIVL301_BMD_reflection_draft.pdf</span>
              </>
            )}
            {uploadState === 'error' && (
              <>
                <AlertTriangle className="mb-3 text-danger" size={34} />
                <span className="font-bold text-danger">Upload failed — please try again</span>
              </>
            )}
          </button>

          {draftFile && uploadState === 'success' && (
            <div className="mt-4 flex items-center gap-3 rounded-xl bg-success-tint p-4 border border-success/20">
              <CheckCircle2 size={18} className="shrink-0 text-success" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink">{draftFile}</p>
                <p className="text-xs text-slate-soft">PDF document · formative review only</p>
              </div>
              <button
                type="button"
                aria-label="Remove uploaded draft"
                onClick={() => {
                  setDraftFile(null);
                  setUploadState('idle');
                  setFeedback(false);
                }}
                className="rounded-full p-1 text-slate-soft hover:bg-white hover:text-danger"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Academic integrity notice */}
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-success/20 bg-success-tint p-4">
            <ShieldCheck size={18} className="mt-0.5 shrink-0 text-success" />
            <div>
              <p className="text-sm font-bold text-ink">AI facilitates learning, not assessment completion</p>
              <p className="mt-1 text-xs leading-5 text-slate-copy">
                Feedback identifies what to revisit and how to deepen reasoning. It never writes
                sentences, solves assessment questions, or provides marks.
              </p>
            </div>
          </div>
        </Card>

        {/* Final submission */}
        <Card>
          <h2 className="font-display text-xl font-bold">Final Submission</h2>
          <p className="mt-2 text-sm leading-6 text-slate-copy">
            Upload the final version when ready. After final submission, AI formative feedback is
            no longer available for this attempt.
          </p>

          {isSubmitted ? (
            <div className="mt-6 rounded-[24px] border border-success/20 bg-success-tint p-6 text-center">
              <CheckCircle2 className="mx-auto mb-3 text-success" size={36} />
              <p className="font-display text-xl font-bold text-success">Submission confirmed</p>
              <p className="mt-2 text-sm text-slate-copy">
                CIVL301_Assignment2_DavidChen_Final.pdf · submitted successfully
              </p>
              <p className="mt-4 text-xs leading-5 text-slate-copy">
                Your final submission is now awaiting lecturer marking. AI formative feedback is no
                longer available for this attempt. Official feedback will be released within 15 working
                days.
              </p>
              <div className="mt-5">
                <Button to="/demo" variant="secondary">
                  Return to unit <ArrowRight size={15} />
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Final upload zone */}
              <div
                className={cn(
                  'mt-6 rounded-[24px] border-2 border-dashed p-6 text-center transition',
                  uploadState === 'success'
                    ? 'border-cardinal/30 bg-cardinal-tint'
                    : 'border-line bg-paper opacity-60',
                )}
              >
                <FileUp
                  className={cn(
                    'mx-auto mb-3',
                    uploadState === 'success' ? 'text-cardinal' : 'text-slate-soft',
                  )}
                  size={30}
                />
                <p className="font-bold text-ink">
                  {uploadState === 'success'
                    ? 'CIVL301_Assignment2_DavidChen_Final.pdf'
                    : 'Complete draft submission first'}
                </p>
                <p className="mt-2 text-sm text-slate-copy">
                  {uploadState === 'success'
                    ? 'Ready to submit · final version'
                    : 'Upload and receive AI feedback before final submission'}
                </p>
                {uploadState !== 'success' && (
                  <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-soft">
                    <Lock size={12} />
                    Final submission locked until draft feedback received
                  </div>
                )}
              </div>

              {/* Submit button */}
              <div className="mt-5">
                {finalState === 'confirming' ? (
                  <div className="flex items-center justify-center gap-2 rounded-full bg-cardinal px-6 py-3 text-sm font-semibold text-white">
                    <Loader2 size={16} className="animate-spin" />
                    Submitting…
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    onClick={submitFinal}
                    disabled={uploadState !== 'success'}
                    className="w-full justify-center"
                  >
                    <CheckCircle2 size={16} />
                    Submit final assignment
                  </Button>
                )}
              </div>

              {uploadState !== 'success' && (
                <p className="mt-3 text-center text-xs text-slate-soft">
                  Upload a draft and receive AI feedback before final submission is enabled.
                </p>
              )}
            </>
          )}

          {/* Submission flow steps */}
          {!isSubmitted && (
            <div className="mt-6 grid gap-2">
              {[
                'Student final submission',
                'Submission complete',
                'Lecturer marking',
                'Official feedback released',
              ].map((step, index) => (
                <div key={step} className="flex items-center gap-3 rounded-xl bg-paper p-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white font-mono text-xs font-bold text-companion border border-line shadow-sm">
                    {index + 1}
                  </span>
                  <span className="text-sm font-semibold text-slate-copy">{step}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* ── AI formative feedback ── */}
      {feedback && !isSubmitted && (
        <section className="mt-2">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <Badge tone="ai">AI formative feedback</Badge>
              <h2 className="mt-2 font-display text-2xl font-bold">
                Student-facing feedback — draft review
              </h2>
              <p className="mt-1 text-sm text-slate-copy">
                This feedback identifies what to revisit. It does not provide marks or assessment
                answers.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-success/20 bg-success-tint px-4 py-2">
              <ShieldCheck size={15} className="text-success" />
              <p className="text-xs font-bold text-success">Academic integrity enforced</p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
            {rubric.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-line bg-white p-5 shadow-sm"
              >
                <h3 className="font-display text-lg font-bold">{item.title}</h3>
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-xs font-bold text-success">What is working</p>
                    <p className="mt-1 text-sm leading-6 text-slate-copy">{item.positive}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-warn">Develop further</p>
                    <p className="mt-1 text-sm leading-6 text-slate-copy">{item.improvement}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-companion">Suggested direction</p>
                    <p className="mt-1 text-sm leading-6 text-slate-copy">{item.direction}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button to="/demo/learn" variant="ai">
              <Brain size={15} /> Discuss feedback with AI Tutor
            </Button>
            <Button variant="secondary" onClick={() => notify('Feedback saved to your student record.')}>
              <CheckCircle2 size={15} /> Acknowledge feedback
            </Button>
          </div>
        </section>
      )}

      {/* ── Quiz section ── */}
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Online Quizzes</h2>
          <Badge tone="neutral">Quiz 5 opens Wednesday</Badge>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {[1, 2, 3, 4, 5].map((quiz) => {
            const submitted = quiz < 5;
            const isCurrent = quiz === 5;
            return (
              <div
                key={quiz}
                className={cn(
                  'rounded-2xl border p-4',
                  submitted && 'border-success/20 bg-success-tint',
                  isCurrent && 'border-companion/25 bg-companion-tint',
                )}
              >
                <p className="font-mono text-xs font-semibold uppercase text-slate-soft">
                  Quiz {quiz}
                </p>
                <p className="mt-2 text-sm font-bold text-ink">
                  {submitted
                    ? quiz === 1
                      ? 'Loads and supports'
                      : quiz === 2
                      ? 'Equilibrium review'
                      : quiz === 3
                      ? 'Shear diagrams'
                      : 'Shear applications'
                    : 'Bending moments'}
                </p>
                {submitted && (
                  <div className="mt-3 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-success" />
                    <span className="text-xs font-semibold text-success">Complete</span>
                  </div>
                )}
                {isCurrent && (
                  <div className="mt-3">
                    <div className="flex items-center gap-2 rounded-lg border border-dashed border-companion/30 bg-white/60 px-3 py-2">
                      <Info size={13} className="text-companion" />
                      <p className="text-[11px] font-semibold text-slate-copy">Opens Wednesday</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-4 rounded-xl border border-dashed border-companion/30 bg-companion-tint/50 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-companion shadow-sm">
              <Sparkles size={16} />
            </div>
            <div>
              <p className="text-sm font-bold text-ink">Quiz 5 — Bending Moment Diagrams</p>
              <p className="mt-1 text-xs leading-5 text-slate-copy">
                This quiz opens Wednesday and will be available as an interactive graded question set
                grounded in approved unit content. The AI Tutor can help you practise in the meantime.
              </p>
              <div className="mt-3">
                <Button to="/demo/learn" variant="secondary" size="sm">
                  <Brain size={13} /> Practise with AI Tutor
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
