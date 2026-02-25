import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCodigoEssencia } from "@/hooks/useCodigoEssencia";
import { useRevelacaoEssenciaFlag } from "@/hooks/useFeatureFlag";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Share2, ArrowLeft, Play, Volume2 } from "lucide-react";

// ─── Types ──────────────────────────────────────────────────

interface FilmeScene {
  imagePrompt: string;
  keyword: string;
  imageUrl?: string;
}

interface FilmeScript {
  narration: string;
  scenes: FilmeScene[];
}

type FilmeState = "intro" | "preparing" | "ready" | "playing" | "finished";

// ─── Preparation Steps ─────────────────────────────────────

const PREP_MESSAGES = [
  "Lendo sua essência...",
  "Escrevendo sua história...",
  "Criando as cenas do seu filme...",
  "Gerando a narração...",
  "Compondo as imagens...",
  "Quase pronto...",
];

// ─── Essence Symbol ─────────────────────────────────────────

function EssenceSymbol({ size = "large" }: { size?: "large" | "small" }) {
  const dim = size === "large" ? "w-48 h-48 md:w-64 md:h-64" : "w-24 h-24";
  return (
    <motion.div
      className={`${dim} rounded-full`}
      style={{
        background:
          "radial-gradient(circle at 38% 38%, hsl(45, 80%, 65%), hsl(30, 60%, 40%), hsl(20, 40%, 20%), transparent 75%)",
        boxShadow: "0 0 100px 40px hsla(40, 70%, 50%, 0.2)",
      }}
      animate={{
        scale: [1, 1.06, 1],
        opacity: [0.8, 1, 0.8],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

// ─── Intro Screen ───────────────────────────────────────────

function FilmeIntro({ onStart, isDisabled }: { onStart: () => void; isDisabled: boolean }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 2 }}
        className="mb-12"
      >
        <EssenceSymbol size="small" />
      </motion.div>

      <motion.h1
        className="text-2xl md:text-4xl font-extralight tracking-[0.2em] uppercase text-white/90 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 1.5 }}
      >
        Filme da Identidade
      </motion.h1>

      <motion.p
        className="text-sm md:text-base font-light text-white/50 max-w-md text-center leading-relaxed mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1.5 }}
      >
        Um documentário pessoal narrado sobre quem você é.
        <br />
        Feito exclusivamente para você.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1.5 }}
      >
        <Button
          onClick={onStart}
          disabled={isDisabled}
          variant="ghost"
          className="text-white/80 hover:text-white border border-white/20 hover:border-white/50 px-12 py-7 text-base tracking-[0.15em] uppercase transition-all duration-700 rounded-none"
        >
          <Play className="w-4 h-4 mr-3" />
          Assistir
        </Button>
      </motion.div>
    </motion.div>
  );
}

// ─── Preparation Screen ─────────────────────────────────────

function FilmePreparation({ currentStep }: { currentStep: number }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="mb-16"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      >
        <EssenceSymbol size="small" />
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.p
          key={currentStep}
          className="text-lg md:text-xl font-extralight text-white/70 tracking-wide"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.8 }}
        >
          {PREP_MESSAGES[Math.min(currentStep, PREP_MESSAGES.length - 1)]}
        </motion.p>
      </AnimatePresence>

      <motion.div
        className="mt-10 w-48 h-[2px] bg-white/10 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          className="h-full bg-white/40"
          initial={{ width: "0%" }}
          animate={{ width: `${Math.min((currentStep / 5) * 100, 95)}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </motion.div>
    </motion.div>
  );
}

// ─── Film Player ────────────────────────────────────────────

function FilmePlayer({
  script,
  audioUrl,
  onFinish,
}: {
  script: FilmeScript;
  audioUrl: string;
  onFinish: () => void;
}) {
  const [currentScene, setCurrentScene] = useState(-1); // -1 = fade in
  const [showKeyword, setShowKeyword] = useState(false);
  const [showClimax, setShowClimax] = useState(false);
  const [showClosing, setShowClosing] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const totalScenes = script.scenes.length;
  const sceneDuration = 12000; // 12 seconds per scene

  // Start playback
  useEffect(() => {
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    audio.volume = 1;

    // Start with a 2-second black fade-in, then begin
    const startTimer = setTimeout(() => {
      audio.play().catch(console.error);
      setCurrentScene(0);
    }, 2000);

    // When audio ends, show climax
    audio.addEventListener("ended", () => {
      setShowClimax(true);
      setTimeout(() => {
        setShowClosing(true);
      }, 8000);
    });

    return () => {
      clearTimeout(startTimer);
      audio.pause();
      audio.removeEventListener("ended", () => {});
    };
  }, [audioUrl]);

  // Advance scenes on timer
  useEffect(() => {
    if (currentScene < 0 || showClimax) return;

    const timer = setTimeout(() => {
      if (currentScene < totalScenes - 1) {
        setCurrentScene((s) => s + 1);
        setShowKeyword(false);
      } else {
        // Last scene done, wait for audio to end
      }
    }, sceneDuration);

    // Show keyword halfway through scene
    const keywordTimer = setTimeout(() => {
      setShowKeyword(true);
    }, sceneDuration * 0.4);

    const hideKeyword = setTimeout(() => {
      setShowKeyword(false);
    }, sceneDuration * 0.75);

    return () => {
      clearTimeout(timer);
      clearTimeout(keywordTimer);
      clearTimeout(hideKeyword);
    };
  }, [currentScene, totalScenes, showClimax]);

  const scene = currentScene >= 0 ? script.scenes[currentScene] : null;

  if (showClosing) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <motion.p
          className="text-xl md:text-3xl font-extralight text-center max-w-lg leading-relaxed tracking-wide text-white/85"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 2 }}
        >
          Você não acabou de descobrir quem é.
        </motion.p>
        <motion.p
          className="text-xl md:text-3xl font-extralight text-center max-w-lg leading-relaxed tracking-wide text-white/85 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 2 }}
        >
          Você apenas se lembrou.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 6, duration: 1.5 }}
          className="mt-20"
        >
          <Button
            onClick={onFinish}
            variant="ghost"
            className="text-white/60 hover:text-white border border-white/20 hover:border-white/40 px-8 py-5 text-sm tracking-[0.15em] uppercase rounded-none"
          >
            Continuar
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  if (showClimax) {
    return (
      <motion.div
        className="flex items-center justify-center min-h-screen bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.5 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 3, ease: "easeOut" }}
        >
          <EssenceSymbol size="large" />
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="relative min-h-screen bg-black overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Scene images with Ken Burns */}
      <AnimatePresence mode="wait">
        {scene && (
          <motion.div
            key={currentScene}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5 }}
          >
            {scene.imageUrl ? (
              <motion.img
                src={scene.imageUrl}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ scale: 1.1, x: "2%" }}
                animate={{ scale: 1.18, x: "-2%" }}
                transition={{ duration: sceneDuration / 1000, ease: "linear" }}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 to-black" />
            )}

            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Vignette effect */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyword overlay */}
      <AnimatePresence>
        {showKeyword && scene && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            <motion.span
              className="text-4xl md:text-7xl font-extralight tracking-[0.3em] uppercase text-white/60"
              initial={{ opacity: 0, scale: 0.95, letterSpacing: "0.2em" }}
              animate={{ opacity: 0.7, scale: 1, letterSpacing: "0.35em" }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 2 }}
            >
              {scene.keyword}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio indicator */}
      <motion.div
        className="absolute bottom-8 right-8 z-20 flex items-center gap-2 text-white/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
      >
        <Volume2 className="w-4 h-4" />
        <div className="flex gap-[2px]">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-[2px] bg-white/40 rounded-full"
              animate={{ height: [4, 12, 4] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Fade-in black overlay for initial moment */}
      {currentScene < 0 && (
        <motion.div
          className="absolute inset-0 bg-black z-30"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 2 }}
        />
      )}
    </motion.div>
  );
}

// ─── Finished Screen ────────────────────────────────────────

function FilmeFinished({
  displayName,
  onReplay,
  onBack,
}: {
  displayName: string;
  onReplay: () => void;
  onBack: () => void;
}) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black via-zinc-950 to-zinc-900 text-white px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <motion.div
        className="mb-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 2 }}
      >
        <EssenceSymbol size="small" />
      </motion.div>

      <motion.p
        className="text-2xl md:text-4xl font-extralight tracking-wide text-white/90 mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1.5 }}
      >
        {displayName}
      </motion.p>

      <motion.p
        className="text-sm font-light text-white/40 tracking-[0.15em] uppercase mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1.5 }}
      >
        Filme da Identidade
      </motion.p>

      <motion.div
        className="flex flex-col sm:flex-row gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5, duration: 1 }}
      >
        <Button
          onClick={onReplay}
          variant="ghost"
          className="text-white/60 hover:text-white border border-white/20 hover:border-white/40 px-8 py-5 text-sm tracking-[0.1em] uppercase rounded-none"
        >
          <Play className="w-4 h-4 mr-2" />
          Assistir Novamente
        </Button>
        <Button
          onClick={onBack}
          variant="ghost"
          className="text-white/40 hover:text-white/70 px-8 py-5 text-sm tracking-[0.1em] uppercase rounded-none"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ──────────────────────────────────────────────

export default function RevelacaoEssencia() {
  const navigate = useNavigate();
  const { user, profile, userRole } = useAuth();
  const { savedCodigo } = useCodigoEssencia();
  const { isEnabled, isLoading: flagLoading } = useRevelacaoEssenciaFlag();

  const isAdmin = userRole === "admin";
  const displayName = profile?.full_name?.split(" ")[0] || "Você";

  const [filmeState, setFilmeState] = useState<FilmeState>("intro");
  const [script, setScript] = useState<FilmeScript | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [prepStep, setPrepStep] = useState(0);

  // Redirect if not enabled and not admin
  useEffect(() => {
    if (!flagLoading && !isEnabled && !isAdmin) {
      navigate("/cliente", { replace: true });
    }
  }, [flagLoading, isEnabled, isAdmin, navigate]);

  const sections = useMemo(
    () => (Array.isArray(savedCodigo?.sections) ? savedCodigo.sections : []),
    [savedCodigo]
  );

  // Generate the film
  const generateFilm = useCallback(async () => {
    setFilmeState("preparing");
    setPrepStep(0);

    try {
      // Step 1: Generate narration script
      setPrepStep(0);
      const { data: scriptData, error: scriptError } = await supabase.functions.invoke(
        "filme-identidade-script",
        { body: { sections, userName: displayName } }
      );

      if (scriptError || scriptData?.error) {
        throw new Error(scriptData?.error || "Erro ao gerar roteiro");
      }

      const filmScript = scriptData as FilmeScript;
      setPrepStep(1);

      // Step 2: Generate TTS audio
      setPrepStep(2);
      const ttsResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/filme-identidade-tts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ text: filmScript.narration }),
        }
      );

      if (!ttsResponse.ok) {
        throw new Error("Erro ao gerar narração de voz");
      }

      const ttsData = await ttsResponse.json();
      const generatedAudioUrl = `data:audio/mpeg;base64,${ttsData.audioContent}`;
      setPrepStep(3);

      // Step 3: Generate images in parallel (with fallback)
      setPrepStep(4);
      const imagePromises = filmScript.scenes.map(async (scene) => {
        try {
          const { data: imgData, error: imgError } = await supabase.functions.invoke(
            "filme-identidade-image",
            { body: { prompt: scene.imagePrompt } }
          );

          if (imgError || imgData?.error) {
            console.warn("Image generation failed for scene:", scene.keyword);
            return { ...scene, imageUrl: undefined };
          }

          return { ...scene, imageUrl: imgData.imageUrl };
        } catch {
          return { ...scene, imageUrl: undefined };
        }
      });

      const scenesWithImages = await Promise.all(imagePromises);
      setPrepStep(5);

      const finalScript: FilmeScript = {
        narration: filmScript.narration,
        scenes: scenesWithImages,
      };

      setScript(finalScript);
      setAudioUrl(generatedAudioUrl);
      setFilmeState("ready");
    } catch (error) {
      console.error("Film generation error:", error);
      toast.error(
        error instanceof Error ? error.message : "Erro ao preparar seu filme"
      );
      setFilmeState("intro");
    }
  }, [sections, displayName]);

  const handlePlay = useCallback(() => {
    if (script && audioUrl) {
      setFilmeState("playing");
    }
  }, [script, audioUrl]);

  const handleReplay = useCallback(() => {
    if (script && audioUrl) {
      setFilmeState("playing");
    }
  }, [script, audioUrl]);

  if (flagLoading) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden">
      <AnimatePresence mode="wait">
        {filmeState === "intro" && (
          <FilmeIntro
            key="intro"
            onStart={generateFilm}
            isDisabled={!savedCodigo}
          />
        )}

        {filmeState === "preparing" && (
          <FilmePreparation key="preparing" currentStep={prepStep} />
        )}

        {filmeState === "ready" && (
          <motion.div
            key="ready"
            className="flex flex-col items-center justify-center min-h-screen bg-black text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              className="mb-10"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5 }}
            >
              <EssenceSymbol size="small" />
            </motion.div>

            <motion.p
              className="text-lg font-extralight text-white/60 mb-12 tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              Seu filme está pronto.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
            >
              <Button
                onClick={handlePlay}
                variant="ghost"
                className="text-white/80 hover:text-white border border-white/30 hover:border-white/60 px-14 py-7 text-base tracking-[0.2em] uppercase rounded-none transition-all duration-500"
              >
                <Play className="w-5 h-5 mr-3" />
                Assistir
              </Button>
            </motion.div>

            <motion.p
              className="mt-8 text-xs text-white/30 flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              <Volume2 className="w-3 h-3" />
              Coloque fones de ouvido para a melhor experiência
            </motion.p>
          </motion.div>
        )}

        {filmeState === "playing" && script && audioUrl && (
          <FilmePlayer
            key="playing"
            script={script}
            audioUrl={audioUrl}
            onFinish={() => setFilmeState("finished")}
          />
        )}

        {filmeState === "finished" && (
          <FilmeFinished
            key="finished"
            displayName={displayName}
            onReplay={handleReplay}
            onBack={() => navigate("/cliente")}
          />
        )}
      </AnimatePresence>

      {/* Back button (always visible except during playback) */}
      {filmeState !== "playing" && filmeState !== "preparing" && (
        <motion.button
          className="fixed top-6 left-6 z-50 text-white/30 hover:text-white/60 transition-colors"
          onClick={() => navigate("/cliente")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>
      )}
    </div>
  );
}
