import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SymbolicCode {
  label: string;
  value: string;
}

interface TrendVideoProps {
  userName: string;
  codes: SymbolicCode[];
  onClose: () => void;
}

// ─── Particle Field ─────────────────────────────────────────

function ParticleField() {
  const particles = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 4,
    duration: Math.random() * 3 + 3,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: `hsla(40, 70%, 60%, ${0.15 + Math.random() * 0.2})`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 0.6, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ─── Animated Symbol ────────────────────────────────────────

function AnimatedSymbol() {
  return (
    <motion.div
      className="relative w-28 h-28"
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    >
      {/* Outer ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: "conic-gradient(from 0deg, hsla(40, 80%, 55%, 0.6), hsla(30, 60%, 40%, 0.1), hsla(40, 80%, 55%, 0.6))",
        }}
        animate={{ opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Inner glow */}
      <motion.div
        className="absolute inset-3 rounded-full"
        style={{
          background: "radial-gradient(circle at 40% 40%, hsla(45, 80%, 65%, 0.8), hsla(30, 60%, 40%, 0.4), hsla(20, 40%, 20%, 0.6))",
          boxShadow: "0 0 40px 10px hsla(40, 70%, 50%, 0.25)",
        }}
        animate={{
          scale: [1, 1.08, 1],
          boxShadow: [
            "0 0 40px 10px hsla(40, 70%, 50%, 0.25)",
            "0 0 60px 20px hsla(40, 70%, 50%, 0.35)",
            "0 0 40px 10px hsla(40, 70%, 50%, 0.25)",
          ],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Core light */}
      <motion.div
        className="absolute inset-8 rounded-full"
        style={{
          background: "radial-gradient(circle, hsla(45, 90%, 75%, 0.9), hsla(40, 70%, 50%, 0.3))",
        }}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}

// ─── Main TrendVideo Component ──────────────────────────────

export default function TrendVideo({ userName, codes, onClose }: TrendVideoProps) {
  const [phase, setPhase] = useState(0); // 0: symbol, 1: codes, 2: cta
  const containerRef = useRef<HTMLDivElement>(null);

  // Loop cycle: 8 seconds total
  useEffect(() => {
    const cycle = () => {
      setPhase(0);
      setTimeout(() => setPhase(1), 1500);
      setTimeout(() => setPhase(2), 5500);
      setTimeout(() => setPhase(0), 8000); // restart
    };

    cycle();
    const interval = setInterval(cycle, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleShare = async () => {
    const shareData = {
      title: "Meu Código Identity",
      text: `${userName} descobriu seu código. Descubra o seu.`,
      url: window.location.origin,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled or error
      }
    } else {
      try {
        await navigator.clipboard.writeText(
          `${shareData.text}\n${shareData.url}`
        );
        toast.success("Link copiado!");
      } catch {
        toast.error("Erro ao copiar");
      }
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Close button */}
      <Button
        onClick={onClose}
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-50 text-white/40 hover:text-white/80"
      >
        <X className="w-5 h-5" />
      </Button>

      {/* 9:16 Container */}
      <div
        ref={containerRef}
        className="relative w-full max-w-[360px] mx-auto overflow-hidden"
        style={{ aspectRatio: "9/16" }}
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-black to-zinc-950" />

        {/* Ambient light */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 50% 40%, hsla(40, 60%, 30%, 0.15), transparent 70%)",
          }}
        />

        <ParticleField />

        {/* Identity branding top */}
        <motion.div
          className="absolute top-8 left-0 right-0 text-center z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          <p className="text-[10px] tracking-[0.4em] uppercase text-white/25 font-light">
            Identity Nello One
          </p>
        </motion.div>

        {/* Symbol center */}
        <div className="absolute inset-0 flex items-center justify-center z-10" style={{ marginTop: "-15%" }}>
          <AnimatePresence mode="wait">
            {phase === 0 && (
              <motion.div
                key="symbol"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 1 }}
              >
                <AnimatedSymbol />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Codes display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10" style={{ marginTop: "5%" }}>
          <AnimatePresence>
            {phase >= 1 && (
              <motion.div
                className="flex flex-col items-center gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              >
                {/* Small symbol */}
                <AnimatedSymbol />

                <div className="flex flex-col items-center gap-4 mt-4">
                  {codes.map((code, i) => (
                    <motion.div
                      key={code.label}
                      className="text-center"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.4, duration: 0.8 }}
                    >
                      <p className="text-[9px] tracking-[0.35em] uppercase text-white/30 font-light mb-1">
                        {code.label}
                      </p>
                      <p className="text-lg md:text-xl font-extralight tracking-[0.2em] uppercase text-white/85">
                        {code.value}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CTA */}
        <div className="absolute bottom-16 left-0 right-0 z-10">
          <AnimatePresence>
            {phase === 2 && (
              <motion.p
                className="text-center text-sm font-extralight tracking-[0.2em] uppercase text-white/50"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
              >
                Descubra o seu.
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom brand line */}
        <motion.div
          className="absolute bottom-6 left-0 right-0 text-center z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <div className="w-8 h-[1px] bg-white/10 mx-auto mb-2" />
          <p className="text-[8px] tracking-[0.5em] uppercase text-white/15 font-light">
            nelloone.com
          </p>
        </motion.div>
      </div>

      {/* Action buttons below video */}
      <motion.div
        className="flex gap-4 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <Button
          onClick={handleShare}
          variant="ghost"
          className="text-white/60 hover:text-white border border-white/20 hover:border-white/40 px-6 py-5 text-xs tracking-[0.12em] uppercase rounded-none"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Compartilhar
        </Button>
        <Button
          onClick={onClose}
          variant="ghost"
          className="text-white/40 hover:text-white/60 px-6 py-5 text-xs tracking-[0.12em] uppercase rounded-none"
        >
          Fechar
        </Button>
      </motion.div>
    </motion.div>
  );
}
