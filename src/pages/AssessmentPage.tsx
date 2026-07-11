import {
  AlertTriangle,
  ArrowRight,
  Brain,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Download,
  FileText,
  FileUp,
  GraduationCap,
  Info,
  Loader2,
  Lock,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ContactLecturerDialog from '../components/ContactLecturerDialog';
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

type DraftDemoState = 'empty' | 'processing' | 'feedback' | 'ready' | 'lecturer';

type DraftVersion = {
  version: number;
  filename: string;
  fileType: string;
  fileSize: string;
  uploadedAt: string;
  note: string;
};

const sampleDraftDetails = {
  filename: 'CIVL301_Assignment2_Sample_Draft_v2.pdf',
  uploaded: '10 July 2026, 2:14 pm',
  words: '1,284 words',
  version: 'Version 2',
  status: 'Formative review complete',
};

const sampleRubricFeedback = [
  {
    criterion: 'Diagram construction',
    evidence: 'The draft labels reactions and identifies the centre-span moment peak.',
    band: 'Developing toward Distinction',
    gap: 'The signed shear area is not annotated between key points.',
    action: 'Add two area annotations and link each to the change in moment.',
    resource: 'Week 4 Slide 18 - Interactive diagram',
  },
  {
    criterion: 'Calculation accuracy',
    evidence: 'Equilibrium equations and the 18 kN m peak are shown.',
    band: 'Credit',
    gap: 'Two lines move between N and kN without an explicit conversion.',
    action: 'Audit units line by line and state the conversion once.',
    resource: 'Week 3 Tutorial - Convention sheet',
  },
  {
    criterion: 'Engineering justification',
    evidence: 'The draft links maximum moment to increased section demand.',
    band: 'Pass to Credit',
    gap: 'Material efficiency is named but not supported by a design implication.',
    action: 'Explain one capacity or serviceability check an engineer would make next.',
    resource: 'Week 5 Preview - Design implications',
  },
  {
    criterion: 'Communication',
    evidence: 'Headings and diagram references make the reasoning easy to locate.',
    band: 'Distinction',
    gap: 'The conclusion repeats the result rather than interpreting it.',
    action: 'Replace the final repeated result with a short design decision statement.',
    resource: 'Assignment brief - Reflection requirement',
  },
];

const samplePriorities = [
  { priority: '1', title: 'Show the shear-area evidence', urgency: 'High - 15 min', reason: 'This unlocks the central derivation.', rubric: 'Diagram construction' },
  { priority: '2', title: 'Correct unit traceability', urgency: 'High - 10 min', reason: 'Inconsistent units weaken otherwise sound calculations.', rubric: 'Calculation accuracy' },
  { priority: '3', title: 'Add one design implication', urgency: 'Medium - 20 min', reason: 'The reflection needs engineering judgement, not only a result.', rubric: 'Engineering justification' },
];

const aiSupportRules = [
  {
    title: 'What AI can review',
    text: 'Concept explanation, diagram reasoning, rubric coverage, clarity, missing evidence, citation quality, and next study actions.',
  },
  {
    title: 'What AI will not do',
    text: 'It will not write report paragraphs, solve assessment questions, fabricate references, provide marks, or replace lecturer judgement.',
  },
  {
    title: 'Student responsibility',
    text: 'You decide what to change, write the final submission, verify calculations, and submit only work you understand.',
  },
];

const reviewSignals = [
  { label: 'Likely strengths', value: 'Clear maximum moment intuition and readable diagram labels.', tone: 'success' },
  { label: 'Likely weaknesses', value: 'Support reactions and unit conversions need stronger traceability.', tone: 'warning' },
  { label: 'Missing evidence', value: 'Needs explicit shear-area annotation and one design implication tied to material efficiency.', tone: 'warning' },
  { label: 'Knowledge gaps', value: 'Revisit zero-shear principle and sign convention after point loads.', tone: 'ai' },
  { label: 'Rubric coverage', value: '3 of 4 criteria have evidence; engineering justification is underdeveloped.', tone: 'ai' },
  { label: 'Structure concerns', value: 'Conclusion repeats the result instead of explaining what it means for design.', tone: 'neutral' },
  { label: 'Citation concerns', value: 'Reference the Week 4 slide and Week 3 tutorial convention sheet explicitly.', tone: 'neutral' },
  { label: 'Clarity concerns', value: 'Add one bridging sentence between shear diagram and moment curve.', tone: 'neutral' },
];

const improvementSuggestions = [
  {
    title: 'Make derivation visible',
    reason: 'The current draft names the relationship but does not show enough evidence of reasoning.',
    rubric: 'Diagram construction and calculation accuracy',
    action: 'Annotate where shear changes sign and show how the signed area changes moment.',
  },
  {
    title: 'Strengthen design implication',
    reason: 'The reflection identifies the centre span but does not yet explain why it matters structurally.',
    rubric: 'Engineering justification',
    action: 'Connect peak moment to section capacity, serviceability, or material efficiency in your own words.',
  },
  {
    title: 'Close with interpretation',
    reason: 'The conclusion currently repeats the result rather than explaining the design decision.',
    rubric: 'Communication',
    action: 'Add a short final sentence explaining what an engineer would check next.',
  },
];

function AssessmentCommandPanel({ uploadState, finalState }: { uploadState: UploadState; finalState: 'idle' | 'confirming' | 'submitted' }) {
  const readiness = uploadState === 'success'
    ? ['Required sections present', 'Diagram evidence detected', 'Rubric coverage reviewed']
    : uploadState === 'processing'
      ? ['File received', 'Review in progress']
      : ['Draft not yet reviewed'];
  const steps = [
    ['Draft', uploadState === 'idle' ? 'Not started' : 'Active'],
    ['AI review', uploadState === 'success' ? 'Ready' : uploadState === 'processing' ? 'Processing' : 'Waiting'],
    ['Revision', uploadState === 'success' ? 'Next' : 'Locked'],
    ['Final', finalState === 'submitted' ? 'Submitted' : uploadState === 'success' ? 'Available' : 'Locked'],
  ];
  const risks = [
    ['Missing references', 'Week 4 slide and Week 3 tutorial should be cited explicitly.'],
    ['Technical writing', 'Conclusion needs interpretation, not repetition of the result.'],
    ['Calculation trace', 'Carry kN and m units through every moment line.'],
  ];

  return (
    <section className="mb-6 grid gap-5 lg:grid-cols-[1fr_360px]">
      <Card className="elite-surface overflow-hidden p-0">
        <div className="border-b border-line bg-paper px-5 py-4">
          <p className="font-mono text-xs font-semibold uppercase text-companion">Assessment command centre</p>
          <h2 className="mt-1 font-display text-2xl font-bold text-ink">Draft readiness, evidence, and next action</h2>
        </div>
        <div className="grid gap-5 p-5 md:grid-cols-[220px_1fr]">
          <div className="rounded-2xl border border-companion/20 bg-companion-tint p-5">
            <p className="font-mono text-[10px] font-bold uppercase text-companion">Readiness checklist</p>
            <div className="mt-4 space-y-2">{readiness.map((item) => <p key={item} className="flex items-start gap-2 text-xs font-semibold leading-5 text-ink"><CheckCircle2 size={14} className="mt-0.5 shrink-0 text-companion" />{item}</p>)}</div>
            <p className="mt-4 text-xs leading-5 text-slate-copy">No predicted mark is generated. Lecturer marking remains the official assessment process.</p>
          </div>
          <div className="space-y-4">
            <div className="grid gap-2 sm:grid-cols-4">
              {steps.map(([label, status], index) => (
                <div key={label} className="rounded-xl border border-line bg-white p-3">
                  <span className="font-mono text-[10px] font-bold text-slate-soft">0{index + 1}</span>
                  <p className="mt-2 text-sm font-bold text-ink">{label}</p>
                  <p className="mt-1 text-xs font-semibold text-companion">{status}</p>
                </div>
              ))}
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {risks.map(([label, text]) => (
                <div key={label} className="rounded-xl border border-warn/20 bg-warn-tint p-4">
                  <p className="text-xs font-bold uppercase text-warn">{label}</p>
                  <p className="mt-2 text-xs leading-5 text-slate-copy">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
      <Card className="h-fit border-success/20 bg-success-tint">
        <p className="font-mono text-xs font-semibold uppercase text-success">Recommended study material</p>
        <div className="mt-4 space-y-3">
          {[
            ['Week 4 Slide 18', 'Annotate shear sign changes before revising.'],
            ['Week 3 Tutorial Q4', 'Check unit conversion and reaction traceability.'],
            ['AI Tutor diagram mode', 'Review the visual relationship before editing.'],
          ].map(([title, text]) => (
            <div key={title} className="rounded-xl border border-success/15 bg-white/70 p-3">
              <p className="text-sm font-bold text-ink">{title}</p>
              <p className="mt-1 text-xs leading-5 text-slate-copy">{text}</p>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}

const ALLOWED_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
const ALLOWED_LABELS = 'PDF, DOCX, JPG, or PNG';
const MAX_BYTES = 25 * 1024 * 1024; // 25 MB

function SampleDraftDemonstration({
  state,
  onStateChange,
  onOpenRubric,
  onOpenBrief,
  onContact,
}: {
  state: DraftDemoState;
  onStateChange: (state: DraftDemoState) => void;
  onOpenRubric: () => void;
  onOpenBrief: () => void;
  onContact: () => void;
}) {
  const states: Array<{ id: DraftDemoState; label: string }> = [
    { id: 'empty', label: 'No draft uploaded' },
    { id: 'processing', label: 'Draft processing' },
    { id: 'feedback', label: 'Sample AI feedback' },
    { id: 'ready', label: 'Final submission ready' },
    { id: 'lecturer', label: 'Lecturer feedback available' },
  ];

  return (
    <section id="sample-feedback" aria-labelledby="sample-draft-title" className="mb-6 scroll-mt-24 overflow-hidden rounded-2xl border border-companion/25 bg-white shadow-sm">
      <div className="border-b border-line bg-gradient-to-r from-companion-tint via-white to-success-tint px-5 py-5 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <Badge tone="ai">Demonstration - not your submission</Badge>
            <h2 id="sample-draft-title" className="mt-3 font-display text-2xl font-bold text-ink">Example submitted draft and formative AI feedback</h2>
            <p className="mt-2 text-sm leading-6 text-slate-copy">Explore the complete formative-feedback journey using a realistic CIVL301 example. Your actual upload state below remains separate.</p>
          </div>
          <ConfidenceBadge />
        </div>
        <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-5" role="group" aria-label="Sample draft demonstration state">
          {states.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={state === item.id}
              onClick={() => onStateChange(item.id)}
              className={cn(
                'min-h-11 rounded-xl border px-3 py-2 text-sm font-semibold transition',
                state === item.id
                  ? 'border-companion bg-companion text-white shadow-sm'
                  : 'border-line bg-white text-slate-copy hover:border-companion hover:text-ink',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {state === 'empty' && (
        <div className="grid min-h-64 place-items-center p-6 text-center">
          <div className="max-w-lg">
            <FileUp className="mx-auto text-slate-soft" size={34} />
            <h3 className="mt-4 font-display text-xl font-bold text-ink">No sample draft selected</h3>
            <p className="mt-2 text-sm leading-6 text-slate-copy">This view demonstrates the starting point before a student chooses a file. Use Draft processing or Sample AI feedback to continue the walkthrough.</p>
          </div>
        </div>
      )}

      {state === 'processing' && (
        <div className="grid min-h-64 place-items-center p-6 text-center" role="status">
          <div className="max-w-lg">
            <Loader2 className="mx-auto animate-spin text-companion" size={34} />
            <h3 className="mt-4 font-display text-xl font-bold text-ink">Reviewing the sample against approved criteria</h3>
            <p className="mt-2 text-sm leading-6 text-slate-copy">Checking rubric coverage, evidence, conceptual gaps, structure, citations, and clarity. This demonstration does not upload or transmit a file.</p>
          </div>
        </div>
      )}

      {state === 'ready' && (
        <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1fr_320px]">
          <div className="rounded-2xl border border-success/25 bg-success-tint p-6">
            <CheckCircle2 className="text-success" size={30} />
            <h3 className="mt-4 font-display text-xl font-bold text-ink">Sample revision checklist complete</h3>
            <p className="mt-2 text-sm leading-6 text-slate-copy">The example now shows the readiness state after the student has considered formative guidance. It does not represent a real submission or automatic approval.</p>
          </div>
          <div className="rounded-2xl border border-line bg-paper p-5">
            <p className="font-mono text-xs font-semibold uppercase text-slate-soft">Next decision</p>
            <p className="mt-2 text-sm font-bold text-ink">The student verifies calculations, accepts responsibility, and chooses whether to submit.</p>
            <Button className="mt-4" variant="secondary" onClick={() => onStateChange('feedback')}>Review sample feedback</Button>
          </div>
        </div>
      )}

      {state === 'lecturer' && (
        <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1fr_320px]">
          <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
            <Badge tone="success">Example lecturer feedback</Badge>
            <h3 className="mt-4 font-display text-xl font-bold text-ink">Official feedback released by teaching staff</h3>
            <p className="mt-3 text-sm leading-7 text-slate-copy">
              Dr Avery Tan confirms the reasoning is developing well and asks the student to improve unit traceability before relying on the result in a design argument. This example shows the official human-feedback stage after formative AI support.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                ['Strength retained', 'The shear-to-moment link is visible and the peak location is justified.'],
                ['Priority correction', 'Carry units consistently through the support reaction and moment calculation.'],
                ['Lecturer note', 'Use the AI feedback as revision guidance only; final interpretation must be your own.'],
                ['Next release', 'Official rubric comments appear with final marks after moderation.'],
              ].map(([title, text]) => (
                <div key={title} className="rounded-xl border border-line bg-paper p-4">
                  <p className="text-sm font-bold text-ink">{title}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-copy">{text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-companion/25 bg-companion-tint p-5">
            <p className="font-mono text-xs font-semibold uppercase text-companion">Student action</p>
            <p className="mt-2 text-sm font-bold text-ink">Compare lecturer comments with the earlier AI formative guidance.</p>
            <div className="mt-4 grid gap-2">
              <Button variant="secondary" onClick={() => onStateChange('feedback')}>View AI feedback</Button>
              <Button variant="secondary" onClick={onContact}>Contact lecturer</Button>
            </div>
          </div>
        </div>
      )}

      {state === 'feedback' && (
        <div className="p-5 sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
            <div className="rounded-2xl border border-line bg-paper p-5">
              <div className="flex items-start gap-3">
                <FileText size={20} className="mt-0.5 shrink-0 text-companion" />
                <div className="min-w-0">
                  <p className="font-mono text-xs font-semibold uppercase text-slate-soft">Draft summary</p>
                  <p className="mt-1 break-all font-display text-lg font-bold text-ink">{sampleDraftDetails.filename}</p>
                </div>
              </div>
              <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  ['Uploaded', sampleDraftDetails.uploaded],
                  ['Word count', sampleDraftDetails.words],
                  ['Version', sampleDraftDetails.version],
                  ['Processing status', sampleDraftDetails.status],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-line bg-white p-3">
                    <dt className="text-xs font-semibold text-slate-soft">{label}</dt>
                    <dd className="mt-1 text-sm font-bold text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="rounded-2xl border border-companion/25 bg-companion-tint p-5">
              <p className="font-mono text-xs font-semibold uppercase text-companion">Overall readiness</p>
              <div className="mt-3 flex items-end gap-2"><span className="font-display text-4xl font-bold text-ink">68%</span><span className="pb-1 text-sm font-semibold text-slate-copy">Developing</span></div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white"><div className="h-full w-[68%] rounded-full bg-companion" /></div>
              <p className="mt-4 text-sm leading-6 text-slate-copy">Core reasoning is present. Three targeted revisions would make the evidence easier to verify.</p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-line bg-white p-5">
            <p className="font-mono text-xs font-semibold uppercase text-slate-soft">Draft preview - excerpt only</p>
            <h3 className="mt-3 font-display text-xl font-bold text-ink">2. Shear-to-moment relationship</h3>
            <p className="mt-3 text-sm leading-7 text-slate-copy">The reaction calculation gives 6 kN at each support for the central point-load case. The shear diagram is positive before the load and negative after it. Therefore the bending-moment curve rises toward midspan and falls toward the right support.</p>
            <div className="mt-4 rounded-xl border border-line bg-paper p-4 font-mono text-sm text-ink">M(3 m) = R<sub>A</sub> x 3 m = 6 kN x 3 m = 18 kN m</div>
            <h4 className="mt-5 font-display text-base font-bold text-ink">3. Design reflection - incomplete evidence</h4>
            <p className="mt-2 text-sm leading-7 text-slate-copy">The sample identifies greater capacity demand near midspan but leaves the material-efficiency implication for the student to justify. The demonstration intentionally avoids supplying a finished assessment paragraph.</p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {reviewSignals.map((signal) => (
              <div key={signal.label} className="rounded-2xl border border-line bg-paper p-4">
                <p className="font-mono text-[10px] font-semibold uppercase text-slate-soft">{signal.label}</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-ink">{signal.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div><p className="font-mono text-xs font-semibold uppercase text-companion">Rubric-level feedback</p><h3 className="mt-1 font-display text-xl font-bold text-ink">Evidence, gap, and next student action</h3></div>
              <Button variant="secondary" size="sm" onClick={onOpenRubric}>Open assignment rubric</Button>
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {sampleRubricFeedback.map((item) => (
                <article key={item.criterion} className="rounded-2xl border border-line bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-2"><h4 className="font-display text-lg font-bold text-ink">{item.criterion}</h4><Badge tone="ai">{item.band}</Badge></div>
                  <dl className="mt-4 space-y-3 text-sm leading-6">
                    <div><dt className="font-bold text-success">Current evidence</dt><dd className="text-slate-copy">{item.evidence}</dd></div>
                    <div><dt className="font-bold text-warn">Gap</dt><dd className="text-slate-copy">{item.gap}</dd></div>
                    <div><dt className="font-bold text-companion">Recommended student action</dt><dd className="text-slate-copy">{item.action}</dd></div>
                    <div><dt className="font-bold text-ink">Relevant lesson or resource</dt><dd className="text-slate-copy">{item.resource}</dd></div>
                  </dl>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_340px]">
            <div className="rounded-2xl border border-line bg-paper p-5">
              <p className="font-mono text-xs font-semibold uppercase text-warn">What to improve next</p>
              <div className="mt-4 space-y-3">
                {samplePriorities.map((item) => (
                  <div key={item.priority} className="grid gap-3 rounded-xl border border-line bg-white p-4 sm:grid-cols-[32px_1fr_auto]">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-ink font-mono text-xs font-bold text-white">{item.priority}</span>
                    <div><p className="font-bold text-ink">{item.title}</p><p className="mt-1 text-xs leading-5 text-slate-copy">{item.reason} Rubric: {item.rubric}.</p></div>
                    <Badge tone={item.priority === '3' ? 'warning' : 'danger'}>{item.urgency}</Badge>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-success/25 bg-success-tint p-5">
              <p className="font-mono text-xs font-semibold uppercase text-success">Academic integrity boundary</p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-copy">
                <li>AI provides formative guidance and identifies evidence gaps.</li>
                <li>AI does not write or submit the assignment.</li>
                <li>The student verifies calculations and retains responsibility.</li>
                <li>The lecturer provides final marking and official feedback.</li>
              </ul>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-companion/25 bg-companion-tint p-5">
            <p className="font-mono text-xs font-semibold uppercase text-companion">Personalised support</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button to="/demo" variant="secondary" size="sm">Revisit Week 4 lesson</Button>
              <Button to="/demo/learn?method=diagram" variant="secondary" size="sm">Open visual diagram</Button>
              <Button to="/demo/learn?question=Why%20does%20bending%20moment%20become%20maximum%20when%20shear%20is%20zero%3F" variant="ai" size="sm"><Brain size={14} />Ask AI Tutor</Button>
              <Button variant="secondary" size="sm" onClick={onContact}><GraduationCap size={14} />Contact lecturer</Button>
              <Button variant="secondary" size="sm" onClick={onOpenBrief}>Review assignment brief</Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default function AssessmentPage() {
  const [draftFile, setDraftFile] = useState<string | null>(null);
  const [draftVersions, setDraftVersions] = useState<DraftVersion[]>([]);
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [uploadError, setUploadError] = useState('');
  const [finalState, setFinalState] = useState<'idle' | 'confirming' | 'submitted'>('idle');
  const [feedback, setFeedback] = useState(false);
  const [rubricOpen, setRubricOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactReason, setContactReason] = useState('Assessment expectations');
  const [contactQuestion, setContactQuestion] = useState('');
  const [contactSaved, setContactSaved] = useState(false);
  const [draftDemoState, setDraftDemoState] = useState<DraftDemoState>('feedback');
  const [finalAcknowledged, setFinalAcknowledged] = useState(false);
  const [submissionReceipt, setSubmissionReceipt] = useState(() => window.localStorage.getItem('civl301-submission-receipt') ?? '');
  const [reflection, setReflection] = useState(() => {
    try { return JSON.parse(window.localStorage.getItem('civl301-assignment-reflection') ?? '{}') as Record<string, string>; } catch { return {}; }
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#rubric') setRubricOpen(true);
    if (hash === '#sample-feedback') setDraftDemoState('feedback');
    window.requestAnimationFrame(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' });
    });
  }, []);

  function notify(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  }

  function validateAndUpload(file: File) {
    setUploadError('');
    if (!ALLOWED_TYPES.includes(file.type)) {
      setUploadError(`Invalid file type. Please upload ${ALLOWED_LABELS}.`);
      setUploadState('error');
      return;
    }
    if (file.size > MAX_BYTES) {
      setUploadError('File too large. Maximum size is 25 MB.');
      setUploadState('error');
      return;
    }
    uploadDraft(file);
  }

  function uploadDraft(file: File) {
    setDraftFile(file.name);
    setUploadState('selected');
    setTimeout(() => {
      setUploadState('uploading');
      setTimeout(() => {
        setUploadState('processing');
        setTimeout(() => {
          setUploadState('success');
          setFeedback(true);
          setDraftVersions((versions) => [...versions, {
            version: versions.length + 1,
            filename: file.name,
            fileType: file.type || 'Unknown file type',
            fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
            uploadedAt: new Date().toLocaleString('en-AU'),
            note: versions.length ? 'Revised draft uploaded for a new formative review.' : 'Initial draft submitted for formative review.',
          }]);
        }, 900);
      }, 700);
    }, 400);
  }

  function handleFileInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) validateAndUpload(file);
    // reset so same file can be re-selected after removal
    event.target.value = '';
  }

  function handleDrop(event: React.DragEvent) {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files[0];
    if (file) validateAndUpload(file);
  }

  function submitFinal() {
    if (uploadState !== 'success') return;
    setFinalState('confirming');
    setFinalAcknowledged(false);
  }

  function confirmFinalSubmission() {
    if (!finalAcknowledged) return;
    const receipt = `CIVL301-${new Date().getFullYear()}-${String(Date.now()).slice(-8)}`;
    setSubmissionReceipt(receipt);
    window.localStorage.setItem('civl301-submission-receipt', receipt);
    setFinalState('submitted');
  }

  function downloadReceipt() {
    const latest = draftVersions[draftVersions.length - 1];
    const content = `Compass AI local submission receipt\nReference: ${submissionReceipt}\nUnit: ${unit.code} ${unit.name}\nAssignment: ${assignmentBrief.title}\nVersion: ${latest?.version ?? 1}\nFile: ${latest?.filename ?? draftFile}\nRecorded locally: ${new Date().toLocaleString('en-AU')}\n\nThis receipt records the deterministic frontend demonstration state. No file was transmitted to a university server.`;
    const url = URL.createObjectURL(new Blob([content], { type: 'text/plain' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${submissionReceipt}-receipt.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function updateReflection(key: string, value: string) {
    const next = { ...reflection, [key]: value };
    setReflection(next);
    window.localStorage.setItem('civl301-assignment-reflection', JSON.stringify(next));
  }

  function saveContactRequest() {
    const request = {
      id: Date.now(),
      lecturer: 'Dr Avery Tan',
      unit: unit.code,
      context: `Assignment 2 — ${assignmentBrief.title}`,
      reason: contactReason,
      question: contactQuestion.trim(),
      createdAt: new Date().toISOString(),
      status: 'Saved locally — not transmitted',
    };
    const stored = JSON.parse(window.localStorage.getItem('student-support-requests') ?? '[]') as unknown[];
    window.localStorage.setItem('student-support-requests', JSON.stringify([...stored, request]));
    setContactSaved(true);
  }

  const isSubmitted = finalState === 'submitted';

  return (
    <div className="animate-page mx-auto max-w-7xl px-5 py-6 sm:px-8">
      {toast && <Toast message={toast} />}

      <ContactLecturerDialog
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        unitCode={unit.code}
        unitTitle={unit.name}
        context={`Assignment 2 - ${assignmentBrief.title}`}
        defaultSubject={`${unit.code}: ${contactReason}`}
        defaultMessage={contactQuestion}
      />

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
              <Badge tone="neutral">Dr Avery Tan</Badge>
              <Badge tone="neutral">4 days remaining</Badge>
              {isSubmitted && <Badge tone="success">Submitted</Badge>}
              {!isSubmitted && uploadState === 'success' && (
                <Badge tone="ai">Draft ready</Badge>
              )}
            </div>
          </div>
          <ConfidenceBadge />
        </div>
        <div className="mt-5 grid gap-3 rounded-xl border border-line bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Submission stage', isSubmitted ? 'Final submitted' : uploadState === 'success' ? 'Revision and final check' : 'Draft preparation'],
            ['Current status', isSubmitted ? 'Awaiting lecturer marking' : feedback ? 'Formative feedback available' : 'Draft not reviewed'],
            ['Last saved', draftVersions[draftVersions.length - 1]?.uploadedAt ?? 'No draft saved'],
            ['Primary next action', isSubmitted ? 'Complete reflection' : uploadState === 'success' ? 'Review and submit final' : 'Upload a draft'],
          ].map(([label, value]) => <div key={label}><p className="font-mono text-[10px] font-bold uppercase text-slate-soft">{label}</p><p className="mt-1 text-sm font-bold leading-5 text-ink">{value}</p></div>)}
        </div>
      </div>

      <AssessmentCommandPanel uploadState={uploadState} finalState={finalState} />

      {/* ── Brief + submission timeline ── */}
      <div className="mb-6 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* Assignment brief */}
        <div id="assignment-brief" className="scroll-mt-24">
        <Card className="official-content font-serif">
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
          <div className="mt-5 grid gap-3 rounded-xl border border-line bg-paper p-4 sm:grid-cols-2">
            {[['Learning outcomes', 'Construct diagrams from equilibrium and explain a defensible structural design implication.'], ['Required deliverables', 'Labelled diagrams, calculation trace, design reflection, and cited unit evidence.'], ['Length', '1,200–1,500 words, excluding references and diagram labels.'], ['File requirements', 'PDF or DOCX, maximum 25 MB; diagrams must remain legible.']].map(([label, value]) => <div key={label}><p className="font-mono text-[10px] font-bold uppercase text-cardinal">{label}</p><p className="mt-1 text-sm leading-6 text-ink">{value}</p></div>)}
          </div>
          <div className="mt-4 flex flex-wrap gap-2"><Badge tone="success">Official brief shown in full</Badge><Button variant="secondary" size="sm" onClick={() => { setContactQuestion('I would like to clarify this requirement: '); setContactOpen(true); }}><GraduationCap size={14} />Contact lecturer</Button></div>

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
            id="rubric"
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
              {rubric.map((item, index) => (
                <div key={item.title} className="rounded-xl border border-line bg-white p-4">
                  <div className="flex items-center justify-between gap-2"><p className="font-display text-sm font-bold text-ink">{item.title}</p><Badge tone="neutral">{[25, 25, 30, 20][index]}%</Badge></div>
                  <p className="mt-2 text-xs font-semibold text-slate-copy">Bands: High Distinction · Distinction · Credit · Pass · Not demonstrated</p>
                  <p className="mt-2 text-xs leading-5 text-slate-copy">{item.improvement}</p>
                  <p className="mt-2 font-mono text-[10px] font-semibold text-companion">
                    Direction: {item.direction}
                  </p>
                </div>
              ))}
            </div>
          )}
          <div className="mt-5 border-t border-line pt-5"><h3 className="font-display text-lg font-bold text-ink">Frequently asked questions</h3><div className="mt-3 space-y-3">{[
            ['Can AI write my reflection?', 'No. It can identify gaps and point to approved learning material, but the submitted reasoning must be your own.'],
            ['Can I replace a draft?', 'Yes. Select Replace after review; each accepted file creates a new local version record.'],
            ['What does the lecturer receive?', 'Only the final file and final-submission metadata in a real university workflow. This prototype records that state locally.'],
          ].map(([question, answer]) => <details key={question} className="rounded-xl border border-line bg-paper p-4"><summary className="cursor-pointer text-sm font-bold text-ink">{question}</summary><p className="mt-2 text-sm leading-6 text-slate-copy">{answer}</p></details>)}</div></div>
        </Card>
        </div>

        {/* Submission timeline */}
        <div className="space-y-4">
          {/* Current submission status */}
          <Card>
            <p className="font-mono text-xs font-semibold uppercase text-slate-soft">Submission status</p>
            <div className="mt-4 space-y-3">
              {[
                {
                  label: 'Brief', detail: 'Requirements reviewed', done: true,
                },
                {
                  label: 'Draft', detail: 'Local upload simulation', done: uploadState === 'success' || isSubmitted,
                },
                {
                  label: 'AI formative feedback', detail: 'No predicted grade', done: feedback || isSubmitted,
                },
                {
                  label: 'Revision', detail: 'Student-controlled changes', done: uploadState === 'success' || isSubmitted,
                },
                { label: 'Final submission', detail: 'Due Friday 5:00 pm', done: isSubmitted },
                { label: 'Lecturer feedback', detail: 'Released after marking', done: draftDemoState === 'lecturer' },
                { label: 'Reflection', detail: 'Available after submission', done: isSubmitted && Object.values(reflection).some(Boolean) },
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
              <div className="min-w-0">
                <p className="font-mono text-xs font-semibold uppercase text-slate-soft">Your draft excerpt</p>
                <p className="mt-1 break-all font-semibold text-ink">{sampleSubmission.filename}</p>
              </div>
            </div>
            <p className="mt-4 rounded-xl bg-white/70 p-4 text-sm leading-7 italic text-slate-copy">
              "{sampleSubmission.excerpt}"
            </p>
          </Card>
        </div>
      </div>

      <section className="mb-6 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="border-success/20 bg-success-tint">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-success shadow-sm">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="font-mono text-xs font-semibold uppercase text-success">How AI can support this assignment</p>
              <h2 className="mt-1 font-display text-xl font-bold text-ink">Formative review with academic boundaries</h2>
              <p className="mt-2 text-sm leading-6 text-slate-copy">
                The AI review is designed to help you understand and improve your own work. It gives diagnostic guidance, not replacement assessment content.
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            {aiSupportRules.map((rule) => (
              <div key={rule.title} className="rounded-2xl border border-success/15 bg-white/75 p-4">
                <p className="text-sm font-bold text-ink">{rule.title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-copy">{rule.text}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-companion-tint text-companion">
              <Brain size={20} />
            </div>
            <div>
              <p className="font-mono text-xs font-semibold uppercase text-slate-soft">Review lens</p>
              <h2 className="mt-1 font-display text-xl font-bold text-ink">What the AI checks after upload</h2>
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {['Rubric alignment', 'Missing evidence', 'Knowledge gaps', 'Source and citation clarity'].map((item) => (
              <div key={item} className="rounded-xl border border-line bg-paper p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-companion" />
                  <p className="text-sm font-bold text-ink">{item}</p>
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-copy">
                  Reported as suggestions with a student action, never as completed work.
                </p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* ── Upload + final submission ── */}
      <SampleDraftDemonstration
        state={draftDemoState}
        onStateChange={setDraftDemoState}
        onOpenRubric={() => {
          setRubricOpen(true);
          window.requestAnimationFrame(() => document.getElementById('rubric')?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
        }}
        onOpenBrief={() => document.getElementById('assignment-brief')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
        onContact={() => {
          setContactSaved(false);
          setContactQuestion('');
          setContactOpen(true);
        }}
      />

      <div className="mb-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
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

          {/* Hidden real file input */}
          <input
            ref={fileInputRef}
            type="file"
            id="draft-file-input"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            className="sr-only"
            aria-label="Select draft file for AI formative feedback"
            onChange={handleFileInputChange}
          />

          {/* Upload zone */}
          <button
            type="button"
            aria-label={uploadState === 'idle' ? 'Choose draft file or drag and drop' : undefined}
            onClick={() => {
              if (uploadState === 'idle' || uploadState === 'error') fileInputRef.current?.click();
            }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            disabled={uploadState === 'uploading' || uploadState === 'processing' || uploadState === 'success'}
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
                <span className="mt-2 text-sm text-slate-copy">{ALLOWED_LABELS} · max 25 MB · demo prototype</span>
              </>
            )}
            {uploadState === 'selected' && (
              <>
                <FileText className="mb-3 text-companion" size={34} />
                <span className="font-bold text-ink">File selected</span>
                <span className="mt-2 max-w-xs break-all text-sm text-slate-soft">{draftFile}</span>
              </>
            )}
            {uploadState === 'uploading' && (
              <>
                <Loader2 className="mb-3 animate-spin text-companion" size={34} />
                <span className="font-bold text-companion">Simulating upload…</span>
                <span className="mt-2 text-sm text-slate-soft">No file is transmitted in this prototype</span>
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
                <span className="mt-2 max-w-xs break-all text-sm text-slate-copy">{draftFile}</span>
              </>
            )}
            {uploadState === 'error' && (
              <>
                <AlertTriangle className="mb-3 text-danger" size={34} />
                <span className="font-bold text-danger">Upload failed — please try again</span>
              </>
            )}
          </button>

          {/* File validation error */}
          {uploadError && (
            <div role="alert" className="mt-3 flex items-start gap-2 rounded-xl border border-danger/20 bg-danger-tint px-4 py-3 text-sm text-danger">
              <AlertTriangle size={15} className="mt-0.5 shrink-0" />
              {uploadError}
            </div>
          )}

          {draftFile && uploadState === 'success' && (
            <div className="mt-4 flex items-center gap-3 rounded-xl bg-success-tint p-4 border border-success/20">
              <CheckCircle2 size={18} className="shrink-0 text-success" />
              <div className="flex-1 min-w-0">
                <p className="break-all text-sm font-semibold text-ink">{draftFile}</p>
                <p className="text-xs text-slate-soft">{draftVersions[draftVersions.length - 1]?.fileType} · {draftVersions[draftVersions.length - 1]?.fileSize} · Version {draftVersions.length}</p>
              </div>
              <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>Replace</Button>
              <button
                type="button"
                aria-label="Remove uploaded draft"
                onClick={() => {
                  setDraftFile(null);
                  setUploadState('idle');
                  setFeedback(false);
                  setUploadError('');
                }}
                className="rounded-full p-1 text-slate-soft hover:bg-white hover:text-danger"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {draftVersions.length > 0 && (
            <section className="mt-5 border-t border-line pt-5" aria-labelledby="version-history-title">
              <div className="flex items-center justify-between gap-3"><h3 id="version-history-title" className="font-display text-lg font-bold text-ink">Version history</h3><Badge tone="neutral">{draftVersions.length} version{draftVersions.length === 1 ? '' : 's'}</Badge></div>
              <div className="mt-3 space-y-2">{[...draftVersions].reverse().map((version, index) => (
                <div key={`${version.version}-${version.uploadedAt}`} className="rounded-xl border border-line bg-paper p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-sm font-bold text-ink">Version {version.version}{index === 0 ? ' · Current' : ''}</p><p className="mt-1 break-all text-xs text-slate-copy">{version.filename} · {version.fileSize}</p><p className="mt-1 text-xs text-slate-soft">{version.uploadedAt}</p></div><Button variant="ghost" size="sm" onClick={() => notify(index === 0 ? 'Current version metadata is shown here; the file remains on your device.' : 'Earlier-version restoration is not available in this local demonstration.')}>{index === 0 ? 'View details' : 'Restore info'}</Button></div>
                  <p className="mt-3 text-xs leading-5 text-slate-copy">{version.note}</p>
                </div>
              ))}</div>
            </section>
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
                {draftFile} · Version {draftVersions.length || 1} · recorded locally
              </p>
              <p className="mt-4 text-xs leading-5 text-slate-copy">
                Your final submission is now awaiting lecturer marking. AI formative feedback is no
                longer available for this attempt. Official feedback will be released within 15 working
                days.
              </p>
              <div className="mt-4 rounded-xl border border-success/20 bg-white/70 p-3 text-left"><p className="font-mono text-[10px] font-bold uppercase text-success">Receipt reference</p><p className="mt-1 break-all text-sm font-bold text-ink">{submissionReceipt}</p></div>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <Button variant="secondary" onClick={downloadReceipt}><Download size={15} />Download receipt</Button>
                <Button to="/demo" variant="secondary">
                  Return to unit <ArrowRight size={15} />
                </Button>
                <Button to="/courses" variant="ghost">View progress</Button>
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
                  <Button
                    variant="primary"
                    onClick={submitFinal}
                    disabled={uploadState !== 'success'}
                    className="w-full justify-center"
                  >
                    <CheckCircle2 size={16} />
                    Review and submit final assignment
                  </Button>
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

      {finalState === 'confirming' && (
        <div className="fixed inset-0 z-[65] grid place-items-center bg-night/70 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setFinalState('idle'); }}>
          <div role="dialog" aria-modal="true" aria-labelledby="final-confirmation-title" className="modal-enter w-full max-w-xl rounded-2xl border border-line bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4"><div><p className="font-mono text-xs font-bold uppercase text-cardinal">Final submission</p><h2 id="final-confirmation-title" className="mt-2 font-display text-2xl font-bold text-ink">Confirm the version you are submitting</h2></div><button type="button" aria-label="Close final submission confirmation" onClick={() => setFinalState('idle')} className="grid h-10 w-10 place-items-center rounded-full border border-line"><X size={16} /></button></div>
            <div className="mt-5 rounded-xl border border-line bg-paper p-4"><p className="break-all text-sm font-bold text-ink">{draftFile}</p><p className="mt-1 text-xs text-slate-copy">Version {draftVersions.length || 1} · Lecturer will see this file, its recorded timestamp, and final-submission status.</p></div>
            <div className="mt-4 rounded-xl border border-warn/20 bg-warn-tint p-4 text-sm leading-6 text-slate-copy"><strong className="text-ink">Unresolved checks:</strong> verify unit conversions, source labels, and the design implication. This records a deterministic local demonstration state; no file is transmitted.</div>
            <label className="mt-4 flex items-start gap-3 rounded-xl border border-line p-4 text-sm font-semibold text-ink"><input type="checkbox" checked={finalAcknowledged} onChange={(event) => setFinalAcknowledged(event.target.checked)} className="mt-1 h-4 w-4 accent-cardinal" />I confirm this is my own work, I checked the selected version, and I understand this action records a local demonstration submission.</label>
            <div className="mt-5 flex flex-wrap justify-end gap-2"><Button variant="ghost" onClick={() => setFinalState('idle')}>Cancel</Button><Button onClick={confirmFinalSubmission} disabled={!finalAcknowledged}>Confirm final submission</Button></div>
          </div>
        </div>
      )}

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

          <div className="mb-5 grid gap-4 lg:grid-cols-4">
            {reviewSignals.map((signal) => (
              <div
                key={signal.label}
                className={cn(
                  'rounded-2xl border p-4 shadow-sm',
                  signal.tone === 'success' && 'border-success/20 bg-success-tint',
                  signal.tone === 'warning' && 'border-warn/20 bg-warn-tint',
                  signal.tone === 'ai' && 'border-companion/20 bg-companion-tint',
                  signal.tone === 'neutral' && 'border-line bg-white',
                )}
              >
                <p className="font-mono text-[10px] font-semibold uppercase text-slate-soft">{signal.label}</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-ink">{signal.value}</p>
              </div>
            ))}
          </div>

          <div className="mb-5 rounded-[24px] border border-line bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-companion-tint text-companion">
                <Sparkles size={18} />
              </div>
              <div>
                <p className="font-mono text-xs font-semibold uppercase text-companion">What the AI would improve</p>
                <h3 className="mt-1 font-display text-xl font-bold text-ink">Suggestions, not replacement writing</h3>
                <p className="mt-2 text-sm leading-6 text-slate-copy">
                  Each suggestion explains the reason, rubric connection, and action for you to complete in your own words.
                </p>
              </div>
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              {improvementSuggestions.map((item) => (
                <div key={item.title} className="rounded-2xl border border-line bg-paper p-4">
                  <p className="font-display text-base font-bold text-ink">{item.title}</p>
                  <p className="mt-3 text-xs font-bold uppercase text-warn">Reason</p>
                  <p className="mt-1 text-sm leading-6 text-slate-copy">{item.reason}</p>
                  <p className="mt-3 text-xs font-bold uppercase text-companion">Rubric connection</p>
                  <p className="mt-1 text-sm leading-6 text-slate-copy">{item.rubric}</p>
                  <p className="mt-3 text-xs font-bold uppercase text-success">Student action</p>
                  <p className="mt-1 text-sm leading-6 text-slate-copy">{item.action}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-5 grid gap-4 lg:grid-cols-[1fr_320px]">
            <Card className="border-companion/20 bg-companion-tint/50">
              <p className="font-mono text-xs font-semibold uppercase text-companion">Personalised learning support</p>
              <h3 className="mt-2 font-display text-xl font-bold text-ink">Recommended next study path</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  ['Lesson', 'Return to Week 4 Slide 18 and annotate shear sign changes.'],
                  ['Resource', 'Open Week 3 tutorial convention sheet for unit conversion practice.'],
                  ['AI Tutor mode', 'Use Step-by-step or Visual diagram before editing your conclusion.'],
                ].map(([title, text]) => (
                  <div key={title} className="rounded-xl border border-companion/15 bg-white/80 p-4">
                    <p className="text-sm font-bold text-ink">{title}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-copy">{text}</p>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="border-warn/20 bg-warn-tint">
              <p className="font-mono text-xs font-semibold uppercase text-warn">Human control</p>
              <p className="mt-2 text-sm leading-6 text-slate-copy">
                You choose what to revise and when to submit. Lecturers retain full control of official marking and feedback.
              </p>
              <div className="mt-4">
                <Button to="/demo/learn" variant="secondary" size="sm">
                  <Brain size={14} /> Study this gap
                </Button>
              </div>
            </Card>
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
            <Button to="/demo" variant="secondary">Open relevant lesson</Button>
            <Button to="/demo/learn?method=diagram" variant="secondary">View visual diagram</Button>
            <Button to="/demo/learn?method=practice" variant="secondary">Try practice question</Button>
            <Button variant="secondary" onClick={() => { setRubricOpen(true); document.getElementById('rubric')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }}>Review rubric</Button>
            <Button variant="secondary" onClick={() => notify('Feedback saved to your student record.')}>
              <CheckCircle2 size={15} /> Acknowledge feedback
            </Button>
            <Button
              variant="secondary"
              onClick={() => { setContactSaved(false); setContactQuestion(''); setContactOpen(true); }}
            >
              <GraduationCap size={15} /> Contact Dr Avery Tan
            </Button>
          </div>
        </section>
      )}

      {isSubmitted && (
        <section className="mt-6 rounded-2xl border border-line bg-white p-5 shadow-sm" aria-labelledby="reflection-title">
          <div className="max-w-3xl"><p className="font-mono text-xs font-bold uppercase text-companion">Post-submission reflection</p><h2 id="reflection-title" className="mt-2 font-display text-2xl font-bold text-ink">Capture what you will carry forward</h2><p className="mt-2 text-sm leading-6 text-slate-copy">Saved automatically on this device. Your lecturer cannot see this local reflection.</p></div>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">{[
            ['improved', 'What did you improve?'],
            ['difficult', 'What remains difficult?'],
            ['feedback', 'Which feedback will you act on?'],
            ['next', 'What will you do differently next time?'],
          ].map(([key, label]) => <label key={key} className="text-sm font-bold text-ink">{label}<textarea value={reflection[key] ?? ''} onChange={(event) => updateReflection(key, event.target.value)} className="mt-2 min-h-28 w-full rounded-xl border border-line bg-paper p-3 text-sm font-normal leading-6 outline-none focus:border-companion focus:ring-2 focus:ring-companion/20" placeholder="Write a short reflection in your own words." /></label>)}</div>
          <p role="status" className="mt-4 text-xs font-semibold text-success">Reflection saves locally as you type.</p>
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
