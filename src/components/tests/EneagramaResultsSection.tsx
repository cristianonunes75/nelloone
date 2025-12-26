import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, AlertTriangle, Lightbulb, Star, TrendingUp, Heart, Target, Shield, 
  Sparkles, Calendar, ChevronDown, Users, Briefcase, Eye, Flame, Brain, Zap,
  Info
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Rich Enneagram profile data with extended content from PDF
const ENNEAGRAM_PROFILES_RICH: Record<string, Record<string, any>> = {
  "1": {
    name: { pt: 'O Perfeccionista', 'pt-pt': 'O Perfeccionista', en: 'The Perfectionist' },
    emoji: '⚖️',
    color: '#8B5CF6',
    essence: { pt: 'Perfeição divina, integridade', 'pt-pt': 'Perfeição divina, integridade', en: 'Divine perfection, integrity' },
    description: {
      pt: 'Você é movido pela busca da integridade e da perfeição. Sua energia é ética, disciplinada e guiada por princípios elevados. Você vê o mundo como pode ser melhorado.',
      'pt-pt': 'És movido pela busca da integridade e da perfeição. A tua energia é ética, disciplinada e guiada por princípios elevados. Tu vês o mundo como pode ser melhorado.',
      en: 'You are driven by the pursuit of integrity and perfection. Your energy is ethical, disciplined, and guided by high principles. You see the world as it can be improved.'
    },
    ego: {
      pt: 'Eu preciso ser perfeito para ser digno de amor.',
      'pt-pt': 'Eu preciso ser perfeito para ser digno de amor.',
      en: 'I need to be perfect to be worthy of love.'
    },
    wound: {
      pt: 'Minha imperfeição me torna inaceitável.',
      'pt-pt': 'A minha imperfeição torna-me inaceitável.',
      en: 'My imperfection makes me unacceptable.'
    },
    compulsion: {
      pt: 'Corrigir, melhorar, reformar tudo',
      'pt-pt': 'Corrigir, melhorar, reformar tudo',
      en: 'Correct, improve, reform everything'
    },
    strengths: {
      pt: ['Integridade moral', 'Disciplina', 'Senso de justiça', 'Responsabilidade', 'Atenção aos detalhes'],
      'pt-pt': ['Integridade moral', 'Disciplina', 'Senso de justiça', 'Responsabilidade', 'Atenção aos detalhes'],
      en: ['Moral integrity', 'Discipline', 'Sense of justice', 'Responsibility', 'Attention to detail']
    },
    vulnerabilities: {
      pt: ['Rigidez excessiva', 'Crítica implacável', 'Raiva reprimida', 'Dificuldade em relaxar'],
      'pt-pt': ['Rigidez excessiva', 'Crítica implacável', 'Raiva reprimida', 'Dificuldade em relaxar'],
      en: ['Excessive rigidity', 'Relentless criticism', 'Repressed anger', 'Difficulty relaxing']
    },
    light: {
      pt: 'Você traz ordem ao caos e inspira outros a serem melhores.',
      'pt-pt': 'Tu trazes ordem ao caos e inspiras outros a serem melhores.',
      en: 'You bring order to chaos and inspire others to be better.'
    },
    nelloAgentMessage: {
      pt: 'Você não precisa ser perfeito para ser amado. Sua imperfeição é parte da sua humanidade. Quando você abraça suas falhas, encontra a paz que sempre buscou.',
      'pt-pt': 'Tu não precisas ser perfeito para seres amado. A tua imperfeição é parte da tua humanidade. Quando abraças as tuas falhas, encontras a paz que sempre procuraste.',
      en: 'You do not need to be perfect to be loved. Your imperfection is part of your humanity. When you embrace your flaws, you find the peace you have always sought.'
    },
    triggers: {
      pt: ['Injustiça', 'Desorganização', 'Críticas ao seu trabalho', 'Erros percebidos'],
      'pt-pt': ['Injustiça', 'Desorganização', 'Críticas ao teu trabalho', 'Erros percebidos'],
      en: ['Injustice', 'Disorganization', 'Criticism of your work', 'Perceived errors']
    },
    healing: {
      pt: ['Aceitar a imperfeição', 'Praticar autocompaixão', 'Soltar o controle'],
      'pt-pt': ['Aceitar a imperfeição', 'Praticar autocompaixão', 'Soltar o controlo'],
      en: ['Accept imperfection', 'Practice self-compassion', 'Let go of control']
    },
    virtue: { pt: 'Serenidade', 'pt-pt': 'Serenidade', en: 'Serenity' },
    passion: { pt: 'Ira (raiva reprimida)', 'pt-pt': 'Ira (raiva reprimida)', en: 'Anger (repressed)' },
    basicFear: { pt: 'Ser corrupto, mau ou imperfeito', 'pt-pt': 'Ser corrupto, mau ou imperfeito', en: 'Being corrupt, evil, or imperfect' },
    basicDesire: { pt: 'Ser bom, íntegro e equilibrado', 'pt-pt': 'Ser bom, íntegro e equilibrado', en: 'To be good, whole, and balanced' },
    levels: {
      integrated: { pt: 'Sábio, sereno, aceita a imperfeição', 'pt-pt': 'Sábio, sereno, aceita a imperfeição', en: 'Wise, serene, accepts imperfection' },
      average: { pt: 'Crítico, tenso, moralista', 'pt-pt': 'Crítico, tenso, moralista', en: 'Critical, tense, moralistic' },
      unconscious: { pt: 'Obsessivo, punitivo, autodestrutivo', 'pt-pt': 'Obsessivo, punitivo, autodestrutivo', en: 'Obsessive, punitive, self-destructive' }
    },
    relationships: {
      love: { pt: 'Você ama com dedicação e compromisso profundo.', 'pt-pt': 'Amas com dedicação e compromisso profundo.', en: 'You love with dedication and deep commitment.' },
      protect: { pt: 'Se fecha emocionalmente e critica o outro.', 'pt-pt': 'Fechas-te emocionalmente e criticas o outro.', en: 'You close off emotionally and criticize the other.' },
      rejection: { pt: 'Reage com frieza e crítica velada.', 'pt-pt': 'Reages com frieza e crítica velada.', en: 'You react with coldness and veiled criticism.' }
    },
    work: {
      talents: { pt: 'Organização, ética, atenção aos detalhes', 'pt-pt': 'Organização, ética, atenção aos detalhes', en: 'Organization, ethics, attention to detail' },
      challenges: { pt: 'Perfeccionismo paralisante, crítica excessiva', 'pt-pt': 'Perfeccionismo paralisante, crítica excessiva', en: 'Paralyzing perfectionism, excessive criticism' },
      ideal: { pt: 'Ambientes onde há clareza de regras e propósito elevado.', 'pt-pt': 'Ambientes onde há clareza de regras e propósito elevado.', en: 'Environments with clear rules and elevated purpose.' }
    },
    selfExamQuestion: {
      pt: 'O que aconteceria se você se permitisse ser imperfeito por um dia inteiro?',
      'pt-pt': 'O que aconteceria se te permitisses ser imperfeito por um dia inteiro?',
      en: 'What would happen if you allowed yourself to be imperfect for a whole day?'
    },
    evolution: {
      pt: ['Aceitar a imperfeição como parte da vida', 'Praticar autocompaixão diária', 'Soltar o controle das situações', 'Expressar raiva de forma saudável', 'Celebrar o progresso, não só o resultado'],
      'pt-pt': ['Aceitar a imperfeição como parte da vida', 'Praticar autocompaixão diária', 'Soltar o controlo das situações', 'Expressar raiva de forma saudável', 'Celebrar o progresso, não só o resultado'],
      en: ['Accept imperfection as part of life', 'Practice daily self-compassion', 'Let go of control', 'Express anger healthily', 'Celebrate progress, not just results']
    },
    sevenDayPlan: {
      pt: ['Observe um erro sem corrigi-lo', 'Elogie alguém genuinamente', 'Permita-se uma imperfeição', 'Descanse sem culpa', 'Expresse raiva de forma saudável', 'Pratique autocompaixão', 'Celebre sua humanidade'],
      'pt-pt': ['Observa um erro sem corrigi-lo', 'Elogia alguém genuinamente', 'Permite-te uma imperfeição', 'Descansa sem culpa', 'Expressa raiva de forma saudável', 'Pratica autocompaixão', 'Celebra a tua humanidade'],
      en: ['Observe an error without correcting it', 'Genuinely compliment someone', 'Allow yourself an imperfection', 'Rest without guilt', 'Express anger healthily', 'Practice self-compassion', 'Celebrate your humanity']
    }
  },
  "2": {
    name: { pt: 'O Prestativo', 'pt-pt': 'O Prestativo', en: 'The Helper' },
    emoji: '❤️',
    color: '#EC4899',
    essence: { pt: 'Amor incondicional', 'pt-pt': 'Amor incondicional', en: 'Unconditional love' },
    description: {
      pt: 'Você é movido pelo amor e pela necessidade de ser necessário. Sua energia é calorosa, generosa e sempre atenta às necessidades dos outros.',
      'pt-pt': 'És movido pelo amor e pela necessidade de seres necessário. A tua energia é calorosa, generosa e sempre atenta às necessidades dos outros.',
      en: 'You are driven by love and the need to be needed. Your energy is warm, generous, and always attentive to others\' needs.'
    },
    ego: {
      pt: 'Eu preciso ser indispensável para ser amado.',
      'pt-pt': 'Eu preciso ser indispensável para ser amado.',
      en: 'I need to be indispensable to be loved.'
    },
    wound: {
      pt: 'Meu amor não é suficiente.',
      'pt-pt': 'O meu amor não é suficiente.',
      en: 'My love is not enough.'
    },
    compulsion: {
      pt: 'Ajudar para ser visto e valorizado',
      'pt-pt': 'Ajudar para ser visto e valorizado',
      en: 'Help to be seen and valued'
    },
    strengths: {
      pt: ['Generosidade genuína', 'Empatia profunda', 'Capacidade de nutrir', 'Conexão emocional', 'Intuição sobre necessidades'],
      'pt-pt': ['Generosidade genuína', 'Empatia profunda', 'Capacidade de nutrir', 'Conexão emocional', 'Intuição sobre necessidades'],
      en: ['Genuine generosity', 'Deep empathy', 'Nurturing ability', 'Emotional connection', 'Intuition about needs']
    },
    vulnerabilities: {
      pt: ['Possessividade emocional', 'Dificuldade em receber', 'Manipulação afetiva', 'Perda de identidade própria'],
      'pt-pt': ['Possessividade emocional', 'Dificuldade em receber', 'Manipulação afetiva', 'Perda de identidade própria'],
      en: ['Emotional possessiveness', 'Difficulty receiving', 'Affective manipulation', 'Loss of own identity']
    },
    light: {
      pt: 'Você ilumina a vida dos outros com amor genuíno.',
      'pt-pt': 'Tu iluminas a vida dos outros com amor genuíno.',
      en: 'You illuminate others\' lives with genuine love.'
    },
    nelloAgentMessage: {
      pt: 'Você não nasceu para se sacrificar para ser amado. Você nasceu para amar sem perder a si mesmo. Seu amor é suficiente. Você é suficiente.',
      'pt-pt': 'Tu não nasceste para te sacrificares para seres amado. Nasceste para amar sem te perderes a ti mesmo. O teu amor é suficiente. Tu és suficiente.',
      en: 'You were not born to sacrifice yourself to be loved. You were born to love without losing yourself. Your love is enough. You are enough.'
    },
    triggers: {
      pt: ['Não ser valorizado', 'Rejeição', 'Ingratidão', 'Ser ignorado'],
      'pt-pt': ['Não ser valorizado', 'Rejeição', 'Ingratidão', 'Ser ignorado'],
      en: ['Not being valued', 'Rejection', 'Ingratitude', 'Being ignored']
    },
    healing: {
      pt: ['Aprender a receber', 'Reconhecer suas próprias necessidades', 'Amar-se primeiro'],
      'pt-pt': ['Aprender a receber', 'Reconhecer as tuas próprias necessidades', 'Amar-te primeiro'],
      en: ['Learn to receive', 'Recognize your own needs', 'Love yourself first']
    },
    virtue: { pt: 'Humildade', 'pt-pt': 'Humildade', en: 'Humility' },
    passion: { pt: 'Orgulho (de ser necessário)', 'pt-pt': 'Orgulho (de ser necessário)', en: 'Pride (of being needed)' },
    basicFear: { pt: 'Ser rejeitado, não ser amado', 'pt-pt': 'Ser rejeitado, não ser amado', en: 'Being rejected, not being loved' },
    basicDesire: { pt: 'Ser profundamente amado', 'pt-pt': 'Ser profundamente amado', en: 'To be deeply loved' },
    levels: {
      integrated: { pt: 'Humilde, amoroso, desapegado', 'pt-pt': 'Humilde, amoroso, desapegado', en: 'Humble, loving, detached' },
      average: { pt: 'Intrusivo, orgulhoso, dependente', 'pt-pt': 'Intrusivo, orgulhoso, dependente', en: 'Intrusive, proud, dependent' },
      unconscious: { pt: 'Manipulador, possessivo, coercivo', 'pt-pt': 'Manipulador, possessivo, coercivo', en: 'Manipulative, possessive, coercive' }
    },
    relationships: {
      love: { pt: 'Você ama cuidando e nutrindo.', 'pt-pt': 'Amas cuidando e nutrindo.', en: 'You love by caring and nurturing.' },
      protect: { pt: 'Se torna possessivo e manipulador.', 'pt-pt': 'Tornas-te possessivo e manipulador.', en: 'You become possessive and manipulative.' },
      rejection: { pt: 'Reage com mágoa e vitimização.', 'pt-pt': 'Reages com mágoa e vitimização.', en: 'You react with hurt and victimization.' }
    },
    work: {
      talents: { pt: 'Empatia, networking, suporte', 'pt-pt': 'Empatia, networking, suporte', en: 'Empathy, networking, support' },
      challenges: { pt: 'Burnout por excesso de cuidado', 'pt-pt': 'Burnout por excesso de cuidado', en: 'Burnout from excessive care' },
      ideal: { pt: 'Ambientes onde o cuidado com pessoas é valorizado.', 'pt-pt': 'Ambientes onde o cuidado com pessoas é valorizado.', en: 'Environments where caring for people is valued.' }
    },
    selfExamQuestion: {
      pt: 'O que aconteceria se você dissesse não para alguém hoje?',
      'pt-pt': 'O que aconteceria se dissesses não para alguém hoje?',
      en: 'What would happen if you said no to someone today?'
    },
    evolution: {
      pt: ['Aprender a receber sem dar', 'Reconhecer suas próprias necessidades', 'Amar-se primeiro', 'Estabelecer limites saudáveis', 'Pedir ajuda sem vergonha'],
      'pt-pt': ['Aprender a receber sem dar', 'Reconhecer as tuas próprias necessidades', 'Amar-te primeiro', 'Estabelecer limites saudáveis', 'Pedir ajuda sem vergonha'],
      en: ['Learn to receive without giving', 'Recognize your own needs', 'Love yourself first', 'Establish healthy boundaries', 'Ask for help without shame']
    },
    sevenDayPlan: {
      pt: ['Diga não para algo', 'Peça ajuda sem oferecer nada', 'Receba um elogio sem retribuir', 'Cuide de si antes de outro', 'Expresse uma necessidade sua', 'Ore pedindo receber amor', 'Celebre seu valor sem fazer nada'],
      'pt-pt': ['Diz não para algo', 'Pede ajuda sem oferecer nada', 'Recebe um elogio sem retribuir', 'Cuida de ti antes de outro', 'Expressa uma necessidade tua', 'Ora pedindo receber amor', 'Celebra o teu valor sem fazer nada'],
      en: ['Say no to something', 'Ask for help without offering anything', 'Receive a compliment without reciprocating', 'Take care of yourself before others', 'Express one of your needs', 'Pray to receive love', 'Celebrate your worth without doing anything']
    }
  },
  "3": {
    name: { pt: 'O Realizador', 'pt-pt': 'O Realizador', en: 'The Achiever' },
    emoji: '🏆',
    color: '#F59E0B',
    essence: { pt: 'Valor autêntico, esperança', 'pt-pt': 'Valor autêntico, esperança', en: 'Authentic value, hope' },
    description: {
      pt: 'Você é movido pelo sucesso e pelo reconhecimento. Sua energia é focada, adaptável e orientada para resultados. Você inspira outros com sua eficiência.',
      'pt-pt': 'És movido pelo sucesso e pelo reconhecimento. A tua energia é focada, adaptável e orientada para resultados. Tu inspiras outros com a tua eficiência.',
      en: 'You are driven by success and recognition. Your energy is focused, adaptable, and results-oriented. You inspire others with your efficiency.'
    },
    ego: {
      pt: 'Eu sou o que conquisto.',
      'pt-pt': 'Eu sou o que conquisto.',
      en: 'I am what I achieve.'
    },
    wound: {
      pt: 'Sem sucesso, não tenho valor.',
      'pt-pt': 'Sem sucesso, não tenho valor.',
      en: 'Without success, I have no value.'
    },
    compulsion: {
      pt: 'Alcançar, performar, impressionar',
      'pt-pt': 'Alcançar, performar, impressionar',
      en: 'Achieve, perform, impress'
    },
    strengths: {
      pt: ['Eficiência notável', 'Adaptabilidade', 'Liderança inspiradora', 'Orientação para resultados', 'Capacidade de motivar'],
      'pt-pt': ['Eficiência notável', 'Adaptabilidade', 'Liderança inspiradora', 'Orientação para resultados', 'Capacidade de motivar'],
      en: ['Remarkable efficiency', 'Adaptability', 'Inspiring leadership', 'Results orientation', 'Ability to motivate']
    },
    vulnerabilities: {
      pt: ['Vaidade excessiva', 'Workaholic', 'Superficialidade nas relações', 'Identidade baseada em conquistas'],
      'pt-pt': ['Vaidade excessiva', 'Workaholic', 'Superficialidade nas relações', 'Identidade baseada em conquistas'],
      en: ['Excessive vanity', 'Workaholic', 'Superficiality in relationships', 'Identity based on achievements']
    },
    light: {
      pt: 'Você mostra ao mundo que é possível transformar sonhos em realidade.',
      'pt-pt': 'Tu mostras ao mundo que é possível transformar sonhos em realidade.',
      en: 'You show the world that it is possible to turn dreams into reality.'
    },
    nelloAgentMessage: {
      pt: 'Você não é o que faz. Você é o que é. Quando para de performar e começa a ser, descobre que seu valor sempre esteve dentro de você.',
      'pt-pt': 'Tu não és o que fazes. Tu és o que és. Quando paras de performar e começas a ser, descobres que o teu valor sempre esteve dentro de ti.',
      en: 'You are not what you do. You are what you are. When you stop performing and start being, you discover that your value was always within you.'
    },
    triggers: {
      pt: ['Fracasso', 'Comparação desfavorável', 'Não ser admirado', 'Ineficiência'],
      'pt-pt': ['Fracasso', 'Comparação desfavorável', 'Não ser admirado', 'Ineficiência'],
      en: ['Failure', 'Unfavorable comparison', 'Not being admired', 'Inefficiency']
    },
    healing: {
      pt: ['Parar de performar', 'Ser vulnerável', 'Valorizar o ser sobre o fazer'],
      'pt-pt': ['Parar de performar', 'Ser vulnerável', 'Valorizar o ser sobre o fazer'],
      en: ['Stop performing', 'Be vulnerable', 'Value being over doing']
    },
    virtue: { pt: 'Veracidade', 'pt-pt': 'Veracidade', en: 'Truthfulness' },
    passion: { pt: 'Vaidade', 'pt-pt': 'Vaidade', en: 'Vanity' },
    basicFear: { pt: 'Ser sem valor, um fracasso', 'pt-pt': 'Ser sem valor, um fracasso', en: 'Being worthless, a failure' },
    basicDesire: { pt: 'Ser valioso e admirado', 'pt-pt': 'Ser valioso e admirado', en: 'To be valuable and admired' },
    levels: {
      integrated: { pt: 'Autêntico, inspirador, eficiente', 'pt-pt': 'Autêntico, inspirador, eficiente', en: 'Authentic, inspiring, efficient' },
      average: { pt: 'Competitivo, orientado à imagem, workaholic', 'pt-pt': 'Competitivo, orientado à imagem, workaholic', en: 'Competitive, image-oriented, workaholic' },
      unconscious: { pt: 'Enganador, oportunista, destrutivo', 'pt-pt': 'Enganador, oportunista, destrutivo', en: 'Deceitful, opportunistic, destructive' }
    },
    relationships: {
      love: { pt: 'Você ama impressionando e conquistando.', 'pt-pt': 'Amas impressionando e conquistando.', en: 'You love by impressing and conquering.' },
      protect: { pt: 'Se esconde atrás da imagem de sucesso.', 'pt-pt': 'Escondes-te atrás da imagem de sucesso.', en: 'You hide behind the image of success.' },
      rejection: { pt: 'Reage trabalhando mais para provar valor.', 'pt-pt': 'Reages trabalhando mais para provar valor.', en: 'You react by working harder to prove worth.' }
    },
    work: {
      talents: { pt: 'Eficiência, adaptação, liderança', 'pt-pt': 'Eficiência, adaptação, liderança', en: 'Efficiency, adaptation, leadership' },
      challenges: { pt: 'Burnout, superficialidade', 'pt-pt': 'Burnout, superficialidade', en: 'Burnout, superficiality' },
      ideal: { pt: 'Ambientes que reconhecem conquistas e oferecem crescimento.', 'pt-pt': 'Ambientes que reconhecem conquistas e oferecem crescimento.', en: 'Environments that recognize achievements and offer growth.' }
    },
    selfExamQuestion: {
      pt: 'Quem você seria se ninguém estivesse olhando?',
      'pt-pt': 'Quem serias se ninguém estivesse a olhar?',
      en: 'Who would you be if no one was watching?'
    },
    evolution: {
      pt: ['Parar de performar constantemente', 'Ser vulnerável com pessoas próximas', 'Valorizar o ser sobre o fazer', 'Descansar sem culpa', 'Conectar-se sem agenda'],
      'pt-pt': ['Parar de performar constantemente', 'Ser vulnerável com pessoas próximas', 'Valorizar o ser sobre o fazer', 'Descansar sem culpa', 'Conectar-te sem agenda'],
      en: ['Stop constantly performing', 'Be vulnerable with close people', 'Value being over doing', 'Rest without guilt', 'Connect without an agenda']
    },
    sevenDayPlan: {
      pt: ['Faça algo sem esperar aplausos', 'Admita uma fraqueza', 'Descanse sem culpa', 'Conecte-se sem agenda', 'Seja você mesmo em público', 'Ore pedindo autenticidade', 'Celebre quem você é, não o que fez'],
      'pt-pt': ['Faz algo sem esperar aplausos', 'Admite uma fraqueza', 'Descansa sem culpa', 'Conecta-te sem agenda', 'Sê tu mesmo em público', 'Ora pedindo autenticidade', 'Celebra quem és, não o que fizeste'],
      en: ['Do something without expecting applause', 'Admit a weakness', 'Rest without guilt', 'Connect without an agenda', 'Be yourself in public', 'Pray for authenticity', 'Celebrate who you are, not what you did']
    }
  },
  "4": {
    name: { pt: 'O Romântico', 'pt-pt': 'O Romântico', en: 'The Romantic' },
    emoji: '🎭',
    color: '#6366F1',
    essence: { pt: 'Profundidade, originalidade', 'pt-pt': 'Profundidade, originalidade', en: 'Depth, originality' },
    description: {
      pt: 'Você é movido pela busca de identidade e significado. Sua energia é profunda, criativa e intensamente emocional. Você vê beleza onde outros não veem.',
      'pt-pt': 'És movido pela busca de identidade e significado. A tua energia é profunda, criativa e intensamente emocional. Tu vês beleza onde outros não veem.',
      en: 'You are driven by the search for identity and meaning. Your energy is deep, creative, and intensely emotional. You see beauty where others do not.'
    },
    ego: {
      pt: 'Eu sou diferente, especial, único.',
      'pt-pt': 'Eu sou diferente, especial, único.',
      en: 'I am different, special, unique.'
    },
    wound: {
      pt: 'Algo essencial me falta.',
      'pt-pt': 'Algo essencial me falta.',
      en: 'Something essential is missing in me.'
    },
    compulsion: {
      pt: 'Buscar identidade e significado',
      'pt-pt': 'Buscar identidade e significado',
      en: 'Seek identity and meaning'
    },
    strengths: {
      pt: ['Criatividade profunda', 'Autenticidade', 'Sensibilidade artística', 'Intuição emocional', 'Capacidade de ver a beleza'],
      'pt-pt': ['Criatividade profunda', 'Autenticidade', 'Sensibilidade artística', 'Intuição emocional', 'Capacidade de ver a beleza'],
      en: ['Deep creativity', 'Authenticity', 'Artistic sensitivity', 'Emotional intuition', 'Ability to see beauty']
    },
    vulnerabilities: {
      pt: ['Inveja destrutiva', 'Melancolia crônica', 'Auto-absorção', 'Dificuldade com o ordinário'],
      'pt-pt': ['Inveja destrutiva', 'Melancolia crónica', 'Auto-absorção', 'Dificuldade com o ordinário'],
      en: ['Destructive envy', 'Chronic melancholy', 'Self-absorption', 'Difficulty with the ordinary']
    },
    light: {
      pt: 'Você transforma dor em arte e dá voz ao inexprimível.',
      'pt-pt': 'Tu transformas dor em arte e dás voz ao inexprimível.',
      en: 'You transform pain into art and give voice to the inexpressible.'
    },
    nelloAgentMessage: {
      pt: 'Você não precisa ser diferente para ser amado. Sua singularidade já existe. Quando para de buscar o que falta, encontra o que sempre esteve presente.',
      'pt-pt': 'Tu não precisas ser diferente para seres amado. A tua singularidade já existe. Quando paras de buscar o que falta, encontras o que sempre esteve presente.',
      en: 'You do not need to be different to be loved. Your uniqueness already exists. When you stop seeking what is missing, you find what has always been present.'
    },
    triggers: {
      pt: ['Ser comum', 'Não ser compreendido', 'Perder identidade', 'Superficialidade'],
      'pt-pt': ['Ser comum', 'Não ser compreendido', 'Perder identidade', 'Superficialidade'],
      en: ['Being ordinary', 'Not being understood', 'Losing identity', 'Superficiality']
    },
    healing: {
      pt: ['Aceitar o ordinário', 'Gratidão pelo presente', 'Conexão real'],
      'pt-pt': ['Aceitar o ordinário', 'Gratidão pelo presente', 'Conexão real'],
      en: ['Accept the ordinary', 'Gratitude for the present', 'Real connection']
    },
    virtue: { pt: 'Equanimidade', 'pt-pt': 'Equanimidade', en: 'Equanimity' },
    passion: { pt: 'Inveja', 'pt-pt': 'Inveja', en: 'Envy' },
    basicFear: { pt: 'Não ter identidade ou significado', 'pt-pt': 'Não ter identidade ou significado', en: 'Having no identity or significance' },
    basicDesire: { pt: 'Encontrar a si mesmo e seu significado', 'pt-pt': 'Encontrar a ti mesmo e o teu significado', en: 'To find yourself and your significance' },
    levels: {
      integrated: { pt: 'Criativo, profundo, equilibrado', 'pt-pt': 'Criativo, profundo, equilibrado', en: 'Creative, deep, balanced' },
      average: { pt: 'Melancólico, invejoso, auto-absorvido', 'pt-pt': 'Melancólico, invejoso, auto-absorvido', en: 'Melancholic, envious, self-absorbed' },
      unconscious: { pt: 'Destrutivo, desesperado, alienado', 'pt-pt': 'Destrutivo, desesperado, alienado', en: 'Destructive, desperate, alienated' }
    },
    relationships: {
      love: { pt: 'Você ama com intensidade e profundidade.', 'pt-pt': 'Amas com intensidade e profundidade.', en: 'You love with intensity and depth.' },
      protect: { pt: 'Se retrai e se torna inacessível.', 'pt-pt': 'Retrais-te e tornas-te inacessível.', en: 'You withdraw and become inaccessible.' },
      rejection: { pt: 'Reage com intensificação emocional e drama.', 'pt-pt': 'Reages com intensificação emocional e drama.', en: 'You react with emotional intensification and drama.' }
    },
    work: {
      talents: { pt: 'Arte, intuição, originalidade', 'pt-pt': 'Arte, intuição, originalidade', en: 'Art, intuition, originality' },
      challenges: { pt: 'Inconsistência, auto-sabotagem', 'pt-pt': 'Inconsistência, auto-sabotagem', en: 'Inconsistency, self-sabotage' },
      ideal: { pt: 'Ambientes criativos que valorizam autenticidade.', 'pt-pt': 'Ambientes criativos que valorizam autenticidade.', en: 'Creative environments that value authenticity.' }
    },
    selfExamQuestion: {
      pt: 'O que aconteceria se você celebrasse algo comum hoje?',
      'pt-pt': 'O que aconteceria se celebrasses algo comum hoje?',
      en: 'What would happen if you celebrated something ordinary today?'
    },
    evolution: {
      pt: ['Aceitar o ordinário como sagrado', 'Praticar gratidão pelo presente', 'Conectar-se sem drama', 'Completar tarefas comuns', 'Celebrar pequenas alegrias'],
      'pt-pt': ['Aceitar o ordinário como sagrado', 'Praticar gratidão pelo presente', 'Conectar-te sem drama', 'Completar tarefas comuns', 'Celebrar pequenas alegrias'],
      en: ['Accept the ordinary as sacred', 'Practice gratitude for the present', 'Connect without drama', 'Complete common tasks', 'Celebrate small joys']
    },
    sevenDayPlan: {
      pt: ['Agradeça algo simples', 'Conecte-se sem drama', 'Complete uma tarefa comum', 'Aceite ser normal por um dia', 'Expresse sem esperar compreensão', 'Ore pedindo equilíbrio', 'Celebre o ordinário'],
      'pt-pt': ['Agradece algo simples', 'Conecta-te sem drama', 'Completa uma tarefa comum', 'Aceita ser normal por um dia', 'Expressa sem esperar compreensão', 'Ora pedindo equilíbrio', 'Celebra o ordinário'],
      en: ['Be grateful for something simple', 'Connect without drama', 'Complete a common task', 'Accept being normal for a day', 'Express without expecting understanding', 'Pray for balance', 'Celebrate the ordinary']
    }
  },
  "5": {
    name: { pt: 'O Investigador', 'pt-pt': 'O Investigador', en: 'The Investigator' },
    emoji: '🔬',
    color: '#10B981',
    essence: { pt: 'Sabedoria, clareza', 'pt-pt': 'Sabedoria, clareza', en: 'Wisdom, clarity' },
    description: {
      pt: 'Você é movido pela busca de conhecimento e compreensão. Sua energia é analítica, observadora e profundamente independente. Você vê padrões que outros ignoram.',
      'pt-pt': 'És movido pela busca de conhecimento e compreensão. A tua energia é analítica, observadora e profundamente independente. Tu vês padrões que outros ignoram.',
      en: 'You are driven by the pursuit of knowledge and understanding. Your energy is analytical, observant, and deeply independent. You see patterns others ignore.'
    },
    ego: {
      pt: 'Eu preciso entender para me sentir seguro.',
      'pt-pt': 'Eu preciso entender para me sentir seguro.',
      en: 'I need to understand to feel safe.'
    },
    wound: {
      pt: 'O mundo é invasivo e exige demais.',
      'pt-pt': 'O mundo é invasivo e exige demais.',
      en: 'The world is invasive and demands too much.'
    },
    compulsion: {
      pt: 'Observar, analisar, acumular conhecimento',
      'pt-pt': 'Observar, analisar, acumular conhecimento',
      en: 'Observe, analyze, accumulate knowledge'
    },
    strengths: {
      pt: ['Capacidade analítica', 'Independência mental', 'Objetividade', 'Perícia em áreas específicas', 'Visão sistêmica'],
      'pt-pt': ['Capacidade analítica', 'Independência mental', 'Objetividade', 'Perícia em áreas específicas', 'Visão sistémica'],
      en: ['Analytical ability', 'Mental independence', 'Objectivity', 'Expertise in specific areas', 'Systemic vision']
    },
    vulnerabilities: {
      pt: ['Isolamento excessivo', 'Avareza emocional', 'Desconexão do corpo', 'Paralisia por análise'],
      'pt-pt': ['Isolamento excessivo', 'Avareza emocional', 'Desconexão do corpo', 'Paralisia por análise'],
      en: ['Excessive isolation', 'Emotional avarice', 'Disconnection from body', 'Analysis paralysis']
    },
    light: {
      pt: 'Você ilumina a escuridão com sua clareza mental.',
      'pt-pt': 'Tu iluminas a escuridão com a tua clareza mental.',
      en: 'You illuminate darkness with your mental clarity.'
    },
    nelloAgentMessage: {
      pt: 'O conhecimento é um meio, não um refúgio. Quando você sai da mente e entra na vida, descobre que a sabedoria verdadeira está na experiência, não apenas na teoria.',
      'pt-pt': 'O conhecimento é um meio, não um refúgio. Quando sais da mente e entras na vida, descobres que a sabedoria verdadeira está na experiência, não apenas na teoria.',
      en: 'Knowledge is a means, not a refuge. When you leave the mind and enter life, you discover that true wisdom lies in experience, not just theory.'
    },
    triggers: {
      pt: ['Invasão', 'Demandas emocionais', 'Incompetência', 'Superficialidade'],
      'pt-pt': ['Invasão', 'Demandas emocionais', 'Incompetência', 'Superficialidade'],
      en: ['Invasion', 'Emotional demands', 'Incompetence', 'Superficiality']
    },
    healing: {
      pt: ['Participar da vida', 'Compartilhar conhecimento', 'Sentir sem analisar'],
      'pt-pt': ['Participar da vida', 'Partilhar conhecimento', 'Sentir sem analisar'],
      en: ['Participate in life', 'Share knowledge', 'Feel without analyzing']
    },
    virtue: { pt: 'Desapego', 'pt-pt': 'Desapego', en: 'Detachment' },
    passion: { pt: 'Avareza (de energia e recursos)', 'pt-pt': 'Avareza (de energia e recursos)', en: 'Avarice (of energy and resources)' },
    basicFear: { pt: 'Ser inútil, incapaz ou ignorante', 'pt-pt': 'Ser inútil, incapaz ou ignorante', en: 'Being useless, incapable, or ignorant' },
    basicDesire: { pt: 'Ser capaz e competente', 'pt-pt': 'Ser capaz e competente', en: 'To be capable and competent' },
    levels: {
      integrated: { pt: 'Sábio, perceptivo, inovador', 'pt-pt': 'Sábio, perceptivo, inovador', en: 'Wise, perceptive, innovative' },
      average: { pt: 'Isolado, avarento, provocativo', 'pt-pt': 'Isolado, avarento, provocativo', en: 'Isolated, miserly, provocative' },
      unconscious: { pt: 'Excêntrico, niilista, esquizoide', 'pt-pt': 'Excêntrico, niilista, esquizoide', en: 'Eccentric, nihilistic, schizoid' }
    },
    relationships: {
      love: { pt: 'Você ama com presença silenciosa e profundidade.', 'pt-pt': 'Amas com presença silenciosa e profundidade.', en: 'You love with quiet presence and depth.' },
      protect: { pt: 'Se retrai e fecha emocionalmente.', 'pt-pt': 'Retrais-te e fechas emocionalmente.', en: 'You withdraw and close off emotionally.' },
      rejection: { pt: 'Reage com isolamento ainda maior.', 'pt-pt': 'Reages com isolamento ainda maior.', en: 'You react with even greater isolation.' }
    },
    work: {
      talents: { pt: 'Análise, profundidade, inovação', 'pt-pt': 'Análise, profundidade, inovação', en: 'Analysis, depth, innovation' },
      challenges: { pt: 'Isolamento, paralisia por análise', 'pt-pt': 'Isolamento, paralisia por análise', en: 'Isolation, analysis paralysis' },
      ideal: { pt: 'Ambientes com autonomia e espaço para especialização.', 'pt-pt': 'Ambientes com autonomia e espaço para especialização.', en: 'Environments with autonomy and space for specialization.' }
    },
    selfExamQuestion: {
      pt: 'O que aconteceria se você compartilhasse algo que sabe hoje?',
      'pt-pt': 'O que aconteceria se partilhasses algo que sabes hoje?',
      en: 'What would happen if you shared something you know today?'
    },
    evolution: {
      pt: ['Compartilhar conhecimento generosamente', 'Conectar-se emocionalmente', 'Habitar o corpo', 'Agir antes de ter certeza total', 'Confiar nos outros'],
      'pt-pt': ['Partilhar conhecimento generosamente', 'Conectar-te emocionalmente', 'Habitar o corpo', 'Agir antes de ter certeza total', 'Confiar nos outros'],
      en: ['Share knowledge generously', 'Connect emotionally', 'Inhabit the body', 'Act before having total certainty', 'Trust others']
    },
    sevenDayPlan: {
      pt: ['Compartilhe um conhecimento', 'Peça uma opinião alheia', 'Faça algo físico por 20 minutos', 'Conecte-se com alguém sem agenda', 'Expresse uma emoção', 'Ore pedindo presença', 'Celebre uma conexão humana'],
      'pt-pt': ['Partilha um conhecimento', 'Pede uma opinião alheia', 'Faz algo físico por 20 minutos', 'Conecta-te com alguém sem agenda', 'Expressa uma emoção', 'Ora pedindo presença', 'Celebra uma conexão humana'],
      en: ['Share some knowledge', 'Ask for someone else\'s opinion', 'Do something physical for 20 minutes', 'Connect with someone without an agenda', 'Express an emotion', 'Pray for presence', 'Celebrate a human connection']
    }
  },
  "6": {
    name: { pt: 'O Leal', 'pt-pt': 'O Leal', en: 'The Loyalist' },
    emoji: '🛡️',
    color: '#3B82F6',
    essence: { pt: 'Coragem, fé', 'pt-pt': 'Coragem, fé', en: 'Courage, faith' },
    description: {
      pt: 'Você é movido pela segurança e lealdade. Sua energia é vigilante, responsável e profundamente comprometida. Você é o guardião dos vínculos.',
      'pt-pt': 'És movido pela segurança e lealdade. A tua energia é vigilante, responsável e profundamente comprometida. Tu és o guardião dos vínculos.',
      en: 'You are driven by security and loyalty. Your energy is vigilant, responsible, and deeply committed. You are the guardian of bonds.'
    },
    ego: {
      pt: 'Eu preciso de segurança e orientação.',
      'pt-pt': 'Eu preciso de segurança e orientação.',
      en: 'I need security and guidance.'
    },
    wound: {
      pt: 'O mundo é perigoso e imprevisível.',
      'pt-pt': 'O mundo é perigoso e imprevisível.',
      en: 'The world is dangerous and unpredictable.'
    },
    compulsion: {
      pt: 'Antecipar perigos, buscar certezas',
      'pt-pt': 'Antecipar perigos, buscar certezas',
      en: 'Anticipate dangers, seek certainties'
    },
    strengths: {
      pt: ['Lealdade inabalável', 'Responsabilidade', 'Pensamento estratégico', 'Proteção dos outros', 'Capacidade de prever riscos'],
      'pt-pt': ['Lealdade inabalável', 'Responsabilidade', 'Pensamento estratégico', 'Proteção dos outros', 'Capacidade de prever riscos'],
      en: ['Unwavering loyalty', 'Responsibility', 'Strategic thinking', 'Protection of others', 'Ability to foresee risks']
    },
    vulnerabilities: {
      pt: ['Ansiedade crônica', 'Dúvida constante', 'Paranoia', 'Dependência de autoridade'],
      'pt-pt': ['Ansiedade crónica', 'Dúvida constante', 'Paranoia', 'Dependência de autoridade'],
      en: ['Chronic anxiety', 'Constant doubt', 'Paranoia', 'Dependence on authority']
    },
    light: {
      pt: 'Você traz segurança e confiança onde há medo.',
      'pt-pt': 'Tu trazes segurança e confiança onde há medo.',
      en: 'You bring security and trust where there is fear.'
    },
    nelloAgentMessage: {
      pt: 'Seu coração se acalma quando entrega o controle e reconhece que a fé é a base da verdadeira segurança. Você é mais forte do que seus medos.',
      'pt-pt': 'O teu coração acalma quando entregas o controlo e reconheces que a fé é a base da verdadeira segurança. Tu és mais forte do que os teus medos.',
      en: 'Your heart calms when you surrender control and recognize that faith is the foundation of true security. You are stronger than your fears.'
    },
    triggers: {
      pt: ['Incerteza', 'Traição', 'Autoridade abusiva', 'Abandono'],
      'pt-pt': ['Incerteza', 'Traição', 'Autoridade abusiva', 'Abandono'],
      en: ['Uncertainty', 'Betrayal', 'Abusive authority', 'Abandonment']
    },
    healing: {
      pt: ['Confiar na própria intuição', 'Agir apesar do medo', 'Praticar fé ativa'],
      'pt-pt': ['Confiar na própria intuição', 'Agir apesar do medo', 'Praticar fé ativa'],
      en: ['Trust your own intuition', 'Act despite fear', 'Practice active faith']
    },
    virtue: { pt: 'Coragem', 'pt-pt': 'Coragem', en: 'Courage' },
    passion: { pt: 'Medo (ansiedade)', 'pt-pt': 'Medo (ansiedade)', en: 'Fear (anxiety)' },
    basicFear: { pt: 'Ficar sem apoio ou orientação', 'pt-pt': 'Ficar sem apoio ou orientação', en: 'Being without support or guidance' },
    basicDesire: { pt: 'Ter segurança e apoio', 'pt-pt': 'Ter segurança e apoio', en: 'To have security and support' },
    levels: {
      integrated: { pt: 'Corajoso, autoconfiante, líder', 'pt-pt': 'Corajoso, autoconfiante, líder', en: 'Courageous, self-confident, leader' },
      average: { pt: 'Ansioso, dependente, defensivo', 'pt-pt': 'Ansioso, dependente, defensivo', en: 'Anxious, dependent, defensive' },
      unconscious: { pt: 'Paranoico, autodestrutivo, masoquista', 'pt-pt': 'Paranoico, autodestrutivo, masoquista', en: 'Paranoid, self-destructive, masochistic' }
    },
    relationships: {
      love: { pt: 'Você ama com lealdade e compromisso profundo.', 'pt-pt': 'Amas com lealdade e compromisso profundo.', en: 'You love with loyalty and deep commitment.' },
      protect: { pt: 'Se torna desconfiado e testador.', 'pt-pt': 'Tornas-te desconfiado e testador.', en: 'You become suspicious and testing.' },
      rejection: { pt: 'Reage com ansiedade e busca de garantias.', 'pt-pt': 'Reages com ansiedade e busca de garantias.', en: 'You react with anxiety and seeking reassurance.' }
    },
    work: {
      talents: { pt: 'Planejamento, análise de riscos, comprometimento', 'pt-pt': 'Planeamento, análise de riscos, comprometimento', en: 'Planning, risk analysis, commitment' },
      challenges: { pt: 'Paralisia por medo, dúvida excessiva', 'pt-pt': 'Paralisia por medo, dúvida excessiva', en: 'Paralysis by fear, excessive doubt' },
      ideal: { pt: 'Ambientes com estrutura clara e liderança confiável.', 'pt-pt': 'Ambientes com estrutura clara e liderança confiável.', en: 'Environments with clear structure and reliable leadership.' }
    },
    selfExamQuestion: {
      pt: 'O que aconteceria se você confiasse em si mesmo hoje?',
      'pt-pt': 'O que aconteceria se confiasses em ti mesmo hoje?',
      en: 'What would happen if you trusted yourself today?'
    },
    evolution: {
      pt: ['Confiar na própria intuição', 'Agir apesar do medo', 'Soltar a necessidade de certeza', 'Praticar fé ativa', 'Celebrar a coragem pequena'],
      'pt-pt': ['Confiar na própria intuição', 'Agir apesar do medo', 'Soltar a necessidade de certeza', 'Praticar fé ativa', 'Celebrar a coragem pequena'],
      en: ['Trust your own intuition', 'Act despite fear', 'Let go of the need for certainty', 'Practice active faith', 'Celebrate small courage']
    },
    sevenDayPlan: {
      pt: ['Tome uma decisão sem consultar ninguém', 'Faça algo que te assusta levemente', 'Confie em alguém', 'Descanse sem vigiar', 'Ore pedindo coragem', 'Celebre uma ação corajosa', 'Agradeça pela segurança que já existe'],
      'pt-pt': ['Toma uma decisão sem consultar ninguém', 'Faz algo que te assusta levemente', 'Confia em alguém', 'Descansa sem vigiar', 'Ora pedindo coragem', 'Celebra uma ação corajosa', 'Agradece pela segurança que já existe'],
      en: ['Make a decision without consulting anyone', 'Do something that slightly scares you', 'Trust someone', 'Rest without watching', 'Pray for courage', 'Celebrate a courageous action', 'Be grateful for the security that already exists']
    }
  },
  "7": {
    name: { pt: 'O Entusiasta', 'pt-pt': 'O Entusiasta', en: 'The Enthusiast' },
    emoji: '🎉',
    color: '#F97316',
    essence: { pt: 'Alegria, liberdade', 'pt-pt': 'Alegria, liberdade', en: 'Joy, freedom' },
    description: {
      pt: 'Você é movido pela alegria e pela busca de experiências. Sua energia é expansiva, otimista e cheia de possibilidades. Você traz luz onde há escuridão.',
      'pt-pt': 'És movido pela alegria e pela busca de experiências. A tua energia é expansiva, otimista e cheia de possibilidades. Tu trazes luz onde há escuridão.',
      en: 'You are driven by joy and the pursuit of experiences. Your energy is expansive, optimistic, and full of possibilities. You bring light where there is darkness.'
    },
    ego: {
      pt: 'Eu preciso estar feliz e evitar a dor.',
      'pt-pt': 'Eu preciso estar feliz e evitar a dor.',
      en: 'I need to be happy and avoid pain.'
    },
    wound: {
      pt: 'A dor e o tédio são intoleráveis.',
      'pt-pt': 'A dor e o tédio são intoleráveis.',
      en: 'Pain and boredom are intolerable.'
    },
    compulsion: {
      pt: 'Buscar prazer, evitar dor',
      'pt-pt': 'Buscar prazer, evitar dor',
      en: 'Seek pleasure, avoid pain'
    },
    strengths: {
      pt: ['Otimismo contagiante', 'Versatilidade', 'Entusiasmo', 'Visão de possibilidades', 'Capacidade de inspirar'],
      'pt-pt': ['Otimismo contagiante', 'Versatilidade', 'Entusiasmo', 'Visão de possibilidades', 'Capacidade de inspirar'],
      en: ['Contagious optimism', 'Versatility', 'Enthusiasm', 'Vision of possibilities', 'Ability to inspire']
    },
    vulnerabilities: {
      pt: ['Fuga da dor', 'Superficialidade', 'Impulsividade', 'Dificuldade com compromisso'],
      'pt-pt': ['Fuga da dor', 'Superficialidade', 'Impulsividade', 'Dificuldade com compromisso'],
      en: ['Fleeing from pain', 'Superficiality', 'Impulsivity', 'Difficulty with commitment']
    },
    light: {
      pt: 'Você lembra ao mundo que a alegria é um direito divino.',
      'pt-pt': 'Tu lembras ao mundo que a alegria é um direito divino.',
      en: 'You remind the world that joy is a divine right.'
    },
    nelloAgentMessage: {
      pt: 'Você cresce quando aprende a permanecer no presente, mesmo sem garantias de prazer. A verdadeira alegria não foge da dor - ela a transcende.',
      'pt-pt': 'Tu cresces quando aprendes a permanecer no presente, mesmo sem garantias de prazer. A verdadeira alegria não foge da dor - ela transcende-a.',
      en: 'You grow when you learn to stay in the present, even without guarantees of pleasure. True joy does not flee from pain - it transcends it.'
    },
    triggers: {
      pt: ['Tédio', 'Limitação', 'Dor emocional', 'Rotina'],
      'pt-pt': ['Tédio', 'Limitação', 'Dor emocional', 'Rotina'],
      en: ['Boredom', 'Limitation', 'Emotional pain', 'Routine']
    },
    healing: {
      pt: ['Permanecer no presente', 'Acolher emoções difíceis', 'Completar o que começa'],
      'pt-pt': ['Permanecer no presente', 'Acolher emoções difíceis', 'Completar o que começas'],
      en: ['Stay in the present', 'Welcome difficult emotions', 'Complete what you start']
    },
    virtue: { pt: 'Sobriedade', 'pt-pt': 'Sobriedade', en: 'Sobriety' },
    passion: { pt: 'Gula (por experiências)', 'pt-pt': 'Gula (por experiências)', en: 'Gluttony (for experiences)' },
    basicFear: { pt: 'Ser privado e sentir dor', 'pt-pt': 'Ser privado e sentir dor', en: 'Being deprived and feeling pain' },
    basicDesire: { pt: 'Ser satisfeito e feliz', 'pt-pt': 'Ser satisfeito e feliz', en: 'To be satisfied and happy' },
    levels: {
      integrated: { pt: 'Gratidão profunda, focado, contemplativo', 'pt-pt': 'Gratidão profunda, focado, contemplativo', en: 'Deep gratitude, focused, contemplative' },
      average: { pt: 'Hiperativo, disperso, insatisfeito', 'pt-pt': 'Hiperativo, disperso, insatisfeito', en: 'Hyperactive, scattered, dissatisfied' },
      unconscious: { pt: 'Maníaco, destrutivo, escapista', 'pt-pt': 'Maníaco, destrutivo, escapista', en: 'Manic, destructive, escapist' }
    },
    relationships: {
      love: { pt: 'Você ama com entusiasmo e diversão.', 'pt-pt': 'Amas com entusiasmo e diversão.', en: 'You love with enthusiasm and fun.' },
      protect: { pt: 'Foge do conflito e muda de assunto.', 'pt-pt': 'Foges do conflito e mudas de assunto.', en: 'You flee from conflict and change the subject.' },
      rejection: { pt: 'Reage buscando outras fontes de prazer.', 'pt-pt': 'Reages buscando outras fontes de prazer.', en: 'You react by seeking other sources of pleasure.' }
    },
    work: {
      talents: { pt: 'Criatividade, visão, entusiasmo', 'pt-pt': 'Criatividade, visão, entusiasmo', en: 'Creativity, vision, enthusiasm' },
      challenges: { pt: 'Dispersão, falta de foco', 'pt-pt': 'Dispersão, falta de foco', en: 'Dispersion, lack of focus' },
      ideal: { pt: 'Ambientes dinâmicos com variedade de projetos.', 'pt-pt': 'Ambientes dinâmicos com variedade de projetos.', en: 'Dynamic environments with variety of projects.' }
    },
    selfExamQuestion: {
      pt: 'O que aconteceria se você ficasse parado com uma emoção difícil?',
      'pt-pt': 'O que aconteceria se ficasses parado com uma emoção difícil?',
      en: 'What would happen if you stayed still with a difficult emotion?'
    },
    evolution: {
      pt: ['Permanecer no presente', 'Acolher emoções difíceis', 'Completar o que começa', 'Aprofundar em vez de expandir', 'Praticar gratidão pelo que já tem'],
      'pt-pt': ['Permanecer no presente', 'Acolher emoções difíceis', 'Completar o que começas', 'Aprofundar em vez de expandir', 'Praticar gratidão pelo que já tens'],
      en: ['Stay in the present', 'Welcome difficult emotions', 'Complete what you start', 'Deepen instead of expand', 'Practice gratitude for what you already have']
    },
    sevenDayPlan: {
      pt: ['Fique parado por 10 minutos', 'Sinta uma emoção difícil sem fugir', 'Complete uma tarefa antes de começar outra', 'Aprofunde uma conversa', 'Ore pedindo presença', 'Celebre algo simples', 'Agradeça pelo que já tem'],
      'pt-pt': ['Fica parado por 10 minutos', 'Sente uma emoção difícil sem fugir', 'Completa uma tarefa antes de começar outra', 'Aprofunda uma conversa', 'Ora pedindo presença', 'Celebra algo simples', 'Agradece pelo que já tens'],
      en: ['Stay still for 10 minutes', 'Feel a difficult emotion without fleeing', 'Complete one task before starting another', 'Deepen a conversation', 'Pray for presence', 'Celebrate something simple', 'Be grateful for what you already have']
    }
  },
  "8": {
    name: { pt: 'O Desafiador', 'pt-pt': 'O Desafiador', en: 'The Challenger' },
    emoji: '🦁',
    color: '#EF4444',
    essence: { pt: 'Força, proteção', 'pt-pt': 'Força, proteção', en: 'Strength, protection' },
    description: {
      pt: 'Você é movido pela força e proteção. Sua energia é poderosa, direta e profundamente protetora. Você defende os fracos e desafia a injustiça.',
      'pt-pt': 'És movido pela força e proteção. A tua energia é poderosa, direta e profundamente protetora. Tu defendes os fracos e desafias a injustiça.',
      en: 'You are driven by strength and protection. Your energy is powerful, direct, and deeply protective. You defend the weak and challenge injustice.'
    },
    ego: {
      pt: 'Eu preciso ser forte e nunca vulnerável.',
      'pt-pt': 'Eu preciso ser forte e nunca vulnerável.',
      en: 'I need to be strong and never vulnerable.'
    },
    wound: {
      pt: 'Ser vulnerável é perigoso.',
      'pt-pt': 'Ser vulnerável é perigoso.',
      en: 'Being vulnerable is dangerous.'
    },
    compulsion: {
      pt: 'Controlar, dominar, proteger',
      'pt-pt': 'Controlar, dominar, proteger',
      en: 'Control, dominate, protect'
    },
    strengths: {
      pt: ['Coragem inabalável', 'Proteção dos outros', 'Liderança natural', 'Autenticidade direta', 'Capacidade de decisão'],
      'pt-pt': ['Coragem inabalável', 'Proteção dos outros', 'Liderança natural', 'Autenticidade direta', 'Capacidade de decisão'],
      en: ['Unwavering courage', 'Protection of others', 'Natural leadership', 'Direct authenticity', 'Decision-making ability']
    },
    vulnerabilities: {
      pt: ['Agressividade excessiva', 'Dificuldade com vulnerabilidade', 'Dominação', 'Negação de fraquezas'],
      'pt-pt': ['Agressividade excessiva', 'Dificuldade com vulnerabilidade', 'Dominação', 'Negação de fraquezas'],
      en: ['Excessive aggressiveness', 'Difficulty with vulnerability', 'Domination', 'Denial of weaknesses']
    },
    light: {
      pt: 'Você protege os vulneráveis com sua força.',
      'pt-pt': 'Tu proteges os vulneráveis com a tua força.',
      en: 'You protect the vulnerable with your strength.'
    },
    nelloAgentMessage: {
      pt: 'Seu poder se equilibra quando reconhece a ternura como uma forma de força. A verdadeira força não precisa dominar - ela protege.',
      'pt-pt': 'O teu poder equilibra-se quando reconheces a ternura como uma forma de força. A verdadeira força não precisa dominar - ela protege.',
      en: 'Your power balances when you recognize tenderness as a form of strength. True strength does not need to dominate - it protects.'
    },
    triggers: {
      pt: ['Injustiça', 'Fraqueza percebida', 'Controle externo', 'Traição'],
      'pt-pt': ['Injustiça', 'Fraqueza percebida', 'Controlo externo', 'Traição'],
      en: ['Injustice', 'Perceived weakness', 'External control', 'Betrayal']
    },
    healing: {
      pt: ['Mostrar vulnerabilidade', 'Permitir que outros liderem', 'Usar força com gentileza'],
      'pt-pt': ['Mostrar vulnerabilidade', 'Permitir que outros liderem', 'Usar força com gentileza'],
      en: ['Show vulnerability', 'Allow others to lead', 'Use strength with gentleness']
    },
    virtue: { pt: 'Inocência', 'pt-pt': 'Inocência', en: 'Innocence' },
    passion: { pt: 'Luxúria (por intensidade)', 'pt-pt': 'Luxúria (por intensidade)', en: 'Lust (for intensity)' },
    basicFear: { pt: 'Ser controlado ou ferido', 'pt-pt': 'Ser controlado ou ferido', en: 'Being controlled or hurt' },
    basicDesire: { pt: 'Proteger-se e controlar o próprio destino', 'pt-pt': 'Proteger-se e controlar o próprio destino', en: 'To protect yourself and control your own destiny' },
    levels: {
      integrated: { pt: 'Magnânimo, protetor, gentil', 'pt-pt': 'Magnânimo, protetor, gentil', en: 'Magnanimous, protective, gentle' },
      average: { pt: 'Dominador, confrontador, intimidador', 'pt-pt': 'Dominador, confrontador, intimidador', en: 'Dominating, confrontational, intimidating' },
      unconscious: { pt: 'Destrutivo, vingativo, tirânico', 'pt-pt': 'Destrutivo, vingativo, tirânico', en: 'Destructive, vengeful, tyrannical' }
    },
    relationships: {
      love: { pt: 'Você ama protegendo e defendendo.', 'pt-pt': 'Amas protegendo e defendendo.', en: 'You love by protecting and defending.' },
      protect: { pt: 'Se torna dominador e controlador.', 'pt-pt': 'Tornas-te dominador e controlador.', en: 'You become dominating and controlling.' },
      rejection: { pt: 'Reage com raiva e confronto.', 'pt-pt': 'Reages com raiva e confronto.', en: 'You react with anger and confrontation.' }
    },
    work: {
      talents: { pt: 'Liderança, decisão, proteção', 'pt-pt': 'Liderança, decisão, proteção', en: 'Leadership, decision, protection' },
      challenges: { pt: 'Autoritarismo, intimidação', 'pt-pt': 'Autoritarismo, intimidação', en: 'Authoritarianism, intimidation' },
      ideal: { pt: 'Ambientes onde pode liderar e proteger causas justas.', 'pt-pt': 'Ambientes onde pode liderar e proteger causas justas.', en: 'Environments where you can lead and protect just causes.' }
    },
    selfExamQuestion: {
      pt: 'O que aconteceria se você mostrasse vulnerabilidade hoje?',
      'pt-pt': 'O que aconteceria se mostrasses vulnerabilidade hoje?',
      en: 'What would happen if you showed vulnerability today?'
    },
    evolution: {
      pt: ['Mostrar vulnerabilidade', 'Permitir que outros liderem', 'Usar força com gentileza', 'Ouvir antes de reagir', 'Confiar na bondade dos outros'],
      'pt-pt': ['Mostrar vulnerabilidade', 'Permitir que outros liderem', 'Usar força com gentileza', 'Ouvir antes de reagir', 'Confiar na bondade dos outros'],
      en: ['Show vulnerability', 'Allow others to lead', 'Use strength with gentleness', 'Listen before reacting', 'Trust in others\' goodness']
    },
    sevenDayPlan: {
      pt: ['Mostre uma vulnerabilidade', 'Deixe alguém liderar', 'Fale com gentileza', 'Ouça sem interromper', 'Ore pedindo ternura', 'Celebre uma conexão suave', 'Agradeça por quem te protegeu'],
      'pt-pt': ['Mostra uma vulnerabilidade', 'Deixa alguém liderar', 'Fala com gentileza', 'Ouve sem interromper', 'Ora pedindo ternura', 'Celebra uma conexão suave', 'Agradece por quem te protegeu'],
      en: ['Show a vulnerability', 'Let someone lead', 'Speak gently', 'Listen without interrupting', 'Pray for tenderness', 'Celebrate a gentle connection', 'Be grateful for those who protected you']
    }
  },
  "9": {
    name: { pt: 'O Pacificador', 'pt-pt': 'O Pacificador', en: 'The Peacemaker' },
    emoji: '🕊️',
    color: '#22C55E',
    essence: { pt: 'Paz, harmonia', 'pt-pt': 'Paz, harmonia', en: 'Peace, harmony' },
    description: {
      pt: 'Você é movido pela paz e harmonia. Sua energia é serena, acolhedora e profundamente receptiva. Você traz calma onde há conflito.',
      'pt-pt': 'És movido pela paz e harmonia. A tua energia é serena, acolhedora e profundamente receptiva. Tu trazes calma onde há conflito.',
      en: 'You are driven by peace and harmony. Your energy is serene, welcoming, and deeply receptive. You bring calm where there is conflict.'
    },
    ego: {
      pt: 'Eu preciso manter a paz a qualquer custo.',
      'pt-pt': 'Eu preciso manter a paz a qualquer custo.',
      en: 'I need to keep the peace at any cost.'
    },
    wound: {
      pt: 'Minha vontade não importa.',
      'pt-pt': 'A minha vontade não importa.',
      en: 'My will does not matter.'
    },
    compulsion: {
      pt: 'Evitar conflito, fundir-se com outros',
      'pt-pt': 'Evitar conflito, fundir-se com outros',
      en: 'Avoid conflict, merge with others'
    },
    strengths: {
      pt: ['Capacidade de mediar', 'Aceitação incondicional', 'Presença calmante', 'Visão integradora', 'Paciência profunda'],
      'pt-pt': ['Capacidade de mediar', 'Aceitação incondicional', 'Presença calmante', 'Visão integradora', 'Paciência profunda'],
      en: ['Mediation ability', 'Unconditional acceptance', 'Calming presence', 'Integrative vision', 'Deep patience']
    },
    vulnerabilities: {
      pt: ['Passividade', 'Evitação de conflito', 'Dificuldade com a própria vontade', 'Auto-esquecimento'],
      'pt-pt': ['Passividade', 'Evitação de conflito', 'Dificuldade com a própria vontade', 'Auto-esquecimento'],
      en: ['Passivity', 'Conflict avoidance', 'Difficulty with own will', 'Self-forgetfulness']
    },
    light: {
      pt: 'Você une o que parecia impossível de unir.',
      'pt-pt': 'Tu unes o que parecia impossível de unir.',
      en: 'You unite what seemed impossible to unite.'
    },
    nelloAgentMessage: {
      pt: 'Seu caminho é despertar para a própria vontade sem medo de desagradar. Quando você se torna presente, sua paz deixa de ser fuga e se torna força.',
      'pt-pt': 'O teu caminho é despertar para a própria vontade sem medo de desagradar. Quando te tornas presente, a tua paz deixa de ser fuga e torna-se força.',
      en: 'Your path is to awaken to your own will without fear of displeasing. When you become present, your peace stops being escape and becomes strength.'
    },
    triggers: {
      pt: ['Conflito', 'Pressão', 'Ser ignorado', 'Decisões forçadas'],
      'pt-pt': ['Conflito', 'Pressão', 'Ser ignorado', 'Decisões forçadas'],
      en: ['Conflict', 'Pressure', 'Being ignored', 'Forced decisions']
    },
    healing: {
      pt: ['Expressar a própria vontade', 'Enfrentar conflitos necessários', 'Tomar posição'],
      'pt-pt': ['Expressar a própria vontade', 'Enfrentar conflitos necessários', 'Tomar posição'],
      en: ['Express your own will', 'Face necessary conflicts', 'Take a stand']
    },
    virtue: { pt: 'Ação', 'pt-pt': 'Ação', en: 'Action' },
    passion: { pt: 'Preguiça (inércia espiritual)', 'pt-pt': 'Preguiça (inércia espiritual)', en: 'Sloth (spiritual inertia)' },
    basicFear: { pt: 'Perda e separação', 'pt-pt': 'Perda e separação', en: 'Loss and separation' },
    basicDesire: { pt: 'Ter paz interior e harmonia', 'pt-pt': 'Ter paz interior e harmonia', en: 'To have inner peace and harmony' },
    levels: {
      integrated: { pt: 'Presente, autoconsciente, dinâmico', 'pt-pt': 'Presente, autoconsciente, dinâmico', en: 'Present, self-aware, dynamic' },
      average: { pt: 'Passivo, complacente, negligente consigo', 'pt-pt': 'Passivo, complacente, negligente consigo', en: 'Passive, complacent, self-neglecting' },
      unconscious: { pt: 'Dissociado, apático, deprimido', 'pt-pt': 'Dissociado, apático, deprimido', en: 'Dissociated, apathetic, depressed' }
    },
    relationships: {
      love: { pt: 'Você ama com aceitação incondicional.', 'pt-pt': 'Amas com aceitação incondicional.', en: 'You love with unconditional acceptance.' },
      protect: { pt: 'Se funde com o outro e perde identidade.', 'pt-pt': 'Fundes-te com o outro e perdes identidade.', en: 'You merge with the other and lose identity.' },
      rejection: { pt: 'Reage com retraimento e passividade.', 'pt-pt': 'Reages com retraimento e passividade.', en: 'You react with withdrawal and passivity.' }
    },
    work: {
      talents: { pt: 'Mediação, diplomacia, harmonia', 'pt-pt': 'Mediação, diplomacia, harmonia', en: 'Mediation, diplomacy, harmony' },
      challenges: { pt: 'Procrastinação, falta de iniciativa', 'pt-pt': 'Procrastinação, falta de iniciativa', en: 'Procrastination, lack of initiative' },
      ideal: { pt: 'Ambientes harmoniosos com baixo conflito.', 'pt-pt': 'Ambientes harmoniosos com baixo conflito.', en: 'Harmonious environments with low conflict.' }
    },
    selfExamQuestion: {
      pt: 'O que você realmente quer, independente do que os outros pensam?',
      'pt-pt': 'O que realmente queres, independente do que os outros pensam?',
      en: 'What do you really want, regardless of what others think?'
    },
    evolution: {
      pt: ['Expressar a própria vontade', 'Enfrentar conflitos necessários', 'Tomar posição', 'Agir em vez de esperar', 'Valorizar a si mesmo'],
      'pt-pt': ['Expressar a própria vontade', 'Enfrentar conflitos necessários', 'Tomar posição', 'Agir em vez de esperar', 'Valorizar a ti mesmo'],
      en: ['Express your own will', 'Face necessary conflicts', 'Take a stand', 'Act instead of waiting', 'Value yourself']
    },
    sevenDayPlan: {
      pt: ['Expresse uma opinião própria', 'Tome uma decisão sem consultar', 'Diga o que realmente quer', 'Enfrente um pequeno conflito', 'Ore pedindo presença', 'Celebre uma ação sua', 'Agradeça por sua força interior'],
      'pt-pt': ['Expressa uma opinião própria', 'Toma uma decisão sem consultar', 'Diz o que realmente queres', 'Enfrenta um pequeno conflito', 'Ora pedindo presença', 'Celebra uma ação tua', 'Agradece pela tua força interior'],
      en: ['Express your own opinion', 'Make a decision without consulting', 'Say what you really want', 'Face a small conflict', 'Pray for presence', 'Celebrate an action of yours', 'Be grateful for your inner strength']
    }
  }
};

interface EneagramaResult {
  primaryType: string | number;
  secondaryType?: string | number;
  wing?: string | number;
  scores?: Record<string, number>;
  percentages?: Record<string, number>;
  hasCloseSecondary?: boolean;
}

interface EneagramaResultsSectionProps {
  enneagramResults: EneagramaResult;
  lang: 'pt' | 'pt-pt' | 'en';
  userName?: string;
}

// Helper to extract first name
const getFirstName = (fullName?: string): string => {
  if (!fullName) return '';
  return fullName.split(' ')[0];
};

export function EneagramaResultsSection({ enneagramResults, lang, userName }: EneagramaResultsSectionProps) {
  const [showAllScores, setShowAllScores] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const primaryType = String(enneagramResults.primaryType);
  const secondaryType = enneagramResults.secondaryType ? String(enneagramResults.secondaryType) : null;
  const wing = enneagramResults.wing ? String(enneagramResults.wing) : null;
  const profile = ENNEAGRAM_PROFILES_RICH[primaryType];
  const secondaryProfile = secondaryType ? ENNEAGRAM_PROFILES_RICH[secondaryType] : null;
  const wingProfile = wing ? ENNEAGRAM_PROFILES_RICH[wing] : null;
  
  const firstName = getFirstName(userName);

  if (!profile) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <p className="text-destructive">
            {lang === 'en' ? 'Error: Could not load Enneagram profile.' : 'Erro: Não foi possível carregar o perfil do Eneagrama.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate sorted scores for display
  const scores = enneagramResults.scores || {};
  const percentages = enneagramResults.percentages || {};
  
  const sortedScores = Object.entries(scores)
    .map(([type, score]) => ({
      type,
      score: score as number,
      percentage: percentages[type] || Math.round((score as number / 25) * 100)
    }))
    .sort((a, b) => b.score - a.score);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const labels: Record<string, Record<string, string>> = {
    pt: {
      yourType: 'Seu Tipo Eneagrama',
      essence: 'Essência',
      strengths: 'Suas Forças Naturais',
      strengthsDesc: 'Dons que você naturalmente traz',
      vulnerabilities: 'Vulnerabilidades',
      vulnerabilitiesDesc: 'Áreas que pedem sua atenção consciente',
      light: 'Sua Luz',
      nelloMessage: 'Mensagem de Nello AI',
      evolution: 'Caminho de Evolução',
      evolutionDesc: 'Passos para integração e crescimento',
      sevenDayPlan: 'Plano de 7 Dias',
      sevenDayPlanDesc: 'Práticas diárias para transformação',
      scores: 'Seus 9 Tipos',
      scoresDesc: 'Como você se distribui entre os tipos',
      virtue: 'Virtude',
      passion: 'Paixão',
      basicFear: 'Medo Básico',
      basicDesire: 'Desejo Básico',
      secondaryType: 'Tipo Secundário',
      day: 'Dia',
      disclaimer: 'O Eneagrama revela padrões de motivação e tendências do ego. Ele não é um diagnóstico psicológico e não define quem você é, mas convida à consciência e ao crescimento.',
      egoMask: 'Ego e Máscara',
      coreWound: 'Ferida Central',
      compulsion: 'Compulsão',
      levels: 'Níveis de Consciência',
      integrated: 'Integrado',
      average: 'Médio',
      unconscious: 'Inconsciente',
      triggers: 'Gatilhos Emocionais',
      triggersDesc: 'Situações que ativam seus padrões automáticos',
      healing: 'Caminho de Cura',
      healingDesc: 'Práticas para integração',
      relationships: 'Você em Relacionamentos',
      howYouLove: 'Como você ama',
      howYouProtect: 'Como se protege',
      howYouReact: 'Como reage à rejeição',
      work: 'Você no Trabalho',
      talents: 'Talentos naturais',
      challenges: 'Desafios',
      idealEnv: 'Ambiente ideal',
      selfExam: 'Pergunta de Autoexame',
      wing: 'Asa',
      closingMessage: 'Mensagem Final',
      closingText: 'Você não é seu tipo. Você é a presença que observa o seu tipo. Essa jornada é um convite para acordar quem você sempre foi.'
    },
    'pt-pt': {
      yourType: 'O Teu Tipo Eneagrama',
      essence: 'Essência',
      strengths: 'As Tuas Forças Naturais',
      strengthsDesc: 'Dons que tu naturalmente trazes',
      vulnerabilities: 'Vulnerabilidades',
      vulnerabilitiesDesc: 'Áreas que pedem a tua atenção consciente',
      light: 'A Tua Luz',
      nelloMessage: 'Mensagem de Nello AI',
      evolution: 'Caminho de Evolução',
      evolutionDesc: 'Passos para integração e crescimento',
      sevenDayPlan: 'Plano de 7 Dias',
      sevenDayPlanDesc: 'Práticas diárias para transformação',
      scores: 'Os Teus 9 Tipos',
      scoresDesc: 'Como te distribuis entre os tipos',
      virtue: 'Virtude',
      passion: 'Paixão',
      basicFear: 'Medo Básico',
      basicDesire: 'Desejo Básico',
      secondaryType: 'Tipo Secundário',
      day: 'Dia',
      disclaimer: 'O Eneagrama revela padrões de motivação e tendências do ego. Ele não é um diagnóstico psicológico e não define quem és, mas convida à consciência e ao crescimento.',
      egoMask: 'Ego e Máscara',
      coreWound: 'Ferida Central',
      compulsion: 'Compulsão',
      levels: 'Níveis de Consciência',
      integrated: 'Integrado',
      average: 'Médio',
      unconscious: 'Inconsciente',
      triggers: 'Gatilhos Emocionais',
      triggersDesc: 'Situações que ativam os teus padrões automáticos',
      healing: 'Caminho de Cura',
      healingDesc: 'Práticas para integração',
      relationships: 'Tu em Relacionamentos',
      howYouLove: 'Como amas',
      howYouProtect: 'Como te proteges',
      howYouReact: 'Como reages à rejeição',
      work: 'Tu no Trabalho',
      talents: 'Talentos naturais',
      challenges: 'Desafios',
      idealEnv: 'Ambiente ideal',
      selfExam: 'Pergunta de Autoexame',
      wing: 'Asa',
      closingMessage: 'Mensagem Final',
      closingText: 'Tu não és o teu tipo. Tu és a presença que observa o teu tipo. Esta jornada é um convite para acordares quem sempre foste.'
    },
    en: {
      yourType: 'Your Enneagram Type',
      essence: 'Essence',
      strengths: 'Your Natural Strengths',
      strengthsDesc: 'Gifts you naturally bring',
      vulnerabilities: 'Vulnerabilities',
      vulnerabilitiesDesc: 'Areas that call for your conscious attention',
      light: 'Your Light',
      nelloMessage: 'Message from Nello AI',
      evolution: 'Evolution Path',
      evolutionDesc: 'Steps for integration and growth',
      sevenDayPlan: '7-Day Plan',
      sevenDayPlanDesc: 'Daily practices for transformation',
      scores: 'Your 9 Types',
      scoresDesc: 'How you distribute among types',
      virtue: 'Virtue',
      passion: 'Passion',
      basicFear: 'Basic Fear',
      basicDesire: 'Basic Desire',
      secondaryType: 'Secondary Type',
      day: 'Day',
      disclaimer: 'The Enneagram reveals patterns of motivation and ego tendencies. It is not a psychological diagnosis and does not define who you are, but invites awareness and growth.',
      egoMask: 'Ego and Mask',
      coreWound: 'Core Wound',
      compulsion: 'Compulsion',
      levels: 'Levels of Consciousness',
      integrated: 'Integrated',
      average: 'Average',
      unconscious: 'Unconscious',
      triggers: 'Emotional Triggers',
      triggersDesc: 'Situations that activate your automatic patterns',
      healing: 'Path of Healing',
      healingDesc: 'Practices for integration',
      relationships: 'You in Relationships',
      howYouLove: 'How you love',
      howYouProtect: 'How you protect yourself',
      howYouReact: 'How you react to rejection',
      work: 'You at Work',
      talents: 'Natural talents',
      challenges: 'Challenges',
      idealEnv: 'Ideal environment',
      selfExam: 'Self-Examination Question',
      wing: 'Wing',
      closingMessage: 'Final Message',
      closingText: 'You are not your type. You are the presence that observes your type. This journey is an invitation to awaken who you have always been.'
    }
  };

  const t = labels[lang];

  // Collapsible section component
  const CollapsibleSection = ({ 
    id, 
    icon: Icon, 
    title, 
    description, 
    children, 
    colorClass = "border-accent/30",
    bgClass = ""
  }: { 
    id: string; 
    icon: any; 
    title: string; 
    description?: string; 
    children: React.ReactNode;
    colorClass?: string;
    bgClass?: string;
  }) => (
    <Collapsible open={expandedSections[id]} onOpenChange={() => toggleSection(id)}>
      <Card className={`border-2 ${colorClass} ${bgClass}`}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-accent" />
                <div>
                  <CardTitle className="text-lg">{title}</CardTitle>
                  {description && <CardDescription>{description}</CardDescription>}
                </div>
              </div>
              <ChevronDown className={`h-5 w-5 transition-transform ${expandedSections[id] ? 'rotate-180' : ''}`} />
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">{children}</CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );

  return (
    <Card className="border-none shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 pb-8">
        <div className="text-center space-y-4">
          <div className="text-6xl">{profile.emoji}</div>
          <CardTitle className="text-3xl font-light">
            {firstName && <span className="block text-lg text-muted-foreground mb-2">{firstName},</span>}
            {lang === 'en' ? 'Type' : 'Tipo'} {primaryType}{wing && `w${wing}`} - {profile.name[lang]}
          </CardTitle>
          <CardDescription className="text-lg">{t.yourType}</CardDescription>
          <Badge 
            variant="secondary" 
            className="px-4 py-2 text-sm"
            style={{ backgroundColor: `${profile.color}20`, color: profile.color }}
          >
            {t.essence}: {profile.essence[lang]}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-8 space-y-6">
        {/* Disclaimer */}
        <Alert className="border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/20">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-sm">{t.disclaimer}</AlertDescription>
        </Alert>

        {/* Main Description */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <p className="text-lg leading-relaxed">{profile.description[lang]}</p>
        </div>

        {/* Dominant and Secondary Types with Wing */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Primary Type Card */}
          <Card className="border-2 border-accent">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${profile.color}20` }}
                >
                  {profile.emoji}
                </div>
                <div>
                  <CardTitle className="text-lg">{lang === 'en' ? 'Type' : 'Tipo'} {primaryType}</CardTitle>
                  <CardDescription>{profile.name[lang]}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t.virtue}</span>
                <Badge variant="outline">{profile.virtue[lang]}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t.passion}</span>
                <Badge variant="outline">{profile.passion[lang]}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Wing Card */}
          {wingProfile && (
            <Card className="border-2 border-primary/30">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${wingProfile.color}20` }}
                  >
                    {wingProfile.emoji}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{t.wing}</CardTitle>
                    <CardDescription>{lang === 'en' ? 'Type' : 'Tipo'} {wing} - {wingProfile.name[lang]}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>{wingProfile.essence[lang]}</p>
              </CardContent>
            </Card>
          )}

          {/* Secondary Type Card */}
          {secondaryProfile && enneagramResults.hasCloseSecondary && (
            <Card className="border-2 border-muted">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${secondaryProfile.color}20` }}
                  >
                    {secondaryProfile.emoji}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{t.secondaryType}</CardTitle>
                    <CardDescription>{lang === 'en' ? 'Type' : 'Tipo'} {secondaryType} - {secondaryProfile.name[lang]}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>{secondaryProfile.essence[lang]}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Fear and Desire */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 border-red-500/30 bg-red-50/50 dark:bg-red-950/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-red-700 dark:text-red-400">
                <Shield className="h-5 w-5" />
                {t.basicFear}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground">{profile.basicFear[lang]}</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-500/30 bg-green-50/50 dark:bg-green-950/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-green-700 dark:text-green-400">
                <Heart className="h-5 w-5" />
                {t.basicDesire}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground">{profile.basicDesire[lang]}</p>
            </CardContent>
          </Card>
        </div>

        {/* Ego and Wound - Collapsible */}
        <CollapsibleSection id="egoWound" icon={Eye} title={t.egoMask} colorClass="border-orange-500/30" bgClass="bg-orange-50/50 dark:bg-orange-950/20">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-orange-700 dark:text-orange-400 mb-2">{t.egoMask}</h4>
              <p className="text-foreground italic">"{profile.ego[lang]}"</p>
            </div>
            <div>
              <h4 className="font-medium text-orange-700 dark:text-orange-400 mb-2">{t.coreWound}</h4>
              <p className="text-foreground italic">"{profile.wound[lang]}"</p>
            </div>
            <div>
              <h4 className="font-medium text-orange-700 dark:text-orange-400 mb-2">{t.compulsion}</h4>
              <p className="text-foreground">{profile.compulsion[lang]}</p>
            </div>
          </div>
        </CollapsibleSection>

        {/* Levels of Consciousness - Collapsible */}
        <CollapsibleSection id="levels" icon={Brain} title={t.levels} colorClass="border-indigo-500/30" bgClass="bg-indigo-50/50 dark:bg-indigo-950/20">
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-green-100/50 dark:bg-green-900/20 border border-green-300/50">
              <h4 className="font-medium text-green-700 dark:text-green-400 mb-2">✨ {t.integrated} (1-3)</h4>
              <p className="text-foreground">{profile.levels.integrated[lang]}</p>
            </div>
            <div className="p-4 rounded-lg bg-yellow-100/50 dark:bg-yellow-900/20 border border-yellow-300/50">
              <h4 className="font-medium text-yellow-700 dark:text-yellow-400 mb-2">⚖️ {t.average} (4-6)</h4>
              <p className="text-foreground">{profile.levels.average[lang]}</p>
            </div>
            <div className="p-4 rounded-lg bg-red-100/50 dark:bg-red-900/20 border border-red-300/50">
              <h4 className="font-medium text-red-700 dark:text-red-400 mb-2">⚠️ {t.unconscious} (7-9)</h4>
              <p className="text-foreground">{profile.levels.unconscious[lang]}</p>
            </div>
          </div>
        </CollapsibleSection>

        {/* Strengths */}
        <Card className="border-2 border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <Star className="h-5 w-5" />
              {t.strengths}
            </CardTitle>
            <CardDescription>{t.strengthsDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {profile.strengths[lang].map((strength: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
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
              {t.vulnerabilities}
            </CardTitle>
            <CardDescription>{t.vulnerabilitiesDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {profile.vulnerabilities[lang].map((vuln: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="h-5 w-5 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 text-xs font-medium mt-0.5 flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-foreground">{vuln}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Triggers - Collapsible */}
        <CollapsibleSection id="triggers" icon={Zap} title={t.triggers} description={t.triggersDesc} colorClass="border-red-500/30" bgClass="bg-red-50/30 dark:bg-red-950/10">
          <div className="flex flex-wrap gap-2">
            {profile.triggers[lang].map((trigger: string, index: number) => (
              <Badge key={index} variant="outline" className="border-red-300 text-red-700 dark:text-red-400">
                {trigger}
              </Badge>
            ))}
          </div>
        </CollapsibleSection>

        {/* Relationships - Collapsible */}
        <CollapsibleSection id="relationships" icon={Users} title={t.relationships} colorClass="border-pink-500/30" bgClass="bg-pink-50/50 dark:bg-pink-950/20">
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-background/80 border border-border/50">
              <h4 className="font-medium text-pink-700 dark:text-pink-400 mb-1">❤️ {t.howYouLove}</h4>
              <p className="text-foreground">{profile.relationships.love[lang]}</p>
            </div>
            <div className="p-3 rounded-lg bg-background/80 border border-border/50">
              <h4 className="font-medium text-pink-700 dark:text-pink-400 mb-1">🛡️ {t.howYouProtect}</h4>
              <p className="text-foreground">{profile.relationships.protect[lang]}</p>
            </div>
            <div className="p-3 rounded-lg bg-background/80 border border-border/50">
              <h4 className="font-medium text-pink-700 dark:text-pink-400 mb-1">💔 {t.howYouReact}</h4>
              <p className="text-foreground">{profile.relationships.rejection[lang]}</p>
            </div>
          </div>
        </CollapsibleSection>

        {/* Work - Collapsible */}
        <CollapsibleSection id="work" icon={Briefcase} title={t.work} colorClass="border-blue-500/30" bgClass="bg-blue-50/50 dark:bg-blue-950/20">
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-background/80 border border-border/50">
              <h4 className="font-medium text-blue-700 dark:text-blue-400 mb-1">⭐ {t.talents}</h4>
              <p className="text-foreground">{profile.work.talents[lang]}</p>
            </div>
            <div className="p-3 rounded-lg bg-background/80 border border-border/50">
              <h4 className="font-medium text-blue-700 dark:text-blue-400 mb-1">⚠️ {t.challenges}</h4>
              <p className="text-foreground">{profile.work.challenges[lang]}</p>
            </div>
            <div className="p-3 rounded-lg bg-background/80 border border-border/50">
              <h4 className="font-medium text-blue-700 dark:text-blue-400 mb-1">🏠 {t.idealEnv}</h4>
              <p className="text-foreground">{profile.work.ideal[lang]}</p>
            </div>
          </div>
        </CollapsibleSection>

        {/* Light */}
        <Card className="bg-gradient-to-br from-accent/10 to-background border-accent/30">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Sparkles className="h-5 w-5 text-accent" />
              {t.light}
            </div>
            <p className="text-lg leading-relaxed pl-7 italic">{profile.light[lang]}</p>
          </CardContent>
        </Card>

        {/* Nello AI Message */}
        <Card className="border-2 border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-primary">
              <Lightbulb className="h-5 w-5" />
              {t.nelloMessage}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base leading-relaxed italic text-foreground">
              {firstName && `${firstName}, `}{profile.nelloAgentMessage[lang]}
            </p>
          </CardContent>
        </Card>

        {/* Self-Examination Question */}
        <Card className="border-2 border-purple-500/30 bg-purple-50/50 dark:bg-purple-950/20">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-purple-700 dark:text-purple-400">
              <Target className="h-5 w-5" />
              {t.selfExam}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed italic text-foreground">{profile.selfExamQuestion[lang]}</p>
          </CardContent>
        </Card>

        {/* Healing Path - Collapsible */}
        <CollapsibleSection id="healing" icon={Flame} title={t.healing} description={t.healingDesc} colorClass="border-teal-500/30" bgClass="bg-teal-50/50 dark:bg-teal-950/20">
          <ul className="space-y-3">
            {profile.healing[lang].map((step: string, index: number) => (
              <li key={index} className="flex items-start gap-3">
                <span className="h-6 w-6 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400 text-sm font-semibold flex-shrink-0">
                  {index + 1}
                </span>
                <span className="text-foreground">{step}</span>
              </li>
            ))}
          </ul>
        </CollapsibleSection>

        {/* Evolution Path */}
        <Card className="border-2 border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/20">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-blue-700 dark:text-blue-400">
              <TrendingUp className="h-5 w-5" />
              {t.evolution}
            </CardTitle>
            <CardDescription>{t.evolutionDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {profile.evolution[lang].map((step: string, index: number) => (
                <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-background/80 border border-border/50">
                  <span className="h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-semibold flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-foreground leading-relaxed">{step}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* 7-Day Plan */}
        <Card className="border-2 border-purple-500/30 bg-purple-50/50 dark:bg-purple-950/20">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-purple-700 dark:text-purple-400">
              <Calendar className="h-5 w-5" />
              {t.sevenDayPlan}
            </CardTitle>
            <CardDescription>{t.sevenDayPlanDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {profile.sevenDayPlan[lang].map((day: string, index: number) => (
                <div 
                  key={index} 
                  className="flex items-center gap-4 p-4 rounded-lg bg-background/80 border border-border/50"
                >
                  <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">{t.day} {index + 1}</span>
                    <p className="text-foreground">{day}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Scores Breakdown */}
        {sortedScores.length > 0 && (
          <Collapsible open={showAllScores} onOpenChange={setShowAllScores}>
            <Card className="border-2 border-accent/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{t.scores}</CardTitle>
                    <CardDescription>{t.scoresDesc}</CardDescription>
                  </div>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <ChevronDown className={`h-4 w-4 transition-transform ${showAllScores ? 'rotate-180' : ''}`} />
                    </Button>
                  </CollapsibleTrigger>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Top 3 always visible */}
                {sortedScores.slice(0, 3).map(({ type, score, percentage }) => {
                  const typeProfile = ENNEAGRAM_PROFILES_RICH[type];
                  const isPrimary = type === primaryType;
                  return (
                    <div
                      key={type}
                      className={`space-y-2 p-4 rounded-lg ${
                        isPrimary ? "bg-accent/20 border-2 border-accent" : "bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{typeProfile?.emoji || '🌿'}</span>
                          <div>
                            <h4 className={`font-medium ${isPrimary ? "text-accent" : ""}`}>
                              {lang === 'en' ? 'Type' : 'Tipo'} {type} - {typeProfile?.name[lang] || ''}
                            </h4>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`text-lg font-bold ${isPrimary ? "text-accent" : ""}`}>
                            {score}/25
                          </span>
                          <p className="text-xs text-muted-foreground">{percentage}%</p>
                        </div>
                      </div>
                      <Progress value={percentage} className={isPrimary ? "h-3" : "h-2"} />
                    </div>
                  );
                })}

                {/* Remaining types in collapsible */}
                <CollapsibleContent className="space-y-4">
                  {sortedScores.slice(3).map(({ type, score, percentage }) => {
                    const typeProfile = ENNEAGRAM_PROFILES_RICH[type];
                    return (
                      <div key={type} className="space-y-2 p-4 rounded-lg bg-muted/30">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{typeProfile?.emoji || '🌿'}</span>
                            <div>
                              <h4 className="font-medium">
                                {lang === 'en' ? 'Type' : 'Tipo'} {type} - {typeProfile?.name[lang] || ''}
                              </h4>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-bold">{score}/25</span>
                            <p className="text-xs text-muted-foreground">{percentage}%</p>
                          </div>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </CollapsibleContent>
              </CardContent>
            </Card>
          </Collapsible>
        )}

        {/* Closing Message */}
        <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-primary">
              <Sparkles className="h-5 w-5" />
              {t.closingMessage}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed italic text-foreground text-center">
              {firstName && `${firstName}, `}{t.closingText}
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-lg font-light italic text-muted-foreground">
            NELLO ONE — {lang === 'en' ? 'a journey of self-knowledge and inner truth.' : 'uma jornada de autoconhecimento e verdade interior.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
