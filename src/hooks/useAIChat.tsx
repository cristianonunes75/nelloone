import { useState, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

type Message = {
  id?: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at?: string;
  test_context?: string | null;
  metadata?: {
    was_upsell?: boolean;
    upsell_type?: string | null;
    cta_url?: string | null;
    classifier?: string;
  } | null;
};

type ChatResponse = {
  content: string;
  was_upsell: boolean;
  upsell_type?: string | null;
  cta_url?: string | null;
  error?: string;
};

type UseAIChatOptions = {
  conversationId?: string;
  sessionId?: string;
  testContext?: string;
};

export const useAIChat = (options: UseAIChatOptions = {}) => {
  const { conversationId, sessionId, testContext } = options;
  const { user, session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isStreaming, setIsStreaming] = useState(false);

  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ["ai-messages", conversationId],
    enabled: !!conversationId && !!user,
    queryFn: async () => {
      if (!conversationId) return [];

      const { data, error } = await supabase
        .from("ai_messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at");

      if (error) throw error;
      return data as Message[];
    },
  });

  const createConversation = useMutation({
    mutationFn: async (title?: string) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("ai_conversations")
        .insert({
          user_id: user.id,
          title: title || "Nova conversa",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-conversations"] });
    },
  });

  const saveMessage = async (conversationId: string, message: Message) => {
    const { error } = await supabase.from("ai_messages").insert({
      conversation_id: conversationId,
      role: message.role,
      content: message.content,
      test_context: message.test_context,
      metadata: message.metadata,
    });

    if (error) throw error;
  };

  // Send message for results page chat (non-streaming, uses chat-ai edge function)
  const sendResultsMessage = useCallback(
    async ({
      message,
      onResponse,
    }: {
      message: string;
      onResponse: (response: ChatResponse) => void;
    }) => {
      if (!user || !session?.access_token) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado",
          variant: "destructive",
        });
        return;
      }

      if (!sessionId) {
        toast({
          title: "Erro",
          description: "ID da sessão não encontrado",
          variant: "destructive",
        });
        return;
      }

      setIsStreaming(true);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-ai`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
              message,
              session_id: sessionId,
              test_context: testContext,
            }),
          }
        );

        if (!response.ok) {
          if (response.status === 429) {
            throw new Error("Limite de requisições atingido. Tente novamente mais tarde.");
          }
          if (response.status === 402) {
            throw new Error("Créditos insuficientes. Por favor, adicione créditos.");
          }
          if (response.status === 401) {
            throw new Error("Sessão expirada. Faça login novamente.");
          }
          throw new Error("Erro ao conectar com o assistente");
        }

        const data: ChatResponse = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        onResponse(data);
      } catch (error: any) {
        console.error("Error sending results message:", error);
        toast({
          title: "Erro ao enviar mensagem",
          description: error.message,
          variant: "destructive",
        });
        // Return error response
        onResponse({
          content: "Desculpe, tive um momento de pausa. Pode tentar novamente?",
          was_upsell: false,
        });
      } finally {
        setIsStreaming(false);
      }
    },
    [user, session, toast, sessionId, testContext]
  );

  // Original streaming message for concierge chat
  const sendMessage = useCallback(
    async ({
      convId,
      userMessage,
      onDelta,
    }: {
      convId: string;
      userMessage: string;
      onDelta: (delta: string) => void;
    }) => {
      if (!user) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado",
          variant: "destructive",
        });
        return;
      }

      setIsStreaming(true);

      try {
        // Save user message
        await saveMessage(convId, {
          role: "user",
          content: userMessage,
        });

        // Get conversation history
        const { data: history } = await supabase
          .from("ai_messages")
          .select("*")
          .eq("conversation_id", convId)
          .order("created_at");

        const messages = history?.map((msg) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        })) || [];

        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/nello-concierge`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({ messages }),
          }
        );

        if (!response.ok) {
          if (response.status === 429) {
            throw new Error("Limite de requisições atingido. Tente novamente mais tarde.");
          }
          if (response.status === 402) {
            throw new Error("Créditos insuficientes. Por favor, adicione créditos.");
          }
          throw new Error("Erro ao conectar com o assistente");
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let assistantMessage = "";

        if (reader) {
          let buffer = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (let line of lines) {
              if (line.endsWith("\r")) line = line.slice(0, -1);
              if (line.startsWith(":") || line.trim() === "") continue;
              if (!line.startsWith("data: ")) continue;

              const jsonStr = line.slice(6).trim();
              if (jsonStr === "[DONE]") break;

              try {
                const parsed = JSON.parse(jsonStr);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  assistantMessage += content;
                  onDelta(content);
                }
              } catch (e) {
                console.error("Error parsing SSE:", e);
              }
            }
          }
        }

        // Save assistant message
        if (assistantMessage) {
          await saveMessage(convId, {
            role: "assistant",
            content: assistantMessage,
          });
        }

        queryClient.invalidateQueries({ queryKey: ["ai-messages", convId] });
      } catch (error: any) {
        console.error("Error sending message:", error);
        toast({
          title: "Erro ao enviar mensagem",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsStreaming(false);
      }
    },
    [user, toast, queryClient]
  );

  return {
    messages: messages || [],
    isLoading: messagesLoading,
    isStreaming,
    sendMessage,
    sendResultsMessage,
    createConversation: createConversation.mutate,
  };
};
