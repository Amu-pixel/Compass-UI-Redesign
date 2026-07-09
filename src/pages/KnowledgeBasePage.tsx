import { CheckCircle2, Database, GraduationCap, HelpCircle, Layers, TrendingUp } from 'lucide-react';
import { knowledgeTimeline, lecturerInbox } from '../data/mockData';
import { Button, Card, ConfidenceBadge } from '../components/ui';

export default function KnowledgeBasePage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-xs font-semibold uppercase text-companion">Knowledge Base / AI Evolution</p>
          <h2 className="font-display text-3xl font-bold">The companion improves only through lecturer validation</h2>
        </div>
        <ConfidenceBadge />
      </div>

      <Card className="overflow-hidden">
        <div className="grid gap-4 lg:grid-cols-8">
          {knowledgeTimeline.map((node, index) => (
            <div key={node} className="relative rounded-2xl bg-paper p-4">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-companion">
                {index === 0 || index === 6 ? <GraduationCap size={20} /> : index === 1 ? <HelpCircle size={20} /> : index === 2 ? <Layers size={20} /> : index === 3 ? <CheckCircle2 size={20} /> : index === 4 ? <Database size={20} /> : <TrendingUp size={20} />}
              </div>
              <p className="text-sm font-bold leading-5">{node}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-6 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <h3 className="font-display text-xl font-bold">Knowledge maturity</h3>
          <div className="mt-6 space-y-5">
            {[
              ['Semester 1', '28%'],
              ['Semester 2', '47%'],
              ['Semester 3', '62%'],
            ].map(([label, value]) => (
              <div key={label}>
                <div className="mb-2 flex justify-between text-sm font-bold"><span>{label}</span><span>{value}</span></div>
                <div className="h-3 rounded-full bg-paper-dim"><div className="h-3 rounded-full bg-companion" style={{ width: value }} /></div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm leading-6 text-slate-copy">The AI does not learn from raw student chats. It learns from lecturer-approved answers, validated materials, and explicit teaching guidance.</p>
        </Card>

        <Card>
          <h3 className="font-display text-xl font-bold">Pending AI questions</h3>
          <div className="mt-5 space-y-4">
            {lecturerInbox.map((item) => (
              <div key={item.question} className="rounded-2xl border border-line p-4">
                <p className="font-bold">{item.question}</p>
                <p className="mt-3 text-sm leading-6 text-slate-copy">{item.answer}</p>
                <p className="mt-3 font-mono text-xs font-bold text-companion">Suggested source: {item.source}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="secondary">Approve</Button>
                  <Button variant="secondary">Edit</Button>
                  <Button variant="ghost">Reject</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {['Lecturer-approved knowledge base', 'Internal unit materials only', 'Continuous validation workflow'].map((item) => (
          <Card key={item}>
            <h3 className="font-display text-lg font-bold">{item}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-copy">This rule keeps the system useful, accountable, and aligned with the way the unit is actually taught.</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
