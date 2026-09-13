import { useState, useEffect } from "react";
import { Timer } from "lucide-react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer({ targetDate }: { targetDate?: string }) {
  // Target: Sept 15, 2026 09:00:00 AM IST
  const eventDate = targetDate 
    ? new Date(targetDate).getTime() 
    : new Date("2026-09-15T09:00:00+05:30").getTime();

  const calculateTimeLeft = (): TimeLeft => {
    const now = new Date().getTime();
    const difference = eventDate - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [eventDate]);

  const timeUnits = [
    { label: "DAYS", value: timeLeft.days, color: "from-cyan-400 to-blue-500" },
    { label: "HOURS", value: timeLeft.hours, color: "from-blue-400 to-indigo-500" },
    { label: "MINS", value: timeLeft.minutes, color: "from-purple-400 to-pink-500" },
    { label: "SECS", value: timeLeft.seconds, color: "from-pink-400 to-rose-500" },
  ];

  return (
    <div className="inline-flex flex-col items-center">
      <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-300 uppercase tracking-widest mb-3 bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-500/30">
        <Timer className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
        <span>Countdown to Fest Kickoff</span>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-3.5">
        {timeUnits.map((unit, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center p-2.5 sm:p-4 rounded-2xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/10 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.3)] min-w-[65px] sm:min-w-[84px] group hover:border-cyan-400/40 transition-colors"
          >
            <span
              className={`text-xl sm:text-3xl md:text-4xl font-black font-mono tracking-tight bg-gradient-to-b ${unit.color} bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(6,182,212,0.3)]`}
            >
              {String(unit.value).padStart(2, "0")}
            </span>
            <span className="text-[9px] sm:text-[11px] font-mono tracking-wider font-semibold text-slate-400 mt-0.5">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
