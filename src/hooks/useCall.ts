import type { CallStatus } from "@/types/call.type";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export const useCall = () => {
  const [callStatus, setCallStatus] = useState<CallStatus>("idle");
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (callStatus === "active") {
      intervalRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      if (callStatus === "idle") {
        setCallDuration(0);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [callStatus]);

  const startCall = useCallback(async () => {
    try {
      setCallStatus("connecting");

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      mediaStreamRef.current = mediaStream;

      setTimeout(() => {
        setCallStatus("active");
        toast.success("Zəng başladı");
      }, 1000);
    } catch (error) {
      console.error("Mikrofon xətası:", error);
      setCallStatus("idle");
      toast.error("Mikrofona çıxış əldə edilmədi");
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (!mediaStreamRef.current) return;

    const newMuted = !isMuted;
    mediaStreamRef.current.getAudioTracks().forEach((track) => {
      track.enabled = !newMuted;
    });

    setIsMuted(newMuted);
    toast(newMuted ? "Mikrofon bağlandı" : "Mikrofon açıldı");
  }, [isMuted]);

  const endCall = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      mediaStreamRef.current = null;
    }

    setCallStatus("ended");
    setIsMuted(false);

    toast.success("Zəng sonlandı");

    setTimeout(() => {
      setCallStatus("idle");
    }, 2000);
  }, []);

  return {
    callStatus,
    callDuration,
    isMuted,
    mediaStream: mediaStreamRef.current,
    startCall,
    toggleMute,
    endCall,
  };
};
