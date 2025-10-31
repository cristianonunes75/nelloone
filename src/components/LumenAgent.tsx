import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Send, X, Minimize2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTests } from "@/hooks/useTests";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const LumenAgent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { tests, userTests } = useTests();

  // Detectar se é visitante novo ou recorrente
  useEffect(() => {
    const hasVisited = localStorage.getItem("essentia_visited");
    const isReturning = !!hasVisited;
    
    if (!hasVisited) {
      localStorage.setItem("essentia_visited", "true");
    }

    // Mensagem inicial baseada no contexto
    if (messages.length === 0) {
      const welcomeMessage = isReturning
        ? "Olá novamente! Que bom ter você aqui de volta. ✨\n\nComo posso te ajudar hoje? Quer continuar explorando sua essência ou tem alguma dúvida sobre os testes?"
        : "Olá! Que bom te ver por aqui. 🌿\n\nEu sou o Lumen, o guia do Essentia. Meu papel é te ajudar a descobrir qual teste combina com o momento da sua vida.\n\nPosso te fazer uma pergunta rápida? Você busca entender mais sua mente, suas emoções ou seu propósito?";
      
      setMessages([{ role: "assistant", content: welcomeMessage }]);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isStreaming) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsStreaming(true);

    try {
      // Preparar contexto do usuário
      const hasVisited = localStorage.getItem("essentia_visited");
      const completedTests = userTests
        ?.filter((ut) => ut.status === "completed")
        .map((ut) => ut.tests?.name)
        .filter(Boolean) || [];

      const userContext = {
        isReturning: !!hasVisited,
        hasAccount: !!user,
        completedTests,
      };

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/lumen-agent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: [...messages, userMessage].map((m) => ({
              role: m.role,
              content: m.content,
            })),
            userContext,
          }),
        }
      );

      if (!response.ok || !response.body) {
        throw new Error("Falha ao conectar com o Lumen");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";
      let buffer = "";

      // Criar mensagem do assistente vazia
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim() || line.startsWith(":")) continue;
          if (!line.startsWith("data: ")) continue;

          const data = line.slice(6);
          if (data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantMessage += content;
              setMessages((prev) => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                  role: "assistant",
                  content: assistantMessage,
                };
                return newMessages;
              });
            }
          } catch (e) {
            console.error("Erro ao parsear SSE:", e);
          }
        }
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Desculpe, ocorreu um erro. Tente novamente em instantes. 🌿",
        },
      ]);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl bg-gradient-to-br from-primary via-purple-600 to-pink-600 hover:scale-110 transition-all duration-300 z-50 group"
        size="icon"
      >
        <Sparkles className="h-6 w-6 text-white group-hover:rotate-12 transition-transform" />
      </Button>
    );
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="h-14 px-6 rounded-full shadow-2xl bg-gradient-to-br from-primary via-purple-600 to-pink-600 hover:scale-105 transition-all duration-300 group flex items-center gap-3"
        >
          <Sparkles className="h-5 w-5 text-white" />
          <span className="text-white font-medium">Lumen</span>
          {messages.filter(m => m.role === "user").length > 0 && (
            <span className="text-xs text-white/80">({messages.filter(m => m.role === "user").length})</span>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[400px] h-[600px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col z-50 animate-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary via-purple-600 to-pink-600 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Lumen</h3>
            <p className="text-xs text-muted-foreground">Seu guia no Essentia</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMinimized(true)}
            className="h-8 w-8"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8"
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
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground ml-4"
                    : "bg-muted text-foreground mr-4"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {message.content}
                </p>
              </div>
            </div>
          ))}
          {isStreaming && messages[messages.length - 1]?.role === "user" && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl px-4 py-3 mr-4">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem..."
            disabled={isStreaming}
            className="flex-1"
          />
          <Button
            onClick={sendMessage}
            disabled={isStreaming || !input.trim()}
            size="icon"
            className="bg-gradient-to-br from-primary via-purple-600 to-pink-600 hover:opacity-90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
