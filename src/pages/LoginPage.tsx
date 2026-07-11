import {
  ArrowRight,
  BookOpenCheck,
  Brain,
  CheckCircle2,
  FileCheck2,
  GraduationCap,
  LibraryBig,
  LockKeyhole,
  Route,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, ConfidenceBadge, Toast } from '../components/ui';
import { useAuth, type Role } from '../context/AuthContext';

const roleOptions: Array<{
  role: Role;
  icon: LucideIcon;
  title: string;
  text: string;
  path: string;
}> = [
  {
    role: 'student',
    icon: UserRound,
    title: 'Student workspace',
    text: 'Courses, modules, AI Tutor support, assignments, feedback, and progress.',
    path: '/courses',
  },
  {
    role: 'lecturer',
    icon: GraduationCap,
    title: 'Lecturer workspace',
    text: 'Teaching overview, review queue, assignments, resources, and cohort signals.',
    path: '/lecturer',
  },
];

const workflow = [
  { icon: BookOpenCheck, label: 'Dashboard', text: 'Start from the next best learning action.' },
  { icon: Route, label: 'Module', text: 'Move through lessons, materials, and resources.' },
  { icon: Brain, label: 'AI Tutor', text: 'Ask grounded questions with visible source cues.' },
  { icon: FileCheck2, label: 'Feedback', text: 'Submit, reflect, improve, and track progress.' },
];

const trustSignals = ['Source-grounded support', 'Academic integrity boundaries', 'Role-aware privacy', 'Lecturer validation'];

export default function LoginPage() {
  const [role, setRole] = useState<Role>('student');
  const [name, setName] = useState('David');
  const [email, setEmail] = useState('david@student.bentley.edu');
  const [password, setPassword] = useState('learning2030');
  const [notice, setNotice] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  function submit(event: FormEvent) {
    event.preventDefault();
    login({ name: name.trim() || 'David', email, role });
    navigate(role === 'student' ? '/courses' : '/lecturer');
  }

  function showPlaceholder(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 2400);
  }

  return (
    <div className="min-h-screen overflow-hidden bg-night text-mist">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(245,196,0,0.16),transparent_28%),radial-gradient(circle_at_82%_8%,rgba(255,245,194,0.10),transparent_30%),linear-gradient(180deg,#111111_0%,#1B1B1B_54%,#0C0C0C_100%)]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-5 sm:px-8">
        <header className="flex items-center justify-between gap-4 rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 shadow-[0_18px_70px_rgba(0,0,0,0.24)] backdrop-blur-xl">
          <a href="#top" className="premium-focus flex items-center gap-3 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ai-cyan/70">
            <span className="grid h-10 w-10 place-items-center rounded-full border border-companion/40 bg-companion text-ink shadow-sm">
              <Sparkles size={19} />
            </span>
            <span>
              <span className="block font-display text-sm font-bold leading-none tracking-wide">Compass AI LMS</span>
              <span className="mt-1 hidden text-xs text-mist-muted sm:block">Learning intelligence platform</span>
            </span>
          </a>
          <nav className="hidden items-center gap-1 text-sm font-semibold text-mist-muted md:flex" aria-label="Homepage">
            <a className="rounded-full px-3 py-2 transition hover:bg-white/8 hover:text-mist" href="#workflow">
              Workflow
            </a>
            <a className="rounded-full px-3 py-2 transition hover:bg-white/8 hover:text-mist" href="#tutor">
              AI Tutor
            </a>
            <a className="rounded-full px-3 py-2 transition hover:bg-white/8 hover:text-mist" href="#trust">
              Trust
            </a>
          </nav>
          <a
            href="#access"
            className="premium-focus inline-flex min-h-10 items-center justify-center rounded-full border border-white/12 bg-white/8 px-4 text-sm font-bold text-mist outline-none hover:border-ai-cyan/40 hover:bg-white/12 focus-visible:ring-2 focus-visible:ring-ai-cyan/70"
          >
            Sign in
          </a>
        </header>

        <main id="top" className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:py-14">
          <section className="animate-page">
            <div className="inline-flex items-center gap-2 rounded-full border border-companion/35 bg-companion-tint px-3 py-1.5 text-xs font-bold text-ink shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-ai-cyan" />
              Premium AI-powered learning management
            </div>

            <h1 className="mt-7 max-w-4xl font-display text-5xl font-extrabold leading-[1.02] text-mist sm:text-6xl lg:text-7xl">
              A calmer way to learn, teach, and trust AI.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-mist-muted">
              Compass brings courses, modules, assignments, progress, resources, and an intelligent AI Tutor into one focused academic workspace.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#access"
                className="premium-focus inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-companion bg-companion px-6 text-sm font-bold text-ink shadow-sm outline-none hover:border-ai-violet hover:bg-ai-violet focus-visible:ring-2 focus-visible:ring-ai-cyan/70"
              >
                Enter workspace <ArrowRight size={17} />
              </a>
              <button
                type="button"
                onClick={() => showPlaceholder('Institutional pilot requests are prepared for the commercial onboarding flow.')}
                className="premium-focus inline-flex min-h-12 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] px-6 text-sm font-bold text-mist outline-none hover:border-white/24 hover:bg-white/[0.07] focus-visible:ring-2 focus-visible:ring-ai-cyan/70"
              >
                Request pilot
              </button>
            </div>

            <div id="trust" className="mt-9 grid max-w-2xl gap-3 sm:grid-cols-2">
              {trustSignals.map((signal) => (
                <div key={signal} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-mist-muted">
                  <CheckCircle2 className="text-ai-cyan" size={17} />
                  {signal}
                </div>
              ))}
            </div>
          </section>

          <section id="access" aria-label="Role entry and sign in" className="animate-in rounded-[28px] border border-white/10 bg-white/[0.055] p-4 shadow-premium backdrop-blur-xl sm:p-5">
            <div className="rounded-[22px] border border-white/10 bg-night-panel/90 p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-ai-cyan">Secure access</p>
                  <h2 className="mt-2 font-display text-3xl font-bold text-mist">Choose your learning role</h2>
                </div>
                <ConfidenceBadge />
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2" role="group" aria-label="Choose role">
                {roleOptions.map((option) => {
                  const active = role === option.role;
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.role}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setRole(option.role)}
                      className={`premium-focus rounded-2xl border p-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-ai-cyan/70 ${
                        active
                          ? 'border-companion/60 bg-companion-tint shadow-sm'
                          : 'border-white/10 bg-white/[0.035] hover:border-white/24 hover:bg-white/[0.06]'
                      }`}
                    >
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <span className={`grid h-10 w-10 place-items-center rounded-2xl ${active ? 'bg-white text-ink shadow-sm' : 'bg-white/8 text-mist-muted'}`}>
                          <Icon size={20} />
                        </span>
                        <span className={`font-mono text-[11px] font-semibold uppercase ${active ? 'text-slate-copy' : 'text-mist-soft'}`}>{option.path}</span>
                      </div>
                      <p className={`font-display text-base font-bold ${active ? 'text-ink' : 'text-mist'}`}>{option.title}</p>
                      <p className={`mt-2 text-sm leading-6 ${active ? 'text-slate-copy' : 'text-mist-muted'}`}>{option.text}</p>
                    </button>
                  );
                })}
              </div>

              <form onSubmit={submit} className="mt-6 space-y-4">
                <label className="block">
                  <span className="text-sm font-bold text-mist">Name</span>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    autoComplete="name"
                    className="mt-2 min-h-12 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 text-mist outline-none transition placeholder:text-mist-soft focus:border-ai-cyan/55 focus:ring-2 focus:ring-ai-cyan/20"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-bold text-mist">Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    className="mt-2 min-h-12 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 text-mist outline-none transition placeholder:text-mist-soft focus:border-ai-cyan/55 focus:ring-2 focus:ring-ai-cyan/20"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-bold text-mist">Password</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    className="mt-2 min-h-12 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 text-mist outline-none transition placeholder:text-mist-soft focus:border-ai-cyan/55 focus:ring-2 focus:ring-ai-cyan/20"
                  />
                </label>
                <Button type="submit" variant="ai" size="lg" className="w-full">
                  <ShieldCheck size={18} />
                  Enter {role === 'student' ? 'Student workspace' : 'Lecturer workspace'}
                </Button>
              </form>

              <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-mist-soft">
                <span className="inline-flex items-center gap-1.5">
                  <LockKeyhole size={14} /> Demo credentials are prefilled
                </span>
                <button
                  type="button"
                  onClick={() => showPlaceholder('Privacy and institutional controls will open as a full governance page in a later phase.')}
                  className="rounded-full font-semibold text-ai-cyan outline-none hover:text-mist focus-visible:ring-2 focus-visible:ring-ai-cyan/70"
                >
                  View privacy controls
                </button>
              </div>
            </div>
          </section>
        </main>

        <section id="workflow" className="relative grid gap-4 pb-6 md:grid-cols-4">
          {workflow.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.label} className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.16)] backdrop-blur">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] text-ai-cyan">
                    <Icon size={21} />
                  </span>
                  <span className="h-px flex-1 bg-gradient-to-r from-ai-cyan/35 to-transparent" />
                </div>
                <h3 className="font-display text-lg font-bold text-mist">{item.label}</h3>
                <p className="mt-2 text-sm leading-6 text-mist-muted">{item.text}</p>
              </article>
            );
          })}
        </section>

        <section id="tutor" className="grid gap-5 pb-10 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-ai-cyan">AI Tutor</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-mist">Mentor-like support, grounded in course context.</h2>
            <p className="mt-4 text-sm leading-7 text-mist-muted">
              The AI experience is designed to show boundaries, citations, confidence, and next learning actions, so support feels academic instead of generic.
            </p>
          </div>
          <div className="rounded-3xl border border-companion/25 bg-white/[0.055] p-5 shadow-premium">
            <div className="rounded-2xl border border-white/10 bg-night/70 p-5">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-ai-cyan/14 text-ai-cyan">
                  <Brain size={20} />
                </span>
                <div>
                  <p className="font-display text-sm font-bold text-mist">Compass Tutor</p>
                  <p className="mt-2 text-sm leading-6 text-mist-muted">
                    I can explain this module using your course materials, flag uncertainty, and suggest a next practice step.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-success/25 bg-success/10 px-3 py-1 font-mono text-[11px] font-semibold text-success">Grounded</span>
                    <span className="rounded-full border border-ai-cyan/25 bg-ai-cyan/10 px-3 py-1 font-mono text-[11px] font-semibold text-ai-cyan">3 sources</span>
                    <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 font-mono text-[11px] font-semibold text-mist-muted">Next: quiz practice</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="flex flex-col gap-3 border-t border-white/10 py-6 text-sm text-mist-soft sm:flex-row sm:items-center sm:justify-between">
          <span>Compass AI LMS. Commercial-grade academic learning experience.</span>
          <button
            type="button"
            onClick={() => showPlaceholder('Resource library previews will be connected during the course-pages phase.')}
            className="inline-flex items-center gap-2 rounded-full text-left font-semibold text-mist-muted outline-none hover:text-ai-cyan focus-visible:ring-2 focus-visible:ring-ai-cyan/70"
          >
            <LibraryBig size={16} /> Preview resources
          </button>
        </footer>
      </div>
      {notice && <Toast message={notice} />}
    </div>
  );
}
