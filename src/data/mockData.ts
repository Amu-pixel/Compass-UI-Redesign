import {
  BarChart3,
  BookOpen,
  Brain,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  Layers,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';

export const unit = {
  name: 'Structural Analysis 301',
  code: 'CIVL301',
  week: 'Week 4',
  topic: 'Bending Moment Diagrams',
};

export const courses = [
  {
    code: 'CIVL301',
    title: 'Structural Analysis 301',
    lecturer: 'Dr Avery Tan',
    term: 'Semester 2, 2026',
    progress: 68,
    nextAssessment: 'Draft design reflection due Monday',
    image: 'radial-gradient(circle at 84% 18%, rgba(245,196,0,.22), transparent 30%), linear-gradient(135deg, #111111, #232323)',
  },
  {
    code: 'CIVL204',
    title: 'Engineering Materials',
    lecturer: 'Prof Maya Singh',
    term: 'Semester 2, 2026',
    progress: 54,
    nextAssessment: 'Lab report checkpoint Friday',
    image: 'radial-gradient(circle at 84% 18%, rgba(245,196,0,.18), transparent 30%), linear-gradient(135deg, #1B1B1B, #2C2C2C)',
  },
  {
    code: 'MATH221',
    title: 'Engineering Mathematics 2',
    lecturer: 'Dr Noah West',
    term: 'Semester 2, 2026',
    progress: 73,
    nextAssessment: 'Quiz 5 opens Wednesday',
    image: 'radial-gradient(circle at 84% 18%, rgba(245,196,0,.16), transparent 30%), linear-gradient(135deg, #111111, #3A3A3A)',
  },
  {
    code: 'CIVL310',
    title: 'Transport Systems Design',
    lecturer: 'Dr Lena Park',
    term: 'Semester 2, 2026',
    progress: 41,
    nextAssessment: 'Intersection analysis tutorial',
    image: 'radial-gradient(circle at 84% 18%, rgba(245,196,0,.14), transparent 30%), linear-gradient(135deg, #1B1B1B, #232323)',
  },
];

export const unitTabs = ['Overview', 'Unit Materials', 'Assessments', 'Announcements', 'Resources'];

export const slides = [
  { title: 'Week 1: Loads and supports', status: 'Complete' },
  { title: 'Week 2: Equilibrium review', status: 'Complete' },
  { title: 'Week 3: Shear force diagrams', status: 'Connected' },
  { title: 'Week 4: Bending moment diagrams', status: 'Current' },
  { title: 'Week 5: Design implications', status: 'Next' },
];

export const announcements = [
  'Tutorial 4 moves to Studio 2.13 this Thursday.',
  'PASS revision session: shear and moment diagrams, Friday 2 pm.',
  'Draft design reflection feedback opens Monday 9 am.',
];

export const quickActions = [
  'Explain this slide',
  'Connect previous topics',
  'Practice question',
  'Generate scenario',
  'Quiz me',
  'Explain another way',
  'Summarise lecture',
];

export const aiResponses: Record<string, string> = {
  'Explain this slide':
    'This slide is showing that bending moment is built from shear force. If shear is positive, the moment diagram rises. If shear is negative, it falls. The highest moment often appears where shear crosses zero.',
  'Connect previous topics':
    'In Week 3 you used equilibrium to draw shear force diagrams. Week 4 extends that: the area under the shear diagram becomes the change in bending moment.',
  'Practice question':
    'Practice: a simply supported 6 m beam carries a 12 kN point load at midspan. First find each reaction, then sketch the shear diagram, then predict where the maximum moment occurs. I can check your reasoning step by step.',
  'Generate scenario':
    'Scenario: you are inspecting a pedestrian bridge after increased live loading from event crowds. Explain why bending moments grow toward the centre span, and identify what evidence would make you recommend a detailed structural review.',
  'Quiz me':
    'Quiz: Where does maximum bending moment often occur? A) At every support B) Where shear force crosses zero C) Only at point loads D) Where the beam is shortest. Choose one and I will give feedback.',
  'Explain another way':
    'Analogy: imagine shear as the speed of a car and moment as its position. Positive speed moves the car forward, negative speed brings it back. Moment changes according to what shear has been doing over distance.',
  'Summarise lecture':
    'Week 4 summary: calculate reactions, draw shear, use shear areas to construct moment, mark maximum moment, then explain what the diagram means for design decisions.',
  'Prepare support questions for me':
    'Here are three questions you can take to support: 1. Can you check whether I am linking shear area to moment correctly? 2. Where should I look for maximum bending moment in this beam? 3. How can I explain the design implication without asking for an assessment answer?',
  'Recommend support option':
    'Based on repeated uncertainty about bending moment diagrams, I recommend a group discussion for comparing reasoning, a 1 on 1 mentoring session for study strategy, or a lecturer catch-up if your question is about assessment expectations.',
};

export const learningStyles = ['Text', 'Images', 'Video', 'Worked example', 'Scenario', 'Animation'];

export const chatSeed = [
  {
    role: 'student',
    text: "I don't understand bending moment diagrams.",
  },
  {
    role: 'ai',
    text: 'I found this in Week 4, Slide 18 and the Week 3 shear force recap. A bending moment diagram shows how the beam wants to bend at each point. Start with support reactions, use the shear diagram to see where moment is increasing or decreasing, then mark where shear crosses zero because that is often where maximum moment occurs. Which part feels unclear: reactions, sign convention, or drawing the curve?',
    source: 'Week 4 Lecture, Slide 18',
  },
  {
    role: 'ai',
    text: 'Try this practice step: for a simply supported beam with a central point load, sketch the reactions first, then describe what the shear diagram does before drawing the moment shape. I can check your reasoning without completing an assessment answer for you.',
    source: 'Week 3 Tutorial, Question 4',
  },
];

export const supportPathways = [
  { name: 'Group discussion', detail: 'Week 4 discussion board: compare shear-to-moment reasoning with classmates', icon: MessageSquare },
  { name: '1 on 1 mentoring session', detail: 'Peer mentor booking: Wednesday 11:30 am or Thursday 3:00 pm', icon: GraduationCap },
  { name: 'Lecturer catch-up session', detail: 'Dr Avery Tan: Tuesday 1:30 pm, Room 5.204', icon: ClipboardCheck },
  { name: 'PASS session', detail: 'Friday 2:00 pm, Engineering Studio 2.13', icon: Users },
  { name: 'Tutorial support', detail: 'Thursday 10:00 am worked beam examples', icon: BookOpen },
];

export const featureCards = [
  { title: 'Learning Mode', text: 'Students ask unit-specific questions and get cited explanations.', icon: Brain },
  { title: 'Assessment Feedback', text: 'Drafts receive formative rubric guidance without answers or marks.', icon: ClipboardCheck },
  { title: 'Lecturer Dashboard', text: 'Cohort trends reveal where teaching can adapt next week.', icon: BarChart3 },
  { title: 'Trustworthy AI', text: 'Grounded answers, source attribution, and escalation when unsure.', icon: ShieldCheck },
  { title: 'Knowledge Growth', text: 'Lecturer-approved answers improve the unit over semesters.', icon: Layers },
];

export const learningLoop = [
  'Teach',
  'Learn',
  'Apply',
  'Reflect',
  'Formative Feedback',
  'Lecturer Insight',
  'Better Teaching',
  'Better Learning',
];

export const rubric = [
  {
    title: 'Diagram construction',
    positive: 'Your shear-to-moment relationship is identified clearly for the central span.',
    improvement: 'The support reaction labels need to be carried through before the moment curve is drawn.',
    direction: 'Revisit Week 4 Slide 18 and annotate where shear changes sign.',
  },
  {
    title: 'Calculation accuracy',
    positive: 'You show the equilibrium setup before calculating internal forces.',
    improvement: 'Units are inconsistent between kN and N in two worked lines.',
    direction: 'Check the Week 3 tutorial convention sheet and explain each conversion.',
  },
  {
    title: 'Engineering justification',
    positive: 'You connect maximum moment to likely design concern.',
    improvement: 'The sustainability implication is named but not justified with unit concepts.',
    direction: 'Use Week 5 material to discuss why material efficiency depends on moment demand.',
  },
  {
    title: 'Communication',
    positive: 'Your diagram labels make the load case easy to follow.',
    improvement: 'The conclusion repeats the result without explaining what it means.',
    direction: 'Add a short reflection on how the result would guide a design decision.',
  },
];

export const assignmentBrief = {
  title: 'Assignment 2: Beam Behaviour and Design Reflection',
  due: 'Draft feedback closes Monday 9:00 am. Final submission due Friday 5:00 pm.',
  task:
    'Analyse the bending moment behaviour of a simply supported beam under live loading, then write a short design reflection explaining where maximum demand occurs and how that would influence an efficient structural design decision.',
  requirements: [
    'Include labelled shear force and bending moment diagrams.',
    'Explain how the bending moment diagram was derived from shear force.',
    'Discuss one practical design implication tied to maximum moment demand.',
    'Reflect on material efficiency without relying on AI-written assessment text.',
  ],
};

export const sampleSubmission = {
  filename: 'CIVL301_Assignment2_DavidChen_Draft.pdf',
  excerpt:
    'The maximum bending moment is likely near the centre of the span because the shear force changes sign at this location. This means the beam would need more capacity in the central region. My diagram shows the moment increasing from the left support and decreasing after the midpoint, but I need to better explain how the area under the shear diagram creates this shape.',
};

export const lecturerAssignmentView = {
  finalSubmissions: [
    { student: 'David Chen', file: 'CIVL301_Assignment2_DavidChen_Final.pdf', submitted: '18 Sep 2026, 4:42 pm', status: 'Ready for marking' },
    { student: 'Amelia Brooks', file: 'CIVL301_Assignment2_AmeliaBrooks_Final.pdf', submitted: '18 Sep 2026, 3:58 pm', status: 'AI recommendation generated' },
    { student: 'Marcus Lee', file: 'CIVL301_Assignment2_MarcusLee_Final.pdf', submitted: '18 Sep 2026, 2:15 pm', status: 'Lecturer review required' },
  ],
  aiRecommendation:
    'The draft feedback correctly identified diagram construction as a strength and engineering justification as the main development area. For final marking, apply the lecturer-approved marking guide: evaluate the student response against evidence of shear-to-moment reasoning, calculation consistency, design implication, and communication clarity. Do not use the AI draft feedback as a mark.',
  markingGuide:
    'Approved marking guide available to AI: assess conceptual reasoning, diagram accuracy, calculation consistency, justified design implication, and clarity of communication. The guide is used to structure feedback recommendations for the lecturer, not released to students.',
};

export const finalRubric = [
  { criterion: 'Diagram construction', score: '15/18', comment: 'Clear diagram sequence with one minor sign convention issue corrected in review.' },
  { criterion: 'Calculation accuracy', score: '17/20', comment: 'Method is sound and units are mostly consistent.' },
  { criterion: 'Application and justification', score: '16/20', comment: 'Good link between maximum moment and material selection.' },
  { criterion: 'Communication', score: '8/10', comment: 'Readable structure with concise lecturer-approved feedback.' },
];

export const analytics = [
  { label: 'Asked about BMDs', value: '42%', detail: 'follow-up questions in Week 4', tone: 'ai' },
  { label: 'Confidence trend', value: '+18%', detail: 'after worked example release', tone: 'green' },
  { label: 'Quiz accuracy', value: '71%', detail: 'moment maxima questions', tone: 'amber' },
  { label: 'Support referrals', value: '36', detail: 'PASS and tutorials this week', tone: 'neutral' },
];

export const misunderstoodTopics = [
  'Sign convention after a point load',
  'Where maximum moment occurs',
  'Linking shear diagram area to moment',
  'Explaining design implications',
];

export const dashboardQuestions = [
  'Why does moment peak where shear is zero?',
  'How do I know if the curve should be parabolic?',
  'What should I understand before discussing sustainability?',
];

export const teachingActions = ['Publish FAQ', 'Release Quiz', 'Schedule Revision', 'Upload Worked Example', 'Announcement'];

export const lecturerInbox = [
  {
    question: 'If the assignment asks about bending moment demand, what should I understand to discuss it confidently?',
    answer:
      'You should understand how loads and support reactions shape shear force, and how the area under the shear diagram changes bending moment. For assessment work, use this to explain your own design reasoning rather than copying a prepared response.',
    source: 'Week 4 Lecture, Slide 18',
  },
  {
    question: 'Can a bending moment diagram show where a beam is likely to use more material?',
    answer:
      'High bending moment regions often require greater section capacity. The unit connects this to material efficiency in Week 5, where students compare demand with practical design decisions.',
    source: 'Week 5 Reading, Section 2',
  },
];

export const trustLayers = [
  { title: 'Approved unit content', text: 'The companion searches lecture materials, rubrics, tutorials, and lecturer guidance only.', icon: BookOpen },
  { title: 'Source attribution', text: 'Every answer cites the week, slide, tutorial, or rubric it used.', icon: CheckCircle2 },
  { title: 'Lecturer validation', text: 'Low-confidence questions enter the lecturer queue instead of being guessed.', icon: ShieldCheck },
];

export const knowledgeTimeline = [
  'Semester 1',
  'Student question',
  'AI unsure',
  'Lecturer validation',
  'Approved response',
  'Knowledge base grows',
  'Semester 2',
  'Better AI',
];

export const connectors = [
  ['Lecture slides', 'Connected'],
  ['Recordings', 'Connected'],
  ['Tutorials', 'Connected'],
  ['Readings', 'Connected'],
  ['Assessment briefs', 'Connected'],
  ['Marking rubrics', 'Connected'],
  ['Teaching guidance', 'Pending review'],
];

export const governanceBoundaries = [
  'Complete reports',
  'Solve assignment questions',
  'Generate assessment content for students',
  'Use external internet sources',
  'Fabricate references',
  'Write assessment paragraphs',
];

export const heroStats = [
  ['62%', 'knowledge maturity'],
  ['18', 'lecturer-approved answers'],
  ['0', 'private chat logs exposed'],
];

export const sparkIcon = Sparkles;
