import { useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useNewTicketSound = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // Initialize audio element
  useEffect(() => {
    // Create a simple notification sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Store the audio context for later use
    audioRef.current = new Audio();
    
    return () => {
      audioContext.close();
    };
  }, []);

  const playNotificationSound = useCallback(() => {
    try {
      // Create an AudioContext for a pleasant notification sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Pleasant notification tone (two notes)
      oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5
      oscillator.frequency.setValueAtTime(1108.73, audioContext.currentTime + 0.1); // C#6

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);

      // Second beep
      setTimeout(() => {
        const osc2 = audioContext.createOscillator();
        const gain2 = audioContext.createGain();
        osc2.connect(gain2);
        gain2.connect(audioContext.destination);
        
        osc2.frequency.setValueAtTime(1318.51, audioContext.currentTime); // E6
        gain2.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        osc2.start(audioContext.currentTime);
        osc2.stop(audioContext.currentTime + 0.2);
      }, 150);

    } catch (error) {
      console.log("Could not play notification sound:", error);
    }
  }, []);

  // Subscribe to new tickets in realtime
  useEffect(() => {
    const channel = supabase
      .channel("new-tickets")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "support_tickets",
        },
        (payload) => {
          console.log("New ticket received:", payload);
          playNotificationSound();
          toast({
            title: "Nova mensagem de suporte!",
            description: `De: ${(payload.new as any).name || "Usuário"}`,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [playNotificationSound, toast]);

  return { playNotificationSound };
};
