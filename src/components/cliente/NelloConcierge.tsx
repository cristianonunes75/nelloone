import { useState, useEffect, useRef } from "react";
import { useAIChat } from "@/hooks/useAIChat";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, X, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export default function NelloConcierge() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [displayMessages, setDisplayMessages] = useState<Array<{ role: string; content: string }>>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, isLoading, isStreaming, sendMessage, createConversation } = useAIChat(conversationId || undefined);

  useEffect(() => {
    if (isOpen && !conversationId && user) {
      initConversation();
    }
  }, [isOpen, conversationId, user]);

  useEffect(() => {
    if (messages) {
      setDisplayMessages(messages);
    }
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayMessages]);

  const initConversation = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("ai_conversations")
      .select("id")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data) {
      setConversationId(data.id);
    } else {
      createConversation("Conversa com NELLO ONE", {
        onSuccess: (conv) => setConversationId(conv.id),
      });
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !conversationId || isStreaming) return;

    const userMessage = input;
    setInput("");

    // Add user message immediately
    setDisplayMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    // Add empty assistant message that will be filled with streaming content
    setDisplayMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    await sendMessage({
      convId: conversationId,
      userMessage,
      onDelta: (delta) => {
        setDisplayMessages((prev) => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage.role === "assistant") {
            lastMessage.content += delta;
          }
          return newMessages;
        });
      },
    });
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-xl flex flex-col">
      <CardHeader className="bg-primary text-primary-foreground rounded-t-lg flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            <CardTitle className="text-lg">NELLO ONE Concierge</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          {displayMessages.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              <Sparkles className="h-12 w-12 mx-auto mb-4 text-primary" />
              <p className="font-medium mb-2">Olá! Sou o NELLO ONE Concierge</p>
              <p className="text-sm">
                Estou aqui para ajudar você a entender seus resultados e guiar sua jornada de autoconhecimento!
              </p>
            </div>
          )}
          <div className="space-y-4">
            {displayMessages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isStreaming && displayMessages[displayMessages.length - 1]?.content === "" && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="border-t p-4 flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Digite sua mensagem..."
            disabled={isStreaming || !conversationId}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming || !conversationId}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
