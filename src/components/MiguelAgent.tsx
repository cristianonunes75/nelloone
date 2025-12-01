import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface QuickReply {
  text: string;
  action: string;
}

interface MiguelAgentProps {
  location: "landing" | "cliente";
  completedTests?: string[];
  currentStep?: number;
  testResults?: Record<string, any>;
}

const INITIAL_QUICK_REPLIES_LANDING: QuickReply[] = [
  { text: "O que é o NELLO ONE?", action: "O que é o NELLO ONE?" },
  { text: "Quais testes existem?", action: "Quais testes o NELLO ONE oferece?" },
  { text: "Quero começar minha jornada", action: "Quero começar a minha jornada de autoconhecimento." },
  { text: "Como funciona?", action: "Como funciona o processo do NELLO ONE?" },
];

const INITIAL_QUICK_REPLIES_CLIENTE: QuickReply[] = [
  { text: "Qual o próximo passo?", action: "Qual é o próximo passo na minha jornada?" },
  { text: "Explique meus resultados", action: "Pode me ajudar a entender meus resultados?" },
  { text: "O que significa esse teste?", action: "O que o próximo teste vai revelar sobre mim?" },
  { text: "Preciso de orientação", action: "Preciso de uma orientação sobre minha personalidade." },
];

export function MiguelAgent({ location, completedTests = [], currentStep, testResults }: MiguelAgentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>(
    location === "landing" ? INITIAL_QUICK_REPLIES_LANDING : INITIAL_QUICK_REPLIES_CLIENTE
  );
  const [hasGreeted, setHasGreeted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user, profile } = useAuth();

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial greeting when chat opens
  useEffect(() => {
    if (isOpen && !hasGreeted && messages.length === 0) {
      const greeting = location === "landing"
        ? `Oi${profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}! Eu sou o Miguel, seu guia no NELLO ONE.\n\nO NELLO ONE combina ciência de personalidade, design emocional e inteligência artificial para revelar padrões internos que transformam a forma como você se vê, decide e se relaciona.\n\nO caminho começa dentro. Como posso te ajudar hoje?`
        : `Oi${profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}! Que bom te ver por aqui.\n\n${completedTests.length === 0 
            ? "Você está no início da sua jornada de autoconhecimento. O primeiro passo é o teste de Arquétipos, que vai revelar a energia que te move. Quando quiser, é só começar!" 
            : completedTests.length < 7 
              ? `Você já completou ${completedTests.length} teste${completedTests.length > 1 ? 's' : ''}. Continue sua jornada para descobrir mais sobre quem você é.`
              : "Parabéns! Você completou todos os testes. Seu Mapa NELLO ONE está pronto para ser revelado!"
          }\n\nComo posso te ajudar?`;

      setMessages([{ role: "assistant", content: greeting }]);
      setHasGreeted(true);
    }
  }, [isOpen, hasGreeted, messages.length, location, profile, completedTests]);

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
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/miguel-agent`,
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
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro na resposta");
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

      // Update quick replies based on context
      if (location === "landing") {
        setQuickReplies([
          { text: "Quero me cadastrar", action: "Como faço para me cadastrar?" },
          { text: "Ver preços", action: "Quais são os preços dos testes?" },
          { text: "Começar agora", action: "Quero começar minha jornada agora!" },
        ]);
      } else {
        setQuickReplies([
          { text: "Próximo teste", action: "Me fale sobre o próximo teste." },
          { text: "Meus resultados", action: "Quero entender melhor meus resultados." },
          { text: "Mapa NELLO ONE", action: "O que é o Mapa NELLO ONE?" },
        ]);
      }

    } catch (error) {
      console.error("Miguel error:", error);
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "Desculpe, tive um momento de pausa. Pode repetir o que disse?",
        },
      ]);
    } finally {
      setIsStreaming(false);
    }
  }, [messages, isStreaming, location, completedTests, currentStep, testResults, profile]);

  const handleQuickReply = (reply: QuickReply) => {
    sendMessage(reply.action);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-ink-blue shadow-lg hover:bg-ink-deep hover:scale-105 transition-all duration-300"
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
          <span className="text-sm font-medium">Miguel</span>
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
            <h3 className="font-semibold">Miguel</h3>
            <p className="text-xs opacity-80">Seu guia no NELLO ONE</p>
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
            placeholder="Digite sua mensagem..."
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
