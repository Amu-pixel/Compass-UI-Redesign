# AI Learning Companion Design System

## Product Direction

The interface is Blackboard Ultra 2030: familiar university LMS workflows, modernised with AI assistance that feels native rather than bolted on.

## Colour

- LMS shell: ink `#15161A`, deep sidebar `#101216`, slate text `#4B5566`, paper `#FAFAF8`, line `#E6E4DD`
- University authority: cardinal `#9E1B32`, cardinal tint `#FBEBEE`
- AI identity: companion blue `#3454D1`, purple `#7C3AED`, companion tint `#EEF1FD`
- Feedback states: success `#157F3C`, warn `#B4690E`, danger `#B3261E`

AI-generated surfaces use a blue-to-purple accent, soft glow, sparkle icon, and the `AI Companion` badge. Normal LMS content remains white, neutral, and calm.

## Typography

- Display: Sora for page titles and major cards
- Body: Inter for LMS UI
- System/meta: IBM Plex Mono for source citations, confidence badges, progress labels, and course codes

## Spacing And Shape

- Page gutters: 24-32px desktop, 20px mobile
- Cards: 20-24px padding, 24px radius for modern Blackboard cards
- Buttons: large click targets, 44px minimum height
- Navigation: dark left sidebar for global LMS areas; course/unit tabs remain horizontal and familiar

## Components

- `LmsCard`: white card, soft border, minimal shadow
- `AiCard`: blue/purple tinted card with subtle glowing border
- `ConfidenceBadge`: single trust indicator for grounded/escalated responses
- `CourseCard`: image strip, code, title, lecturer, progress, next assessment
- `UnitTabs`: Overview, Unit Materials, Assessments, Announcements, Resources
- `AiCompanionPanel`: contextual right sidebar for slides and unit materials
- `UploadCard`: Turnitin-inspired upload state with filename, progress, processing
- `DashboardWidget`: lecturer analytics card with anonymised cohort metrics

## Motion

- Small card lift on hover
- Upload progress animation
- AI response loading pulse
- Sidebar and card fade-up transitions
- Respect `prefers-reduced-motion`

## Role Rules

- Students see login, My Courses, Unit, Learning, Assessment, Trust.
- Lecturers see login, Lecturer Dashboard, Assignments, Review Queue, Knowledge Base, Trust.
- Student navigation never exposes lecturer pages.
- Lecturer navigation never exposes student learning pages.

## Page Layouts

- Login: Blackboard-style split screen with role cards.
- Courses: dark sidebar, large Courses heading, search/filter controls, semester groups, course cards.
- Unit: Blackboard-style course shell with tabs and right AI sidebar in Materials.
- Lecturer: analytics-first workspace with assignment review, final submissions, review queue, and validation actions.
