import { useState, useEffect } from "react";

const CountdownTimer = ({ targetDate }: { targetDate: Date }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;
      
      if (distance < 0) {
        clearInterval(interval);
        return;
      }
      
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [targetDate]);
  
  return (
    <div className="flex justify-between gap-3 mt-4 relative z-10 w-full">
      {[
        { label: 'DYS', value: timeLeft.days },
        { label: 'HRS', value: timeLeft.hours },
        { label: 'MIN', value: timeLeft.minutes },
        { label: 'SEC', value: timeLeft.seconds }
      ].map((item, idx) => (
        <div key={idx} className="flex flex-col items-center flex-1 relative group w-full">
          <div className="absolute inset-0 bg-[#00F0FF]/5 blur-md transform group-hover:bg-[#00F0FF]/20 transition-all"></div>
          <div className="bg-[#0a0f18] border border-[#1A5BFF]/40 border-t-[#00F0FF] text-[#00F0FF] font-black font-mono text-xl sm:text-2xl md:text-3xl rounded-sm w-full py-3 flex items-center justify-center relative z-10 shadow-[inner_0_0_10px_rgba(26,91,255,0.2)]">
            {item.value.toString().padStart(2, '0')}
          </div>
          <span className="text-white/50 text-[10px] sm:text-xs mt-2 uppercase tracking-[0.2em] font-bold">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;
