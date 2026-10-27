"use client";

import { useRef, useState } from "react";
import { Bot, Loader2, Send, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const WELCOME: Msg = {
  role: "assistant",
  content:
    "你好，我是汽配知识局的 AI 助手，可以帮你：解答汽配行业问题、推荐适合你的产品、引导你领取免费资料。请问你想了解什么？",
};

/** AI 问答悬浮组件：密钥在后端 API Route（环境变量），前端不暴露 key */
export function AiChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        { role: "assistant", content: data.reply || "抱歉，出了点问题，请稍后再试。" },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "网络异常，请稍后再试。也可以直接加企微找真人解答：/wechat" },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => listRef.current?.scrollTo({ top: 1e6, behavior: "smooth" }), 50);
    }
  }

  return (
    <>
      {/* 悬浮按钮 */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-20 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-green text-white shadow-warm-lg transition-transform hover:scale-105 sm:bottom-5"
        aria-label="AI 问答"
      >
        {open ? <X className="h-5 w-5" /> : <Bot className="h-6 w-6" />}
      </button>

      {/* 对话面板 */}
      {open && (
        <div className="fixed bottom-36 right-4 z-50 flex h-[62vh] max-h-[520px] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-xl border bg-card shadow-warm-lg sm:bottom-24 sm:right-5 sm:h-[70vh]">
          <div className="flex items-center gap-2 border-b bg-secondary/60 px-4 py-3">
            <Bot className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">汽配知识局 · AI 助手</span>
          </div>
          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed",
                  m.role === "user"
                    ? "ml-auto bg-brand-green text-white"
                    : "bg-muted text-foreground"
                )}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> 思考中…
              </div>
            )}
          </div>
          <div className="flex gap-2 border-t p-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="输入你的问题…"
            />
            <Button size="icon" onClick={send} disabled={loading} aria-label="发送">
              <Send />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
