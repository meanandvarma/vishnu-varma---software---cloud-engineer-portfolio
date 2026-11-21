import { useEffect, useRef, useState } from 'react';
import { Send, Check, CheckCheck, Info } from 'lucide-react';

interface ChatMessageItem {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  delivery?: 'sending' | 'sent' | 'delivered';
}

export function TalkTimeDemo() {
  const [displayName, setDisplayName] = useState('Recruiter_Guest');
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [peerTyping, setPeerTyping] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showArch, setShowArch] = useState(false);

  const channelRef = useRef<BroadcastChannel | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<number | null>(null);

  const loadMessages = async () => {
    try {
      const res = await fetch('/api/chat/messages');
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.messages)) {
        setMessages(
          data.messages.map((m: ChatMessageItem) => ({
            ...m,
            delivery: 'delivered',
          }))
        );
      }
    } catch {
      // keep existing local state if network fails
    }
  };

  useEffect(() => {
    loadMessages();
    const interval = window.setInterval(loadMessages, 5000);

    if (typeof BroadcastChannel !== 'undefined') {
      const ch = new BroadcastChannel('vishnu-talktime-sandbox');
      channelRef.current = ch;
      ch.onmessage = (ev) => {
        if (ev.data?.type === 'NEW_MESSAGE') {
          loadMessages();
        } else if (ev.data?.type === 'TYPING' && ev.data.sender !== displayName) {
          setPeerTyping(ev.data.sender);
          if (typingTimeoutRef.current) window.clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = window.setTimeout(() => setPeerTyping(null), 1800);
        }
      };
    }

    return () => {
      window.clearInterval(interval);
      channelRef.current?.close();
    };
  }, [displayName]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, peerTyping]);

  const handleTyping = (value: string) => {
    setDraft(value);
    channelRef.current?.postMessage({ type: 'TYPING', sender: displayName.trim() || 'Guest' });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const cleanName = displayName.trim();
    const cleanText = draft.trim();
    if (!cleanName || !cleanText) {
      setError('Enter both a display name and a message.');
      return;
    }

    const tempId = `local-${Date.now()}`;
    const optimistic: ChatMessageItem = {
      id: tempId,
      sender: cleanName,
      text: cleanText,
      timestamp: new Date().toISOString(),
      delivery: 'sending',
    };

    setMessages((prev) => [...prev, optimistic]);
    setDraft('');
    setSending(true);

    try {
      const res = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender: cleanName, text: cleanText }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send message');
      }
      setMessages(
        (data.messages || []).map((m: ChatMessageItem) => ({
          ...m,
          delivery: 'delivered',
        }))
      );
      channelRef.current?.postMessage({ type: 'NEW_MESSAGE' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Message delivery failed');
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-white/[0.08] pb-4">
        <div>
          <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
            TalkTime — Real-Time Messaging Sandbox
          </h3>
          <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
            Ephemeral demo room with cross-tab typing indicators &amp; delivery states (open a second tab to chat across sessions).
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowArch((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-white/10 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
        >
          <Info className="h-3.5 w-3.5" />
          {showArch ? 'Hide Spring Boot Specs' : 'Inspect Spring Boot Architecture'}
        </button>
      </div>

      {showArch && (
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 text-xs text-slate-700 dark:text-slate-300 space-y-2">
          <p className="font-semibold text-slate-900 dark:text-white">
            TalkTimeBackend Production Stack (Verified in GitHub pom.xml)
          </p>
          <p>
            Java 22 · Spring Boot 3.3.1 · WebSocket STOMP (`spring-boot-starter-websocket`) · `FirebaseTokenFilter` (`firebase-admin:9.3.0`) · Spring Security · JPA/Hibernate · MySQL (`mysql-connector-j`)
          </p>
          <p className="text-slate-500 dark:text-slate-400">
            Note: This portfolio sandbox runs against an ephemeral Express memory room + BroadcastChannel so visitors can test real-time messaging safely without Firebase login credentials.
          </p>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-4 space-y-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-[#0A0E17] p-4">
          <label htmlFor="talktime-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Display Name
          </label>
          <input
            id="talktime-name"
            type="text"
            maxLength={32}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#111827] px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
          />
          <div className="pt-2 border-t border-slate-200 dark:border-white/[0.08] space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <p className="font-semibold text-slate-800 dark:text-slate-200">Sandbox Guarantees</p>
            <p>· Rate-limited to 20 messages/minute</p>
            <p>· HTML tags stripped server-side</p>
            <p>· Ephemeral memory buffer (max 25 msgs)</p>
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-[#0A0E17] overflow-hidden">
          <div
            ref={listRef}
            className="h-72 overflow-y-auto p-4 space-y-3"
          >
            {messages.map((msg) => {
              const isSelf = msg.sender.toLowerCase() === displayName.trim().toLowerCase();
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[82%] rounded-xl px-3.5 py-2.5 text-sm ${
                      isSelf
                        ? 'bg-blue-600 text-white dark:bg-blue-500 dark:text-slate-950'
                        : 'border border-slate-200 dark:border-white/10 bg-white dark:bg-[#111827] text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <p className="text-[11px] font-semibold opacity-75">{msg.sender}</p>
                    <p className="mt-0.5 leading-relaxed">{msg.text}</p>
                    <div className="mt-1 flex items-center justify-end gap-1 text-[10px] opacity-75 font-mono tabular-nums">
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {isSelf &&
                        (msg.delivery === 'sending' ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <CheckCheck className="h-3 w-3" />
                        ))}
                    </div>
                  </div>
                </div>
              );
            })}

            {peerTyping && (
              <p className="text-xs italic text-slate-500 dark:text-slate-400">
                {peerTyping} is typing...
              </p>
            )}
          </div>

          {error && (
            <div className="px-4 py-2 text-xs text-rose-600 dark:text-rose-400 bg-rose-500/10 border-t border-rose-500/20">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSend}
            className="flex items-center gap-2 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#111827] p-3"
          >
            <input
              type="text"
              maxLength={280}
              value={draft}
              onChange={(e) => handleTyping(e.target.value)}
              placeholder="Send a message to the sandbox room..."
              aria-label="Chat message"
              className="flex-1 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0A0E17] px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={sending}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-slate-950 cursor-pointer shrink-0"
            >
              <Send className="h-4 w-4" /> Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
