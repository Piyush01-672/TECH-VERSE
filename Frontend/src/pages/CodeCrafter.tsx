import { useState, useRef } from "react";
import { BookOpen, CalendarHeart, Download, Info, UserPlus } from "lucide-react";
import CountdownTimer from "../components/CountdownTimer";
import TeamRegistrationForm from "../components/TeamRegistrationForm";
import EventHighlights from "../components/EventHighlights";

const CodeCrafter = () => {
  const [activeTab, setActiveTab] = useState("about");
  const formSectionRef = useRef<HTMLElement>(null);

  return (
    <div className="min-h-screen pt-10 bg-gradient-to-br from-[#252D6F]/10 to-[#4676E6]/10 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-[4.75rem] pb-8 md:py-20 bg-gradient-to-br from-[#252D6F] to-[#4676E6] text-white overflow-hidden">
        {/* Floating Abstract Shapes */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-16 w-10 h-10 bg-[#4676E6]/70 rounded-full animate-bounce-slow blur-md"></div>
          <div className="absolute top-36 right-12 w-6 h-6 bg-[#FFD54F]/80 rounded-full animate-pulse blur-md"></div>
          <div className="absolute bottom-16 left-1/4 w-20 h-20 border-4 border-white/30 rounded-full animate-spin-slow"></div>
          <div className="absolute top-1/2 right-40 w-16 h-8 bg-[#B16FFF]/70 rounded-3xl animate-bounce-x blur-md"></div>
          <div className="absolute top-16 md:top-14 right-2 w-5 h-5 bg-[#F56060]/80 rounded-full animate-bounce"></div>
          <div className="absolute bottom-8 left-8 w-5 h-5 bg-[#36C2A3]/70 rounded-full animate-bounce"></div>
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-4xl sm:text-6xl font-extrabold leading-[1.1] tracking-tight mb-4 bg-gradient-to-r from-[#FFD54F] via-white to-[#4676E6] bg-clip-text text-transparent drop-shadow-xl animate-fade-in-up">
                CODECRAFTER 3.0
              </h1>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Hackathon 2026
              </h2>
              <p className="text-lg md:text-xl text-white/90 max-w-xl font-medium leading-relaxed mb-8 animate-fade-in">
                Unleash your coding potential and build something extraordinary.
                24 hours. Infinite creativity. One epic build.
              </p>

              {/* Timer Card */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 sm:p-8 max-w-md border border-white/20 shadow-2xl hover:scale-[1.02] transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-2 h-6 bg-[#FFD54F] rounded-full inline-block"></span>
                  Registration Closes In:
                </h3>

                <CountdownTimer targetDate={new Date("2026-04-15T00:00:00")} />

                <button
                  onClick={() => {
                    setActiveTab("register");
                    if (formSectionRef.current) {
                      const navbarHeight = 120; 
                      const elementTop =
                        formSectionRef.current.getBoundingClientRect().top + window.pageYOffset;
                      window.scrollTo({
                        top: elementTop + navbarHeight,
                        behavior: "smooth",
                      });
                    }
                  }}
                  className="w-full mt-8 bg-gradient-to-r from-[#FFD54F] to-[#F56060] hover:opacity-90 text-black font-bold py-3.5 rounded-xl shadow-lg transition-all transform hover:-translate-y-1 uppercase tracking-wider text-sm"
                >
                  Register Now
                </button>
              </div>
            </div>

            {/* Right Highlights Card */}
            <EventHighlights />
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section ref={formSectionRef} className="py-12 md:py-20 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 flex justify-center pointer-events-none">
            <div className="w-[800px] h-[800px] bg-[#4676E6]/10 blur-[120px] rounded-full"></div>
          </div>
          <div className="absolute top-32 left-1/4 w-72 h-72 bg-[#4676E6]/10 blur-3xl rounded-full"></div>
          <div className="absolute bottom-32 right-1/4 w-72 h-72 bg-[#252D6F]/10 blur-3xl rounded-full"></div>
        </div>
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Internal Navbar / Tabs */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-16 max-w-5xl mx-auto relative z-10 w-full px-4">
            {[
              { id: 'rules', label: 'RULES', icon: BookOpen },
              { id: 'schedules', label: 'SCHEDULES', icon: CalendarHeart },
              { id: 'about', label: 'ABOUT', icon: Info },
              { id: 'register', label: 'REGISTER', icon: UserPlus }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-3 px-6 md:px-10 py-4 rounded-2xl font-bold tracking-widest transition-all duration-500 shadow-md transform 
                  ${isActive
                      ? 'bg-gradient-to-br from-[#252D6F] to-[#4676E6] text-white scale-110 -translate-y-2 shadow-xl shadow-[#4676E6]/40 ring-2 ring-white/50 z-20'
                      : 'bg-white/60 backdrop-blur-xl shadow-sm hover:shadow-md text-[#252D6F] hover:bg-white hover:scale-105 hover:-translate-y-1 hover:shadow-lg border border-[#4676E6]/20'
                    }`}
                >
                  <Icon size={isActive ? 22 : 18} className={`transition-all duration-300 ${isActive ? 'text-[#FFD54F]' : 'text-[#4676E6]'}`} />
                  <span>{tab.label}</span>
                  {isActive && (
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#FFD54F] rounded-full animate-fade-in-up"></span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="relative bg-white/70 backdrop-blur-2xl border border-white/40 shadow-[0_20px_60px_rgba(37,45,111,0.2)] rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl overflow-hidden min-h-[400px]">
            {/* subtle glow accent */}
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-[#4676E6]/10 blur-3xl rounded-full pointer-events-none"></div>
            <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-[#252D6F]/10 blur-3xl rounded-full pointer-events-none"></div>

            {activeTab === 'rules' && (
              <div className="animate-fade-in-up">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-extrabold bg-gradient-to-r from-[#252D6F] to-[#4676E6] bg-clip-text text-transparent uppercase tracking-wide">
                    HACKATHON RULES
                  </h2>
                  <div className="h-[3px] w-16 bg-[#4676E6] mx-auto mt-4 mb-6"></div>
                  <p className="text-muted-foreground font-medium">
                    Please read the following rules carefully before registering for the event.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  {/* General Rules */}
                  <div className="bg-background/50 rounded-xl shadow-sm border border-primary/10 p-8 hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-bold text-[#252D6F] mb-6">
                      General Rules
                    </h3>
                    <ul className="space-y-4 text-muted-foreground font-medium list-disc list-inside">
                      <li>Teams must consist of 2-4 members.</li>
                      <li>All team members should be enrolled in an accredited educational institution.</li>
                      <li>Projects must be started from scratch during the hackathon.</li>
                      <li>Use of open-source libraries and frameworks is allowed.</li>
                      <li>Submissions must include source code and documentation.</li>
                    </ul>
                  </div>

                  {/* Judging Criteria */}
                  <div className="bg-background/50 rounded-xl shadow-sm border border-primary/10 p-8 hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-bold text-[#252D6F] mb-6">
                      Judging Criteria
                    </h3>
                    <ul className="space-y-4 text-muted-foreground font-medium list-none">
                      <li><span className="font-bold text-[#4676E6]">30%</span> Innovation and Creativity</li>
                      <li><span className="font-bold text-[#4676E6]">25%</span> Technical Complexity</li>
                      <li><span className="font-bold text-[#4676E6]">20%</span> Practicality and Impact</li>
                      <li><span className="font-bold text-[#4676E6]">15%</span> Presentation Quality</li>
                      <li><span className="font-bold text-[#4676E6]">10%</span> User Experience</li>
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-br from-[#252D6F] to-[#4676E6] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-md">
                    <Download size={18} />
                    Download Rule Book
                  </button>
                  <button className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-br from-[#252D6F] to-[#4676E6] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-md">
                    <Download size={18} />
                    Download Problem Statements
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'schedules' && (
              <div className="animate-fade-in-up">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-extrabold bg-gradient-to-r from-[#252D6F] to-[#4676E6] bg-clip-text text-transparent uppercase tracking-wide">
                    EVENT SCHEDULE
                  </h2>
                  <div className="h-[3px] w-16 bg-[#4676E6] mx-auto mt-4 mb-6"></div>
                  <p className="text-muted-foreground font-medium">
                    Stay updated with the hackathon timeline.
                  </p>
                </div>

                <div className="max-w-3xl mx-auto space-y-4">
                  <div className="flex gap-4 items-start p-5 rounded-xl bg-background/50 border border-primary/10 hover:shadow-lg transition-all hover:-translate-y-1 hover:border-[#4676E6]/30">
                    <div className="flex-shrink-0 w-24 font-bold text-[#4676E6] text-lg">09:00 AM</div>
                    <div>
                      <h4 className="font-bold text-foreground text-lg">Registration & Check-in</h4>
                      <p className="text-muted-foreground mt-1">Arrive at the venue and get your team badges.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start p-5 rounded-xl bg-background/50 border border-primary/10 hover:shadow-lg transition-all hover:-translate-y-1 hover:border-[#4676E6]/30">
                    <div className="flex-shrink-0 w-24 font-bold text-[#4676E6] text-lg">10:30 AM</div>
                    <div>
                      <h4 className="font-bold text-foreground text-lg">Opening Ceremony</h4>
                      <p className="text-muted-foreground mt-1">Welcome speech, rules briefing, and theme announcement.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start p-5 rounded-xl bg-background/50 border border-primary/10 hover:shadow-lg transition-all hover:-translate-y-1 hover:border-[#4676E6]/30">
                    <div className="flex-shrink-0 w-24 font-bold text-[#4676E6] text-lg">11:30 AM</div>
                    <div>
                      <h4 className="font-bold text-foreground text-lg">Hacking Begins</h4>
                      <p className="text-muted-foreground mt-1">Start working on your amazing projects!</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start p-5 rounded-xl bg-background/50 border border-primary/10 hover:shadow-lg transition-all hover:-translate-y-1 hover:border-[#4676E6]/30">
                    <div className="flex-shrink-0 w-24 font-bold text-[#4676E6] text-lg">01:00 PM</div>
                    <div>
                      <h4 className="font-bold text-foreground text-lg">Lunch Break</h4>
                      <p className="text-muted-foreground mt-1">Refuel and network with other participants.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start p-5 rounded-xl bg-background/50 border border-primary/10 hover:shadow-lg transition-all hover:-translate-y-1 hover:border-[#4676E6]/30">
                    <div className="flex-shrink-0 w-24 font-bold text-[#4676E6] text-lg">... ongoing</div>
                    <div>
                      <h4 className="font-bold text-foreground text-lg">24-Hour Hacking</h4>
                      <p className="text-muted-foreground mt-1">Mentorship sessions and mini-games will run concurrently.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'about' && (
              <div className="animate-fade-in-up">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-extrabold bg-gradient-to-r from-[#252D6F] to-[#4676E6] bg-clip-text text-transparent uppercase tracking-wide">
                    ABOUT CODE CRAFTER
                  </h2>
                  <div className="h-[3px] w-16 bg-[#4676E6] mx-auto mt-4 mb-6"></div>
                </div>

                <div className="prose prose-lg mx-auto text-muted-foreground text-center max-w-3xl leading-relaxed">
                  <p className="mb-6">
                    <strong className="text-foreground">Code Crafter 3.0</strong> is a premier 24-hour hackathon designed to bring together the brightest minds in technology, design, and business. Our goal is to foster innovation, encourage collaboration, and provide a platform for students to build real-world solutions.
                  </p>
                  <p className="mb-6">
                    Whether you are a seasoned developer, a creative designer, or an aspiring entrepreneur, Code Crafter offers an unparalleled opportunity to learn, network, and showcase your skills.
                  </p>
                  <p>
                    Join us for an unforgettable experience filled with workshops, mentorship, fun activities, and incredible prizes!
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'register' && (
              <TeamRegistrationForm />
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CodeCrafter;
