import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, X, Sparkles, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAIChat } from "@/hooks/useAIChat";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
  metadata?: {
    was_upsell?: boolean;
    upsell_type?: string | null;
    cta_url?: string | null;
  } | null;
}

interface NelloResultsChatProps {
  testType: string;
  testName?: string;
  userTestId?: string;
  className?: string;
}

const QUICK_CHIPS = [
  "O que significa meu resultado nesse teste?",
  "Quais são as forças desse perfil?",
  "Quais são os pontos de atenção?",
  "Como isso se conecta com outro teste?",
];

// Generate or retrieve persistent session ID for this userTestId
function getOrCreateSessionId(userTestId: string): string {
  const storageKey = `nello_chat_session_${userTestId}`;
  let sessionId = localStorage.getItem(storageKey);
  
  if (!sessionId) {
    sessionId = `${userTestId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(storageKey, sessionId);
  }
  
  return sessionId;
}

export function NelloResultsChat({ testType, testName, userTestId, className }: NelloResultsChatProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [showUpsell, setShowUpsell] = useState(false);
  const [upsellData, setUpsellData] = useState<{ url: string; type: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Generate persistent session ID based on userTestId
  const sessionId = useMemo(() => {
    if (!userTestId) return `temp_${Date.now()}`;
    return getOrCreateSessionId(userTestId);
  }, [userTestId]);

  const { sendResultsMessage, isStreaming } = useAIChat({
    sessionId,
    testContext: testType,
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isStreaming) return;

    const userMessage: Message = { role: "user", content: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setShowUpsell(false);

    await sendResultsMessage({
      message: messageText,
      onResponse: (response) => {
        const assistantMessage: Message = {
          role: "assistant",
          content: response.content,
          metadata: {
            was_upsell: response.was_upsell,
            upsell_type: response.upsell_type,
            cta_url: response.cta_url,
          },
        };
        setMessages((prev) => [...prev, assistantMessage]);

        if (response.was_upsell && response.cta_url) {
          setShowUpsell(true);
          setUpsellData({
            url: response.cta_url,
            type: response.upsell_type || "ativacao_codigo",
          });
        }
      },
    });
  };

  const handleChipClick = (chip: string) => {
    sendMessage(chip);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  if (!user) return null;

  return (
    <>
      {/* Floating Button - positioned at right-24 to not conflict with ResultsFloatingMenu at right-6 */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className={cn("fixed bottom-6 right-24 z-50", className)}
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="h-14 px-4 rounded-full shadow-xl bg-primary hover:bg-primary/90 gap-2"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="hidden sm:inline">Pergunte para o Nello</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)]"
          >
            <Card className="shadow-2xl border-border/50 flex flex-col h-[520px] overflow-hidden">
              {/* Header */}
              <CardHeader className="bg-primary text-primary-foreground py-4 px-4 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold">Nello</CardTitle>
                      <p className="text-xs text-primary-foreground/80">
                        Assistente de autoconhecimento
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="text-primary-foreground hover:bg-primary-foreground/20 h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                {/* Messages Area */}
                <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                  {/* Welcome Message */}
                  {messages.length === 0 && (
                    <div className="text-center py-6 space-y-4">
                      <div className="h-16 w-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                        <Sparkles className="h-8 w-8 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">
                          "Que bom ver você por aqui!"
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Estou aqui para ajudar você a entender seus resultados
                          {testName ? ` do ${testName}` : ""}.
                        </p>
                      </div>

                      {/* Quick Chips */}
                      <div className="flex flex-wrap gap-2 justify-center pt-2">
                        {QUICK_CHIPS.map((chip, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleChipClick(chip)}
                            className="text-xs h-auto py-1.5 px-3 rounded-full"
                          >
                            {chip}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Messages */}
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={cn(
                          "flex",
                          message.role === "user" ? "justify-end" : "justify-start"
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[85%] rounded-2xl px-4 py-2.5",
                            message.role === "user"
                              ? "bg-primary text-primary-foreground rounded-br-md"
                              : "bg-muted text-foreground rounded-bl-md"
                          )}
                        >
                          {message.role === "assistant" ? (
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                              <ReactMarkdown>{message.content}</ReactMarkdown>
                            </div>
                          ) : (
                            <p className="text-sm">{message.content}</p>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Loading indicator */}
                    {isStreaming && (
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                          <div className="flex gap-1.5">
                            <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:150ms]" />
                            <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:300ms]" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Upsell Card */}
                <AnimatePresence>
                  {showUpsell && upsellData && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="mx-4 mb-2"
                    >
                      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                        <CardContent className="p-3">
                          <p className="font-medium text-sm mb-1.5">
                            ✨ Isso fica mais claro na Ativação
                          </p>
                          <ul className="text-xs text-muted-foreground space-y-0.5 mb-2">
                            <li>• Orientação personalizada para aplicar na vida real</li>
                            <li>• Plano de ação com base no seu código</li>
                          </ul>
                          <Button
                            size="sm"
                            className="w-full gap-2 h-8"
                            onClick={() => window.location.href = upsellData.url}
                          >
                            Conhecer Ativação
                            <ArrowRight className="h-3 w-3" />
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Input Area */}
                <form
                  onSubmit={handleSubmit}
                  className="border-t p-3 flex gap-2 bg-background"
                >
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Digite sua pergunta..."
                    disabled={isStreaming}
                    className="flex-1 h-10"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!input.trim() || isStreaming}
                    className="h-10 w-10 rounded-full flex-shrink-0"
                  >
                    {isStreaming ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
