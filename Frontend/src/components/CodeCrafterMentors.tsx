import { Hexagon } from "lucide-react";

const mentors = [
  { id: 1, name: "Devansh Kasudhan", role: "AI Engineer", image: "https://res.cloudinary.com/diijn4esl/image/upload/q_auto/f_auto/v1775550965/mentor_1_nr1tja.jpg" },
  { id: 2, name: "Prathviraj Singh ", role: "IOT and Cloud Engineer", image: "https://res.cloudinary.com/diijn4esl/image/upload/q_auto/f_auto/v1775550968/mentor_0_qojowi.jpg" },
  { id: 3, name: "Meetali", role: "Software Developer", image: "https://res.cloudinary.com/diijn4esl/image/upload/q_auto/f_auto/v1775550963/mentor_2_kl7tkt.jpg" },
  { id: 4, name: "Aayush Chand", role: "AI Analyst", image: "https://res.cloudinary.com/diijn4esl/image/upload/q_auto/f_auto/v1775550963/mentor_3_ybxbtw.jpg" },
  { id: 5, name: "Harendra Singh Rajpoot", role: "Data Science Expert", image: "https://res.cloudinary.com/diijn4esl/image/upload/q_auto/f_auto/v1775550963/mentor_6_vv8k5v.jpg" },
  { id: 6, name: "Mr. Raghav Sharma", role: "Data Scientist", image: "https://res.cloudinary.com/diijn4esl/image/upload/q_auto/f_auto/v1775550962/mentor_4_farbeb.jpg" },
  { id: 7, name: "Lokesh Pal Arya", role: "Data Science Expert", image: "https://res.cloudinary.com/diijn4esl/image/upload/q_auto/f_auto/v1775550962/mentor_7_ynm0ke.jpg" },
  { id: 8, name: "Nikhil Pandey ", role: "Cyber Security Analyst", image: "https://res.cloudinary.com/diijn4esl/image/upload/q_auto/f_auto/v1775550962/mentor_5_ajcges.jpg" },
  { id: 9, name: "Keshav bhatt", role: "Web development and Blockchain", image: "https://res.cloudinary.com/diijn4esl/image/upload/q_auto/f_auto/v1776166995/mentor_9_zwzvbg.jpg" },
  { id: 10, name: "Ankul Kumar", role: "AI, ML and Cloud", image: "https://res.cloudinary.com/diijn4esl/image/upload/q_auto/f_auto/v1776166995/mentor_8_ceri53.jpg" },
];


const CodeCrafterMentors = () => {
  // Duplicate array 4 times to ensure it fills ultra-wide screens and loops seamlessly at 50%
  const repeatedMentors = [...mentors, ...mentors, ...mentors, ...mentors];

  return (
    <section className="relative z-20 py-20 px-4 bg-[#010308] border-t border-[#00F0FF]/30 overflow-hidden">
      {/* Decorative Grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#00F0FF 1px, transparent 1px), linear-gradient(90deg, #00F0FF 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-['Black_Ops_One'] uppercase text-white tracking-[0.2em] drop-shadow-[0_0_15px_rgba(0,240,255,0.4)]">
            SYSTEM <span className="text-[#00F0FF]">MENTORS</span>
          </h2>
          <div className="mt-4 w-24 h-1 bg-[#00F0FF] mx-auto shadow-[0_0_10px_#00F0FF]"></div>
          <p className="mt-4 text-[#00F0FF]/60 font-['Orbitron'] tracking-widest text-xs sm:text-sm">GUIDING THE NEXT EVOLUTION</p>
        </div>

        {/* Marquee Container */}
        <div className="relative w-full overflow-hidden flex" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
          <div className="flex w-max shrink-0 animate-[mentorMarquee_40s_linear_infinite] hover:[animation-play-state:paused]">
            {repeatedMentors.map((mentor, index) => (
              <div
                key={`${mentor.id}-${index}`}
                className="w-[280px] sm:w-[320px] px-4 shrink-0 group perspective-1000 h-full"
              >
                <div className="relative bg-[#0a0f1a] border border-[#00F0FF]/20 p-6 transition-all duration-500 hover:border-[#00F0FF]/60 hover:shadow-[0_0_25px_rgba(0,240,255,0.2)] hover:-translate-y-2 h-full flex flex-col"
                  style={{ clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)' }}
                >
                  {/* Hexagon Placeholder for Image */}
                  <div className="relative w-full aspect-square bg-[#03050A] mb-6 overflow-hidden border border-[#00F0FF]/10 group-hover:border-[#00F0FF]/40 transition-colors"
                    style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                  >
                    {mentor.image ? (
                      <img src={mentor.image} alt={mentor.name} className="w-full h-full object-cover object-[center_15%] transition-all duration-500" />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-[#00F0FF]/30 group-hover:text-[#00F0FF]/60 transition-colors">
                        <Hexagon size={48} className="mb-2" />
                        <span className="font-mono text-xs uppercase tracking-widest text-center px-4">Image<br/>Pending</span>
                      </div>
                    )}
                    {/* Scanline overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00F0FF]/10 to-transparent w-full h-[200%] animate-[scanLine_2s_linear_infinite] pointer-events-none"></div>
                  </div>

                  <div className="text-center relative z-10 px-1 flex-1 flex flex-col justify-center">
                    <h3 className="text-base sm:text-lg font-['Black_Ops_One'] text-white tracking-wider group-hover:text-[#00F0FF] transition-colors leading-snug">{mentor.name}</h3>
                    <p className="text-[10px] sm:text-xs font-mono text-[#00F0FF]/80 mt-1 sm:mt-2 tracking-widest uppercase">{mentor.role}</p>
                  </div>

                  {/* Corner Accents */}
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#00F0FF]/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#00F0FF]/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes mentorMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
};

export default CodeCrafterMentors;
