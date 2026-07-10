import { BookOpen, GraduationCap, ShieldCheck, Sparkles, UserRound } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, type Role } from '../context/AuthContext';
import { Button, Card, ConfidenceBadge } from '../components/ui';

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

  return (
    <div className="min-h-screen bg-[#101216] text-white">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-8 px-5 py-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <section className="flex flex-col justify-between rounded-[32px] border border-white/10 bg-white/[0.04] p-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cardinal">
                <BookOpen size={24} />
              </div>
              <div>
                <p className="font-display text-xl font-bold">bentley.lms</p>
                <p className="text-sm text-white/60">Blackboard Ultra 2030 prototype</p>
              </div>
            </div>
            <h1 className="mt-16 font-display text-5xl font-extrabold leading-tight md:text-6xl">Blackboard, made intelligent.</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/68">
              A familiar LMS workflow enhanced with a unit-specific AI Learning Companion, lecturer validation, and trustworthy source-attributed support.
            </p>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {['Courses', 'Materials', 'Assessments'].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                <Sparkles className="mb-3 text-companion" size={18} />
                <p className="font-semibold">{item}</p>
                <p className="mt-1 text-xs text-white/55">AI assistance embedded</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center">
          <Card className="w-full border-white/10 bg-white p-6 text-ink shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-mono text-xs font-semibold uppercase text-companion">Login</p>
                <h2 className="mt-1 font-display text-3xl font-bold">Welcome back</h2>
              </div>
              <ConfidenceBadge />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                ['student', UserRound, 'Student Login'],
                ['lecturer', GraduationCap, 'Lecturer Login'],
              ].map(([value, Icon, label]) => {
                const TypedIcon = Icon as typeof UserRound;
                const active = role === value;
                return (
                  <button
                    key={value as string}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setRole(value as Role)}
                    className={`rounded-2xl border p-4 text-left transition ${active ? 'border-companion bg-companion-tint' : 'border-line hover:border-companion'}`}
                  >
                    <TypedIcon className="mb-4 text-companion" />
                    <p className="font-bold">{label as string}</p>
                    <p className="mt-1 text-sm text-slate-copy">{value === 'student' ? 'Courses, unit materials, assessment drafts' : 'Analytics, review queue, knowledge base'}</p>
                  </button>
                );
              })}
            </div>

            <form onSubmit={submit} className="mt-6 space-y-4">
              <label className="block">
                <span className="text-sm font-bold">Name</span>
                <input value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-2xl border border-line bg-paper px-4 py-3" />
              </label>
              <label className="block">
                <span className="text-sm font-bold">Email</span>
                <input value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-2xl border border-line bg-paper px-4 py-3" />
              </label>
              <label className="block">
                <span className="text-sm font-bold">Password</span>
                <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-2xl border border-line bg-paper px-4 py-3" />
              </label>
              <Button type="submit">
                <ShieldCheck size={18} />
                Enter {role === 'student' ? 'Student Blackboard' : 'Lecturer Workspace'}
              </Button>
            </form>
          </Card>
        </section>
      </div>
    </div>
  );
}
