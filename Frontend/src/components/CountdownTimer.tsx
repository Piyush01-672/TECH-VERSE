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
    <div className="flex justify-between gap-2 mt-4">
      {[
        { label: 'Days', value: timeLeft.days },
        { label: 'Hours', value: timeLeft.hours },
        { label: 'Minutes', value: timeLeft.minutes },
        { label: 'Seconds', value: timeLeft.seconds }
      ].map((item, idx) => (
        <div key={idx} className="flex flex-col items-center flex-1">
          <div className="bg-white/15 backdrop-blur-md border border-white/20 text-white text-3xl font-bold rounded-xl w-full py-4 flex items-center justify-center shadow-lg hover:scale-105 transition-all duration-300">
            {item.value}
          </div>
          <span className="text-white/80 text-xs mt-2 uppercase font-semibold">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;
