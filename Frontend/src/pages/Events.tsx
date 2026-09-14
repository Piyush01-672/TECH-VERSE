import { useState, useRef, useMemo, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  Calendar,
  MapPin,
  Trophy,
  Users,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Zap,
  RotateCcw,
  HelpCircle,
  Laugh,
  Gamepad2,
  Swords,
  Bot,
  Terminal,
  Palette,
  Building2,
  Wrench,
  Layers,
  Bike,
  Recycle,
  ExternalLink,
  Mail,
  LayoutGrid,
  Rows,
  Dices,
  PartyPopper,
  Info,
  X,
  Flame,
  Check,
  UserPlus,
  Crown,
  ShieldAlert,
  Pickaxe,
  Crosshair
} from "lucide-react";
import { FaInstagram, FaWhatsapp, FaLinkedin } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { registerEngineersDayParticipant } from "@/services/api";
import CountdownTimer from "@/components/events/CountdownTimer";
import FestivalPass, { TeamMember } from "@/components/events/FestivalPass";

export type EventCategory = "all" | "esports" | "brain" | "makers" | "creative";

export interface EventItem {
  id: string;
  name: string;
  category: "esports" | "brain" | "makers" | "creative";
  icon: any;
  tagline: string;
  description: string;
  teamSize: number | { min: number; max: number; default: number }; // Exact team sizes
  format: string;
  perk: string;
  accent: string;
  border: string;
  rules: string[];
}

export const eventsList: EventItem[] = [
  {
    id: "quiz",
    name: "Tech & Logic Quiz",
    category: "brain",
    icon: HelpCircle,
    tagline: "High-Voltage Engineering & Brain-Benders",
    description: "The event aims to encourage students to demonstrate theire technical knowledge, logical thinking, problem-solving ability, awareness of engineering concepts, teamwork, and quick decision-making through a competitive quiz",
    teamSize: 4,
    format: "Squad of 4",
    perk: "🏆 Trophies & Merit Medals",
    accent: "from-blue-500 via-indigo-500 to-cyan-500",
    border: "border-blue-500/40",
    rules: [
      "Fixed team size: Exactly 4 participants per team.",
      "Round 1: Rapid-fire screening test (20 mins).",
      "Round 2: Audio-visual and buzzer trivia face-off.",
      "Negative marking applies in final buzzer stage."
    ],
  },
  {
    id: "3-wheel",
    name: "3-Wheel Ideathon",
    category: "makers",
    icon: Dices,
    tagline: "Spin, Ideate & Solve Innovation Challenge",
    description: "3-Wheel Ideathon is a Fast-paced innovation challenge where participants spin three wheels to get a domain, target audience, and challenge/constraint, then develop a practical idea based on the given combination.",
    teamSize: 2,
    format: "Duo (2 Members)",
    perk: "💡 Best Innovation Trophy & Medals",
    accent: "from-amber-500 via-orange-500 to-red-500",
    border: "border-amber-500/40",
    rules: [
      "Fixed team size: Exactly 2 participants per team.",
      "Spin three wheels to get a Domain, Target Audience, and Challenge / Constraint.",
      "Develop a practical, innovative idea based on the generated combination.",
      "Pitch your concept and solution to the judging panel within the time limit."
    ],
  },
  {
    id: "meme-making",
    name: "Meme War (Satire)",
    category: "creative",
    icon: Laugh,
    tagline: "Tech Humor & Engineering Satire",
    description: "Meme making is the creative process of combining images, text, captions, graphics, or other visual elements to communicate an idea, situation, joke, or message in a short, humorous, and engaging format. Participants are expected to use their creativity to produce an original meme that communicates the given idea effectively.",
    teamSize: 1,
    format: "Solo (1 Member)",
    perk: "🔥 Viral Crown & Swag Kit",
    accent: "from-pink-500 via-rose-500 to-fuchsia-500",
    border: "border-pink-500/40",
    rules: [
      "Solo competition: 1 participant only.",
      "Original templates or classic pop-culture formats.",
      "No offensive, derogatory, or political content.",
      "Judged on humor, relatable wit, and design punch."
    ],
  },
  {
    id: "minecraft",
    name: "Minecraft (Diamond Rush)",
    category: "esports",
    icon: Pickaxe,
    tagline: "Diamond Block Craft & Place Survival Challenge",
    description: "Race against time to craft and place a Diamond Block first in this thrilling Minecraft survival challenge",
    teamSize: 1,
    format: "Solo (1 Member)",
    perk: "💎 Master Survivalist Trophy & Prizes",
    accent: "from-emerald-500 via-teal-500 to-green-600",
    border: "border-emerald-500/40",
    rules: [
      "Solo competition: Exactly 1 participant only.",
      "Vanilla Minecraft survival mode speed challenge on a fresh seed.",
      "Race against time: First player to craft and place a Diamond Block wins.",
      "Strictly no external blueprints, mods, texture packs with x-ray, or cheats allowed."
    ],
  },
  {
    id: "codm",
    name: "CODM Tournament",
    category: "esports",
    icon: Crosshair,
    tagline: "5v5 Tactical Multiplayer & Search & Destroy",
    description: "Format: Initial rounds will use Frontline, TDM, or Hardpoint. The mode will be decided by the organizers",
    teamSize: 5,
    format: "Squad of 5",
    perk: "🎖️ Tactical Champion Certificate & Prizes",
    accent: "from-cyan-500 via-sky-600 to-blue-700",
    border: "border-cyan-500/40",
    rules: [
      "Fixed team size: Exactly 5 participants in the squad (Leader + 4 Teammates).",
      "Bring your own mobile phones with Call of Duty: Mobile updated.",
      "5v5 competitive multiplayer (Search & Destroy & Hardpoint).",
      "Strictly mobile touch screen only; no emulators or external triggers."
    ],
  },
  {
    id: "bgmi",
    name: "BGMI Tournament",
    category: "esports",
    icon: Swords,
    tagline: "Battlegrounds Mobile India Esports",
    description: "Drop into the battleground, survive shrinking blue zones, outmaneuver rival squads, and claim the Chicken Dinner.",
    teamSize: { min: 2, max: 4, default: 4 },
    format: "Squad (2 - 4 Players)",
    perk: "🏆 Prizes, Gifts & Certificates",
    accent: "from-red-500 via-orange-600 to-amber-500",
    border: "border-red-500/40",
    rules: [
      "Selectable squad size: 2 to 4 players (Duo, Trio, or Full Squad).",
      "Custom room code shared 15 mins prior in WhatsApp group.",
      "Erangel & Miramar classic competitive maps.",
      "Strict zero-tolerance policy against hacks or cheats."
    ],
  },
  {
    id: "tech-imposter",
    name: "TECH IMPOSTER",
    category: "brain",
    icon: Bot,
    tagline: "Clues, Bluffing & AI Imposter Guessing Arena",
    description: "TECH IMPOSTER is a fun and engaging guessing game that tests quick thinking, communication, and bluffing skills. Participants compete in pairs, with one hidden AI Imposter receiving a closely related word. Teams give clever clues, analyze responses, and vote to identify the Imposter. With Tech, Everyday, and Gaming themes, every round brings a new challenge and excitement. No coding skills are required—just creativity, confidence, and smart thinking!",
    teamSize: 2,
    format: "Duo (2 Members)",
    perk: "🎭 Master Detective Trophy & Prizes",
    accent: "from-violet-500 via-purple-600 to-indigo-500",
    border: "border-violet-500/40",
    rules: [
      "Fixed team size: Exactly 2 participants per team.",
      "Teams give clever clues and analyze responses each round.",
      "Vote to identify the hidden AI Imposter who received the closely related word.",
      "Themes across Tech, Everyday, and Gaming (No coding skills required)."
    ],
  },
  {
    id: "prompt-engineering",
    name: "Prompt Engineering",
    category: "brain",
    icon: Terminal,
    tagline: "Google Gemini AI Image Generation Challenge",
    description: "The Prompt Engineering Competition is an AI-based challenge where participants are given reference images and must create similar images using Google Gemini. Participants need to write effective prompts themselves and use different prompting techniques across three rounds: Zero-Shot, Few-Shot, and Role-Based Prompting.",
    teamSize: 1,
    format: "Solo (1 Member)",
    perk: "🚀 TechVerse AI Fellow Cup & Trophies",
    accent: "from-cyan-400 via-blue-600 to-teal-500",
    border: "border-cyan-500/40",
    rules: [
      "Solo challenge: Exactly 1 participant only.",
      "Participants are given reference images and must create similar images using Google Gemini.",
      "Participants need to write effective prompts themselves without external aid.",
      "Three competition rounds: Zero-Shot, Few-Shot, and Role-Based Prompting."
    ],
  },
  {
    id: "poster-making",
    name: "Poster Making",
    category: "creative",
    icon: Palette,
    tagline: "Visual Storytelling & Futuristic Visions",
    description: "Design inspiring digital or hand-drawn posters expressing the future of green tech, space frontiers, and smart cities.",
    teamSize: 1,
    format: "Solo (1 Member)",
    perk: "🎨 Design Maestro Medal",
    accent: "from-yellow-400 via-amber-500 to-orange-500",
    border: "border-yellow-500/40",
    rules: [
      "Solo challenge: 1 participant only.",
      "Digital (Canva/Photoshop) or traditional handmade canvas.",
      "Theme will be announced 15 mins prior.",
      "Judged on creativity, typography, and visual clarity."
    ],
  },
  {
    id: "autocad-civil",
    name: "AutoCAD (Civil)",
    category: "creative",
    icon: Building2,
    tagline: "Architectural Drafting & Structural Plans",
    description: "An AutoCAD design competition to create an accurate, and technically sound drawing based on a given problem statement",
    teamSize: 1,
    format: "Solo (1 Member)",
    perk: "📐 Blueprint Excellence Award",
    accent: "from-sky-400 via-indigo-500 to-blue-600",
    border: "border-sky-500/40",
    rules: [
      "Solo challenge: 1 participant only.",
      "Standard architectural drawing prompt provided.",
      "Dimensional accuracy and layer standards strictly scored.",
      "Time window: 60 minutes in CAD lab."
    ],
  },
  {
    id: "autocad-mechanical",
    name: "AutoCAD (Mechanical)",
    category: "creative",
    icon: Wrench,
    tagline: "Machine Components & 2D/3D Modeling",
    description: "The objective of the competition is to provide students with an opportunity to demonstrate their technical drawing skills, AutoCAD proficiency, accuracy, creativity and engineering design knowledge, irrespective of their department",
    teamSize: 1,
    format: "Solo (1 Member)",
    perk: "⚙️ Precision Draftsman Cup",
    accent: "from-orange-500 via-amber-600 to-red-500",
    border: "border-orange-500/40",
    rules: [
      "Solo challenge: 1 participant only.",
      "Draft mechanical assemblies with sectional views.",
      "Tolerances, fits, and isometric projection evaluation.",
      "Time window: 60 minutes."
    ],
  },
  {
    id: "bridge-making",
    name: "Bridge Making",
    category: "makers",
    icon: Layers,
    tagline: "Truss Strength & Structural Load Challenge",
    description: "A bridge-making competition to design and construct a strong stable, and creative bridge using ice-cream stick within the given time and design requirements",
    teamSize: 2,
    format: "Squad of 2",
    perk: "🏗️ Heavy-Load Titan Trophy",
    accent: "from-teal-400 via-emerald-600 to-green-500",
    border: "border-teal-500/40",
    rules: [
      "Fixed team size: Exactly 2 participants per bridge build.",
      "Popsicle sticks and glue provided on spot.",
      "Standard clear span minimum: 45 cm.",
      "Tested until structural collapse with calibrated weights."
    ],
  },
  {
    id: "best-out-of-waste",
    name: "Best Out of Waste",
    category: "makers",
    icon: Recycle,
    tagline: "Upcycling & Sustainable Mechanical Engineering",
    description: "The event aims to encourage students to demonstrate creativity, innovation, engineering thinking, teamwork,and environmental awareness by converting waste or discardedmaterials into useful and innovative products.",
    teamSize: 1,
    format: "Solo (1 Member)",
    perk: "🌱 Eco-Innovator Shield",
    accent: "from-lime-400 via-emerald-600 to-teal-500",
    border: "border-lime-500/40",
    rules: [
      "Solo challenge: 1 participant only.",
      "Materials must be repurposed/recycled scrap.",
      "Working mechanisms earn substantial bonus points.",
      "3-minute pitch to judges on utility and eco-impact."
    ],
  },
];

const categoryTabs = [
  { id: "all", label: "All Arenas", count: 12 },
  { id: "esports", label: "🎮 Esports & Gaming", count: 2 },
  { id: "brain", label: "🧠 Tech & AI Brains", count: 3 },
  { id: "makers", label: "🛠️ Makers & Builders", count: 3 },
  { id: "creative", label: "🎨 Creative & Satire", count: 4 },
];

const socialMediaLinks = [
  {
    name: "WhatsApp Community",
    handle: "Official Chat & Match Schedules",
    url: "https://chat.whatsapp.com/IiClyLPXlooJZWlJ66CnlN?mode=wwt",
    icon: FaWhatsapp,
    btnColor: "bg-gradient-to-r from-emerald-500 to-green-600 text-white",
  },
  {
    name: "Instagram",
    handle: "@tech.versectu",
    url: "https://www.instagram.com/tech.versectu/",
    icon: FaInstagram,
    btnColor: "bg-gradient-to-r from-pink-500 to-rose-600 text-white",
  },
  {
    name: "LinkedIn",
    handle: "TechVerse Club CTU",
    url: "https://www.linkedin.com/company/techverse-club-ct-university/",
    icon: FaLinkedin,
    btnColor: "bg-gradient-to-r from-blue-600 to-sky-600 text-white",
  },
  {
    name: "Email Support",
    handle: "techverse@ctuniversity.in",
    url: "mailto:techverse@ctuniversity.in",
    icon: Mail,
    btnColor: "bg-gradient-to-r from-slate-700 to-slate-800 text-white border border-white/10",
  },
];

const festivalPerks = [
  {
    title: "12 Thrilling Arenas",
    desc: "From 4-player BGMI battlegrounds to bridge load tests and AI prompt hacks.",
    icon: Trophy,
    color: "from-amber-400 to-orange-500",
  },
  {
    title: "Prizes, Gifts & Certificates",
    desc: "Exciting prizes, gift hampers, winner trophies, and accredited university certificates.",
    icon: PartyPopper,
    color: "from-pink-400 to-rose-500",
  },
  {
    title: "Verified E-Certificates",
    desc: "Official university-accredited participation certificates for all registered students.",
    icon: Sparkles,
    color: "from-cyan-400 to-blue-500",
  },
  {
    title: "Innovation & Team Spirit",
    desc: "Collaborate with peers, showcase technical talent, and build lasting campus memories.",
    icon: Flame,
    color: "from-purple-400 to-indigo-500",
  },
];

const Events = () => {
  const formRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<EventCategory>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [inspectEvent, setInspectEvent] = useState<EventItem | null>(null);

  // Form states
  const [selectedEventId, setSelectedEventId] = useState<string>("quiz");
  const [bgmiSquadSize, setBgmiSquadSize] = useState<number>(4);

  // Primary participant (Team Leader)
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [regNo, setRegNo] = useState("");
  const [contactNo, setContactNo] = useState("");

  // Additional team members: [{ name, course, regNo }]
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);

  const currentSelectedEvent = useMemo(() => {
    return eventsList.find((e) => e.id === selectedEventId) || eventsList[0];
  }, [selectedEventId]);

  // Calculate active team size for the chosen event
  const effectiveTeamSize = useMemo(() => {
    if (currentSelectedEvent.id === "bgmi") {
      return bgmiSquadSize;
    }
    return typeof currentSelectedEvent.teamSize === "number"
      ? currentSelectedEvent.teamSize
      : currentSelectedEvent.teamSize.default;
  }, [currentSelectedEvent, bgmiSquadSize]);

  // Keep team members array in sync with effectiveTeamSize - 1
  useEffect(() => {
    const requiredAdditionalMembers = effectiveTeamSize - 1;
    setTeamMembers((prev) => {
      if (prev.length === requiredAdditionalMembers) return prev;
      const next = [...prev];
      if (next.length < requiredAdditionalMembers) {
        while (next.length < requiredAdditionalMembers) {
          next.push({ name: "", course: "", regNo: "" });
        }
      } else {
        next.splice(requiredAdditionalMembers);
      }
      return next;
    });
  }, [effectiveTeamSize]);

  const handleTeamMemberChange = (index: number, field: keyof TeamMember, value: string) => {
    setTeamMembers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const filteredEvents = useMemo(() => {
    if (activeCategory === "all") return eventsList;
    return eventsList.filter((e) => e.category === activeCategory);
  }, [activeCategory]);

  const triggerConfettiBurst = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
        colors: ["#06b6d4", "#3b82f6", "#a855f7", "#ec4899", "#eab308"],
      });
    } catch (e) { }
  };

  const handlePickEvent = (eventId: string) => {
    setSelectedEventId(eventId);
    const ev = eventsList.find((e) => e.id === eventId);
    triggerConfettiBurst();
    toast.success(`Arena Equipped: ${ev?.name}! Fill your team details below.`);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleSurpriseMe = () => {
    const randomIndex = Math.floor(Math.random() * eventsList.length);
    const luckyEvent = eventsList[randomIndex];
    setSelectedEventId(luckyEvent.id);
    triggerConfettiBurst();
    toast(`🎲 Random Pick: ${luckyEvent.name}! Check out your live pass.`);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validate primary participant (Team Leader)
    if (!name.trim() || !course.trim() || !regNo.trim() || !contactNo.trim()) {
      toast.error("Please fill in all details for Team Leader (Name, Course, Reg no., Contact no.).");
      return;
    }

    const cleanedContact = contactNo.trim().replace(/[\s-]/g, "");
    if (cleanedContact.length !== 10 || !/^\d{10}$/.test(cleanedContact)) {
      toast.error("Contact number must be exactly 10 digits (no more, no less)!");
      return;
    }

    // 2. Validate all additional team members if teamSize > 1
    if (effectiveTeamSize > 1) {
      for (let i = 0; i < teamMembers.length; i++) {
        const member = teamMembers[i];
        const memberNumber = i + 2;
        if (!member.name.trim() || !member.course.trim() || !member.regNo.trim()) {
          toast.error(`Please fill in all details for Member ${memberNumber} (Name, Course, Reg No.)!`);
          return;
        }
      }
    }

    setIsSubmitting(true);

    const isMultiMember = effectiveTeamSize > 1;

    const cleanedMembers = teamMembers.map((m) => ({
      name: m.name.trim(),
      course: m.course.trim(),
      regNo: m.regNo.trim(),
    }));

    const m2 = cleanedMembers[0] || { name: "", course: "", regNo: "" };
    const m3 = cleanedMembers[1] || { name: "", course: "", regNo: "" };
    const m4 = cleanedMembers[2] || { name: "", course: "", regNo: "" };
    const m5 = cleanedMembers[3] || { name: "", course: "", regNo: "" };

    const payload = {
      // Participant 1 / Leader (clean separate field)
      name: name.trim(),
      leaderName: name.trim(),
      course: course.trim(),
      regNo: regNo.trim(),
      contactNo: cleanedContact,
      competition: currentSelectedEvent.name,
      eventSlug: currentSelectedEvent.id,
      teamSize: effectiveTeamSize,

      // Dedicated fields for Member 2
      member2_name: m2.name,
      member2_course: m2.course,
      member2_regNo: m2.regNo,

      // Dedicated fields for Member 3
      member3_name: m3.name,
      member3_course: m3.course,
      member3_regNo: m3.regNo,

      // Dedicated fields for Member 4
      member4_name: m4.name,
      member4_course: m4.course,
      member4_regNo: m4.regNo,

      // Dedicated fields for Member 5
      member5_name: m5.name,
      member5_course: m5.course,
      member5_regNo: m5.regNo,

      // Complete structured array for all members
      participants: [
        {
          name: name.trim(),
          course: course.trim(),
          regNo: regNo.trim(),
          role: isMultiMember ? "Team Leader" : "Participant",
        },
        ...cleanedMembers.map((m, idx) => ({
          ...m,
          role: `Teammate ${idx + 2}`,
        })),
      ],
      teamMembers: cleanedMembers,
    };

    try {
      const response = await registerEngineersDayParticipant(payload);
      setIsSuccess(true);
      const passId = response?.data?._id || `ED26-${Math.floor(1000 + Math.random() * 9000)}`;
      setSubmittedData({
        ...payload,
        leaderName: name.trim(),
        id: passId,
        collection: response?.collection || currentSelectedEvent.id,
        registeredAt: new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      });

      // Full celebratory grand confetti
      try {
        confetti({
          particleCount: 160,
          spread: 95,
          origin: { y: 0.5 },
          colors: ["#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b"],
        });
      } catch (e) { }

      toast.success(`🎉 Congratulations! Registered team for ${currentSelectedEvent.name}!`);
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to submit registration. Please check your network or try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForAnother = () => {
    setIsSuccess(false);
    toast.info("Choose another arena to enter!");
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative min-h-screen bg-[#030612] text-white pt-20 selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
      {/* ============================================================ */}
      {/* 🌟 ENHANCED RICH CYBER-COSMIC FESTIVAL BACKGROUND           */}
      {/* ============================================================ */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {/* Deep Cosmic Dark Base with Radial Depth */}
        <div className="absolute inset-0 bg-[#020510]" />

        {/* Layer 1: Vibrant Electric Top Nebula */}
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[1000px] h-[700px] bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.25)_0%,rgba(59,130,246,0.18)_35%,rgba(147,51,234,0.1)_60%,transparent_80%)] blur-[90px]" />

        {/* Layer 2: Mid Right Neon Rose/Violet Aurora */}
        <div className="absolute top-[32%] -right-[15%] w-[800px] h-[650px] bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.18)_0%,rgba(168,85,247,0.14)_40%,transparent_75%)] blur-[100px]" />

        {/* Layer 3: Mid Left Electric Indigo & Cyan Bloom */}
        <div className="absolute top-[55%] -left-[15%] w-[850px] h-[700px] bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.2)_0%,rgba(99,102,241,0.15)_40%,transparent_75%)] blur-[110px]" />

        {/* Layer 4: Bottom Cyber Amber/Emerald Ground Light */}
        <div className="absolute -bottom-[20%] left-1/3 w-[900px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.15)_0%,rgba(6,182,212,0.12)_40%,transparent_75%)] blur-[100px]" />

        {/* Layer 5: Cyber Matrix Perspective Grid with Soft Edge Fade */}
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: '4rem 4rem',
            maskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, #000 50%, transparent 95%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, #000 50%, transparent 95%)'
          }}
        />

        {/* Layer 6: Subtle Digital Constellation Sparkles */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      {/* MARQUEE FESTIVAL TICKER */}
      <div className="w-full bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 border-y border-white/10 py-2.5 overflow-hidden backdrop-blur-md">
        <div className="flex items-center gap-8 whitespace-nowrap animate-marquee font-mono text-xs text-cyan-200 font-semibold tracking-wider">
          <span className="flex items-center gap-2">🔥 12 Action-Packed Competitions</span>
          <span className="text-cyan-500">•</span>
          <span className="flex items-center gap-2">👥 Squad & Duo Arenas Ready</span>
          <span className="text-cyan-500">•</span>
          <span className="flex items-center gap-2">🏆 Exciting Prizes, Gifts & Certificates</span>
          <span className="text-cyan-500">•</span>
          <span className="flex items-center gap-2">🎮 Free Entry For All University Students</span>
          <span className="text-cyan-500">•</span>
          <span className="flex items-center gap-2">🤝 Open to All Engineering Students</span>
          <span className="text-cyan-500">•</span>
          <span className="flex items-center gap-2">📜 Official Certified E-Certificates</span>
          <span className="text-cyan-500">•</span>
          <span className="flex items-center gap-2">⚡ National Engineers' Day Celebration 2026</span>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Floating Celebratory Emojis */}
        <div className="hidden sm:block absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          <span className="absolute top-10 left-12 text-3xl animate-bounce-slow opacity-70">🎮</span>
          <span className="absolute top-24 right-16 text-3xl animate-pulse opacity-70">🤖</span>
          <span className="absolute bottom-20 left-24 text-3xl animate-bounce opacity-70">🚀</span>
          <span className="absolute bottom-16 right-28 text-3xl animate-spin-slow opacity-70">⚙️</span>
          <span className="absolute top-1/2 left-6 text-2xl animate-pulse opacity-70">💡</span>
          <span className="absolute top-1/3 right-8 text-2xl animate-bounce-slow opacity-70">🏆</span>
        </div>

        {/* Fest Flagship Pill */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 border border-cyan-400/40 text-cyan-300 text-xs sm:text-sm font-mono tracking-wider mb-7 shadow-[0_0_25px_rgba(6,182,212,0.3)] backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-cyan-300 animate-spin-slow" />
          <span className="font-bold">TECHVERSE PRESENTS: NATIONAL ENGINEERS' DAY 2026</span>
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        </div>

        {/* Grand Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] mb-6">
          <span className="block text-white font-space drop-shadow-sm">
            ENGINEERS' DAY
          </span>
          <span className="block bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(59,130,246,0.6)] font-space">
            12 ARENAS OF GLORY
          </span>
        </h1>

        <p className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-slate-300 font-sans leading-relaxed mb-8">
          Assemble your squad or compete solo! From 4-player BGMI battles & bridge load tests to high-stakes quizzes, meme satire, and AI prompting. Zero entry fee — pure university hype!
        </p>

        {/* Live Countdown Timer */}
        <div className="mb-10">
          <CountdownTimer />
        </div>

        {/* Quick Highlights Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-4xl mx-auto mb-10 text-xs sm:text-sm font-mono text-slate-200">
          <div className="px-4 py-2 rounded-xl bg-white/[0.05] border border-white/15 flex items-center gap-2 backdrop-blur-md shadow-sm">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span>Sept 15, 2026</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white/[0.05] border border-white/15 flex items-center gap-2 backdrop-blur-md shadow-sm">
            <MapPin className="w-4 h-4 text-blue-400" />
            <span>CT University Campus, Punjab</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white/[0.05] border border-white/15 flex items-center gap-2 backdrop-blur-md shadow-sm">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span>Prizes, Gifts & Certificates</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white/[0.05] border border-white/15 flex items-center gap-2 backdrop-blur-md shadow-sm">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>100% Free Registration</span>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button
            size="lg"
            onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
            className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold px-8 py-6 rounded-2xl shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-[1.02] transition-all duration-300 text-base"
          >
            Claim Your Festival Pass <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={handleSurpriseMe}
            className="border-purple-500/50 hover:border-purple-400 bg-purple-950/30 hover:bg-purple-900/40 text-purple-200 font-bold px-6 py-6 rounded-2xl shadow-lg transition-all duration-300 text-base flex items-center gap-2"
          >
            <Dices className="w-5 h-5 text-purple-400 animate-spin-slow" /> Surprise Me (Spin Arena)
          </Button>
          <Button
            size="lg"
            onClick={() => window.open("/public/Engineers_Day_2026_Professional_Formatted.pdf", "_blank")}
            className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold px-8 py-6 rounded-2xl shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-[1.02] transition-all duration-300 text-base"
          >
            Rule Book <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* FESTIVAL PERKS & HIGHLIGHTS BANNER */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {festivalPerks.map((perk, idx) => {
            const Icon = perk.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md flex items-start gap-4 hover:border-cyan-400/40 hover:bg-white/[0.06] transition-all group"
              >
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br ${perk.color} text-white shadow-md flex-shrink-0 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-space mb-1">
                    {perk.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {perk.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 12 COMPETITIONS EXPLORER WITH CATEGORIES */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <h2 className="text-2xl sm:text-3xl font-black font-space text-white">
                Choose Your Arena
              </h2>
            </div>
            <p className="text-slate-400 text-sm">
              Click any arena to equip it on your official registration pass below.
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 rounded-xl bg-white/[0.04] border border-white/10 text-xs shadow-inner">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${viewMode === "grid"
                  ? "bg-cyan-500 text-black font-bold shadow"
                  : "text-slate-400 hover:text-white"
                  }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Cards</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${viewMode === "list"
                  ? "bg-cyan-500 text-black font-bold shadow"
                  : "text-slate-400 hover:text-white"
                  }`}
              >
                <Rows className="w-3.5 h-3.5" />
                <span>List</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Tabs Filter */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-8">
          {categoryTabs.map((tab) => {
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id as EventCategory)}
                className={`px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 flex items-center gap-2 border ${isActive
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-[1.02]"
                  : "bg-white/[0.04] text-slate-300 border-white/10 hover:bg-white/[0.08] hover:text-white"
                  }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${isActive ? "bg-black/30 text-white" : "bg-white/10 text-slate-400"
                    }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* CARDS GRID VIEW */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredEvents.map((item, idx) => {
              const IconComponent = item.icon;
              const isSelected = selectedEventId === item.id;
              return (
                <div
                  key={item.id}
                  className={`group relative rounded-2xl border p-5 transition-all duration-300 flex flex-col justify-between overflow-hidden backdrop-blur-xl ${isSelected
                    ? "bg-cyan-950/40 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.35)] ring-1 ring-cyan-400 -translate-y-1"
                    : "bg-[#090d1f]/80 border-white/10 hover:border-cyan-500/40 hover:bg-white/[0.05] hover:-translate-y-1"
                    }`}
                >
                  <div
                    className={`absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br ${item.accent} rounded-full blur-[50px] opacity-20 pointer-events-none`}
                  />

                  <div>
                    {/* Top Row: Format badge + Index */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                        <Users className="w-3 h-3" /> {item.format}
                      </span>
                      <span className="text-xs font-mono font-bold text-cyan-400/80">
                        #{String(idx + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Icon & Title */}
                    <div className="flex items-start gap-3.5 mb-2.5">
                      <div
                        className={`p-3 rounded-xl border flex-shrink-0 transition-transform group-hover:scale-105 ${isSelected
                          ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white border-cyan-400 shadow-md shadow-cyan-500/30"
                          : "bg-white/5 border-white/10 text-cyan-400 group-hover:bg-cyan-500/20"
                          }`}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-base font-bold text-white font-space truncate group-hover:text-cyan-300">
                          {item.name}
                        </h3>
                        <p className="text-xs text-cyan-400/90 font-medium line-clamp-1 mt-0.5">
                          {item.tagline}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">
                      {item.description}
                    </p>

                    {/* Perk Tag */}
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg mb-4 w-fit">
                      <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{item.perk}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-white/10 flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handlePickEvent(item.id)}
                      className={`flex-1 rounded-xl text-xs font-bold transition-all py-2 ${isSelected
                        ? "bg-cyan-500 hover:bg-cyan-400 text-black shadow-md shadow-cyan-500/30"
                        : "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                        }`}
                    >
                      {isSelected ? (
                        <span className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" /> Equipped
                        </span>
                      ) : (
                        "Equip Arena"
                      )}
                    </Button>

                    <button
                      type="button"
                      onClick={() => setInspectEvent(item)}
                      title="View Arena Rules"
                      className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-cyan-300 hover:bg-white/10 transition-colors"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* LIST VIEW */
          <div className="space-y-3">
            {filteredEvents.map((item, idx) => {
              const IconComponent = item.icon;
              const isSelected = selectedEventId === item.id;
              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 ${isSelected
                    ? "bg-cyan-950/40 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400"
                    : "bg-[#090d1f]/80 border-white/10 hover:border-cyan-500/30 hover:bg-white/[0.04]"
                    }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="text-xs font-mono font-bold text-cyan-400 flex-shrink-0">
                      #{String(idx + 1).padStart(2, "0")}
                    </span>

                    <div
                      className={`p-3 rounded-xl border flex-shrink-0 ${isSelected
                        ? "bg-cyan-500 text-black border-cyan-400"
                        : "bg-white/5 border-white/10 text-cyan-400"
                        }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-white font-space">
                          {item.name}
                        </h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                          {item.format}
                        </span>
                        <span className="text-xs text-amber-300 flex items-center gap-1">
                          <Zap className="w-3 h-3 fill-amber-400" /> {item.perk}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-auto flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => setInspectEvent(item)}
                      className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white text-xs font-medium"
                    >
                      Rules
                    </button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handlePickEvent(item.id)}
                      className={`rounded-xl text-xs font-bold px-4 py-2 ${isSelected
                        ? "bg-cyan-500 text-black font-bold shadow"
                        : "bg-white/10 hover:bg-white/20 text-white"
                        }`}
                    >
                      {isSelected ? "✓ Equipped" : "Select"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* RULES / DETAILS MODAL */}
      {inspectEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-[#0a0f24] border border-cyan-500/40 p-6 shadow-2xl overflow-hidden">
            <button
              onClick={() => setInspectEvent(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <inspectEvent.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-space text-white">
                  {inspectEvent.name}
                </h3>
                <span className="text-xs font-mono text-cyan-400">
                  {inspectEvent.format} • {inspectEvent.perk}
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mb-5">
              {inspectEvent.description}
            </p>

            <div className="mb-6">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-2">
                Arena Guidelines & Requirements:
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {inspectEvent.rules.map((rule, rIdx) => (
                  <li key={rIdx} className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button
              className="w-full py-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold"
              onClick={() => {
                handlePickEvent(inspectEvent.id);
                setInspectEvent(null);
              }}
            >
              Equip This Arena & Register
            </Button>
          </div>
        </div>
      )}

      {/* REGISTRATION ARENA SECTION (SPLIT SCREEN: FORM + LIVE PASS) */}
      <section ref={formRef} id="register-section" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {!isSuccess ? (
          <div>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <Badge className="bg-cyan-500/10 text-cyan-300 border-cyan-500/30 px-4 py-1.5 mb-3 text-xs font-mono uppercase tracking-widest">
                Official Registration Portal
              </Badge>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight font-space text-white">
                Enter The Arena
              </h2>
              <p className="text-slate-300 mt-3 text-sm sm:text-base">
                Register yourself and your teammates. Your official holographic <strong className="text-cyan-400">Festival Pass</strong> updates in real time on the right!
              </p>
            </div>

            {/* Split Screen Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* LEFT: The Interactive Form (7 Cols) */}
              <div className="lg:col-span-7 relative rounded-3xl bg-[#090d1f]/90 border border-cyan-500/30 p-6 sm:p-10 backdrop-blur-2xl shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden">
                <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-500/15 rounded-full blur-[90px] pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-500/15 rounded-full blur-[90px] pointer-events-none" />

                <form onSubmit={handleFormSubmit} className="relative z-10 space-y-6">
                  {/* Equipped Arena Indicator Banner */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-purple-500/15 border border-cyan-400/30 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-widest font-bold block">
                        Equipped Arena
                      </span>
                      <span className="text-base sm:text-lg font-black text-white font-space">
                        {currentSelectedEvent.name}
                      </span>
                    </div>
                    <span className="text-xs font-mono bg-cyan-500 text-black font-extrabold px-3 py-1.5 rounded-xl shadow">
                      {effectiveTeamSize > 1 ? `Team of ${effectiveTeamSize}` : "Solo (1 Member)"}
                    </span>
                  </div>

                  {/* 1. Arena Dropdown Selector */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-cyan-300 mb-2 font-semibold">
                      Select Arena / Competition *
                    </label>
                    <select
                      value={selectedEventId}
                      onChange={(e) => {
                        setSelectedEventId(e.target.value);
                        triggerConfettiBurst();
                      }}
                      className="w-full px-4 py-3.5 rounded-xl bg-[#0c1326] border border-cyan-500/40 text-white text-sm font-medium focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                    >
                      {eventsList.map((event) => (
                        <option key={event.id} value={event.id}>
                          {event.name} ({event.format})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 1.1 Special Squad Size Selector for BGMI Tournament (2 to 4 Players) */}
                  {currentSelectedEvent.id === "bgmi" && (
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-purple-500/30">
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-xs font-mono uppercase tracking-wider text-purple-300 font-bold flex items-center gap-1.5">
                          <Swords className="w-4 h-4 text-purple-400" /> Choose BGMI Squad Size (2 - 4 Players)
                        </label>
                        <span className="text-[11px] font-mono text-slate-400">
                          {bgmiSquadSize} Players Total
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2.5">
                        {[2, 3, 4].map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => setBgmiSquadSize(size)}
                            className={`py-2.5 px-3 rounded-xl font-mono text-xs font-bold transition-all border ${bgmiSquadSize === size
                              ? "bg-purple-600 text-white border-purple-400 shadow-[0_0_15px_rgba(147,51,234,0.4)]"
                              : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white"
                              }`}
                          >
                            {size === 2 ? "Duo (2)" : size === 3 ? "Trio (3)" : "Full Squad (4)"}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ----------------------------------------------------------------- */}
                  {/* PARTICIPANT 1 (TEAM LEADER OR SOLO ENTRANT)                      */}
                  {/* ----------------------------------------------------------------- */}
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                        {effectiveTeamSize > 1 ? (
                          <>
                            <Crown className="w-4 h-4 text-yellow-400" /> Participant 1 (Team Leader)
                          </>
                        ) : (
                          <>
                            <Users className="w-4 h-4 text-cyan-400" /> Participant Details
                          </>
                        )}
                      </span>
                      {effectiveTeamSize > 1 && (
                        <span className="text-[10px] font-mono text-yellow-400/90 font-semibold bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/20">
                          Primary Contact
                        </span>
                      )}
                    </div>

                    {/* Leader Name */}
                    <div>
                      <label className="block text-xs text-slate-300 mb-1.5 font-medium">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Gurmanpreet Singh"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-all font-medium"
                      />
                    </div>

                    {/* Leader Course */}
                    <div>
                      <label className="block text-xs text-slate-300 mb-1.5 font-medium">
                        Course & Branch *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. B.Tech CSE (Cyber Security), BCA, B.Tech Mech..."
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-all font-medium"
                      />
                    </div>

                    {/* Leader Reg No. & Contact No. */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-slate-300 mb-1.5 font-medium">
                          Registration No. *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. CTU/2023/1084"
                          value={regNo}
                          onChange={(e) => setRegNo(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-all font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1.5 font-medium">
                          Contact No. (10 digits) *
                        </label>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          placeholder="e.g. 9876543210"
                          value={contactNo}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, "");
                            if (digits.length <= 10) {
                              setContactNo(digits);
                            }
                          }}
                          className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-all font-mono tracking-wider"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ----------------------------------------------------------------- */}
                  {/* ADDITIONAL TEAMMATES (MEMBERS 2 TO N) IF TEAM SIZE > 1            */}
                  {/* ----------------------------------------------------------------- */}
                  {effectiveTeamSize > 1 && teamMembers.map((member, idx) => {
                    const memberNumber = idx + 2;
                    return (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl bg-white/[0.02] border border-cyan-500/20 space-y-4 relative overflow-hidden"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-white/10">
                          <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                            <UserPlus className="w-4 h-4 text-purple-400" /> Participant {memberNumber} (Teammate)
                          </span>
                          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                            Required
                          </span>
                        </div>

                        {/* Teammate Name */}
                        <div>
                          <label className="block text-xs text-slate-300 mb-1.5 font-medium">
                            Participant {memberNumber} Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder={`Enter name of Teammate ${memberNumber}`}
                            value={member.name}
                            onChange={(e) => handleTeamMemberChange(idx, "name", e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-all font-medium"
                          />
                        </div>

                        {/* Teammate Course & Reg No. */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-slate-300 mb-1.5 font-medium">
                              Course & Branch *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. B.Tech CSE, BCA..."
                              value={member.course}
                              onChange={(e) => handleTeamMemberChange(idx, "course", e.target.value)}
                              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-all font-medium"
                            />
                          </div>

                          <div>
                            <label className="block text-xs text-slate-300 mb-1.5 font-medium">
                              Registration No. *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. CTU/2023/XXXX"
                              value={member.regNo}
                              onChange={(e) => handleTeamMemberChange(idx, "regNo", e.target.value)}
                              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-all font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Submit Action */}
                  <div className="pt-3">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-black text-base shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-[1.01] transition-all duration-300 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Registering Team...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          {effectiveTeamSize > 1
                            ? `Issue Festival Pass for Squad of ${effectiveTeamSize}`
                            : `Issue Festival Pass for ${currentSelectedEvent.name}`}
                          <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                        </span>
                      )}
                    </Button>
                    <p className="text-center text-slate-400 text-xs mt-3">
                      🔒 Official free registration • Every team member receives an accredited certificate
                    </p>
                  </div>
                </form>
              </div>

              {/* RIGHT: Live Holographic Festival Pass Preview (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center sticky top-28">
                <div className="w-full mb-3 flex items-center justify-between px-2 text-xs font-mono text-cyan-300">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" /> Real-Time Pass Preview
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    {effectiveTeamSize > 1 ? `Squad (${effectiveTeamSize} Members)` : "Solo Entry"}
                  </span>
                </div>

                <FestivalPass
                  name={name}
                  course={course}
                  regNo={regNo}
                  eventName={currentSelectedEvent.name}
                  teamSize={effectiveTeamSize}
                  teamMembers={teamMembers}
                  passId="ED26-PENDING"
                  isConfirmed={false}
                />
              </div>
            </div>
          </div>
        ) : (
          /* THANK YOU VIEW (FESTIVAL CONFIRMATION TICKET) */
          <div className="animate-fade-in text-center max-w-3xl mx-auto">
            <div className="rounded-3xl bg-[#090d1f]/95 border-2 border-cyan-400/50 p-8 sm:p-12 backdrop-blur-2xl shadow-[0_0_70px_rgba(6,182,212,0.35)] relative overflow-hidden">
              <div className="absolute -top-32 -left-32 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px] pointer-events-none" />
              <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] pointer-events-none" />

              {/* Success Badge */}
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_35px_rgba(6,182,212,0.5)] animate-bounce-slow">
                <CheckCircle2 className="w-10 h-10 text-cyan-300" />
              </div>

              <h2 className="text-3xl sm:text-5xl font-black font-space text-white mb-3">
                You're In The Game! 🎉
              </h2>
              <p className="text-slate-300 text-base sm:text-lg mb-8 leading-relaxed max-w-xl mx-auto">
                Official pass issued for <strong className="text-cyan-400 font-bold">{submittedData?.leaderName || submittedData?.name}</strong>
                {submittedData?.teamSize > 1 ? ` & Team (${submittedData?.teamSize} Members)` : ""} in{" "}
                <strong className="text-purple-300 font-bold">{submittedData?.competition}</strong>.
              </p>

              {/* Rendered Confirmed Pass */}
              <div className="mb-10 max-w-sm mx-auto">
                <FestivalPass
                  name={submittedData?.leaderName || submittedData?.name}
                  course={submittedData?.course?.split(",")[0] || submittedData?.course}
                  regNo={submittedData?.regNo?.split(",")[0] || submittedData?.regNo}
                  eventName={submittedData?.competition}
                  teamSize={submittedData?.teamSize}
                  teamMembers={submittedData?.teamMembers}
                  passId={submittedData?.id}
                  isConfirmed={true}
                />
              </div>

              {/* Full Roster Details Table if Multi-Member */}
              {submittedData?.teamMembers && submittedData.teamMembers.length > 0 && (
                <div className="mb-8 p-5 rounded-2xl bg-white/[0.03] border border-white/10 text-left">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-cyan-300 font-bold mb-3 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-cyan-400" /> Registered Squad Roster
                  </h4>
                  <div className="divide-y divide-white/10 text-xs">
                    <div className="py-2 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-white">👑 {submittedData?.leaderName || submittedData?.name} (Leader)</span>
                        <span className="text-slate-400 block text-[11px]">{submittedData?.course?.split(",")[0] || submittedData?.course}</span>
                      </div>
                      <span className="font-mono text-cyan-400">{submittedData?.regNo?.split(",")[0] || submittedData?.regNo}</span>
                    </div>
                    {submittedData.teamMembers.map((m: any, idx: number) => (
                      <div key={idx} className="py-2 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-white">Participant {idx + 2}: {m.name}</span>
                          <span className="text-slate-400 block text-[11px]">{m.course}</span>
                        </div>
                        <span className="font-mono text-cyan-400">{m.regNo}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SOCIAL MEDIA SECTION */}
              <div className="mb-8 text-left">
                <p className="text-xs font-mono uppercase tracking-widest text-cyan-300 mb-4 font-bold text-center">
                  ⚡ Join TechVerse WhatsApp for Match Timings, Rulebooks & Announcements:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {socialMediaLinks.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={idx}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-3 p-4 rounded-2xl border border-white/10 transition-all duration-300 hover:scale-[1.02] shadow-md ${item.btnColor}`}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <div className="text-left overflow-hidden">
                          <div className="font-bold text-xs leading-tight">{item.name}</div>
                          <div className="text-[11px] opacity-90 truncate">{item.handle}</div>
                        </div>
                        <ExternalLink className="w-4 h-4 ml-auto opacity-75" />
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3">
                <Button
                  onClick={handleResetForAnother}
                  size="lg"
                  className="w-full sm:w-1/2 py-6 rounded-xl bg-white hover:bg-slate-200 text-black font-bold text-sm sm:text-base shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Register Another Squad / Event
                </Button>

                <Button
                  onClick={() => window.print()}
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-1/2 py-6 rounded-xl border-white/20 hover:bg-white/10 text-white font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2"
                >
                  Save / Print Festival Pass
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Events;
