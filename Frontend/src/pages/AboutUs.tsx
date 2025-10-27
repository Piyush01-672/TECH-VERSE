import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Linkedin, Github, Mail } from "lucide-react";
import Logo from "@/assets/techverse-logo.jpg";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AboutUs = () => {
  const [aboutUs, setAboutUs] = useState<any[]>([]);
  const [mentors, setMentors] = useState<any[]>([]); // ✅ moved inside component
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
  const hoverTimers = new Map<number, ReturnType<typeof setTimeout>>();
  const [leaders, setLeaders] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${BACKEND_URL}/leaders`)
      .then((res) => res.json())
      .then((data) => {
        const formattedData = Array.isArray(data) ? data : [data];
        setLeaders(formattedData);
      })
      .catch((err) => console.error("Error fetching leaders:", err));
  }, []);

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
      
  <section className="relative py-64 text-white overflow-hidden">
  {/* Background Image */}
  <div
    className="absolute inset-0 bg-cover bg-center brightness-80 blur-[1px]"
    style={{
      backgroundImage:
        "url('https://res.cloudinary.com/diijn4esl/image/upload/v1761583379/IMG_0345_grp_photo_mnt7uf.jpg')",
    }}
  ></div>

  {/* Content */}
  <div className="container mx-auto px-4 text-center relative z-10">
  <h1 className="text-7xl font-extrabold pb-3 mb-8 -mt-8 bg-gradient-to-r from-[#FFD54F] via-white to-[#4676E6] bg-clip-text text-transparent drop-shadow-xl">
    About Us
  </h1>

  <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
    Meet our{" "}
    <span className="font-semibold text-[#FFD54F]">passionate team</span> who
    make <span className="font-semibold text-[#D746FF]">TechVerse</span>{" "}
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
            <div className="absolute inset-0 rounded-full border-[1.5px] border-blue-500/70 shadow-[0_6px_20px_rgba(0,0,0,0.15)]"></div>

            {/* Logo */}
            <img
              src={Logo}
              alt="TechVerse Club Logo"
              className="w-full h-full object-cover rounded-full relative z-10 border border-blue-400 shadow-lg"
            />
          </div>

          {/* Description */}
          <div className="md:w-2/3 text-center md:text-left -mt-4">
            <p className="text-lg text-gray-600 leading-relaxed text-justify">
              TechVerse Club of CT University, under the School of Engineering
              and Technology, is a dynamic community of innovators, developers,
              and tech enthusiasts driven by a shared passion for technology and
              creativity. Guided by the visionary leadership of Prof. Dr. Arvind
              Kumar (Head of School), coordinated by Ms. Mandeep Kaur, and
              supported by Dr. Harinder Pal Singh (Director – IT), the club
              serves as a vibrant platform for students to explore emerging
              technologies, enhance practical skills, and collaborate on
              real-world projects. At TechVerse, we bridge the gap between
              classroom learning and industry innovation, empowering students to
              transform ideas into impactful solutions that shape the
              future of technology.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-10 -mt-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Honorable Authorities
            </h2>
            {/* <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-500">
              Dedicated leaders working tirelessly to create an unforgettable
              experience.
            </p> */}
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
                      flippedIndex === index
                        ? "[transform:rotateY(180deg)]"
                        : ""
                    }`}
                  >
                    {/* Front Side */}
                    <Card className="absolute inset-0 flex flex-col justify-center items-center p-6 border border-blue-200 shadow-lg rounded-xl bg-white [backface-visibility:hidden] transition-transform duration-500 hover:scale-105 hover:shadow-blue-200/70">
                      <div className="w-24 h-24 mb-4 rounded-full overflow-hidden border-4 border-blue-500 shadow-md">
                        <img
                          src={member.img_url || "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/340px-Default_pfp.svg.png"}
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
                        flippedIndex === actualIndex
                          ? "[transform:rotateY(180deg)]"
                          : ""
                      }`}
                    >
                      {/* Front Side */}
                      <Card className="absolute inset-0 flex flex-col justify-center items-center p-6 border border-blue-200 shadow-lg rounded-xl bg-white [backface-visibility:hidden] transition-transform duration-500 hover:scale-105 hover:shadow-blue-200/70">
                        <div className="w-24 h-24 mb-4 rounded-full overflow-hidden border-4 border-blue-500 shadow-md">
                          <img
                            src={member.img_url || "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/340px-Default_pfp.svg.png"}
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
            Mentors(SOET)
          </h2>
          {/* <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-500">
            Guiding us with their wisdom, expertise, and constant motivation.
          </p> */}
        </div>

        {/* Mentor Cards */}
        <div className="flex flex-col items-center gap-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-28 gap-y-12 justify-items-center">
            {mentors.map((member, index) => (
              <div
                key={member._id || index}
                className="relative w-64 h-64 [perspective:1000px]"
                onMouseEnter={() => handleMouseEnter(index + 100)} // offset to avoid clash
                onMouseLeave={() => handleMouseLeave(index + 100)}
              >
                <div
                  className={`relative w-full h-full transition-transform duration-[8000ms] ease-[cubic-bezier(0.45,0.05,0.55,0.95)] [transform-style:preserve-3d] ${
                    flippedIndex === index + 100
                      ? "[transform:rotateY(180deg)]"
                      : ""
                  }`}
                >
                  {/* Front Side */}
                  <Card className="absolute inset-0 flex flex-col justify-center items-center p-6 border border-blue-200 shadow-lg rounded-xl bg-white [backface-visibility:hidden] transition-transform duration-500 hover:scale-105 hover:shadow-blue-200/70">
                    <div className="w-24 h-24 mb-4 rounded-full overflow-hidden border-4 border-blue-500 shadow-md">
                      <img
                        src={member.img_url || "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/340px-Default_pfp.svg.png"}
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

      {/* Leaders */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 -mt-12">
            TechVerse Leaders
          </h2>
          {/* <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-500">
            Meet the passionate leaders who drive TechVerse forward with
            innovation, teamwork, and vision.
          </p> */}
        </div>

        {/* Leaders Cards */}
        <div className="flex flex-col items-center gap-14">
          {/* First 6 Leaders (3 + 3 grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-28 gap-y-12 justify-items-center">
            {leaders.slice(0, 6).map((member, index) => (
              <div
                key={member._id || index}
                className="relative w-64 h-72 [perspective:1000px]"
                onMouseEnter={() => handleMouseEnter(index + 200)}
                onMouseLeave={() => handleMouseLeave(index + 200)}
              >
                <div
                  className={`relative w-full h-full transition-transform duration-[8000ms] ease-[cubic-bezier(0.45,0.05,0.55,0.95)] [transform-style:preserve-3d] ${
                    flippedIndex === index + 200
                      ? "[transform:rotateY(180deg)]"
                      : ""
                  }`}
                >
                  {/* Front Side */}
                  <Card className="absolute inset-0 flex flex-col justify-center items-center p-6 border border-blue-200 shadow-lg rounded-xl bg-white [backface-visibility:hidden] transition-transform duration-500 hover:scale-105 hover:shadow-blue-200/70">
                    <div className="w-24 h-24 mb-4 rounded-full overflow-hidden border-4 border-blue-500 shadow-md">
                      <img
                        src={member.img_url || "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/340px-Default_pfp.svg.png"}
                        alt={member.Name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1 text-center leading-tight">
                      {member.Name}
                    </h3>
                    <p className="text-blue-600 font-semibold text-sm text-center mb-3">
                      {member.Designation}
                    </p>

                    {/* Social Icons */}
                    <div className="flex gap-3 mt-2 gap-x-8">
                      <a
                        href={member.linkedin || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-center w-8 h-8 rounded-md border ${
                          member.linkedin
                            ? "border-blue-500 text-blue-600 hover:bg-blue-100"
                            : "border-gray-300 text-gray-400 cursor-not-allowed"
                        } transition duration-200`}
                      >
                        <Linkedin size={18} />
                      </a>

                      <a
                        href={`mailto:${member.mail || "#"}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-center w-8 h-8 rounded-md border ${
                          member.mail
                            ? "border-blue-500 text-blue-600 hover:bg-blue-100"
                            : "border-gray-300 text-gray-400 cursor-not-allowed"
                        } transition duration-200`}
                      >
                        <Mail size={18} />
                      </a>

                    </div>
                  </Card>

                  {/* Back Side */}
                  <Card className="absolute inset-0 p-6 flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 to-indigo-500 text-white border-none rounded-xl [transform:rotateY(180deg)] [backface-visibility:hidden]">
                    <p className="text-sm leading-relaxed px-2 mb-4 text-center">
                      {member.description}
                    </p>
                  </Card>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight -mb-12 mt-10">
            Event Management Team
          </h2>
          

          {/* Row 3 — Single Centered Card */}
          <div className="flex justify-center mt-16">
            {leaders.slice(6, 7).map((member, index) => (
              <div
                key={member._id || index}
                className="relative w-64 h-64 [perspective:1000px]"
                onMouseEnter={() => handleMouseEnter(index + 300)}
                onMouseLeave={() => handleMouseLeave(index + 300)}
              >
                <div
                  className={`relative w-full h-full transition-transform duration-[8000ms] ease-[cubic-bezier(0.45,0.05,0.55,0.95)] [transform-style:preserve-3d] ${
                    flippedIndex === index + 300
                      ? "[transform:rotateY(180deg)]"
                      : ""
                  }`}
                >
                  {/* Front Side */}
                  <Card className="absolute inset-0 flex flex-col justify-center items-center p-6 border border-blue-200 shadow-lg rounded-xl bg-white [backface-visibility:hidden] transition-transform duration-500 hover:scale-105 hover:shadow-blue-200/70">
                    <div className="w-24 h-24 mb-4 rounded-full overflow-hidden border-4 border-blue-500 shadow-md">
                      <img
                        src={member.img_url || "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/340px-Default_pfp.svg.png"}
                        alt={member.Name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1 text-center leading-tight">
                      {member.Name}
                    </h3>
                    <p className="text-blue-600 font-semibold text-sm text-center mb-3">
                      {member.Designation}
                    </p>
                  </Card>

                  {/* Back Side */}
                  <Card className="absolute inset-0 p-6 flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 to-indigo-500 text-white border-none rounded-xl [transform:rotateY(180deg)] [backface-visibility:hidden]">
                    <p className="text-sm leading-relaxed px-2 mb-4 text-center">
                      {member.description}
                    </p>
                  </Card>
                </div>
              </div>
            ))}
          </div>
          {/* CONNECTOR SECTION (between leader and 4 members) */}
          <div className="relative w-full flex justify-center items-center -mt-10">
            {/* Soft glowing background */}
            <div
              className="absolute top-[40%] left-1/2 -translate-x-1/2 
                  w-[70%] h-[160px] 
                  bg-gradient-to-b from-blue-200/50 to-transparent 
                  rounded-full blur-3xl"
            ></div>

            {/* Hierarchy connection lines */}
            <svg
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-[160px] pointer-events-none"
              viewBox="0 0 800 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* vertical line from leader down */}
              <path
                d="M400 0 L400 80"
                stroke="#3B82F6"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* horizontal connector */}
              <path
                d="M50 80 L750 80"
                stroke="#3B82F6"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* small verticals to each member */}
              <path
                d="M150 80 L150 100"
                stroke="#3B82F6"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M316 80 L316 100"
                stroke="#3B82F6"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M484 80 L484 100"
                stroke="#3B82F6"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M650 80 L650 100"
                stroke="#3B82F6"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* subtle glow overlay on main line */}
              <path
                stroke="url(#glowGradient)"
                strokeWidth="6"
                strokeLinecap="round"
                opacity="0.4"
              />
              <defs>
                <linearGradient
                  id="glowGradient"
                  x1="150"
                  y1="80"
                  x2="650"
                  y2="80"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#60A5FA" />
                  <stop offset="0.5" stopColor="#3B82F6" />
                  <stop offset="1" stopColor="#60A5FA" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Row 4 — Four Cards in Semi-Circle Layout */}
          <div className="relative flex justify-center gap-x-12 mt-12 flex-wrap md:flex-nowrap">
            {leaders.slice(7, 11).map((member, index) => {
              // lift the first and last cards slightly for the curve effect
              const lift =
                index === 0 || index === 3
                  ? "-translate-y-32"
                  : index === 1 || index === 2
                  ? "-translate-y-4"
                  : "";

              return (
                <div
                  key={member._id || index}
                  className={`relative w-60 h-52 [perspective:1000px] transition-transform duration-700 ${lift}`}
                  onMouseEnter={() => handleMouseEnter(index + 400)}
                  onMouseLeave={() => handleMouseLeave(index + 400)}
                >
                  <div
                    className={`relative w-full h-full transition-transform duration-[8000ms] ease-[cubic-bezier(0.45,0.05,0.55,0.95)] [transform-style:preserve-3d] ${
                      flippedIndex === index + 400
                        ? "[transform:rotateY(180deg)]"
                        : ""
                    }`}
                  >
                    {/* Front Side */}
                    <Card className="absolute inset-0 flex flex-col justify-center items-center p-6 border border-blue-200 shadow-lg rounded-xl bg-white [backface-visibility:hidden] transition-transform duration-500 hover:scale-105 hover:shadow-blue-200/70">
                      <div className="w-20 h-20 mb-3 rounded-full overflow-hidden border-4 border-blue-500 shadow-md">
                        <img
                          src={member.img_url || "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/340px-Default_pfp.svg.png"}
                          alt={member.Name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-md font-bold text-gray-800 mb-1 text-center leading-tight">
                        {member.Name}
                      </h3>
                      <p className="text-blue-600 font-semibold text-xs text-center mb-3">
                        {member.Designation}
                      </p>
                    </Card>

                    {/* Back Side */}
                    <Card className="absolute inset-0 p-4 flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 to-indigo-500 text-white border-none rounded-xl [transform:rotateY(180deg)] [backface-visibility:hidden]">
                      <p className="text-xs leading-relaxed px-2 text-center">
                        {member.description}
                      </p>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
           <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight -mb-12 mt-10">
            Tech Team
          </h2>
          {/* <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-500 -mb-24">
            Guiding us with their wisdom, expertise, and constant motivation.
          </p> */}
          {/* ===== ROW 5 + CONNECTOR + ROW 6 ===== */}
          <div className="relative flex flex-col items-center mt-24">
            {/* Row 5 — Single Centered Card */}
            <div className="flex justify-center relative z-10">
              {leaders.slice(11, 12).map((member, index) => (
                <div
                  key={member._id || index}
                  className="relative w-64 h-64 [perspective:1000px]"
                  onMouseEnter={() => handleMouseEnter(index + 500)}
                  onMouseLeave={() => handleMouseLeave(index + 500)}
                >
                  <div
                    className={`relative w-full h-full transition-transform duration-[8000ms] ease-[cubic-bezier(0.45,0.05,0.55,0.95)] [transform-style:preserve-3d] ${
                      flippedIndex === index + 500
                        ? "[transform:rotateY(180deg)]"
                        : ""
                    }`}
                  >
                    {/* Front Side */}
                    <Card className="absolute inset-0 flex flex-col justify-center items-center p-6 border border-blue-200 shadow-lg rounded-xl bg-white [backface-visibility:hidden] transition-transform duration-500 hover:scale-105 hover:shadow-blue-200/70">
                      <div className="w-24 h-24 mb-4 rounded-full overflow-hidden border-4 border-blue-500 shadow-md">
                        <img
                          src={member.img_url || "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/340px-Default_pfp.svg.png"} 
                          alt={member.Name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 mb-1 text-center leading-tight">
                        {member.Name}
                      </h3>
                      <p className="text-blue-600 font-semibold text-sm text-center mb-3">
                        {member.Designation}
                      </p>
                    </Card>

                    {/* Back Side */}
                    <Card className="absolute inset-0 p-6 flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 to-indigo-500 text-white border-none rounded-xl [transform:rotateY(180deg)] [backface-visibility:hidden]">
                      <p className="text-sm leading-relaxed px-2 mb-4 text-center">
                        {member.description}
                      </p>
                    </Card>
                  </div>
                </div>
              ))}
            </div>

            {/* CONNECTOR SECTION (between leader and 4 members) */}
            <div className="relative w-full flex justify-center items-center -mt-10">
              {/* Soft glowing background */}
              <div
                className="absolute top-[40%] left-1/2 -translate-x-1/2 
                  w-[70%] h-[160px] 
                  bg-gradient-to-b from-blue-200/50 to-transparent 
                  rounded-full blur-3xl"
              ></div>

              {/* Hierarchy connection lines */}
              <svg
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-[160px] pointer-events-none"
                viewBox="0 0 800 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* vertical line from leader down */}
                <path
                  d="M400 0 L400 80"
                  stroke="#3B82F6"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {/* horizontal connector */}
                <path
                  d="M-100 80 L900 80"
                  stroke="#3B82F6"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {/* small verticals to each member */}
                <path
                  d="M150 80 L150 100"
                  stroke="#3B82F6"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M316 80 L316 100"
                  stroke="#3B82F6"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M484 80 L484 100"
                  stroke="#3B82F6"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M650 80 L650 100"
                  stroke="#3B82F6"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* subtle glow overlay on main line */}
                <path
                  stroke="url(#glowGradient)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  opacity="0.4"
                />
                <defs>
                  <linearGradient
                    id="glowGradient"
                    x1="150"
                    y1="80"
                    x2="650"
                    y2="80"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#60A5FA" />
                    <stop offset="0.5" stopColor="#3B82F6" />
                    <stop offset="1" stopColor="#60A5FA" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Row 6 — Semicircle Layout */}
            <div className="relative flex justify-center gap-x-10 mt-32 flex-wrap md:flex-nowrap z-10">
              {leaders.slice(12, 17).map((member, index) => {
                const lift =
                  index === 0 || index === 4
                    ? "-translate-y-40"
                    : index === 1 || index === 3
                    ? "-translate-y-10"
                    : index === 2
                    ? "-translate-y-6"
                    : "";
                return (
                  <div
                    key={member._id || index}
                    className={`relative w-56 h-52 [perspective:1000px] transition-transform duration-700 ${lift}`}
                    onMouseEnter={() => handleMouseEnter(index + 600)}
                    onMouseLeave={() => handleMouseLeave(index + 600)}
                  >
                    <div
                      className={`relative w-full h-full transition-transform duration-[8000ms] ease-[cubic-bezier(0.45,0.05,0.55,0.95)] [transform-style:preserve-3d] ${
                        flippedIndex === index + 600
                          ? "[transform:rotateY(180deg)]"
                          : ""
                      }`}
                    >
                      {/* Front Side */}
                      <Card className="absolute inset-0 flex flex-col justify-center items-center p-5 border border-blue-200 shadow-lg rounded-xl bg-white [backface-visibility:hidden] transition-transform duration-500 hover:scale-105 hover:shadow-blue-200/70">
                        <div className="w-20 h-20 mb-3 rounded-full overflow-hidden border-4 border-blue-500 shadow-md">
                          <img
                            src={member.img_url || "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/340px-Default_pfp.svg.png"}
                            alt={member.Name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="text-md font-bold text-gray-800 mb-1 text-center leading-tight">
                          {member.Name}
                        </h3>
                        <p className="text-blue-600 font-semibold text-xs text-center mb-2">
                          {member.Designation}
                        </p>
                      </Card>

                      {/* Back Side */}
                      <Card className="absolute inset-0 p-4 flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 to-indigo-500 text-white border-none rounded-xl [transform:rotateY(180deg)] [backface-visibility:hidden]">
                        <p className="text-xs leading-relaxed px-2 text-center">
                          {member.description}
                        </p>
                      </Card>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

           <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight -mb-12 mt-10">
            Media Team
          </h2>
          {/* <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-500 -mb-24">
            Guiding us with their wisdom, expertise, and constant motivation.
          </p> */}
          {/* Row 7 — Single Centered Card */}
          <div className="flex justify-center mt-24 relative z-10">
            {leaders.slice(17, 18).map((member, index) => (
              <div
                key={member._id || index}
                className="relative w-64 h-64 [perspective:1000px]"
                onMouseEnter={() => handleMouseEnter(index + 700)}
                onMouseLeave={() => handleMouseLeave(index + 700)}
              >
                <div
                  className={`relative w-full h-full transition-transform duration-[8000ms] ease-[cubic-bezier(0.45,0.05,0.55,0.95)] [transform-style:preserve-3d] ${
                    flippedIndex === index + 700
                      ? "[transform:rotateY(180deg)]"
                      : ""
                  }`}
                >
                  {/* Front Side */}
                  <Card className="absolute inset-0 flex flex-col justify-center items-center p-6 border border-blue-200 shadow-lg rounded-xl bg-white [backface-visibility:hidden] transition-transform duration-500 hover:scale-105 hover:shadow-blue-200/70">
                    <div className="w-24 h-24 mb-4 rounded-full overflow-hidden border-4 border-blue-500 shadow-md">
                      <img
                        src={member.img_url || "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/340px-Default_pfp.svg.png"}
                        alt={member.Name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1 text-center leading-tight">
                      {member.Name}
                    </h3>
                    <p className="text-blue-600 font-semibold text-sm text-center mb-3">
                      {member.Designation}
                    </p>
                  </Card>

                  {/* Back Side */}
                  <Card className="absolute inset-0 p-6 flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 to-indigo-500 text-white border-none rounded-xl [transform:rotateY(180deg)] [backface-visibility:hidden]">
                    <p className="text-sm leading-relaxed px-2 mb-4 text-center">
                      {member.description}
                    </p>
                  </Card>
                </div>
              </div>
            ))}
          </div>

          {/* Connector between center and 4 below */}
          <div className="relative w-full flex justify-center items-center -mt-14">
            <svg
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[75%] h-[160px] pointer-events-none"
              viewBox="0 0 900 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* vertical from leader */}
              <path
                d="M450 0 L450 80"
                stroke="#3B82F6"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* horizontal line */}
              <path
                d="M80 80 L820 80"
                stroke="#3B82F6"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* small vertical connectors */}
              <path
                d="M200 80 L200 100"
                stroke="#3B82F6"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M390 80 L390 100"
                stroke="#3B82F6"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M510 80 L510 100"
                stroke="#3B82F6"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M700 80 L700 100"
                stroke="#3B82F6"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Row 8 — Four Cards in Row */}
          {/* Row 8 — Four Cards in Semi-Circle Layout */}
          <div className="relative flex justify-center gap-x-12 mt-12 flex-wrap md:flex-nowrap">
            {leaders.slice(18, 22).map((member, index) => {
              // lift the first and last cards for the curve effect
              const lift =
                index === 0 || index === 3
                  ? "-translate-y-32"
                  : index === 1 || index === 2
                  ? "-translate-y-4"
                  : "";

              return (
                <div
                  key={member._id || index}
                  className={`relative w-60 h-52 [perspective:1000px] transition-transform duration-700 ${lift}`}
                  onMouseEnter={() => handleMouseEnter(index + 800)}
                  onMouseLeave={() => handleMouseLeave(index + 800)}
                >
                  <div
                    className={`relative w-full h-full transition-transform duration-[8000ms] ease-[cubic-bezier(0.45,0.05,0.55,0.95)] [transform-style:preserve-3d] ${
                      flippedIndex === index + 800
                        ? "[transform:rotateY(180deg)]"
                        : ""
                    }`}
                  >
                    {/* Front */}
                    <Card className="absolute inset-0 flex flex-col justify-center items-center p-5 border border-blue-200 shadow-lg rounded-xl bg-white [backface-visibility:hidden] transition-transform duration-500 hover:scale-105 hover:shadow-blue-200/70">
                      <div className="w-20 h-20 mb-3 rounded-full overflow-hidden border-4 border-blue-500 shadow-md">
                        <img
                          src={member.img_url || "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/340px-Default_pfp.svg.png"}
                          alt={member.Name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-md font-bold text-gray-800 mb-1 text-center leading-tight">
                        {member.Name}
                      </h3>
                      <p className="text-blue-600 font-semibold text-xs text-center mb-2">
                        {member.Designation}
                      </p>
                    </Card>

                    {/* Back */}
                    <Card className="absolute inset-0 p-4 flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 to-indigo-500 text-white border-none rounded-xl [transform:rotateY(180deg)] [backface-visibility:hidden]">
                      <p className="text-xs leading-relaxed px-2 text-center">
                        {member.description}
                      </p>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Final Row — Leader connected to Worker (Horizontal Layout) */}
          <div className="relative flex justify-center items-center mt-24">
            {/* Leader Card (Left) */}
            {leaders.slice(22, 23).map((member, index) => (
              <div
                key={member._id || index}
                className="relative w-60 h-56 [perspective:1000px] transition-transform duration-700 mr-24 z-10"
                onMouseEnter={() => handleMouseEnter(index + 1100)}
                onMouseLeave={() => handleMouseLeave(index + 1100)}
              >
                <div
                  className={`relative w-full h-full transition-transform duration-[8000ms] ease-[cubic-bezier(0.45,0.05,0.55,0.95)] [transform-style:preserve-3d] ${
                    flippedIndex === index + 1100
                      ? "[transform:rotateY(180deg)]"
                      : ""
                  }`}
                >
                  {/* Front */}
                  <Card className="absolute inset-0 flex flex-col justify-center items-center p-5 border border-blue-200 shadow-lg rounded-xl bg-white [backface-visibility:hidden] transition-transform duration-500 hover:scale-105 hover:shadow-blue-200/70">
                    <div className="w-20 h-20 mb-3 rounded-full overflow-hidden border-4 border-blue-500 shadow-md">
                      <img
                        src={member.img_url || "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/340px-Default_pfp.svg.png"}
                        alt={member.Name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-md font-bold text-gray-800 mb-1 text-center leading-tight">
                      {member.Name}
                    </h3>
                    <p className="text-blue-600 font-semibold text-xs text-center mb-2">
                      {member.Designation}
                    </p>
                  </Card>

                  {/* Back */}
                  <Card className="absolute inset-0 p-4 flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 to-indigo-500 text-white border-none rounded-xl [transform:rotateY(180deg)] [backface-visibility:hidden]">
                    <p className="text-xs leading-relaxed px-2 text-center">
                      {member.description}
                    </p>
                  </Card>
                </div>
              </div>
            ))}

            {/* Connector Line */}
            <svg
              className="absolute left-1/2 -translate-x-1/2 w-[250px] h-[4px]"
              viewBox="0 0 250 4"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 2 L250 2"
                stroke="#3B82F6"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>

            {/* Worker Card (Right) */}
            {leaders.slice(23, 24).map((member, index) => (
              <div
                key={member._id || index}
                className="relative w-60 h-56 [perspective:1000px] transition-transform duration-700 ml-24 z-10"
                onMouseEnter={() => handleMouseEnter(index + 1200)}
                onMouseLeave={() => handleMouseLeave(index + 1200)}
              >
                <div
                  className={`relative w-full h-full transition-transform duration-[8000ms] ease-[cubic-bezier(0.45,0.05,0.55,0.95)] [transform-style:preserve-3d] ${
                    flippedIndex === index + 1200
                      ? "[transform:rotateY(180deg)]"
                      : ""
                  }`}
                >
                  {/* Front */}
                  <Card className="absolute inset-0 flex flex-col justify-center items-center p-5 border border-blue-200 shadow-lg rounded-xl bg-white [backface-visibility:hidden] transition-transform duration-500 hover:scale-105 hover:shadow-blue-200/70">
                    <div className="w-20 h-20 mb-3 rounded-full overflow-hidden border-4 border-blue-500 shadow-md">
                      <img
                        src={member.img_url || "/default-profile.jpg"}
                        alt={member.Name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-md font-bold text-gray-800 mb-1 text-center leading-tight">
                      {member.Name}
                    </h3>
                    <p className="text-blue-600 font-semibold text-xs text-center mb-2">
                      {member.Designation}
                    </p>
                  </Card>

                  {/* Back */}
                  <Card className="absolute inset-0 p-4 flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 to-indigo-500 text-white border-none rounded-xl [transform:rotateY(180deg)] [backface-visibility:hidden]">
                    <p className="text-xs leading-relaxed px-2 text-center">
                      {member.description}
                    </p>
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
