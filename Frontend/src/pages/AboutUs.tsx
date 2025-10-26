import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Linkedin, Mail, Github } from "lucide-react";
import Logo from "@/assets/techverse-logo.jpg";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AboutUs = () => {
  const [aboutUs, setAboutUs] = useState<any[]>([]);
  const [mentors, setMentors] = useState<any[]>([]); // ✅ moved inside component
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
  const hoverTimers = new Map<number, ReturnType<typeof setTimeout>>();

  // ✅ Fetch Team Members
  useEffect(() => {
    fetch(`${BACKEND_URL}/AboutUs`)
      .then((res) => res.json())
      .then((data) => {
        const formattedData = Array.isArray(data) ? data : [data];
        setAboutUs(formattedData);
      })
      .catch((error) => console.error("Error fetching team members:", error));
  }, []);

  // ✅ Fetch Mentors
  useEffect(() => {
    fetch(`${BACKEND_URL}/mentors`)
      .then((res) => res.json())
      .then((data) => {
        const formattedData = Array.isArray(data) ? data : [data];
        setMentors(formattedData);
      })
      .catch((err) => console.error("Error fetching mentors:", err));
  }, []);

  const handleMouseEnter = (index: number) => {
    const timer = setTimeout(() => {
      setFlippedIndex(index);
    }, 1800);
    hoverTimers.set(index, timer);
  };

  const handleMouseLeave = (index: number) => {
    const timer = hoverTimers.get(index);
    if (timer) clearTimeout(timer);
    hoverTimers.delete(index);
    setFlippedIndex(null);
  };

  return (
    <div className="min-h-screen pt-20 bg-white">
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-br from-[#252D6F] to-[#4676E6] text-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-16 w-10 h-10 bg-[#4676E6]/70 rounded-full animate-bounce-slow blur-md"></div>
          <div className="absolute top-36 right-12 w-6 h-6 bg-[#FFD54F]/80 rounded-full animate-pulse blur-md"></div>
          <div className="absolute top-1/2 right-40 w-16 h-8 bg-[#B16FFF]/70 rounded-3xl animate-bounce-x blur-md"></div>
          <div className="absolute top-8 right-2 w-5 h-5 bg-[#F56060]/80 rounded-full animate-bounce"></div>
          <div className="absolute bottom-8 left-8 w-5 h-5 bg-[#36C2A3]/70 rounded-full animate-bounce"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <span className="inline-block px-4 py-2 bg-white/10 rounded-full text-sm font-medium backdrop-blur-md border border-white/20 shadow-sm mb-6 tracking-widest animate-fade-in">
            Our Team
          </span>
          <h1 className="text-7xl font-extrabold pb-3 mb-8 bg-gradient-to-r from-[#FFD54F] via-white to-[#4676E6] bg-clip-text text-transparent drop-shadow-xl">
            About Us
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Meet our{" "}
            <span className="font-semibold text-[#FFD54F]">passionate team</span>{" "}
            who make{" "}
            <span className="font-semibold text-[#D746FF]">TechVerse</span>{" "}
            thrive with innovation and creativity.
          </p>
        </div>
      </section>

      {/* TechVerse Club Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center mb-12">
          <h2 className="text-6xl font-extrabold text-gray-800">
            About TechVerse Club
          </h2>
        </div>

        <div className="container mx-auto px-7 flex flex-col md:flex-row items-center justify-center gap-16">
          {/* Logo Section */}
          <div className="relative w-64 h-64 flex-shrink-0 flex items-center justify-center">
            {/* Thin blue outline behind logo */}
            <div className="absolute inset-0 rounded-2xl border-[1.5px] border-blue-500/70 shadow-[0_6px_20px_rgba(0,0,0,0.15)]"></div>

            {/* Logo */}
            <img
              src={Logo}
              alt="TechVerse Club Logo"
              className="w-full h-full object-cover rounded-2xl relative z-10 border border-blue-400 shadow-lg"
            />
          </div>

          {/* Description */}
          <div className="md:w-2/3 text-center md:text-left -mt-4">
            <p className="text-lg text-gray-600 leading-relaxed">
              TechVerse Club is a vibrant community of tech enthusiasts,
              innovators, and creators. Our mission is to foster collaboration,
              inspire creativity, and empower individuals to explore
              cutting-edge technologies. Join us to be part of an unforgettable
              journey in shaping the future of TechVerse! We believe in
              empowering innovation through collaboration — bringing together
              bright minds to share ideas, explore emerging technologies, and
              transform creative visions into impactful realities.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-10 -mt-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              TechVerse Members
            </h2>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-500">
              Dedicated leaders working tirelessly to create an unforgettable
              experience. Their passion, skill, and teamwork drive TechVerse
              forward with excellence.
            </p>
          </div>

         {/* Cards Grid */}
<div className="flex flex-col items-center gap-14">
  {/* Row 1 → first 3 cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-40 gap-y-12 justify-items-center">
    {aboutUs.slice(0, 3).map((member, index) => (
      <div
        key={member._id || index}
        className="relative w-64 h-64 [perspective:1000px]"
        onMouseEnter={() => handleMouseEnter(index)}
        onMouseLeave={() => handleMouseLeave(index)}
      >
        <div
          className={`relative w-full h-full transition-transform duration-[8000ms] ease-[cubic-bezier(0.45,0.05,0.55,0.95)] [transform-style:preserve-3d] ${
            flippedIndex === index ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          {/* Front Side */}
          <Card className="absolute inset-0 flex flex-col justify-center items-center p-6 border border-blue-200 shadow-lg rounded-xl bg-white [backface-visibility:hidden] transition-transform duration-500 hover:scale-105 hover:shadow-blue-200/70">
            <div className="w-24 h-24 mb-4 rounded-full overflow-hidden border-4 border-blue-500 shadow-md">
              <img
                src={member.img_url || "/default-profile.jpg"}
                alt={member.Name}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1 text-center leading-tight">
              {member.Name}
            </h3>
            <p className="text-blue-600 font-semibold text-sm text-center mb-2">
              {member.Designation}
            </p>
          </Card>

          {/* Back Side */}
          <Card className="absolute inset-0 p-6 flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 to-indigo-500 text-white border-none rounded-xl [transform:rotateY(180deg)] [backface-visibility:hidden]">
            <p className="text-sm leading-relaxed px-2 mb-4 text-center">
              {member.Description}
            </p>
            <span className="text-xs opacity-80">
              Hover away to flip back ↩️
            </span>
          </Card>
        </div>
      </div>
    ))}
  </div>

  {/* Row 2 → next 5 cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-16 gap-y-12 justify-items-center">
    {aboutUs.slice(3).map((member, index) => {
      const actualIndex = index + 3; // fix index for flipping
      return (
        <div
          key={member._id || actualIndex}
          className="relative w-64 h-64 [perspective:1000px]"
          onMouseEnter={() => handleMouseEnter(actualIndex)}
          onMouseLeave={() => handleMouseLeave(actualIndex)}
        >
          <div
            className={`relative w-full h-full transition-transform duration-[8000ms] ease-[cubic-bezier(0.45,0.05,0.55,0.95)] [transform-style:preserve-3d] ${
              flippedIndex === actualIndex ? "[transform:rotateY(180deg)]" : ""
            }`}
          >
            {/* Front Side */}
            <Card className="absolute inset-0 flex flex-col justify-center items-center p-6 border border-blue-200 shadow-lg rounded-xl bg-white [backface-visibility:hidden] transition-transform duration-500 hover:scale-105 hover:shadow-blue-200/70">
              <div className="w-24 h-24 mb-4 rounded-full overflow-hidden border-4 border-blue-500 shadow-md">
                <img
                  src={member.img_url || "/default-profile.jpg"}
                  alt={member.Name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1 text-center leading-tight">
                {member.Name}
              </h3>
              <p className="text-blue-600 font-semibold text-sm text-center mb-1">
                {member.Designation}
              </p>
            </Card>

            {/* Back Side */}
            <Card className="absolute inset-0 p-6 flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 to-indigo-500 text-white border-none rounded-xl [transform:rotateY(180deg)] [backface-visibility:hidden]">
              <p className="text-sm leading-relaxed px-2 mb-4 text-center">
                {member.Description}
              </p>
              <span className="text-xs opacity-80">
                Hover away to flip back ↩️
              </span>
            </Card>
          </div>
        </div>
      );
    })}
  </div>
</div>
          </div>

      </section>


   {/* Mentors Section */}
<section className="py-20 bg-white">
  <div className="container mx-auto px-4 text-center mb-16">
    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
      Mentors
    </h2>
    <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-500">
      Guiding us with their wisdom, expertise, and constant motivation.
    </p>
  </div>

  {/* Mentor Cards */}
  <div className="flex flex-col items-center gap-14">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-32 gap-y-12 justify-items-center">
      {mentors.map((member, index) => (
        <div
          key={member._id || index}
          className="relative w-64 h-64 [perspective:1000px]"
          onMouseEnter={() => handleMouseEnter(index + 100)} // offset to avoid clash
          onMouseLeave={() => handleMouseLeave(index + 100)}
        >
          <div
            className={`relative w-full h-full transition-transform duration-[8000ms] ease-[cubic-bezier(0.45,0.05,0.55,0.95)] [transform-style:preserve-3d] ${
              flippedIndex === index + 100 ? "[transform:rotateY(180deg)]" : ""
            }`}
          >
            {/* Front Side */}
            <Card className="absolute inset-0 flex flex-col justify-center items-center p-6 border border-blue-200 shadow-lg rounded-xl bg-white [backface-visibility:hidden] transition-transform duration-500 hover:scale-105 hover:shadow-blue-200/70">
              <div className="w-24 h-24 mb-4 rounded-full overflow-hidden border-4 border-blue-500 shadow-md">
                <img
                  src={member.img_url || "/default-profile.jpg"}
                  alt={member.Name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1 text-center leading-tight">
                {member.Name}
              </h3>
              <p className="text-blue-600 font-semibold text-sm text-center mb-1">
                {member.Designation}
              </p>
            </Card>

            {/* Back Side */}
            <Card className="absolute inset-0 p-6 flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 to-indigo-500 text-white border-none rounded-xl [transform:rotateY(180deg)] [backface-visibility:hidden]">
              <p className="text-sm leading-relaxed px-2 mb-4 text-center">
                {member.Description}
              </p>
              <span className="text-xs opacity-80">
                Hover away to flip back ↩️
              </span>
            </Card>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>


      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-500 to-cyan-400 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-6xl font-bold text-white mb-6">
            Want to Join Our Team?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            We're always looking for passionate individuals to help organize
            future events.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="gap-2 hover:scale-105 transition-transform"
          >
            Get in Touch
          </Button>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
