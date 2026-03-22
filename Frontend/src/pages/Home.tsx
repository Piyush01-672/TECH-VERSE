import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import {Mail,MapPin, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";
import { Code, Trophy, Users, Sparkles } from "lucide-react";
import TechverseLogo from "@/assets/techverse-logo.jpg";
import UniversityLogo from "@/assets/univeee-logo.png";
import SoetLogo from "@/assets/soet-logo.png";
import { EnquiryDialog } from "@/components/EnquiryDialog";
import { Code2, Cpu, Database, Globe, Binary } from "lucide-react";
import { FloatingSocials } from "@/components/FloatingSocials";
import { FeatureCard } from "@/components/FeatureCard";

const CodeCrafterTransition = () => {
  return (
    <div className="fixed inset-0 z-[100] bg-[#03060d] flex items-center justify-center overflow-hidden animate-[fadeInGlitch_2s_ease-out_forwards,fadeTransition_1s_ease-in_forwards_2.5s]">
      {/* Glitch & Fade Layers */}
      <div className="absolute inset-0 z-10 overflow-hidden">
        {/* DESKTOP ONLY: Main background with base glitch */}
        <div className="hidden md:block absolute inset-0 animate-[glitchMain_3s_infinite] opacity-70">
          <img src="/optimus-megatron.jpg" className="absolute inset-0 w-full h-full object-cover" alt="" />
        </div>

        {/* MOBILE ONLY: Clean Fade Colours Poster */}
        <div className="md:hidden absolute inset-0 animate-[pulse_3s_ease-in-out_infinite,hueRotate_6s_linear_infinite] opacity-100">
          <img src="/codecrafter-poster-fade.png" className="absolute inset-0 w-full h-full object-cover" alt="" />
        </div>

        {/* DESKTOP ONLY: Faded Red Shift Layer */}
        <div className="hidden md:block absolute inset-0 mix-blend-screen animate-[glitchRed_0.4s_infinite] opacity-20">
           <img src="/optimus-megatron.jpg" className="absolute inset-0 w-full h-full object-cover contrast-110 saturate-150 hue-rotate-[-15deg] blur-[1px]" alt="" />
        </div>

        {/* Faded Blue Shift Layer */}
        <div className="absolute inset-0 mix-blend-screen animate-[glitchBlue_0.3s_infinite] opacity-20">
           <img src="/optimus-megatron.jpg" className="hidden md:block absolute inset-0 w-full h-full object-cover contrast-110 saturate-150 hue-rotate-[160deg] blur-[1px]" alt="" />
           <img src="/codecrafter-poster-final.png" className="block md:hidden absolute inset-0 w-full h-full object-cover contrast-150 saturate-200 hue-rotate-[180deg] blur-[2px]" alt="" />
        </div>

        {/* Intense Tearing Glitch Layer (Mobile Only) */}
        <div className="md:hidden absolute inset-0 z-20 mix-blend-difference animate-[intenseGlitch_0.4s_infinite] opacity-30">
           <img src="/codecrafter-poster-final.png" className="w-full h-full object-cover" alt="" />
        </div>
      </div>

      {/* scanLine Overlay */}
      <div className="absolute inset-0 z-25 pointer-events-none opacity-20 overflow-hidden">
        <div className="w-full h-1/2 bg-gradient-to-b from-transparent via-[#00F0FF]/40 to-transparent animate-[scanLine_2s_linear_infinite]"></div>
      </div>

      {/* Noise Overlay */}
      <div className="absolute inset-0 z-20 opacity-30 pointer-events-none mix-blend-overlay animate-[noiseMove_0.1s_infinite]"
           style={{ backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Net_Noise.png")', backgroundSize: '150px 150px' }}></div>


      {/* Slicing Lines Overlay */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="absolute w-full h-[1px] bg-[#00F0FF]/20 animate-[sliceAppear_2.5s_infinite]"
               style={{ top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 2}s` }}></div>
        ))}
      </div>

      {/* Central Content (Faded & Shaky) */}
      <div className="hidden md:flex relative z-40 flex-col items-center justify-center pointer-events-none w-full px-4 animate-[contentShake_0.3s_infinite] opacity-80">
         <div className="inline-flex items-center justify-center px-4 sm:px-8 py-2 sm:py-3 mb-4 sm:mb-8 bg-black/40 backdrop-blur-md border border-[#00F0FF]/20" style={{ clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)' }}>
            <span className="text-[#00F0FF]/70 font-['Orbitron'] uppercase tracking-[0.2em] sm:tracking-[0.4em] font-bold text-[10px] sm:text-sm">SYSTEMS ENGAGED</span>
         </div>
         <h1 className="text-[14vw] sm:text-6xl md:text-[8rem] whitespace-nowrap font-black leading-none tracking-tighter text-white/90 uppercase font-['Black_Ops_One'] text-center w-full">
            CODE CRAFTER
         </h1>
         <div className="mt-2 sm:mt-4 bg-[#00F0FF]/80 px-4 sm:px-6 py-1.5 sm:py-2 transform skew-x-[-15deg]">
            <span className="block transform skew-x-[15deg] text-black font-['Orbitron'] font-black text-sm sm:text-xl md:text-3xl tracking-[0.1em] sm:tracking-[0.2em]">VERSION 3.0</span>
         </div>
      </div>
    </div>
  );
};

const Home = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [hasClosedDialogOnce, setHasClosedDialogOnce] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDialogOpen(true);
    }, 3000); 

    return () => clearTimeout(timer);
  }, []);

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open && !hasClosedDialogOnce) {
      setHasClosedDialogOnce(true);
      setIsTransitioning(true);
      setTimeout(() => {
        setIsTransitioning(false);
        window.dispatchEvent(new Event('highlightCodeCrafter'));
      }, 4000); // 4-second transition effect
    }
  };

  const stats = [
    { label: "Participants", value: "500+", icon: Users },
    { label: "Projects", value: "100+", icon: Code },
    { label: "Prize Pool", value: "₹50K+", icon: Trophy },
    { label: "Mentors", value: "20+", icon: Zap },
  ];

  const features = [
    {
      icon: Code,
      title: "Workshops & Training",
      description:
        "Regular hands-on workshops on latest technologies, programming languages, and development tools.",
    },
    {
      icon: Trophy,
      title: "Hackathons & Competitions",
      description:
        "Participate in exciting hackathons and coding competitions to showcase your skills.",
    },
    {
      icon: Users,
      title: "Networking Events",
      description:
        "Connect with industry professionals, alumni, and fellow tech enthusiasts.",
    },
    {
      icon: Sparkles,
      title: "Mentorship",
      description:
        "Gain hands-on guidance from industry experts and transform your ideas into impactful projects.",
    },
  ];
  return (
    <div className="min-h-screen relative">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700&family=Black+Ops+One&display=swap');`}</style>
      {isTransitioning && <CodeCrafterTransition />}
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
  {/* Animated Tech Background */}
  <div className="absolute inset-0 overflow-hidden">
    {/* Grid Pattern */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e510_1px,transparent_1px),linear-gradient(to_bottom,#4f46e510_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

    {/* Glowing Circuit Lines */}
    <div className="absolute top-20 left-10 w-36 h-36 md:w-72 md:h-72 border-2 border-cyan-400/30 rounded-lg animate-[spin_20s_linear_infinite] shadow-[0_0_50px_rgba(34,211,238,0.3)]">
      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
      <div className="absolute top-0 left-1/2 w-0.5 h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent"></div>
    </div>
    <div className="absolute top-1/3 md:top-40 right-20 w-32 h-32 md:w-64 md:h-64 border-2 border-blue-400/30 rounded-full animate-[spin_15s_linear_infinite_reverse] shadow-[0_0_50px_rgba(59,130,246,0.3)]">
      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
    </div>
    <div className="absolute bottom-20 left-1/4 w-40 h-40 md:w-80 md:h-80 border-2 border-purple-400/30 rounded-lg animate-[spin_25s_linear_infinite] shadow-[0_0_50px_rgba(168,85,247,0.3)]">
      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
      <div className="absolute top-0 left-1/2 w-0.5 h-full bg-gradient-to-b from-transparent via-purple-400 to-transparent"></div>
    </div>

    {/* Floating Tech Icons with Glow */}
    <div className="absolute top-32 right-10 md:right-1/4 animate-[bounce_3s_ease-in-out_infinite]">
      <div className="p-4 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl border border-cyan-400/30 shadow-[0_0_30px_rgba(34,211,238,0.4)]">
        <Code2 className="w-8 h-8 text-cyan-400" />
      </div>
    </div>
    <div className="absolute bottom-40 right-10 md:right-1/3 animate-[bounce_4s_ease-in-out_infinite_1s]">
      <div className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-full border border-purple-400/30 shadow-[0_0_30px_rgba(168,85,247,0.4)]">
        <Cpu className="w-8 h-8 text-purple-400" />
      </div>
    </div>
    <div className="absolute top-1/2 left-10 md:left-20 animate-[bounce_3.5s_ease-in-out_infinite_0.5s]">
      <div className="p-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-xl border border-blue-400/30 shadow-[0_0_30px_rgba(59,130,246,0.4)]">
        <Database className="w-8 h-8 text-blue-400" />
      </div>
    </div>
    <div className="absolute top-1/4 right-1/2 animate-[bounce_3.8s_ease-in-out_infinite_0.3s]">
      <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 backdrop-blur-sm rounded-lg border border-emerald-400/30 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
        <Globe className="w-6 h-6 text-emerald-400" />
      </div>
    </div>
    <div className="absolute bottom-1/4 left-1/3 animate-[bounce_4.2s_ease-in-out_infinite_0.8s]">
      <div className="p-3 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-full border border-yellow-400/30 shadow-[0_0_30px_rgba(234,179,8,0.4)]">
        <Zap className="w-6 h-6 text-yellow-400" />
      </div>
    </div>

    {/* Glowing Particles */}
    {[...Array(20)].map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]"
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${2 + Math.random() * 2}s`
        }}
      ></div>
    ))}

    {/* Binary Rain Effect */}
    <div className="absolute top-0 left-1/4 text-cyan-400/20 font-mono text-xs animate-[slideDown_10s_linear_infinite]">
      <Binary className="w-4 h-4" />
    </div>
    <div className="absolute top-0 right-1/3 text-blue-400/20 font-mono text-xs animate-[slideDown_12s_linear_infinite]">
      <Binary className="w-4 h-4" />
    </div>

    {/* Large Glow Effects */}
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px]"></div>
    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]"></div>
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]"></div>
  </div>

{/* ✅ CENTERED CONTENT */}
<div className="relative z-10 flex flex-col items-center justify-center text-center px-6 space-y-10 pt-32 pb-20">
  {/* Edition Badge */}
  <div className="inline-block px-6 py-2 bg-secondary/20 backdrop-blur-sm rounded-full border border-secondary/30 shadow-md">
    <span className="text-secondary font-semibold tracking-wide">Since 2025</span>
  </div>

  {/* Title */}
  <h1 className="text-6xl md:text-8xl font-bold font-space bg-gradient-to-r from-[#6EE7B7] via-[#3B82F6] to-[#9333EA] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(147,51,234,0.6)] leading-[1.15] mt-8">
    TechVerse
  </h1>

  {/* Description */}
  <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed tracking-wide bg-gradient-to-r from-[#93C5FD] via-[#E0F2FE] to-[#C7D2FE] bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(59,130,246,0.4)]">
    The ultimate tech club
    <Typewriter
      words={[
        " that transforms Ideas into Reality.",
        " where Innovation meets Community.",
      ]}
      loop={true}
      cursor
      cursorStyle="|"
      typeSpeed={90}
      deleteSpeed={60}
      delaySpeed={1500}
    />
  </p>

  {/* Location */}
  <div className="flex flex-wrap items-center justify-center gap-4 text-white/90 mt-12">
    <div className="flex items-center gap-2">
      <MapPin size={22} />
      <span className="font-medium tracking-wide">CT University, Punjab</span>
    </div>
  </div>

  {/* Buttons */}
  <div className="flex flex-wrap gap-6 justify-center mt-19">
    <Button
      onClick={() => setIsDialogOpen(true)}
      size="lg"
      className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-10 py-6 text-lg shadow-lg shadow-secondary/40 hover:shadow-[0_0_25px_rgba(59,130,246,0.7)] transition-all duration-300 rounded-xl"
    >
      Join now
    </Button>
    <Button
      size="lg"
      variant="outline"
      className="bg-white/10 hover:bg-white/20 text-white border-white/30 px-10 py-6 text-lg backdrop-blur-sm hover:shadow-[0_0_25px_rgba(255,255,255,0.6)] transition-all duration-300 rounded-xl"
    >
      <Link to="/about">About us</Link>
    </Button>
    
  </div>

</div>
  {/* Moving Announcement Line */}
  <div className="absolute bottom-5 w-full overflow-hidden cursor-default">
    <div className="flex items-center gap-4 px-4 py-2 bg-black/80 backdrop-blur-sm rounded-full shadow-2xl">
      <div className="flex-shrink-0 z-10 pl-2">
        <span className="text-blue-400 font-bold text-sm md:text-base tracking-wide animate-pulse inline-block">
          🔔 TechVerse Updates:
        </span>
      </div>
      <div className="relative flex-1 overflow-hidden flex mask-fade-edges">
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          {/* Two identical groups for a seamless continuous 360 scroll */}
          {[0, 1].map((blockIdx) => (
            <div key={blockIdx} className="flex gap-48 pr-48" aria-hidden={blockIdx === 1}>
              {/* Mapping to prevent writing the same span multiple times in source */}
              {[...Array(4)].map((_, i) => (
                <span key={i} className="text-blue-300 font-semibold text-sm md:text-base whitespace-nowrap">
                  TechVerse presents CodeCrafter 3.0 — Build • Innovate • Hack • Repeat
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>

    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700&family=Black+Ops+One&display=swap');

      @keyframes fadeInGlitch {
        0% { opacity: 0; transform: scale(1.1) blur(10px); }
        100% { opacity: 1; transform: scale(1) blur(0); }
      }

      @keyframes fadeTransition {
        0% { opacity: 1; }
        100% { opacity: 0; }
      }

      @keyframes glitchMain {
        0%, 100% { transform: none; filter: none; }
        33% { transform: translate(-5px, 2px); filter: contrast(1.1); }
        66% { transform: translate(5px, -2px); filter: brightness(1.05); }
      }

      @keyframes glitchRed {
        0% { transform: translate(0); clip-path: inset(44% 0 1% 0); }
        20% { transform: translate(-5px, 2px); clip-path: inset(10% 0 50% 0); }
        40% { transform: translate(5px, -2px); clip-path: inset(80% 0 5% 0); }
        60% { transform: translate(-2px, 0); clip-path: inset(20% 0 60% 0); }
        80% { transform: translate(2px, 2px); clip-path: inset(50% 0 20% 0); }
        100% { transform: translate(0); clip-path: inset(44% 0 1% 0); }
      }

      @keyframes glitchBlue {
        0% { transform: translate(0); clip-path: inset(10% 0 80% 0); }
        20% { transform: translate(5px, -2px); clip-path: inset(40% 0 20% 0); }
        40% { transform: translate(-5px, 2px); clip-path: inset(10% 0 50% 0); }
        60% { transform: translate(2px, 0); clip-path: inset(70% 0 10% 0); }
        80% { transform: translate(-2px, -2px); clip-path: inset(20% 0 60% 0); }
        100% { transform: translate(0); clip-path: inset(10% 0 80% 0); }
      }

      @keyframes noiseMove {
        0% { background-position: 0 0; }
        100% { background-position: 100% 100%; }
      }

      @keyframes sliceAppear {
        0%, 100% { opacity: 0; transform: translateX(-100%); }
        50% { opacity: 1; transform: translateX(100%); }
      }

      @keyframes contentShake {
        0% { transform: translate(0); }
        25% { transform: translate(1px, -1px); }
        50% { transform: translate(-1px, 1px); }
        75% { transform: translate(1px, 0px); }
        100% { transform: translate(0); }
      }
      
      @keyframes marquee {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }

      .animate-marquee {
        animation: marquee 25s linear infinite;
        will-change: transform;
      }

      .mask-fade-edges {
        -webkit-mask-image: linear-gradient(to right, transparent, black 2%, black 98%, transparent);
        mask-image: linear-gradient(to right, transparent, black 2%, black 98% , transparent);
      }
    `}</style>

</section>


      {/* { MY TECHVERSE } */}
      <section className="relative py-10 bg-gradient-to-b from-blue-50 via-blue-100 to-gray-100 overflow-hidden">
        {/* Heading */}
        <h2 className="text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-12 mt-6 tracking-tight leading-tight drop-shadow-lg bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
          Welcome to TechVerse
        </h2>

        <div className="relative flex flex-col items-center w-full mt-12">
  {/* Center guiding line */}
  <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-400 to-transparent z-0" />

  {/* Flex row for branches and logos */}
  <div className="flex flex-col sm:flex-row items-center justify-center w-full relative z-10 flex-wrap">
    {/* Left Olive Branch */}
    <div className="flex justify-end items-center gap-1">
      {[...Array(11)].map((_, i) => (
        <svg
          key={i}
          className="w-4 h-4  xl:w-6 xl:h-6 text-green-500 animate-sway"
          style={{ transform: `rotate(${15 + i * 2}deg)` }}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2C8 8 2 12 2 12s6 4 10 10c4-6 10-10 10-10S16 8 12 2z" />
        </svg>
      ))}
    </div>

    {/* Left Logo */}
    <div className="w-20 h-20 sm:w-32 sm:h-32 xl:w-40 xl:h-40 rounded-full overflow-hidden flex justify-center items-center bg-transparent drop-shadow-md mx-2 sm:mx-4">
      <img
        src={UniversityLogo}
        alt="Left Logo"
        className="w-full h-full object-contain"
      />
    </div>

    {/* Center Techverse logo */}
    <div className="w-28 h-28 sm:w-48 sm:h-48 xl:w-64 xl:h-64 rounded-full overflow-hidden flex justify-center items-center bg-transparent drop-shadow-xl mx-2 sm:mx-4">
      <img
        src={TechverseLogo}
        alt="Techverse Logo"
        className="w-full h-full object-contain"
      />
    </div>

    {/* Right Logo */}
    <div className="w-20 h-20 sm:w-40 sm:h-40 xl:w-48 xl:h-48 rounded-full overflow-hidden flex justify-center items-center bg-transparent drop-shadow-md mx-2 sm:mx-1">
      <img
        src={SoetLogo}
        alt="Right Logo"
        className="w-full h-full object-contain p-1"
      />
    </div>

    {/* Right Olive Branch */}
    <div className="flex justify-start items-center gap-1">
      {[...Array(11)].map((_, i) => (
        <svg
          key={i}
          className="w-4 h-4 xl:w-6 xl:h-6 text-green-500 animate-sway"
          style={{ transform: `rotate(${-15 - i * 2}deg)` }}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2C8 8 2 12 2 12s6 4 10 10c4-6 10-10 10-10S16 8 12 2z" />
        </svg>
      ))}
    </div>
  </div>
</div>

        {/* Description */}
       <p className="text-justify w-4/5 max-w-3xl mx-auto text-base sm:text-lg md:text-xl lg:text-2xl text-blue-900 font-medium tracking-wide leading-relaxed md:leading-loose mt-12">
  At <span className="font-extrabold text-blue-700">Tech Verse</span>, we believe in empowering men collaboration. 
  Our platform brings together bright minds from around the world to share ideas, explore emerging technologies, 
  and transform creative visions into impactful realities. Join us as we build a vibrant community where{" "}
  <span className="font-semibold text-blue-600">technology meets imagination</span>.
</p>

      </section>

      {/* ✅ FEATURES SECTION */}
      <section className="container mx-auto px-4 py-20 ">
        <h2 className="text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-12 mt-6 tracking-tight leading-tight drop-shadow-lg bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
          What We Offer
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-8 mt-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return <FeatureCard key={index} feature={feature} />;
          })}
        </div>
      </section>

      {/* ✅ CTA SECTION */}
      <section className="py-20 bg-gradient-to-br from-blue-500 to-cyan-400 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Ready to Build the Future?
            </h2>
            <p className="text-xl text-white/90">
              Don't miss this opportunity to showcase your skills, learn from
              the best, and win amazing prizes!
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2 hover:scale-105 transition-transform"
                onClick={() => setIsDialogOpen(true)}
              >
                Get started today
              </Button>
            </div>
          </div>
        </div>
      </section>
       {/* Enquiry Dialog */}
      <EnquiryDialog open={isDialogOpen} onOpenChange={handleDialogClose} />
      <FloatingSocials />
      {isTransitioning && ReactDOM.createPortal(<CodeCrafterTransition />, document.body)}
    </div>
  );
};

export default Home;

