import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface QuickReply {
  text: string;
  action: string;
}

interface NelloAgentProps {
  location: "landing" | "cliente";
  completedTests?: string[];
  currentStep?: number;
  testResults?: Record<string, any>;
}

export function NelloAgent({ location, completedTests = [], currentStep, testResults }: NelloAgentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([]);
  const [hasGreeted, setHasGreeted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user, profile } = useAuth();
  const { t, language } = useLanguage();

  // Get initial quick replies based on location and language
  const getInitialQuickReplies = useCallback((): QuickReply[] => {
    const replies = t.nello.quickReplies;
    if (location === "landing") {
      return [
        { text: replies.landing.whatIs, action: replies.landing.whatIsAction },
        { text: replies.landing.whichTests, action: replies.landing.whichTestsAction },
        { text: replies.landing.startJourney, action: replies.landing.startJourneyAction },
        { text: replies.landing.howWorks, action: replies.landing.howWorksAction },
      ];
    }
    return [
      { text: replies.cliente.nextStep, action: replies.cliente.nextStepAction },
      { text: replies.cliente.explainResults, action: replies.cliente.explainResultsAction },
      { text: replies.cliente.whatMeans, action: replies.cliente.whatMeansAction },
      { text: replies.cliente.needGuidance, action: replies.cliente.needGuidanceAction },
    ];
  }, [t, location]);

  // Get after-response quick replies
  const getAfterResponseQuickReplies = useCallback((): QuickReply[] => {
    const replies = t.nello.quickReplies.afterResponse;
    if (location === "landing") {
      return [
        { text: replies.landing.signup, action: replies.landing.signupAction },
        { text: replies.landing.prices, action: replies.landing.pricesAction },
        { text: replies.landing.startNow, action: replies.landing.startNowAction },
      ];
    }
    return [
      { text: replies.cliente.nextTest, action: replies.cliente.nextTestAction },
      { text: replies.cliente.myResults, action: replies.cliente.myResultsAction },
      { text: replies.cliente.nelloMap, action: replies.cliente.nelloMapAction },
    ];
  }, [t, location]);

  // Update quick replies when language changes
  useEffect(() => {
    if (!isStreaming && messages.length === 0) {
      setQuickReplies(getInitialQuickReplies());
    } else if (!isStreaming && messages.length > 0) {
      setQuickReplies(getAfterResponseQuickReplies());
    }
  }, [language, getInitialQuickReplies, getAfterResponseQuickReplies, isStreaming, messages.length]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Build greeting message
  const buildGreeting = useCallback(() => {
    const userName = profile?.full_name?.split(' ')[0];
    const nameStr = userName ? `, ${userName}` : '';

    if (location === "landing") {
      return t.nello.landingGreeting.replace('{name}', nameStr);
    }

    let progress: string;
    if (completedTests.length === 0) {
      progress = t.nello.clienteGreetingNew;
    } else if (completedTests.length < 7) {
      progress = t.nello.clienteGreetingProgress
        .replace('{count}', completedTests.length.toString())
        .replace('{plural}', completedTests.length > 1 ? 's' : '');
    } else {
      progress = t.nello.clienteGreetingComplete;
    }

    return t.nello.clienteGreetingIntro
      .replace('{name}', nameStr)
      .replace('{progress}', progress);
  }, [t, location, profile, completedTests]);

  // Initial greeting when chat opens
  useEffect(() => {
    if (isOpen && !hasGreeted && messages.length === 0) {
      setMessages([{ role: "assistant", content: buildGreeting() }]);
      setQuickReplies(getInitialQuickReplies());
      setHasGreeted(true);
    }
  }, [isOpen, hasGreeted, messages.length, buildGreeting, getInitialQuickReplies]);

  const sendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim() || isStreaming) return;

    const userMessage: Message = { role: "user", content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsStreaming(true);
    setQuickReplies([]);

    let assistantContent = "";

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/nello-agent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: [...messages, userMessage].map(m => ({
              role: m.role,
              content: m.content,
            })),
            context: {
              location,
              completedTests,
              currentStep,
              results: testResults,
              isNewUser: messages.length === 0,
            },
            userName: profile?.full_name?.split(' ')[0],
            language,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Response error");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                assistantContent += content;
                setMessages(prev => {
                  const newMessages = [...prev];
                  const lastMessage = newMessages[newMessages.length - 1];
                  if (lastMessage?.role === "assistant") {
                    lastMessage.content = assistantContent;
                  } else {
                    newMessages.push({ role: "assistant", content: assistantContent });
                  }
                  return newMessages;
                });
              }
            } catch {
              // Ignore parse errors for incomplete chunks
            }
          }
        }
      }

      setQuickReplies(getAfterResponseQuickReplies());

    } catch (error) {
      console.error("Nello error:", error);
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: t.nello.error,
        },
      ]);
    } finally {
      setIsStreaming(false);
    }
  }, [messages, isStreaming, location, completedTests, currentStep, testResults, profile, language, t, getAfterResponseQuickReplies]);

  const handleQuickReply = (reply: QuickReply) => {
    sendMessage(reply.action);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-nello-graphite shadow-lg hover:bg-nello-graphite-deep hover:scale-105 transition-all duration-300 text-white"
        size="icon"
      >
        <Sparkles className="h-6 w-6" />
      </Button>
    );
  }

  if (isMinimized) {
    return (
      <div
        className="fixed bottom-6 right-6 z-50 bg-card border border-border rounded-full px-4 py-2 shadow-lg cursor-pointer hover:shadow-xl transition-all"
        onClick={() => setIsMinimized(false)}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-ink-blue" />
          <span className="text-sm font-medium">Nello</span>
          {messages.length > 0 && (
            <span className="bg-ink-blue text-primary-foreground text-xs rounded-full px-2">
              {messages.length}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-6rem)] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-ink-blue text-primary-foreground p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold">Nello</h3>
            <p className="text-xs opacity-80">{t.nello.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
            onClick={() => setIsMinimized(true)}
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-ink-blue text-primary-foreground rounded-br-md"
                    : "bg-muted text-foreground rounded-bl-md"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))}
          
          {isStreaming && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Replies */}
        {quickReplies.length > 0 && !isStreaming && (
          <div className="flex flex-wrap gap-2 mt-4">
            {quickReplies.map((reply, index) => (
              <button
                key={index}
                onClick={() => handleQuickReply(reply)}
                className="text-xs bg-secondary hover:bg-secondary/80 text-secondary-foreground px-3 py-2 rounded-full transition-colors"
              >
                {reply.text}
              </button>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.nello.placeholder}
            disabled={isStreaming}
            className="flex-1 bg-muted border-0 focus-visible:ring-1 focus-visible:ring-ink-blue"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isStreaming}
            className="shrink-0 bg-ink-blue hover:bg-ink-deep"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
