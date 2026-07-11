export type TutorIntent =
  | 'slide-explanation'
  | 'why-explanation'
  | 'simplify'
  | 'beginner-explanation'
  | 'mathematical-explanation'
  | 'exam-strategy'
  | 'common-mistakes'
  | 'applications'
  | 'related-concept'
  | 'intuition'
  | 'concept-definition'
  | 'relationship-comparison'
  | 'equation-formula'
  | 'worked-example'
  | 'diagram-explanation'
  | 'analogy'
  | 'practice-question'
  | 'assignment-preparation'
  | 'confusion-support'
  | 'unsupported';

export type TutorMethod =
  | 'simple'
  | 'steps'
  | 'diagram'
  | 'video'
  | 'podcast'
  | 'comic'
  | 'analogy'
  | 'practice'
  | 'flashcards'
  | 'revision';

export type TutorAction = {
  label: string;
  kind: 'ask' | 'method' | 'navigate' | 'contact';
  value: string;
};

export type TutorResponse = {
  intent: TutorIntent;
  text: string;
  source: string;
  followUps: TutorAction[];
  recommendedMethod?: TutorMethod;
  showSupport?: boolean;
  state?: 'grounded' | 'uncertain' | 'unsupported' | 'escalated';
};

const lessonTerms = [
  'beam',
  'bending',
  'moment',
  'shear',
  'load',
  'reaction',
  'support',
  'diagram',
  'span',
  'equilibrium',
  'structural',
  'slide',
  'lecture',
  'assignment',
  'rubric',
];

function includesAny(text: string, terms: string[]) {
  return terms.some((term) => text.includes(term));
}

export function classifyTutorIntent(question: string): TutorIntent {
  const text = question.toLowerCase().trim();

  if (includesAny(text, ['confused', 'do not understand', "don't understand", 'not understand', 'stuck', 'unclear', 'lost', 'support questions'])) {
    return 'confusion-support';
  }
  if (includesAny(text, ['common mistake', 'mistakes', 'what goes wrong', 'avoid'])) {
    return 'common-mistakes';
  }
  if (/\bexam\b/.test(text) || includesAny(text, ['test strategy', 'exam strategy', 'appear in exam', 'exam question'])) {
    return 'exam-strategy';
  }
  if (includesAny(text, ['application', 'real application', 'real-world application', 'where is this used', 'industry'])) {
    return 'applications';
  }
  if (includesAny(text, ['related concept', 'what comes next', 'next topic', 'prerequisite'])) {
    return 'related-concept';
  }
  if (includesAny(text, ['intuition', 'intuitive', 'feel for', 'why should i care'])) {
    return 'intuition';
  }
  if (includesAny(text, ['explain like beginner', 'beginner', 'new to this', 'from scratch'])) {
    return 'beginner-explanation';
  }
  if (includesAny(text, ['simplify', 'simpler', 'simple version', 'plain english'])) {
    return 'simplify';
  }
  if (includesAny(text, ['mathematically', 'maths', 'math ', 'mathematical'])) {
    return 'mathematical-explanation';
  }
  if (includesAny(text, ['step-by-step', 'step by step', 'show step', 'show steps', 'walk me through', 'deeper explanation', 'explain deeper'])) {
    return 'slide-explanation';
  }
  if (includesAny(text, ['why?', 'why ', 'why does', 'why is'])) {
    return 'why-explanation';
  }
  if (includesAny(text, ['worked example', 'work through', 'show me an example', 'give example', 'give me an example', 'another example', 'calculate an example', 'generate scenario'])) {
    return 'worked-example';
  }
  if (includesAny(text, ['equation', 'formula', 'mathematical', 'derive', 'derivation'])) {
    return 'equation-formula';
  }
  if (includesAny(text, ['difference between', 'compare', 'relationship', 'relate', 'why does', 'why is', 'maximum when', 'shear force and bending', 'previous topics'])) {
    return 'relationship-comparison';
  }
  if (includesAny(text, ['diagram', 'graph', 'curve', 'shape', 'visual'])) {
    return 'diagram-explanation';
  }
  if (includesAny(text, ['real-world', 'real world', 'real-life', 'real life', 'analogy', 'everyday example', 'like in practice', 'explain another way'])) {
    return 'analogy';
  }
  if (includesAny(text, ['practice question', 'quiz me', 'test me', 'practice independently', 'question to try'])) {
    return 'practice-question';
  }
  if (includesAny(text, ['assignment', 'rubric', 'revise', 'prepare', 'draft', 'assessment'])) {
    return 'assignment-preparation';
  }
  if (includesAny(text, ['explain this slide', 'summarise this slide', 'summarize this slide', 'slide says', 'lecture summary', 'summarise lecture', 'summarize lecture'])) {
    return 'slide-explanation';
  }
  if (includesAny(text, ['what is', 'define', 'meaning of', 'explain bending', 'explain shear'])) {
    return 'concept-definition';
  }
  if (includesAny(text, lessonTerms)) return 'concept-definition';
  return 'unsupported';
}

export function buildTutorResponse(question: string): TutorResponse {
  const intent = classifyTutorIntent(question);

  const responses: Record<TutorIntent, TutorResponse> = {
    'slide-explanation': {
      intent,
      text: 'Slide 18 connects two diagrams. The shear-force diagram tells you the rate and direction of change of bending moment along the beam. Positive shear makes the moment curve rise, negative shear makes it fall, and the signed area under the shear diagram gives the change in moment. This is why the slide asks you to construct shear first and moment second.',
      source: 'Week 4 Lecture Slides, Slide 18; Week 3 Tutorial, Question 4',
      recommendedMethod: 'steps',
      followUps: [
        { label: 'Show step-by-step', kind: 'method', value: 'steps' },
        { label: 'View the diagram', kind: 'method', value: 'diagram' },
        { label: 'Reveal the equation', kind: 'ask', value: 'Show me the equation behind this.' },
        { label: 'Try a practice question', kind: 'method', value: 'practice' },
      ],
    },
    'why-explanation': {
      intent,
      text: 'Why it works: bending moment is not drawn independently. It is accumulated from shear as you move along the beam. If shear is positive, each small step adds positive moment; if shear is negative, each step removes moment. That is why the maximum often appears where shear changes from positive to negative: the moment stops increasing and starts decreasing.',
      source: 'Week 4 Lecture Slides, Slide 18; shear-to-moment relationship',
      recommendedMethod: 'steps',
      followUps: [
        { label: 'Animate why this happens', kind: 'method', value: 'steps' },
        { label: 'Show visual intuition', kind: 'method', value: 'diagram' },
        { label: 'Give a beginner version', kind: 'ask', value: 'Explain like beginner.' },
        { label: 'Common mistakes', kind: 'ask', value: 'What are common mistakes?' },
      ],
    },
    simplify: {
      intent,
      text: 'Simple version: shear tells the moment diagram which way to move. Positive shear means the moment line goes up. Negative shear means it goes down. The bigger the shear area, the bigger the moment change. Start by marking where shear is positive, zero, and negative.',
      source: 'Week 4 Lecture Slides, Slide 18',
      recommendedMethod: 'simple',
      followUps: [
        { label: 'Open simple view', kind: 'method', value: 'simple' },
        { label: 'Try flashcards', kind: 'method', value: 'flashcards' },
        { label: 'Show intuition', kind: 'ask', value: 'Show intuition.' },
        { label: 'Generate practice question', kind: 'method', value: 'practice' },
      ],
    },
    'beginner-explanation': {
      intent,
      text: 'Beginner explanation: imagine walking along the beam from left to right. The shear diagram gives instructions: go uphill, stay level, or go downhill on the moment diagram. You do not need to memorise the final shape first. Read the shear sign, then build the moment curve from that evidence.',
      source: 'Week 4 Lecture Slides, Slide 18; Week 3 prerequisite recap',
      recommendedMethod: 'simple',
      followUps: [
        { label: 'Use analogy', kind: 'method', value: 'analogy' },
        { label: 'Open visual diagram', kind: 'method', value: 'diagram' },
        { label: 'Review prerequisite', kind: 'navigate', value: '/demo' },
        { label: 'Ask why', kind: 'ask', value: 'Why does this work?' },
      ],
    },
    'mathematical-explanation': {
      intent,
      text: 'Mathematical explanation: the local slope of the bending-moment diagram equals shear, so dM/dx = V. Over a distance, the change in moment is the integral of shear: M2 - M1 = integral V dx. This is the formal reason signed area under the shear diagram becomes moment change.',
      source: 'Week 4 formula sheet; Lecture Slides 16-18',
      recommendedMethod: 'steps',
      followUps: [
        { label: 'Animate derivation', kind: 'method', value: 'steps' },
        { label: 'Show formula sheet', kind: 'ask', value: 'Show formula.' },
        { label: 'Apply to worked example', kind: 'ask', value: 'Give example.' },
        { label: 'Practice calculation', kind: 'method', value: 'practice' },
      ],
    },
    'exam-strategy': {
      intent,
      text: 'Exam strategy: expect a question to test sequence and interpretation, not just drawing. A strong answer usually finds reactions, sketches shear with correct sign changes, uses shear area to construct moment, identifies the maximum moment, and explains one engineering meaning. Common marks are lost when students skip the shear-to-moment link.',
      source: 'Week 4 tutorial guidance; Assignment 2 rubric alignment',
      recommendedMethod: 'practice',
      followUps: [
        { label: 'Generate exam-style practice', kind: 'method', value: 'practice' },
        { label: 'Common mistakes', kind: 'ask', value: 'Common mistakes?' },
        { label: 'Create revision plan', kind: 'method', value: 'revision' },
        { label: 'Review flashcards', kind: 'method', value: 'flashcards' },
      ],
    },
    'common-mistakes': {
      intent,
      text: 'Common mistakes: drawing the moment diagram before checking shear; treating zero shear as a maximum without checking sign change; dropping units between kN and N; forgetting support reactions; and writing a design implication that only repeats the maximum moment value. Use the diagram view to check the first three.',
      source: 'Week 4 lecturer guidance; Assignment 2 formative feedback patterns',
      recommendedMethod: 'diagram',
      followUps: [
        { label: 'Open diagram', kind: 'method', value: 'diagram' },
        { label: 'Practice mistake spotting', kind: 'method', value: 'practice' },
        { label: 'Review rubric', kind: 'navigate', value: '/demo/assessment#rubric' },
        { label: 'Simplify this', kind: 'ask', value: 'Simplify this.' },
      ],
    },
    applications: {
      intent,
      text: 'Applications: bending moment diagrams help engineers identify where a beam needs capacity, where deflection risk may be important, and where material can be used efficiently. In a floor beam, bridge member, or roof beam, the peak moment region often drives section size and detailing.',
      source: 'Week 5 design implications preview; Week 4 BMD concept',
      recommendedMethod: 'analogy',
      followUps: [
        { label: 'Real-world analogy', kind: 'method', value: 'analogy' },
        { label: 'Comic scenario', kind: 'method', value: 'comic' },
        { label: 'Assignment connection', kind: 'navigate', value: '/demo/assessment' },
        { label: 'Ask for example', kind: 'ask', value: 'Give real world example.' },
      ],
    },
    'related-concept': {
      intent,
      text: 'Related concepts to review next: support reactions, shear force diagrams, sign convention, distributed-load relationships, and design implication from moment demand. If one of these is weak, start with flashcards, then use adaptive practice.',
      source: 'CIVL301 Week 3-5 learning sequence',
      recommendedMethod: 'revision',
      followUps: [
        { label: 'Create revision plan', kind: 'method', value: 'revision' },
        { label: 'Review flashcards', kind: 'method', value: 'flashcards' },
        { label: 'Open prerequisite lesson', kind: 'navigate', value: '/demo' },
        { label: 'Ask Tutor for next topic', kind: 'ask', value: 'What should I study next?' },
      ],
    },
    intuition: {
      intent,
      text: 'Intuition: shear is the tendency for the moment diagram to climb or fall at that point. Moment is the accumulated bending demand after those climbs and falls. The diagram matters because the highest accumulated demand tells you where the beam is working hardest.',
      source: 'Week 4 Lecture Slides, Slide 18',
      recommendedMethod: 'analogy',
      followUps: [
        { label: 'Open analogy', kind: 'method', value: 'analogy' },
        { label: 'Visual explanation', kind: 'method', value: 'diagram' },
        { label: 'Explain mathematically', kind: 'ask', value: 'Explain mathematically.' },
        { label: 'Try practice', kind: 'method', value: 'practice' },
      ],
    },
    'concept-definition': {
      intent,
      text: 'Bending moment is the internal turning effect developed within a beam as it resists external loads. At a cut through the beam, it represents the moment required for equilibrium of either side. A bending moment diagram plots that internal moment along the span, so you can identify where bending demand is greatest and where section capacity needs the closest attention.',
      source: 'Week 4 Lecture Slides, Slides 14-18',
      recommendedMethod: 'simple',
      followUps: [
        { label: 'Show step-by-step', kind: 'method', value: 'steps' },
        { label: 'View diagram', kind: 'method', value: 'diagram' },
        { label: 'Try an analogy', kind: 'method', value: 'analogy' },
        { label: 'Ask a practice question', kind: 'method', value: 'practice' },
      ],
    },
    'relationship-comparison': {
      intent,
      text: 'Shear force and bending moment describe different internal actions, but they are mathematically linked: dM/dx = V. Shear force V is the slope of the bending-moment diagram M. Where shear is positive, moment increases; where shear is negative, moment decreases. At an interior point where shear changes sign through zero, the moment slope changes from positive to negative or vice versa, so the moment has a local maximum or minimum. Zero shear alone is not enough at every boundary, so always check the sign change and support conditions.',
      source: 'Week 4 Lecture Slides, Slide 18; Week 3 Shear Force Recap',
      recommendedMethod: 'diagram',
      followUps: [
        { label: 'Inspect the diagram', kind: 'method', value: 'diagram' },
        { label: 'Show the derivation', kind: 'method', value: 'steps' },
        { label: 'Give me a worked example', kind: 'ask', value: 'Can you give me a worked example?' },
        { label: 'Test this relationship', kind: 'method', value: 'practice' },
      ],
    },
    'equation-formula': {
      intent,
      text: 'The governing relationships are dV/dx = -w(x) and dM/dx = V(x). Over a finite interval, M(x2) - M(x1) = integral from x1 to x2 of V(x) dx. In words: distributed load changes shear, and the signed area under the shear diagram changes moment. For a region of constant positive shear, moment is linear and rising; for linearly varying shear, moment is curved.',
      source: 'Week 4 Lecture Slides, Slides 16-18; Structural Analysis formula sheet',
      recommendedMethod: 'steps',
      followUps: [
        { label: 'Animate the derivation', kind: 'method', value: 'steps' },
        { label: 'Apply it to an example', kind: 'ask', value: 'Apply the equation to a worked example.' },
        { label: 'View diagram', kind: 'method', value: 'diagram' },
        { label: 'Why is each step used?', kind: 'ask', value: 'Why is each step in the derivation used?' },
      ],
    },
    'worked-example': {
      intent,
      text: 'Worked example: take a simply supported 6 m beam with a 12 kN point load at midspan. Symmetry gives reactions of 6 kN at each support. Shear is +6 kN from the left support to midspan, then drops by 12 kN to -6 kN until the right support. Moment starts at zero and rises linearly: M(3 m) = 6 kN x 3 m = 18 kN m. It then falls linearly to zero. The maximum is 18 kN m at midspan because shear changes from positive to negative there. Use this as a study model, not assessment text.',
      source: 'Week 4 Worked Example 2; Week 3 Tutorial, Question 4',
      recommendedMethod: 'steps',
      followUps: [
        { label: 'Try another example', kind: 'ask', value: 'Give me another worked example with a different load position.' },
        { label: 'Reveal the formula', kind: 'ask', value: 'Show me the equation behind this.' },
        { label: 'Practise independently', kind: 'method', value: 'practice' },
        { label: 'Why is each step used?', kind: 'ask', value: 'Why is each step in the worked example used?' },
      ],
    },
    'diagram-explanation': {
      intent,
      text: 'Read the diagram from top to bottom. The load diagram establishes external actions and reactions. The shear diagram changes abruptly at point loads and varies under distributed load. The bending-moment diagram then follows the accumulated signed area under shear: it rises under positive shear, reaches a stationary point where shear crosses zero, and falls under negative shear. The labelled peak marks the region of greatest bending demand for this load case.',
      source: 'Week 4 Lecture Slides, Slide 18; approved beam diagram',
      recommendedMethod: 'diagram',
      followUps: [
        { label: 'Open interactive diagram', kind: 'method', value: 'diagram' },
        { label: 'Animate the sequence', kind: 'method', value: 'steps' },
        { label: 'Explain sign convention', kind: 'ask', value: 'Explain the sign convention in the diagram.' },
        { label: 'Check my understanding', kind: 'method', value: 'practice' },
      ],
    },
    analogy: {
      intent,
      text: 'Think of shear as the slope of a hiking trail and bending moment as your elevation. A positive slope makes elevation rise; a negative slope makes it fall. At the top of a hill, the slope is zero and changes from positive to negative, just as moment reaches a local maximum where shear crosses zero. The limit of the analogy is important: shear and moment are internal beam actions with units and sign conventions, not literal speed or height.',
      source: 'Week 4 Lecture Slides, Slide 18; AI Tutor teaching analogy',
      recommendedMethod: 'analogy',
      followUps: [
        { label: 'Open analogy view', kind: 'method', value: 'analogy' },
        { label: 'Connect to the formula', kind: 'ask', value: 'Connect the analogy to dM/dx = V.' },
        { label: 'View the engineering diagram', kind: 'method', value: 'diagram' },
        { label: 'Test the analogy', kind: 'method', value: 'practice' },
      ],
    },
    'practice-question': {
      intent,
      text: 'Practice question: a simply supported 8 m beam has a uniformly distributed load of 4 kN/m across the full span. Without completing every calculation, determine: (1) the support reactions, (2) how shear varies from left to right, (3) where maximum bending moment occurs, and (4) whether the moment diagram is linear or curved. Start with the reactions and explain your reasoning; I can check each step.',
      source: 'Week 4 Tutorial Practice Set, Question 3',
      recommendedMethod: 'practice',
      followUps: [
        { label: 'Open adaptive practice', kind: 'method', value: 'practice' },
        { label: 'Give me a hint', kind: 'ask', value: 'Give me one hint for the practice question.' },
        { label: 'Review the diagram first', kind: 'method', value: 'diagram' },
        { label: 'Show a simpler question', kind: 'ask', value: 'Give me a simpler practice question.' },
      ],
    },
    'assignment-preparation': {
      intent,
      text: 'Before Assignment 2, revise five things: support reactions from equilibrium; shear sign convention; the area relationship between shear and moment; why a zero-shear sign change locates an interior moment extremum; and how peak moment informs section capacity and material efficiency. Use the rubric to check whether your own draft shows evidence for each idea. I can explain concepts and review gaps, but I will not write or submit assessment content.',
      source: 'Assignment 2 Brief; Assessment Rubric; Week 3-4 approved materials',
      recommendedMethod: 'practice',
      followUps: [
        { label: 'Open rubric', kind: 'navigate', value: '/demo/assessment#rubric' },
        { label: 'Review sample draft feedback', kind: 'navigate', value: '/demo/assessment#sample-feedback' },
        { label: 'Revisit relevant lesson', kind: 'navigate', value: '/demo' },
        { label: 'Ask a focused practice question', kind: 'method', value: 'practice' },
      ],
    },
    'confusion-support': {
      intent,
      text: 'Thanks for saying that. Let us reduce this to one idea: bending moment records the accumulated effect of shear as you move along the beam. Positive shear adds to moment; negative shear subtracts from it. Start with the interactive diagram and trace only the sign of shear before looking at values. If that still feels unclear, use the lecturer contact option or revisit the Week 3 shear-force prerequisite.',
      source: 'Week 4 Lecture Slides, Slide 18; Week 3 prerequisite recap',
      recommendedMethod: 'simple',
      showSupport: true,
      followUps: [
        { label: 'Explain more simply', kind: 'method', value: 'simple' },
        { label: 'Open visual diagram', kind: 'method', value: 'diagram' },
        { label: 'Use a real-world analogy', kind: 'method', value: 'analogy' },
        { label: 'Contact lecturer', kind: 'contact', value: 'Concept clarification' },
        { label: 'View prerequisite topic', kind: 'navigate', value: '/demo' },
      ],
    },
    unsupported: {
      intent,
      text: 'That question is outside the approved Week 4 Structural Analysis materials available in this demo, so I should not invent an answer. I can help with loads, reactions, shear force, bending moment diagrams, the Week 4 equations, or preparation for Assignment 2. For another topic, use the relevant unit workspace or ask your lecturer.',
      source: 'Approved CIVL301 materials boundary',
      state: 'uncertain',
      followUps: [
        { label: 'Explain the current slide', kind: 'ask', value: 'Explain this slide.' },
        { label: 'Review the diagram', kind: 'method', value: 'diagram' },
        { label: 'Contact lecturer', kind: 'contact', value: 'Concept clarification' },
      ],
    },
  };

  return responses[intent];
}
