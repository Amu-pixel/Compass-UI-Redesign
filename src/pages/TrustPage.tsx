import { Lock, RotateCcw, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import { governanceBoundaries, trustLayers } from '../data/mockData';
import { Card, ConfidenceBadge, FeatureCard } from '../components/ui';

export default function TrustPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-xs font-semibold uppercase text-companion">Trust & Governance</p>
          <h2 className="font-display text-3xl font-bold">Operational rules students and lecturers can see</h2>
        </div>
        <ConfidenceBadge />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {trustLayers.map((layer) => <FeatureCard key={layer.title} icon={layer.icon} title={layer.title} text={layer.text} />)}
      </div>

      <Card className="mt-6">
        <h3 className="font-display text-2xl font-bold">Hallucination prevention workflow</h3>
        <div className="mt-6 grid gap-3 lg:grid-cols-7">
          {['Student question', 'Search approved unit content', 'Confidence check', 'High: answer with source', 'Low: recommend lecturer', 'Question enters inbox', 'Lecturer validates'].map((step, index) => (
            <div key={step} className="rounded-2xl bg-paper p-4">
              <span className="font-mono text-xs font-bold text-companion">0{index + 1}</span>
              <p className="mt-2 text-sm font-bold leading-5">{step}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-2xl bg-warn-tint p-4 text-sm font-semibold text-warn">
          "I'm not confident enough to answer this accurately from the approved unit materials."
        </div>
      </Card>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_0.9fr]">
        <Card>
          <h3 className="font-display text-xl font-bold">Academic integrity boundaries</h3>
          <p className="mt-2 text-sm leading-6 text-slate-copy">The AI is designed to facilitate learning, not complete assessments.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {governanceBoundaries.map((boundary) => (
              <div key={boundary} className="rounded-2xl border border-danger/15 bg-danger-tint p-3 text-sm font-semibold text-danger">
                Refuses to {boundary.toLowerCase()}
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="font-display text-xl font-bold">Operational safeguards</h3>
          <div className="mt-4 space-y-3">
            {[
              ['Privacy', 'Lecturer dashboards show anonymised cohort trends, not private student chat logs.', Lock],
              ['Accessibility', 'Keyboard focus, readable contrast, and reduced motion support are part of the prototype.', SlidersHorizontal],
              ['Validation', 'Every knowledge addition requires lecturer approval before reuse.', ShieldCheck],
              ['Review loop', 'Escalated questions improve future semesters only after approval.', RotateCcw],
            ].map(([title, text, Icon]) => {
              const TypedIcon = Icon as typeof Lock;
              return (
                <div key={title as string} className="flex gap-3 rounded-2xl bg-paper p-4">
                  <TypedIcon className="text-companion" size={20} />
                  <div>
                    <p className="font-bold">{title as string}</p>
                    <p className="text-sm leading-6 text-slate-copy">{text as string}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <h3 className="font-display text-xl font-bold">Connected via Blackboard APIs</h3>
        <p className="mt-2 text-sm text-slate-copy">Implementation detail: lecture materials, assessment briefs, rubrics, enrolments, announcements, quizzes, PASS and mentoring information, and analytics can be connected through LMS APIs.</p>
      </Card>
    </div>
  );
}
