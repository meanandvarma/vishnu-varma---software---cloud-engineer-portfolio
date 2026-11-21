import { useEffect, useState } from 'react';
import { Clock, RotateCcw, Sparkles, CheckCircle2, XCircle } from 'lucide-react';

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const CURATED_BANK: Record<string, QuizQuestion[]> = {
  'Java & Spring Boot': [
    {
      question: 'In Spring Boot WebSockets with STOMP, which annotation routes messages sent to an application destination like /app/chat?',
      options: ['@GetMapping', '@MessageMapping', '@RequestBody', '@EnableScheduling'],
      correctIndex: 1,
      explanation: '@MessageMapping binds controller methods to STOMP destination prefixes configured via configureMessageBroker.',
    },
    {
      question: 'What is the primary security reason to place a FirebaseTokenFilter before UsernamePasswordAuthenticationFilter?',
      options: [
        'To compress MySQL query payloads',
        'To verify the Firebase JWT and populate SecurityContextHolder before authorization rules run',
        'To compile Hibernate entities at runtime',
        'To disable CORS headers in development',
      ],
      correctIndex: 1,
      explanation: 'Populating SecurityContextHolder early ensures Spring Security route rules evaluate an authenticated UserPrincipal.',
    },
    {
      question: 'Why does QuizInt_Backend define separate QuestionDTO and QuizResponse DTOs rather than returning raw API strings?',
      options: [
        'To decouple external LLM JSON formats from the mobile client contract',
        'Because Java 22 cannot serialize Strings',
        'To bypass Spring Validation annotations',
        'To store binary images inside MySQL',
      ],
      correctIndex: 0,
      explanation: 'DTOs enforce predictable schema validation and isolate client apps from upstream AI response variations.',
    },
    {
      question: 'Which Spring Data JPA annotation ensures a Many-to-One entity association is loaded only when accessed?',
      options: ['@Transactional(readOnly = false)', '@ManyToOne(fetch = FetchType.LAZY)', '@GeneratedValue', '@RestControllerAdvice'],
      correctIndex: 1,
      explanation: 'FetchType.LAZY prevents unnecessary eager joins when querying parent chat or user entities.',
    },
  ],
  'Azure Cloud & DevOps': [
    {
      question: 'Why store Terraform state in a remote Azure Storage backend instead of committing terraform.tfstate to Git?',
      options: [
        'Remote backends enable state locking and prevent plaintext sensitive outputs in version control',
        'Git cannot store JSON files larger than 1 KB',
        'Terraform requires MySQL to parse HCL syntax',
        'Local state files automatically delete Key Vault secrets',
      ],
      correctIndex: 0,
      explanation: 'Remote state provides team locking, concurrency safety, and keeps infrastructure state out of Git history.',
    },
    {
      question: 'In a multi-container Docker Compose setup (like devops-assessment), how do containers resolve each other by service name?',
      options: [
        'Through public DNS A-records',
        'Via Docker embedded DNS on a shared user-defined bridge network',
        'By hardcoding localhost across containers',
        'Through Azure Key Vault endpoints',
      ],
      correctIndex: 1,
      explanation: 'User-defined bridge networks provide automatic service-name DNS resolution between containers.',
    },
    {
      question: 'Which Azure service centralizes database passwords, API tokens, and TLS certificates with RBAC access policies?',
      options: ['Azure Load Balancer', 'Azure Key Vault', 'Azure Static Web Apps', 'Network Security Group'],
      correctIndex: 1,
      explanation: 'Azure Key Vault provides hardware-backed secret storage, access policies, and audit logging.',
    },
    {
      question: 'Why tag Docker images with the Git commit SHA in a CI/CD pipeline instead of only :latest?',
      options: [
        'To enable deterministic, auditable rollbacks to an exact previous build',
        'Because :latest images cannot run on Linux',
        'To double image layer compression speed',
        'Because ACR rejects :latest tags',
      ],
      correctIndex: 0,
      explanation: 'Immutable commit-SHA tags guarantee that rolling back deploys the exact verified artifact.',
    },
  ],
  'Data Structures & Algorithms': [
    {
      question: 'What is the worst-case time complexity of inserting an element into a balanced Binary Search Tree (e.g., Java TreeMap)?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      correctIndex: 1,
      explanation: 'Red-Black trees used in Java TreeMap maintain logarithmic height O(log n) across insertions and lookups.',
    },
    {
      question: 'Which graph traversal algorithm guarantees finding the shortest path in an unweighted graph?',
      options: ['Depth-First Search (DFS)', 'Breadth-First Search (BFS)', 'Topological Sort', 'Union-Find'],
      correctIndex: 1,
      explanation: 'BFS explores vertices level-by-level by edge distance from the source.',
    },
    {
      question: 'Why use a monotonic deque when solving the Sliding Window Maximum problem?',
      options: [
        'It reduces time complexity from O(nk) to O(n)',
        'It eliminates the need for array indexing',
        'It sorts the entire array in O(1)',
        'It converts recursion into dynamic programming',
      ],
      correctIndex: 0,
      explanation: 'Each index enters and leaves the monotonic deque at most once, yielding O(n) amortized time.',
    },
    {
      question: 'In Java, which PriorityQueue configuration creates a Max-Heap of integers?',
      options: [
        'new PriorityQueue<Integer>()',
        'new PriorityQueue<Integer>(Collections.reverseOrder())',
        'new ArrayDeque<Integer>()',
        'new LinkedHashSet<Integer>()',
      ],
      correctIndex: 1,
      explanation: 'Java PriorityQueue defaults to a Min-Heap; passing Collections.reverseOrder() reverses comparison into a Max-Heap.',
    },
  ],
};

export function QuizIntDemo() {
  const topics = Object.keys(CURATED_BANK);
  const [topic, setTopic] = useState(topics[0]);
  const [questions, setQuestions] = useState<QuizQuestion[]>(CURATED_BANK[topics[0]]);
  const [modeLabel, setModeLabel] = useState<'Curated Bank' | 'Live Gemini AI'>('Curated Bank');
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(20);
  const [finished, setFinished] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (finished || selected !== null) return;
    if (secondsLeft <= 0) {
      setSelected(-1); // timed out
      return;
    }
    const timer = window.setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [secondsLeft, finished, selected]);

  const startTopic = (nextTopic: string) => {
    setTopic(nextTopic);
    setQuestions(CURATED_BANK[nextTopic]);
    setModeLabel('Curated Bank');
    setIndex(0);
    setSelected(null);
    setScore(0);
    setSecondsLeft(20);
    setFinished(false);
    setError(null);
  };

  const handleGenerateLiveQuiz = async () => {
    setLoadingAI(true);
    setError(null);
    try {
      const res = await fetch('/api/demos/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });
      const data = await res.json();
      if (!res.ok || !Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error(data.error || 'Could not generate live quiz questions.');
      }
      setQuestions(data.questions);
      setModeLabel('Live Gemini AI');
      setIndex(0);
      setSelected(null);
      setScore(0);
      setSecondsLeft(20);
      setFinished(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Live AI generation unavailable');
    } finally {
      setLoadingAI(false);
    }
  };

  const current = questions[index];

  const handleSelectOption = (optIdx: number) => {
    if (selected !== null) return;
    setSelected(optIdx);
    if (optIdx === current.correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (index + 1 >= questions.length) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setSecondsLeft(20);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-white/[0.08] pb-4">
        <div>
          <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
            QuizInt — Timed Interview Quiz Engine
          </h3>
          <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
            Mirrors the QuizInt Flutter + Spring Boot timed assessment flow. Source: {modeLabel}.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg bg-slate-100 dark:bg-white/5 p-1">
            {topics.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => startTopic(t)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  topic === t
                    ? 'bg-white dark:bg-[#1A2234] text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <button
            type="button"
            disabled={loadingAI}
            onClick={handleGenerateLiveQuiz}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-white/10 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-50 cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            {loadingAI ? 'Generating...' : 'Generate Fresh AI Set'}
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-300">
          {error}
        </div>
      )}

      {finished ? (
        <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-[#0A0E17] p-6 text-center space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Session Complete · {topic}
          </p>
          <p className="font-display text-4xl font-bold tabular-nums text-slate-900 dark:text-white">
            {score} / {questions.length}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {score === questions.length
              ? 'Perfect score across all questions.'
              : 'Review explanations or try another domain topic.'}
          </p>
          <button
            type="button"
            onClick={() => startTopic(topic)}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 dark:bg-blue-500 dark:text-slate-950 cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" /> Restart Quiz
          </button>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-[#0A0E17] p-5 space-y-5">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
            <span>
              Question {index + 1} of {questions.length} · {modeLabel}
            </span>
            <span className={`inline-flex items-center gap-1 font-semibold ${secondsLeft <= 5 ? 'text-rose-600 dark:text-rose-400' : ''}`}>
              <Clock className="h-3.5 w-3.5" /> {secondsLeft}s
            </span>
          </div>

          <h4 className="font-display text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
            {current.question}
          </h4>

          <div className="grid gap-2.5">
            {current.options.map((opt, optIdx) => {
              const isChosen = selected === optIdx;
              const isCorrect = optIdx === current.correctIndex;
              let btnStyle =
                'border-slate-200 dark:border-white/10 bg-white dark:bg-[#111827] text-slate-800 dark:text-slate-200 hover:border-blue-500/50';
              if (selected !== null) {
                if (isCorrect) {
                  btnStyle = 'border-emerald-500/60 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200';
                } else if (isChosen) {
                  btnStyle = 'border-rose-500/60 bg-rose-500/10 text-rose-900 dark:text-rose-200';
                } else {
                  btnStyle = 'border-slate-200 dark:border-white/10 opacity-60';
                }
              }

              return (
                <button
                  key={optIdx}
                  type="button"
                  disabled={selected !== null}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-colors cursor-pointer disabled:cursor-default ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {selected !== null && isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />}
                  {selected !== null && isChosen && !isCorrect && <XCircle className="h-4 w-4 text-rose-500 shrink-0" />}
                </button>
              );
            })}
          </div>

          {selected !== null && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-200 dark:border-white/[0.08] pt-4">
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                {selected === -1 ? 'Time expired. ' : ''}
                {current.explanation}
              </p>
              <button
                type="button"
                onClick={handleNext}
                className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 dark:bg-blue-500 dark:text-slate-950 cursor-pointer shrink-0"
              >
                {index + 1 >= questions.length ? 'View Results' : 'Next Question'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
