import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCodigoEssencia } from "@/hooks/useCodigoEssencia";
import { useJourneyProgress } from "@/hooks/useJourneyProgress";
import { useRevelacaoEssenciaFlag } from "@/hooks/useFeatureFlag";
import { Button } from "@/components/ui/button";

// ─── Helpers ────────────────────────────────────────────────

/** Build personalised contemplative phrases from the user's existing data */
function buildPersonalisedPhrases(
  sections: any[],
  testResults: any[],
): { recordacoes: string[]; espelho: string[] } {
  const recordacoes = [
    "Você sempre percebeu mais do que dizia.",
    "Algumas partes suas cresceram em silêncio.",
    "Houve momentos em que a coragem apareceu sem ser chamada.",
    "Você soube esperar, mesmo quando o mundo pedia pressa.",
  ];
  const espelho = [
    "Existem momentos em que você assume mais do que deveria.",
    "Nem sempre foi fácil encontrar lugares onde pudesse ser inteiro.",
    "Você aprendeu a traduzir o que sente em algo que os outros possam entender.",
    "Há uma parte sua que ainda busca permissão para existir.",
  ];

  // Enrich from mapa_essencia sections if available
  if (sections && sections.length > 0) {
    const firstContent = sections[0]?.content;
    if (firstContent && typeof firstContent === "string" && firstContent.length > 20) {
      recordacoes.push("O que você construiu até aqui já diz muito sobre quem você é.");
    }
  }

  // Enrich from test results
  if (testResults && testResults.length >= 5) {
    espelho.push("Há camadas suas que raramente aparecem ao mesmo tempo — e quando aparecem, algo se encaixa.");
  }

  return { recordacoes, espelho };
}

// ─── Movement Components ────────────────────────────────────

function MovementConvite({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
    >
      <motion.p
        className="text-lg md:text-2xl font-light text-center max-w-lg leading-relaxed tracking-wide opacity-80"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.85, y: 0 }}
        transition={{ delay: 1, duration: 2 }}
      >
        Há momentos em que a vida nos convida a olhar para dentro.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5, duration: 1.5 }}
        className="mt-16"
      >
        <Button
          onClick={onStart}
          variant="ghost"
          className="text-white/70 hover:text-white border border-white/20 hover:border-white/40 px-10 py-6 text-base tracking-widest uppercase transition-all duration-700"
        >
          Começar
        </Button>
      </motion.div>
    </motion.div>
  );
}

function MovementRecordacoes({ phrases, onNext }: { phrases: string[]; onNext: () => void }) {
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      if (currentPhrase < phrases.length - 1) {
        setCurrentPhrase((p) => p + 1);
      } else {
        onNext();
      }
    }, 5000);
    return () => clearTimeout(timerRef.current);
  }, [currentPhrase, phrases.length, onNext]);

  return (
    <motion.div
      className="flex items-center justify-center min-h-screen bg-black text-white px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
    >
      <AnimatePresence mode="wait">
        <motion.p
          key={currentPhrase}
          className="text-xl md:text-3xl font-extralight text-center max-w-xl leading-relaxed italic opacity-80"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 0.9, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 1.5 }}
        >
          {phrases[currentPhrase]}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
}

function MovementEspelho({ phrases, onNext }: { phrases: string[]; onNext: () => void }) {
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      if (currentPhrase < phrases.length - 1) {
        setCurrentPhrase((p) => p + 1);
      } else {
        onNext();
      }
    }, 6000);
    return () => clearTimeout(timerRef.current);
  }, [currentPhrase, phrases.length, onNext]);

  return (
    <motion.div
      className="flex items-center justify-center min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
    >
      <AnimatePresence mode="wait">
        <motion.p
          key={currentPhrase}
          className="text-lg md:text-2xl font-light text-center max-w-lg leading-relaxed opacity-75"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 0.85, scale: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 1.8 }}
        >
          {phrases[currentPhrase]}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
}

/** Animated breathing symbol */
function EssenceSymbol() {
  return (
    <motion.div
      className="w-40 h-40 md:w-56 md:h-56 rounded-full"
      style={{
        background: "radial-gradient(circle at 40% 40%, hsl(var(--primary) / 0.6), hsl(var(--primary) / 0.15), transparent 70%)",
        boxShadow: "0 0 80px 30px hsl(var(--primary) / 0.15)",
      }}
      animate={{
        scale: [1, 1.08, 1],
        opacity: [0.7, 1, 0.7],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

function MovementPresenca({ onNext }: { onNext: () => void }) {
  useEffect(() => {
    const t = setTimeout(onNext, 10000);
    return () => clearTimeout(t);
  }, [onNext]);

  return (
    <motion.div
      className="flex items-center justify-center min-h-screen bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 2.5 }}
      >
        <EssenceSymbol />
      </motion.div>
    </motion.div>
  );
}

function MovementIntegracao({ displayName, onFinish }: { displayName: string; onFinish: () => void }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black to-zinc-100 text-white px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2 }}
    >
      <motion.p
        className="text-lg md:text-2xl font-extralight text-center max-w-lg leading-relaxed mb-10 opacity-80"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.85, y: 0 }}
        transition={{ delay: 1, duration: 2 }}
      >
        Talvez você não tenha descoberto algo novo.
        <br />
        <span className="mt-2 block">
          Talvez apenas tenha se reencontrado.
        </span>
      </motion.p>

      <motion.p
        className="text-2xl md:text-4xl font-light tracking-wide"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        transition={{ delay: 4, duration: 2.5 }}
      >
        {displayName}
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 7, duration: 1.5 }}
        className="mt-20"
      >
        <Button
          onClick={onFinish}
          variant="ghost"
          className="text-zinc-600 hover:text-zinc-900 border border-zinc-300 hover:border-zinc-500 px-8 py-5 text-sm tracking-widest uppercase transition-all duration-700"
        >
          Voltar
        </Button>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ──────────────────────────────────────────────

type Movement = "convite" | "recordacoes" | "espelho" | "presenca" | "integracao";

export default function RevelacaoEssencia() {
  const navigate = useNavigate();
  const { user, profile, userRole } = useAuth();
  const { savedCodigo } = useCodigoEssencia();
  const { testResults } = useJourneyProgress();
  const { isEnabled, isLoading: flagLoading } = useRevelacaoEssenciaFlag();

  const [movement, setMovement] = useState<Movement>("convite");

  const isAdmin = userRole === "admin";
  const displayName = profile?.full_name?.split(" ")[0] || "Você";

  // Redirect if not enabled and not admin
  useEffect(() => {
    if (!flagLoading && !isEnabled && !isAdmin) {
      navigate("/cliente", { replace: true });
    }
  }, [flagLoading, isEnabled, isAdmin, navigate]);

  const sections = Array.isArray(savedCodigo?.sections) ? savedCodigo.sections : [];
  const results = Array.isArray(testResults) ? testResults : [];
  const { recordacoes, espelho } = buildPersonalisedPhrases(sections, results);

  const advanceTo = useCallback((m: Movement) => setMovement(m), []);

  if (flagLoading) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden">
      <AnimatePresence mode="wait">
        {movement === "convite" && (
          <MovementConvite key="convite" onStart={() => advanceTo("recordacoes")} />
        )}
        {movement === "recordacoes" && (
          <MovementRecordacoes
            key="recordacoes"
            phrases={recordacoes}
            onNext={() => advanceTo("espelho")}
          />
        )}
        {movement === "espelho" && (
          <MovementEspelho
            key="espelho"
            phrases={espelho}
            onNext={() => advanceTo("presenca")}
          />
        )}
        {movement === "presenca" && (
          <MovementPresenca key="presenca" onNext={() => advanceTo("integracao")} />
        )}
        {movement === "integracao" && (
          <MovementIntegracao
            key="integracao"
            displayName={displayName}
            onFinish={() => navigate("/cliente")}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
