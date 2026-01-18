import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Loader2, User, Bot, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SEOHead } from '@/components/SEOHead';
import { FlowLayout } from '../components/FlowLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { useEssenceProfile } from '../hooks/useEssenceProfile';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  message: string;
  created_at: string;
}

export default function FlowMentor() {
  const { user } = useAuth();
  const { 
    doorType, 
    doorName, 
    doorIcon, 
    mentorGreeting, 
    mentorTone,
    dom,
    chamado,
    essencia,
    hasEssenceData,
  } = useEssenceProfile();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) fetchMessages();
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from('flow_chats')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(50);
      if (data) setMessages(data as Message[]);
    } finally {
      setIsFetching(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !user || isLoading) return;
    
    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message to UI
    const tempUserMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      message: userMessage,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempUserMsg]);

    try {
      // Save user message
      await supabase.from('flow_chats').insert({
        user_id: user.id,
        role: 'user',
        message: userMessage,
      });

      // Call AI with essence context
      const { data, error } = await supabase.functions.invoke('flow-mentor', {
        body: { 
          message: userMessage, 
          userId: user.id,
          essenceContext: hasEssenceData ? {
            doorType,
            doorName,
            mentorTone,
            dom,
            chamado,
            essencia,
          } : null,
        },
      });

      if (error) throw error;

      const assistantMessage = data?.response || 'Desculpe, não consegui processar sua mensagem.';
      
      // Save assistant message
      await supabase.from('flow_chats').insert({
        user_id: user.id,
        role: 'assistant',
        message: assistantMessage,
      });

      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant',
        message: assistantMessage,
        created_at: new Date().toISOString(),
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant',
        message: 'Desculpe, ocorreu um erro. Tente novamente.',
        created_at: new Date().toISOString(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Personalized mentor subtitle based on door type
  const getMentorSubtitle = () => {
    switch (doorType) {
      case 'visionary':
        return 'Desafiador e direto. Focado em resultados.';
      case 'seeker':
        return 'Acolhedor e guia. Vamos descobrir juntos.';
      case 'executor':
        return 'Pragmático e metódico. Otimização é o jogo.';
      default:
        return 'Seu mentor pé no chão, focado em viabilidade e execução';
    }
  };

  return (
    <>
      <SEOHead title="Conversar com Nello | Nello Flow" description="Seu mentor digital adaptativo baseado na sua essência" />
      
      <FlowLayout>
        <div className="max-w-3xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
          {/* Header */}
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <MessageSquare className="w-7 h-7 text-violet-400" />
                Conversar com Nello
              </h1>
              {hasEssenceData && (
                <span className="text-lg" title={`Modo ${doorName}`}>{doorIcon}</span>
              )}
            </div>
            <p className="text-slate-400">{getMentorSubtitle()}</p>
            {hasEssenceData && (
              <div className="flex items-center gap-2 mt-2">
                <Sparkles className="w-3 h-3 text-violet-400" />
                <span className="text-xs text-violet-300">
                  Tom adaptado ao seu perfil: {doorName}
                </span>
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 rounded-2xl bg-slate-800/30 border border-slate-700/30">
            {isFetching ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 animate-spin text-violet-500" />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-12">
                <Bot className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">Olá! Sou o Nello {doorIcon}</h3>
                <p className="text-slate-400 max-w-md mx-auto">
                  {mentorGreeting}
                </p>
                {hasEssenceData && (
                  <p className="text-sm text-violet-300 mt-4">
                    Adaptei meu tom ao seu perfil de {doorName}.
                  </p>
                )}
              </div>
            ) : (
              messages.map(msg => (
                <div key={msg.id} className={cn("flex gap-3", msg.role === 'user' ? "justify-end" : "")}>
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-violet-400" />
                    </div>
                  )}
                  <div className={cn(
                    "max-w-[80%] p-4 rounded-2xl",
                    msg.role === 'user' 
                      ? "bg-violet-500 text-white" 
                      : "bg-slate-700/50 text-slate-200"
                  )}>
                    <p className="whitespace-pre-wrap">{msg.message}</p>
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-slate-400" />
                    </div>
                  )}
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-violet-400" />
                </div>
                <div className="bg-slate-700/50 p-4 rounded-2xl">
                  <Loader2 className="w-4 h-4 animate-spin text-violet-400" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex gap-3">
            <Textarea
              placeholder="Digite sua mensagem..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
              className="bg-slate-800/50 border-slate-700 text-white resize-none min-h-[60px]"
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="bg-violet-500 hover:bg-violet-600 px-6"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </FlowLayout>
    </>
  );
}
