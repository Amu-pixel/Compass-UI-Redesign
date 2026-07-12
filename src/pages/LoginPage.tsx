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
import { Button, Badge } from '../components/ui';
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
  { icon: BookOpenCheck, label: 'Grounded in unit content', text: 'Students learn from the same trusted materials lecturers provide.' },
  { icon: Route, label: 'Clear academic workflow', text: 'Move from unit, lesson, tutor support, assignment, and feedback without losing context.' },
  { icon: Brain, label: 'Support escalation', text: 'Confused students can move from AI help to the right human support pathway.' },
  { icon: FileCheck2, label: 'Lecturer-controlled assessment', text: 'AI guidance stays advisory until academic staff review and decide.' },
];

const trustSignals = ['Transparent demo boundaries', 'Role-aware access', 'Assessment integrity controls', 'Curtin-inspired academic tone'];

export default function LoginPage() {
  const [role, setRole] = useState<Role>('student');
  const [name, setName] = useState('David');
  const [email, setEmail] = useState('david@student.bentley.edu');
  const [password, setPassword] = useState('learning2030');
  const { login } = useAuth();
  const navigate = useNavigate();

  function submit(event: FormEvent) {
    event.preventDefault();
    login({ name: name.trim() || 'David', email, role });
    navigate(role === 'student' ? '/courses' : '/lecturer');
  }

  function enterAs(nextRole: Role) {
    setRole(nextRole);
    login({
      name: name.trim() || (nextRole === 'student' ? 'David' : 'Dr Maya Chen'),
      email: nextRole === 'student' ? 'david@student.bentley.edu' : 'maya.chen@curtin.edu.au',
      role: nextRole,
    });
    navigate(nextRole === 'student' ? '/courses' : '/lecturer');
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-paper text-ink">
      <header className="border-b border-line bg-white/95 px-5 py-4 backdrop-blur sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <a href="#top" className="premium-focus flex min-w-0 items-center gap-3 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-companion/70">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-companion/35 bg-companion text-ink shadow-sm">
              <Sparkles size={19} aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block font-display text-sm font-bold leading-none tracking-wide">Compass AI</span>
              <span className="mt-1 hidden text-xs text-slate-copy sm:block">Learning intelligence platform</span>
            </span>
          </a>
          <nav className="hidden items-center gap-1 text-sm font-semibold text-slate-copy md:flex" aria-label="Homepage">
            <a className="rounded-full px-3 py-2 transition hover:bg-companion-tint hover:text-ink" href="#workflow">
              Workflow
            </a>
            <a className="rounded-full px-3 py-2 transition hover:bg-companion-tint hover:text-ink" href="#roles">
              Roles
            </a>
            <a className="rounded-full px-3 py-2 transition hover:bg-companion-tint hover:text-ink" href="#trust">
              Trust
            </a>
          </nav>
          <a
            href="#access"
            className="premium-focus inline-flex min-h-10 shrink-0 items-center justify-center rounded-full border border-line bg-white px-4 text-sm font-bold text-ink outline-none hover:border-companion hover:bg-companion-tint focus-visible:ring-2 focus-visible:ring-companion/70"
          >
            Sign in
          </a>
        </div>
      </header>

      <main id="top">
        <section className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:py-14">
          <div className="flex flex-col justify-center">
            <Badge tone="ai">University-ready AI learning platform</Badge>
            <h1 className="mt-6 max-w-4xl font-display text-4xl font-extrabold leading-[1.05] text-ink sm:text-5xl lg:text-6xl">
              AI-supported learning for students and lecturers.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-copy sm:text-lg">
              Compass brings unit content, assessments, learning support, and lecturer workflows into one trusted academic workspace.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => enterAs('student')}
                className="premium-focus inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-ink bg-ink px-6 text-sm font-bold text-white shadow-sm outline-none hover:bg-night-elevated focus-visible:ring-2 focus-visible:ring-companion/70"
              >
                Enter as Student <ArrowRight size={17} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => enterAs('lecturer')}
                className="premium-focus inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-line bg-white px-6 text-sm font-bold text-ink outline-none hover:border-companion hover:bg-companion-tint focus-visible:ring-2 focus-visible:ring-companion/70"
              >
                Enter as Lecturer <GraduationCap size={17} aria-hidden="true" />
              </button>
            </div>

            <div id="trust" className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-2">
              {trustSignals.map((signal) => (
                <div key={signal} className="flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3 text-sm font-semibold text-slate-copy shadow-sm">
                  <CheckCircle2 className="text-companion" size={17} aria-hidden="true" />
                  {signal}
                </div>
              ))}
            </div>
          </div>

          <section id="access" aria-label="Role entry and sign in" className="rounded-[28px] border border-line bg-white p-4 shadow-sm sm:p-5">
            <div className="rounded-[22px] border border-line bg-paper p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-companion">Secure demo access</p>
                  <h2 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">Choose your workspace</h2>
                </div>
                <Badge tone="success">Grounded</Badge>
              </div>

              <div id="roles" className="mt-6 grid gap-3 sm:grid-cols-2" role="group" aria-label="Choose role">
                {roleOptions.map((option) => {
                  const active = role === option.role;
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.role}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setRole(option.role)}
                      className={`premium-focus rounded-2xl border p-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-companion/70 ${
                        active
                          ? 'border-companion bg-companion-tint shadow-sm'
                          : 'border-line bg-white hover:border-companion hover:bg-companion-tint/45'
                      }`}
                    >
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <span className={`grid h-10 w-10 place-items-center rounded-2xl ${active ? 'bg-white text-ink shadow-sm' : 'bg-paper-dim text-slate-copy'}`}>
                          <Icon size={20} aria-hidden="true" />
                        </span>
                        <span className="font-mono text-[11px] font-semibold uppercase text-slate-soft">{option.path}</span>
                      </div>
                      <p className="font-display text-base font-bold text-ink">{option.title}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-copy">{option.text}</p>
                    </button>
                  );
                })}
              </div>

              <form onSubmit={submit} className="mt-6 space-y-4">
                <label className="block">
                  <span className="text-sm font-bold text-ink">Name</span>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    autoComplete="name"
                    className="mt-2 min-h-12 w-full rounded-2xl border border-line bg-white px-4 text-ink outline-none transition placeholder:text-slate-soft focus:border-companion focus:ring-2 focus:ring-companion/20"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-bold text-ink">Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    className="mt-2 min-h-12 w-full rounded-2xl border border-line bg-white px-4 text-ink outline-none transition placeholder:text-slate-soft focus:border-companion focus:ring-2 focus:ring-companion/20"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-bold text-ink">Password</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    className="mt-2 min-h-12 w-full rounded-2xl border border-line bg-white px-4 text-ink outline-none transition placeholder:text-slate-soft focus:border-companion focus:ring-2 focus:ring-companion/20"
                  />
                </label>
                <Button type="submit" variant="primary" size="lg" className="w-full">
                  <ShieldCheck size={18} />
                  Enter {role === 'student' ? 'Student workspace' : 'Lecturer workspace'}
                </Button>
              </form>

              <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-slate-soft">
                <span className="inline-flex items-center gap-1.5">
                  <LockKeyhole size={14} aria-hidden="true" /> Demo credentials are prefilled
                </span>
                <a
                  href="#trust"
                  className="rounded-full font-semibold text-ink outline-none hover:text-companion focus-visible:ring-2 focus-visible:ring-companion/70"
                >
                  View trust controls
                </a>
              </div>
            </div>
          </section>
        </section>

        <section id="workflow" className="mx-auto grid max-w-7xl gap-4 px-5 pb-10 sm:px-8 md:grid-cols-4">
          {workflow.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.label} className="rounded-3xl border border-line bg-white p-5 shadow-sm">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl border border-line bg-companion-tint text-ink">
                    <Icon size={21} aria-hidden="true" />
                  </span>
                  <span className="h-px flex-1 bg-line" />
                </div>
                <h3 className="font-display text-lg font-bold text-ink">{item.label}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-copy">{item.text}</p>
              </article>
            );
          })}
        </section>
      </main>

      <footer className="border-t border-line bg-white px-5 py-6 text-sm text-slate-copy sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span>Compass AI LMS. Commercial-grade academic learning experience.</span>
          <a
            href="#workflow"
            className="inline-flex items-center gap-2 rounded-full text-left font-semibold text-ink outline-none hover:text-companion focus-visible:ring-2 focus-visible:ring-companion/70"
          >
            <LibraryBig size={16} aria-hidden="true" /> Review workflow
          </a>
        </div>
      </footer>
    </div>
  );
}
