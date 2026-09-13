import React from "react";
import { Sparkles, Trophy, QrCode, ShieldCheck, Ticket, Users } from "lucide-react";

export interface TeamMember {
  name: string;
  course: string;
  regNo: string;
}

interface FestivalPassProps {
  name: string;
  course: string;
  regNo: string;
  eventName: string;
  teamSize?: number;
  teamMembers?: TeamMember[];
  passId?: string;
  accentColor?: string;
  isConfirmed?: boolean;
}

export default function FestivalPass({
  name,
  course,
  regNo,
  eventName,
  teamSize = 1,
  teamMembers = [],
  passId = "ED26-PENDING",
  accentColor = "from-cyan-500 via-blue-500 to-purple-600",
  isConfirmed = false,
}: FestivalPassProps) {
  const displayName = name.trim() ? name.trim() : "CHAMPION PARTICIPANT";
  const displayCourse = course.trim() ? course.trim() : "ENGINEERING / TECH";
  const displayRegNo = regNo.trim() ? regNo.trim() : "CTU/2026/0000";

  return (
    <div className="relative group w-full max-w-sm mx-auto select-none">
      {/* Outer ambient glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-40 group-hover:opacity-65 transition duration-1000 -z-10" />

      {/* Main Pass Container */}
      <div className="relative rounded-3xl bg-[#090d1f]/95 border-2 border-cyan-400/40 p-6 sm:p-7 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden text-left">
        {/* Holographic Shimmer Sweep */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-cyan-500/[0.08] pointer-events-none" />

        {/* Lanyard Hole Mockup */}
        <div className="mx-auto w-12 h-2.5 rounded-full bg-slate-900 border border-white/20 mb-4 flex items-center justify-center shadow-inner">
          <div className="w-6 h-1 rounded-full bg-slate-700" />
        </div>

        {/* Header Ribbon */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
          <div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-cyan-400 font-bold block">
              CT University • TechVerse
            </span>
            <span className="text-xs font-black tracking-wide text-white uppercase font-space flex items-center gap-1.5">
              <Ticket className="w-3.5 h-3.5 text-purple-400" /> Engineers' Day Pass
            </span>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border border-cyan-400/40 bg-cyan-500/10 text-cyan-300 flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${isConfirmed ? "bg-emerald-400 animate-ping" : "bg-amber-400 animate-pulse"}`} />
              {isConfirmed ? "CONFIRMED" : "LIVE PREVIEW"}
            </span>
            {teamSize > 1 && (
              <span className="text-[9px] font-mono text-purple-300 font-bold flex items-center gap-1">
                <Users className="w-3 h-3 text-purple-400" /> Team of {teamSize}
              </span>
            )}
          </div>
        </div>

        {/* Arena Badge */}
        <div className="mb-4">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
            Official Selected Arena
          </span>
          <div className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 via-blue-500/15 to-purple-500/20 border border-cyan-400/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-black text-white font-space tracking-wide">
                {eventName || "Select an Event"}
              </span>
            </div>
            <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-spin-slow" />
          </div>
        </div>

        {/* Participant Details */}
        <div className="space-y-3 mb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
              {teamSize > 1 ? "Team Leader" : "Participant Name"}
            </span>
            <span className="text-base font-extrabold text-white tracking-wide font-space truncate block drop-shadow-sm">
              {teamSize > 1 ? `👑 ${displayName}` : displayName}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1 border-t border-white/5">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                Course / Branch
              </span>
              <span className="text-xs font-bold text-slate-200 truncate block">
                {displayCourse}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                Reg. Number
              </span>
              <span className="text-xs font-mono font-bold text-cyan-300 truncate block">
                {displayRegNo}
              </span>
            </div>
          </div>

          {/* Team Roster Snippet if Team Size > 1 */}
          {teamSize > 1 && (
            <div className="pt-2 border-t border-white/10">
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 block mb-1 font-semibold">
                Squad Roster ({teamSize} Members)
              </span>
              <div className="space-y-1">
                {teamMembers.map((m, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[11px] font-mono text-slate-300 bg-white/[0.03] px-2 py-1 rounded border border-white/5">
                    <span className="truncate max-w-[140px] font-semibold text-white">
                      #{idx + 2} {m.name.trim() || `Member ${idx + 2}`}
                    </span>
                    <span className="text-[10px] text-cyan-400/90 truncate max-w-[110px]">
                      {m.regNo.trim() || "Reg No."}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer: Stamp, Barcode & Verification */}
        <div className="border-t border-dashed border-white/15 pt-3 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ENTRY PERMITTED</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
              PASS: <strong className="text-white">{passId}</strong>
            </span>
          </div>

          <div className="flex flex-col items-center">
            <div className="p-1 rounded-lg bg-white text-black shadow-md">
              <QrCode className="w-8 h-8" />
            </div>
            <span className="text-[8px] font-mono text-slate-400 mt-1 uppercase tracking-wider">
              SCAN AT VENUE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
