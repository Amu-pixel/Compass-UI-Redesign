# AI Learning Companion

A polished frontend prototype for a lecturer-governed AI assistant embedded inside a Blackboard-inspired LMS. The current direction is "Blackboard Ultra 2030": familiar university workflows with deeply integrated AI assistance.

## Run

```bash
npm install
npm run dev
```

## Structure

- `src/pages/` contains routed screens for the landing page, LMS unit page, learning mode, assessment feedback, lecturer dashboard, trust, and knowledge base evolution.
- `src/components/` contains reusable layout and UI components.
- `src/context/AuthContext.tsx` stores the mock logged-in user and role.
- `src/data/mockData.ts` centralises editable mock content, analytics, rubric feedback, lecturer inbox questions, and support pathways.
- `docs/DESIGN_SYSTEM.md` defines the shared visual system, role rules, navigation model, and AI styling.

## Demo Flow

- Start at `/` and choose Student Login or Lecturer Login.
- Student flow: Login -> My Courses -> Structural Analysis 301 -> Unit tabs -> Materials with AI Companion -> Assessment.
- Lecturer flow: Login -> Dashboard -> Assignments -> Review Queue -> Knowledge Base.
- Student routes and lecturer routes are separated by role.

## Prototype Assumptions

- The university is fictional, with a Curtin-adjacent colour influence but no real names, logos, or trademarks.
- The LMS is inspired by Blackboard Ultra rather than copied, with a dark global sidebar, course cards, course tabs, and familiar terminology.
- The LMS brand is fictionalised as `bentley.lms`.
- Students see assignment briefs, submissions, and AI formative feedback only. Lecturer marking guides, final-submission review, and AI recommendations are lecturer-only.
- Chat, upload, lecturer review, and dashboard actions are deterministic mock interactions for demo reliability.
- Uploads simulate filename, processing state, and generated feedback without storing files.
- Dashboard insights are anonymised cohort trends only.
- The prototype is desktop-first for a 13-15 inch laptop demo, with responsive mobile navigation.
