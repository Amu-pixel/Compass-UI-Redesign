import {
  Bookmark,
  Brain,
  Captions,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Download,
  Expand,
  FastForward,
  FileText,
  Gauge,
  Headphones,
  Image,
  Layers,
  Lightbulb,
  MessageSquareText,
  Pause,
  PenLine,
  PictureInPicture,
  Play,
  RefreshCcw,
  Rewind,
  RotateCcw,
  Volume2,
  VolumeX,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from 'react';
import podcastUrl from '../assets/media/bending-moment-podcast.wav';
import { cn } from '../utils/classNames';
import { Badge, Button, LoadingPill } from './ui';

export type LearningMethod =
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

export const learningMethodOptions: Array<{
  id: LearningMethod;
  label: string;
  description: string;
  icon: typeof Brain;
}> = [
  { id: 'simple', label: 'Explain simply', description: 'Build an intuitive mental model.', icon: Lightbulb },
  { id: 'steps', label: 'Animated steps', description: 'Watch the derivation unfold.', icon: Layers },
  { id: 'diagram', label: 'Interactive diagram', description: 'Inspect every relationship.', icon: Image },
  { id: 'video', label: 'Video lesson', description: 'Study with chapters and notes.', icon: Play },
  { id: 'podcast', label: 'Audio field note', description: 'Listen, follow, and bookmark.', icon: Headphones },
  { id: 'comic', label: 'Visual story', description: 'Move through a design scenario.', icon: PenLine },
  { id: 'analogy', label: 'Real-world analogy', description: 'Compare, test, and correct.', icon: Brain },
  { id: 'practice', label: 'Adaptive practice', description: 'Build confidence and mastery.', icon: CircleHelp },
  { id: 'flashcards', label: 'Flashcards', description: 'Retrieve key relationships from memory.', icon: Bookmark },
  { id: 'revision', label: 'Revision plan', description: 'Turn progress into a focused study session.', icon: Check },
];

const methodGroups: Array<{ title: string; purpose: string; methods: LearningMethod[] }> = [
  { title: 'Understand', purpose: 'Build the concept', methods: ['simple', 'steps', 'diagram', 'analogy'] },
  { title: 'Study media', purpose: 'Watch or listen with notes', methods: ['video', 'podcast', 'comic'] },
  { title: 'Mastery', purpose: 'Retrieve, practise, revise', methods: ['flashcards', 'practice', 'revision'] },
];

const methodSignals: Record<LearningMethod, { role: string; outcome: string; accent: string }> = {
  simple: { role: 'Explanation panel', outcome: 'Leave with a plain-language mental model.', accent: 'bg-success-tint text-success border-success/20' },
  steps: { role: 'Reasoning timeline', outcome: 'Understand the sequence, not just the result.', accent: 'bg-companion-tint text-companion border-companion/20' },
  diagram: { role: 'Interactive diagram lab', outcome: 'Trace labels, forces, and moment demand visually.', accent: 'bg-cardinal-tint text-cardinal border-cardinal/20' },
  video: { role: 'Video lesson', outcome: 'Use chapters, captions, bookmarks, and saved notes.', accent: 'bg-companion-tint text-companion border-companion/20' },
  podcast: { role: 'Audio field note', outcome: 'Listen with chapters, transcript, and saved bookmarks.', accent: 'bg-companion-tint text-companion border-companion/20' },
  comic: { role: 'Storyboard case', outcome: 'Follow a realistic engineering conversation.', accent: 'bg-[#f7e8dc] text-cardinal border-cardinal/20' },
  analogy: { role: 'Comparison model', outcome: 'Use and test a metaphor against formal mechanics.', accent: 'bg-companion-tint text-ink border-companion/30' },
  practice: { role: 'Quiz workspace', outcome: 'Commit, reveal, explain, and build confidence.', accent: 'bg-companion-tint text-companion border-companion/20' },
  flashcards: { role: 'Retrieval practice', outcome: 'Recall first, then reveal the approved explanation.', accent: 'bg-cardinal-tint text-cardinal border-cardinal/20' },
  revision: { role: 'Revision planner', outcome: 'Choose a focused study block and track what you complete.', accent: 'bg-success-tint text-success border-success/20' },
};

type StudioProps = {
  selectedMethod: LearningMethod;
  onSelect: (method: LearningMethod) => void;
  onAsk: (question: string) => void;
};

const fieldNoteTranscript = [
  { start: 0, end: 7, text: 'Start with the shear force diagram. The bending moment changes by the signed area under that diagram.' },
  { start: 7, end: 13.5, text: 'Positive shear makes the moment rise. Negative shear makes it fall. The direction of accumulation is the key.' },
  { start: 13.5, end: 20, text: 'Where shear is large and positive, the moment climbs steeply. Where shear is small, the moment changes slowly.' },
  { start: 20, end: 27, text: 'When shear crosses zero, the bending moment often reaches a local maximum or minimum. This is a critical design point.' },
  { start: 27, end: 34, text: 'The largest moment indicates where bending demand is greatest. But confirm the sign convention and support conditions before using it.' },
  { start: 34, end: 41, text: 'For a simply supported beam with a central point load, the peak moment occurs directly beneath the load, where shear changes sign.' },
  { start: 41, end: 48, text: 'In design, the peak bending moment determines the required section size, material grade, and reinforcement layout.' },
  { start: 48, end: 54, text: 'Pause and sketch the relationship in your own words, then compare your reasoning with the worked diagram. This is your takeaway.' },
];

const LESSON_VIDEO_CACHE_KEY = 'CIVL301-week4-bending-moment-video-v4';
const LESSON_VIDEO_DB_NAME = 'compass-ai-media-cache';
const LESSON_VIDEO_STORE_NAME = 'generated-media';
const LESSON_VIDEO_DURATION_MS = 16_000;
const LESSON_VIDEO_FRAME_RATE = 12;
const LESSON_VIDEO_CHAPTERS = [
  { at: 0, label: 'Beam and supports', text: 'A simply supported beam with pin and roller supports.' },
  { at: 2, label: 'Applied load', text: 'A 12 kN point load is applied at midspan.' },
  { at: 4, label: 'Reaction forces', text: 'Equilibrium gives RA = RB = 6 kN upward.' },
  { at: 6, label: 'Shear construction', text: 'Track shear discontinuities from left to right.' },
  { at: 8, label: 'Positive and negative shear', text: 'Shear is +6 kN left of load, minus 6 kN right of load.' },
  { at: 10, label: 'Signed-area relationship', text: 'Signed shear area controls the change in moment.' },
  { at: 12, label: 'Moment diagram', text: 'Moment rises under positive shear, falls under negative.' },
  { at: 14, label: 'Peak moment and design', text: 'Zero shear marks peak moment - the critical design section.' },
];

const MEDIA_PREVIEW_ONLY = false;
type LessonVideoStatus = 'idle' | 'checking-cache' | 'loading-cached' | 'preparing' | 'ready' | 'failed';

type LessonVideoMetrics = {
  cacheLookupMs?: number;
  generationMs?: number;
  cachedLoadMs?: number;
  source?: 'cache' | 'generated';
  status?: LessonVideoStatus;
};

type LessonVideoState = {
  url: string;
  status: LessonVideoStatus;
  source?: 'cache' | 'generated';
  error: string;
  metrics: LessonVideoMetrics;
  retry: () => void;
};

let lessonVideoMemoryBlob: Blob | null = null;
let lessonVideoGenerationPromise: Promise<Blob> | null = null;

function readStoredNumber(key: string) {
  const value = Number(window.localStorage.getItem(key));
  return Number.isFinite(value) ? value : 0;
}

function readStoredList(key: string): number[] {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) ?? '[]') as number[];
    return Array.isArray(parsed) ? parsed.filter(Number.isFinite) : [];
  } catch {
    return [];
  }
}

function formatTime(value: number) {
  if (!Number.isFinite(value)) return '0:00';
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function getVideoMetricsTarget() {
  return window as Window & { __compassVideoMetrics?: LessonVideoMetrics };
}

function recordVideoMetric(update: LessonVideoMetrics) {
  const target = getVideoMetricsTarget();
  target.__compassVideoMetrics = { ...(target.__compassVideoMetrics ?? {}), ...update };
}

function openLessonVideoDb(): Promise<IDBDatabase | null> {
  if (!('indexedDB' in window)) return Promise.resolve(null);
  return new Promise((resolve) => {
    let settled = false;
    let timeout = 0;
    const finish = (db: IDBDatabase | null) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      resolve(db);
    };
    timeout = window.setTimeout(() => finish(null), 700);
    const request = window.indexedDB.open(LESSON_VIDEO_DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(LESSON_VIDEO_STORE_NAME)) {
        db.createObjectStore(LESSON_VIDEO_STORE_NAME);
      }
    };
    request.onsuccess = () => finish(request.result);
    request.onerror = () => finish(null);
    request.onblocked = () => finish(null);
  });
}

async function readCachedLessonVideoBlob(key: string) {
  const db = await openLessonVideoDb();
  if (!db) return null;
  return new Promise<Blob | null>((resolve) => {
    let settled = false;
    let timeout = 0;
    const finish = (blob: Blob | null) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      db.close();
      resolve(blob);
    };
    timeout = window.setTimeout(() => finish(null), 700);
    const transaction = db.transaction(LESSON_VIDEO_STORE_NAME, 'readonly');
    const store = transaction.objectStore(LESSON_VIDEO_STORE_NAME);
    const request = store.get(key);
    request.onsuccess = () => {
      const value = request.result as { blob?: Blob; version?: string } | Blob | undefined;
      if (value instanceof Blob) {
        finish(value);
        return;
      }
      finish(value?.blob instanceof Blob ? value.blob : null);
    };
    request.onerror = () => finish(null);
    transaction.onerror = () => finish(null);
  });
}

async function writeCachedLessonVideoBlob(key: string, blob: Blob) {
  const db = await openLessonVideoDb();
  if (!db) return;
  await new Promise<void>((resolve) => {
    let settled = false;
    let timeout = 0;
    const finish = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      db.close();
      resolve();
    };
    timeout = window.setTimeout(finish, 700);
    const transaction = db.transaction(LESSON_VIDEO_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(LESSON_VIDEO_STORE_NAME);
    store.put({ blob, version: key, createdAt: Date.now() }, key);
    transaction.oncomplete = finish;
    transaction.onerror = finish;
  });
}

function drawLessonFrame(context: CanvasRenderingContext2D, progress: number) {
  const { width, height } = context.canvas;
  // 8 chapters, each gets 1/8 of the total progress.
  const safeProgress = Number.isFinite(progress) ? Math.max(0, Math.min(0.999, progress)) : 0;
  const chapter = Math.max(0, Math.min(7, Math.floor(safeProgress * 8)));
  const chapterProgress = Math.min(1, (safeProgress * 8) % 1);

  const titles = [
    'Beam and supports',
    'Applied load',
    'Reaction forces',
    'Shear diagram construction',
    'Positive and negative shear',
    'Signed-area relationship',
    'Moment diagram formation',
    'Peak moment and design meaning',
  ];
  const descriptions = [
    'A simply supported beam with pin and roller supports.',
    'A 12 kN point load applied at midspan.',
    'Equilibrium gives RA = RB = 6 kN upward.',
    'Track shear discontinuities from left to right.',
    'Shear is +6 kN left of load, −6 kN right of load.',
    'Signed shear area controls the change in moment.',
    'Moment rises under positive shear, falls under negative.',
    'Zero shear marks peak moment — the critical design section.',
  ];

  // Background
  const background = context.createLinearGradient(0, 0, width, height);
  background.addColorStop(0, '#0f1117');
  background.addColorStop(1, '#1B1B1B');
  context.fillStyle = background;
  context.fillRect(0, 0, width, height);

  // Subtle ambient glow
  context.fillStyle = 'rgba(245,196,0,0.08)';
  context.beginPath();
  context.arc(width * 0.8, height * 0.15, 120, 0, Math.PI * 2);
  context.fill();

  // Header
  context.fillStyle = '#F5C400';
  context.font = '600 16px Arial';
  context.fillText('CIVL301  /  WEEK 4', 50, 40);
  context.fillStyle = '#f7f4ee';
  context.font = '700 32px Arial';
  context.fillText(titles[chapter] ?? titles[0], 50, 78);
  context.fillStyle = '#c7c0b6';
  context.font = '18px Arial';
  context.fillText(descriptions[chapter] ?? descriptions[0], 50, 108);

  const left = 100;
  const right = width - 100;
  const mid = (left + right) / 2;
  const beamY = 200;
  const shearBase = 320;
  const momentBase = 430;

  // --- Scene 0: Beam and supports (always visible from here on) ---
  const beamAlpha = chapter === 0 ? chapterProgress : 1;
  context.globalAlpha = beamAlpha;
  context.lineWidth = 8;
  context.strokeStyle = '#f7f4ee';
  context.beginPath();
  context.moveTo(left, beamY);
  context.lineTo(right, beamY);
  context.stroke();
  // Pin support (triangle left)
  context.fillStyle = '#F5C400';
  context.beginPath();
  context.moveTo(left - 16, beamY + 28);
  context.lineTo(left + 16, beamY + 28);
  context.lineTo(left, beamY + 4);
  context.fill();
  // Roller support (triangle + circle right)
  context.beginPath();
  context.moveTo(right - 16, beamY + 28);
  context.lineTo(right + 16, beamY + 28);
  context.lineTo(right, beamY + 4);
  context.fill();
  context.beginPath();
  context.arc(right, beamY + 34, 5, 0, Math.PI * 2);
  context.fill();
  // Span label
  context.fillStyle = '#c7c0b6';
  context.font = '14px Arial';
  context.fillText('L', mid - 4, beamY + 50);
  context.globalAlpha = 1;

  // --- Scene 1: Applied load ---
  if (chapter >= 1) {
    const loadAlpha = chapter === 1 ? chapterProgress : 1;
    context.globalAlpha = loadAlpha;
    const loadX = mid;
    context.lineWidth = 5;
    context.strokeStyle = '#FFF5C2';
    context.beginPath();
    context.moveTo(loadX, beamY - 80);
    context.lineTo(loadX, beamY - 12);
    context.stroke();
    // Arrow head
    context.fillStyle = '#FFF5C2';
    context.beginPath();
    context.moveTo(loadX - 10, beamY - 26);
    context.lineTo(loadX + 10, beamY - 26);
    context.lineTo(loadX, beamY - 8);
    context.fill();
    // Label
    context.fillStyle = '#FFF5C2';
    context.font = '600 16px Arial';
    context.fillText('12 kN', loadX + 14, beamY - 50);
    context.globalAlpha = 1;
  }

  // --- Scene 2: Reaction forces ---
  if (chapter >= 2) {
    const reactAlpha = chapter === 2 ? chapterProgress : 1;
    context.globalAlpha = reactAlpha;
    // RA upward
    context.strokeStyle = '#4F7A5A';
    context.lineWidth = 4;
    context.beginPath();
    context.moveTo(left, beamY + 54);
    context.lineTo(left, beamY + 30);
    context.stroke();
    context.fillStyle = '#4F7A5A';
    context.beginPath();
    context.moveTo(left - 7, beamY + 38);
    context.lineTo(left + 7, beamY + 38);
    context.lineTo(left, beamY + 26);
    context.fill();
    context.font = '600 14px Arial';
    context.fillText('RA = 6 kN', left - 30, beamY + 70);
    // RB upward
    context.strokeStyle = '#4F7A5A';
    context.beginPath();
    context.moveTo(right, beamY + 54);
    context.lineTo(right, beamY + 30);
    context.stroke();
    context.fillStyle = '#4F7A5A';
    context.beginPath();
    context.moveTo(right - 7, beamY + 38);
    context.lineTo(right + 7, beamY + 38);
    context.lineTo(right, beamY + 26);
    context.fill();
    context.fillText('RB = 6 kN', right - 30, beamY + 70);
    context.globalAlpha = 1;
  }

  // --- Scenes 3-4: Shear diagram ---
  if (chapter >= 3) {
    const shearAlpha = chapter <= 4 ? Math.min(1, chapter === 3 ? chapterProgress : 1) : 0.85;
    context.globalAlpha = shearAlpha;
    // Baseline
    context.strokeStyle = '#CFC9BC';
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(left, shearBase);
    context.lineTo(right, shearBase);
    context.stroke();
    context.fillStyle = '#858585';
    context.font = '600 12px Arial';
    context.fillText('SHEAR (V)', left - 4, shearBase - 55);

    // Shear diagram path with progressive draw for chapter 3
    const shearDraw = chapter === 3 ? chapterProgress : 1;
    context.lineWidth = 5;
    context.strokeStyle = '#4F7A5A';
    context.beginPath();
    const shearTop = shearBase - 45;
    const shearBot = shearBase + 45;
    context.moveTo(left, shearBase);
    if (shearDraw > 0.05) context.lineTo(left, shearTop);
    if (shearDraw > 0.25) context.lineTo(left + (mid - left) * Math.min(1, (shearDraw - 0.25) / 0.25), shearTop);
    if (shearDraw > 0.5) {
      context.lineTo(mid, shearTop);
      context.lineTo(mid, shearBot);
    }
    if (shearDraw > 0.65) context.lineTo(mid + (right - mid) * Math.min(1, (shearDraw - 0.65) / 0.25), shearBot);
    if (shearDraw > 0.9) {
      context.lineTo(right, shearBot);
      context.lineTo(right, shearBase);
    }
    context.stroke();

    // Shear fill regions for chapter >= 4
    if (chapter >= 4) {
      const regionAlpha = chapter === 4 ? chapterProgress * 0.25 : 0.2;
      // Positive region
      context.fillStyle = `rgba(79,122,90,${regionAlpha})`;
      context.beginPath();
      context.moveTo(left, shearBase);
      context.lineTo(left, shearTop);
      context.lineTo(mid, shearTop);
      context.lineTo(mid, shearBase);
      context.fill();
      // Negative region
      context.fillStyle = `rgba(156,74,70,${regionAlpha})`;
      context.beginPath();
      context.moveTo(mid, shearBase);
      context.lineTo(mid, shearBot);
      context.lineTo(right, shearBot);
      context.lineTo(right, shearBase);
      context.fill();

      // Labels
      context.fillStyle = '#4F7A5A';
      context.font = '600 13px Arial';
      context.fillText('+6 kN', left + 10, shearTop - 8);
      context.fillStyle = '#9C4A46';
      context.fillText('−6 kN', right - 60, shearBot + 18);
    }
    context.globalAlpha = 1;
  }

  // --- Scene 5: Signed area relationship ---
  if (chapter >= 5) {
    const areaAlpha = chapter === 5 ? chapterProgress : 1;
    context.globalAlpha = areaAlpha;
    // Arrow from shear area to moment curve
    const arrowY = shearBase + 60;
    context.strokeStyle = '#F5C400';
    context.lineWidth = 2;
    context.setLineDash([6, 4]);
    context.beginPath();
    context.moveTo(mid, arrowY);
    context.lineTo(mid, momentBase - 60);
    context.stroke();
    context.setLineDash([]);
    context.fillStyle = '#F5C400';
    context.beginPath();
    context.moveTo(mid - 6, momentBase - 68);
    context.lineTo(mid + 6, momentBase - 68);
    context.lineTo(mid, momentBase - 56);
    context.fill();
    // Area label
    context.fillStyle = '#F5C400';
    context.font = '600 12px Arial';
    context.fillText('ΔM = ∫V dx', mid + 10, arrowY + 14);
    context.globalAlpha = 1;
  }

  // --- Scenes 6-7: Moment diagram and peak ---
  if (chapter >= 6) {
    const momentAlpha = chapter >= 6 ? Math.min(1, chapter === 6 ? chapterProgress : 1) : 0;
    context.globalAlpha = momentAlpha;
    // Baseline
    context.strokeStyle = '#CFC9BC';
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(left, momentBase);
    context.lineTo(right, momentBase);
    context.stroke();
    context.fillStyle = '#858585';
    context.font = '600 12px Arial';
    context.fillText('MOMENT (M)', left - 4, momentBase + 60);

    // Parabolic moment curve — progressive draw
    const drawPct = chapter === 6 ? chapterProgress : 1;
    context.lineWidth = 6;
    context.strokeStyle = '#DFAE00';
    context.beginPath();
    const steps = Math.floor(drawPct * 80);
    for (let i = 0; i <= steps; i++) {
      const t = i / 80;
      const x = left + (right - left) * t;
      const y = momentBase - Math.sin(t * Math.PI) * 55;
      if (i === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    }
    context.stroke();

    // Fill under moment curve
    if (drawPct > 0.6) {
      context.fillStyle = 'rgba(223,174,0,0.12)';
      context.beginPath();
      for (let i = 0; i <= 80; i++) {
        const t = i / 80;
        const x = left + (right - left) * t;
        const y = momentBase - Math.sin(t * Math.PI) * 55;
        if (i === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.lineTo(right, momentBase);
      context.lineTo(left, momentBase);
      context.fill();
    }

    // Peak marker for chapter 7
    if (chapter >= 7) {
      const peakAlpha = chapter === 7 ? chapterProgress : 1;
      context.globalAlpha = peakAlpha;
      const peakX = mid;
      const peakY = momentBase - 55;
      // Highlight circle
      context.fillStyle = '#9C4A46';
      context.beginPath();
      context.arc(peakX, peakY, 8, 0, Math.PI * 2);
      context.fill();
      // Dashed line up from zero shear
      context.strokeStyle = '#9C4A46';
      context.lineWidth = 2;
      context.setLineDash([4, 4]);
      context.beginPath();
      context.moveTo(peakX, shearBase);
      context.lineTo(peakX, peakY + 12);
      context.stroke();
      context.setLineDash([]);
      // Labels
      context.fillStyle = '#9C4A46';
      context.font = '700 14px Arial';
      context.fillText('Mmax', peakX + 14, peakY + 4);
      context.fillStyle = '#fbbf24';
      context.font = '600 13px Arial';
      context.fillText('V = 0 → peak M', peakX + 14, peakY + 22);
      // Design meaning text
      context.fillStyle = '#f7f4ee';
      context.font = '600 15px Arial';
      context.fillText('Critical section for design', mid - 80, height - 30);
    }
    context.globalAlpha = 1;
  }

  // Chapter progress indicator
  for (let index = 0; index < 8; index += 1) {
    context.fillStyle = index <= chapter ? '#F5C400' : 'rgba(255,255,255,0.15)';
    context.fillRect(50 + index * (width - 100) / 8, height - 14, (width - 100) / 8 - 6, 4);
  }
}

function generateLessonVideoBlob() {
  if (lessonVideoGenerationPromise) return lessonVideoGenerationPromise;

  lessonVideoGenerationPromise = new Promise<Blob>((resolve, reject) => {
    if (!('MediaRecorder' in window) || !HTMLCanvasElement.prototype.captureStream) {
      reject(new Error('This browser cannot create the local video lesson.'));
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 960;
    canvas.height = 540;
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) {
      reject(new Error('The video canvas could not be prepared.'));
      return;
    }

    const stream = canvas.captureStream(LESSON_VIDEO_FRAME_RATE);
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : 'video/webm';
    const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 900_000 });
    const chunks: BlobPart[] = [];
    const startedAt = performance.now();
    let frameTimer = 0;
    let fallbackTimer = 0;
    let settled = false;

    const cleanup = () => {
      window.clearInterval(frameTimer);
      window.clearTimeout(fallbackTimer);
      stream.getTracks().forEach((track) => track.stop());
    };

    recorder.ondataavailable = (event) => {
      if (event.data.size) chunks.push(event.data);
    };
    recorder.onerror = () => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error('The local video lesson could not be generated.'));
    };
    recorder.onstop = () => {
      if (settled) return;
      settled = true;
      cleanup();
      if (!chunks.length) {
        reject(new Error('The browser could not prepare the video. Use the storyboard, transcript, and notes while the player is unavailable.'));
        return;
      }
      const blob = new Blob(chunks, { type: mimeType });
      recordVideoMetric({ generationMs: Math.round(performance.now() - startedAt), status: 'ready', source: 'generated' });
      resolve(blob);
    };

    drawLessonFrame(context, 0);
    recorder.start(500);
    frameTimer = window.setInterval(() => {
      const elapsed = performance.now() - startedAt;
      drawLessonFrame(context, Math.min(0.999, elapsed / LESSON_VIDEO_DURATION_MS));
      if (elapsed >= LESSON_VIDEO_DURATION_MS && recorder.state !== 'inactive') {
        recorder.stop();
      }
    }, 1000 / LESSON_VIDEO_FRAME_RATE);
    fallbackTimer = window.setTimeout(() => {
      if (settled) return;
      if (recorder.state !== 'inactive') recorder.stop();
    }, LESSON_VIDEO_DURATION_MS + 8_000);
  }).finally(() => {
    lessonVideoGenerationPromise = null;
  });

  return lessonVideoGenerationPromise;
}

async function getOrGenerateLessonVideoBlob() {
  if (lessonVideoMemoryBlob) return { blob: lessonVideoMemoryBlob, source: 'cache' as const };

  const cacheStart = performance.now();
  const cached = await Promise.race([
    readCachedLessonVideoBlob(LESSON_VIDEO_CACHE_KEY),
    new Promise<null>((resolve) => window.setTimeout(() => resolve(null), 900)),
  ]);
  const cacheLookupMs = Math.round(performance.now() - cacheStart);
  recordVideoMetric({ cacheLookupMs, status: cached ? 'loading-cached' : 'preparing' });
  if (cached) {
    lessonVideoMemoryBlob = cached;
    return { blob: cached, source: 'cache' as const, cacheLookupMs };
  }

  const generated = await generateLessonVideoBlob();
  lessonVideoMemoryBlob = generated;
  void writeCachedLessonVideoBlob(LESSON_VIDEO_CACHE_KEY, generated);
  return { blob: generated, source: 'generated' as const, cacheLookupMs };
}

function useGeneratedLessonVideo(enabled: boolean): LessonVideoState {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<LessonVideoStatus>('idle');
  const [source, setSource] = useState<'cache' | 'generated' | undefined>();
  const [error, setError] = useState('');
  const [metrics, setMetrics] = useState<LessonVideoMetrics>({});
  const [attempt, setAttempt] = useState(0);
  const urlRef = useRef('');

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    async function loadVideo() {
      if (urlRef.current) return;
      setStatus('checking-cache');
      setError('');
      const startedAt = performance.now();
      try {
        const result = await getOrGenerateLessonVideoBlob();
        if (cancelled) return;
        setStatus(result.source === 'cache' ? 'loading-cached' : 'ready');
        const objectUrl = URL.createObjectURL(result.blob);
        urlRef.current = objectUrl;
        setUrl(objectUrl);
        setSource(result.source);
        const nextMetrics = {
          cacheLookupMs: result.cacheLookupMs,
          cachedLoadMs: result.source === 'cache' ? Math.round(performance.now() - startedAt) : undefined,
          generationMs: getVideoMetricsTarget().__compassVideoMetrics?.generationMs,
          source: result.source,
          status: 'ready' as const,
        };
        setMetrics(nextMetrics);
        recordVideoMetric(nextMetrics);
        setStatus('ready');
      } catch (reason) {
        if (cancelled) return;
        const message = reason instanceof Error ? reason.message : 'The browser could not prepare the video.';
        setError(message);
        setStatus('failed');
        recordVideoMetric({ status: 'failed' });
      }
    }

    void loadVideo();
    return () => {
      cancelled = true;
    };
  }, [attempt, enabled]);

  useEffect(() => () => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
  }, []);

  const retry = useCallback(() => {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = '';
    }
    setUrl('');
    setError('');
    setSource(undefined);
    setStatus('idle');
    setAttempt((value) => value + 1);
  }, []);

  return { url, status, source, error, metrics, retry };
}

type MediaController = ReturnType<typeof useMediaController>;

function useMediaController(ref: RefObject<HTMLMediaElement | null>, storageKey: string) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [volume, setVolumeState] = useState(0.85);
  const [muted, setMutedState] = useState(false);
  const [rate, setRateState] = useState(1);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState('');

  const sync = useCallback(() => {
    const media = ref.current;
    if (!media) return;
    setCurrentTime(media.currentTime);
    setDuration(Number.isFinite(media.duration) ? media.duration : 0);
    if (media.duration && media.currentTime / media.duration >= 0.9) setComplete(true);
    window.localStorage.setItem(storageKey, String(media.currentTime));
  }, [ref, storageKey]);

  const syncSettings = useCallback(() => {
    const media = ref.current;
    if (!media) return;
    setVolumeState(media.volume);
    setMutedState(media.muted);
    setRateState(media.playbackRate);
  }, [ref]);

  const onLoadedMetadata = useCallback(() => {
    const media = ref.current;
    if (!media) return;
    setDuration(media.duration);
    media.volume = volume;
    media.muted = muted;
    media.playbackRate = rate;
    const stored = readStoredNumber(storageKey);
    if (stored > 0 && stored < media.duration - 1) media.currentTime = stored;
    sync();
    syncSettings();
  }, [muted, rate, ref, storageKey, sync, syncSettings, volume]);

  const togglePlayback = useCallback(async () => {
    const media = ref.current;
    if (!media) return;
    setError('');
    if (media.paused) {
      try {
        await media.play();
        setPlaying(!media.paused);
        sync();
      } catch (reason) {
        const message = reason instanceof Error ? reason.message : 'Playback was blocked by the browser.';
        setError(message);
        setPlaying(false);
      }
    } else {
      media.pause();
      setPlaying(false);
      sync();
    }
  }, [ref, sync]);

  const seek = useCallback((value: number) => {
    if (!ref.current) return;
    ref.current.currentTime = Math.max(0, Math.min(value, ref.current.duration || value));
    sync();
  }, [ref, sync]);

  const setVolume = useCallback((value: number) => {
    if (!ref.current) return;
    ref.current.volume = value;
    ref.current.muted = value === 0;
    setVolumeState(value);
    setMutedState(value === 0);
    syncSettings();
  }, [ref, syncSettings]);

  const toggleMuted = useCallback(() => {
    if (!ref.current) return;
    ref.current.muted = !ref.current.muted;
    setMutedState(ref.current.muted);
    syncSettings();
  }, [ref, syncSettings]);

  const setRate = useCallback((value: number) => {
    if (!ref.current) return;
    ref.current.playbackRate = value;
    setRateState(value);
    syncSettings();
  }, [ref, syncSettings]);

  useEffect(() => () => {
    const media = ref.current;
    if (media && !media.paused) media.pause();
  }, [ref]);

  return {
    currentTime,
    duration,
    playing,
    buffering,
    volume,
    muted,
    rate,
    complete,
    error,
    togglePlayback,
    seek,
    setVolume,
    toggleMuted,
    setRate,
    mediaEvents: {
      onLoadedMetadata,
      onTimeUpdate: sync,
      onDurationChange: sync,
      onPlay: () => {
        setError('');
        setPlaying(true);
      },
      onPause: () => setPlaying(false),
      onWaiting: () => setBuffering(true),
      onPlaying: () => setBuffering(false),
      onVolumeChange: syncSettings,
      onRateChange: syncSettings,
      onError: () => {
        const media = ref.current;
        setError(media?.error?.message || 'The browser could not play this media.');
        setPlaying(false);
      },
      onEnded: () => {
        setPlaying(false);
        setComplete(true);
      },
    },
  };
}

export function LearningExperienceStudio({ selectedMethod, onSelect, onAsk }: StudioProps) {
  const [videoRequested, setVideoRequested] = useState<boolean>(selectedMethod === 'video' && !MEDIA_PREVIEW_ONLY);
  const video = useGeneratedLessonVideo(videoRequested);
  const mediaFocused = selectedMethod === 'video' || selectedMethod === 'podcast';

  useEffect(() => {
    if (selectedMethod === 'video' && !MEDIA_PREVIEW_ONLY) setVideoRequested(true);
  }, [selectedMethod]);

  return (
    <section className="learning-studio elite-surface min-w-0 overflow-hidden rounded-2xl border border-line bg-white shadow-sm" aria-labelledby="studio-title">
      <div className="border-b border-line bg-paper px-5 py-5 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-companion">Learning Method Studio</p>
            <h2 id="studio-title" className="mt-2 break-words font-display text-xl font-bold leading-tight text-ink sm:text-2xl">Choose the experience that fits the task</h2>
          </div>
          <Badge tone="ai">Grounded in Week 4</Badge>
        </div>
        {mediaFocused ? (
          <div className="mt-4 grid min-w-0 grid-cols-2 gap-2 rounded-xl border border-line bg-white p-2 sm:grid-cols-3 lg:grid-cols-5" role="tablist" aria-label="Learning methods">
            {learningMethodOptions.map((option) => {
              const Icon = option.icon;
              const active = selectedMethod === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls={`method-panel-${option.id}`}
                  onClick={() => onSelect(option.id)}
                  className={cn(
                    'premium-focus inline-flex min-h-10 min-w-0 items-center gap-2 rounded-lg border px-3 text-sm font-bold outline-none transition duration-150 focus-visible:ring-2 focus-visible:ring-ai-cyan/70',
                    active ? 'border-ink bg-ink text-white shadow-sm' : 'border-line bg-paper text-ink hover:border-companion/45 hover:bg-companion-tint/60',
                  )}
                >
                  <Icon size={15} className={active ? 'text-ai-cyan' : 'text-companion'} />
                  <span className="min-w-0 truncate">{option.label}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="mt-5 grid min-w-0 gap-3 xl:grid-cols-3" role="tablist" aria-label="Learning methods">
            {methodGroups.map((group) => (
              <div key={group.title} className="min-w-0 rounded-xl border border-line bg-white p-3">
                <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3">
                  <p className="font-display text-sm font-bold text-ink">{group.title}</p>
                  <p className="text-[11px] font-semibold text-slate-soft">{group.purpose}</p>
                </div>
                <div className="grid gap-2">
                  {group.methods.map((id) => {
                    const option = learningMethodOptions.find((item) => item.id === id)!;
                    const Icon = option.icon;
                    const active = selectedMethod === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        aria-controls={`method-panel-${id}`}
                        onClick={() => onSelect(id)}
                        className={cn(
                          'premium-focus group min-h-16 min-w-0 rounded-lg border px-3 py-2.5 text-left outline-none transition duration-150 focus-visible:ring-2 focus-visible:ring-ai-cyan/70',
                          active ? 'border-ink bg-ink text-white shadow-sm' : 'border-line bg-paper text-ink hover:border-companion/45 hover:bg-companion-tint/60',
                        )}
                      >
                        <span className="flex min-w-0 items-center gap-2 text-sm font-bold"><Icon size={15} className={active ? 'text-ai-cyan' : 'text-companion'} /> <span className="min-w-0 break-words">{option.label}</span></span>
                        <span className={cn('mt-1 block text-xs leading-5', active ? 'text-white/68' : 'text-slate-soft')}>{option.description}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className={cn('mt-4 rounded-xl border px-4 py-3 text-sm font-semibold', methodSignals[selectedMethod].accent)}>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em]">Selected method</span>
          <span className="mx-2 text-current/45">/</span>
          <span>{methodSignals[selectedMethod].role}</span>
          <span className="mx-2 text-current/45">/</span>
          <span className="font-normal">{methodSignals[selectedMethod].outcome}</span>
        </div>
      </div>

      <div id={`method-panel-${selectedMethod}`} role="tabpanel" tabIndex={0} className="method-panel-enter min-h-[520px] outline-none">
        {selectedMethod === 'simple' && <SimpleExperience onAsk={onAsk} />}
        {selectedMethod === 'steps' && <AnimatedStepsExperience />}
        {selectedMethod === 'diagram' && <InteractiveDiagramExperience />}
        {selectedMethod === 'video' && <VideoExperience generatedVideo={video} onSelect={onSelect} />}
        {selectedMethod === 'podcast' && <PodcastExperience />}
        {selectedMethod === 'comic' && <ComicExperience />}
        {selectedMethod === 'analogy' && <AnalogyExperience />}
        {selectedMethod === 'practice' && <PracticeExperience onAsk={onAsk} />}
        {selectedMethod === 'flashcards' && <FlashcardExperience onAsk={onAsk} />}
        {selectedMethod === 'revision' && <RevisionExperience onAsk={onAsk} />}
      </div>
    </section>
  );
}

function ExperienceHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="max-w-2xl">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-companion">{eyebrow}</p>
        <h3 className="mt-2 font-display text-2xl font-bold text-ink">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-copy">{description}</p>
      </div>
      {action}
    </div>
  );
}

function SimpleExperience({ onAsk }: { onAsk: (question: string) => void }) {
  const [depth, setDepth] = useState<'plain' | 'connected' | 'formal'>('plain');
  const details = {
    plain: 'Shear tells you whether the bending moment line is climbing or falling. Positive shear lifts the moment line; negative shear lowers it.',
    connected: 'The amount of change in moment equals the signed area beneath the shear diagram. A wider or taller shear region creates a larger moment change.',
    formal: 'Because dM/dx = V, the slope of the moment diagram equals shear. Where V = 0, the moment diagram has a stationary point that may be a local maximum or minimum.',
  };

  return (
    <div className="grid min-h-[520px] gap-0 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="p-6 sm:p-8">
        <ExperienceHeader eyebrow="Clarity lens" title="Build the idea from intuition to equation" description="Choose the level of detail without losing the connection between shear and bending moment." />
        <div className="mt-7 inline-flex rounded-xl border border-line bg-paper p-1" role="group" aria-label="Explanation depth">
          {(['plain', 'connected', 'formal'] as const).map((item) => (
            <button key={item} type="button" aria-pressed={depth === item} onClick={() => setDepth(item)} className={cn('rounded-lg px-4 py-2 text-sm font-bold capitalize transition', depth === item ? 'bg-ink text-white shadow-sm' : 'text-slate-copy hover:bg-white')}>{item}</button>
          ))}
        </div>
        <div className="mt-8 border-l-2 border-companion pl-5">
          <p className="font-display text-xl font-semibold leading-8 text-ink">{details[depth]}</p>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {[['Positive shear', 'Moment rises'], ['Zero shear', 'Check for a peak'], ['Negative shear', 'Moment falls']].map(([label, value], index) => (
            <div key={label} className="rounded-xl border border-line bg-paper p-4">
              <span className="font-mono text-[10px] font-bold text-companion">0{index + 1}</span>
              <p className="mt-3 text-sm font-bold text-ink">{label}</p><p className="mt-1 text-xs text-slate-copy">{value}</p>
            </div>
          ))}
        </div>
      </div>
      <aside className="border-t border-line bg-night p-6 text-mist lg:border-l lg:border-t-0">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ai-cyan">Mental model</p>
        <div className="mt-6 space-y-3">
          <div className="rounded-xl border border-white/10 bg-white/[0.05] p-4"><p className="text-xs text-mist-muted">Input</p><p className="mt-1 font-bold">Shear diagram</p></div>
          <div className="mx-auto h-7 w-px bg-ai-cyan/50" />
          <div className="rounded-xl border border-ai-cyan/30 bg-ai-cyan/10 p-4"><p className="text-xs text-ai-cyan">Relationship</p><p className="mt-1 font-bold">Signed area</p></div>
          <div className="mx-auto h-7 w-px bg-ai-cyan/50" />
          <div className="rounded-xl border border-white/10 bg-white/[0.05] p-4"><p className="text-xs text-mist-muted">Output</p><p className="mt-1 font-bold">Moment change</p></div>
        </div>
        <Button variant="ai" className="mt-6 w-full justify-center" onClick={() => onAsk('Check my mental model for shear and bending moment')}>Check my understanding</Button>
      </aside>
    </div>
  );
}

function AnimatedStepsExperience() {
  const steps = [
    { title: 'Resolve reactions', formula: 'RA + RB = 12 kN', detail: 'Use global equilibrium before drawing internal actions.' },
    { title: 'Draw shear', formula: 'V = +6 kN, then -6 kN', detail: 'Track every load discontinuity from left to right.' },
    { title: 'Accumulate area', formula: 'Delta M = integral V dx', detail: 'Each signed shear area changes the bending moment.' },
    { title: 'Locate the peak', formula: 'V = dM/dx = 0', detail: 'Zero shear marks a stationary point in the moment diagram.' },
  ];
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setStep((value) => {
      if (value >= steps.length - 1) {
        setPlaying(false);
        return value;
      }
      return value + 1;
    }), 1600);
    return () => window.clearInterval(id);
  }, [playing, steps.length]);

  return (
    <div className="p-6 sm:p-8">
      <ExperienceHeader eyebrow="Animated derivation" title="Watch the reasoning assemble" description="Pause at any stage, inspect the highlighted relationship, or replay the complete derivation." action={<div className="flex gap-2"><Button size="sm" variant="secondary" onClick={() => setPlaying((value) => !value)}>{playing ? <Pause size={14} /> : <Play size={14} />}{playing ? 'Pause' : 'Play'}</Button><Button size="sm" variant="ghost" onClick={() => { setStep(0); setPlaying(true); }}><RotateCcw size={14} />Replay</Button></div>} />
      <div className="mt-8 grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <ol className="space-y-2" aria-label="Derivation steps">
          {steps.map((item, index) => (
            <li key={item.title}><button type="button" onClick={() => { setStep(index); setPlaying(false); }} aria-current={step === index ? 'step' : undefined} className={cn('w-full rounded-xl border p-3 text-left transition', step === index ? 'border-companion bg-companion-tint' : index < step ? 'border-success/25 bg-success-tint' : 'border-line bg-white hover:border-companion/40')}><span className="flex items-center gap-3"><span className={cn('grid h-7 w-7 place-items-center rounded-full font-mono text-xs font-bold', index <= step ? 'bg-ink text-white' : 'bg-paper text-slate-soft')}>{index < step ? <Check size={13} /> : index + 1}</span><span className="text-sm font-bold">{item.title}</span></span></button></li>
          ))}
        </ol>
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-night p-6 text-mist sm:p-8">
          <div className="absolute inset-x-0 top-0 h-1 bg-white/10"><div className="h-full bg-ai-cyan transition-all duration-500" style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div>
          <p className="font-mono text-xs font-bold text-ai-cyan">STEP {step + 1} OF {steps.length}</p>
          <h4 className="mt-4 font-display text-2xl font-bold">{steps[step].title}</h4>
          <p className="mt-3 max-w-xl text-sm leading-7 text-mist-muted">{steps[step].detail}</p>
          <div className="equation-highlight mt-8 rounded-xl border border-ai-violet/35 bg-ai-violet/10 p-5 font-mono text-xl font-bold text-white">{steps[step].formula}</div>
          <svg viewBox="0 0 700 190" className="mt-8 w-full" role="img" aria-label={`Animated diagram for ${steps[step].title}`}>
            <line x1="55" y1="70" x2="645" y2="70" stroke="#f7f4ee" strokeWidth="8" />
            <path d="M55 76 L35 112 L75 112 Z M645 76 L625 112 L665 112 Z" fill="#F5C400" opacity=".9" />
            <path d="M350 14 V58 M338 44 L350 58 L362 44" stroke="#FFF5C2" strokeWidth="5" fill="none" className={step >= 1 ? 'diagram-pulse' : ''} />
            {step >= 2 && <path d="M55 150 Q350 90 645 150" stroke="#DFAE00" strokeWidth="6" fill="none" pathLength="1" className="diagram-draw" />}
            {step >= 3 && <circle cx="350" cy="120" r="11" fill="#F5C400" className="diagram-pulse" />}
          </svg>
        </div>
      </div>
    </div>
  );
}

function InteractiveDiagramExperience() {
  const [focus, setFocus] = useState<'load' | 'shear' | 'moment'>('moment');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState(0);
  const descriptions = {
    load: 'The central 12 kN point load creates equal reactions for this symmetric beam.',
    shear: 'Shear changes sign at the load. Its signed area drives the moment change.',
    moment: 'The moment diagram peaks where shear crosses zero, directly beneath the load.',
  };
  return (
    <div className="grid min-h-[520px] lg:grid-cols-[minmax(0,1fr)_290px]">
      <div className="overflow-hidden bg-[#f8f9fb] p-6 sm:p-8">
        <ExperienceHeader eyebrow="Interactive model" title="Inspect the structural relationship" description="Select a layer, zoom the drawing, and move across the span to study how the diagrams connect." />
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {(['load', 'shear', 'moment'] as const).map((item) => <button key={item} type="button" aria-pressed={focus === item} onClick={() => setFocus(item)} className={cn('rounded-full border px-4 py-2 text-sm font-bold capitalize transition', focus === item ? 'border-ink bg-ink text-white' : 'border-line bg-white hover:border-companion')}>{item}</button>)}
          <span className="mx-1 hidden h-6 w-px bg-line sm:block" />
          <button type="button" aria-label="Zoom out" onClick={() => setZoom((value) => Math.max(.8, value - .1))} className="premium-focus grid h-10 w-10 place-items-center rounded-full border border-line bg-white"><ZoomOut size={16} /></button>
          <button type="button" aria-label="Zoom in" onClick={() => setZoom((value) => Math.min(1.5, value + .1))} className="premium-focus grid h-10 w-10 place-items-center rounded-full border border-line bg-white"><ZoomIn size={16} /></button>
          <button type="button" onClick={() => { setZoom(1); setPan(0); }} className="premium-focus rounded-full border border-line bg-white px-4 py-2 text-sm font-bold">Reset</button>
        </div>
        <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-white p-3 sm:p-6">
          <svg viewBox="0 0 800 430" className="w-full select-none" role="img" aria-label="Interactive beam, shear force, and bending moment diagram">
            <g style={{ transform: `translateX(${pan}px) scale(${zoom})`, transformOrigin: '400px 215px', transition: 'transform 220ms ease' } as CSSProperties}>
              <g opacity={focus === 'load' ? 1 : .36} onMouseEnter={() => setFocus('load')}>
                <text x="34" y="35" className="fill-slate-copy text-[14px] font-bold">LOAD MODEL</text>
                <line x1="90" y1="105" x2="710" y2="105" stroke="#15161a" strokeWidth="10" />
                <path d="M90 112 L66 150 L114 150 Z M710 112 L686 150 L734 150 Z" fill="#DFAE00" />
                <path d="M400 42 V88 M386 72 L400 88 L414 72" stroke="#9e1b32" strokeWidth="6" fill="none" />
                <text x="414" y="62" className="fill-cardinal text-[14px] font-bold">12 kN</text>
              </g>
              <g opacity={focus === 'shear' ? 1 : .32} onMouseEnter={() => setFocus('shear')}>
                <text x="34" y="205" className="fill-slate-copy text-[14px] font-bold">SHEAR FORCE</text>
                <line x1="90" y1="250" x2="710" y2="250" stroke="#cbd1dc" strokeWidth="2" />
                <path d="M90 250 V215 H400 V285 H710 V250" stroke="#DFAE00" strokeWidth="7" fill="rgba(245,196,0,.14)" className="diagram-draw" pathLength="1" />
                <text x="110" y="208" className="fill-companion text-[13px] font-bold">+6 kN</text><text x="620" y="305" className="fill-companion text-[13px] font-bold">-6 kN</text>
              </g>
              <g opacity={focus === 'moment' ? 1 : .32} onMouseEnter={() => setFocus('moment')}>
                <text x="34" y="338" className="fill-slate-copy text-[14px] font-bold">BENDING MOMENT</text>
                <line x1="90" y1="370" x2="710" y2="370" stroke="#cbd1dc" strokeWidth="2" />
                <path d="M90 370 Q400 245 710 370" stroke="#DFAE00" strokeWidth="8" fill="rgba(223,174,0,.10)" className="diagram-draw" pathLength="1" />
                <circle cx="400" cy="307" r="10" fill="#9e1b32" className="diagram-pulse" /><text x="418" y="307" className="fill-cardinal text-[13px] font-bold">Mmax</text>
              </g>
            </g>
          </svg>
        </div>
        <label className="mt-4 flex items-center gap-3 text-xs font-bold text-slate-copy">Pan across span<input type="range" min="-90" max="90" value={pan} onChange={(event) => setPan(Number(event.target.value))} className="min-w-0 flex-1 accent-companion" /></label>
      </div>
      <aside className="border-t border-line bg-white p-6 lg:border-l lg:border-t-0">
        <p className="font-mono text-[10px] font-bold uppercase text-companion">Focused relationship</p>
        <h4 className="mt-3 font-display text-xl font-bold capitalize">{focus}</h4>
        <p className="mt-3 text-sm leading-7 text-slate-copy">{descriptions[focus]}</p>
        <div className="mt-6 space-y-3 border-t border-line pt-5">
          <p className="text-xs font-bold text-slate-soft">Zoom {Math.round(zoom * 100)}%</p>
          <p className="rounded-xl bg-paper p-3 text-xs leading-5 text-slate-copy">Hover over any diagram band or use the layer controls. The same load position aligns vertically across all three representations.</p>
        </div>
      </aside>
    </div>
  );
}

function MediaButton({
  label,
  onClick,
  children,
  active,
  preferPointerActivation = false,
}: {
  label: string;
  onClick: () => void | Promise<void>;
  children: React.ReactNode;
  active?: boolean;
  preferPointerActivation?: boolean;
}) {
  const pointerHandledRef = useRef(false);
  const activate = () => {
    void onClick();
  };
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onPointerDown={
        preferPointerActivation
          ? () => {
              pointerHandledRef.current = true;
              activate();
            }
          : undefined
      }
      onClick={() => {
        if (pointerHandledRef.current) {
          pointerHandledRef.current = false;
          return;
        }
        activate();
      }}
      className={cn('premium-focus inline-flex min-h-10 items-center justify-center gap-2 rounded-full border px-3 text-xs font-bold outline-none transition focus-visible:ring-2 focus-visible:ring-ai-cyan/70', active ? 'border-ai-cyan/45 bg-ai-cyan/14 text-ai-cyan' : 'border-white/12 bg-white/[0.07] text-mist hover:bg-white/[0.12]')}
    >
      {children}
    </button>
  );
}

function MediaPreviewUnavailable({ kind }: { kind: 'video' | 'podcast' }) {
  const isVideo = kind === 'video';
  const storyboard = [
    ['1', 'Resolve reactions', 'Start with equilibrium so the internal diagrams have a defensible load path.'],
    ['2', 'Trace shear', 'Mark positive and negative shear regions before drawing moment.'],
    ['3', 'Build moment', 'Use signed shear area to explain why the curve rises or falls.'],
    ['4', 'Interpret demand', 'Connect the peak moment to structural capacity and material efficiency.'],
  ];

  return (
    <div className="min-h-[520px] bg-night p-6 text-mist sm:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <Badge tone="warning">Interactive media preview - full playback temporarily unavailable</Badge>
            <h3 className="mt-4 font-display text-2xl font-bold">{isVideo ? 'Video lesson preview' : 'Podcast preview'}</h3>
            <p className="mt-3 text-sm leading-7 text-mist-muted">
              This checkpoint keeps the media experience honest while playback is repaired later. The learning method remains available through transcript, storyboard, diagram, and step-by-step alternatives.
            </p>
          </div>
          <span className="grid h-12 w-12 place-items-center rounded-2xl border border-ai-cyan/25 bg-ai-cyan/10 text-ai-cyan">
            {isVideo ? <Play size={22} /> : <Headphones size={22} />}
          </span>
        </div>

        <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.045] p-5">
          <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ai-cyan">Lesson summary</p>
              <h4 className="mt-2 font-display text-xl font-bold">Where bending moment reaches its peak</h4>
              <p className="mt-3 text-sm leading-7 text-mist-muted">
                Moment changes according to the signed area under the shear force diagram. Positive shear raises the moment diagram, negative shear lowers it, and an interior sign change through zero often identifies the peak bending demand.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {storyboard.map(([step, title, text]) => (
                  <div key={title} className="rounded-xl border border-white/10 bg-night-panel p-4">
                    <span className="font-mono text-[10px] font-bold text-ai-cyan">STEP {step}</span>
                    <p className="mt-2 text-sm font-bold text-mist">{title}</p>
                    <p className="mt-1 text-xs leading-5 text-mist-muted">{text}</p>
                  </div>
                ))}
              </div>
            </div>
            <aside className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ai-cyan">Transcript excerpt</p>
              <div className="mt-4 space-y-3">
                {fieldNoteTranscript.slice(0, 4).map((line) => (
                  <div key={line.start} className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                    <p className="font-mono text-[10px] text-ai-cyan">{formatTime(line.start)}</p>
                    <p className="mt-1 text-sm leading-6 text-mist-muted">{line.text}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

function Timeline({ controller, label }: { controller: MediaController; label: string }) {
  return (
    <div className="space-y-2">
      <input aria-label={label} type="range" min="0" max={controller.duration || 0} step="0.05" value={Math.min(controller.currentTime, controller.duration || 0)} onChange={(event) => controller.seek(Number(event.target.value))} className="media-range w-full accent-ai-cyan" />
      <div className="flex justify-between font-mono text-[11px] text-mist-muted"><span>{formatTime(controller.currentTime)}</span><span>{formatTime(controller.duration)}</span></div>
    </div>
  );
}

function VideoExperience({ generatedVideo, onSelect }: { generatedVideo: LessonVideoState; onSelect: (method: LearningMethod) => void }) {
  if (MEDIA_PREVIEW_ONLY) return <MediaPreviewUnavailable kind="video" />;

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const controller = useMediaController(videoRef, 'civl301-video-position');
  const [captions, setCaptions] = useState(true);
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [notes, setNotes] = useState(() => window.localStorage.getItem('civl301-video-notes') ?? '');
  const [bookmarks, setBookmarks] = useState(() => readStoredList('civl301-video-bookmarks'));
  const [captionUrl, setCaptionUrl] = useState('');
  const chapters = LESSON_VIDEO_CHAPTERS.map(({ at, label }) => ({ at, label }));

  useEffect(() => {
    const vtt = [
      'WEBVTT',
      '',
      '00:00:00.000 --> 00:00:02.000',
      'A simply supported beam with pin and roller supports.',
      '',
      '00:00:02.000 --> 00:00:04.000',
      'A 12 kN point load is applied at midspan.',
      '',
      '00:00:04.000 --> 00:00:06.000',
      'Equilibrium gives RA = RB = 6 kN upward.',
      '',
      '00:00:06.000 --> 00:00:08.000',
      'Track shear discontinuities from left to right.',
      '',
      '00:00:08.000 --> 00:00:10.000',
      'Shear is +6 kN left of load, minus 6 kN right of load.',
      '',
      '00:00:10.000 --> 00:00:12.000',
      'Signed shear area controls the change in moment.',
      '',
      '00:00:12.000 --> 00:00:14.000',
      'Moment rises under positive shear, falls under negative.',
      '',
      '00:00:14.000 --> 00:00:16.000',
      'Zero shear marks peak moment — the critical design section.',
    ].join('\n');
    const url = URL.createObjectURL(new Blob([vtt], { type: 'text/vtt' }));
    setCaptionUrl(url);
    return () => URL.revokeObjectURL(url);
  }, []);

  useEffect(() => {
    const track = videoRef.current?.textTracks[0];
    if (track) track.mode = captions ? 'showing' : 'hidden';
  }, [captions, captionUrl]);

  const saveNotes = (value: string) => {
    setNotes(value);
    window.localStorage.setItem('civl301-video-notes', value);
  };
  const addBookmark = () => {
    const next = Array.from(new Set([...bookmarks, Math.round(controller.currentTime)])).sort((a, b) => a - b);
    setBookmarks(next);
    window.localStorage.setItem('civl301-video-bookmarks', JSON.stringify(next));
  };
  const fullscreen = async () => {
    if (!document.fullscreenElement) await playerRef.current?.requestFullscreen();
    else await document.exitFullscreen();
  };
  const pictureInPicture = async () => {
    const video = videoRef.current as HTMLVideoElement & { requestPictureInPicture?: () => Promise<PictureInPictureWindow> };
    if (document.pictureInPictureElement) await document.exitPictureInPicture();
    else if (video?.requestPictureInPicture) await video.requestPictureInPicture();
  };

  if (!generatedVideo.url) {
    return (
      <VideoPreparationState
        status={generatedVideo.status}
        error={generatedVideo.error}
        notes={notes}
        onSaveNotes={saveNotes}
        onRetry={generatedVideo.retry}
        onSelect={onSelect}
      />
    );
  }

  const activeChapter = [...chapters].reverse().find((chapter) => controller.currentTime >= chapter.at) ?? chapters[0];
  return (
    <div className="bg-night text-mist">
      <div ref={playerRef} className="relative bg-black">
        <video ref={videoRef} src={generatedVideo.url} preload="metadata" playsInline className="aspect-video w-full bg-black object-contain" {...controller.mediaEvents}>
          {captionUrl && <track kind="captions" src={captionUrl} srcLang="en" label="English" default />}
        </video>
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between bg-gradient-to-b from-black/70 to-transparent p-4">
          <div><p className="font-mono text-[10px] font-bold text-ai-cyan">CIVL301 VIDEO LESSON</p><p className="mt-1 text-sm font-bold">{activeChapter?.label ?? 'Video lesson'}</p></div>
          {controller.complete && <span className="rounded-full bg-success px-3 py-1 text-xs font-bold text-white">Complete</span>}
        </div>
        {controller.buffering && <div className="pointer-events-none absolute inset-0 grid place-items-center bg-black/35"><LoadingPill label="Buffering video" /></div>}
      </div>
      <div className="border-t border-white/10 p-5">
        <Timeline controller={controller} label="Video timeline" />
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <MediaButton label={controller.playing ? 'Pause video' : 'Play video'} onClick={controller.togglePlayback} preferPointerActivation>{controller.playing ? <Pause size={15} /> : <Play size={15} />}{controller.playing ? 'Pause' : 'Play'}</MediaButton>
          <MediaButton label="Restart video" onClick={() => controller.seek(0)}><RefreshCcw size={15} /></MediaButton>
          <MediaButton label={controller.muted ? 'Unmute video' : 'Mute video'} onClick={controller.toggleMuted} active={controller.muted}>{controller.muted ? <VolumeX size={15} /> : <Volume2 size={15} />}</MediaButton>
          <label className="flex min-h-10 items-center gap-2 rounded-full border border-white/12 bg-white/[0.07] px-3 text-xs font-bold"><span className="sr-only">Video volume</span><input aria-label="Video volume" type="range" min="0" max="1" step=".05" value={controller.muted ? 0 : controller.volume} onChange={(event) => controller.setVolume(Number(event.target.value))} className="w-20 accent-ai-cyan" /></label>
          <select aria-label="Video playback speed" value={controller.rate} onChange={(event) => controller.setRate(Number(event.target.value))} className="min-h-10 rounded-full border border-white/12 bg-night-panel px-3 text-xs font-bold text-mist"><option value="0.75">0.75x</option><option value="1">1x</option><option value="1.25">1.25x</option><option value="1.5">1.5x</option><option value="2">2x</option></select>
          <MediaButton label={captions ? 'Hide captions' : 'Show captions'} onClick={() => setCaptions((value) => !value)} active={captions}><Captions size={15} />CC</MediaButton>
          <MediaButton label="Toggle transcript" onClick={() => setTranscriptOpen((value) => !value)} active={transcriptOpen}><FileText size={15} />Transcript</MediaButton>
          <MediaButton label="Bookmark current video time" onClick={addBookmark}><Bookmark size={15} />Bookmark</MediaButton>
          <span className="flex-1" />
          {'pictureInPictureEnabled' in document && <MediaButton label="Picture in picture" onClick={pictureInPicture}><PictureInPicture size={15} /></MediaButton>}
          <MediaButton label="Toggle fullscreen" onClick={fullscreen}><Expand size={15} /></MediaButton>
        </div>
        <p role="status" aria-live="polite" className={cn('mt-3 text-xs leading-5', controller.error ? 'text-warn' : 'text-mist-muted')}>
          {controller.error || (controller.playing ? 'Video is playing. Progress is based on native media time.' : 'Video ready. Use Play, timeline, captions, and notes while studying.')}
        </p>
      </div>
      <div className="grid border-t border-white/10 lg:grid-cols-[1fr_340px]">
        <div className="p-5">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ai-cyan">Chapters</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {chapters.map((chapter) => <button key={chapter.label} type="button" onClick={() => controller.seek(chapter.at)} className={cn('rounded-xl border p-3 text-left transition', activeChapter.label === chapter.label ? 'border-ai-cyan/40 bg-ai-cyan/10' : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.08]')}><span className="font-mono text-[10px] text-ai-cyan">{formatTime(chapter.at)}</span><span className="mt-1 block text-sm font-bold">{chapter.label}</span></button>)}
          </div>
          {bookmarks.length > 0 && <div className="mt-5"><p className="text-xs font-bold text-mist-muted">Saved timestamps</p><div className="mt-2 flex flex-wrap gap-2">{bookmarks.map((time) => <button key={time} type="button" onClick={() => controller.seek(time)} className="rounded-full border border-white/10 px-3 py-1 font-mono text-xs hover:border-ai-cyan/40">{formatTime(time)}</button>)}</div></div>}
          {transcriptOpen && <div className="mt-5 space-y-2" aria-label="Video transcript">{chapters.map((chapter, index) => { const transcripts = ['A simply supported beam with pin and roller supports.', 'A 12 kN point load is applied at midspan.', 'Equilibrium gives RA = RB = 6 kN upward.', 'Track shear discontinuities from left to right.', 'Shear is +6 kN left of load, −6 kN right of load.', 'Signed shear area controls the change in moment.', 'Moment rises under positive shear, falls under negative.', 'Zero shear marks peak moment — the critical design section.']; return <button key={chapter.label} type="button" onClick={() => controller.seek(chapter.at)} className={cn('block w-full rounded-lg px-3 py-2 text-left text-sm leading-6', activeChapter.label === chapter.label ? 'bg-ai-cyan/10 text-mist' : 'text-mist-muted hover:bg-white/[0.05]')}><span className="mr-3 font-mono text-[10px] text-ai-cyan">{formatTime(chapter.at)}</span>{transcripts[index]}</button>; })}</div>}
        </div>
        <aside className="border-t border-white/10 p-5 lg:border-l lg:border-t-0"><label htmlFor="video-notes" className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ai-cyan">Notes while watching</label><textarea id="video-notes" value={notes} onChange={(event) => saveNotes(event.target.value)} placeholder="Capture a relationship, question, or timestamp..." className="mt-3 min-h-36 w-full rounded-xl border border-white/10 bg-white/[0.05] p-3 text-sm leading-6 text-mist outline-none placeholder:text-mist-muted focus:border-ai-cyan/55 focus:ring-2 focus:ring-ai-cyan/20" /><p className="mt-2 text-xs text-mist-muted">Saved automatically on this device.</p></aside>
      </div>
    </div>
  );
}

function VideoPreparationState({
  status,
  error,
  notes,
  onSaveNotes,
  onRetry,
  onSelect,
}: {
  status: LessonVideoStatus;
  error: string;
  notes: string;
  onSaveNotes: (value: string) => void;
  onRetry: () => void;
  onSelect: (method: LearningMethod) => void;
}) {
  const failed = status === 'failed';
  const statusText =
    status === 'checking-cache'
      ? 'Checking for a saved video version. You can start with the lesson summary and transcript now.'
      : status === 'loading-cached'
        ? 'Loading the saved video version. The lesson content is ready while the player prepares.'
        : status === 'preparing'
          ? 'Preparing the video version. You can start with the lesson summary and transcript now.'
          : failed
            ? error || 'The browser could not prepare the video. The transcript, storyboard, and alternative modes remain available.'
            : 'Preparing the video version. You can start with the lesson summary and transcript now.';

  return (
    <div className="min-h-[520px] bg-night text-mist">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="p-5 sm:p-7">
          <div className="rounded-2xl border border-ai-cyan/20 bg-white/[0.045] p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-2xl">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ai-cyan">
                  {failed ? 'Video fallback available' : 'Video lesson preparing'}
                </p>
                <h3 className="mt-2 font-display text-2xl font-bold">Bending moment diagrams in eight scenes</h3>
                <p role="status" aria-live="polite" className="mt-2 text-sm leading-6 text-mist-muted">{statusText}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {!failed && <LoadingPill label={status === 'checking-cache' ? 'Checking saved media' : 'Preparing video'} />}
                {failed && <Button variant="secondary" size="sm" onClick={onRetry}><RefreshCcw size={14} />Retry video</Button>}
              </div>
            </div>

            <svg viewBox="0 0 700 220" className="mt-5 w-full rounded-2xl border border-white/10 bg-black/20" role="img" aria-label="Storyboard preview showing beam load, shear force, and bending moment">
              <line x1="60" y1="65" x2="640" y2="65" stroke="#f7f4ee" strokeWidth="7" />
              <path d="M60 70 L42 100 L78 100 Z M640 70 L622 100 L658 100 Z" fill="#F5C400" opacity=".9" />
              <path d="M350 18 V58 M338 44 L350 58 L362 44" stroke="#FFF5C2" strokeWidth="4" fill="none" />
              <text x="366" y="38" fill="#FFF5C2" fontSize="12" fontWeight="600">12 kN</text>
              <line x1="60" y1="130" x2="640" y2="130" stroke="#475569" strokeWidth="1" />
              <path d="M60 130 V106 H350 V154 H640 V130" stroke="#4F7A5A" strokeWidth="4" fill="none" />
              <path d="M60 196 Q350 136 640 196" stroke="#DFAE00" strokeWidth="5" fill="none" />
              <circle cx="350" cy="166" r="6" fill="#9C4A46" />
              <text x="362" y="170" fill="#9C4A46" fontSize="11" fontWeight="700">Mmax</text>
            </svg>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {LESSON_VIDEO_CHAPTERS.map((chapter) => (
                <div key={chapter.label} className="rounded-xl border border-white/10 bg-night-panel p-3">
                  <p className="font-mono text-[10px] font-bold text-ai-cyan">{formatTime(chapter.at)}</p>
                  <p className="mt-1 text-xs font-bold">{chapter.label}</p>
                  <p className="mt-1 text-[11px] leading-4 text-mist-muted">{chapter.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ai-cyan">Working alternatives</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  ['diagram', 'Visual explanation'],
                  ['steps', 'Step-by-step'],
                  ['podcast', 'Podcast'],
                  ['simple', 'Simple explanation'],
                ].map(([method, label]) => (
                  <button key={method} type="button" onClick={() => onSelect(method as LearningMethod)} className="premium-focus rounded-full border border-white/12 bg-white/[0.07] px-3 py-2 text-xs font-bold text-mist outline-none transition hover:border-ai-cyan/45 hover:bg-white/[0.12]">
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside className="border-t border-white/10 p-5 lg:border-l lg:border-t-0">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ai-cyan">Transcript</p>
          <div className="mt-3 space-y-2">
            {LESSON_VIDEO_CHAPTERS.slice(0, 5).map((chapter) => (
              <div key={chapter.label} className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                <p className="font-mono text-[10px] text-ai-cyan">{formatTime(chapter.at)} {chapter.label}</p>
                <p className="mt-1 text-xs leading-5 text-mist-muted">{chapter.text}</p>
              </div>
            ))}
          </div>
          <label htmlFor="video-prep-notes" className="mt-5 block text-xs font-bold uppercase text-ai-cyan">Notes while preparing</label>
          <textarea id="video-prep-notes" value={notes} onChange={(event) => onSaveNotes(event.target.value)} className="mt-2 min-h-28 w-full rounded-xl border border-white/10 bg-white/[0.05] p-3 text-sm leading-6 text-mist outline-none placeholder:text-mist-muted focus:border-ai-cyan/55 focus:ring-2 focus:ring-ai-cyan/20" placeholder="Capture a relationship, question, or timestamp..." />
          <p className="mt-2 text-xs text-mist-muted">Saved automatically on this device.</p>
        </aside>
      </div>
    </div>
  );
}

function VideoFallback({ message }: { message: string }) {
  const chapters = [
    ['0:00', 'Beam and supports', 'A simply supported beam with pin and roller supports.'],
    ['0:04', 'Applied load', 'A 12 kN point load is applied at midspan.'],
    ['0:08', 'Reaction forces', 'Equilibrium gives RA = RB = 6 kN upward.'],
    ['0:12', 'Shear construction', 'Track shear discontinuities from left to right.'],
    ['0:16', 'Positive and negative shear', 'Shear is +6 kN left of load, \u22126 kN right of load.'],
    ['0:20', 'Signed-area relationship', 'Signed shear area controls the change in moment.'],
    ['0:24', 'Moment diagram', 'Moment rises under positive shear, falls under negative.'],
    ['0:28', 'Peak moment and design', 'Zero shear marks peak moment \u2014 the critical design section.'],
  ];
  return (
    <div className="min-h-[520px] bg-night text-mist">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="p-6 sm:p-8">
          <div className="rounded-2xl border border-ai-cyan/20 bg-white/[0.045] p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ai-cyan">Video lesson \u2014 storyboard mode</p>
                <h3 className="mt-2 font-display text-2xl font-bold">Study with the storyboard while the video is unavailable</h3>
                <p role="status" className="mt-2 max-w-2xl text-sm leading-6 text-mist-muted">{message}</p>
              </div>
              <Badge tone="ai">Study with storyboard</Badge>
            </div>
            <svg viewBox="0 0 700 200" className="mt-5 w-full" role="img" aria-label="Beam diagram with load, shear, and bending moment">
              <line x1="60" y1="55" x2="640" y2="55" stroke="#f7f4ee" strokeWidth="7" />
              <path d="M60 60 L42 90 L78 90 Z M640 60 L622 90 L658 90 Z" fill="#F5C400" opacity=".9" />
              <path d="M350 10 V48 M338 34 L350 48 L362 34" stroke="#FFF5C2" strokeWidth="4" fill="none" />
              <text x="366" y="30" fill="#FFF5C2" fontSize="12" fontWeight="600">12 kN</text>
              <line x1="60" y1="120" x2="640" y2="120" stroke="#475569" strokeWidth="1" />
              <path d="M60 120 V96 H350 V144 H640 V120" stroke="#4F7A5A" strokeWidth="4" fill="none" />
              <text x="70" y="92" fill="#4F7A5A" fontSize="11" fontWeight="600">+6 kN</text>
              <text x="580" y="160" fill="#9C4A46" fontSize="11" fontWeight="600">\u22126 kN</text>
              <path d="M60 190 Q350 130 640 190" stroke="#DFAE00" strokeWidth="5" fill="none" />
              <circle cx="350" cy="160" r="6" fill="#9C4A46" />
              <text x="362" y="164" fill="#9C4A46" fontSize="11" fontWeight="700">Mmax</text>
            </svg>
            <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {chapters.map(([time, title, text]) => (
                <div key={title} className="rounded-xl border border-white/10 bg-night-panel p-3">
                  <p className="font-mono text-[10px] font-bold text-ai-cyan">{time}</p>
                  <p className="mt-1 text-xs font-bold">{title}</p>
                  <p className="mt-1 text-[11px] leading-4 text-mist-muted">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <aside className="border-t border-white/10 p-6 lg:border-l lg:border-t-0">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ai-cyan">Key relationships</p>
          <div className="mt-4 space-y-3">
            {[
              ['Shear \u2192 Moment', 'dM/dx = V. The slope of the moment diagram equals the shear force.'],
              ['Area \u2192 Change', '\u0394M equals the signed area under the shear diagram between two points.'],
              ['Zero shear \u2192 Peak', 'Where V = 0, M has a stationary point \u2014 often the design-critical maximum.'],
            ].map(([title, text]) => (
              <div key={title} className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                <p className="text-xs font-bold text-ai-cyan">{title}</p>
                <p className="mt-1 text-[11px] leading-5 text-mist-muted">{text}</p>
              </div>
            ))}
          </div>
          <label htmlFor="video-fallback-notes" className="mt-5 block text-xs font-bold uppercase text-ai-cyan">Study note</label>
          <textarea id="video-fallback-notes" className="mt-2 min-h-28 w-full rounded-xl border border-white/10 bg-white/[0.05] p-3 text-sm text-mist outline-none focus:border-ai-cyan/55" placeholder="Write what you would ask after watching this chapter." />
        </aside>
      </div>
    </div>
  );
}

function PodcastExperience() {
  if (MEDIA_PREVIEW_ONLY) return <MediaPreviewUnavailable kind="podcast" />;

  const audioRef = useRef<HTMLAudioElement>(null);
  const controller = useMediaController(audioRef, 'civl301-podcast-position');
  const [bookmarks, setBookmarks] = useState(() => readStoredList('civl301-podcast-bookmarks'));
  const chapters = [
    { at: 0, label: 'Shear and signed area' },
    { at: 7, label: 'Direction of accumulation' },
    { at: 13.5, label: 'Rate of change' },
    { at: 20, label: 'Zero-shear turning point' },
    { at: 27, label: 'Sign convention check' },
    { at: 34, label: 'Central load example' },
    { at: 41, label: 'Design implication' },
    { at: 48, label: 'Sketch and reflect' },
  ];
  const activeTranscript = fieldNoteTranscript.find((line) => controller.currentTime >= line.start && controller.currentTime < line.end) ?? fieldNoteTranscript[fieldNoteTranscript.length - 1];
  const activeChapter = [...chapters].reverse().find((ch) => controller.currentTime >= ch.at) ?? chapters[0];
  const addBookmark = () => {
    const next = Array.from(new Set([...bookmarks, Math.round(controller.currentTime)])).sort((a, b) => a - b);
    setBookmarks(next);
    window.localStorage.setItem('civl301-podcast-bookmarks', JSON.stringify(next));
  };
  const downloadTranscript = () => {
    const blob = new Blob([`CIVL301 Audio Field Note\n\n${fieldNoteTranscript.map((line) => `${formatTime(line.start)}  ${line.text}`).join('\n\n')}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'CIVL301-bending-moment-field-note-transcript.txt';
    anchor.click();
    URL.revokeObjectURL(url);
  };
  const progress = controller.duration ? controller.currentTime / controller.duration : 0;

  return (
    <div className="min-h-[520px] bg-night text-mist">
      <audio ref={audioRef} src={podcastUrl} preload="metadata" {...controller.mediaEvents} />
      <div className="grid lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="border-b border-white/10 bg-night-soft p-6 lg:border-b-0 lg:border-r">
          <div className="aspect-square rounded-2xl border border-companion/25 bg-night p-6 shadow-sm">
            <div className="flex h-full flex-col justify-between"><span className="grid h-12 w-12 place-items-center rounded-full bg-ai-cyan text-night"><Headphones size={22} /></span><div><p className="font-mono text-[10px] font-bold text-ai-cyan">STRUCTURAL FIELD NOTE 04</p><h3 className="mt-2 font-display text-2xl font-bold">Where moment reaches its peak</h3><p className="mt-2 text-sm text-mist-muted">Dr Avery Tan / CIVL301</p></div></div>
          </div>
          <p className="mt-5 text-xs leading-5 text-mist-muted">Prerecorded narration (22 kHz WAV). Listening position and bookmarks are stored on this device.</p>
        </aside>
        <div className="min-w-0 p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ai-cyan">Audio field note</p><h3 className="mt-2 font-display text-2xl font-bold">Listen, follow, and capture the idea</h3></div>{readStoredNumber('civl301-podcast-position') > 1 && <Badge tone="ai">Continue listening</Badge>}</div>

          {/* Segmented chapter timeline */}
          <div className="mt-7 rounded-xl border border-white/10 bg-black/20 p-4">
            <div className="flex items-center gap-2 text-[10px] font-bold text-mist-muted">
              <span className="font-mono text-ai-cyan">{formatTime(controller.currentTime)}</span>
              <span className="flex-1">
                <span className="block text-xs font-bold text-mist">{activeChapter.label}</span>
              </span>
              <span className="font-mono">{formatTime(controller.duration)}</span>
            </div>
            <div className="mt-3 flex gap-[3px]" role="group" aria-label="Chapter progress">
              {chapters.map((ch, i) => {
                const nextAt = chapters[i + 1]?.at ?? controller.duration;
                const chDur = nextAt - ch.at;
                const chProgress = controller.currentTime <= ch.at ? 0 : Math.min(1, (controller.currentTime - ch.at) / (chDur || 1));
                return (
                  <button
                    key={ch.label}
                    type="button"
                    onClick={() => controller.seek(ch.at)}
                    aria-label={`${ch.label} at ${formatTime(ch.at)}`}
                    className="group relative min-h-[28px] flex-1 overflow-hidden rounded-md bg-white/[0.08] transition hover:bg-white/[0.14]"
                  >
                    <span
                      className="absolute inset-y-0 left-0 rounded-md bg-ai-cyan/60 transition-all duration-200"
                      style={{ width: `${chProgress * 100}%` }}
                    />
                    <span className="relative z-10 block truncate px-1 py-1 text-center text-[9px] font-bold text-mist/70 group-hover:text-mist">
                      {i + 1}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4"><Timeline controller={controller} label="Podcast seek bar" /></div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <MediaButton label="Skip back 10 seconds" onClick={() => controller.seek(controller.currentTime - 10)}><Rewind size={15} />10</MediaButton>
            <MediaButton label={controller.playing ? 'Pause podcast' : 'Play podcast'} onClick={controller.togglePlayback} preferPointerActivation>{controller.playing ? <Pause size={17} /> : <Play size={17} />}{controller.playing ? 'Pause' : 'Play'}</MediaButton>
            <MediaButton label="Skip forward 10 seconds" onClick={() => controller.seek(controller.currentTime + 10)}>10<FastForward size={15} /></MediaButton>
            <MediaButton label={controller.muted ? 'Unmute podcast' : 'Mute podcast'} onClick={controller.toggleMuted} active={controller.muted}>{controller.muted ? <VolumeX size={15} /> : <Volume2 size={15} />}</MediaButton>
            <label className="flex min-h-10 items-center gap-2 rounded-full border border-white/12 bg-white/[0.07] px-3 text-xs font-bold"><span className="sr-only">Podcast volume</span><input aria-label="Podcast volume" type="range" min="0" max="1" step=".05" value={controller.muted ? 0 : controller.volume} onChange={(event) => controller.setVolume(Number(event.target.value))} className="w-16 accent-ai-cyan" /></label>
            <select aria-label="Podcast playback speed" value={controller.rate} onChange={(event) => controller.setRate(Number(event.target.value))} className="min-h-10 rounded-full border border-white/12 bg-night-panel px-3 text-xs font-bold text-mist"><option value="0.75">0.75x</option><option value="1">1x</option><option value="1.25">1.25x</option><option value="1.5">1.5x</option><option value="2">2x</option></select>
            <MediaButton label="Bookmark current podcast position" onClick={addBookmark}><Bookmark size={15} />Bookmark</MediaButton>
            <MediaButton label="Download podcast transcript" onClick={downloadTranscript}><Download size={15} />Transcript</MediaButton>
          </div>
          <p role="status" aria-live="polite" className={cn('mt-3 text-xs leading-5', controller.error ? 'text-warn' : 'text-mist-muted')}>
            {controller.error || (controller.playing ? 'Podcast is playing. Transcript highlight follows native audio time.' : 'Podcast ready. Use Play, skip, speed, transcript, and bookmarks while studying.')}
          </p>
          {controller.buffering && <div className="mt-4"><LoadingPill label="Buffering audio" /></div>}
          <div className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1fr)_250px]">
            <div><p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ai-cyan">Synced transcript</p><div className="mt-3 space-y-2">{fieldNoteTranscript.map((line) => <button key={line.start} type="button" onClick={() => controller.seek(line.start)} className={cn('block w-full rounded-xl border p-3 text-left transition', activeTranscript.start === line.start ? 'border-ai-cyan/40 bg-ai-cyan/10 text-mist' : 'border-transparent text-mist-muted hover:border-white/10 hover:bg-white/[0.04]')}><span className="mr-3 font-mono text-[10px] text-ai-cyan">{formatTime(line.start)}</span><span className="text-sm leading-6">{line.text}</span></button>)}</div></div>
            <aside><p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ai-cyan">Chapters</p><div className="mt-3 space-y-2">{chapters.map((chapter) => <button key={chapter.label} type="button" onClick={() => controller.seek(chapter.at)} className={cn('flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-xs font-bold transition', activeChapter.label === chapter.label ? 'border-ai-cyan/40 bg-ai-cyan/10' : 'border-white/10 bg-white/[0.04] hover:border-ai-cyan/35')}><span>{chapter.label}</span><span className="font-mono text-ai-cyan">{formatTime(chapter.at)}</span></button>)}</div>{bookmarks.length > 0 && <div className="mt-5"><p className="text-xs font-bold text-mist-muted">Bookmarks</p><div className="mt-2 flex flex-wrap gap-2">{bookmarks.map((time) => <button key={time} type="button" onClick={() => controller.seek(time)} className="rounded-full border border-white/10 px-2 py-1 font-mono text-[10px] hover:border-ai-cyan/40">{formatTime(time)}</button>)}</div></div>}</aside>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComicExperience() {
  const panels = [
    { scene: 'The brief', speaker: 'Maya, student engineer', speech: 'The load moved. Which part of my diagram changes first?', caption: 'A design review begins with the load path, not the final curve.', tone: 'bg-paper' },
    { scene: 'The check', speaker: 'Studio tutor', speech: 'Recalculate reactions, then follow the shear jumps from left to right.', caption: 'Shear provides the direction of moment change.', tone: 'bg-companion-tint' },
    { scene: 'The connection', speaker: 'Maya', speech: 'So the moment peak moves to where shear crosses zero?', caption: 'The student connects the two diagrams rather than memorising a shape.', tone: 'bg-success-tint' },
    { scene: 'The decision', speaker: 'Studio tutor', speech: 'Yes. Now verify the sign convention and explain what that means for bending demand.', caption: 'Engineering judgement follows the mathematical relationship.', tone: 'bg-danger-tint' },
  ];
  const [panel, setPanel] = useState(0);
  const move = (direction: number) => setPanel((value) => Math.max(0, Math.min(panels.length - 1, value + direction)));
  return (
    <div className="p-6 sm:p-8" tabIndex={0} onKeyDown={(event) => { if (event.key === 'ArrowRight') move(1); if (event.key === 'ArrowLeft') move(-1); }} aria-label="Visual story. Use left and right arrow keys to change panels.">
      <ExperienceHeader eyebrow="Sequential visual story" title="A design conversation, one decision at a time" description="Use Previous and Next, or the left and right arrow keys, to move through the scenario." action={<span className="font-mono text-xs font-bold text-slate-soft">{panel + 1} / {panels.length}</span>} />
      <div className={cn('relative mt-7 min-h-[350px] overflow-hidden rounded-2xl border border-line p-6 transition-colors duration-500 sm:p-10', panels[panel].tone)}>
        <div className="absolute right-6 top-6 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-slate-copy">Panel {panel + 1}: {panels[panel].scene}</div>
        <svg viewBox="0 0 600 210" className="mx-auto mt-8 max-w-2xl" aria-hidden="true"><line x1="70" y1="150" x2="530" y2="150" stroke="#15161a" strokeWidth="12" /><path d="M70 157 L45 200 L95 200 Z M530 157 L505 200 L555 200 Z" fill="#DFAE00" /><path d="M300 45 V130 M282 110 L300 130 L318 110" stroke="#9e1b32" strokeWidth="8" fill="none" /></svg>
        <div className="comic-bubble mx-auto mt-2 max-w-xl rounded-2xl border-2 border-ink bg-white p-5 shadow-[8px_8px_0_#15161a]"><p className="text-xs font-bold uppercase text-companion">{panels[panel].speaker}</p><p className="mt-2 font-display text-xl font-bold leading-8 text-ink">"{panels[panel].speech}"</p></div>
        <p className="mx-auto mt-8 max-w-2xl text-center text-sm font-semibold leading-6 text-slate-copy">{panels[panel].caption}</p>
      </div>
      <div className="mt-5 flex items-center justify-between"><Button variant="secondary" onClick={() => move(-1)} disabled={panel === 0}><ChevronLeft size={16} />Previous</Button><div className="flex gap-2">{panels.map((item, index) => <button key={item.scene} type="button" aria-label={`Go to panel ${index + 1}`} aria-current={panel === index ? 'step' : undefined} onClick={() => setPanel(index)} className={cn('h-2.5 rounded-full transition-all', panel === index ? 'w-8 bg-companion' : 'w-2.5 bg-line')} />)}</div><Button onClick={() => move(1)} disabled={panel === panels.length - 1}>Next<ChevronRight size={16} /></Button></div>
    </div>
  );
}

function AnalogyExperience() {
  const [mode, setMode] = useState<'similarities' | 'limits' | 'formal'>('similarities');
  const content = {
    similarities: { title: 'Think of a changing bank balance', text: 'Shear behaves like the rate of deposits and withdrawals. Bending moment is the running balance. Positive shear adds to moment; negative shear subtracts from it.', points: ['Rate controls direction', 'Area controls total change', 'A zero rate marks a turning point'] },
    limits: { title: 'Where the analogy breaks', text: 'A beam is not storing money, and support reactions are not account deposits. The analogy only explains accumulation; it cannot replace equilibrium, units, or sign convention.', points: ['No physical banking process', 'Support conditions still govern', 'Engineering signs must be verified'] },
    formal: { title: 'Return to the engineering model', text: 'The precise relationship is dM/dx = V. Integrating shear over distance gives the change in moment between two positions.', points: ['V is the slope of M', 'Delta M equals integral V dx', 'V = 0 creates a stationary point'] },
  };
  return (
    <div className="p-6 sm:p-8">
      <ExperienceHeader eyebrow="Interactive comparison" title="Use the analogy, then test its limits" description="A good analogy supports the formal model. It never replaces it." />
      <div className="mt-7 grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <div className="space-y-2" role="tablist" aria-label="Analogy views">{(['similarities', 'limits', 'formal'] as const).map((item) => <button key={item} type="button" role="tab" aria-selected={mode === item} onClick={() => setMode(item)} className={cn('w-full rounded-xl border p-4 text-left text-sm font-bold capitalize transition', mode === item ? 'border-ink bg-ink text-white' : 'border-line bg-white hover:border-companion')}>{item === 'formal' ? 'Formal connection' : item}</button>)}</div>
        <div className="overflow-hidden rounded-2xl border border-line bg-paper">
          <div className="grid sm:grid-cols-2"><div className="border-b border-line p-6 sm:border-b-0 sm:border-r"><p className="font-mono text-[10px] font-bold uppercase text-companion">Everyday model</p><div className="mt-5 flex h-40 items-end gap-2">{[40, 58, 74, 90, 76, 56, 38].map((height, index) => <div key={index} className="flex-1 rounded-t-md bg-companion/80 transition-all duration-500" style={{ height: `${mode === 'limits' ? 52 : height}%` }} />)}</div><p className="mt-3 text-center text-sm font-bold">Running balance</p></div><div className="p-6"><p className="font-mono text-[10px] font-bold uppercase text-ai-violet">Engineering model</p><svg viewBox="0 0 300 170" className="mt-5 w-full" aria-hidden="true"><path d="M15 145 Q150 15 285 145" fill="none" stroke="#DFAE00" strokeWidth="8" className="diagram-draw" pathLength="1" /><line x1="15" y1="145" x2="285" y2="145" stroke="#cbd1dc" strokeWidth="2" /><circle cx="150" cy="80" r="9" fill="#9e1b32" /></svg><p className="mt-3 text-center text-sm font-bold">Moment accumulation</p></div></div>
          <div className="border-t border-line bg-white p-6"><h4 className="font-display text-xl font-bold">{content[mode].title}</h4><p className="mt-3 text-sm leading-7 text-slate-copy">{content[mode].text}</p><div className="mt-5 grid gap-2 sm:grid-cols-3">{content[mode].points.map((point) => <div key={point} className="rounded-lg border border-line bg-paper p-3 text-xs font-bold leading-5 text-ink">{point}</div>)}</div></div>
        </div>
      </div>
    </div>
  );
}

function PracticeExperience({ onAsk }: { onAsk: (question: string) => void }) {
  const questions = [
    { prompt: 'A shear diagram remains at +4 kN over 3 m. What is the change in bending moment?', options: ['+12 kNm', '-12 kNm', '+7 kNm'], answer: 0, hint: 'Use signed area: constant shear multiplied by distance.', explanation: 'Delta M = V x L = +4 x 3 = +12 kNm.' },
    { prompt: 'Where is a local maximum bending moment most likely to occur?', options: ['At zero shear', 'At every support', 'At zero moment'], answer: 0, hint: 'Think about the slope of the moment diagram.', explanation: 'Because dM/dx = V, zero shear creates a stationary point in moment.' },
    { prompt: 'What should be checked before interpreting a peak moment?', options: ['Sign convention and supports', 'Only the beam colour', 'The page number'], answer: 0, hint: 'Engineering meaning depends on the model assumptions.', explanation: 'Support conditions and sign convention determine the correct physical interpretation.' },
  ];
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<'low' | 'medium' | 'high' | null>(null);
  const [hint, setHint] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [scored, setScored] = useState(false);
  const question = questions[index];
  const mastery = Math.round((correct / questions.length) * 100);
  const next = () => {
    setIndex((value) => (value + 1) % questions.length);
    setSelected(null); setConfidence(null); setHint(false); setRevealed(false); setScored(false);
  };
  return (
    <div className="grid min-h-[520px] lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="p-6 sm:p-8">
        <ExperienceHeader eyebrow="Adaptive practice" title={`Question ${index + 1} of ${questions.length}`} description="Commit to an answer and confidence level before revealing the reasoning." />
        <div className="mt-7 rounded-2xl border border-line bg-paper p-5 sm:p-6"><p className="font-display text-xl font-bold leading-8 text-ink">{question.prompt}</p><div className="mt-5 space-y-2">{question.options.map((option, optionIndex) => <button key={option} type="button" disabled={revealed} aria-pressed={selected === optionIndex} onClick={() => setSelected(optionIndex)} className={cn('flex w-full items-center gap-3 rounded-xl border p-4 text-left text-sm font-bold transition', selected === optionIndex ? 'border-companion bg-companion-tint' : 'border-line bg-white hover:border-companion/45', revealed && optionIndex === question.answer && 'border-success bg-success-tint text-success', revealed && selected === optionIndex && optionIndex !== question.answer && 'border-danger bg-danger-tint text-danger')}><span className="grid h-7 w-7 place-items-center rounded-full border border-current font-mono text-xs">{String.fromCharCode(65 + optionIndex)}</span>{option}</button>)}</div></div>
        <div className="mt-5"><p className="text-xs font-bold text-slate-copy">How confident are you?</p><div className="mt-2 flex flex-wrap gap-2">{(['low', 'medium', 'high'] as const).map((level) => <button key={level} type="button" aria-pressed={confidence === level} onClick={() => setConfidence(level)} className={cn('rounded-full border px-4 py-2 text-xs font-bold capitalize', confidence === level ? 'border-ink bg-ink text-white' : 'border-line bg-white')}>{level}</button>)}</div></div>
        <div className="mt-5 flex flex-wrap gap-2"><Button variant="secondary" onClick={() => setHint((value) => !value)}><Lightbulb size={15} />{hint ? 'Hide hint' : 'Hint'}</Button><Button onClick={() => { if (selected === question.answer && !scored) { setCorrect((value) => Math.min(questions.length, value + 1)); setScored(true); } setRevealed(true); }} disabled={selected === null || confidence === null}>Reveal solution</Button>{revealed && <Button variant="ai" onClick={next}>{index === questions.length - 1 ? 'Continue practice' : 'Next question'}<ChevronRight size={15} /></Button>}<Button variant="ghost" onClick={() => { setSelected(null); setConfidence(null); setRevealed(false); setHint(false); setScored(false); }}><RotateCcw size={15} />Retry</Button></div>
        {hint && <div className="mt-4 rounded-xl border border-warn/25 bg-warn-tint p-4 text-sm leading-6 text-ink"><strong>Hint:</strong> {question.hint}</div>}
        {revealed && <div role="status" className={cn('mt-4 rounded-xl border p-5', selected === question.answer ? 'border-success/25 bg-success-tint' : 'border-danger/20 bg-danger-tint')}><p className="font-bold">{selected === question.answer ? 'Correct reasoning' : 'Review the relationship'}</p><p className="mt-2 text-sm leading-6 text-slate-copy">{question.explanation}</p></div>}
      </div>
      <aside className="border-t border-line bg-night p-6 text-mist lg:border-l lg:border-t-0"><p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ai-cyan">Mastery</p><div className="mt-5 grid place-items-center"><div className="grid h-36 w-36 place-items-center rounded-full" style={{ background: `conic-gradient(#F5C400 ${mastery}%, rgba(255,255,255,.1) 0)` }}><div className="grid h-28 w-28 place-items-center rounded-full bg-night"><div className="text-center"><p className="font-display text-3xl font-bold">{mastery}%</p><p className="text-xs text-mist-muted">demonstrated</p></div></div></div></div><div className="mt-6 space-y-3 text-sm text-mist-muted"><p className="flex justify-between"><span>Correct</span><strong className="text-mist">{correct}/{questions.length}</strong></p><p className="flex justify-between"><span>Current confidence</span><strong className="capitalize text-mist">{confidence ?? 'Not set'}</strong></p></div><Button variant="ai" className="mt-6 w-full justify-center" onClick={() => onAsk(`Explain why the answer to practice question ${index + 1} works`)}><MessageSquareText size={15} />Ask AI Tutor</Button></aside>
    </div>
  );
}

function FlashcardExperience({ onAsk }: { onAsk: (question: string) => void }) {
  const cards = [
    { front: 'What does positive shear tell you about bending moment?', back: 'The bending-moment diagram is rising. The signed area under shear gives the total change in moment.' },
    { front: 'What does zero shear often indicate?', back: 'A stationary point in bending moment. Check the sign change and support conditions before calling it a maximum or minimum.' },
    { front: 'What should you verify before using a moment peak in a design argument?', back: 'The load path, support reactions, sign convention, units, and the relevant capacity or serviceability check.' },
  ];
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [known, setKnown] = useState<number[]>(() => readStoredList('civl301-flashcards-known'));
  const card = cards[index];
  const persistKnown = (next: number[]) => {
    setKnown(next);
    window.localStorage.setItem('civl301-flashcards-known', JSON.stringify(next));
  };
  const advance = (remembered: boolean) => {
    if (remembered && !known.includes(index)) persistKnown([...known, index]);
    setIndex((value) => (value + 1) % cards.length);
    setRevealed(false);
  };
  return (
    <div className="grid min-h-[520px] lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="p-6 sm:p-8">
        <ExperienceHeader eyebrow="Retrieval practice" title="Recall the relationship before you reveal it" description="These cards are drawn from the current lesson. Your progress is saved on this device." />
        <div className="mt-7 min-h-72 perspective-1000">
          <button type="button" aria-pressed={revealed} onClick={() => setRevealed((value) => !value)} className="premium-focus flex min-h-72 w-full flex-col justify-between rounded-2xl border border-line bg-paper p-7 text-left shadow-sm transition hover:border-companion/50 focus-visible:ring-2 focus-visible:ring-companion">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-companion">Card {index + 1} of {cards.length} / {revealed ? 'Answer' : 'Prompt'}</span>
            <p className="font-display text-2xl font-bold leading-9 text-ink">{revealed ? card.back : card.front}</p>
            <span className="text-sm font-semibold text-slate-copy">{revealed ? 'Select an outcome below' : 'Select to reveal the approved explanation'}</span>
          </button>
        </div>
        <div className="mt-5 flex flex-wrap gap-2"><Button variant="secondary" onClick={() => advance(false)}><ChevronRight size={15} />Review again</Button><Button onClick={() => advance(true)}><Check size={15} />I knew this</Button><Button variant="ghost" onClick={() => onAsk(`Explain this flashcard: ${card.front}`)}><MessageSquareText size={15} />Ask AI Tutor</Button></div>
      </div>
      <aside className="border-t border-line bg-night p-6 text-mist lg:border-l lg:border-t-0"><p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ai-cyan">Retrieval progress</p><p className="mt-5 font-display text-5xl font-bold">{Math.round((known.length / cards.length) * 100)}%</p><p className="mt-2 text-sm leading-6 text-mist-muted">{known.length} of {cards.length} lesson concepts marked as recalled.</p><Button variant="ai" className="mt-6 w-full justify-center" onClick={() => persistKnown([])}><RotateCcw size={15} />Reset recall progress</Button></aside>
    </div>
  );
}

function RevisionExperience({ onAsk }: { onAsk: (question: string) => void }) {
  const tasks = [
    { id: 'diagram', title: 'Trace shear areas on the interactive diagram', duration: '12 min' },
    { id: 'practice', title: 'Complete two confidence-rated practice questions', duration: '10 min' },
    { id: 'notes', title: 'Write one design implication in your own words', duration: '8 min' },
    { id: 'assessment', title: 'Check Assignment 2 evidence against the rubric', duration: '10 min' },
  ];
  const [complete, setComplete] = useState<string[]>(() => {
    try { const stored = JSON.parse(window.localStorage.getItem('civl301-revision-plan') ?? '[]'); return Array.isArray(stored) ? stored : []; } catch { return []; }
  });
  const toggle = (id: string) => {
    const next = complete.includes(id) ? complete.filter((item) => item !== id) : [...complete, id];
    setComplete(next);
    window.localStorage.setItem('civl301-revision-plan', JSON.stringify(next));
  };
  const remaining = tasks.filter((task) => !complete.includes(task.id));
  return (
    <div className="grid min-h-[520px] lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="p-6 sm:p-8"><ExperienceHeader eyebrow="Focused revision" title="A 40-minute plan for this lesson" description="Choose what to complete. This plan stays on this device and does not change your formal progress record." />
        <div className="mt-7 space-y-3">{tasks.map((task, index) => { const done = complete.includes(task.id); return <button key={task.id} type="button" aria-pressed={done} onClick={() => toggle(task.id)} className={cn('flex w-full items-center gap-4 rounded-xl border p-4 text-left transition', done ? 'border-success/30 bg-success-tint' : 'border-line bg-white hover:border-companion/45')}><span className={cn('grid h-8 w-8 shrink-0 place-items-center rounded-full border font-mono text-xs font-bold', done ? 'border-success bg-success text-white' : 'border-line text-slate-soft')}>{done ? <Check size={15} /> : index + 1}</span><span className="min-w-0 flex-1"><span className="block text-sm font-bold text-ink">{task.title}</span><span className="mt-1 block text-xs text-slate-copy">{task.duration}</span></span></button>; })}</div>
      </div>
      <aside className="border-t border-line bg-paper p-6 lg:border-l lg:border-t-0"><p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-companion">Next focus</p><p className="mt-4 font-display text-xl font-bold text-ink">{remaining[0]?.title ?? 'Revision session complete'}</p><p className="mt-2 text-sm leading-6 text-slate-copy">{remaining.length ? `${remaining.length} task${remaining.length === 1 ? '' : 's'} remain in this focused session.` : 'Use practice or the AI Tutor to reinforce one remaining uncertainty.'}</p><Button variant="ai" className="mt-6 w-full justify-center" onClick={() => onAsk('Help me plan my revision for bending moment diagrams')}><MessageSquareText size={15} />Ask AI Tutor</Button></aside>
    </div>
  );
}
