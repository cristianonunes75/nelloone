import React, { createContext, useContext, useState, ReactNode } from 'react';

// Simulation languages - includes future languages in development
export type SimulationLanguage = 'pt' | 'en' | 'es' | 'it' | 'fr';

// Language metadata for the selector
export const SIMULATION_LANGUAGES: {
  code: SimulationLanguage;
  name: string;
  flag: string;
  status: 'public' | 'beta' | 'development';
}[] = [
  { code: 'pt', name: 'Português', flag: '🇧🇷', status: 'public' },
  { code: 'en', name: 'English', flag: '🇺🇸', status: 'public' },
  { code: 'es', name: 'Español', flag: '🇪🇸', status: 'development' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹', status: 'development' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', status: 'development' },
];

// Get public languages only (for non-admin users)
export const getPublicLanguages = () => 
  SIMULATION_LANGUAGES.filter(lang => lang.status === 'public');

interface SimulationContextType {
  // Simulation state
  isSimulationActive: boolean;
  simulationLanguage: SimulationLanguage;
  originalAdminLanguage: string;
  
  // Actions
  startSimulation: (language: SimulationLanguage, adminLang: string) => void;
  endSimulation: () => void;
  setSimulationLanguage: (lang: SimulationLanguage) => void;
  
  // Helpers
  getSimulationLabel: (key: string) => string;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

// Simulation-specific UI labels for each language
const simulationLabels: Record<SimulationLanguage, Record<string, string>> = {
  pt: {
    simulation_mode: 'Modo Simulação',
    sandbox_environment: 'Ambiente Sandbox',
    sandbox_description: 'Todas as simulações são executadas em memória. Nenhum dado é salvo no banco real.',
    individual_test: 'Teste Individual',
    complete_journey: 'Jornada Completa',
    simulate: 'Simular',
    auto: 'Auto',
    questions: 'perguntas',
    minutes: 'min',
    simulate_complete_journey: 'Simular Jornada Completa',
    journey_description: 'Execute automaticamente todos os 7 testes e gere o Mapa Nello Identity',
    start_simulated_journey: 'Iniciar Jornada Simulada',
    processing_journey: 'Processando jornada...',
    journey_results: 'Resultados da Jornada',
    completed: 'Concluído',
    question: 'Pergunta',
    of: 'de',
    answered: 'respondidas',
    previous: 'Anterior',
    next: 'Próxima',
    calculate_result: 'Calcular Resultado',
    quick_response: 'Resposta Rápida',
    neutral_values: 'Valores Neutros (3)',
    high_values: 'Valores Altos (5)',
    low_values: 'Valores Baixos (1)',
    randomize: 'Randomizar',
    skip_to_question: 'Pular para Pergunta',
    go: 'Ir',
    cancel: 'Cancelar',
    simulation_result: 'Resultado da Simulação',
    no_data_saved: 'Nenhum dado será salvo',
    clean_view: 'Visão Cliente',
    technical_view: 'Visão Técnica',
    your_result: 'Seu resultado',
    score_distribution: 'Distribuição de Scores',
    ask_miguel: 'Perguntar ao Nello AI',
    miguel_analysis: 'Análise do Nello AI',
    new_simulation: 'Nova Simulação',
    select_language: 'Selecione o idioma da simulação',
    start_simulation: 'Iniciar Simulação',
    development: 'Em desenvolvimento',
    beta: 'Beta',
    public: 'Público',
    language_note: 'Admins podem testar idiomas em desenvolvimento',
    end_simulation: 'Encerrar Simulação',
  },
  en: {
    simulation_mode: 'Simulation Mode',
    sandbox_environment: 'Sandbox Environment',
    sandbox_description: 'All simulations run in memory. No data is saved to the real database.',
    individual_test: 'Individual Test',
    complete_journey: 'Complete Journey',
    simulate: 'Simulate',
    auto: 'Auto',
    questions: 'questions',
    minutes: 'min',
    simulate_complete_journey: 'Simulate Complete Journey',
    journey_description: 'Automatically run all 7 tests and generate the Nello Identity Map',
    start_simulated_journey: 'Start Simulated Journey',
    processing_journey: 'Processing journey...',
    journey_results: 'Journey Results',
    completed: 'Completed',
    question: 'Question',
    of: 'of',
    answered: 'answered',
    previous: 'Previous',
    next: 'Next',
    calculate_result: 'Calculate Result',
    quick_response: 'Quick Response',
    neutral_values: 'Neutral Values (3)',
    high_values: 'High Values (5)',
    low_values: 'Low Values (1)',
    randomize: 'Randomize',
    skip_to_question: 'Skip to Question',
    go: 'Go',
    cancel: 'Cancel',
    simulation_result: 'Simulation Result',
    no_data_saved: 'No data will be saved',
    clean_view: 'Client View',
    technical_view: 'Technical View',
    your_result: 'Your result',
    score_distribution: 'Score Distribution',
    ask_miguel: 'Ask Nello AI',
    miguel_analysis: 'Nello AI Analysis',
    new_simulation: 'New Simulation',
    select_language: 'Select simulation language',
    start_simulation: 'Start Simulation',
    development: 'In development',
    beta: 'Beta',
    public: 'Public',
    language_note: 'Admins can test languages in development',
    end_simulation: 'End Simulation',
  },
  es: {
    simulation_mode: 'Modo Simulación',
    sandbox_environment: 'Entorno Sandbox',
    sandbox_description: 'Todas las simulaciones se ejecutan en memoria. Ningún dato se guarda en la base real.',
    individual_test: 'Prueba Individual',
    complete_journey: 'Viaje Completo',
    simulate: 'Simular',
    auto: 'Auto',
    questions: 'preguntas',
    minutes: 'min',
    simulate_complete_journey: 'Simular Viaje Completo',
    journey_description: 'Ejecutar automáticamente las 7 pruebas y generar el Mapa Nello Identity',
    start_simulated_journey: 'Iniciar Viaje Simulado',
    processing_journey: 'Procesando viaje...',
    journey_results: 'Resultados del Viaje',
    completed: 'Completado',
    question: 'Pregunta',
    of: 'de',
    answered: 'respondidas',
    previous: 'Anterior',
    next: 'Siguiente',
    calculate_result: 'Calcular Resultado',
    quick_response: 'Respuesta Rápida',
    neutral_values: 'Valores Neutros (3)',
    high_values: 'Valores Altos (5)',
    low_values: 'Valores Bajos (1)',
    randomize: 'Aleatorizar',
    skip_to_question: 'Saltar a Pregunta',
    go: 'Ir',
    cancel: 'Cancelar',
    simulation_result: 'Resultado de la Simulación',
    no_data_saved: 'Ningún dato será guardado',
    clean_view: 'Vista Cliente',
    technical_view: 'Vista Técnica',
    your_result: 'Tu resultado',
    score_distribution: 'Distribución de Scores',
    ask_miguel: 'Preguntar a Nello AI',
    miguel_analysis: 'Análisis de Nello AI',
    new_simulation: 'Nueva Simulación',
    select_language: 'Selecciona el idioma de la simulación',
    start_simulation: 'Iniciar Simulación',
    development: 'En desarrollo',
    beta: 'Beta',
    public: 'Público',
    language_note: 'Admins pueden probar idiomas en desarrollo',
    end_simulation: 'Finalizar Simulación',
  },
  it: {
    simulation_mode: 'Modalità Simulazione',
    sandbox_environment: 'Ambiente Sandbox',
    sandbox_description: 'Tutte le simulazioni vengono eseguite in memoria. Nessun dato viene salvato nel database reale.',
    individual_test: 'Test Individuale',
    complete_journey: 'Viaggio Completo',
    simulate: 'Simula',
    auto: 'Auto',
    questions: 'domande',
    minutes: 'min',
    simulate_complete_journey: 'Simula Viaggio Completo',
    journey_description: 'Esegui automaticamente tutti i 7 test e genera la Mappa Nello One',
    start_simulated_journey: 'Inizia Viaggio Simulato',
    processing_journey: 'Elaborazione viaggio...',
    journey_results: 'Risultati del Viaggio',
    completed: 'Completato',
    question: 'Domanda',
    of: 'di',
    answered: 'risposte',
    previous: 'Precedente',
    next: 'Successiva',
    calculate_result: 'Calcola Risultato',
    quick_response: 'Risposta Rapida',
    neutral_values: 'Valori Neutri (3)',
    high_values: 'Valori Alti (5)',
    low_values: 'Valori Bassi (1)',
    randomize: 'Randomizza',
    skip_to_question: 'Salta alla Domanda',
    go: 'Vai',
    cancel: 'Annulla',
    simulation_result: 'Risultato della Simulazione',
    no_data_saved: 'Nessun dato verrà salvato',
    clean_view: 'Vista Cliente',
    technical_view: 'Vista Tecnica',
    your_result: 'Il tuo risultato',
    score_distribution: 'Distribuzione dei Punteggi',
    ask_miguel: 'Chiedi a Nello AI',
    miguel_analysis: 'Analisi di Nello AI',
    new_simulation: 'Nuova Simulazione',
    select_language: 'Seleziona la lingua della simulazione',
    start_simulation: 'Inizia Simulazione',
    development: 'In sviluppo',
    beta: 'Beta',
    public: 'Pubblico',
    language_note: 'Gli admin possono testare le lingue in sviluppo',
    end_simulation: 'Termina Simulazione',
  },
  fr: {
    simulation_mode: 'Mode Simulation',
    sandbox_environment: 'Environnement Sandbox',
    sandbox_description: 'Toutes les simulations s\'exécutent en mémoire. Aucune donnée n\'est sauvegardée dans la base réelle.',
    individual_test: 'Test Individuel',
    complete_journey: 'Parcours Complet',
    simulate: 'Simuler',
    auto: 'Auto',
    questions: 'questions',
    minutes: 'min',
    simulate_complete_journey: 'Simuler Parcours Complet',
    journey_description: 'Exécuter automatiquement les 7 tests et générer la Carte Nello One',
    start_simulated_journey: 'Démarrer Parcours Simulé',
    processing_journey: 'Traitement du parcours...',
    journey_results: 'Résultats du Parcours',
    completed: 'Terminé',
    question: 'Question',
    of: 'de',
    answered: 'répondues',
    previous: 'Précédent',
    next: 'Suivant',
    calculate_result: 'Calculer Résultat',
    quick_response: 'Réponse Rapide',
    neutral_values: 'Valeurs Neutres (3)',
    high_values: 'Valeurs Hautes (5)',
    low_values: 'Valeurs Basses (1)',
    randomize: 'Aléatoire',
    skip_to_question: 'Aller à la Question',
    go: 'Aller',
    cancel: 'Annuler',
    simulation_result: 'Résultat de la Simulation',
    no_data_saved: 'Aucune donnée ne sera sauvegardée',
    clean_view: 'Vue Client',
    technical_view: 'Vue Technique',
    your_result: 'Votre résultat',
    score_distribution: 'Distribution des Scores',
    ask_miguel: 'Demander à Nello AI',
    miguel_analysis: 'Analyse de Nello AI',
    new_simulation: 'Nouvelle Simulation',
    select_language: 'Sélectionnez la langue de simulation',
    start_simulation: 'Démarrer Simulation',
    development: 'En développement',
    beta: 'Bêta',
    public: 'Public',
    language_note: 'Les admins peuvent tester les langues en développement',
    end_simulation: 'Terminer Simulation',
  },
};

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [isSimulationActive, setIsSimulationActive] = useState(false);
  const [simulationLanguage, setSimulationLanguageState] = useState<SimulationLanguage>('pt');
  const [originalAdminLanguage, setOriginalAdminLanguage] = useState<string>('pt');

  const startSimulation = (language: SimulationLanguage, adminLang: string) => {
    setOriginalAdminLanguage(adminLang);
    setSimulationLanguageState(language);
    setIsSimulationActive(true);
  };

  const endSimulation = () => {
    setIsSimulationActive(false);
    // Language context will revert to original admin language
  };

  const setSimulationLanguage = (lang: SimulationLanguage) => {
    setSimulationLanguageState(lang);
  };

  const getSimulationLabel = (key: string): string => {
    return simulationLabels[simulationLanguage]?.[key] || simulationLabels.en[key] || key;
  };

  return (
    <SimulationContext.Provider
      value={{
        isSimulationActive,
        simulationLanguage,
        originalAdminLanguage,
        startSimulation,
        endSimulation,
        setSimulationLanguage,
        getSimulationLabel,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
}
