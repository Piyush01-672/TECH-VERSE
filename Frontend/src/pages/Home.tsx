import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-bg.jpg";
import { Typewriter } from "react-simple-typewriter";
import { Code, Trophy, Users, Sparkles } from "lucide-react";
import TechverseLogo from "@/assets/techverse-logo.jpg";
import { Leaf } from "lucide-react";
import UniversityLogo from "@/assets/univeee-logo.png";
import SoetLogo from "@/assets/soet-logo.png";
import { EnquiryDialog } from "@/components/EnquiryDialog";

const Home = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDialogOpen(true);
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, []);

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
      title: "Innovation Projects",
      description:
        "Work on real-world projects and bring your innovative ideas to life.",
    },
  ];
  return (
    <div className="min-h-screen">
      {/* ✅ HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
        <div
          className="absolute inset-0 z-0 brightness-[0.8] contrast-[1.2]"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black/90" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center space-y-10 animate-fade-in-up">
            {/* Edition Badge */}
            <div className="inline-block px-6 py-2 bg-secondary/20 backdrop-blur-sm rounded-full border border-secondary/30">
              <span className="text-secondary font-semibold">Since 2025</span>
            </div>

            
            <h1 className="text-6xl md:text-8xl font-bold font-space bg-gradient-to-r from-[#6EE7B7] via-[#3B82F6] to-[#9333EA] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(147,51,234,0.6)]">
              TechVerse
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl max-w-3xl mx-auto bg-gradient-to-r from-[#93C5FD] via-[#E0F2FE] to-[#C7D2FE] bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(59,130,246,0.4)]">
              The ultimate tech club
              <Typewriter
                words={[
                  " that transform Ideas into Reality.",
                  ". Join the Ultimate Community Experience.",
                ]}
                loop={true}
                cursor
                cursorStyle="|"
                typeSpeed={90}
                deleteSpeed={60}
                delaySpeed={1500}
              />
            </p>

            {/* Date & Location */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-white/90 mt-6">
              <div className="flex items-center gap-2"></div>
              <div className="flex items-center gap-2 mr-10">
                <MapPin size={20} />
                <span className="font-medium">CT University, Punjab</span>
              </div>
            </div>

            {/* Buttons with hover glow */}
            <div className="flex flex-wrap gap-6 justify-center pt-8">
              <Button
                size="lg"
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-10 py-6 text-lg shadow-lg shadow-secondary/40 hover:shadow-[0_0_25px_rgba(59,130,246,0.7)] transition-all duration-300"
              >
                Join now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 hover:bg-white/20 text-white border-white/30 px-10 py-6 text-lg backdrop-blur-sm hover:shadow-[0_0_25px_rgba(255,255,255,0.6)] transition-all duration-300"
              >
                <Link to="/about">About us</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Floating Circles */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-secondary/20 rounded-full blur-xl animate-float" />
        <div
          className="absolute bottom-20 right-10 w-32 h-32 bg-accent/20 rounded-full blur-xl animate-float"
          style={{ animationDelay: "2s" }}
        />
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
          className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 animate-sway"
          style={{ transform: `rotate(${15 + i * 2}deg)` }}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2C8 8 2 12 2 12s6 4 10 10c4-6 10-10 10-10S16 8 12 2z" />
        </svg>
      ))}
    </div>

    {/* Left Logo */}
    <div className="w-20 h-20 sm:w-34 sm:h-34 md:w-40 md:h-40 rounded-full overflow-hidden flex justify-center items-center bg-transparent drop-shadow-md mx-2 sm:mx-4">
      <img
        src={UniversityLogo}
        alt="Left Logo"
        className="w-full h-full object-contain"
      />
    </div>

    {/* Center Techverse logo */}
    <div className="w-28 h-28 sm:w-40 sm:h-40 md:w-64 md:h-64 rounded-full overflow-hidden flex justify-center items-center bg-transparent drop-shadow-xl mx-2 sm:mx-4">
      <img
        src={TechverseLogo}
        alt="Techverse Logo"
        className="w-full h-full object-contain"
      />
    </div>

    {/* Right Logo */}
    <div className="w-20 h-20 sm:w-44 sm:h-44 md:w-48 md:h-48 rounded-full overflow-hidden flex justify-center items-center bg-transparent drop-shadow-md mx-2 sm:mx-1">
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
          className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 animate-sway"
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
        <p className="text-center max-w-3xl mx-auto text-base sm:text-lg md:text-xl lg:text-2xl text-blue-900 font-medium tracking-wide leading-relaxed md:leading-loose mt-12">
          At <span className="font-extrabold text-blue-700">Tech Verse</span>,
          we believe in empowering innovation through collaboration. Our
          platform brings together bright minds from around the world to share
          ideas, explore emerging technologies, and transform creative visions
          into impactful realities. Join us as we build a vibrant community
          where{" "}
          <span className="font-semibold text-blue-600">
            technology meets imagination
          </span>
          .
        </p>
      </section>

      {/* ✅ FEATURES SECTION */}
      <section className="container mx-auto px-4 py-20 ">
        <h2 className="text-8xl md:text-6xl lg:text-7xl font-extrabold text-center mb-12 -mt-10 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 bg-clip-text text-transparent tracking-wider ">
          What We Offer
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8 mt-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.6)] hover:-translate-y-2 border border-blue-500/20"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
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
              >
                Get started today
              </Button>
            </div>
          </div>
        </div>
      </section>
       {/* Enquiry Dialog */}
      <EnquiryDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
};

export default Home;
