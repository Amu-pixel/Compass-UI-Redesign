import { ArrowDown, Bot, Database, GraduationCap, School, Sparkles, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { featureCards, heroStats, learningLoop } from '../data/mockData';
import { Button, Card, ConfidenceBadge, FeatureCard, Section } from '../components/ui';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="sticky top-0 z-30 border-b border-line bg-paper/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link to="/" className="font-display text-lg font-bold">AI Learning Companion</Link>
          <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-copy md:flex">
            <a href="#overview">Overview</a>
            <a href="#features">Features</a>
            <a href="#trust">Trust</a>
          </nav>
          <Button to="/demo">Enter Demo</Button>
        </div>
      </header>

      <section id="overview" className="mx-auto grid min-h-[calc(100vh-76px)] max-w-7xl items-center gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[0.94fr_1.06fr]">
        <div className="animate-in">
          <ConfidenceBadge />
          <h1 className="mt-7 font-display text-5xl font-extrabold leading-[1.04] sm:text-6xl lg:text-7xl">AI Learning Companion</h1>
          <p className="mt-6 max-w-2xl text-xl leading-8 text-slate-copy">Transforming Blackboard into an adaptive learning ecosystem.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button to="/demo">Enter Demo</Button>
            <Button to="#features" variant="secondary">Explore Features</Button>
          </div>
          <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
            {heroStats.map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-line bg-white p-4">
                <p className="font-display text-2xl font-bold">{value}</p>
                <p className="mt-1 text-xs font-semibold text-slate-copy">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <Card className="relative overflow-hidden p-4 sm:p-6">
          <div className="absolute right-8 top-8 h-28 w-28 rounded-full bg-companion-tint blur-3xl" />
          <div className="grid min-h-[520px] place-items-center rounded-[28px] bg-gradient-to-br from-white via-paper to-companion-tint/60 p-5">
            <div className="relative h-[430px] w-full max-w-[520px]">
              {[
                ['Student', UserRound, 'left-3 top-16'],
                ['AI Companion', Bot, 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'],
                ['Lecturer', GraduationCap, 'right-3 top-16'],
                ['Blackboard', School, 'left-16 bottom-8'],
                ['Knowledge Base', Database, 'right-12 bottom-8'],
              ].map(([label, Icon, pos]) => {
                const TypedIcon = Icon as typeof Bot;
                return (
                  <div key={label as string} className={`absolute ${pos} flex h-32 w-32 flex-col items-center justify-center rounded-[28px] border border-line bg-white text-center shadow-sm transition hover:-translate-y-1`}>
                    <TypedIcon className="mb-3 text-companion" size={30} />
                    <p className="text-sm font-bold">{label as string}</p>
                  </div>
                );
              })}
              <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-companion/20" />
              <Sparkles className="pulse-soft absolute left-[47%] top-[45%] text-cardinal" size={24} />
            </div>
          </div>
        </Card>
      </section>

      <Section eyebrow="Continuous loop" title="From passive content to adaptive teaching">
        <div className="grid gap-3 md:grid-cols-4">
          {learningLoop.map((step, index) => (
            <Card key={step} className="flex items-center justify-between">
              <span className="font-semibold">{step}</span>
              {index < learningLoop.length - 1 && <ArrowDown className="text-companion md:-rotate-90" size={18} />}
            </Card>
          ))}
        </div>
      </Section>

      <Section id="features" eyebrow="Product" title="One companion, three governed experiences">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {featureCards.map((feature) => <FeatureCard key={feature.title} {...feature} />)}
        </div>
      </Section>

      <Section id="trust" eyebrow="Trust" title="Designed to facilitate learning, not complete assessments">
        <div className="grid gap-5 lg:grid-cols-3">
          {['Approved unit materials only', 'Source-attributed responses', 'Low confidence escalates'].map((title) => (
            <Card key={title}>
              <h3 className="font-display text-lg font-bold">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-copy">The AI Companion demonstrates a lecturer-governed learning model where clarity and boundaries are visible in the interface.</p>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}
