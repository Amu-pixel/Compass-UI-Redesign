# Product Recovery Plan

## Audit Scope And Status

- Audit date: 10 July 2026
- Branch: `shardul-ui-redesign`
- Target: a five-hour production-readiness recovery sprint, with no change to authentication, role guards, mock data contracts, deterministic AI responses, or existing localStorage keys unless a checkpoint explicitly preserves their behaviour.
- Current implementation: a polished React/Vite prototype with working role-gated routes, local UI state, deterministic AI responses, and many intentionally simulated workflows. It is not yet production-ready where UI controls imply file persistence, media playback, communication, or workflow persistence.

## Real Versus Simulated Features

| Area | Real today | Simulated or missing today | Recovery decision |
|---|---|---|---|
| Authentication and route guards | Student/lecturer role guard, login/logout, route redirects, localStorage hydration | Demo credentials and users are mock-only | Preserve behaviour |
| AI Tutor | Input, deterministic response generation, source/state labels, follow-ups, support-state trigger, `ailc-memory` persistence | No model, retrieval, or queue persistence behind escalation language | Keep explicit prototype boundary; do not imply a real queue unless local state is surfaced |
| Learning Method Studio | Eight accessible tabs select distinct rendered content; practice actions enter the existing tutor flow | "Generation" is a 650 ms timer and all previews are deterministic | Retain preview framing; make media controls truthful |
| Video | Play/pause UI, restart, speed state, caption/transcript visibility, simulated progress state | No asset, no `<video>`, no `currentTime`, no seek, volume, mute, tracks, caption file, or native playback | P0: implement a local HTML5 video demo or rename/remove media-player affordances |
| Podcast | Play/pause UI, restart, speed state, transcript visibility, simulated progress state | No asset, no `<audio>`, no playback/resume/currentTime, seek, volume, mute, or native duration | P0: implement a local HTML5 audio demo or rename/remove media-player affordances |
| Student assignment | Animated draft states, formative feedback, final-submission UI gate | Upload uses a hard-coded filename; no file picker/drop handling, file validation, persistence, or network submission | P0: add a real local file-selection interaction and clear demo persistence boundary |
| Lecturer review | Selection, feedback editor, accept/edit/override/reject state transitions, visible loading/toasts | Decisions and edited feedback are in-memory only; Review Queue and Knowledge Base actions do not mutate a shared store | P1: make mock workflow state consistent within the session, or label every action as a preview |
| Resources | Resource cards and feedback | Download/Open/View only show a toast; no resource target or preview | P1: route to a resource preview/placeholder rather than claiming an action is available |
| Lecturer contact | Human-support names, availability, escalation copy | No contact form, mailto, appointment workflow, or student-visible escalation record | P0: add a scoped, honest contact workflow |

## P0 Backlog: Demo-Blocking Or Misleading

### P0-1: Replace simulated media-player claims with native media playback

- Files: `src/pages/LearningPage.tsx`, `src/components/ui.tsx`, `src/index.css`, plus new local assets under `src/assets/media/` or an approved public asset location.
- Evidence: the rendered Learning Workspace contains zero `<video>`, zero `<audio>`, and zero media source elements. Progress advances only through `setInterval` in `LearningPage.tsx`.
- Required outcome: each preview has either a real, local, royalty-safe media asset and native `<video>`/`<audio>` element, or is renamed as a non-player storyboard/reading preview with no playback controls.
- Native control acceptance: play, pause, resume, restart, scrub/seek, volume, mute, speed, current progress, elapsed/total time, captions where relevant, transcript disclosure, keyboard access, visible focus, and reduced-motion-safe poster/animation behaviour.
- Do not fake `currentTime`; read it from the media element. Do not show a volume/mute/seek control until it works.

### P0-2: Provide a working student-to-lecturer contact workflow

- Files: `src/pages/LearningPage.tsx`, `src/pages/UnitPage.tsx`, `src/pages/AssessmentPage.tsx`, `src/data/mockData.ts`, optionally a new shared `ContactLecturerPanel` in `src/components/`.
- Evidence: the Human support cards for Dr Avery Tan and PASS only dispatch toast feedback. AI responses claim an item has entered the lecturer review queue without creating any visible student record or queue item.
- Required outcome: a student can open a small, accessible contact panel, select a contextual reason, review a prefilled subject/context, write an optional question, and receive an honest local-demo confirmation. Store a local mock request only if the lecturer review list can visibly reflect it; otherwise state that it is a prepared draft rather than sent.
- Best placements: Learning Workspace Human support panel (primary); Unit Materials AI Companion support state (contextual); Assessment post-feedback section (when clarification affects feedback or integrity). Avoid putting a generic contact control in every card.

### P0-3: Make assignment upload a real local interaction

- Files: `src/pages/AssessmentPage.tsx`, optionally `src/components/ui.tsx`.
- Evidence: the Upload draft button calls `uploadDraft('CIVL301_BMD_reflection_draft.pdf')`; no file input exists.
- Required outcome: use a labelled `<input type="file">` or equivalent accessible drop target; validate allowed extension and file size locally; display the selected filename; preserve the existing timed mock review feedback and final-submission gate. Clearly state that the prototype does not transmit the file.

## P1 Backlog: Major Quality Or Workflow Problems

### P1-1: Give modules, lessons, and resources meaningful destinations

- Files: `src/pages/UnitPage.tsx`, `src/main.tsx`, `src/data/mockData.ts`, possibly a new `LessonPage.tsx` or parameterized unit route.
- Current issue: completed and current module-map links return to `/demo`; only the Week selector meaningfully changes the displayed slide. Resource actions show a toast instead of opening a local preview.
- Recovery outcome: keep the single-course mock scope but create distinct local lesson/resource states or routes. Locked modules must remain explicitly locked; completed/current modules must not look like navigation while returning to the same generic page.

### P1-2: Align student escalation language with lecturer workflow state

- Files: `src/pages/LearningPage.tsx`, `src/pages/UnitPage.tsx`, `src/pages/DashboardPage.tsx`, `src/data/mockData.ts` or a small demo workflow store.
- Current issue: tutor responses say a question entered the lecturer queue, but no action adds that question to the lecturer list.
- Recovery outcome: either create a session-only escalation record that appears in Review Queue with context/source, or change the language to "prepare a question for your lecturer". The latter is safer within the existing deterministic prototype model.

### P1-3: Make lecturer decisions internally consistent

- Files: `src/pages/LecturerAssignmentsPage.tsx`, `src/pages/DashboardPage.tsx`, `src/pages/KnowledgeBasePage.tsx`, `src/data/mockData.ts`.
- Current issue: individual decision controls respond, but their results do not propagate between assignment review, review queue, and knowledge base. Knowledge Base actions are toasts only.
- Recovery outcome: create a minimal session-only mock store for reviewed submissions and lecturer-approved answers, or use explicit "preview" status consistently. Preserve the human-review boundary.

### P1-4: Tighten the visual system into a credible university product

- Files: `src/index.css`, `src/components/ui.tsx`, `src/components/AppLayout.tsx`, `src/pages/CoursesPage.tsx`, `src/pages/LearningPage.tsx`, `src/pages/AssessmentPage.tsx`, `src/pages/UnitPage.tsx`, `src/pages/DashboardPage.tsx`.
- Current issue: the shell is dark-first but most work surfaces are bright white, rounded cards are frequently nested, and button shapes/radii vary. The result is attractive but closer to a premium product prototype than a professional university system.
- Recovery outcome: retain the approved palette and typefaces; reduce decorative rounded containers; reserve gradient/glow for AI identity; establish a denser academic work-surface rhythm; standardize primary/secondary/destructive control height, radius, and icon alignment.

### P1-5: Clarify the dashboard information architecture

- Files: `src/pages/CoursesPage.tsx`, `src/components/AppLayout.tsx`, `src/main.tsx`.
- Current issue: `/courses` acts as the student dashboard while the navigation label is Courses. This obscures the intended Dashboard -> Course -> Module -> Lesson journey.
- Recovery outcome: either introduce a student Dashboard route and reserve Courses for course discovery, or rename the existing destination to match its mixed dashboard/course role. Do not disturb lecturer routes.

## P2 Backlog: Refinement

- P2-1: Add responsive regression coverage for the Learning Method Studio's eight long tab labels, media-control wrapping, assignment feedback grids, and fixed mobile navigation. Files: `LearningPage.tsx`, `AssessmentPage.tsx`, `AppLayout.tsx`, `index.css`.
- P2-2: Replace static/repeated analytics with compact, labelled data views and an explicit mock-data timestamp. Files: `DashboardPage.tsx`, `LecturerAssignmentsPage.tsx`, `data/mockData.ts`.
- P2-3: Add page-level skeleton states only to asynchronous-looking transitions, not every static card. Files: `ui.tsx`, `LearningPage.tsx`, `AssessmentPage.tsx`, `LecturerAssignmentsPage.tsx`.
- P2-4: Improve motion hierarchy. Existing page fade, response fade, hover transitions, upload animation, and reduced-motion override exist; media and route transitions lack genuine state-driven feedback. Files: `index.css`, page components above.
- P2-5: Complete semantic accessibility review: ensure decorative SVGs are hidden, media transcripts and captions expose truthful state, tabs retain focus after content change, and toast messages are not the only confirmation of a consequential demo action.

## P3 Backlog: Optional After Recovery

- Add real backend/API integration only after the local prototype workflow is no longer misleading.
- Add cross-session persistence for submissions, lecturer review, and contact requests.
- Add richer charts only when the metrics have a defined source and interpretation.

## Recommended Antigravity Checkpoints

| Checkpoint | Scope | Exact files | Acceptance criteria |
|---|---|---|---|
| 1. Truthful media | Replace or downgrade player simulations | `LearningPage.tsx`, media assets, `index.css` | Native media exists for every player claim; all displayed controls work; no fabricated duration/current-time claims remain |
| 2. Contact and escalation | Student contact panel and honest queue language | `LearningPage.tsx`, `UnitPage.tsx`, `AssessmentPage.tsx`, `DashboardPage.tsx`, `mockData.ts` | Student can prepare/send a local demo request; acknowledgement says exactly what happened; no invisible queue claim |
| 3. Submission integrity | Local file-selection flow | `AssessmentPage.tsx` | User selects a file; validation feedback works; existing feedback and final gate still work; no real upload is claimed |
| 4. Lesson and resource flow | Meaningful local destinations | `UnitPage.tsx`, `main.tsx`, `mockData.ts`, optional lesson/resource components | Module/resource controls route to distinct content or clearly declared preview states; locked state remains clear |
| 5. Lecturer workflow coherence | Shared session mock state | `LecturerAssignmentsPage.tsx`, `DashboardPage.tsx`, `KnowledgeBasePage.tsx`, `mockData.ts` | Decision/feedback changes are reflected where the UI claims they are; human approval remains required |
| 6. Quality pass | Density, hierarchy, responsive and accessibility polish | `index.css`, `ui.tsx`, `AppLayout.tsx`, affected pages | No excessive card nesting, controls are consistent, keyboard path is intact, and 320/768/1024/1440 px views are intentional |

## Browser-Test Checklist

### Student

- Sign in as student; direct-load `/courses`, `/demo`, `/demo/learn`, `/demo/assessment`, and `/demo/trust`.
- Confirm student navigation never shows lecturer items and role redirects remain correct.
- Search Courses; open the course; change every Unit tab; select available weeks; verify locked module feedback is explicit.
- Select all eight Learning Method Studio tabs and verify each renders different substantive content.
- Video: play, pause, resume, restart, seek, volume, mute, speed, captions, transcript, keyboard interaction, and elapsed time.
- Podcast: play, pause, resume, restart, seek, volume, mute, speed, transcript, keyboard interaction, and elapsed time.
- Ask a tutor question; trigger a support path; prepare a lecturer contact request; confirm the acknowledgement is accurate.
- Select a local draft file; test invalid type/size; wait through mock review; remove/reselect; submit final; verify final state and return path.
- Test every Resource action and Trust link for meaningful destination/feedback.

### Lecturer

- Sign in as lecturer; direct-load `/lecturer`, `/lecturer/assignments`, `/lecturer/review`, `/lecturer/knowledge`, and `/lecturer/trust`.
- Confirm student pages redirect and lecturer navigation highlights the correct route.
- Select each submission; edit and save feedback; accept/edit/override/reject recommendation; confirm state is reflected in the relevant mock view.
- Open Review Queue directly and verify it selects the queue view, not the dashboard default.
- Exercise Knowledge Base approval/edit/reject and verify the final state is plainly labelled as local preview or visibly updated.
- Verify cohort analytics labels identify static mock data and provide no misleading live-data claim.

### Quality, Accessibility, And Regression

- Run keyboard-only navigation through side navigation, tabs, inputs, upload, contact panel, media controls, and lecturer decisions.
- Confirm focus is visible, live feedback is announced, icon buttons have labels, contrast is acceptable, and `prefers-reduced-motion` removes nonessential motion.
- Check 320, 375, 768, 1024, and 1440 px widths for horizontal overflow, fixed-nav overlap, tab wrapping, content clipping, and media-control wrapping.
- Confirm browser console is free of errors and all routes return expected content.

## Validation Snapshot

- TypeScript: passed with zero errors using `tsc --noEmit`.
- Production build: passed using `npm.cmd run build` outside the restricted sandbox because the installed Tailwind native dependency cannot load within the sandbox. Vite 8.1.3 built 1,793 modules in 6.92 seconds.
- Development server: already running and responded with HTTP 200 at `http://localhost:5177/`.
- Browser inspection: Learning Workspace loads; all eight method tabs are exposed as tabs; native video/audio/source element count is zero; simulated Video Play changes UI state to Pause.

## Remaining Risks

- The existing worktree has uncommitted Phase 7.5 changes. Antigravity must preserve them and avoid broad rewrites.
- Real local media assets increase bundle weight; use short, compressed, captioned assets and lazy-load method previews.
- Introducing a session mock store can accidentally alter current deterministic demo behaviour if it replaces, rather than wraps, the existing mock data.
- A contact workflow must not suggest delivery to an actual lecturer without a backend or explicitly local-demo confirmation.
- Production build validation currently needs an environment with access to the installed native dependency; this is an environment constraint, not a TypeScript or Vite application failure.
