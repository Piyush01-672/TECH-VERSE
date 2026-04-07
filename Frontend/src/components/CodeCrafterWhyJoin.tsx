import React from 'react';
import { Target, Zap, Cpu, Hexagon, Trophy, Users, Shield, Award, Calendar, BarChart } from 'lucide-react';
import { motion } from 'framer-motion';

const CodeCrafterWhyJoin = () => {
  return (
    <section className="relative z-20 font-mono text-white selection:bg-[#00F0FF] selection:text-black bg-[#010308] w-full pt-10 overflow-hidden">
      {/* Universal Decorative Grid matching the Twin Powerhouse Section */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#00F0FF 1px, transparent 1px), linear-gradient(90deg, #00F0FF 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      {/* Why Join Section */}
      <div className="relative z-20 py-10 px-4 max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-1 border border-[#1A5BFF] bg-[#1A5BFF]/10 text-[#1A5BFF] font-['Orbitron'] text-xs uppercase tracking-widest mb-4">
            [ INITIALIZE PROTOCOL ]
          </div>
          <h2 className="text-4xl sm:text-6xl font-['Black_Ops_One'] uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 tracking-[0.1em] drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] mb-4">
            WHY YOU CAN'T <span className="text-[#00F0FF]">MISS</span> THIS
          </h2>
          <p className="text-gray-400 font-mono text-sm max-w-2xl mx-auto border-l-2 border-[#00F0FF] pl-4">
            CodeCrafter 3.0 isn't just a hackathon — it's a launchpad, a network, and 24 hours of pure creation. We rewrote the rulebook. Bigger prizes, elite partners, and a community ready to push boundaries.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {[
            { tag: "01", icon: <Trophy size={32} />, title: "Massive Prize Pool", desc: "Over ₹2.5 Lakhs up for grabs — nearly 2.5× bigger than last year. Compete hard, win big." },
            { tag: "02", icon: <Shield size={32} />, title: "Elite Corp Partners", desc: "Backed by IBM and Google Developers Group Jalandhar — opening doors to real mentorship." },
            { tag: "03", icon: <Hexagon size={32} />, title: "Build Real Systems", desc: "Work on ideas that matter. Projects from past editions have gone on to become live products." },
            { tag: "04", icon: <CheckCircle size={32} />, title: "World-Class Mentors", desc: "Get guided by industry professionals from IBM and Google Developer communities." },
            { tag: "05", icon: <Users size={32} />, title: "Expand Your Grid", desc: "Meet 600+ passionate developers, designers, and innovators. Your next co-founder could be here." },
            { tag: "06", icon: <BarChart size={32} />, title: "Proven Track Record", desc: "CodeCrafter 2.0 earned a 99.9% satisfaction rate. We know how to run a hackathon you'll remember." },
          ].map((reason, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, scale: 0.95 }} 
              whileInView={{ opacity: 1, scale: 1 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-[#0A0F1A] border-l-2 border-[#1A5BFF] p-4 sm:p-6 lg:p-8 relative group hover:border-[#00F0FF] hover:bg-[#060a12] transition-colors shadow-[0_0_20px_rgba(0,0,0,0.5)] cursor-crosshair aspect-[4/5] md:aspect-square flex flex-col justify-center items-center text-center overflow-hidden"
            >
              {/* Corner decor */}
              <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#1A5BFF]/30 group-hover:border-[#00F0FF] transition-colors"></div>
              
              <div className="absolute top-4 right-4 text-[10px] font-['Orbitron'] font-black text-[#1A5BFF]/40 group-hover:text-[#00F0FF]/60 tracking-widest">
                [ {reason.tag} ]
              </div>

              <div className="text-[#1A5BFF] group-hover:text-[#00F0FF] group-hover:animate-pulse mb-6">
                {reason.icon}
              </div>
              <h3 className="font-['Orbitron'] text-lg font-bold text-white uppercase tracking-widest mb-3 group-hover:text-[#00F0FF] transition-colors">
                {reason.title}
              </h3>
              <p className="font-mono text-[10px] sm:text-xs lg:text-sm text-gray-400 group-hover:text-gray-300 leading-relaxed max-w-[90%] line-clamp-3 sm:line-clamp-none">
                {reason.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="relative z-20 border-y border-[#00F0FF]/30 bg-[#02040A] flex flex-wrap justify-center overflow-hidden">
        {[
          { num: "₹2.5L+", label: "PRIZE POOL", textMode: "text-[#FFD54F]", icon: <Trophy size={16} /> },
          { num: "1000+", label: "OPERATORS", textMode: "text-[#00F0FF]", icon: <Cpu size={16} /> },
          { num: "99.9%", label: "SYSTEM UPTIME", textMode: "text-[#00F0FF]", icon: <Zap size={16} /> },
          { num: "02", label: "CORP PARTNERS", textMode: "text-[#FFD54F]", icon: <Shield size={16} /> },
        ].map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="relative flex-1 min-w-[140px] text-center p-6 sm:p-8 border-r border-[#00F0FF]/20 last:border-r-0 group hover:bg-[#00F0FF]/5 transition-colors"
          >
            <div className={`flex justify-center mb-2 ${stat.textMode} opacity-50 group-hover:opacity-100 transition-opacity group-hover:animate-pulse`}>
              {stat.icon}
            </div>
            <div className={`font-['Black_Ops_One'] text-3xl sm:text-4xl lg:text-5xl ${stat.textMode} drop-shadow-[0_0_15px_rgba(0,240,255,0.3)] group-hover:scale-110 transition-transform`}>
              {stat.num}
            </div>
            <div className="font-['Orbitron'] text-[10px] sm:text-xs tracking-[0.2em] font-bold text-gray-500 mt-2 group-hover:text-white transition-colors">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Prize Pool Breakdown
      <div className="relative z-20 border-b border-[#00F0FF]/20 overflow-hidden">
        <div className="absolute -left-32 -top-32 w-64 h-64 bg-[#1A5BFF]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -right-32 -bottom-32 w-64 h-64 bg-[#00F0FF]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-4 py-20 flex flex-col md:flex-row gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-center md:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1 border border-[#FFD54F] bg-[#FFD54F]/10 text-[#FFD54F] font-['Orbitron'] text-xs uppercase tracking-widest mb-6">
              <span className="w-2 h-2 bg-[#FFD54F] animate-pulse"></span> PRIZE ALLOCATION
            </div>
            <h2 className="text-6xl sm:text-8xl font-['Black_Ops_One'] text-transparent bg-clip-text bg-gradient-to-r from-[#FFD54F] to-[#FF9B3D] mb-4">
              ₹2.5L+
            </h2>
            <div className="text-xl font-['Orbitron'] font-bold text-gray-300 tracking-widest uppercase mb-6">
              Total Prizes — 3.0 Edition
            </div>
            <p className="text-gray-400 font-mono text-sm leading-relaxed max-w-sm mx-auto md:mx-0 border-l border-[#FFD54F]/30 pl-4">
              We doubled down on rewards this year. Whether you're chasing the top spot or a category win, there's something worth fighting for at every level.
            </p>
          </motion.div>

          <div className="flex-1 w-full flex flex-col gap-4">
            {[
              { rank: "01", medal: "🥇", label: "Alpha First Place", amount: "₹1,00,000+" },
              { rank: "02", medal: "🥈", label: "Beta Second Place", amount: "₹60,000+" },
              { rank: "03", medal: "🥉", label: "Gamma Third Place", amount: "₹40,000+" },
              { rank: "SP", medal: "🎖️", label: "Special Category Bounties", amount: "₹50,000+" },
            ].map((prize, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: 40 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex items-center gap-4 p-4 border border-[#00F0FF]/20 bg-[#0a0f1a] hover:bg-[#00F0FF]/10 hover:border-[#00F0FF] transition-colors relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#00F0FF]/0 via-[#00F0FF]/5 to-[#00F0FF]/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"></div>
                <div className="w-12 h-12 shrink-0 bg-[#060a12] border border-[#00F0FF]/30 flex items-center justify-center text-xl shadow-[0_0_10px_rgba(0,240,255,0.1)]">
                  {prize.medal}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-end">
                    <div className="font-['Orbitron'] text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                      {prize.label}
                    </div>
                    <div className="font-['Black_Ops_One'] text-lg sm:text-2xl text-[#FFD54F] tracking-widest pl-2">
                      {prize.amount}
                    </div>
                  </div>
                  <div className="w-full h-[1px] bg-gradient-to-r from-[#1A5BFF]/50 to-transparent mt-2"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div> */}

      {/* Partners section */}
      <div className="relative z-20 py-20 px-4 max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-1 border border-[#1A5BFF] bg-[#1A5BFF]/10 text-[#1A5BFF] font-['Orbitron'] text-xs uppercase tracking-widest mb-4">
            [ ALLIANCE NETWORK ]
          </div>
          <h2 className="text-3xl sm:text-5xl font-['Black_Ops_One'] uppercase text-white tracking-[0.1em] drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] mb-4">
            BACKED BY THE BEST.
          </h2>
          <p className="text-gray-400 font-mono text-sm max-w-2xl mx-auto">
            We've joined hands with two giants to make CodeCrafter 3.0 a truly industry-grade experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 max-w-4xl mx-auto">
          {/* IBM */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            whileInView={{ opacity: 1, scale: 1 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.5 }} 
            className="p-8 sm:p-6 lg:p-8 border border-[#1A5BFF]/40 bg-[#0a0f1a] relative group hover:shadow-[0_0_30px_rgba(26,91,255,0.2)] hover:-translate-y-1 transition-all min-h-[300px] flex flex-col justify-center items-center text-center overflow-hidden"
          >
            <div className="text-5xl font-['Black_Ops_One'] text-[#1F70C1] mb-4">IBM</div>
            {/* <div className="text-white font-['Orbitron'] font-bold tracking-widest uppercase mb-4 text-sm sm:text-base">IBM Corporation</div> */}
            <div className="hidden sm:block text-white font-['Orbitron'] font-bold tracking-widest uppercase mb-4 text-sm sm:text-base text-ellipsis overflow-hidden">
            IBM Corporation
            </div>
            <p className="text-[10px] sm:text-xs lg:text-sm font-mono text-gray-400 group-hover:text-gray-300 leading-relaxed border-l border-[#1F70C1] pl-4 max-w-[90%]">
              One of the world's leading technology companies brings mentorship, cloud tools, and enterprise-grade insights directly to your team.
            </p>
          </motion.div>
          {/* GDG */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.9 }} 
             whileInView={{ opacity: 1, scale: 1 }} 
             viewport={{ once: true }} 
             transition={{ duration: 0.5, delay: 0.2 }} 
             className="p-8 sm:p-6 lg:p-8 border border-[#00F0FF]/40 bg-[#0a0f1a] relative group hover:shadow-[0_0_30px_rgba(0,240,255,0.2)] hover:-translate-y-1 transition-all min-h-[300px] flex flex-col justify-center items-center text-center overflow-hidden"
          >
            <div className="text-5xl font-['Black_Ops_One'] mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#4285F4] via-[#34A853] to-[#FBBC05]">
              GDG
            </div>
            <div className="hidden sm:block text-white font-['Orbitron'] font-bold tracking-widest uppercase mb-4 text-sm sm:text-base text-ellipsis overflow-hidden">
              Google Developers Group
            </div>
            <p className="text-[10px] sm:text-xs lg:text-sm font-mono text-gray-400 group-hover:text-gray-300 leading-relaxed border-l border-[#34A853] pl-4 max-w-[90%]">
              Part of Google's global developer network, bringing cutting-edge Google tech stack access, workshops, and community support.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="relative z-20 py-16 px-4 border-y border-[#00F0FF]/20 mt-10">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row gap-8 justify-between items-end mb-12"
          >
            <div>
              <div className="inline-block px-4 py-1 border border-[#00F0FF] bg-[#00F0FF]/10 text-[#00F0FF] font-['Orbitron'] text-xs uppercase tracking-widest mb-4">
                [ DEBRIEFING LOGS ]
              </div>
              <h2 className="text-3xl sm:text-5xl font-['Black_Ops_One'] uppercase text-white tracking-widest">
                99.9% POSITIVE.
              </h2>
            </div>
            <p className="text-gray-400 font-mono text-sm max-w-sm text-left md:text-right border-l md:border-l-0 md:border-r border-[#00F0FF]/50 pl-4 md:pl-0 md:pr-4">
              Don't take our word for it — hear from the builders who were there in the battleground.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { author: "Lovely Professional University Student", prize:"1st prize in CodeCrafter2.0", text: "\"Best hackathon I've attended in Punjab. The energy was unreal, the mentors were genuinely helpful, and we actually shipped something we're proud of.\"" },
              { author: "CT University Student", prize:"2nd prize in CodeCrafter 2.0", text: "\"Won second place and got connected with a senior dev from the panel. That one conversation changed my career path. Come for the prize, stay for the network.\"" },
              { author: "Sant Baba Bhag Singh University Student", prize:"3rd prize in CodeCrafter2.0", text: "\"The organisation was impeccable. Food, Wi-Fi, mentors — everything was sorted so we could just focus on building. Already counting down to 3.0.\"" },
            ].map((testi, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="p-6 bg-[#0a0f1a] border border-gray-800 hover:border-[#FFD54F]/50 transition-colors group relative"
              >
                <div className="text-[#FFD54F] tracking-[0.2em] text-sm mb-4 bg-[#FFD54F]/10 inline-block px-2 py-1">
                  ★★★★★
                </div>
                <p className="text-gray-300 font-mono text-sm leading-relaxed mb-6 italic">
                  {testi.text}
                </p>
                <div className="text-[#00F0FF]/60 font-['Orbitron'] text-[10px] sm:text-xs tracking-widest uppercase pb-2 border-b border-gray-800">
                  — {testi.author}
                </div>
                <div className="text-[#00F0FF]/60 font-['Orbitron'] text-[10px] sm:text-xs tracking-widest uppercase pb-2 border-b border-gray-800">
                  — {testi.prize}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
    </section>
  );
};

// CheckCircle icon for consistency
const CheckCircle = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

export default CodeCrafterWhyJoin;
