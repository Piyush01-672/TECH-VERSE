import { useState, useRef, useEffect } from "react";
import { BookOpen, CalendarHeart, Info, UserPlus, MapPin, Calendar, Trophy, Cpu, Zap, Target, ShieldAlert, Hexagon, Power } from "lucide-react";
import { Typewriter } from "react-simple-typewriter";
import CountdownTimer from "../components/CountdownTimer";
import TeamRegistrationForm from "../components/TeamRegistrationForm";

const HexBadge = ({ title, value, icon, delay }: { title: string, value: string, icon: any, delay: number }) => {
  return (
    <div 
      className="relative flex items-center gap-4 bg-[#0a0f1a]/80 backdrop-blur-xl border border-white/10 group overflow-hidden transition-all duration-500 hover:scale-105 hover:border-[#00F0FF]/50 p-4 md:p-6"
      style={{
        clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)',
        animation: `float-up 0.5s ease-out ${delay}s both`
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#00F0FF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      
      {/* Decorative corners */}
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00F0FF]/50 transition-colors group-hover:border-[#00F0FF]"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00F0FF]/50 transition-colors group-hover:border-[#00F0FF]"></div>

      <div className="relative z-10 p-3 bg-black/40 border border-[#00F0FF]/20 text-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.2)] group-hover:shadow-[0_0_25px_rgba(0,240,255,0.6)] group-hover:scale-110 transition-all duration-300"
           style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
        {icon}
      </div>
      
      <div className="relative z-10 flex-1">
        <p className="text-[10px] md:text-xs text-[#00F0FF] uppercase tracking-[0.3em] font-bold opacity-70 mb-1">{title}</p>
        <p className="font-bold text-white text-lg sm:text-2xl font-['Black_Ops_One'] tracking-wide group-hover:text-[#00F0FF] transition-colors duration-300 drop-shadow-md">{value}</p>
      </div>

      {/* Cyber Scanline */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-[#00F0FF] opacity-0 group-hover:opacity-50 animate-[scanY_2s_linear_infinite]"></div>
    </div>
  );
};

const CodeCrafter = () => {
  const [activeTab, setActiveTab] = useState("about");
  const formSectionRef = useRef<HTMLElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [booting, setBooting] = useState(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const gatewayOpenDate = new Date("2026-03-23T00:00:00");
  const eventCloseDate = new Date("2026-04-15T00:00:00");
  const [isGatewayOpen, setIsGatewayOpen] = useState(new Date() >= gatewayOpenDate);

  useEffect(() => {
    // Transformer Boot Sequence
    const timer = setTimeout(() => setBooting(false), 2500);
    
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    const gatewayCheck = setInterval(() => {
      setIsGatewayOpen(new Date() >= gatewayOpenDate);
    }, 1000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(gatewayCheck);
    };
  }, [gatewayOpenDate]);

  const scrollToRegistration = () => {
    setActiveTab("register");
    if (formSectionRef.current) {
      const top = formSectionRef.current.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: top - 80, behavior: "smooth" });
    }
  };

  const tabs = [
    { id: 'about', label: 'CORE.INFO', icon: Info },
    { id: 'rules', label: 'RULES.SYS', icon: BookOpen },
    { id: 'schedules', label: 'TIMELINE', icon: CalendarHeart },
    { id: 'register', label: 'REGISTER', icon: UserPlus }
  ];

  return (
    <div className="min-h-screen pt-16 bg-[#03060d] text-white overflow-hidden font-sans selection:bg-[#00F0FF] selection:text-black">
      
      {/* Booting Overlay - Cinematic Transformers Boot */}
      {booting && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center pointer-events-none">
          <div className="relative w-64 h-64 flex items-center justify-center">
            <Hexagon size={120} className="text-[#00F0FF] animate-[spin_4s_linear_infinite] opacity-20 absolute" />
            <Hexagon size={80} className="text-[#1A5BFF] animate-[spin_3s_linear_infinite_reverse] opacity-50 absolute" />
            <Power size={40} className="text-white animate-pulse absolute shadow-[0_0_30px_#00F0FF]" />
          </div>
          <div className="text-[#00F0FF] font-['Orbitron'] tracking-[0.5em] text-sm animate-pulse mt-8">
            INITIALIZING CYBER-CORE...
          </div>
          <div className="w-80 h-[2px] bg-white/10 mt-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 h-full bg-[#00F0FF] shadow-[0_0_10px_#00F0FF]" style={{ animation: 'loadingBar 2.5s ease-in-out forwards' }}></div>
          </div>
        </div>
      )}

      {/* Epic Megatron vs Optimus Background */}
      <div className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-1000" style={{ opacity: booting ? 0 : 1 }}>
         <div className="absolute inset-0 z-0">
            {/* Desktop Background (Pure High-Res Static) */}
            <img 
               src="/optimus-megatron.jpg" 
               alt="Transformers Epic Background" 
               className="hidden md:block w-full h-full object-cover object-center"
               onError={(e) => {
                 console.log("Image load failed");
               }}
            />
            
            {/* Mobile Background (Cinematic Pan) */}
            <img 
               src="/optimus-megatron.jpg" 
               alt="Transformers Epic Background" 
               className="block md:hidden w-full h-full object-cover animate-[panImage_15s_ease-in-out_infinite_alternate]"
               onError={(e) => {
                 console.log("Image load failed");
               }}
            />
            
            {/* Soft shadow purely at the very bottom so content seamlessly flows down */}
            <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#010308] to-transparent"></div>
         </div>
         {/* Hex Mesh Background */}
         <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,transparent_0%,#03060d_100%)]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='103.9' viewBox='0 0 60 103.9' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 103.9L0 86.6V51.9L30 34.6l30 17.3v34.7L30 103.9zM30 101.6L58 85.5V53l-28-16.2L2 53v32.5L30 101.6z' fill='%2300F0FF' fill-opacity='0.1'/%3E%3C/svg%3E")`,
                backgroundSize: '60px 104px',
                transform: `translateY(${scrollY * 0.1}px)`
              }}>
         </div>
         {/* Underglow from Cursor */}
         <div className="absolute w-[600px] h-[600px] bg-[#00F0FF]/10 rounded-full blur-[120px] mix-blend-screen transition-transform duration-300 ease-out"
              style={{ transform: `translate(${mousePos.x - 300}px, ${mousePos.y - 300}px)` }}></div>
         {/* Central Deep Glow */}
         <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[80vw] h-[400px] bg-[#1A5BFF]/15 blur-[150px] rounded-[100%]"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-10 pb-20 min-h-[90vh] flex flex-col justify-center items-center px-4">
        <div className={`transition-all duration-1000 transform ${booting ? 'translate-y-20 opacity-0 scale-95' : 'translate-y-0 opacity-100 scale-100'} w-full max-w-7xl mx-auto flex flex-col items-center`}>
          
          {/* Top Label */}
          <div className="inline-flex items-center justify-center px-8 py-3 mb-8 relative group bg-black/40 backdrop-blur-md border border-[#00F0FF]/30 shadow-[0_0_20px_rgba(0,240,255,0.1)]"
               style={{ clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)' }}>
            <span className="text-[#00F0FF] font-['Orbitron'] uppercase tracking-[0.4em] font-bold text-[10px] sm:text-xs relative z-10">
              <Typewriter words={['SYSTEMS ENGAGED', 'AWAITING OPERATORS', 'PROTOCOL: ENABLED']} loop={0} cursor cursorStyle='_' typeSpeed={50} deleteSpeed={30} delaySpeed={3000} />
            </span>
          </div>

          {/* Master Title - Transformers Vibe */}
          <div className="relative mb-8 text-center"
               style={{ 
                  transform: `perspective(1000px) rotateX(${(scrollY * -0.05)}deg)`,
                  transformStyle: 'preserve-3d' 
               }}>
            {/* Outline Glow behind text */}
            <h1 className="absolute inset-0 text-5xl sm:text-7xl md:text-[8rem] whitespace-normal font-black leading-none tracking-tighter uppercase blur-md opacity-60 font-['Black_Ops_One'] text-[#00F0FF]">
               CODE CRAFTER
            </h1>
            
            <h1 className="relative text-5xl sm:text-7xl md:text-[8rem] whitespace-normal font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-500 uppercase drop-shadow-2xl font-['Black_Ops_One'] z-10">
               CODE <br className="md:hidden" /> CRAFTER
            </h1>
            
            <h2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-7xl sm:text-9xl md:text-[12rem] font-black text-[#00F0FF]/10 font-['Black_Ops_One'] z-0 whitespace-nowrap pointer-events-none select-none tracking-widest mix-blend-screen animate-pulse">
               3.0
            </h2>
            
            <div className="mt-2 inline-block relative z-20 bg-gradient-to-r from-[#00F0FF] to-[#1A5BFF] px-6 py-2 transform skew-x-[-15deg] shadow-[0_0_30px_rgba(0,240,255,0.5)]">
               <span className="block transform skew-x-[15deg] text-black font-['Orbitron'] font-black text-xl md:text-3xl tracking-[0.2em]">VERSION 3.0</span>
            </div>
          </div>

          {/* System Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl mx-auto mt-16 px-2">
            <HexBadge title="Total Bounty" value="₹ 2,50,000" icon={<Trophy size={24} />} delay={0.1} />
            <HexBadge title="Operation Date" value="21-22 APR '26" icon={<Calendar size={24} />} delay={0.2} />
            <HexBadge title="Base Terminal" value="CT University" icon={<MapPin size={24} />} delay={0.3} />
          </div>

          {/* Timer Hub */}
          <div className="mt-16 w-full max-w-2xl relative group pb-10">
             {/* Mechanical Border Base */}
             <div className="absolute inset-0 bg-[#00F0FF]/5 transform skew-x-[-12deg] border border-[#00F0FF]/20 group-hover:bg-[#00F0FF]/10 group-hover:shadow-[0_0_40px_rgba(0,240,255,0.2)] transition-all duration-500"></div>
             
             <div className="relative z-10 p-8 sm:p-12 text-center">
               <div className="flex items-center justify-center gap-4 mb-6 text-[#00F0FF] font-['Orbitron'] font-bold tracking-[0.2em]">
                 <ShieldAlert size={20} className="animate-pulse" />
                 <span>{isGatewayOpen ? "GATEWAY CLOSES IN" : "GATEWAYS OPENS IN"}</span>
               </div>
               
               <div className="transform scale-110 sm:scale-125 mb-8 drop-shadow-lg">
                 <CountdownTimer targetDate={isGatewayOpen ? eventCloseDate : gatewayOpenDate} />
               </div>

               <button 
                  onClick={scrollToRegistration}
                  className="relative px-12 py-4 bg-gradient-to-r from-[#00F0FF] to-[#1A5BFF] text-black font-['Orbitron'] font-black uppercase tracking-[0.3em] overflow-hidden group/btn hover:scale-105 transition-transform duration-300"
                  style={{ clipPath: 'polygon(20px 0, 100% 0, calc(100% - 20px) 100%, 0 100%)' }}
               >
                 <span className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover/btn:opacity-20 transform -skew-x-12 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-all duration-700 ease-in-out"></span>
                 <span className="relative z-10 flex items-center gap-3">
                   INITIATE ENTRY <Target size={20} className="group-hover/btn:rotate-90 transition-transform duration-300" />
                 </span>
               </button>
             </div>
          </div>
        </div>
      </section>

      {/* Control Panel Section */}
      <section ref={formSectionRef} className="relative z-20 py-24 px-4 bg-[#010308] border-t border-[#00F0FF]/30">
        
        {/* Decorative Top Edge */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[3px] bg-gradient-to-r from-transparent via-[#00F0FF] to-transparent shadow-[0_0_20px_#00F0FF]"></div>
        <div className="absolute -top-[14px] left-1/2 -translate-x-1/2 w-8 h-8 rotate-45 border-b border-r border-[#00F0FF] bg-[#010308]"></div>

        <div className="max-w-6xl mx-auto">
          {/* Mechanical Tab Switches */}
          <div className="flex flex-wrap md:flex-nowrap justify-center gap-4 mb-12">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center justify-center gap-3 py-4 px-6 md:px-10 flex-1 min-w-[140px] font-['Orbitron'] font-bold text-xs sm:text-sm tracking-[0.2em] uppercase transition-all duration-300 ${isActive ? 'text-black' : 'text-gray-400 hover:text-white'}`}
                  style={{
                    clipPath: 'polygon(15px 0, 100% 0, calc(100% - 15px) 100%, 0 100%)',
                    background: isActive ? 'linear-gradient(90deg, #00F0FF, #1A5BFF)' : 'rgba(10, 15, 26, 0.8)',
                    boxShadow: isActive ? '0 0 20px rgba(0, 240, 255, 0.4)' : 'none',
                    border: isActive ? 'none' : '1px solid rgba(0, 240, 255, 0.2)'
                  }}
                >
                  <Icon size={18} className={isActive ? 'animate-pulse' : ''} />
                  {tab.label}
                  {/* Glowing line at bottom if not active */}
                  {!isActive && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#00F0FF] opacity-0 hover:opacity-50 transition-opacity"></div>}
                </button>
              );
            })}
          </div>

          {/* Main Display Screen */}
          <div className="relative bg-[#060A14] border border-[#00F0FF]/30 p-1 min-h-[500px] shadow-[0_0_50px_rgba(0,150,255,0.05)]"
               style={{ clipPath: 'polygon(30px 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%, 0 30px)' }}>
            
            {/* Screen Inner Bezel */}
            <div className="absolute inset-2 border border-white/5 bg-[#03050A] p-6 sm:p-10 pointer-events-none"
                 style={{ clipPath: 'polygon(25px 0, 100% 0, 100% calc(100% - 25px), calc(100% - 25px) 100%, 0 100%, 0 25px)' }}>
               {/* Internal Grid Lines */}
               <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: 'linear-gradient(#00F0FF 1px, transparent 1px), linear-gradient(90deg, #00F0FF 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
            </div>

            {/* Display Content */}
            <div className="relative z-10 p-6 sm:p-12 text-white/80 animate-[reveal_0.4s_ease-out]">
              
              {activeTab === 'about' && (
                <div className="max-w-4xl mx-auto space-y-10">
                  <h2 className="text-4xl sm:text-5xl font-['Black_Ops_One'] uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 mb-8 border-l-4 border-[#00F0FF] pl-6 py-2">
                    Primary Directive
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-lg font-mono">
                    <div className="bg-[#0b101a]/80 p-8 border border-[#1A5BFF]/30 relative group hover:border-[#00F0FF] hover:shadow-[0_0_30px_rgba(0,240,255,0.1)] transition-all">
                      <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-[#00F0FF] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="text-[#00F0FF] mb-4"><Zap size={40} /></div>
                      <p>An advanced 24-hour cycle to unify elite mechanics in programming, interface design, and systems architecture. Our primary objective is to accelerate innovation and forge real-world frameworks.</p>
                    </div>
                    <div className="bg-[#0b101a]/80 p-8 border border-[#1A5BFF]/30 relative group hover:border-[#00F0FF] hover:shadow-[0_0_30px_rgba(0,240,255,0.1)] transition-all">
                      <div className="absolute bottom-0 left-0 w-12 h-12 border-b border-l border-[#00F0FF] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="text-[#00F0FF] mb-4"><Cpu size={40} /></div>
                      <p>Whether you are an integrated systems dev, creative architect, or structural visionary, Code Crafter presents an optimal environment to execute data, establish connections, and deploy superior technical solutions.</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-6 mt-12">
                     {[ {n:'24H', l:'CYCLE'}, {n:'100+', l:'OPERATORS'}, {n:'₹2.5L', l:'BOUNTY'} ].map((s, i) => (
                       <div key={i} className="flex flex-col items-center justify-center bg-[#060a12] border-y border-[#00F0FF]/20 px-10 py-6 min-w-[200px]">
                         <span className="text-4xl font-['Black_Ops_One'] text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">{s.n}</span>
                         <span className="text-[#00F0FF] font-black tracking-widest text-xs uppercase mt-2">{s.l}</span>
                       </div>
                     ))}
                  </div>
                </div>
              )}

              {activeTab === 'rules' && (
                <div className="max-w-5xl mx-auto">
                   <h2 className="text-4xl sm:text-5xl font-['Black_Ops_One'] uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 mb-12 border-l-4 border-[#00F0FF] pl-6 py-2">
                    Execution Protocols
                  </h2>
                  <div className="grid md:grid-cols-2 gap-8">
                     <div className="bg-[#0A0F1A] border-t-2 border-[#1A5BFF] p-8 shadow-xl relative overflow-hidden group hover:border-[#00F0FF] transition-colors">
                        <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:opacity-30 transition-opacity"><Cpu size={200} /></div>
                        <h3 className="text-[#00F0FF] font-['Orbitron'] font-black text-xl mb-6 tracking-widest uppercase">System Rules</h3>
                        <ul className="space-y-4 font-mono text-sm text-gray-300 relative z-10">
                          {['Teams must consist of 2-4 operators.', 'Members must be actively enrolled.', 'Engines built from scratch in 24 hrs.', 'Submissions include source code + docs.'].map((val, i) =>(
                            <li key={i} className="flex gap-4 items-start"><span className="text-[#00F0FF] mt-1 shrink-0"><Hexagon size={12} fill="#00F0FF" /></span> {val}</li>
                          ))}
                        </ul>
                     </div>
                     <div className="bg-[#0A0F1A] border-t-2 border-[#1A5BFF] p-8 shadow-xl relative overflow-hidden group hover:border-[#00F0FF] transition-colors">
                        <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:opacity-30 transition-opacity"><Target size={200} /></div>
                        <h3 className="text-[#00F0FF] font-['Orbitron'] font-black text-xl mb-6 tracking-widest uppercase">Evaluation Matrix</h3>
                        <ul className="space-y-4 font-mono text-sm text-gray-300 relative z-10">
                          {['[30%] Innovation Algorithms', '[25%] Technical Complexity', '[20%] Pragmatic Impact', '[15%] Overall UX/UI Design', '[10%] Presentation Logic'].map((val, i) =>(
                            <li key={i} className="flex gap-4 items-start"><span className="text-[#FFD54F] mt-1 shrink-0"><Hexagon size={12} fill="#FFD54F" /></span> {val}</li>
                          ))}
                        </ul>
                     </div>
                  </div>
                </div>
              )}

              {activeTab === 'schedules' && (
                <div className="max-w-4xl mx-auto">
                   <h2 className="text-4xl sm:text-5xl font-['Black_Ops_One'] uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 mb-12 border-l-4 border-[#00F0FF] pl-6 py-2">
                    System Timeline
                  </h2>
                  <div className="relative border-l-2 border-[#1A5BFF]/30 ml-4 md:ml-1/2 space-y-12 pb-8">
                     {[
                        { t: '09:00 AM', lbl: 'OPERATOR CHECK-IN', desc: 'Arrive and initialize IDs at base terminal.' },
                        { t: '10:30 AM', lbl: 'ACTIVATION SEQUENCE', desc: 'Protocol briefing and deployment strategy.' },
                        { t: '11:30 AM', lbl: 'ENGINES START', desc: 'Commence 24HR building cycle. Systems online.' },
                        { t: '01:00 PM', lbl: 'RECHARGE PHASE', desc: 'Energy replenishment and networking.' },
                        { t: 'ONGOING', lbl: '24HR EXECUTION', desc: 'Continuous processing and compilation.' },
                     ].map((step, i) => (
                       <div key={i} className="relative pl-10 md:pl-16 group">
                         {/* Node Marker */}
                         <div className="absolute -left-[11px] top-1 w-5 h-5 bg-[#010308] border-2 border-[#00F0FF] rounded-none rotate-45 group-hover:bg-[#00F0FF] shadow-[0_0_15px_#00F0FF] transition-all duration-300 z-10"></div>
                         
                         <div className="font-['Orbitron'] text-[#00F0FF] font-bold text-lg mb-1">{step.t}</div>
                         <h4 className="text-white text-xl font-black uppercase tracking-wider mb-2 font-mono">{step.lbl}</h4>
                         <p className="text-gray-400 font-mono text-sm">{step.desc}</p>
                       </div>
                     ))}
                  </div>
                </div>
              )}

              {activeTab === 'register' && (
                <div className="max-w-4xl mx-auto animate-[fadeIn_0.5s_ease-in-out]">
                   <div className="text-center mb-10">
                      <h2 className="text-3xl sm:text-5xl font-['Black_Ops_One'] uppercase text-white tracking-widest drop-shadow-[0_0_20px_rgba(0,240,255,0.4)]">
                        NETWORK <span className="text-[#00F0FF]">REGISTRATION</span>
                      </h2>
                      <div className="mt-4 w-32 h-1 bg-[#00F0FF] mx-auto shadow-[0_0_15px_#00F0FF]"></div>
                   </div>
                   <div className="p-4 sm:p-10 bg-[#02040A] border border-[#00F0FF]/30 shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] relative">
                      {/* Circuit lines */}
                      <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-[#1A5BFF]/50"></div>
                      <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-[#1A5BFF]/50"></div>
                      
                      <div className="relative z-10">
                        {isGatewayOpen ? (
                          <TeamRegistrationForm />
                        ) : (
                          <div className="flex flex-col items-center justify-center py-20 text-center space-y-8">
                            <h3 className="text-2xl sm:text-4xl font-['Orbitron'] text-[#00F0FF] animate-pulse uppercase tracking-widest">
                              Coming <span className="text-white">Soon</span> In
                            </h3>
                            <div className="transform scale-110 sm:scale-125 drop-shadow-lg p-6 bg-black/40 rounded-xl border border-[#00F0FF]/20 mt-8">
                              <CountdownTimer targetDate={gatewayOpenDate} />
                            </div>
                          </div>
                        )}
                      </div>
                   </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* Embedded Animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Black+Ops+One&family=Orbitron:wght@400;700;900&display=swap');
        
        @keyframes hologramFloat {
          0%, 100% { transform: translateY(0) scale(1) rotateX(0deg); opacity: 0.8; }
          50% { transform: translateY(-10px) scale(1.05) rotateX(1deg); opacity: 1; }
        }
        @keyframes panImage {
          0% { object-position: 10% center; }
          100% { object-position: 90% center; }
        }
        @keyframes float-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scanY {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes loadingBar {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes reveal {
          from { opacity: 0; transform: scale(0.98) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default CodeCrafter;
