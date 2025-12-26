import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CheckCircle, AlertTriangle, Lightbulb, Heart, Briefcase, Sparkles, MessageCircle, Calendar, ChevronDown, ChevronUp, User, Brain, Shield, Target } from "lucide-react";
import { TemperamentosResult, TemperamentType, normalizeLegacyResult, isLegacyResult } from "@/lib/temperamentos";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface TemperamentosResultsSectionProps {
  temperamentosResults: TemperamentosResult;
  lang: 'pt' | 'pt-pt' | 'en';
  userName?: string;
}

const TEMPERAMENT_DATA = {
  sanguineo: {
    pt: {
      name: 'Sanguíneo',
      element: 'Ar',
      elementIcon: '🌬️',
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50 dark:bg-amber-950/20',
      borderColor: 'border-amber-500/30',
      textColor: 'text-amber-700 dark:text-amber-400',
      chartColor: '#F59E0B',
      description: 'Você tende a ser expressivo, sociável e otimista. Seu padrão de resposta é leve, expansivo e comunicativo.',
      keyPhrases: [
        'Sua presença traz leveza aos ambientes',
        'Você se conecta facilmente com pessoas',
        'Novidades e experiências te motivam'
      ],
      strengths: ['Comunicação fluida', 'Sociabilidade natural', 'Otimismo', 'Criatividade relacional', 'Adaptabilidade', 'Expressividade'],
      fragilities: ['Dificuldade com rotina', 'Tendência à desorganização', 'Impulso por agradar', 'Sensibilidade a críticas', 'Foco disperso', 'Superficialidade em vínculos'],
      light: 'Sua presença muda ambientes e aproxima pessoas.',
      shadow: 'Quando cansado, sua leveza pode virar dispersão e sua sociabilidade pode virar dependência de aprovação.',
      triggers: ['Isolamento prolongado', 'Críticas públicas', 'Rotinas rígidas', 'Ambientes pesados'],
      healing: ['Conexões genuínas', 'Ambientes alegres', 'Novidades', 'Reconhecimento social'],
      nelloMessage: 'Você traz leveza aos lugares por onde passa. Mas cuidado: nem toda alegria é saúde. Às vezes você sorri para esconder. Aprenda a ser leve E profundo.',
      relationships: {
        style: 'No dia a dia, você ama com alegria e espontaneidade. Gosta de estar junto, fazer planos e manter a energia leve.',
        affection: 'Você mostra amor com palavras carinhosas, surpresas e presença animada. Para você, amor é compartilhar momentos.',
        communication: 'Você fala com entusiasmo e expressividade, mas às vezes pode falar demais ou não ouvir direito.',
        challenges: 'Pode parecer superficial ou inconstante. Pessoas próximas podem sentir que você não aprofunda conversas difíceis.',
        needs: 'Você precisa de atenção, validação e companhia. Solidão prolongada te afeta muito.'
      },
      work: {
        productivity: 'Você rende bem em ambientes dinâmicos, com interação e variedade. Rotina rígida te sufoca.',
        rhythm: 'Prefere alternar tarefas e ter novidades. Trabalhos criativos e relacionais te motivam mais.',
        motivation: 'Reconhecimento e novidades te impulsionam. Elogios e feedback positivo fazem diferença.',
        stress: 'Sob estresse, você dispersa ou busca distrações (redes sociais, conversas, etc). Foco é um desafio.',
        leadership: 'Você inspira e motiva, mas pode ter dificuldade com detalhes e acompanhamento.'
      },
      innerLife: {
        reflection: 'Você tende a preferir ação a reflexão profunda. Ficar parado com seus pensamentos é desconfortável.',
        silence: 'Silêncio prolongado é difícil. Você sente necessidade de estímulo externo constante.',
        growth: 'Você cresce através de conexões significativas e experiências marcantes com pessoas.',
        challenge: 'Seu maior desafio é aceitar momentos de solidão e usá-los para se conhecer melhor.'
      },
      expansion: ['Criar rotina emocional', 'Praticar constância', 'Reduzir impulsividade', 'Aprofundar vínculos', 'Aceitar momentos de solidão'],
      sevenDayPlan: [
        'Termine uma tarefa antes de começar outra',
        'Fique 15 minutos em silêncio',
        'Escreva o que está sentindo',
        'Diga não para algo que não quer fazer',
        'Aprofunde uma conversa com alguém',
        'Reflita sobre o que te motiva de verdade',
        'Celebre uma conquista sua'
      ]
    },
    en: {
      name: 'Sanguine',
      element: 'Air',
      elementIcon: '🌬️',
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50 dark:bg-amber-950/20',
      borderColor: 'border-amber-500/30',
      textColor: 'text-amber-700 dark:text-amber-400',
      chartColor: '#F59E0B',
      description: 'You tend to be expressive, sociable, and optimistic. Your response pattern is light, expansive, and communicative.',
      keyPhrases: [
        'Your presence brings lightness to environments',
        'You connect easily with people',
        'Novelties and experiences motivate you'
      ],
      strengths: ['Fluid communication', 'Natural sociability', 'Optimism', 'Relational creativity', 'Adaptability', 'Expressiveness'],
      fragilities: ['Difficulty with routine', 'Tendency to disorganization', 'Urge to please', 'Sensitivity to criticism', 'Scattered focus', 'Superficiality in bonds'],
      light: 'Your presence changes environments and brings people together.',
      shadow: 'When tired, your lightness can become dispersion and your sociability can become dependence on approval.',
      triggers: ['Prolonged isolation', 'Public criticism', 'Rigid routines', 'Heavy environments'],
      healing: ['Genuine connections', 'Joyful environments', 'Novelties', 'Social recognition'],
      nelloMessage: 'You bring lightness wherever you go. But be careful: not all joy is health. Sometimes you smile to hide. Learn to be light AND deep.',
      relationships: {
        style: 'You tend to love with expressiveness and enthusiasm.',
        affection: 'Shows affection with words, presence, and spontaneous gestures.',
        communication: 'Fluid, expressive, sometimes impulsive.',
        challenges: 'May have difficulty with depth and constancy.',
        needs: 'Attention, validation, and company.'
      },
      work: {
        productivity: 'High in dynamic environments.',
        rhythm: 'Prefers variety and interaction.',
        motivation: 'Recognition and novelties.',
        stress: 'Disperses or seeks distractions.',
        leadership: 'Inspiring, but may lack focus.'
      },
      innerLife: {
        reflection: 'Prefers action to deep reflection.',
        silence: 'Difficult to maintain for long periods.',
        growth: 'Through meaningful connections.',
        challenge: 'Accepting moments of solitude.'
      },
      expansion: ['Create emotional routine', 'Practice constancy', 'Reduce impulsivity', 'Deepen bonds', 'Accept moments of solitude'],
      sevenDayPlan: [
        'Finish one task before starting another',
        'Stay silent for 15 minutes',
        'Write down what you are feeling',
        'Say no to something you dont want to do',
        'Deepen a conversation with someone',
        'Reflect on what truly motivates you',
        'Celebrate one of your achievements'
      ]
    }
  },
  colerico: {
    pt: {
      name: 'Colérico',
      element: 'Fogo',
      elementIcon: '🔥',
      color: 'from-red-500 to-rose-500',
      bgColor: 'bg-red-50 dark:bg-red-950/20',
      borderColor: 'border-red-500/30',
      textColor: 'text-red-700 dark:text-red-400',
      chartColor: '#EF4444',
      description: 'Você tende a ser determinado, objetivo e orientado para resultados. Seu padrão de resposta é direto, decidido e focado.',
      keyPhrases: [
        'Você assume responsabilidades naturalmente',
        'Resultados te motivam',
        'Sua determinação abre caminhos'
      ],
      strengths: ['Decisão rápida', 'Liderança natural', 'Clareza de propósito', 'Coragem', 'Produtividade', 'Resolução de problemas'],
      fragilities: ['Dureza no trato pessoal', 'Impaciência', 'Dificuldade em delegar', 'Tendência a controlar', 'Pouca tolerância a erros', 'Desconexão emocional sob pressão'],
      light: 'Você abre caminhos que outros têm medo de atravessar.',
      shadow: 'Quando cansado, sua força pode virar dureza e sua determinação pode virar teimosia.',
      triggers: ['Lentidão', 'Desorganização', 'Falta de compromisso', 'Incompetência percebida'],
      healing: ['Momentos de silêncio', 'Reconhecimento do esforço', 'Resultados tangíveis', 'Desafios significativos'],
      nelloMessage: 'Vejo em você uma força que poucos têm. Quando você aprende a dosar essa intensidade, você se torna referência — não por imposição, mas por inspiração.',
      relationships: {
        style: 'No dia a dia, você costuma demonstrar amor através de atitudes práticas e proteção. Prefere resolver problemas a falar sobre sentimentos.',
        affection: 'Você mostra que se importa consertando coisas, resolvendo situações e defendendo quem ama. Para você, amor é ação.',
        communication: 'Você vai direto ao ponto e pode parecer duro sem perceber. Nas discussões do casal ou família, tende a querer "resolver logo".',
        challenges: 'Pessoas próximas podem sentir que você é distante ou controlador. Ouvir mais e aceitar outros ritmos ajuda.',
        needs: 'Você precisa sentir respeito e lealdade. Ser questionado o tempo todo te desgasta. Valoriza quem confia no seu julgamento.'
      },
      work: {
        productivity: 'Você rende muito, especialmente quando há prazos e metas claras. Pressão te foca, não te paralisa.',
        rhythm: 'Prefere ritmo acelerado. Reuniões longas e processos lentos te frustram. Trabalha melhor com autonomia.',
        motivation: 'Desafios novos e conquistas tangíveis te impulsionam. Você precisa ver resultados do seu esforço.',
        stress: 'Aguenta bem a pressão, mas pode explodir de repente. Irritabilidade é seu sinal de alerta. Pausas curtas ajudam.',
        leadership: 'Você lidera com clareza e cobrança. Seu time sabe o que fazer, mas pode te achar exigente demais.'
      },
      innerLife: {
        reflection: 'Você tende a preferir agir a refletir. Parar para pensar pode parecer perda de tempo, mas te traz clareza.',
        silence: 'Silêncio é difícil no início, mas quando você se permite, é onde encontra suas melhores respostas.',
        growth: 'Você cresce superando desafios. Cada obstáculo vencido te fortalece e te ensina sobre seus limites.',
        challenge: 'Seu maior desafio interno é aceitar vulnerabilidade. Admitir que não sabe algo não diminui sua força.'
      },
      expansion: ['Suavizar o tom nas conversas', 'Pausar antes de reagir', 'Ampliar a empatia', 'Praticar a escuta ativa', 'Aceitar que nem tudo depende de você'],
      sevenDayPlan: [
        'Ouça alguém sem interromper',
        'Pause 10 segundos antes de responder',
        'Peça desculpas por algo pequeno',
        'Faça algo lento de propósito',
        'Elogie alguém genuinamente',
        'Reflita sobre suas reações recentes',
        'Celebre uma vitória alheia'
      ]
    },
    en: {
      name: 'Choleric',
      element: 'Fire',
      elementIcon: '🔥',
      color: 'from-red-500 to-rose-500',
      bgColor: 'bg-red-50 dark:bg-red-950/20',
      borderColor: 'border-red-500/30',
      textColor: 'text-red-700 dark:text-red-400',
      chartColor: '#EF4444',
      description: 'You tend to be determined, objective, and results-oriented. Your response pattern is direct, decisive, and focused.',
      keyPhrases: [
        'You naturally take on responsibilities',
        'Results motivate you',
        'Your determination opens paths'
      ],
      strengths: ['Quick decisions', 'Natural leadership', 'Clarity of purpose', 'Courage', 'Productivity', 'Problem solving'],
      fragilities: ['Harshness in personal dealings', 'Impatience', 'Difficulty delegating', 'Tendency to control', 'Low tolerance for mistakes', 'Emotional disconnection under pressure'],
      light: 'You open paths that others are afraid to cross.',
      shadow: 'When tired, your strength can become harshness and your determination can become stubbornness.',
      triggers: ['Slowness', 'Disorganization', 'Lack of commitment', 'Perceived incompetence'],
      healing: ['Moments of silence', 'Recognition of effort', 'Tangible results', 'Meaningful challenges'],
      nelloMessage: 'I see in you a strength that few have. When you learn to dose this intensity, you become a reference — not by imposition, but by inspiration.',
      relationships: {
        style: 'You tend to love with intensity and protection.',
        affection: 'Shows affection by solving problems and protecting.',
        communication: 'Direct, objective, sometimes harsh.',
        challenges: 'May seem distant or controlling.',
        needs: 'Respect, loyalty, and space to lead.'
      },
      work: {
        productivity: 'High, especially under pressure.',
        rhythm: 'Fast-paced, results-oriented.',
        motivation: 'Challenges and achievements.',
        stress: 'Handles well but may explode.',
        leadership: 'Directive, demanding, efficient.'
      },
      innerLife: {
        reflection: 'Prefers action to reflection.',
        silence: 'Difficult at first, but transformative.',
        growth: 'Through overcome challenges.',
        challenge: 'Accepting vulnerability.'
      },
      expansion: ['Soften the tone in conversations', 'Pause before reacting', 'Expand empathy', 'Practice active listening', 'Accept that not everything depends on you'],
      sevenDayPlan: [
        'Listen to someone without interrupting',
        'Pause 10 seconds before responding',
        'Apologize for something small',
        'Do something slowly on purpose',
        'Genuinely compliment someone',
        'Reflect on your recent reactions',
        'Celebrate someone elses victory'
      ]
    }
  },
  melancolico: {
    pt: {
      name: 'Melancólico',
      element: 'Água',
      elementIcon: '💧',
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-700 dark:text-blue-400',
      chartColor: '#3B82F6',
      description: 'Você tende a ser reflexivo, detalhista e sensível. Seu padrão de resposta é profundo, cuidadoso e analítico.',
      keyPhrases: [
        'Você percebe detalhes que outros ignoram',
        'Qualidade importa mais que quantidade',
        'Sua reflexão traz profundidade'
      ],
      strengths: ['Profundidade emocional', 'Atenção aos detalhes', 'Capacidade analítica', 'Reflexão', 'Criatividade', 'Sensibilidade estética'],
      fragilities: ['Autocrítica excessiva', 'Timidez emocional', 'Medo de errar', 'Desânimo diante de caos', 'Perfeccionismo paralisante', 'Tendência à tristeza'],
      light: 'Você percebe o que outros não veem. Sua sensibilidade é profundidade.',
      shadow: 'Quando cansado, sua reflexão pode virar ruminação e sua sensibilidade pode virar fragilidade.',
      triggers: ['Caos e desorganização', 'Críticas injustas', 'Ambientes superficiais', 'Pressão por velocidade'],
      healing: ['Tempo para processar', 'Ambientes calmos', 'Expressão artística', 'Conversas profundas'],
      nelloMessage: 'Você carrega um universo interno que poucos conhecem. Sua profundidade é dom, não fardo. Aprenda a não se afogar no que sente. A clareza vem quando você para de se julgar.',
      relationships: {
        style: 'No dia a dia, você ama com profundidade e cuidado. Cada gesto é pensado, cada palavra tem peso.',
        affection: 'Você mostra amor com atenção aos detalhes, lembranças especiais e gestos que fazem sentido para a pessoa.',
        communication: 'Você pensa antes de falar e prefere conversas profundas. Pode parecer calado, mas está processando.',
        challenges: 'Pode ser difícil expressar o que precisa. Você espera que o outro perceba, e se frustra quando não acontece.',
        needs: 'Você precisa de compreensão, paciência e espaço para sentir sem pressa.'
      },
      work: {
        productivity: 'Você rende muito quando tem tempo e pode fazer com qualidade. Pressão por velocidade te paralisa.',
        rhythm: 'Prefere aprofundar do que fazer várias coisas superficialmente. Qualidade antes de quantidade.',
        motivation: 'Trabalhos com significado e excelência te motivam. Você precisa sentir que seu esforço importa.',
        stress: 'Sob estresse, você paralisa ou se isola. Autocrítica aumenta e você pode travar.',
        leadership: 'Você lidera com estratégia e cuidado, mas pode ser exigente demais consigo e com os outros.'
      },
      innerLife: {
        reflection: 'Reflexão é natural para você. Você pensa muito sobre suas emoções, decisões e relacionamentos.',
        silence: 'Você se sente confortável no silêncio. É onde processa e encontra clareza.',
        growth: 'Você cresce através de compreensão profunda e autoconhecimento. Cada insight te transforma.',
        challenge: 'Seu maior desafio é aceitar a imperfeição — sua e dos outros. Nem tudo precisa ser perfeito para ser bom.'
      },
      expansion: ['Reduzir autocrítica', 'Simplificar expectativas', 'Praticar ações rápidas', 'Fortalecer coragem emocional', 'Aceitar imperfeição'],
      sevenDayPlan: [
        'Nomeie um sentimento sem julgá-lo',
        'Aja sem esperar perfeição',
        'Fale uma verdade com calma',
        'Ignore um pensamento crítico',
        'Faça algo leve sem culpa',
        'Escreva sobre o que te pesa',
        'Honre sua sensibilidade como dom'
      ]
    },
    en: {
      name: 'Melancholic',
      element: 'Water',
      elementIcon: '💧',
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-700 dark:text-blue-400',
      chartColor: '#3B82F6',
      description: 'You tend to be reflective, detail-oriented, and sensitive. Your response pattern is deep, careful, and analytical.',
      keyPhrases: [
        'You notice details others ignore',
        'Quality matters more than quantity',
        'Your reflection brings depth'
      ],
      strengths: ['Emotional depth', 'Attention to detail', 'Analytical capacity', 'Reflection', 'Creativity', 'Aesthetic sensitivity'],
      fragilities: ['Excessive self-criticism', 'Emotional shyness', 'Fear of making mistakes', 'Discouragement in chaos', 'Paralyzing perfectionism', 'Tendency to sadness'],
      light: 'You perceive what others cannot see. Your sensitivity is depth.',
      shadow: 'When tired, your reflection can become rumination and your sensitivity can become fragility.',
      triggers: ['Chaos and disorganization', 'Unfair criticism', 'Superficial environments', 'Pressure for speed'],
      healing: ['Time to process', 'Calm environments', 'Artistic expression', 'Deep conversations'],
      nelloMessage: 'You carry an inner universe that few know. Your depth is a gift, not a burden. Learn not to drown in what you feel. Clarity comes when you stop judging yourself.',
      relationships: {
        style: 'You tend to love with depth and care.',
        affection: 'Shows affection with thoughtful gestures and attention to detail.',
        communication: 'Careful, reflective, sometimes silent.',
        challenges: 'May have difficulty expressing needs.',
        needs: 'Understanding, patience, and space to feel.'
      },
      work: {
        productivity: 'High when there is time and quality.',
        rhythm: 'Prefers depth to speed.',
        motivation: 'Meaning and excellence.',
        stress: 'Freezes or isolates.',
        leadership: 'Strategic, careful, demanding.'
      },
      innerLife: {
        reflection: 'Natural and deep.',
        silence: 'Comfortable and necessary.',
        growth: 'Through understanding and self-knowledge.',
        challenge: 'Accepting imperfection.'
      },
      expansion: ['Reduce self-criticism', 'Simplify expectations', 'Practice quick actions', 'Strengthen emotional courage', 'Accept imperfection'],
      sevenDayPlan: [
        'Name a feeling without judging it',
        'Act without expecting perfection',
        'Speak a truth calmly',
        'Ignore a critical thought',
        'Do something light without guilt',
        'Write about what weighs on you',
        'Honor your sensitivity as a gift'
      ]
    }
  },
  fleumatico: {
    pt: {
      name: 'Fleumático',
      element: 'Terra',
      elementIcon: '🌍',
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
      borderColor: 'border-emerald-500/30',
      textColor: 'text-emerald-700 dark:text-emerald-400',
      chartColor: '#10B981',
      description: 'Você tende a ser calmo, paciente e estável. Seu padrão de resposta é equilibrado, constante e harmonioso.',
      keyPhrases: [
        'Sua calma é refúgio para quem te cerca',
        'Você traz estabilidade aos ambientes',
        'Harmonia te guia'
      ],
      strengths: ['Paciência', 'Equilíbrio emocional', 'Capacidade de mediação', 'Lealdade', 'Escuta atenta', 'Consistência'],
      fragilities: ['Medo de conflito', 'Passividade excessiva', 'Dificuldade em decidir', 'Resistência a mudanças', 'Tendência a postergar', 'Dificuldade em expressar necessidades'],
      light: 'Você é estabilidade em meio à turbulência. Sua calma é refúgio.',
      shadow: 'Quando cansado, sua paz pode virar passividade e sua paciência pode virar acomodação.',
      triggers: ['Conflitos intensos', 'Mudanças bruscas', 'Pressão por decisões rápidas', 'Ambientes caóticos'],
      healing: ['Rotina estável', 'Tempo para processar', 'Ambientes calmos', 'Reconhecimento silencioso'],
      nelloMessage: 'Sua paz é real, mas às vezes você se esconde nela. A tranquilidade é sua força — mas não pode virar prisão. Você precisa aprender a agir, mesmo sem garantias.',
      relationships: {
        style: 'No dia a dia, você ama com constância e lealdade. Não é de grandes gestos, mas está sempre presente.',
        affection: 'Você mostra amor com presença estável e suporte silencioso. Estar lá quando precisam já é sua declaração.',
        communication: 'Você fala pouco, mas ouve muito. Nas discussões, tende a evitar conflito e pode guardar ressentimentos.',
        challenges: 'Pode ser difícil expressar o que você precisa. Outros podem não perceber quando algo te incomoda.',
        needs: 'Você precisa de estabilidade, paz e tempo para processar as coisas no seu ritmo.'
      },
      work: {
        productivity: 'Você é constante e confiável. Não é o mais rápido, mas entrega com consistência.',
        rhythm: 'Prefere rotina e previsibilidade. Mudanças frequentes te desequilibram.',
        motivation: 'Segurança e harmonia no ambiente te motivam. Você rende melhor em times estáveis.',
        stress: 'Sob estresse, você paralisa ou se acomoda. Pode evitar decisões necessárias.',
        leadership: 'Você lidera com diplomacia e paciência, mas pode ser passivo demais em momentos de decisão.'
      },
      innerLife: {
        reflection: 'Sua reflexão é prática e tranquila. Você não se perde em pensamentos, mas processa no seu tempo.',
        silence: 'Silêncio é natural e restaurador para você. É onde você recarrega.',
        growth: 'Você cresce através de estabilidade e rotina. Mudanças graduais funcionam melhor.',
        challenge: 'Seu maior desafio é aceitar mudanças necessárias e agir mesmo quando não se sente pronto.'
      },
      expansion: ['Tomar mais iniciativa', 'Expressar desejos claramente', 'Aceitar mudanças', 'Confrontar com gentileza', 'Celebrar pequenas vitórias'],
      sevenDayPlan: [
        'Tome uma decisão sem consultar ninguém',
        'Expresse uma opinião em público',
        'Faça algo novo sem planejar',
        'Diga o que precisa a alguém',
        'Comece algo antes de terminar outra coisa',
        'Reflita sobre o que está adiando',
        'Celebre uma conquista em voz alta'
      ]
    },
    en: {
      name: 'Phlegmatic',
      element: 'Earth',
      elementIcon: '🌍',
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
      borderColor: 'border-emerald-500/30',
      textColor: 'text-emerald-700 dark:text-emerald-400',
      chartColor: '#10B981',
      description: 'You tend to be calm, patient, and stable. Your response pattern is balanced, constant, and harmonious.',
      keyPhrases: [
        'Your calm is a refuge for those around you',
        'You bring stability to environments',
        'Harmony guides you'
      ],
      strengths: ['Patience', 'Emotional balance', 'Mediation ability', 'Loyalty', 'Attentive listening', 'Consistency'],
      fragilities: ['Fear of conflict', 'Excessive passivity', 'Difficulty deciding', 'Resistance to change', 'Tendency to procrastinate', 'Difficulty expressing needs'],
      light: 'You are stability in the midst of turbulence. Your calm is a refuge.',
      shadow: 'When tired, your peace can become passivity and your patience can become accommodation.',
      triggers: ['Intense conflicts', 'Sudden changes', 'Pressure for quick decisions', 'Chaotic environments'],
      healing: ['Stable routine', 'Time to process', 'Calm environments', 'Silent recognition'],
      nelloMessage: 'Your peace is real, but sometimes you hide in it. Tranquility is your strength — but it cannot become a prison. You need to learn to act, even without guarantees.',
      relationships: {
        style: 'You tend to love with constancy and loyalty.',
        affection: 'Shows affection with stable presence and silent support.',
        communication: 'Calm, thoughtful, sometimes too silent.',
        challenges: 'May have difficulty expressing needs.',
        needs: 'Stability, peace, and time.'
      },
      work: {
        productivity: 'Constant and reliable.',
        rhythm: 'Prefers stability and predictability.',
        motivation: 'Security and harmony.',
        stress: 'Freezes or accommodates.',
        leadership: 'Diplomatic, patient, sometimes passive.'
      },
      innerLife: {
        reflection: 'Present but practical.',
        silence: 'Natural and restorative.',
        growth: 'Through stability and routine.',
        challenge: 'Accepting necessary changes.'
      },
      expansion: ['Take more initiative', 'Express desires clearly', 'Accept changes', 'Confront with kindness', 'Celebrate small victories'],
      sevenDayPlan: [
        'Make a decision without consulting anyone',
        'Express an opinion in public',
        'Do something new without planning',
        'Tell someone what you need',
        'Start something before finishing another thing',
        'Reflect on what you are postponing',
        'Celebrate an achievement out loud'
      ]
    }
  }
};

const getLabels = (lang: string) => {
  const labels: Record<string, Record<string, string>> = {
    pt: {
      yourTemperament: 'Temperamentos',
      completedOn: 'Concluído em',
      yourEmotionalMap: 'este é o seu mapa emocional',
      dominantTemperament: 'Temperamento Dominante',
      secondaryTemperament: 'Temperamento Secundário',
      points: 'pontos',
      element: 'Elemento',
      closeSecondaryWarning: 'Seu primário e secundário estão muito próximos. Isso indica um perfil misto e rico.',
      yourStrengths: 'Suas Tendências Naturais',
      naturalGifts: 'Padrões que fazem de você quem é',
      vulnerabilities: 'Áreas de Atenção',
      areasOfGrowth: 'Padrões que pedem cuidado',
      yourLight: 'Sua Clareza',
      nelloMessage: 'Mensagem do Nello AI',
      expansionPoints: 'Pontos de Desenvolvimento',
      pathToGrowth: 'Seu caminho de evolução',
      sevenDayPlan: 'Plano de 7 Dias',
      practicalEvolution: 'Práticas diárias para sua evolução',
      day: 'Dia',
      scoresBreakdown: 'Seus Scores por Temperamento',
      howCalculated: 'Como seu resultado foi calculado',
      emotionalPatterns: 'Padrões Emocionais',
      emotionalPatternsDesc: 'Como você tende a reagir emocionalmente',
      shadow: 'Sua Sombra',
      shadowDesc: 'Tendências e riscos quando sob pressão',
      triggersAndHealing: 'O que te Desestabiliza e o que te Estabiliza',
      triggers: 'Gatilhos',
      healing: 'Estabilizadores',
      relationships: 'Impacto em Relacionamentos',
      relationshipsDesc: 'Como seu temperamento influencia seus vínculos',
      work: 'Impacto no Trabalho',
      workDesc: 'Como seu temperamento influencia sua produtividade',
      innerLife: 'Impacto na Vida Interior',
      innerLifeDesc: 'Como seu temperamento influencia sua reflexão',
      selfExam: 'Pergunta de Autoexame',
      selfExamQuestion: 'Que padrão emocional você percebe com frequência, mas ainda não compreendeu plenamente?',
      seeMore: 'Ver mais',
      seeLess: 'Ver menos',
      disclaimer: 'Este teste indica tendências, não define sua identidade e não é diagnóstico clínico.',
      radarTitle: 'Mapa Visual dos Temperamentos',
      markAsDone: 'Marcar como feito',
      completed: 'Concluído',
      // Relationship labels
      rel_style: 'Estilo',
      rel_affection: 'Demonstração de Afeto',
      rel_communication: 'Comunicação',
      rel_challenges: 'Desafios',
      rel_needs: 'Necessidades',
      // Work labels
      work_productivity: 'Produtividade',
      work_rhythm: 'Ritmo',
      work_motivation: 'Motivação',
      work_stress: 'Sob Estresse',
      work_leadership: 'Liderança',
      // Inner life labels
      inner_reflection: 'Reflexão',
      inner_silence: 'Silêncio',
      inner_growth: 'Crescimento',
      inner_challenge: 'Desafio'
    },
    'pt-pt': {
      yourTemperament: 'Temperamentos',
      completedOn: 'Concluído em',
      yourEmotionalMap: 'este é o teu mapa emocional',
      dominantTemperament: 'Temperamento Dominante',
      secondaryTemperament: 'Temperamento Secundário',
      points: 'pontos',
      element: 'Elemento',
      closeSecondaryWarning: 'O teu primário e secundário estão muito próximos. Isso indica um perfil misto e rico.',
      yourStrengths: 'As Tuas Tendências Naturais',
      naturalGifts: 'Padrões que fazem de ti quem és',
      vulnerabilities: 'Áreas de Atenção',
      areasOfGrowth: 'Padrões que pedem cuidado',
      yourLight: 'A Tua Clareza',
      nelloMessage: 'Mensagem do Nello AI',
      expansionPoints: 'Pontos de Desenvolvimento',
      pathToGrowth: 'O teu caminho de evolução',
      sevenDayPlan: 'Plano de 7 Dias',
      practicalEvolution: 'Práticas diárias para a tua evolução',
      day: 'Dia',
      scoresBreakdown: 'Os Teus Scores por Temperamento',
      howCalculated: 'Como o teu resultado foi calculado',
      emotionalPatterns: 'Padrões Emocionais',
      emotionalPatternsDesc: 'Como tendes a reagir emocionalmente',
      shadow: 'A Tua Sombra',
      shadowDesc: 'Tendências e riscos quando sob pressão',
      triggersAndHealing: 'O que te Desestabiliza e o que te Estabiliza',
      triggers: 'Gatilhos',
      healing: 'Estabilizadores',
      relationships: 'Impacto em Relacionamentos',
      relationshipsDesc: 'Como o teu temperamento influencia os teus vínculos',
      work: 'Impacto no Trabalho',
      workDesc: 'Como o teu temperamento influencia a tua produtividade',
      innerLife: 'Impacto na Vida Interior',
      innerLifeDesc: 'Como o teu temperamento influencia a tua reflexão',
      selfExam: 'Pergunta de Autoexame',
      selfExamQuestion: 'Que padrão emocional percebes com frequência, mas ainda não compreendeste plenamente?',
      seeMore: 'Ver mais',
      seeLess: 'Ver menos',
      disclaimer: 'Este teste indica tendências, não define a tua identidade e não é diagnóstico clínico.',
      radarTitle: 'Mapa Visual dos Temperamentos',
      markAsDone: 'Marcar como feito',
      completed: 'Concluído',
      // Relationship labels
      rel_style: 'Estilo',
      rel_affection: 'Demonstração de Afeto',
      rel_communication: 'Comunicação',
      rel_challenges: 'Desafios',
      rel_needs: 'Necessidades',
      // Work labels
      work_productivity: 'Produtividade',
      work_rhythm: 'Ritmo',
      work_motivation: 'Motivação',
      work_stress: 'Sob Estresse',
      work_leadership: 'Liderança',
      // Inner life labels
      inner_reflection: 'Reflexão',
      inner_silence: 'Silêncio',
      inner_growth: 'Crescimento',
      inner_challenge: 'Desafio'
    },
    en: {
      yourTemperament: 'Temperaments',
      completedOn: 'Completed on',
      yourEmotionalMap: 'this is your emotional map',
      dominantTemperament: 'Dominant Temperament',
      secondaryTemperament: 'Secondary Temperament',
      points: 'points',
      element: 'Element',
      closeSecondaryWarning: 'Your primary and secondary are very close. This indicates a mixed and rich profile.',
      yourStrengths: 'Your Natural Tendencies',
      naturalGifts: 'Patterns that make you who you are',
      vulnerabilities: 'Areas of Attention',
      areasOfGrowth: 'Patterns that need care',
      yourLight: 'Your Clarity',
      nelloMessage: 'Message from Nello AI',
      expansionPoints: 'Development Points',
      pathToGrowth: 'Your path to evolution',
      sevenDayPlan: '7-Day Plan',
      practicalEvolution: 'Daily practices for your evolution',
      day: 'Day',
      scoresBreakdown: 'Your Scores by Temperament',
      howCalculated: 'How your result was calculated',
      emotionalPatterns: 'Emotional Patterns',
      emotionalPatternsDesc: 'How you tend to react emotionally',
      shadow: 'Your Shadow',
      shadowDesc: 'Tendencies and risks when under pressure',
      triggersAndHealing: 'What Destabilizes and Stabilizes You',
      triggers: 'Triggers',
      healing: 'Stabilizers',
      relationships: 'Impact on Relationships',
      relationshipsDesc: 'How your temperament influences your bonds',
      work: 'Impact on Work',
      workDesc: 'How your temperament influences your productivity',
      innerLife: 'Impact on Inner Life',
      innerLifeDesc: 'How your temperament influences your reflection',
      selfExam: 'Self-Examination Question',
      selfExamQuestion: 'What emotional pattern do you notice frequently but have not yet fully understood?',
      seeMore: 'See more',
      seeLess: 'See less',
      disclaimer: 'This test indicates tendencies, does not define your identity, and is not a clinical diagnosis.',
      radarTitle: 'Visual Map of Temperaments',
      markAsDone: 'Mark as done',
      completed: 'Completed',
      // Relationship labels
      rel_style: 'Style',
      rel_affection: 'Affection',
      rel_communication: 'Communication',
      rel_challenges: 'Challenges',
      rel_needs: 'Needs',
      // Work labels
      work_productivity: 'Productivity',
      work_rhythm: 'Rhythm',
      work_motivation: 'Motivation',
      work_stress: 'Under Stress',
      work_leadership: 'Leadership',
      // Inner life labels
      inner_reflection: 'Reflection',
      inner_silence: 'Silence',
      inner_growth: 'Growth',
      inner_challenge: 'Challenge'
    }
  };
  return labels[lang] || labels['pt'];
};

// Collapsible Section Component
function CollapsibleSection({ 
  title, 
  icon: Icon, 
  children, 
  defaultOpen = false,
  className = ""
}: { 
  title: string; 
  icon: React.ElementType; 
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card className={`border border-border/50 ${className}`}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full">
          <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Icon className="h-5 w-5 text-primary" />
                {title}
              </CardTitle>
              {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            {children}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

export function TemperamentosResultsSection({ temperamentosResults, lang, userName = '' }: TemperamentosResultsSectionProps) {
  const labels = getLabels(lang);
  const effectiveLang = lang === 'pt-pt' ? 'pt' : lang;
  const { user } = useAuth();
  
  // State for 7-day plan progress
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [loadingDays, setLoadingDays] = useState(true);
  
  // Normalize legacy results if needed
  const normalizedResults = isLegacyResult(temperamentosResults) 
    ? { ...temperamentosResults, ...normalizeLegacyResult(temperamentosResults) }
    : temperamentosResults;
  
  // Get first name only
  const firstName = userName ? userName.split(' ')[0] : '';
  const displayName = firstName || (lang === 'en' ? 'You' : 'Você');
  
  // Load 7-day plan progress
  useEffect(() => {
    async function loadProgress() {
      if (!user?.id) {
        setLoadingDays(false);
        return;
      }
      
      const { data } = await supabase
        .from('test_evolution_progress')
        .select('day_number')
        .eq('user_id', user.id)
        .eq('test_type', 'temperamentos');
      
      if (data) {
        setCompletedDays(data.map(d => d.day_number));
      }
      setLoadingDays(false);
    }
    loadProgress();
  }, [user?.id]);
  
  // Toggle day completion
  const toggleDay = async (dayNumber: number) => {
    if (!user?.id) return;
    
    const isCompleted = completedDays.includes(dayNumber);
    
    if (isCompleted) {
      await supabase
        .from('test_evolution_progress')
        .delete()
        .eq('user_id', user.id)
        .eq('test_type', 'temperamentos')
        .eq('day_number', dayNumber);
      
      setCompletedDays(prev => prev.filter(d => d !== dayNumber));
    } else {
      await supabase
        .from('test_evolution_progress')
        .insert({
          user_id: user.id,
          test_type: 'temperamentos',
          day_number: dayNumber,
          completed_at: new Date().toISOString()
        });
      
      setCompletedDays(prev => [...prev, dayNumber]);
    }
  };

  // Safety checks
  if (!normalizedResults?.primary?.temperament || !normalizedResults?.secondary?.temperament) {
    console.error('TemperamentosResultsSection: Missing required data', normalizedResults);
    return null;
  }
  
  const primaryKey = normalizedResults.primary.temperament as keyof typeof TEMPERAMENT_DATA;
  const secondaryKey = normalizedResults.secondary.temperament as keyof typeof TEMPERAMENT_DATA;
  
  const primaryData = TEMPERAMENT_DATA[primaryKey]?.[effectiveLang] || TEMPERAMENT_DATA[primaryKey]?.pt;
  const secondaryData = TEMPERAMENT_DATA[secondaryKey]?.[effectiveLang] || TEMPERAMENT_DATA[secondaryKey]?.pt;
  
  if (!primaryData || !secondaryData) {
    console.error('TemperamentosResultsSection: Invalid temperament keys', { primaryKey, secondaryKey });
    return null;
  }

  // Get percentages (with fallback for legacy)
  const percentages = normalizedResults.percentages || {
    sanguineo: Math.round((normalizedResults.scores?.sanguineo || 0) / 40 * 100),
    colerico: Math.round((normalizedResults.scores?.colerico || 0) / 40 * 100),
    melancolico: Math.round((normalizedResults.scores?.melancolico || 0) / 40 * 100),
    fleumatico: Math.round((normalizedResults.scores?.fleumatico || 0) / 40 * 100)
  };

  // Prepare radar chart data
  const radarData = [
    { 
      temperament: TEMPERAMENT_DATA.colerico[effectiveLang]?.name || 'Colérico', 
      value: percentages.colerico,
      fullMark: 100 
    },
    { 
      temperament: TEMPERAMENT_DATA.sanguineo[effectiveLang]?.name || 'Sanguíneo', 
      value: percentages.sanguineo,
      fullMark: 100 
    },
    { 
      temperament: TEMPERAMENT_DATA.melancolico[effectiveLang]?.name || 'Melancólico', 
      value: percentages.melancolico,
      fullMark: 100 
    },
    { 
      temperament: TEMPERAMENT_DATA.fleumatico[effectiveLang]?.name || 'Fleumático', 
      value: percentages.fleumatico,
      fullMark: 100 
    }
  ];

  const scores = normalizedResults.scores || { sanguineo: 0, colerico: 0, melancolico: 0, fleumatico: 0 };
  
  const temperamentOrder = [
    { key: 'colerico' as TemperamentType, score: scores.colerico || 0, percentage: percentages.colerico },
    { key: 'sanguineo' as TemperamentType, score: scores.sanguineo || 0, percentage: percentages.sanguineo },
    { key: 'melancolico' as TemperamentType, score: scores.melancolico || 0, percentage: percentages.melancolico },
    { key: 'fleumatico' as TemperamentType, score: scores.fleumatico || 0, percentage: percentages.fleumatico }
  ].sort((a, b) => b.score - a.score);

  // Format completion date
  const completedAt = normalizedResults.completed_at 
    ? new Date(normalizedResults.completed_at).toLocaleDateString(lang === 'en' ? 'en-US' : 'pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : '';

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-none shadow-lg overflow-hidden">
        <CardHeader className={`bg-gradient-to-r ${primaryData.color} pb-8`}>
          <div className="text-center space-y-3">
            <div className="text-5xl">{primaryData.elementIcon}</div>
            <CardTitle className="text-3xl font-light text-white">{labels.yourTemperament}</CardTitle>
            {completedAt && (
              <p className="text-white/70 text-sm">{labels.completedOn} {completedAt}</p>
            )}
            <CardDescription className="text-xl text-white/90 font-medium">
              {displayName}, {labels.yourEmotionalMap}
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      {/* Disclaimer */}
      <div className="text-center text-sm text-muted-foreground bg-muted/30 rounded-lg p-3">
        {labels.disclaimer}
      </div>

      {/* Primary and Secondary Temperaments */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className={`border-2 ${primaryData.borderColor} ${primaryData.bgColor}`}>
          <CardHeader>
            <CardTitle className={`text-xl flex items-center gap-2 ${primaryData.textColor}`}>
              <span className="text-3xl">{primaryData.elementIcon}</span>
              {labels.dominantTemperament}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-2xl font-semibold">{primaryData.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{labels.element}: {primaryData.element}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="default" className="text-lg px-4 py-2">
                {normalizedResults.primary.score || scores[primaryKey]} {labels.points}
              </Badge>
              <Badge variant="outline" className="text-lg px-4 py-2">
                {percentages[primaryKey]}%
              </Badge>
            </div>
            <p className="text-base leading-relaxed">
              {primaryData.description}
            </p>
            <ul className="space-y-2 pt-2">
              {primaryData.keyPhrases.map((phrase, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle className={`h-4 w-4 ${primaryData.textColor} mt-0.5 flex-shrink-0`} />
                  <span>{phrase}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-2 border-muted">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <span className="text-3xl">{secondaryData.elementIcon}</span>
              {labels.secondaryTemperament}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-2xl font-semibold">{secondaryData.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{labels.element}: {secondaryData.element}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-lg px-4 py-2">
                {normalizedResults.secondary.score || scores[secondaryKey]} {labels.points}
              </Badge>
              <Badge variant="outline" className="text-lg px-4 py-2">
                {percentages[secondaryKey]}%
              </Badge>
            </div>
            <p className="text-base leading-relaxed">
              {secondaryData.description}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Close Secondary Warning */}
      {normalizedResults.closeSecondary && (
        <Card className="border-2 border-primary/30 bg-primary/5">
          <CardContent className="py-4">
            <p className="text-center text-primary font-medium flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5" />
              {labels.closeSecondaryWarning}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Radar Chart */}
      <Card className="border border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            {labels.radarTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis 
                  dataKey="temperament" 
                  tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                />
                <Radar
                  name="Temperamento"
                  dataKey="value"
                  stroke={primaryData.chartColor}
                  fill={primaryData.chartColor}
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Scores Breakdown */}
      <Card className="border border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            {labels.scoresBreakdown}
          </CardTitle>
          <CardDescription>{labels.howCalculated}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {temperamentOrder.map((temp) => {
            const tempData = TEMPERAMENT_DATA[temp.key]?.[effectiveLang] || TEMPERAMENT_DATA[temp.key]?.pt;
            const isPrimary = temp.key === primaryKey;
            
            return (
              <div key={temp.key} className={`p-4 rounded-lg border-2 ${isPrimary ? `${tempData?.bgColor} ${tempData?.borderColor}` : 'bg-muted/30 border-border'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium flex items-center gap-2">
                    <span>{tempData?.elementIcon}</span>
                    {tempData?.name}
                  </span>
                  <span className="text-lg font-bold">{temp.score} pts ({temp.percentage}%)</span>
                </div>
                <Progress value={temp.percentage} className="h-2" />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Strengths */}
      <Card className={`border-2 ${primaryData.borderColor} ${primaryData.bgColor}`}>
        <CardHeader>
          <CardTitle className={`text-xl flex items-center gap-2 ${primaryData.textColor}`}>
            <CheckCircle className="h-5 w-5" />
            {labels.yourStrengths}
          </CardTitle>
          <CardDescription>{labels.naturalGifts}</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="grid md:grid-cols-2 gap-3">
            {primaryData.strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className={`h-5 w-5 ${primaryData.textColor} mt-0.5 flex-shrink-0`} />
                <span className="text-foreground">{strength}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Vulnerabilities */}
      <Card className="border-2 border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2 text-amber-700 dark:text-amber-400">
            <AlertTriangle className="h-5 w-5" />
            {labels.vulnerabilities}
          </CardTitle>
          <CardDescription>{labels.areasOfGrowth}</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="grid md:grid-cols-2 gap-3">
            {primaryData.fragilities.map((fragility, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="h-5 w-5 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 text-xs font-medium mt-0.5 flex-shrink-0">
                  {index + 1}
                </span>
                <span className="text-foreground">{fragility}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Collapsible Deep Content Sections */}
      <CollapsibleSection title={labels.emotionalPatterns} icon={Brain} defaultOpen>
        <div className="space-y-4">
          <p className="text-muted-foreground">{labels.emotionalPatternsDesc}</p>
          <div className="bg-background/80 rounded-lg p-4 border border-border/50">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              {labels.yourLight}
            </h4>
            <p className="text-foreground italic">"{primaryData.light}"</p>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title={labels.shadow} icon={Shield}>
        <div className="space-y-4">
          <p className="text-muted-foreground">{labels.shadowDesc}</p>
          <div className="bg-amber-50/50 dark:bg-amber-950/20 rounded-lg p-4 border border-amber-500/30">
            <p className="text-foreground">{primaryData.shadow}</p>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title={labels.triggersAndHealing} icon={Heart}>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-red-50/50 dark:bg-red-950/20 rounded-lg p-4 border border-red-500/30">
            <h4 className="font-semibold text-red-700 dark:text-red-400 mb-3">{labels.triggers}</h4>
            <ul className="space-y-2">
              {primaryData.triggers.map((trigger, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-red-500">•</span>
                  <span>{trigger}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-green-50/50 dark:bg-green-950/20 rounded-lg p-4 border border-green-500/30">
            <h4 className="font-semibold text-green-700 dark:text-green-400 mb-3">{labels.healing}</h4>
            <ul className="space-y-2">
              {primaryData.healing.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-green-500">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title={labels.relationships} icon={User}>
        <div className="space-y-4">
          <p className="text-muted-foreground">{labels.relationshipsDesc}</p>
          <div className="grid gap-3">
            {Object.entries(primaryData.relationships).map(([key, value]) => {
              const labelKey = `rel_${key}` as keyof typeof labels;
              const translatedLabel = labels[labelKey] || key;
              return (
                <div key={key} className="bg-background/80 rounded-lg p-3 border border-border/50">
                  <span className="font-medium">{translatedLabel}: </span>
                  <span className="text-muted-foreground">{value}</span>
                </div>
              );
            })}
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title={labels.work} icon={Briefcase}>
        <div className="space-y-4">
          <p className="text-muted-foreground">{labels.workDesc}</p>
          <div className="grid gap-3">
            {Object.entries(primaryData.work).map(([key, value]) => {
              const labelKey = `work_${key}` as keyof typeof labels;
              const translatedLabel = labels[labelKey] || key;
              return (
                <div key={key} className="bg-background/80 rounded-lg p-3 border border-border/50">
                  <span className="font-medium">{translatedLabel}: </span>
                  <span className="text-muted-foreground">{value}</span>
                </div>
              );
            })}
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title={labels.innerLife} icon={Heart}>
        <div className="space-y-4">
          <p className="text-muted-foreground">{labels.innerLifeDesc}</p>
          <div className="grid gap-3">
            {Object.entries(primaryData.innerLife).map(([key, value]) => {
              const labelKey = `inner_${key}` as keyof typeof labels;
              const translatedLabel = labels[labelKey] || key;
              return (
                <div key={key} className="bg-background/80 rounded-lg p-3 border border-border/50">
                  <span className="font-medium">{translatedLabel}: </span>
                  <span className="text-muted-foreground">{value}</span>
                </div>
              );
            })}
          </div>
        </div>
      </CollapsibleSection>

      {/* Expansion Points */}
      <Card className="border-2 border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2 text-primary">
            <Lightbulb className="h-5 w-5" />
            {labels.expansionPoints}
          </CardTitle>
          <CardDescription>{labels.pathToGrowth}</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {primaryData.expansion.map((point, index) => (
              <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-background/80 border border-border/50">
                <span className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-semibold flex-shrink-0">
                  {index + 1}
                </span>
                <span className="text-foreground leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Self-Exam Question */}
      <Card className="bg-gradient-to-br from-accent/10 to-background border-accent/30">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Brain className="h-5 w-5 text-accent" />
            {labels.selfExam}
          </div>
          <p className="text-lg leading-relaxed pl-7 italic text-muted-foreground">
            "{labels.selfExamQuestion}"
          </p>
        </CardContent>
      </Card>

      {/* 7-Day Plan with Checkboxes */}
      <Card className="border-2 border-accent/30 bg-accent/5">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2 text-accent">
            <Calendar className="h-5 w-5" />
            {labels.sevenDayPlan}
          </CardTitle>
          <CardDescription>{labels.practicalEvolution}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            {primaryData.sevenDayPlan.map((task, index) => {
              const dayNumber = index + 1;
              const isCompleted = completedDays.includes(dayNumber);
              
              return (
                <div 
                  key={index} 
                  className={`flex items-start gap-3 p-4 rounded-lg border transition-colors ${
                    isCompleted 
                      ? 'bg-green-50 dark:bg-green-950/20 border-green-500/30' 
                      : 'bg-background/80 border-border/50'
                  }`}
                >
                  <Checkbox
                    id={`day-${dayNumber}`}
                    checked={isCompleted}
                    onCheckedChange={() => toggleDay(dayNumber)}
                    disabled={loadingDays || !user?.id}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <label 
                      htmlFor={`day-${dayNumber}`}
                      className={`cursor-pointer ${isCompleted ? 'line-through text-muted-foreground' : ''}`}
                    >
                      <Badge variant={isCompleted ? "default" : "outline"} className="mb-2">
                        {labels.day} {dayNumber} {isCompleted && `✓`}
                      </Badge>
                      <p className="text-sm">{task}</p>
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Nello AI's Message */}
      <Card className="bg-gradient-to-br from-accent/20 to-background border-accent/30">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <MessageCircle className="h-5 w-5 text-accent" />
            {labels.nelloMessage}
          </div>
          <p className="text-base leading-relaxed pl-7 text-muted-foreground whitespace-pre-line">
            {primaryData.nelloMessage}
          </p>
        </CardContent>
      </Card>

      {/* Interpretation */}
      <Card className="bg-gradient-to-br from-primary/10 to-background border-primary/30">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Heart className="h-5 w-5 text-primary" />
            {lang === 'en' ? 'Your Personalized Interpretation' : 'Interpretação Personalizada'}
          </div>
          <p className="text-base leading-relaxed pl-7 whitespace-pre-line text-muted-foreground">
            {normalizedResults.interpretation}
          </p>
        </CardContent>
      </Card>

      <div className="text-center py-8">
        <p className="text-lg font-light italic text-muted-foreground">
          NELLO ONE — {lang === 'en' ? 'a journey of self-knowledge and personal truth.' : 'uma jornada de autoconhecimento e verdade pessoal.'}
        </p>
      </div>
    </div>
  );
}
