import { useState, useEffect,useRef } from "react";
import { BookOpen, CalendarHeart, Info, UserPlus } from "lucide-react";
// import { registerTeam } from "../Services/api";

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

const TeamRegistrationForm = () => {
  const [activeTab, setActiveTab] = useState("about");
  const [formData, setFormData] = useState({
    teamName: "",
    hackathonExperience: "",
    teamSize: 2,
    contactNumber: "",
    accommodationRequired: "No",
    accommodationDetails: {
      boysCount: 0,
      girlsCount: 0,
    },
    participants: [
      { name: "", email: "", gender: "", college: "", program: "" },
      { name: "", email: "", gender: "", college: "", program: "" },
      { name: "", email: "", gender: "", college: "", program: "" },
      { name: "", email: "", gender: "", college: "", program: "" },
    ],
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const formSectionRef = useRef(null);

  useEffect(() => {
    if (error) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [error]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle special case for team size
    if (name === "teamSize") {
      const newSize = Math.min(Math.max(parseInt(value, 10) || 2, 2), 4);
      setFormData(prev => ({ ...prev, teamSize: newSize }));
      return;
    }
    if (name === "accommodationRequired") {
      setFormData(prev => ({
        ...prev,
        accommodationRequired: value,
        accommodationDetails:
          value === "No"
            ? { boysCount: 0, girlsCount: 0 }
            : prev.accommodationDetails,
      }));
      return;
    }
    // Update the form data state
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle accommodation details changes
  const handleAccommodationChange = (field, value) => {
    const numValue = parseInt(value) || 0;
    const validValue = Math.min(Math.max(numValue, 0), formData.teamSize);
    const otherField = field === "boysCount" ? "girlsCount" : "boysCount";
    const otherValue = formData.accommodationDetails[otherField];
    if (validValue + otherValue > formData.teamSize) return;
    setFormData(prev => ({
      ...prev,
      accommodationDetails: {
        ...prev.accommodationDetails,
        [field]: validValue,
      },
    }));
  };

  // Handle participant field changes
  const handleParticipantChange = (index, field, value) => {
    const updatedParticipants = [...formData.participants];
    updatedParticipants[index] = {
      ...updatedParticipants[index],
      [field]: value,
    };
    setFormData(prev => ({
      ...prev,
      participants: updatedParticipants,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Prepare data for submission
      const submissionData = {
        ...formData,
        // Only include participants up to the selected team size
        participants: formData.participants.slice(0, formData.teamSize),
      };
      const emails = submissionData.participants.map((p) => p.email.trim().toLowerCase());
      if (new Set(emails).size !== emails.length) {
        setError("Participants must have unique emails.");
        setLoading(false);
        return;
      }
      console.log("Submitting form data:", submissionData);
      //   await registerTeam(submissionData);
      setSubmitted(true);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
      console.error(
        "Registration failed:",
        err.response?.data?.message || err.message,
      );
    } finally {
      setLoading(false);
    }
  };

  // Reset form to register another team
  const handleReset = () => {
    setFormData({
      teamName: "",
      hackathonExperience: "",
      teamSize: 2,
      contactNumber: "",
      accommodationRequired: "No",
      accommodationDetails: {
        boysCount: 0,
        girlsCount: 0,
      },
      participants: [
        { name: "", email: "", gender: "", college: "", program: "" },
        { name: "", email: "", gender: "", college: "", program: "" },
        { name: "", email: "", gender: "", college: "", program: "" },
        { name: "", email: "", gender: "", college: "", program: "" },
      ],
    });
    setSubmitted(false);
    setError(null);
  };

  // Generate participant form fields based on team size
  const renderParticipantFields = () => {
    const participantFields = [];

    // Only show the number of participants based on team size
    for (let i = 0; i < formData.teamSize; i++) {
      const ordinalSuffix = ["First", "Second", "Third", "Fourth"][i];

      participantFields.push(
        <div key={`participant-${i}`} className="space-y-5">
          {/* Card Title */}
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {ordinalSuffix} Participant
              {i === 0 && (
                <span className="ml-2 text-sm text-[#4676E6] font-medium">
                  (Team Leader)
                </span>
              )}
            </h3>
            <div className="h-[2px] mt-2 bg-gradient-to-r from-[#252D6F] to-[#4676E6] rounded-full w-16"></div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Participant Name *
            </label>
            <input
              type="text"
              name={`participant${i + 1}Name`}
              value={formData.participants[i].name}
              onChange={(e) =>
                handleParticipantChange(i, "name", e.target.value)
              }
              required
              placeholder={`Enter ${ordinalSuffix.toLowerCase()} participant's name`}
              className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-background/60 backdrop-blur-md text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-[#4676E6]/50 focus:border-[#4676E6] focus:outline-none transition-all duration-200"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Participant Email *
            </label>
            <input
              type="email"
              name={`participant${i + 1}Email`}
              value={formData.participants[i].email}
              onChange={(e) =>
                handleParticipantChange(i, "email", e.target.value)
              }
              required
              placeholder={`Enter ${ordinalSuffix.toLowerCase()} participant's email`}
              className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-background/60 backdrop-blur-md text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-[#4676E6]/50 focus:border-[#4676E6] focus:outline-none transition-all duration-200"
            />
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Gender *
            </label>
            <select
              name={`participant${i + 1}Gender`}
              value={formData.participants[i].gender}
              onChange={(e) =>
                handleParticipantChange(i, "gender", e.target.value)
              }
              required
              className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-background/60 backdrop-blur-md text-foreground focus:ring-2 focus:ring-[#4676E6]/50 focus:border-[#4676E6] focus:outline-none transition-all duration-200 appearance-none"
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">College *</label>
            <input
              type="text"
              name="college"
              value={formData.participants[i].college}
              onChange={(e) => handleParticipantChange(i, "college", e.target.value)}
              required
              className="w-full p-3 rounded-xl border border-primary/20 bg-background/60 backdrop-blur-md focus:ring-2 focus:ring-[#4676E6]/50 focus:border-[#4676E6] focus:outline-none transition-all duration-200"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Program *</label>
            <input
              type="text"
              name="program"
              value={formData.participants[i].program}
              onChange={(e) => handleParticipantChange(i, "program", e.target.value)}
              required
              className="w-full p-3 rounded-xl border border-primary/20 bg-background/60 backdrop-blur-md focus:ring-2 focus:ring-[#4676E6]/50 focus:border-[#4676E6] focus:outline-none transition-all duration-200"
            />
          </div>
        </div>,
      );
    }

    return participantFields;
  };

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
        <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-extrabold leading-[1.1] tracking-tight mb-4 bg-gradient-to-r from-[#FFD54F] via-white to-[#4676E6] bg-clip-text text-transparent drop-shadow-xl animate-fade-in-up">
          CODECRAFTER 3.0
        </h1>
        {/* <div className="absolute -top-10 -left-10 w-64 h-64 bg-[#FFD54F]/20 blur-3xl rounded-full pointer-events-none"></div> */}

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

          <CountdownTimer targetDate={new Date("2026-04-23T00:00:00")} />

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
      <div className="flex lg:justify-end">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 sm:p-10 border border-white/20 shadow-2xl max-w-md w-full hover:scale-[1.02] transition-all duration-300">
          <h3 className="text-2xl font-bold text-white mb-8 text-center">
            Event Highlights
          </h3>

          <ul className="space-y-5">
            {[
              "24-hour intense coding challenge",
              "100k+ INR in prizes",
              "Networking with industry experts",
              "Workshops and mentorship",
              "Opportunity to showcase your skills"
            ].map((highlight, idx) => (
              <li key={idx} className="flex items-center text-white/90 font-medium text-[15.5px]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFD54F] shadow-md mr-4 flex-shrink-0 animate-pulse"></span>
                {highlight}
              </li>
            ))}
          </ul>
        </div>
      </div>

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
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Download Rule Book
                  </button>
                  <button className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-br from-[#252D6F] to-[#4676E6] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-md">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
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
              <div className="animate-fade-in-up">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#252D6F] to-[#4676E6] flex items-center justify-center text-white text-3xl mb-6 shadow-lg">
                      ✓
                    </div>

                    <h3 className="text-2xl font-bold text-foreground mb-3">
                      Registration Successful!
                    </h3>

                    <p className="text-muted-foreground mb-6">
                      Your team has been registered. We’ll reach out soon.
                    </p>

                    <button
                      onClick={handleReset}
                      className="px-8 py-3 rounded-lg bg-gradient-to-br from-[#252D6F] to-[#4676E6] text-white font-semibold hover:opacity-90 transition"
                    >
                      Register Another Team
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8 md:space-y-10">
                    {error && (
                      <div className="p-4 rounded-lg border border-red-500/30 bg-red-500/10 text-red-500 text-sm">
                        {error}
                      </div>
                    )}

                    {/* Section Block */}
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-foreground flex items-center gap-3 pb-4">
                        <span className="w-2 h-8 bg-gradient-to-b from-[#252D6F] to-[#4676E6] rounded-full"></span>
                        Team Information
                      </h2>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Team Name *
                        </label>
                        <input
                          type="text"
                          name="teamName"
                          value={formData.teamName}
                          onChange={handleChange}
                          required
                          className="w-full p-3 rounded-xl border border-primary/20 bg-background/60 backdrop-blur-md focus:ring-2 focus:ring-[#4676E6]/50 focus:border-[#4676E6] focus:outline-none transition-all duration-200"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Team Size *
                          </label>
                          <select
                            name="teamSize"
                            value={formData.teamSize}
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg border border-primary/20 bg-background focus:ring-2 focus:ring-primary/40"
                          >
                            <option value="2">2 Members</option>
                            <option value="3">3 Members</option>
                            <option value="4">4 Members</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Contact Number *
                          </label>
                          <input
                            type="tel"
                            pattern="[0-9]{10}"
                            inputMode="numeric"
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={handleChange}
                            required
                            maxLength={10}
                            title="Please enter a 10-digit phone number"
                            className="w-full p-3 rounded-xl border border-primary/20 bg-background/60 backdrop-blur-md focus:ring-2 focus:ring-[#4676E6]/50 focus:border-[#4676E6] focus:outline-none transition-all duration-200"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Participants */}
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-foreground flex items-center gap-3 pb-4">
                        <span className="w-2 h-8 bg-gradient-to-b from-[#252D6F] to-[#4676E6] rounded-full"></span>
                        Team Members ({formData.teamSize})
                      </h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        {renderParticipantFields().map((field, index) => (
                          <div
                            key={index}
                            className="relative p-4 sm:p-6 rounded-2xl border border-primary/20 bg-background/70 backdrop-blur-md shadow-md hover:shadow-xl hover:-translate-y-1 hover:border-[#4676E6]/40 transition-all duration-300"
                          >
                            {field}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Accommodation */}
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-foreground flex items-center gap-3 pb-4">
                        <span className="w-2 h-8 bg-gradient-to-b from-[#252D6F] to-[#4676E6] rounded-full"></span>
                        Accommodation
                      </h2>

                      <select
                        name="accommodationRequired"
                        value={formData.accommodationRequired}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg border border-primary/20 bg-background focus:ring-2 focus:ring-primary/40"
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>

                      {formData.accommodationRequired === "Yes" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                              Boys Requiring Accommodation
                            </label>
                            <input
                              type="number"
                              min="0"
                              max={formData.teamSize}
                              value={formData.accommodationDetails.boysCount}
                              onChange={(e) =>
                                handleAccommodationChange(
                                  "boysCount",
                                  e.target.value,
                                )
                              }
                              disabled={formData.accommodationRequired !== "Yes"}
                              placeholder="Boys"
                              className="w-full p-3 rounded-xl border border-primary/20 bg-background/60 backdrop-blur-md focus:ring-2 focus:ring-[#4676E6]/50 focus:border-[#4676E6] focus:outline-none transition-all duration-200"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                              Girls Requiring Accommodation
                            </label>
                            <input
                              type="number"
                              min="0"
                              max={formData.teamSize}
                              value={formData.accommodationDetails.girlsCount}
                              onChange={(e) =>
                                handleAccommodationChange(
                                  "girlsCount",
                                  e.target.value,
                                )
                              }
                              disabled={formData.accommodationRequired !== "Yes"}
                              placeholder="Girls"
                              className="w-full p-3 rounded-xl border border-primary/20 bg-background/60 backdrop-blur-md focus:ring-2 focus:ring-[#4676E6]/50 focus:border-[#4676E6] focus:outline-none transition-all duration-200"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Submit */}
                    <div className="pt-6">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#252D6F] to-[#4676E6] text-white font-semibold text-lg shadow-lg hover:shadow-2xl hover:scale-[1.02] active:scale-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? "Submitting..." : "Register Team"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
export default TeamRegistrationForm;
