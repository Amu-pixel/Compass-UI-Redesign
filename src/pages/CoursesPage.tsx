import { ArrowRight, BarChart3, BookOpenCheck, Brain, CalendarDays, FileCheck2, Filter, GraduationCap, LibraryBig, LogOut, Search, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { courses } from '../data/mockData';
import { Badge, Button, ConfidenceBadge, EmptyState, Toast } from '../components/ui';

export default function CoursesPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [toast, setToast] = useState('');
  const filteredCourses = courses.filter((course) => {
    const haystack = `${course.code} ${course.title} ${course.lecturer} ${course.term} ${course.nextAssessment}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });

  function notify(message: string) {
    setToast(message);
    setTimeout(() => setToast(''), 1800);
  }

  function handleSidebarNav(item: string) {
    if (item === 'Courses') return; // already here
    if (item === 'AI Tutor') { navigate('/demo/learn'); return; }
    if (item === 'Assignments') { navigate('/demo/assessment'); return; }
    if (item === 'Modules') { navigate('/demo'); return; }
    notify(`${item} — available from your enrolled course pages.`);
  }

  return (
    <div className="min-h-screen bg-night text-mist">
      {toast && <Toast message={toast} />}
      <aside className="fixed left-0 top-0 hidden h-screen w-72 border-r border-white/10 bg-[#0B0D12] p-5 text-white lg:block">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-ai-cyan/30 bg-ai-cyan/10 text-ai-cyan shadow-[0_0_26px_rgba(109,231,242,0.12)]">
            <Sparkles size={21} />
          </div>
          <div>
            <p className="font-display text-sm font-bold">Compass AI LMS</p>
            <p className="text-xs text-white/55">Student workspace</p>
          </div>
        </div>
        <nav className="mt-10 space-y-2" aria-label="Student navigation">
          {[
            { label: 'Courses', current: true },
            { label: 'Modules', route: '/demo' },
            { label: 'AI Tutor', route: '/demo/learn' },
            { label: 'Assignments', route: '/demo/assessment' },
            { label: 'Progress' },
            { label: 'Resources' },
            { label: 'Support' },
          ].map((item) => {
            if (item.route) {
              return (
                <Link
                  key={item.label}
                  to={item.route}
                  className="flex w-full items-center rounded-2xl px-4 py-3 text-left text-sm font-semibold text-white/68 transition hover:bg-white/10 hover:text-white"
                >
                  {item.label}
                </Link>
              );
            }
            return (
              <button
                key={item.label}
                type="button"
                aria-current={item.current ? 'page' : undefined}
                onClick={() => handleSidebarNav(item.label)}
                className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${item.current ? 'bg-white text-ink' : 'text-white/68 hover:bg-white/10 hover:text-white'}`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
        <button type="button" aria-label="Sign out" onClick={logout} className="absolute bottom-5 left-5 right-5 flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-white/70 hover:bg-white/10">
          <LogOut size={17} />
          Sign out
        </button>
      </aside>

      <main className="lg:ml-72">
        <header className="border-b border-white/10 bg-night/92 px-5 py-5 backdrop-blur sm:px-8">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-ai-cyan">Student dashboard</p>
              <h1 className="mt-2 font-display text-4xl font-bold text-mist">Good to see you, {user?.name || 'David'}.</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-mist-muted">Your courses, modules, AI Tutor, assignments, resources, and progress are organized around the next best learning action.</p>
            </div>
            <ConfidenceBadge />
          </div>
        </header>

        <section className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
          <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[28px] border border-ai-cyan/20 bg-gradient-to-br from-ai-cyan/12 via-ai-violet/10 to-ai-rose/8 p-6 shadow-[0_0_54px_rgba(109,231,242,0.08)]">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <Badge tone="ai">Next action</Badge>
                  <h2 className="mt-4 font-display text-3xl font-bold text-mist">Continue Week 4: Bending Moment Diagrams</h2>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-mist-muted">Resume Structural Analysis 301, then ask the AI Tutor to check your reasoning before the draft reflection checkpoint.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-right">
                  <p className="font-mono text-xs font-semibold uppercase text-mist-soft">Learning momentum</p>
                  <p className="mt-1 font-display text-3xl font-bold text-mist">68%</p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button to="/demo" variant="ai">
                  Resume module <ArrowRight size={17} />
                </Button>
                <Button to="/demo/learn" variant="secondary" className="border-white/15 bg-white/[0.06] text-mist hover:bg-white/[0.1]">
                  <Brain size={17} /> Open AI Tutor
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
              <Link
                to="/demo/assessment"
                className="premium-focus rounded-3xl border border-white/10 bg-white/[0.045] p-5 text-left outline-none hover:border-ai-cyan/30 focus-visible:ring-2 focus-visible:ring-ai-cyan/70"
              >
                <FileCheck2 className="text-ai-cyan" size={20} />
                <p className="mt-4 font-display text-lg font-bold text-mist">Assignments</p>
                <p className="mt-2 text-sm leading-6 text-mist-muted">Draft reflection due Monday</p>
              </Link>
              <button
                type="button"
                onClick={() => notify('Resources are available from your enrolled course pages.')}
                className="premium-focus rounded-3xl border border-white/10 bg-white/[0.045] p-5 text-left outline-none hover:border-ai-cyan/30 focus-visible:ring-2 focus-visible:ring-ai-cyan/70"
              >
                <LibraryBig className="text-ai-cyan" size={20} />
                <p className="mt-4 font-display text-lg font-bold text-mist">Resources</p>
                <p className="mt-2 text-sm leading-6 text-mist-muted">Week 4 slides connected</p>
              </button>
              <button
                type="button"
                onClick={() => notify('Progress tracking is available from your enrolled course pages.')}
                className="premium-focus rounded-3xl border border-white/10 bg-white/[0.045] p-5 text-left outline-none hover:border-ai-cyan/30 focus-visible:ring-2 focus-visible:ring-ai-cyan/70"
              >
                <BarChart3 className="text-ai-cyan" size={20} />
                <p className="mt-4 font-display text-lg font-bold text-mist">Progress</p>
                <p className="mt-2 text-sm leading-6 text-mist-muted">3 courses above pace</p>
              </button>
            </div>
          </div>

          <div className="mt-6 rounded-[24px] border border-white/10 bg-white/[0.045] p-4">
            <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
              <label className="flex min-h-12 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4">
                <Search size={18} className="text-mist-soft" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-sm text-mist outline-none placeholder:text-mist-soft"
                  placeholder="Search your courses"
                  aria-label="Search your courses"
                />
              </label>
              <button
                type="button"
                onClick={() => notify('Current courses filter is already applied.')}
                className="premium-focus flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 text-sm font-bold text-mist hover:border-ai-cyan/40"
              >
                <Filter size={17} />
                Current courses
              </button>
              <button
                type="button"
                onClick={() => notify('Semester selection is prepared for the full LMS catalogue.')}
                className="premium-focus flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 text-sm font-bold text-mist hover:border-ai-cyan/40"
              >
                <CalendarDays size={17} />
                Semester 2, 2026
              </button>
            </div>
          </div>

          <div className="mb-4 mt-8 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-mist">Enrolled courses</h2>
            <p className="font-mono text-xs font-semibold uppercase text-mist-soft">{filteredCourses.length} courses</p>
          </div>

          {filteredCourses.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No matching courses"
              text="Try another course name, code, lecturer, or assessment keyword."
              action={<Button variant="secondary" onClick={() => setQuery('')}>Clear search</Button>}
            />
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredCourses.map((course) => (
                <Link key={course.code} to="/demo" className="group rounded-[28px] outline-none focus-visible:ring-2 focus-visible:ring-ai-cyan/70">
                  <article className="h-full overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.055] transition group-hover:-translate-y-1 group-hover:border-ai-cyan/35 group-hover:shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
                    <div className="relative h-32" style={{ background: course.image }}>
                      <div className="absolute left-4 top-4 rounded-full bg-night/75 px-3 py-1 font-mono text-xs font-bold text-mist backdrop-blur">{course.code}</div>
                      <div className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur">
                        <GraduationCap size={22} />
                      </div>
                    </div>
                    <div className="p-5">
                      <Badge tone="ai">AI Tutor aware</Badge>
                      <h3 className="mt-4 font-display text-xl font-bold text-mist">{course.title}</h3>
                      <p className="mt-2 text-sm text-mist-muted">{course.lecturer}</p>
                      <div className="mt-5">
                        <div className="mb-2 flex justify-between text-xs font-bold text-mist-muted">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/10">
                          <div className="h-2 rounded-full bg-gradient-to-r from-ai-cyan to-ai-violet" style={{ width: `${course.progress}%` }} />
                        </div>
                      </div>
                      <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.05] p-3 text-sm font-semibold leading-5 text-mist-muted">{course.nextAssessment}</p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-8">
            <Button to="/demo" variant="ai">Continue Structural Analysis 301</Button>
          </div>
        </section>
      </main>
    </div>
  );
}
