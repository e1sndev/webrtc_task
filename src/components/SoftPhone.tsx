import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Volume2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CallStatus } from "../types/call.type";

const SoftPhone = () => {
  const [callStatus] = useState<CallStatus>("idle");
  const [callDuration, setCallDuration] = useState(0);

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
      </CardContent>
    </Card>
  );
};

export default SoftPhone;
