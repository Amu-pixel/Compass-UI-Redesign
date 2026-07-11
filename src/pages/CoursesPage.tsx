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
    <div className="min-h-screen bg-paper text-ink">
      {toast && <Toast message={toast} />}
      <aside className="fixed left-0 top-0 hidden h-screen w-72 border-r border-white/10 bg-night p-5 text-white lg:block">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-companion/40 bg-companion text-ink shadow-sm">
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
                className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${item.current ? 'bg-companion text-ink' : 'text-white/68 hover:bg-white/10 hover:text-white'}`}
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
        <header className="border-b border-line bg-paper/95 px-5 py-4 backdrop-blur sm:px-8">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-companion">Semester 2, 2026</p>
              <h1 className="mt-1 font-display text-2xl font-bold text-ink sm:text-3xl">Good to see you, {user?.name || 'David'}.</h1>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-copy">Continue the current module, then prepare the next assessment checkpoint.</p>
            </div>
            <ConfidenceBadge />
          </div>
        </header>

        <section className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
          <div className="grid gap-5 xl:grid-cols-12">
            <div className="rounded-[28px] border border-line bg-white p-6 shadow-sm xl:col-span-8">
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div>
                  <Badge tone="ai">Next action</Badge>
                  <h2 className="mt-4 font-display text-3xl font-bold text-ink">Continue Week 4: Bending Moment Diagrams</h2>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-copy">Resume Structural Analysis 301. Last activity: Slide 18, shear area creates moment change.</p>
                </div>
                <div className="rounded-2xl border border-line bg-paper px-4 py-3 text-right">
                  <p className="font-mono text-xs font-semibold uppercase text-slate-soft">Progress</p>
                  <p className="mt-1 font-display text-3xl font-bold text-ink">68%</p>
                  <p className="text-xs text-slate-soft">About 24 min left</p>
                </div>
              </div>
              <div className="mt-6 h-2 overflow-hidden rounded-full bg-paper-dim" role="progressbar" aria-label="Current unit progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={68}>
                <div className="h-full w-[68%] rounded-full bg-companion" />
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button to="/demo" variant="primary">
                  Continue learning <ArrowRight size={17} />
                </Button>
                <Button to="/demo/learn?method=practice" variant="secondary">
                  <Brain size={17} /> Practise concept
                </Button>
              </div>
            </div>

            <div className="rounded-[28px] border border-line bg-white p-5 shadow-sm xl:col-span-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-mono text-xs font-semibold uppercase text-companion">Upcoming priorities</p>
                  <h2 className="mt-1 font-display text-xl font-bold text-ink">What is due next</h2>
                </div>
                <FileCheck2 className="text-companion" size={22} />
              </div>
              <div className="mt-5 space-y-3">
              <Link
                to="/demo/assessment"
                className="premium-focus block rounded-2xl border border-companion/25 bg-companion-tint p-4 text-left outline-none hover:border-companion/50 focus-visible:ring-2 focus-visible:ring-ai-cyan/70"
              >
                <p className="text-sm font-bold text-ink">Assignment 2 draft reflection</p>
                <p className="mt-1 text-xs leading-5 text-slate-copy">Due Monday 9 am. Draft not reviewed.</p>
              </Link>
              <button
                type="button"
                onClick={() => notify('Resources are available from your enrolled course pages.')}
                className="premium-focus block w-full rounded-2xl border border-line bg-paper p-4 text-left outline-none hover:border-companion/45 focus-visible:ring-2 focus-visible:ring-ai-cyan/70"
              >
                <p className="text-sm font-bold text-ink">Week 4 slides connected</p>
                <p className="mt-1 text-xs leading-5 text-slate-copy">Use Slide 18 before practice.</p>
              </button>
              <button
                type="button"
                onClick={() => notify('Progress tracking is available from your enrolled course pages.')}
                className="premium-focus block w-full rounded-2xl border border-line bg-paper p-4 text-left outline-none hover:border-companion/45 focus-visible:ring-2 focus-visible:ring-ai-cyan/70"
              >
                <p className="text-sm font-bold text-ink">3 courses above pace</p>
                <p className="mt-1 text-xs leading-5 text-slate-copy">Keep CIVL301 moving first.</p>
              </button>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-[24px] border border-line bg-white p-4 shadow-sm">
            <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
              <label className="flex min-h-12 items-center gap-3 rounded-2xl border border-line bg-paper px-4">
                <Search size={18} className="text-slate-soft" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-slate-soft"
                  placeholder="Search your courses"
                  aria-label="Search your courses"
                />
              </label>
              <button
                type="button"
                onClick={() => notify('Current courses filter is already applied.')}
                className="premium-focus flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-line px-4 text-sm font-bold text-ink hover:border-companion"
              >
                <Filter size={17} />
                Current courses
              </button>
              <button
                type="button"
                onClick={() => notify('Semester selection is prepared for the full LMS catalogue.')}
                className="premium-focus flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-line px-4 text-sm font-bold text-ink hover:border-companion"
              >
                <CalendarDays size={17} />
                Semester 2, 2026
              </button>
            </div>
          </div>

          <div className="mb-4 mt-8 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-ink">Current units</h2>
            <p className="font-mono text-xs font-semibold uppercase text-slate-soft">{filteredCourses.length} courses</p>
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
                  <article className="h-full overflow-hidden rounded-[24px] border border-line bg-white shadow-sm transition group-hover:-translate-y-1 group-hover:border-companion/45">
                    <div className="relative h-20 border-b border-companion/35 bg-night">
                      <div className="absolute left-4 top-4 rounded-full border border-white/12 bg-white/10 px-3 py-1 font-mono text-xs font-bold text-mist">{course.code}</div>
                      <div className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/12 bg-white/10 text-companion">
                        <GraduationCap size={22} />
                      </div>
                    </div>
                    <div className="p-5">
                      <Badge tone="ai">AI Tutor aware</Badge>
                      <h3 className="mt-4 font-display text-xl font-bold text-ink">{course.title}</h3>
                      <p className="mt-2 text-sm text-slate-copy">{course.lecturer}</p>
                      <div className="mt-5">
                        <div className="mb-2 flex justify-between text-xs font-bold text-slate-copy">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                         <div className="h-2 rounded-full bg-paper-dim">
                          <div className="h-2 rounded-full bg-companion" style={{ width: `${course.progress}%` }} />
                        </div>
                      </div>
                      <p className="mt-4 rounded-2xl border border-line bg-paper p-3 text-sm font-semibold leading-5 text-slate-copy">{course.nextAssessment}</p>
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
