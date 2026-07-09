import { AlertTriangle, Send, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { aiResponses, chatSeed, learningStyles, quickActions, supportPathways, unit } from '../data/mockData';
import { Button, Card, ChatBubble, ConfidenceBadge, LoadingPill } from '../components/ui';

type Message = { role: string; text: string; source?: string };

export default function LearningPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>(chatSeed);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSupport, setShowSupport] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem('ailc-memory');
    if (stored) {
      setMessages(JSON.parse(stored) as Message[]);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem('ailc-memory', JSON.stringify(messages));
  }, [messages]);

  function sendMessage(text = input) {
    if (!text.trim()) return;
    setMessages((items) => [...items, { role: 'student', text }]);
    setInput('');
    setLoading(true);
    setTimeout(() => {
      const low = text.toLowerCase();
      const scripted = aiResponses[text];
      const isStillConfused = low.includes('still confused') || low.includes("still don't understand") || low.includes('still do not understand') || low.includes('still stuck') || low.includes('confused');
      if (isStillConfused) {
        setShowSupport(true);
      }
      const answer = isStillConfused
        ? {
            role: 'ai',
            text:
              'Thanks for saying that. Since this still feels unclear, I recommend moving from explanation into support. Try a group discussion to compare reasoning, a 1 on 1 mentoring session for study strategy, or a lecturer catch-up if the confusion is about expectations. Bring these questions: 1. Where exactly does shear become moment? 2. How do I identify the maximum moment location? 3. How can I explain my reasoning without asking for an assessment answer?',
            source: 'Week 4 Lecture Slides, Slide 18',
          }
        : low.includes('assignment')
        ? {
            role: 'ai',
            text: 'I can help you understand the concept so you can discuss it confidently, but I cannot draft assessment content. Focus on explaining how load position changes shear, and how shear changes the bending moment shape.',
            source: 'Assessment Brief, Academic Integrity Guidance',
          }
        : low.includes('internet') || low.includes('answer')
          ? {
              role: 'ai',
              text: "I'm not confident enough to answer this using the approved unit materials. I recommend PASS, tutorial discussion, or lecturer consultation, and this question has entered the lecturer review queue.",
              source: 'Escalated to lecturer review queue',
            }
          : scripted
            ? {
                role: 'ai',
                text: scripted,
                source: 'Week 4 Lecture Slides, Slide 18',
              }
        : {
            role: 'ai',
            text: 'Let us use a worked example. First find reactions, then draw shear, then use the shear areas to build the bending moment diagram. If the answer still feels uncertain, I can prepare questions for your tutorial or PASS session.',
            source: 'Week 4 Lecture, Slide 18',
          };
      setMessages((items) => [...items, answer]);
      setLoading(false);
    }, 850);
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-5 px-5 py-6 sm:px-8 xl:grid-cols-[1fr_360px]">
      <section className="space-y-5">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-mono text-xs font-semibold uppercase text-companion">Student Learning Mode</p>
              <h2 className="mt-1 font-display text-3xl font-bold">Welcome back {user?.name || 'student'}, continue {unit.topic}</h2>
            </div>
            <ConfidenceBadge />
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {learningStyles.map((style) => (
              <button key={style} className="rounded-full border border-line bg-white px-4 py-2 text-xs font-semibold hover:border-companion hover:text-companion">
                {style}
              </button>
            ))}
          </div>
        </Card>

        <Card className="min-h-[560px]">
          <div className="space-y-4">
            {messages.map((message, index) => <ChatBubble key={`${message.text}-${index}`} {...message} />)}
            {loading && <LoadingPill label="Checking approved unit content" />}
          </div>
          <div className="mt-6 flex gap-2 rounded-2xl border border-line bg-paper p-2">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && sendMessage()}
              className="min-w-0 flex-1 bg-transparent px-3 text-sm"
              placeholder="Ask about bending moment diagrams"
            />
            <button onClick={() => sendMessage()} className="rounded-2xl bg-companion px-4 text-white"><Send size={18} /></button>
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-copy">The AI explains underlying concepts and cites sources. It does not write assignment content, complete reports, or provide final answers.</p>
        </Card>

        <Card>
          <h3 className="font-display text-xl font-bold">Adaptive learning loop</h3>
          <div className="mt-5 grid gap-3 md:grid-cols-6">
            {['Ask', 'AI explains', 'Practise', 'Quiz/scenario', 'Reflect', 'Human support'].map((step) => (
              <div key={step} className="rounded-2xl bg-paper p-4 text-center text-sm font-bold">{step}</div>
            ))}
          </div>
        </Card>
      </section>

      <aside className="space-y-5">
        <Card>
          <h2 className="font-display text-lg font-bold">Quick actions</h2>
          <div className="mt-4 grid gap-2">
            {quickActions.map((action) => (
              <button key={action} onClick={() => sendMessage(action)} className="rounded-2xl border border-line px-4 py-3 text-left text-sm font-semibold hover:border-companion hover:bg-companion-tint">
                {action}
              </button>
            ))}
          </div>
        </Card>
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="text-warn" size={19} />
            <h2 className="font-display text-lg font-bold">Further learning options</h2>
          </div>
          {!showSupport ? (
            <div className="rounded-2xl bg-paper p-4">
              <p className="text-sm font-semibold">These appear when you tell the AI you are still confused.</p>
              <p className="mt-2 text-xs leading-5 text-slate-copy">
                Try typing: "I'm still confused about bending moment diagrams."
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {supportPathways.map(({ name, detail, icon: Icon }) => (
                <div key={name} className="flex gap-3 rounded-2xl bg-paper p-3">
                  <Icon className="mt-1 text-companion" size={18} />
                  <div>
                    <p className="text-sm font-bold">{name}</p>
                    <p className="text-xs leading-5 text-slate-copy">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {showSupport && <div className="mt-4 rounded-2xl border border-companion/20 bg-companion-tint p-4">
            <div className="flex items-center gap-2 text-sm font-bold text-companion">
              <Sparkles size={16} />
              Questions to bring
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-copy">
              Ask: "Can you check my shear-to-moment link?", "Where should I look for maximum moment?", and "How can I explain my reasoning without getting an assessment answer?"
            </p>
          </div>}
          {showSupport && <div className="mt-4 grid gap-2">
            <Button variant="secondary" onClick={() => sendMessage('Prepare support questions for me')}>Prepare support questions</Button>
          </div>}
        </Card>
      </aside>
    </div>
  );
}
