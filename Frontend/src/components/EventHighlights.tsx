import { Terminal } from "lucide-react";

const EventHighlights = () => {
  return (
    <div className="flex lg:justify-end">
      <div className="bg-[#0b101a]/80 backdrop-blur-md p-8 sm:p-10 border-l-4 border-l-[#1A5BFF] border-y border-y-[#1A5BFF]/20 border-r border-r-[#1A5BFF]/20 shadow-[0_0_40px_rgba(26,91,255,0.1)] max-w-md w-full relative overflow-hidden group">
        
        {/* Decorative Grid Top Right */}
        <div className="absolute top-0 right-0 w-16 h-16 opacity-30 bg-[linear-gradient(rgba(0,240,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.5)_1px,transparent_1px)] bg-[size:4px_4px]"></div>

        <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-white mb-8 tracking-[0.2em] uppercase flex items-center gap-3 relative z-10">
          <Terminal size={24} className="text-[#00F0FF]" /> Event Parameters
        </h3>

        <ul className="space-y-6 relative z-10">
          {[
            "24-Hours Coding Challenge",
            "Open to all students",
            "Innovate real world solutions",
            "Workshop, Games & Prizes",
          ].map((highlight, idx) => (
            <li key={idx} className="flex items-start text-white/80 font-mono text-sm uppercase tracking-wide">
              <span className="text-[#FFD54F] mr-4 flex-shrink-0 animate-pulse font-bold">[{idx + 1}]</span>
              {highlight}
            </li>
          ))}
        </ul>
        
        {/* Bottom edge detail */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#1A5BFF] via-[#00F0FF] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
      </div>
    </div>
  );
};

export default EventHighlights;
