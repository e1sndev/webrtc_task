import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, MicOff, Phone, PhoneOff, Volume2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import type { CallStatus } from "../types/call.type";

const SoftPhone = () => {
  const [callStatus, setCallStatus] = useState<CallStatus>("idle");
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);

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
  }, [callStatus]);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const statusInfo = useMemo(() => {
    switch (callStatus) {
      case "idle":
        return { text: "Hazır", color: "bg-gray-500" };
      case "connecting":
        return { text: "Bağlanır...", color: "bg-yellow-500" };
      case "active":
        return { text: "Davam edən", color: "bg-green-500" };
      case "ended":
        return { text: "Sonlandı", color: "bg-red-500" };
      default:
        return { text: "Hazır", color: "bg-gray-500" };
    }
  }, [callStatus]);

  const startCall = async () => {
    try {
      console.log("Starting call - requesting microphone access...");
      setCallStatus("connecting");

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      console.log("Microphone access granted", mediaStream);
      mediaStreamRef.current = mediaStream;

      setTimeout(() => {
        setCallStatus("active");
        console.log("Call status changed to active");
        toast.success("Zəng başladı");
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setCallStatus("idle");
      toast.error("Mikrofona çıxış əldə edilmədi");
    }
  };

  const toggleMute = () => {
    if (mediaStreamRef.current) {
      const audioTracks = mediaStreamRef.current.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = isMuted;
        console.log(`Audio track ${isMuted ? "unmuted" : "muted"}:`, track);
      });
      setIsMuted(!isMuted);

      toast(isMuted ? "Mikrofon açıldı" : "Mikrofon bağlandı");
    }
  };

  const endCall = () => {
    console.log("Ending call...");

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => {
        track.stop();
        console.log("Audio track stopped:", track);
      });
      mediaStreamRef.current = null;
    }

    setCallStatus("ended");
    setIsMuted(false);

    setTimeout(() => {
      setCallStatus("idle");
    }, 2000);

    toast.success("Zəng sonlandı");
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-center text-2xl">SoftPhone</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg font-medium text-gray-700">
              Zəngin statusu:
            </span>
            <Badge className={`${statusInfo.color} text-white px-3 py-1`}>
              {statusInfo.text}
            </Badge>
          </div>

          {(callStatus === "active" || callStatus === "connecting") && (
            <div className="text-center flex gap-4">
              <span className="text-lg font-medium text-gray-700">Müddət:</span>
              <span className="text-2xl font-mono font-bold text-blue-600">
                {formatDuration(callDuration)}
              </span>
            </div>
          )}
        </div>

        {mediaStreamRef.current && callStatus === "active" && (
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <Volume2 className="h-6 w-6 mx-auto mb-2 text-green-600" />
            <p className="text-sm text-green-700">Zəng davam edir</p>
          </div>
        )}

        <div className="flex justify-center gap-4 mt-10">
          {callStatus === "idle" && (
            <Button
              onClick={startCall}
              size="lg"
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
            >
              <Phone className="h-5 w-5 mr-2" />
              Zəngi başlat
            </Button>
          )}

          {callStatus === "connecting" && (
            <Button
              disabled
              size="lg"
              className="bg-yellow-500 text-white px-6 py-3 rounded-full"
            >
              <Phone className="h-5 w-5 mr-2 animate-pulse" />
              Bağlanır...
            </Button>
          )}

          {callStatus === "active" && (
            <>
              <Button
                onClick={toggleMute}
                size="lg"
                variant={isMuted ? "destructive" : "secondary"}
                className="px-6 py-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
              >
                {isMuted ? (
                  <>
                    <MicOff className="h-5 w-5 mr-2" />
                    Səsliyə al
                  </>
                ) : (
                  <>
                    <Mic className="h-5 w-5 mr-2" />
                    Səssizə al
                  </>
                )}
              </Button>

              <Button
                onClick={endCall}
                size="lg"
                variant="destructive"
                className="px-6 py-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
              >
                <PhoneOff className="h-5 w-5 mr-2" />
                Zəngi sonlandır
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SoftPhone;
