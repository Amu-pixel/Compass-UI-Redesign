import { BookOpen, CheckCircle2, Database, Edit3, Eye, FileClock, Filter, History, Layers, Search, ShieldCheck, XCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { lecturerInbox, unit } from '../data/mockData';
import { Badge, Button, Card, Toast } from '../components/ui';
import { cn } from '../utils/classNames';

type SourceStatus = 'indexed' | 'pending' | 'excluded';
type SourceRecord = {
  id: string;
  title: string;
  course: string;
  provenance: string;
  version: string;
  status: SourceStatus;
  lastValidated: string;
  owner: string;
  reuseBoundary: string;
  impact: string;
};

const initialSources: SourceRecord[] = [
  {
    id: 'week4-slide18',
    title: 'Week 4 Lecture Slides - Slide 18',
    course: 'CIVL301 Structural Analysis 301',
    provenance: 'Official lecture deck uploaded by Dr Avery Tan',
    version: '2026.2.4',
    status: 'indexed',
    lastValidated: '9 Jul 2026',
    owner: 'Dr Avery Tan',
    reuseBoundary: 'CIVL301 students only; explanatory use, not assessment writing.',
    impact: 'Grounds bending moment diagram explanations and feedback prompts.',
  },
  {
    id: 'week5-reading',
    title: 'Week 5 Reading - Design implications',
    course: 'CIVL301 Structural Analysis 301',
    provenance: 'Draft reading uploaded to LMS content staging',
    version: '2026.2-draft',
    status: 'pending',
    lastValidated: 'Not yet validated',
    owner: 'Dr Avery Tan',
    reuseBoundary: 'Cannot be reused until lecturer validates the final reading.',
    impact: 'Would support material-efficiency and design reflection questions.',
  },
  {
    id: 'student-chat',
    title: 'Raw student chat transcript',
    course: 'CIVL301 Structural Analysis 301',
    provenance: 'Private student interaction data',
    version: 'N/A',
    status: 'excluded',
    lastValidated: 'Excluded by policy',
    owner: 'Privacy boundary',
    reuseBoundary: 'Never indexed or reused as teaching material.',
    impact: 'Protects privacy and prevents unapproved knowledge reuse.',
  },
];

export default function KnowledgeBasePage() {
  const [toast, setToast] = useState('');
  const [sources, setSources] = useState(initialSources);
  const [selectedId, setSelectedId] = useState(initialSources[0].id);
  const [feedback, setFeedback] = useState('');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | SourceStatus>('all');
  const selected = useMemo(() => sources.find((source) => source.id === selectedId) ?? sources[0], [selectedId, sources]);
  const filteredSources = useMemo(() => {
    const term = query.trim().toLowerCase();
    return sources.filter((source) => {
      const matchesStatus = statusFilter === 'all' || source.status === statusFilter;
      const haystack = `${source.title} ${source.course} ${source.provenance} ${source.version} ${source.impact}`.toLowerCase();
      return matchesStatus && (!term || haystack.includes(term));
    });
  }, [query, sources, statusFilter]);

  useEffect(() => {
    if (filteredSources.length > 0 && !filteredSources.some((source) => source.id === selectedId)) {
      setSelectedId(filteredSources[0].id);
    }
  }, [filteredSources, selectedId]);

  function notify(message: string) {
    setToast(message);
    setTimeout(() => setToast(''), 2000);
  }

  function updateSource(status: SourceStatus, label: string) {
    setSources((items) => items.map((item) => item.id === selected.id ? { ...item, status, lastValidated: new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }) } : item));
    setFeedback(`${label} recorded locally for ${selected.title}. Permanent source governance requires backend persistence.`);
  }

  const counts = {
    indexed: sources.filter((source) => source.status === 'indexed').length,
    pending: sources.filter((source) => source.status === 'pending').length,
    excluded: sources.filter((source) => source.status === 'excluded').length,
  };

  return (
    <div className="animate-page mx-auto max-w-7xl px-5 py-6 sm:px-8">
      {toast && <Toast message={toast} />}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-companion">Knowledge Base / AI permissions</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-ink">What the AI is allowed to know</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-copy">
            Sources are useful only after provenance, version, ownership, reuse boundary, and teaching impact are clear.
          </p>
        </div>
        <Badge tone="ai">Lecturer validated reuse only</Badge>
      </div>

      <section className="mb-5 grid gap-3 sm:grid-cols-3" aria-label="Knowledge base status">
        {[
          ['Indexed sources', counts.indexed, 'Approved for grounded AI support', 'success'],
          ['Pending validation', counts.pending, 'Visible but not reusable yet', 'warning'],
          ['Excluded sources', counts.excluded, 'Protected from reuse', 'danger'],
        ].map(([label, value, detail, tone]) => (
          <Card key={label as string} className="p-4">
            <p className="font-mono text-[10px] font-bold uppercase text-slate-soft">{label as string}</p>
            <div className="mt-2 flex items-end justify-between gap-3">
              <p className="font-display text-3xl font-bold">{value as number}</p>
              <Badge tone={tone as 'success' | 'warning' | 'danger'}>{tone as string}</Badge>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-copy">{detail as string}</p>
          </Card>
        ))}
      </section>

      <div className="grid gap-5 xl:grid-cols-[430px_1fr]">
        <Card className="h-fit p-0">
          <div className="border-b border-line p-4">
            <p className="font-mono text-xs font-bold uppercase text-slate-soft">Academic search</p>
            <h2 className="mt-1 font-display text-xl font-bold">Search allowed knowledge</h2>
            <label className="mt-4 flex min-h-11 items-center gap-2 rounded-xl border border-line bg-white px-3 text-sm font-semibold text-ink focus-within:border-companion focus-within:ring-2 focus-within:ring-companion/20">
              <Search size={16} className="text-slate-soft" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search title, provenance, week, or impact"
                aria-label="Search knowledge base sources"
                className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-slate-soft"
              />
            </label>
            <div className="mt-3 flex flex-wrap gap-2" aria-label="Knowledge base filters">
              {(['all', 'indexed', 'pending', 'excluded'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  aria-pressed={statusFilter === filter}
                  onClick={() => setStatusFilter(filter)}
                  className={cn('inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-bold capitalize transition', statusFilter === filter ? 'border-ink bg-ink text-white' : 'border-line bg-paper text-ink hover:border-companion')}
                >
                  {filter === 'all' && <Filter size={12} />}
                  {filter}
                </button>
              ))}
            </div>
            <p role="status" className="mt-3 text-xs font-semibold text-slate-soft">{filteredSources.length} source{filteredSources.length === 1 ? '' : 's'} shown</p>
          </div>
          <div className="divide-y divide-line">
            {filteredSources.length === 0 && (
              <div className="p-5">
                <p className="font-display text-base font-bold text-ink">No matching sources</p>
                <p className="mt-2 text-sm leading-6 text-slate-copy">Try another title, week, provenance term, or clear the status filter.</p>
                <Button variant="secondary" size="sm" className="mt-4" onClick={() => { setQuery(''); setStatusFilter('all'); }}>Clear search</Button>
              </div>
            )}
            {filteredSources.map((source) => (
              <button
                key={source.id}
                type="button"
                aria-pressed={selected.id === source.id}
                onClick={() => setSelectedId(source.id)}
                className={cn('block w-full p-4 text-left transition', selected.id === source.id ? 'bg-companion-tint' : 'hover:bg-paper')}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="font-bold text-ink">{source.title}</p>
                  <Badge tone={source.status === 'indexed' ? 'success' : source.status === 'pending' ? 'warning' : 'danger'}>{source.status}</Badge>
                </div>
                <p className="mt-1 text-xs leading-5 text-slate-soft">{source.course}</p>
              </button>
            ))}
          </div>
        </Card>

        <section className="space-y-5">
          <Card className="p-0">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line p-5">
              <div>
                <p className="font-mono text-xs font-bold uppercase text-companion">Selected source</p>
                <h2 className="mt-1 font-display text-2xl font-bold">{selected.title}</h2>
                <p className="mt-1 text-sm text-slate-copy">{selected.course}</p>
              </div>
              <Badge tone={selected.status === 'indexed' ? 'success' : selected.status === 'pending' ? 'warning' : 'danger'}>{selected.status}</Badge>
            </div>
            <div className="grid gap-4 p-5 md:grid-cols-2">
              {[
                ['Provenance', selected.provenance],
                ['Version', selected.version],
                ['Last validated', selected.lastValidated],
                ['Lecturer owner', selected.owner],
                ['Reuse boundary', selected.reuseBoundary],
                ['Teaching impact', selected.impact],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-line bg-paper p-4">
                  <p className="font-mono text-[10px] font-bold uppercase text-slate-soft">{label}</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-ink">{value}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="flex items-center gap-2 font-display text-xl font-bold"><ShieldCheck size={18} className="text-companion" />Validation actions</h3>
            <p className="mt-2 text-sm leading-6 text-slate-copy">Actions update this local demonstration state only. They do not permanently alter a university knowledge base.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={() => updateSource('indexed', 'Approval')}><CheckCircle2 size={15} />Approve</Button>
              <Button variant="secondary" onClick={() => { setFeedback(`Editing notes opened locally for ${selected.title}.`); notify('Inline source editing is a local prototype state.'); }}><Edit3 size={15} />Edit</Button>
              <Button variant="danger" onClick={() => updateSource('excluded', 'Rejection')}><XCircle size={15} />Reject</Button>
              <Button variant="secondary" onClick={() => setFeedback(`Source preview: ${selected.provenance}`)}><Eye size={15} />View source</Button>
              <Button variant="secondary" onClick={() => setFeedback(`Affected experiences: Learning Workspace, AI Tutor follow-ups, assignment readiness support.`)}><Layers size={15} />Affected experiences</Button>
              <Button variant="ghost" onClick={() => setFeedback(`Version history: ${selected.version}; last validated ${selected.lastValidated}.`)}><History size={15} />Version/history</Button>
            </div>
            {feedback && <p role="status" className="mt-4 rounded-xl border border-companion/20 bg-companion-tint px-4 py-3 text-sm font-semibold text-companion">{feedback}</p>}
          </Card>

          <div className="grid gap-5 lg:grid-cols-2">
            <Card>
              <h3 className="flex items-center gap-2 font-display text-lg font-bold"><Database size={17} className="text-companion" />Pending AI questions</h3>
              <div className="mt-4 space-y-3">
                {lecturerInbox.map((item) => (
                  <div key={item.question} className="rounded-xl border border-line bg-paper p-4">
                    <p className="font-bold">{item.question}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-copy">{item.answer}</p>
                    <p className="mt-3 font-mono text-xs font-bold text-companion">Suggested source: {item.source}</p>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <h3 className="flex items-center gap-2 font-display text-lg font-bold"><BookOpen size={17} className="text-cardinal" />Governance rules</h3>
              <div className="mt-4 space-y-3">
                {[
                  ['Approved only', 'Raw student chats are never indexed as teaching material.'],
                  ['Version clarity', 'Draft readings remain pending until lecturer ownership is clear.'],
                  ['Teaching impact', 'Every source needs a visible reason for reuse.'],
                  ['Auditability', 'Local actions are labelled as local until backend persistence exists.'],
                ].map(([title, text]) => (
                  <div key={title} className="flex gap-3 rounded-xl border border-line bg-paper p-4">
                    <FileClock size={16} className="mt-0.5 shrink-0 text-slate-soft" />
                    <div>
                      <p className="font-bold">{title}</p>
                      <p className="text-sm leading-6 text-slate-copy">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
