You are now the Principal Product Engineer, Principal Product Designer, Design Systems Architect, UX Architect, Motion Designer, Accessibility Lead and QA Lead for the existing Compass AI university learning platform.

This is an implementation task.

A complete product and UX strategy has already been created by a senior design architecture review.

The authoritative design specification is:

PRODUCT_EXPERIENCE_BLUEPRINT.md

You must read that file completely before editing anything.

Do not create a new design direction from memory.
Do not ignore or loosely interpret the blueprint.
Do not perform another superficial “add more cards” polish pass.

Your task is to implement the blueprint inside the existing React + TypeScript + Vite + Tailwind architecture.

==================================================
CURRENT PROJECT CONTEXT
==================================================

Product:
Compass AI

Purpose:
A premium AI-powered university learning platform for students and lecturers.

Current perceived quality:
Approximately 6–7/10.

Required target:
At least 9/10 commercial university-product quality.

The platform must be credible enough to demonstrate to:

- university students
- lecturers
- faculty leaders
- university decision-makers
- institutional buyers
- investors

The platform must not feel like:

- a school website
- a generic dashboard template
- an LMS clone
- a ChatGPT wrapper
- a student assignment
- a collection of unrelated cards
- a decorative prototype

Existing technology and architecture:

- React
- TypeScript
- Vite
- Tailwind
- existing routing
- existing authentication
- existing role guards
- existing student and lecturer flows
- deterministic frontend AI behaviour
- mock data
- localStorage behaviour
- existing upload simulation
- existing assignment review logic

Do not replace the framework.
Do not rebuild the application.
Do not change architecture unnecessarily.

==================================================
MANDATORY REPOSITORY DISCOVERY
==================================================

Before editing:

1. Confirm the current Git branch is exactly:

   shardul-ui-redesign

2. Run:

   git status
   git diff --stat
   git diff

3. Read completely:

   - PRODUCT_EXPERIENCE_BLUEPRINT.md
   - PROJECT_IMPLEMENTATION_TRACKER.md
   - DESIGN_SYSTEM.md
   - PRODUCT_RECOVERY_PLAN.md if present
   - ENTERPRISE_RECOVERY_REPORT.md if present
   - package.json
   - routing files
   - authentication and role guards
   - AppLayout
   - shared UI components
   - current CSS/theme tokens
   - all student pages
   - all lecturer pages
   - LearningExperienceStudio
   - AssessmentPage
   - LearningPage
   - UnitPage
   - CoursesPage
   - DashboardPage
   - LecturerAssignmentsPage
   - Review Queue
   - Knowledge Base
   - mock data
   - localStorage logic
   - existing media components

4. Build a file-by-file implementation map.

5. Identify:

   - existing working functionality
   - duplicated visual patterns
   - decorative cards
   - inconsistent components
   - weak hierarchy
   - broken or dead controls
   - misleading placeholders
   - responsive weaknesses
   - accessibility weaknesses
   - areas where official university content and AI output are visually confused

6. Do not edit until the implementation map is complete.

After completing the map, begin implementation automatically unless a genuine safety blocker exists.

==================================================
ABSOLUTE SAFETY RULES
==================================================

Preserve:

- authentication
- routing
- role guards
- student/lecturer role separation
- mock data
- localStorage
- deterministic AI behaviour
- assignment upload simulation
- lecturer decision logic
- working video/audio behaviour
- verified student workflows
- verified lecturer workflows
- business logic

Never:

- modify main
- push
- merge
- rebase
- reset
- clean
- force-push
- create a pull request
- commit automatically
- delete unrelated files
- install unnecessary libraries
- invent a backend
- claim an email was sent without a backend
- claim media or AI generation is real when it is simulated
- mark a feature complete without validating it

==================================================
EXECUTION METHOD
==================================================

Implement the blueprint through independently validated checkpoints.

After every checkpoint:

1. Run TypeScript validation.
2. Run the production build where the environment permits.
3. Start or verify the development server.
4. Test the affected routes.
5. Check for console/runtime errors where browser access is available.
6. Update PROJECT_IMPLEMENTATION_TRACKER.md.
7. Leave the repository in a stable state.
8. Do not continue if the current checkpoint is broken.

If quota or tool limits are approaching:

- finish the current checkpoint
- validate it
- update the tracker
- stop cleanly
- list exactly what remains

==================================================
CHECKPOINT 1 — DESIGN SYSTEM FOUNDATION
==================================================

Implement the visual foundation from PRODUCT_EXPERIENCE_BLUEPRINT.md.

Create or standardise:

TYPOGRAPHY

- one professional UI sans for navigation, controls and system UI
- a distinct institutional serif treatment for official university content such as:
  - assignment briefs
  - unit readings
  - rubrics
  - official announcements
  - lecturer-authored learning content
- preserve readability and accessibility
- minimum practical body size of 16px
- consistent heading scale
- consistent metadata scale
- consistent line height and reading width

SPACING

Use one coherent scale based on:

4, 8, 12, 16, 24, 32, 48, 64, 96

Remove arbitrary spacing values where practical.

LAYOUT

- coherent max-width rules
- readable text widths
- consistent gutters
- professional 12-column desktop logic where useful
- avoid full-width text on large screens
- create clear page-level composition

RADII

Standardise:

- 4px for small tags/chips
- 8px for controls/cards
- 12px for large panels/dialogs

ELEVATION

Use only:

- flat page layer
- bordered/elevated surface
- modal/overlay surface

Remove decorative shadow inconsistency.

COLOUR

- neutral-driven enterprise palette
- one confident primary interaction colour
- one restrained trust/verified colour
- semantic red/amber/green only for state
- AI accents only on genuine AI-generated or AI-assisted surfaces
- official content must not look AI-generated
- no rainbow dashboards
- no decorative gradients without purpose
- true dark-mode token logic if dark mode exists

ICONS

- one icon family
- one stroke weight
- consistent default sizing
- no mixed icon language

BUTTONS

Only three main tiers:

- primary
- secondary
- tertiary

Plus a distinct destructive treatment.

One primary action per screen.

CARDS

A card may only represent a real, specific object or operational data item.

Do not use cards as decorative wrappers for ordinary static text.

Replace decorative cards with:

- sections
- structured panels
- lists
- tables
- inline content groups
- editorial layouts

Create or refine reusable primitives instead of applying page-specific patches.

Validate Checkpoint 1 before continuing.

==================================================
CHECKPOINT 2 — GLOBAL PRODUCT SHELL AND NAVIGATION
==================================================

Implement a coherent enterprise navigation system.

GLOBAL SHELL

- persistent left navigation
- icon and text label
- collapsible behaviour where appropriate
- no unlabeled mystery icons
- active state that is visually clear but restrained
- consistent student and lecturer branding
- global top bar with:
  - current context
  - search
  - notifications
  - profile

Do not add nonfunctional global search or notifications.

If functionality is unavailable:

- provide honest, polished states
- do not leave dead controls

BREADCRUMBS

Use only when hierarchy exceeds two levels.

CONTEXT

Students should always know:

- current course
- current unit
- current module
- current lesson
- current assignment

Lecturers should always know:

- current unit
- current assignment
- selected cohort
- selected student or submission
- current decision state

NAVIGATION JOURNEYS

Student:

Dashboard
→ Course
→ Unit
→ Learning Workspace
→ AI Tutor
→ Assignment
→ Feedback
→ Progress

Lecturer:

Dashboard
→ Assignment Queue
→ Individual Review
→ Feedback
→ Publish
→ Knowledge Base
→ Analytics

Remove duplicated or competing navigation.

Validate all routes and role separation.

==================================================
CHECKPOINT 3 — STUDENT DASHBOARD AND COURSES
==================================================

Redesign the student dashboard around momentum.

The first viewport must answer:

- What should I do today?
- What is due next?
- What am I currently learning?
- Where am I struggling?
- What should I revisit?
- What is my next action?

Prioritise:

- one dominant next-action area
- current course/module
- upcoming assignment
- recent feedback
- learning-risk or revision signal
- AI Tutor entry
- progress tied to real learning content

Remove generic equal-weight widget grids.

Every dashboard item must be connected to real mock data or an honest state.

COURSES

- current courses prominent
- completed courses compressed
- future/locked courses visually secondary
- progress visible at a glance
- clear lecturer and next-assessment context
- useful search/filter states
- no decorative course cards
- no dead course actions

Validate before continuing.

==================================================
CHECKPOINT 4 — FLAGSHIP LEARNING WORKSPACE
==================================================

Rebuild the Learning Workspace presentation according to the blueprint without changing the existing architecture.

The page must use a clear two-zone hierarchy:

A. OFFICIAL LEARNING CONTENT

This is visually primary.

Include:

- unit code
- unit name
- module
- lesson
- lecturer attribution where relevant
- source provenance
- progress
- current objective
- official content
- diagram or document preview
- previous/next lesson
- relevant module navigation

Official university content should use the institutional content treatment and must be clearly distinct from system/AI UI.

B. CONTEXTUAL AI COMPANION

This is visually secondary and collapsible where practical.

Include:

- actual student message
- intent-sensitive answer
- grounded sources
- confidence or grounding band
- thinking stages
- relevant follow-ups
- next learning action
- save/dismiss/expand behaviour where appropriate
- Contact Lecturer
- prerequisite topic
- assignment connection

The AI must never visually overpower official content.

LEARNING METHODS

Support:

- Explain simply
- Step-by-step
- Visual diagram
- Video
- Podcast
- Comic/storyboard
- Analogy
- Practice questions

Do not render eight equal buttons in one overwhelming toolbar.

Surface methods contextually and progressively.

Every method must:

- have selected state
- render genuinely different content
- preserve lesson context
- preserve source grounding
- provide a next action
- include honest loading/error/fallback states
- work or clearly explain its limitation

VIDEO/PODCAST

Preserve verified real media behaviour if present.

Do not falsely claim dynamic generation.

If media fails:

- show transcript
- show lesson summary
- show chapter/storyboard
- provide recovery action

Validate every visible control.

==================================================
CHECKPOINT 5 — AI TUTOR EXPERIENCE
==================================================

Make the AI Tutor feel as fluid as a modern general-purpose AI assistant while remaining academically trustworthy.

Implement or refine:

- persistent thread per unit
- visible current context
- clear student messages
- grounded AI answers
- citation links or source references
- confidence bands
- distinction between:
  - grounded answer
  - extrapolated answer
  - unsupported request
- 2–3 contextual follow-up suggestions
- staged thinking labels such as:
  - Reading unit content…
  - Checking learning objective…
  - Preparing explanation…
- memory visibility
- memory clearing
- conversation history where current architecture allows
- useful empty state
- useful error state
- no repeated generic responses
- no dead suggestions

Do not create a fake live backend.

Preserve deterministic behaviour while making the experience coherent and credible.

==================================================
CHECKPOINT 6 — COMPLETE ASSIGNMENT PORTAL
==================================================

Transform the assignment page into the most trustworthy student workflow.

Include:

OVERVIEW

- assignment title
- unit
- lecturer
- weighting
- due date
- status
- brief
- learning outcomes
- academic-integrity guidance
- Contact Lecturer
- FAQ/support

TIMELINE

Always visible:

Brief
→ Draft
→ Readiness Check
→ Final Submission
→ Lecturer Feedback
→ Reflection

RUBRIC

- criteria
- weights
- clear expectations
- evidence required
- performance bands
- expandable details
- visually aligned with the official institutional content treatment

DRAFT WORKFLOW

- upload
- replace
- remove
- filename
- size
- version
- timestamp
- progress
- processing
- error
- retry
- history
- clear draft/final distinction

EXAMPLE FEEDBACK

Clearly label:

Example submitted draft and formative AI feedback

Include:

- version metadata
- realistic excerpt
- readiness checklist
- rubric coverage
- strengths
- weaknesses
- missing evidence
- knowledge gaps
- structure issues
- citation issues
- clarity issues
- relevant lessons/resources
- recommended next actions

Do not show a numeric AI grade prediction.

Use a checklist or readiness model instead.

VERSIONS

- lightweight version timeline
- version status
- what changed
- no heavy diff engine required

REFLECTION

- short structured reflection
- linked to learning outcomes
- visible after final submission

COMMUNICATION

- lecturer contact
- comments
- FAQ
- support pathway
- no fake message-send success

FINAL SUBMISSION

- explicit confirmation
- explain what becomes visible to the lecturer
- submission receipt
- preserve student ownership

Every visible control must work or show honest feedback.

==================================================
CHECKPOINT 7 — LECTURER WORKBENCH
==================================================

Transform lecturer pages from generic dashboards into professional teaching workbenches.

LECTURER DASHBOARD

First viewport should show:

- decisions required today
- submissions requiring review
- deadlines approaching
- students needing support
- cohort learning gaps
- knowledge-base issues
- announcements or communication
- next operational actions

Remove vanity metrics and unrelated stat cards.

ASSIGNMENT QUEUE

Use a dense, professional table or queue treatment.

Include:

- student
- status
- draft/final
- risk/evidence signal
- submission time
- review state
- next action
- filters
- saved views where existing architecture allows
- compact density suitable for large cohorts

REVIEW WORKBENCH

Include:

- student/submission context
- assignment brief
- rubric
- evidence
- version/history
- AI recommendation
- plain-language confidence band
- source basis
- editable lecturer feedback
- accept
- edit
- override
- reject
- request revision
- save draft feedback
- finalise
- human-review boundary
- audit/history state

AI must remain visually distinct from lecturer-authored feedback.

Never pre-fill AI decisions into the lecturer’s final grade field.

KNOWLEDGE BASE

Reframe as:

What the AI is allowed to know

Include:

- indexed/pending/excluded state
- source provenance
- version
- validation
- reuse boundary
- teaching impact
- approve/edit/reject
- honest placeholders where backend behaviour is absent

ANALYTICS

Only show metrics that answer teaching questions.

Avoid decorative charts.

==================================================
CHECKPOINT 8 — EMPTY, LOADING, SUCCESS AND ERROR STATES
==================================================

Create a coherent system for:

- no content
- no submissions
- no courses
- no search results
- loading
- AI thinking
- media loading
- media unavailable
- upload processing
- submission success
- assignment error
- offline
- empty queue
- caught-up state
- knowledge-base pending state
- permission/access state

Requirements:

- explain what happened
- explain what remains safe
- provide one clear next action
- no blank panels
- no raw error-only states
- no generic “Something went wrong” when a specific message is possible
- skeletons must reserve layout space
- routine saves should use quiet saved indicators, not disruptive toasts

==================================================
CHECKPOINT 9 — MOTION SYSTEM
==================================================

Implement the motion language from the blueprint.

Use:

Hover/focus:
100–120ms

Press/selection:
120–150ms

Expand/collapse and panels:
200–260ms

Page-level context transitions:
300–350ms maximum

Motion should communicate:

- selection
- hierarchy
- loading
- completion
- expansion
- navigation
- state change

Implement:

- tab transitions
- active navigation movement
- side-panel entrance
- dialog entrance/exit
- accordion
- AI thinking stages
- AI answer reveal
- media ready/error transition
- upload progress
- readiness feedback
- lecturer decision feedback
- quiet success/error messages

Avoid:

- bouncing
- continuous floating
- excessive blur
- excessive glow
- decorative parallax
- slow cinematic transitions
- animation that delays navigation
- layout shift

Respect prefers-reduced-motion throughout.

==================================================
CHECKPOINT 10 — RESPONSIVE AND ACCESSIBILITY
==================================================

Test and refine:

- 1440px desktop
- 1280px laptop
- 1024px laptop/tablet
- 768px tablet
- 390px mobile

Highest priority:
1280–1440px laptop demo quality.

Ensure:

- no horizontal overflow
- readable text width
- collapsible navigation
- functional split-pane behaviour
- accessible tables
- responsive lecturer queue
- responsive assignment portal
- responsive AI rail
- usable dialogs
- no clipped controls
- primary actions remain visible
- no overlapping fixed elements
- touch targets approximately 44px where practical

ACCESSIBILITY

Verify:

- keyboard operability
- semantic controls
- visible focus
- screen-reader names
- live regions for AI responses
- aria-selected
- dialog roles
- focus trap
- focus restoration
- Escape close
- contrast
- form labels
- programmatic errors
- no colour-only meaning
- reduced motion
- accessible media controls

Target WCAG AA or better.

==================================================
CHECKPOINT 11 — PRODUCT-WIDE FUNCTIONAL QA
==================================================

Test all visible student and lecturer controls.

STUDENT JOURNEY

Login
→ Dashboard
→ Course
→ Unit
→ Learning Workspace
→ AI Tutor
→ Learning Method
→ Assignment
→ Draft
→ Feedback
→ Final Submission
→ Reflection
→ Progress
→ Trust

LECTURER JOURNEY

Login
→ Dashboard
→ Assignment Queue
→ Review
→ Rubric
→ AI Recommendation
→ Edit Feedback
→ Accept/Override/Reject
→ Publish/Finalise
→ Review Queue
→ Knowledge Base
→ Analytics
→ Trust

Every visible control must:

- work
- navigate correctly
- update state correctly
- open a valid panel/dialog
- or provide honest feedback

No:

- dead buttons
- decorative clickable UI
- fake success
- misleading media controls
- blank dialogs
- broken links
- inaccessible controls
- console errors
- runtime crashes
- role leakage
- lost state after refresh where persistence is expected

==================================================
VALIDATION
==================================================

After every checkpoint run:

- TypeScript check
- production build where possible
- Git whitespace check
- route-level checks
- development-server verification

Attempt browser testing.

If browser automation is unavailable:

- do not claim visual verification
- create MANUAL_QA_CHECKLIST.md
- list exact routes
- list expected results
- list every control requiring manual validation
- include student and lecturer demo scripts

If Windows EPERM blocks the build:

- determine whether it is an environmental or code defect
- use only safe established workarounds
- do not modify unrelated dependencies
- do not falsely report a passed build

==================================================
TRACKING
==================================================

Update PROJECT_IMPLEMENTATION_TRACKER.md after each completed checkpoint.

Create:

PRODUCT_BLUEPRINT_IMPLEMENTATION_REPORT.md

Document:

1. Initial diagnosis
2. Blueprint sections implemented
3. Files changed
4. Design-system changes
5. Student changes
6. Lecturer changes
7. Learning Workspace changes
8. AI Tutor changes
9. Assignment changes
10. Navigation changes
11. Empty/loading/error states
12. Motion
13. Responsive work
14. Accessibility work
15. Dead controls fixed
16. Honest placeholders remaining
17. Validation results
18. Browser/manual QA status
19. Exact localhost URL
20. Remaining limitations

==================================================
FINAL STOP CONDITION
==================================================

Do not push.
Do not merge.
Do not create a pull request.
Do not modify main.
Do not commit automatically.

When all validated checkpoints are complete, stop and provide:

1. Branch confirmation
2. Checkpoints completed
3. Blueprint recommendations implemented
4. Product-wide transformation summary
5. Student experience result
6. Lecturer experience result
7. Learning Workspace result
8. AI Tutor result
9. Assignment Portal result
10. Design-system result
11. Motion result
12. Responsive result
13. Accessibility result
14. Dead controls fixed
15. Files modified
16. TypeScript result
17. Production-build result
18. Browser/manual QA result
19. Exact localhost URL
20. Remaining placeholders
21. Remaining limitations
22. Confirmation business logic is preserved
23. Confirmation no push, merge, rebase, reset, clean, PR or main modification occurred

Do not claim the product has reached 9/10 unless the visible implementation, functional workflows and QA results support that claim.

