# AI Learning Companion Design System

## Product Direction

The interface is Blackboard Ultra 2030: familiar university LMS workflows, modernised with AI assistance that feels native rather than bolted on.

The next product direction is an original premium AI-powered Learning Management System for commercial release. It should feel calm, academic, trustworthy, intelligent, and enterprise-grade. It may learn from the craftsmanship of top-tier product companies, but it must not copy Blackboard or any proprietary interface.

## Colour

- LMS shell: ink `#15161A`, deep sidebar `#101216`, slate text `#4B5566`, paper `#FAFAF8`, line `#E6E4DD`
- University authority: cardinal `#9E1B32`, cardinal tint `#FBEBEE`
- AI identity: companion blue `#3454D1`, purple `#7C3AED`, companion tint `#EEF1FD`
- Feedback states: success `#157F3C`, warn `#B4690E`, danger `#B3261E`
- Premium dark system: night `#0F1117`, night soft `#151924`, night panel `#1C2230`, mist `#F7F4EE`, mist muted `#C7C0B6`
- AI premium accents: cyan `#6DE7F2`, violet `#8B5CF6`, rose `#F0ABFC`

AI-generated surfaces use a blue-to-purple accent, soft glow, sparkle icon, and the `AI Companion` badge. Normal LMS content remains white, neutral, and calm.

## Typography

- Display: Sora for page titles and major cards
- Body: Inter for LMS UI
- System/meta: IBM Plex Mono for source citations, confidence badges, progress labels, and course codes

## Spacing And Shape

- Page gutters: 24-32px desktop, 20px mobile
- Cards: 20-24px padding, 16-24px radius depending on density; repeated cards should use consistent radius within a screen
- Buttons: large click targets, 44px minimum height
- Navigation: dark left sidebar for global LMS areas; course/unit tabs remain horizontal and familiar
- Alignment: icons align optically with text, controls share a consistent height rhythm, and no interactive element should look accidental
- Elevation: use subtle borders first, shadows second, glow only for AI or active premium states

## Components

- `LmsCard`: white card, soft border, minimal shadow
- `AiCard`: blue/purple tinted card with subtle glowing border
- `ConfidenceBadge`: single trust indicator for grounded/escalated responses
- `CourseCard`: image strip, code, title, lecturer, progress, next assessment
- `UnitTabs`: Overview, Unit Materials, Assessments, Announcements, Resources
- `AiCompanionPanel`: contextual right sidebar for slides and unit materials
- `UploadCard`: Turnitin-inspired upload state with filename, progress, processing
- `DashboardWidget`: lecturer analytics card with anonymised cohort metrics
- `Button`: primary, secondary, ghost, AI, and danger variants with consistent focus and 44px minimum target size
- `Badge`: neutral, AI, success, warning, and danger variants for compact state metadata
- `Tabs`: accessible tablist with `aria-selected` and clear active state
- `PageHeader`: consistent page title, eyebrow, description, and action layout
- `PlaceholderState`: polished future-feature state for unimplemented workflows
- `SkeletonBlock`: restrained loading surface for premium perceived performance

## Motion

- Small card lift on hover
- Upload progress animation
- AI response loading pulse
- Sidebar and card fade-up transitions
- Respect `prefers-reduced-motion`
- Motion should feel expensive, never flashy: fade, lift, scale, blur, and easing are preferred
- AI responses should transition in with a subtle mentor-like cadence
- Skeleton loading should be calm and low-contrast

## Interaction Standard

- Every visible navigation item, sidebar item, tab, button, dropdown, and dialog trigger must be classified before redesign as `Working`, `Broken`, `Placeholder`, or `Missing`.
- Broken navigation and tabs are fixed before major visual redesign.
- Missing functionality becomes a polished placeholder state with clear user feedback.
- No visible control should appear inactive unless it is intentionally disabled and explained by context.
- Icon-only controls must have accessible labels.
- Toast/status feedback uses live regions.

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

## Learning Journey

The commercial LMS flow should guide users naturally:

Dashboard -> Course -> Module -> Lesson -> AI Tutor -> Assignment -> Feedback -> Progress -> Achievement

The AI Tutor is the centerpiece. It should feel like an intelligent mentor, not a generic chatbot.

## Brand Identity

The brand is a premium AI-powered Learning Management System for academic institutions that need trust, clarity, and intelligence at commercial product quality.

- Brand personality: calm, precise, intelligent, quietly confident, academic, enterprise-ready, and deeply supportive. The product should feel capable without feeling loud.
- Emotional goals: students should feel oriented, encouraged, and in control. Lecturers should feel informed, respected, and supported. Every screen should reduce cognitive load and increase confidence.
- Brand voice: concise, warm, expert, and grounded. Avoid hype, novelty language, and generic AI claims. Prefer clear guidance, human reassurance, and source-aware explanations.
- Illustration style: use restrained product-native visuals, learning diagrams, document previews, module maps, and AI reasoning surfaces. Avoid decorative mascots, generic stock illustrations, and playful filler art.
- Icon style: use lucide icons with consistent stroke weight, optical alignment, and restrained sizing. Icons clarify function; they should not become decoration.
- AI visual language: AI surfaces use controlled cyan/violet/rose accents, subtle glow, source badges, confidence states, and calm response motion. AI should feel like a mentor embedded in the learning workflow.
- Empty state style: empty states should be useful, polished, and action-oriented. Include one clear explanation, one next step, and optional AI guidance. Never leave a blank panel or generic placeholder.
- Success state style: success states are quiet and affirmative. Use success green sparingly, short confirmation copy, and a clear next action when appropriate.
- Error state style: errors should be calm, specific, and recoverable. Explain what happened, what remains safe, and how to continue. Avoid alarming red-heavy layouts unless the action is destructive.
- Dashboard chart style: charts should be editorially restrained, high contrast, and easy to scan. Use muted grids, direct labels, compact legends, and one highlighted insight per chart.
- Data visualization rules: show only useful comparisons. Use consistent color meanings, avoid decorative gradients in data marks, label units clearly, and never rely on color alone.
- AI avatar/assistant visual identity: the assistant should be represented by a refined abstract mark or luminous signal, not a character. It should suggest intelligence, grounding, and calm presence.
- Image treatment: images should support real learning context: course material, document previews, modules, dashboards, and academic work. Use soft cropping, consistent radius, and subtle overlays only when readability needs them.
- Gradient rules: gradients are reserved for AI identity, premium hero surfaces, and selected emphasis. Keep them subtle, directional, and low-noise. Do not use gradients as generic decoration.
- Border rules: borders define structure before shadows do. Use low-contrast borders for normal surfaces, brighter borders for focus/active states, and dashed borders only for upload, placeholder, or future-feature states.
- Surface hierarchy: base surfaces are dark and calm; elevated panels are slightly lighter; primary work areas have the strongest clarity; AI surfaces may carry a controlled glow. Avoid stacking cards inside cards unless the inner element is a true item.
- Lighting and depth principles: depth should be soft and realistic. Use shadow, blur, and glow sparingly to separate layers, not to decorate. Active AI areas can feel subtly illuminated.
- Premium visual cues: consistent spacing, deliberate typography rhythm, aligned icons, polished focus states, refined micro-interactions, compact metadata, and high-quality empty/loading states.
- Dashboard density guidelines: dashboards should be dense enough for repeated work but never crowded. Prioritize scan paths, grouped decisions, and meaningful summaries over many equal-weight cards.
- White space philosophy: white space is functional. Use it to create focus, reduce anxiety, and separate learning decisions. Dense operational areas still need breathing room between groups.
- Information hierarchy: each screen needs one primary task, one clear next action, and visible supporting context. Headings, badges, charts, and actions should guide the user through the learning journey without competing for attention.
