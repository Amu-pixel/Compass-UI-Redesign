# Phase 9B.5 UI/UX Presentation Plan

## 1. Executive Summary

Phase 9B.5 is a presentation-first polish phase for Compass AI. The goal is not to add features. The goal is to make the existing student and lecturer journeys feel coherent, premium, university-grade, and investor-demo ready once final manual media playback verification is available.

Current implementation has strong functional depth in the Learning Workspace, assessment portal, lecturer workbench, contact dialogs, and role-based shell. The main presentation risk is inconsistency: several high-value screens are built from locally styled cards, buttons, forms, tables, and dialogs rather than a fully enforced design system. This creates a credible product, but not yet a uniformly 9.5/10 commercial presentation.

Phase 9B is not marked complete in this document. Podcast and video require real user-activated desktop playback verification. This plan does not modify media logic and does not begin Phase 9C.

## 2. Current Project Constraints

- Active branch requirement: `shardul-ui-redesign`.
- Production code must remain untouched during this preparation task.
- Existing validated work must be preserved: Learning Workspace, native podcast path, video architecture, AI Tutor, assessment portal, contact lecturer dialog, lecturer dashboard, lecturer assignment queue, review workbench, Knowledge Base, shell improvements, motion, accessibility, and responsive work.
- No main branch work, push, merge, rebase, reset, clean, commit, or pull request.
- No broad redesign until visual inspection is available.
- No Contact Lecturer Phase 9C work in this task.
- `DESIGN_SYSTEM.md` is not present in the current working tree. Current design-system evidence is in `src/index.css`, `src/components/ui.tsx`, `PRODUCT_EXPERIENCE_BLUEPRINT.md`, and `PROJECT_IMPLEMENTATION_TRACKER.md`.
- The unresolved Phase 9B verification item is genuine user-activated video and podcast playback. Existing implementation should not be changed until manual verification is possible.

## 3. Design-System Audit

### Technology And Styling Sources

| Area | Current source | Status | Notes |
|---|---|---:|---|
| Framework | `src/main.tsx`, `package.json` | Reusable | React, TypeScript, Vite, Tailwind CSS v4, React Router. |
| Global theme | `src/index.css` | Partially consistent | Defines color tokens, font families, shadows, motion utilities, focus styles, reduced-motion handling, and media range styling. |
| Shared primitives | `src/components/ui.tsx` | Partially consistent | Includes `Button`, `Card`, `Badge`, `Tabs`, `Toast`, `PageHeader`, empty/loading/placeholder states. |
| Shell | `src/components/AppLayout.tsx` | Partially consistent | Strong role-aware navigation, but student and lecturer visual systems are not differentiated enough. |
| Product blueprint | `PRODUCT_EXPERIENCE_BLUEPRINT.md` | Reusable | Contains strategic requirements, but it reads like an execution prompt rather than a compact design-system reference. |
| Design system doc | `DESIGN_SYSTEM.md` | Missing | The named design-system file does not exist in the working tree. |

### Tokens And Utilities

| Category | Current state | File references | Presentation implication |
|---|---|---|---|
| Typography | Uses Inter, Sora, IBM Plex Mono via `src/index.css`; official content uses local `font-serif` in `src/pages/AssessmentPage.tsx`. | `src/index.css`, `src/pages/AssessmentPage.tsx` | Strong basis, but heading scale and body rhythm are applied per page rather than enforced by primitives. |
| Color | Premium dark-first tokens exist: `night`, `mist`, `ai-cyan`, `ai-violet`, `companion`, status tints. | `src/index.css` | Good palette, but many student/lecturer content surfaces use white cards, reducing dark-first consistency. |
| Spacing | Uses Tailwind spacing directly across pages. | `src/pages/LearningPage.tsx`, `src/pages/AssessmentPage.tsx`, `src/pages/DashboardPage.tsx` | Many values are coherent, but page rhythm depends on individual component choices. |
| Radius | Mixed `rounded-xl`, `rounded-2xl`, `rounded-[28px]`, `rounded-full`. | `src/components/ui.tsx`, `src/pages/LoginPage.tsx`, `src/components/AppLayout.tsx` | Needs a tighter radius policy for premium consistency. |
| Elevation | `shadow-premium`, `shadow-soft`, `surface-premium`, `elite-surface`, `status-lift`. | `src/index.css`, `src/components/ui.tsx` | Effective but overused: static content can look interactive because `Card` defaults to `status-lift`. |
| Motion | Page, panel, modal, method, queue, skeleton, and diagram utilities exist. | `src/index.css` | Strong foundation; visual QA should tune motion timing and prevent ornamental motion. |
| Focus | Global focus and `.premium-focus` exist. | `src/index.css`, `src/components/ui.tsx` | Good accessibility basis; page-specific raw buttons need audit consistency. |
| Reduced motion | Global reduced-motion media query exists. | `src/index.css` | Good foundation; implementation should ensure new motion uses these utilities. |

### Component Primitives

| Primitive | Current source | Status | Gap |
|---|---|---:|---|
| Buttons | `src/components/ui.tsx` | Partially consistent | Variants exist, but `primary`, `ai`, and `secondary` hierarchy varies by screen. |
| Cards | `src/components/ui.tsx` | Partially consistent | One universal card style; no dense/official/AI/human/table-panel variants. |
| Badges | `src/components/ui.tsx` | Partially consistent | Tones exist; source labels and AI/human distinction need stronger rules. |
| Tabs | `src/components/ui.tsx`, custom tabs in `LearningExperienceStudio.tsx` and `DashboardPage.tsx` | Partially consistent | Accessibility is present, but visual and density treatment differs per route. |
| Forms | Raw classes in pages and dialogs | Inconsistent | No shared `Field`, `Input`, `Textarea`, `Select`, validation text, or help text primitive. |
| Tables | Raw table in `src/pages/LecturerAssignmentsPage.tsx` | Missing | No table density, row selection, status, or responsive table primitive. |
| Dialogs | `ContactLecturerDialog.tsx`, `PrepareMessageDialog.tsx`, final submission modal in `AssessmentPage.tsx` | Partially consistent | Dialog behavior is strong, but layout/radius/footer patterns differ. |
| Toasts | `src/components/ui.tsx` | Consistent | Good lightweight feedback pattern. |
| Empty states | `src/components/ui.tsx`, page-specific states | Partially consistent | Empty-state voice and density need standardization. |
| Loading states | `LoadingPill`, `SkeletonBlock`, page-specific states | Partially consistent | Needs route-level skeleton and form-action loading rules. |

## 4. Screen Inventory

### Student Screens

| Screen | Route | Main file/component | Important child components | Purpose | Current strengths | Current weaknesses and risks | Recommended direction |
|---|---|---|---|---|---|---|---|
| Login | `/` | `src/pages/LoginPage.tsx` | `Button`, `ConfidenceBadge`, `Toast` | Product entry and credential flow. | Dark premium first impression, role-aware demo credentials, trust signals. | Role selection and marketing narrative coexist in one surface; custom input styling is not shared; nav links need presentation QA. | Make entry feel like a university product access portal first, product marketing second. Consolidate field styling into shared form primitives. |
| Role selection | `/` section `#access` | `src/pages/LoginPage.tsx` | Role buttons with `aria-pressed` | Select student or lecturer. | Accessible pressed state, direct relationship to credentials. | Can feel like a demo switcher rather than institutional identity selection. | Elevate role cards with clearer institutional copy and reduce decorative competition. |
| Student dashboard | `/courses` | `src/pages/CoursesPage.tsx` | Course search, sidebar nav, course cards, `EmptyState` | Student landing dashboard and course entry. | Strong direct CTA to unit and Learning Workspace; local search works. | Separate dashboard shell from `AppLayout`; duplicate navigation pattern; sidebar differs from global shell. | Align with shared product shell or deliberately define as pre-course dashboard. Reduce duplicated navigation. |
| Unit/course page | `/demo` | `src/pages/UnitPage.tsx` | `Tabs`, `ContactLecturerDialog`, `UnitMaterialsTab`, `OverviewTab`, `AssessmentsTab`, `AnnouncementsTab`, `ResourcesTab` | Unit overview, materials, resources, assessment access. | Rich course structure, working tabs, contact entry, AI support. | Many cards with similar weight; page can feel dense without a clear primary learning action. | Establish one primary next action, group official content and AI support visually, reduce equal-weight card stacks. |
| Learning Workspace | `/demo/learn` | `src/pages/LearningPage.tsx` | `LearningExperienceStudio`, AI Tutor, `ContactLecturerDialog`, `AcademicLessonCanvas` | Core student learning environment. | Strongest product differentiator; method deep links, AI Tutor, Explain This Slide, Learning Commands. | Complex layout risks visual overload; media remains manual-verification pending; AI Tutor and method studio compete for attention. | Presentation polish should clarify the current lesson, current method, next action, and AI mentor role in the first viewport. |
| Learning Method Studio | `/demo/learn?method=...` | `src/components/LearningExperienceStudio.tsx` | `SimpleExperience`, `AnimatedStepsExperience`, `InteractiveDiagramExperience`, `VideoExperience`, `PodcastExperience`, `ComicExperience`, `AnalogyExperience`, `PracticeExperience`, `FlashcardExperience`, `RevisionExperience` | Multiple learning modes for one concept. | Methods are educationally distinct and mostly interactive. | Studio is large and has mixed light/dark surfaces; method tabs use custom dense card tabs. | Keep functionality intact; visually standardize method selector, media panel hierarchy, and mobile order. |
| AI Tutor | `/demo/learn` | `src/pages/LearningPage.tsx`, `src/data/learningTutor.ts` | `AiTutorMessage`, `ThinkingIndicator`, prompt actions | Deterministic contextual tutor. | Honest deterministic behavior, intent-specific actions, status announcements. | Chat surface can still resemble a generic assistant if not visually tied to university source context. | Make the tutor feel like an academic mentor: source basis, current lesson, next learning action, and human escalation should be visually persistent. |
| Explain This Slide | `/demo/learn` | `src/pages/LearningPage.tsx` | `slidePromptActions`, slide explanation state | Contextual explanation prompts. | Many deterministic prompts and source-aware language. | Prompt grid can become visually crowded; selected response needs presentation QA. | Reduce to high-value prompt families, show response as a scholarly explanation panel, keep all supported prompts functional. |
| Assignment portal | `/demo/assessment` | `src/pages/AssessmentPage.tsx` | `AssessmentCommandPanel`, `SampleDraftDemonstration`, `ContactLecturerDialog`, final confirmation dialog | Draft upload, AI feedback, final submission, rubric, feedback. | Very complete workflow, strong academic integrity boundaries. | Long page, many cards, mixed official serif content and operational controls. | Improve page scanning with stronger section anchors, tighter card hierarchy, and consistent form/dialog primitives. |
| Revision/progress | `/courses`, `/demo/learn?method=revision` | `CoursesPage`, `LearningExperienceStudio` | Revision plan, dashboard progress cards | Progress and review. | Revision method and dashboard progress exist. | No dedicated progress route; progress is distributed across screens. | For demo, present progress through existing dashboard and revision method; later create a focused progress route if required. |
| Student navigation | `/courses`, `/demo/*` | `CoursesPage`, `AppLayout` | Sidebar and mobile bottom nav | Move through student journey. | Role-aware global nav exists in `AppLayout`. | `/courses` uses a separate sidebar, causing shell inconsistency. | Decide whether `/courses` should use `AppLayout` or become a dedicated portal landing with matching shell treatment. |

### Lecturer Screens

| Screen | Route | Main file/component | Important child components | Purpose | Current strengths | Current weaknesses and risks | Recommended direction |
|---|---|---|---|---|---|---|---|
| Lecturer dashboard | `/lecturer` | `src/pages/DashboardPage.tsx` | `OverviewSection`, `WorkloadSection`, `GapsSection`, `QuestionsSection`, `RecommendationsSection`, `ReportSection`, `PrepareMessageDialog` | Teaching operations overview. | Clear priority, workload, cohort signals, and action controls. | Several sections use similar card weight; tab strip is local, not shared with `Tabs`. | Make it denser and more operational than student screens, with one dominant "what needs attention" hierarchy. |
| Review Queue | `/lecturer/review` | `src/pages/DashboardPage.tsx` with `initialTab="queue"` | `QueueSection` | Triage review items. | Route opens queue, row status updates work. | Queue is embedded in dashboard tab system; may not look like a high-volume review surface. | Retain behavior; improve queue density, row affordance, and caught-up/empty states in presentation phase. |
| Assignments / marking | `/lecturer/assignments` | `src/pages/LecturerAssignmentsPage.tsx` | `ReviewWorkbench`, `PrepareMessageDialog`, queue table | High-volume assignment review and feedback. | Strong search/filter/sort, selected state, decision controls, AI advisory boundary. | Raw table/form styling; many equally weighted workbench cards; no shared table primitive. | Create table and review-panel primitives before deeper visual polish. |
| Analytics / student progress | `/lecturer` dashboard sections | `src/pages/DashboardPage.tsx` | `GapsSection`, `WorkloadSection`, `ReportSection` | Cohort learning signals. | Signals are decision-oriented rather than decorative. | No dedicated analytics route; presentation may overpromise if labelled as analytics. | Present as "cohort signals" unless a full analytics route is implemented. |
| Course management | `/lecturer/knowledge`, `/lecturer` setup section | `KnowledgeBasePage`, `DashboardPage` | Source list and actions | AI source governance and content validation. | "What AI can know" framing, honest local persistence messages. | Source governance is visually similar to other card pages; action grouping could be clearer. | Differentiate official sources, pending governance, and local demonstration state visually. |
| Announcements / communication | `/lecturer`, `/lecturer/assignments` | `DashboardPage`, `PrepareMessageDialog` | `PrepareMessageDialog` | Prepare student/cohort messages. | Honest copy/open email behavior; no false send claim. | Dialog pattern duplicates student contact logic rather than shared communication primitive. | Create shared dialog/form primitives later, but preserve existing honest behavior. |
| Lecturer navigation | `/lecturer/*` | `src/components/AppLayout.tsx` | Desktop sidebar, mobile nav | Role-specific navigation. | Good role separation and active state. | Same shell tone as student; no lecturer-specific density/context beyond labels. | Keep routes; refine visual differentiation and context label hierarchy. |

## 5. Visual Consistency Matrix

| Category | Status | File references | Required Phase 9B.5 action |
|---|---:|---|---|
| Application shell | Partially consistent | `src/components/AppLayout.tsx`, `src/pages/CoursesPage.tsx` | Reconcile `/courses` dashboard shell with global shell language. |
| Page header | Partially consistent | `AppLayout.tsx`, `CoursesPage.tsx`, `UnitPage.tsx`, `AssessmentPage.tsx`, `DashboardPage.tsx` | Standardize title, subtitle, meta, CTA placement, and page gutters. |
| Section header | Inconsistent | `LearningPage.tsx`, `AssessmentPage.tsx`, `DashboardPage.tsx` | Create section header rules for eyebrow, title, description, action. |
| Cards | Partially consistent | `src/components/ui.tsx`, all page files | Add variants for operational, official, AI, media, queue, and dense cards. |
| Tables | Missing | `src/pages/LecturerAssignmentsPage.tsx` | Create table density and selected-row pattern. |
| Tabs | Partially consistent | `ui.tsx`, `LearningExperienceStudio.tsx`, `DashboardPage.tsx`, `UnitPage.tsx` | Standardize tab sizing, active states, and overflow behavior. |
| Buttons | Partially consistent | `ui.tsx`, all pages | Clarify one-primary-action rule and icon/text alignment. |
| Inputs | Inconsistent | `LoginPage.tsx`, `CoursesPage.tsx`, `LearningPage.tsx`, `AssessmentPage.tsx`, dialogs | Create shared field primitives. |
| Filters | Inconsistent | `CoursesPage.tsx`, `LecturerAssignmentsPage.tsx` | Create filter-chip pattern with accessible pressed state. |
| Badges | Partially consistent | `ui.tsx`, `AssessmentPage.tsx`, `DashboardPage.tsx`, `KnowledgeBasePage.tsx` | Add source, AI, official, local-demo, and human-decision badge rules. |
| Modals/dialogs | Partially consistent | `ContactLecturerDialog.tsx`, `PrepareMessageDialog.tsx`, `AssessmentPage.tsx` | Unify dialog surface, header, footer, focus and validation layout. |
| Drawers | Missing | No drawer primitive found | Only add if visual QA confirms drawer is needed. |
| Empty states | Partially consistent | `ui.tsx`, `CoursesPage.tsx`, `AssessmentPage.tsx` | Use one empty-state voice and action hierarchy. |
| Loading states | Partially consistent | `ui.tsx`, `LearningPage.tsx`, `AssessmentPage.tsx` | Standardize skeleton and action-loading states. |
| Success states | Partially consistent | `Toast`, `AssessmentPage.tsx`, dialogs | Separate genuine local state, handoff, and persistent success language. |
| Error states | Partially consistent | `AssessmentPage.tsx`, dialogs, media controller | Standardize error tone and next action. |
| Navigation | Partially consistent | `AppLayout.tsx`, `CoursesPage.tsx` | Avoid duplicate navigation systems unless deliberately scoped. |
| Typography | Partially consistent | `index.css`, page classes | Apply a documented scale and official content treatment. |
| Icon sizing | Partially consistent | All pages use `lucide-react` mostly at 14-20px | Define icon sizes by control density. |
| Spacing | Partially consistent | Page-specific Tailwind classes | Move common page gutters and section gaps into conventions. |
| Borders | Partially consistent | `border-line`, `border-white/10`, status borders | Define dark/light surface border rules. |
| Radius | Inconsistent | `rounded-xl`, `rounded-2xl`, `rounded-[28px]`, `rounded-full` | Define radius scale by component type. |
| Shadows | Partially consistent | `shadow-premium`, `shadow-soft`, `shadow-sm`, custom glow | Reduce decorative glow and reserve elevation for hierarchy. |
| Motion | Partially consistent | `index.css`, component transitions | Keep motion restrained; verify visually before tuning. |

## 6. Top 10 Presentation Weaknesses

| Rank | Location | Files/components | Why it matters | User and presentation impact | Recommended improvement | Complexity | Dependencies | Regression risk | Recommended tool |
|---:|---|---|---|---|---|---:|---|---|---|
| 1 | Video and podcast demo moment | `src/components/LearningExperienceStudio.tsx` | Media is a high-confidence demo proof point, but user-activated playback remains manually unverified. | Audience may doubt media quality if playback is not proven live. | Complete manual desktop media verification before visual implementation. | Low | Desktop browser access | Medium | Manual visual QA |
| 2 | Design-system documentation gap | Missing `DESIGN_SYSTEM.md`; actual tokens in `src/index.css`, primitives in `src/components/ui.tsx` | Team lacks one concise implementation reference. | Future polish can drift across screens. | Create a compact living design-system reference after Phase 9B is complete. | Low | None | Low | Codex |
| 3 | Shell inconsistency between `/courses` and `/demo/*` | `src/pages/CoursesPage.tsx`, `src/components/AppLayout.tsx` | Student dashboard uses a custom sidebar while the rest uses `AppLayout`. | Journey can feel like two products. | Align dashboard shell with global product shell or explicitly style it as a portal entry. | Medium | Visual inspection | Medium | Antigravity + Codex |
| 4 | Overuse of same card weight | `UnitPage.tsx`, `LearningPage.tsx`, `AssessmentPage.tsx`, `DashboardPage.tsx` | Many sections compete equally. | Presenter has to explain hierarchy instead of the UI making it obvious. | Introduce card hierarchy: primary workspace, supporting panel, official document, AI insight, operational table. | Medium | Shared card variants | Medium | Antigravity |
| 5 | Forms are not systemized | `LoginPage.tsx`, `AssessmentPage.tsx`, `ContactLecturerDialog.tsx`, `PrepareMessageDialog.tsx`, `LecturerAssignmentsPage.tsx` | Field, validation, and helper text treatment varies. | Commercial polish drops in high-trust workflows. | Create shared field/input/select/textarea/help/error primitives. | Medium | Component audit | Medium | Codex + visual QA |
| 6 | Lecturer operational density needs refinement | `DashboardPage.tsx`, `LecturerAssignmentsPage.tsx` | Lecturer screens should feel like professional teaching workbenches, not student-style card dashboards. | University staff may perceive it as less enterprise-ready. | Add table/list density, reduce decorative cards, strengthen decision-first hierarchy. | Medium | Visual inspection | Medium | Antigravity |
| 7 | AI and official content distinction is not universal | `LearningPage.tsx`, `AssessmentPage.tsx`, `KnowledgeBasePage.tsx` | Product credibility depends on clear boundaries between official material and AI guidance. | Risk of perceived academic integrity ambiguity. | Standardize source labels, official content surfaces, AI advisory panels, and human decision badges. | Medium | Design-system update | Low | Codex + Antigravity |
| 8 | Method Studio can visually overload first viewport | `LearningExperienceStudio.tsx`, `LearningPage.tsx` | The strongest product feature is also complex. | Demo audience may miss the intended next action. | Tune first viewport: current lesson, selected method, AI mentor, and next action should be obvious. | High | Browser visual QA | Medium | Antigravity |
| 9 | Responsive proof gaps for dense surfaces | `LearningExperienceStudio.tsx`, `AssessmentPage.tsx`, `LecturerAssignmentsPage.tsx` | Dense tables, media, and dialogs need exact breakpoint QA. | Mobile/tablet demo risk: clipped controls or cramped hierarchy. | Perform screenshot-based pass at 1440, 1280, 1024, 768, 390. | Medium | Browser access | Medium | Manual QA + Antigravity |
| 10 | Analytics/progress language can overstate scope | `DashboardPage.tsx`, `CoursesPage.tsx` | Cohort signals exist, but no full dedicated analytics route is evident. | Investor demo may infer backend analytics that do not exist. | Present as deterministic "signals" and "progress" unless a full route is built. | Low | Content review | Low | Codex |

## 7. Presentation Demo Journey

| Step | Route | Presenter shows | Audience should understand | Visual impression required | Must work | Hide or avoid if incomplete | Time | Transition |
|---:|---|---|---|---|---|---|---:|---|
| 1 | `/` | Compass AI entry, role selection, demo credentials. | This is a role-aware university platform. | Calm, premium, institutional. | Role toggle, login. | Any nonessential pilot/marketing action if not visually verified. | 45 sec | Student login to `/courses`. |
| 2 | `/courses` | Student dashboard, current course, search, continue action. | Student knows what to do next. | Focused dashboard, not generic cards. | Search, continue unit, open AI tutor. | Avoid unverified catalogue placeholders. | 60 sec | Continue to `/demo`. |
| 3 | `/demo` | Unit overview, module flow, materials, assessment link. | LMS supports real unit structure. | Academic, official, structured. | Tabs, week selector, Contact Lecturer. | Avoid quiz placeholder detail unless needed. | 90 sec | Open Learning Workspace. |
| 4 | `/demo/learn` | Learning Workspace first viewport. | AI supports official learning material. | Premium academic workspace. | Method selection, AI Tutor, Learning Commands. | Do not claim live backend AI. | 90 sec | Trigger Explain This Slide. |
| 5 | `/demo/learn` | Explain This Slide prompts and deterministic response. | Students can ask targeted contextual questions. | Intelligent mentor, not chatbot. | Prompt selection, selected response, keyboard. | Remove any unsupported prompts before demo. | 60 sec | Switch to media method. |
| 6 | `/demo/learn?method=podcast` or `?method=video` | Real media player if manually verified. | Learning adapts to media preferences. | Professional player, honest source. | Play, pause, seek, progress. | If manual playback not verified, use diagram or steps instead. | 60 sec | Go to assessment. |
| 7 | `/demo/assessment` | Brief, rubric, upload, feedback, final submission. | AI helps formative feedback without doing the assignment. | Trustworthy academic workflow. | Upload simulation, rubric, final confirmation, receipt. | Avoid claiming server submission. | 120 sec | Open Contact Lecturer. |
| 8 | `/demo/assessment` or `/demo` | Contact Lecturer dialog. | Human support is integrated. | Accessible, honest email handoff. | Validation, copy, open email. | Do not say message sent. | 45 sec | Switch to lecturer role. |
| 9 | `/lecturer` | Teaching priorities and review queue. | Lecturer has an operational workbench. | Dense, professional, decision-led. | Tabs, prepare message, queue route. | Avoid calling signals "real analytics" without backend. | 90 sec | Open assignments. |
| 10 | `/lecturer/assignments` | Queue, selected submission, AI recommendation, human decision. | AI assists; lecturer decides. | Enterprise marking surface. | Search, filters, decision controls, feedback editor. | Avoid unsupported persistence claims. | 120 sec | Knowledge/progress signal. |
| 11 | `/lecturer/knowledge` or `/lecturer` | AI source governance or cohort signals. | Institution controls what AI can use. | Trust and governance. | Approve/reject local state, affected experiences. | Avoid permanent governance claims. | 60 sec | Close with product architecture summary. |

## 8. Presentation-Readiness Scorecard

Scores are current planning estimates from source inspection and previous tracker state. They are not substitutes for screenshot QA.

| Screen | Visual hierarchy | Professionalism | Clarity | Interaction quality | Consistency | Responsiveness | Accessibility | Demo readiness | Gap to 9+ |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| Login | 8.0 | 8.2 | 8.0 | 8.0 | 7.6 | 7.8 | 8.0 | 8.0 | `LoginPage.tsx` needs shared field primitives and stronger university portal framing. |
| Role selection | 7.8 | 8.0 | 8.0 | 8.2 | 7.4 | 7.8 | 8.2 | 7.8 | `LoginPage.tsx` role cards should feel institutional rather than demo toggles. |
| Student dashboard | 7.8 | 8.0 | 8.0 | 8.2 | 7.0 | 7.6 | 8.0 | 8.0 | `CoursesPage.tsx` duplicates shell navigation and needs stronger first action hierarchy. |
| Learning Workspace | 8.4 | 8.5 | 8.1 | 8.4 | 7.8 | 7.5 | 8.3 | 8.0 | `LearningPage.tsx` and `LearningExperienceStudio.tsx` need viewport hierarchy and manual media verification. |
| AI Tutor | 8.3 | 8.4 | 8.2 | 8.4 | 7.9 | 7.8 | 8.4 | 8.2 | `LearningPage.tsx` should visually tie tutor output more tightly to source context and next learning action. |
| Explain This Slide | 8.0 | 8.1 | 8.0 | 8.1 | 7.7 | 7.5 | 8.0 | 8.0 | Prompt density and response panel styling need visual QA in `LearningPage.tsx`. |
| Assignment page | 8.5 | 8.6 | 8.4 | 8.7 | 8.0 | 7.8 | 8.4 | 8.5 | `AssessmentPage.tsx` is functionally rich but long; section rhythm and dialog consistency need polish. |
| Lecturer dashboard | 8.2 | 8.4 | 8.2 | 8.4 | 7.8 | 7.8 | 8.2 | 8.2 | `DashboardPage.tsx` needs denser operational hierarchy and shared tab/table rules. |
| Marking page | 8.2 | 8.5 | 8.2 | 8.6 | 7.8 | 7.6 | 8.0 | 8.3 | `LecturerAssignmentsPage.tsx` needs shared table/form/workbench composition. |
| Analytics page | 7.0 | 7.4 | 7.3 | 7.5 | 7.0 | 7.2 | 7.8 | 7.0 | No dedicated analytics page found; current analytics are cohort-signal sections in `DashboardPage.tsx`. Avoid overpositioning until implemented. |

## 9. Phased Implementation Sequence

### Phase A: Design-System Foundation

- Objective: Convert existing tokens and primitives into a stricter UI system without changing business logic.
- Exact routes: All routes indirectly.
- Exact components: `src/index.css`, `src/components/ui.tsx`, possible new non-route UI primitives.
- Expected output: Documented typography scale, spacing rules, radius/elevation rules, form fields, table primitives, dialog shell, section header, official/AI/source badge rules.
- Dependencies: Phase 9B manual media verification should be complete before visible polish begins.
- Estimated effort: Medium.
- Verification: TypeScript, build, visual snapshots of all critical screens.
- Regression risk: Medium, because shared primitives affect many screens.
- Recommended tool: Codex for primitives, Antigravity/manual QA for visual tuning.

### Phase B: Student Presentation Journey

- Objective: Make the student journey feel like one premium LMS path from dashboard to learning to assessment.
- Exact routes: `/`, `/courses`, `/demo`, `/demo/learn`, `/demo/assessment`.
- Exact components: `LoginPage.tsx`, `CoursesPage.tsx`, `UnitPage.tsx`, `LearningPage.tsx`, `LearningExperienceStudio.tsx`, `AssessmentPage.tsx`, `ContactLecturerDialog.tsx`.
- Expected output: Strong first viewport, consistent page hierarchy, polished Learning Workspace, visually controlled assessment portal, verified contact workflow.
- Dependencies: Phase A primitives and manual media verification.
- Estimated effort: High.
- Verification: Full presentation journey, keyboard, mobile, console, route checks, screenshots at 1440/1280/1024/768/390.
- Regression risk: Medium-high due to dense interactions in Learning Workspace and assessment.
- Recommended tool: Antigravity for layout/presentation, Codex for targeted accessibility and type-safe refactors.

### Phase C: Lecturer Presentation Journey

- Objective: Make lecturer workflows feel enterprise-operational and distinct from student learning.
- Exact routes: `/lecturer`, `/lecturer/review`, `/lecturer/assignments`, `/lecturer/knowledge`, `/lecturer/trust`.
- Exact components: `DashboardPage.tsx`, `LecturerAssignmentsPage.tsx`, `KnowledgeBasePage.tsx`, `PrepareMessageDialog.tsx`, `AppLayout.tsx`.
- Expected output: Denser teaching dashboard, refined assignment queue, professional marking workbench, clear source governance, honest communication handoff.
- Dependencies: Phase A table/form/dialog primitives.
- Estimated effort: Medium-high.
- Verification: Lecturer queue/filter/decision flow, Knowledge Base actions, communication dialog, role guard regression.
- Regression risk: Medium.
- Recommended tool: Antigravity + Codex.

### Phase D: Responsive And Accessibility Polish

- Objective: Validate every presentation-critical workflow across desktop, laptop, tablet, and mobile.
- Exact routes: `/`, `/courses`, `/demo`, `/demo/learn`, `/demo/assessment`, `/lecturer`, `/lecturer/assignments`, `/lecturer/knowledge`.
- Exact components: All page components plus `AppLayout.tsx`, dialogs, method studio, tables.
- Expected output: No clipped controls, no hidden actions, logical tab order, visible focus, reduced-motion compliance.
- Dependencies: Phases A-C complete.
- Estimated effort: Medium.
- Verification: Browser interaction at 1440, 1280, 1024, 768, 390; keyboard-only testing; console inspection.
- Regression risk: Low-medium.
- Recommended tool: Manual visual QA + Antigravity.

### Phase E: Final Demo Consistency Audit

- Objective: Lock the product into a concise credible presentation path.
- Exact routes: Full demo journey listed in Section 7.
- Exact components: All presentation-critical components.
- Expected output: Coherent demo data, no dead controls, no false claims, smooth transitions, final screen list and presenter script.
- Dependencies: Phases A-D complete.
- Estimated effort: Low-medium.
- Verification: End-to-end presenter rehearsal, production build, console check, route reloads.
- Regression risk: Low.
- Recommended tool: Manual QA + Codex for final fixes.

## 10. Codex-Safe Work

These tasks can be prepared without visual access if performed after the current planning-only task. No visual implementation is included here.

| Task | File/component | Risk | Can implement now? | Required verification |
|---|---|---:|---:|---|
| Create route-to-component map in documentation | `src/main.tsx`, all route pages | Low | Yes, documentation only | Review route table against source. |
| Document actual design tokens | `src/index.css` | Low | Yes, documentation only | Confirm no code changes. |
| Inventory hardcoded form styles | `LoginPage.tsx`, `AssessmentPage.tsx`, dialogs, `LecturerAssignmentsPage.tsx` | Low | Yes, audit only | File-level references. |
| Specify shared `Field` and validation interface | Future UI primitive | Medium | Design only | Type review before implementation. |
| Specify table primitive requirements | `LecturerAssignmentsPage.tsx` | Medium | Design only | Compare against current queue table. |
| Add accessibility checklist for method tabs and dialogs | `LearningExperienceStudio.tsx`, dialogs | Low | Yes, documentation only | Keyboard checklist. |
| Audit responsive class usage | All page files | Low | Yes, audit only | Breakpoint matrix. |
| Identify duplicate modal patterns | `ContactLecturerDialog.tsx`, `PrepareMessageDialog.tsx`, `AssessmentPage.tsx` | Low | Yes, audit only | Dialog behavior comparison. |
| Prepare visual QA checklist | New documentation | Low | Yes | Manual QA can execute later. |
| Review copy for false persistence/AI/media claims | All pages | Low | Yes, audit only | Source grep and browser copy pass. |

## 11. Work That Must Wait

| Task | Why it must wait |
|---|---|
| Color tuning | Requires screenshot comparison for contrast, visual warmth, and dark/light balance. |
| Typography sizing and rhythm | Needs real viewport review; source-only changes can create overflow or weak hierarchy. |
| Learning Workspace layout restructuring | The workspace is interaction-heavy and media-dependent; needs browser inspection. |
| Card density reduction | Requires visual judgment to avoid removing useful academic context. |
| Navigation visual redesign | Must be tested across desktop and mobile to prevent role leakage or hidden actions. |
| Motion timing refinement | Needs observed interaction, reduced-motion verification, and no layout shift checks. |
| Media visual polish | Podcast/video playback remains manually unverified; do not alter presentation until playback is confirmed. |
| Mobile visual QA | Requires 390px interaction and touch target inspection. |
| Cross-device screenshot comparison | Needs browser access or Antigravity. |
| Final presentation rehearsal | Requires complete manual media verification and stable production build/browser session. |

## 12. Prioritised Backlog

| ID | Priority | Task | User type | Route | Component/file | Impact | Complexity | Dependencies | Risk | Verification | Tool | Status |
|---|---|---|---|---|---|---|---:|---|---|---|---|---|
| P0-01 | P0 | Complete manual user-activated podcast and video playback verification. | Student | `/demo/learn?method=video`, `/demo/learn?method=podcast` | `LearningExperienceStudio.tsx` | Protects credibility of media demo. | Low | Desktop browser access | Medium | Current time advances, controls work, console clean. | Manual QA | Pending |
| P0-02 | P0 | Align student dashboard shell with the main product shell strategy. | Student | `/courses` | `CoursesPage.tsx`, `AppLayout.tsx` | Prevents product fragmentation. | Medium | Visual QA | Medium | Screenshot and navigation regression. | Antigravity | Ready |
| P0-03 | P0 | Establish shared form/dialog/table primitives before visual polish. | Both | Multiple | `ui.tsx`, dialogs, `LecturerAssignmentsPage.tsx` | Raises commercial polish in trust workflows. | Medium | Phase A | Medium | TypeScript, build, form/dialog QA. | Codex | Ready |
| P0-04 | P0 | Clarify first viewport of Learning Workspace. | Student | `/demo/learn` | `LearningPage.tsx`, `LearningExperienceStudio.tsx` | Core product differentiation. | High | Media verification, visual QA | Medium | Presentation journey test. | Antigravity | Ready after media QA |
| P0-05 | P0 | Standardize official content vs AI guidance treatment. | Both | `/demo/learn`, `/demo/assessment`, `/lecturer/knowledge` | `LearningPage.tsx`, `AssessmentPage.tsx`, `KnowledgeBasePage.tsx` | Protects academic trust. | Medium | Phase A badge/card rules | Low | Copy audit and visual QA. | Codex + Antigravity | Ready |
| P1-01 | P1 | Reduce equal-weight card stacks on Unit and Assessment pages. | Student | `/demo`, `/demo/assessment` | `UnitPage.tsx`, `AssessmentPage.tsx` | Improves scanning and demo flow. | Medium | Visual QA | Medium | Screenshot QA. | Antigravity | Ready |
| P1-02 | P1 | Make lecturer pages visually denser and operational. | Lecturer | `/lecturer`, `/lecturer/assignments` | `DashboardPage.tsx`, `LecturerAssignmentsPage.tsx` | Improves enterprise credibility. | Medium | Phase A table rules | Medium | Lecturer flow QA. | Antigravity | Ready |
| P1-03 | P1 | Refine Explain This Slide prompt hierarchy. | Student | `/demo/learn` | `LearningPage.tsx` | Reduces cognitive load. | Medium | Visual QA | Low | Prompt interaction matrix. | Codex + QA | Ready |
| P1-04 | P1 | Create route-level loading, empty, success, and error rules. | Both | Multiple | `ui.tsx`, page-specific states | Improves consistency. | Medium | Phase A | Low | State matrix QA. | Codex | Ready |
| P1-05 | P1 | Create presenter-safe language audit for AI, media, analytics, and persistence. | Both | Multiple | All page copy | Prevents false claims. | Low | None | Low | Copy grep and browser review. | Codex | Ready |
| P1-06 | P1 | Build responsive screenshot checklist. | Both | Presentation routes | Documentation | Enables reliable QA. | Low | Browser access | Low | 1440/1280/1024/768/390 checklist. | Manual QA | Ready |
| P2-01 | P2 | Tune icon sizing and alignment rules. | Both | Multiple | `ui.tsx`, page controls | Adds polish. | Low | Phase A | Low | Visual QA. | Antigravity | Ready |
| P2-02 | P2 | Refine motion timing and hover lift usage. | Both | Multiple | `index.css`, `ui.tsx` | Adds premium feel. | Medium | Visual QA | Low | Reduced-motion and interaction QA. | Antigravity | Ready |
| P2-03 | P2 | Create compact visual QA screenshots for final demo script. | Both | Demo journey | Documentation/screenshots | Improves presentation readiness. | Low | Browser access | Low | Screenshot set reviewed. | Manual QA | Pending |
| P2-04 | P2 | Add dedicated progress route only if demo requires it. | Student | Future route | New page if approved | Strengthens LMS completeness. | High | Product approval | Medium | Route, navigation, build QA. | Codex + Antigravity | Future |

Backlog summary: 5 P0 items, 6 P1 items, 4 P2 items.

## 13. Design Principles For Implementation

1. Professional university tone: Use academic confidence, not consumer excitement.
2. Minimal but not empty: Reduce clutter without removing educational context.
3. Clear information hierarchy: Every screen needs one obvious current task and one next action.
4. Calm visual design: Use color, glow, and gradient sparingly and purposefully.
5. Fewer but stronger actions: Avoid equal-weight button clusters.
6. No decorative controls: Every visible control must work or be hidden.
7. No repeated card grids without purpose: Cards must group decisions, learning content, or evidence.
8. No fake analytics: Present deterministic demo signals as signals, not backend analytics.
9. No high-school gamification: Progress and achievement should feel university-grade and evidence-based.
10. Clear student/lecturer differentiation: Student screens support learning; lecturer screens support operations and decisions.
11. Honest AI presentation: AI is deterministic, source-aware, and advisory unless a backend exists.
12. Honest media presentation: Media controls must reflect real playback and verified capabilities.
13. Accessible motion: Use opacity and transform; respect reduced motion; avoid continuous decorative animation.
14. Responsive-first implementation: Dense learning and marking surfaces must work at 390px through 1440px.
15. Functional interaction before decoration: Visual polish cannot hide incomplete workflows.
16. Official content has a distinct treatment: Briefs, rubrics, readings, and announcements should not look like AI messages.
17. Human decisions stay visually explicit: Lecturer decisions, student submissions, and contact handoffs must be separated from AI guidance.
18. Local demonstration states must be labelled honestly: No false server persistence, no false sending, no false calendar booking.

## 14. Exact Recommended Next Action

Complete manual podcast and video verification when desktop access is available, then begin Phase 9B.5 UI/UX implementation with Phase A design-system foundation and the presentation-critical student journey.
