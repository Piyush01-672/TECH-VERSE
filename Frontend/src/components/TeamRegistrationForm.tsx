import { useState, useEffect } from "react";
import { registerCodeCrafterTeam, registerRoboMechTeam } from "../services/api";
import { Target } from "lucide-react";

interface TeamRegistrationFormProps {
  displayEvent: "cc" | "rm";
  onDisplayEventChange: (e: "cc" | "rm") => void;
}

const TeamRegistrationForm = ({ displayEvent, onDisplayEventChange }: TeamRegistrationFormProps) => {
  const [formData, setFormData] = useState({
    teamName: "",
    teamSize: 2,
    selectedEvent: "",
    selectedTheme: "",
    transactionId: "",
    transactionImage: null as File | null,
    accommodationRequired: "No",
    accommodationDetails: {
      boysCount: 0,
      girlsCount: 0,
    },
    extraGaming: "None",
    participants: [
      { name: "", email: "", contactNumber: "", gender: "", college: "", program: "" },
      { name: "", email: "", contactNumber: "", gender: "", college: "", program: "" },
      { name: "", email: "", contactNumber: "", gender: "", college: "", program: "" },
      { name: "", email: "", contactNumber: "", gender: "", college: "", program: "" },
      { name: "", email: "", contactNumber: "", gender: "", college: "", program: "" },
    ],
    referralType: "",
    referralCommunityName: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (error) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [error]);

  useEffect(() => {
    const event = displayEvent === "cc" ? "Code Crafter 3.0 (Hackathon)" : "Robo Mec 2.0";
    if (formData.selectedEvent !== event) {
      setFormData(prev => ({
        ...prev,
        selectedEvent: event,
        teamSize: event === "Code Crafter 3.0 (Hackathon)" && prev.teamSize > 4 ? 4 : prev.teamSize
      }));
    }
  }, [displayEvent]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "teamSize") {
      const newSize = Math.min(Math.max(parseInt(value, 10) || 2, 2), 5);
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, transactionImage: file }));
  };

  const handleAccommodationChange = (field: "boysCount" | "girlsCount", value: string) => {
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

  const handleParticipantChange = (index: number, field: string, value: string) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const submissionData = {
        ...formData,
        participants: formData.participants.slice(0, formData.teamSize),
      };
      const emails = submissionData.participants.map((p) => p.email.trim().toLowerCase());
      if (new Set(emails).size !== emails.length) {
        setError("Participants must have unique emails.");
        setLoading(false);
        return;
      }

      if (!formData.transactionImage) {
        setError("Please upload a transaction proof image.");
        setLoading(false);
        return;
      }

      // Convert to FormData for file upload
      const formPayload = new FormData();
      formPayload.append("teamName", submissionData.teamName);
      formPayload.append("teamSize", submissionData.teamSize.toString());
      formPayload.append("selectedEvent", submissionData.selectedEvent);
      formPayload.append("transactionId", submissionData.transactionId);
      formPayload.append("transactionImage", submissionData.transactionImage);
      formPayload.append("accommodationRequired", submissionData.accommodationRequired);
      formPayload.append("accommodationDetails", JSON.stringify(submissionData.accommodationDetails));
      formPayload.append("extraGaming", submissionData.extraGaming as string);
      formPayload.append("referralType", submissionData.referralType);
      formPayload.append("referralCommunityName", submissionData.referralCommunityName);
      formPayload.append("participants", JSON.stringify(submissionData.participants));

      if (submissionData.selectedEvent === "Code Crafter 3.0 (Hackathon)") {
        formPayload.append("selectedTheme", submissionData.selectedTheme);
      }

      if (submissionData.selectedEvent === "Code Crafter 3.0 (Hackathon)") {
        await registerCodeCrafterTeam(formPayload as any);
      } else if (submissionData.selectedEvent === "Robo Mec 2.0") {
        await registerRoboMechTeam(formPayload as any);
      }
      setSubmitted(true);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      teamName: "",
      teamSize: 2,
      selectedEvent: "",
      selectedTheme: "",
      transactionId: "",
      transactionImage: null,
      accommodationRequired: "No",
      accommodationDetails: { boysCount: 0, girlsCount: 0 },
      extraGaming: "None",
      participants: [
        { name: "", email: "", contactNumber: "", gender: "", college: "", program: "" },
        { name: "", email: "", contactNumber: "", gender: "", college: "", program: "" },
        { name: "", email: "", contactNumber: "", gender: "", college: "", program: "" },
        { name: "", email: "", contactNumber: "", gender: "", college: "", program: "" },
        { name: "", email: "", contactNumber: "", gender: "", college: "", program: "" },
      ],
      referralType: "",
      referralCommunityName: "",
    });
    setSubmitted(false);
    setError(null);
  };

  const inputClass = "w-full p-4 rounded-none border border-[#1A5BFF]/40 bg-[#060a12]/80 backdrop-blur-md focus:border-[#00F0FF] focus:shadow-[0_0_15px_rgba(0,240,255,0.3)] focus:outline-none transition-all duration-300 text-white placeholder-white/20 font-mono text-sm";
  const labelClass = "text-[10px] uppercase font-bold tracking-[0.2em] text-[#00F0FF] mb-2 block";
  const sectionTitleClass = "text-xl font-black text-[#FFD54F] uppercase tracking-[0.2em] border-b border-[#1A5BFF]/30 pb-3 mb-8 flex items-center gap-3";

  const renderParticipantFields = () => {
    const participantFields = [];
    for (let i = 0; i < formData.teamSize; i++) {
      const ordinalSuffix = ["First", "Second", "Third", "Fourth", "Fifth"][i];
      participantFields.push(
        <div key={`participant-${i}`} className="relative p-6 bg-[#0a0f18] border border-[#1A5BFF]/30 hover:border-[#00F0FF]/60 transition-colors duration-300 group">
          {/* Cyber bracket corners */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#1A5BFF] group-hover:border-[#00F0FF] transition-colors"></div>
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#1A5BFF] group-hover:border-[#00F0FF] transition-colors"></div>

          <h3 className="text-lg font-black text-[#00F0FF] uppercase tracking-widest mb-6 border-b border-[#1A5BFF]/20 pb-2">
            {ordinalSuffix} Participant
            {i === 0 && <span className="ml-3 text-xs text-[#FFD54F] tracking-[0.3em] font-normal">[ LEADER ]</span>}
          </h3>

          <div className="space-y-5">
            <div>
              <label className={labelClass}>Call Sign (Name) *</label>
              <input type="text" name={`participant${i + 1}Name`} value={formData.participants[i].name} onChange={(e) => handleParticipantChange(i, "name", e.target.value)} required placeholder={`Enter name`} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Network Uplink (Email) *</label>
              <input type="email" name={`participant${i + 1}Email`} value={formData.participants[i].email} onChange={(e) => handleParticipantChange(i, "email", e.target.value)} required placeholder={`Enter email`} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Comms Link (10-Digit Mobile) *</label>
              <input type="tel" name={`participant${i + 1}Contact`} value={formData.participants[i].contactNumber} onChange={(e) => handleParticipantChange(i, "contactNumber", e.target.value)} required pattern="[0-9]{10}" placeholder="Operator's contact number" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Identity (Gender) *</label>
              <select name={`participant${i + 1}Gender`} value={formData.participants[i].gender} onChange={(e) => handleParticipantChange(i, "gender", e.target.value)} required className={inputClass + " appearance-none"}>
                <option value="" className="bg-[#060a12] text-white/50">Select gender</option>
                <option value="Male" className="bg-[#060a12] text-white">Male</option>
                <option value="Female" className="bg-[#060a12] text-white">Female</option>
                <option value="Other" className="bg-[#060a12] text-white">Other</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Base Station (College) *</label>
              <input type="text" name="college" value={formData.participants[i].college} onChange={(e) => handleParticipantChange(i, "college", e.target.value)} required placeholder="Institution Name" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Program Module *</label>
              <input type="text" name="program" value={formData.participants[i].program} onChange={(e) => handleParticipantChange(i, "program", e.target.value)} required placeholder="B.Tech, BCA, etc." className={inputClass} />
            </div>
          </div>
        </div>
      );
    }
    return participantFields;
  };

  return (
    <div className="animate-fade-in-up font-mono">
      {submitted ? (
        <div className="text-center py-16 bg-[#0a0f18] border border-[#00F0FF] shadow-[0_0_40px_rgba(0,240,255,0.15)] relative">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#00F0FF]"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#00F0FF]"></div>

          <div className="w-24 h-24 mx-auto rounded-none border-2 border-[#00F0FF] bg-[#00F0FF]/10 flex items-center justify-center text-[#00F0FF] text-4xl mb-8 shadow-[0_0_30px_rgba(0,240,255,0.4)] relative before:absolute before:inset-0 before:-m-2 before:border before:border-[#00F0FF]/30 before:animate-spin-slow">
            <Target size={40} className="animate-pulse" />
          </div>
          <h3 className="text-2xl font-black text-white uppercase tracking-[0.3em] mb-4">
            Registration Verified
          </h3>
          <p className="text-[#00F0FF]/70 mb-10 text-sm tracking-widest max-w-md mx-auto">
            SYSTEM AUTHENTICATED. TEAM HAS BEEN ADDED TO THE HACKATHON PROTOCOL GRID.
          </p>
          <button onClick={handleReset} className="px-10 py-4 border border-[#00F0FF] bg-[#00F0FF]/10 text-[#00F0FF] font-black uppercase tracking-[0.2em] hover:bg-[#00F0FF] hover:text-[#060a12] hover:shadow-[0_0_30px_#00F0FF] transition-all">
            REGISTER ANOTHER ALLIANCE
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-12">
          {error && (
            <div className="p-4 border-l-4 border-red-500 bg-red-500/10 text-red-500 text-sm font-bold uppercase tracking-widest flex items-center gap-3 animate-pulse">
              <span>[!]</span> {error}
            </div>
          )}

          {/* Section 1: Team Info */}
          <div className="space-y-6">
            <h2 className={sectionTitleClass}>
              <span className="w-2 h-2 bg-[#FFD54F] inline-block animate-ping"></span>
              Squad Configuration
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className={labelClass}>Alliance Designation (Team Name) *</label>
                <input type="text" name="teamName" value={formData.teamName} onChange={handleChange} required placeholder="Enter your team's name" className={inputClass} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={labelClass}>CHOOSE YOUR FIGHT *</label>
                <select name="selectedEvent" value={formData.selectedEvent} onChange={(e) => {
                  const event = e.target.value;
                  onDisplayEventChange(event === "Code Crafter 3.0 (Hackathon)" ? "cc" : "rm");
                }} required className={inputClass + " appearance-none cursor-pointer"}>
                  <option value="" disabled className="bg-[#060a12]">Select your fight</option>
                  <option value="Code Crafter 3.0 (Hackathon)" disabled className="bg-[#060a12] text-gray-500">Code Crafter 3.0 (Hackathon) - CLOSED</option>
                  <option value="Robo Mec 2.0" className="bg-[#060a12]">Robo Mec 2.0</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Total Units (Size) *</label>
                <select name="teamSize" value={formData.teamSize} onChange={handleChange} className={inputClass + " appearance-none cursor-pointer"} disabled={!formData.selectedEvent}>
                  <option value="2" className="bg-[#060a12]">2 Operators</option>
                  <option value="3" className="bg-[#060a12]">3 Operators</option>
                  <option value="4" className="bg-[#060a12]">4 Operators</option>
                  {formData.selectedEvent === "Robo Mec 2.0" && (
                    <option value="5" className="bg-[#060a12]">5 Operators</option>
                  )}
                </select>
                {!formData.selectedEvent && <p className="text-[9px] text-[#00F0FF]/50 mt-1 italic">Please select an event first</p>}
              </div>
            </div>
          </div>

          {/* Section 1.5: Theme Selection (Conditional) */}
          {formData.selectedEvent === "Code Crafter 3.0 (Hackathon)" && (
            <div className="space-y-6 animate-fade-in">
              <h2 className={sectionTitleClass}>
                <span className="w-2 h-2 bg-[#FFD54F] inline-block animate-ping"></span>
                Theme Selection
              </h2>
              <div className="space-y-2">
                <label className={labelClass}>Choose Theme for Hackathon *</label>
                <select name="selectedTheme" value={formData.selectedTheme} onChange={handleChange} required className={inputClass + " appearance-none cursor-pointer"}>
                  <option value="" disabled className="bg-[#060a12]">Select a theme</option>
                  <option value="FinTech" className="bg-[#060a12]">FinTech</option>
                  <option value="Agri tech" className="bg-[#060a12]">Agri tech</option>
                  <option value="HealthTech" className="bg-[#060a12]">HealthTech</option>
                  <option value="Open Innovation" className="bg-[#060a12]">Open Innovation</option>
                </select>
              </div>
            </div>
          )}

          {/* Section 2: Participants */}
          <div className="space-y-6">
            <h2 className={sectionTitleClass}>
              <span className="w-2 h-2 bg-[#FFD54F] inline-block animate-ping"></span>
              Operator Details [{formData.teamSize}]
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {renderParticipantFields()}
            </div>
          </div>


          {/* Section 3: Accommodation */}
          <div className="space-y-6">
            <h2 className={sectionTitleClass}>
              <span className="w-2 h-2 bg-[#FFD54F] inline-block animate-ping"></span>
              Stasis Quarters (Accommodation)
            </h2>
            <select name="accommodationRequired" value={formData.accommodationRequired} onChange={handleChange} className={inputClass + " appearance-none"}>
              <option value="No" className="bg-[#060a12]">No accommodation required</option>
              <option value="Yes" className="bg-[#060a12]">Yes, we need accommodation</option>
            </select>

            {formData.accommodationRequired === 'Yes' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-in">
                <div className="space-y-2 pt-2">
                  <label className={labelClass}>Male Operators</label>
                  <input type="number" min="0" max={formData.teamSize} value={formData.accommodationDetails.boysCount} onChange={(e) => handleAccommodationChange("boysCount", e.target.value)} placeholder="0" className={inputClass} />
                </div>
                <div className="space-y-2 pt-2 min-h-[100px] mb-6 block">
                  <label className={labelClass}>Female Operators</label>
                  <input type="number" min="0" max={formData.teamSize} value={formData.accommodationDetails.girlsCount} onChange={(e) => handleAccommodationChange("girlsCount", e.target.value)} placeholder="0" className={`${inputClass} min-h-[50px] !h-14 block relative border-b-2`} />
                  <div className="h-6 w-full clear-both"></div>
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Extra Gaming */}
          <div className="space-y-6">
            <h2 className={sectionTitleClass}>
              <span className="w-2 h-2 bg-[#FFD54F] inline-block animate-ping"></span>
              Combat Simulator (Extra Gaming)
            </h2>
            <div className="space-y-2">
              <label className={labelClass}>Select Esports Participation</label>
              <select name="extraGaming" value={formData.extraGaming} onChange={handleChange} className={inputClass + " appearance-none cursor-pointer"}>
                <option value="None" className="bg-[#060a12]">No Extra Gaming</option>
                <option value="BGMI" className="bg-[#060a12]">BGMI (Battlegrounds Mobile India)</option>
                <option value="Valorant" className="bg-[#060a12]">Valorant</option>
              </select>
            </div>
          </div>

          {/* Section 5: Referral */}
          <div className="space-y-6">
            <h2 className={sectionTitleClass}>
              <span className="w-2 h-2 bg-[#FFD54F] inline-block animate-ping"></span>
              Referral Protocol (Optional)
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">

                <select name="referralType" value={formData.referralType} onChange={handleChange} className={inputClass + " appearance-none cursor-pointer"}>
                  <option value="" className="bg-[#060a12]">Select Referral...</option>
                  <option value="Community" className="bg-[#060a12]">Community</option>
                  <option value="Other" className="bg-[#060a12]">Other</option>
                </select>
              </div>
              {formData.referralType === "Community" && (
                <div className="space-y-2 animate-fade-in">
                  <label className={labelClass}>Community Name *</label>
                  <input type="text" name="referralCommunityName" value={formData.referralCommunityName} onChange={handleChange} placeholder="Enter your community's name" className={inputClass} required={formData.referralType === "Community"} />
                </div>
              )}
            </div>
          </div>

          {/* Section 6: Transaction */}
          <div className="space-y-6">
            <h2 className={sectionTitleClass}>
              <span className="w-2 h-2 bg-[#FFD54F] inline-block animate-ping"></span>
              Credit Transfer (Payment)
            </h2>
            <div className="bg-[#1A5BFF]/10 border border-[#1A5BFF]/30 p-6 flex flex-col md:flex-row gap-8 items-center cursor-crosshair">
              <div className="flex-1 w-full space-y-4">
                <p className="text-[#00F0FF] text-xs leading-relaxed uppercase tracking-widest border-b border-[#1A5BFF]/30 pb-2">
                  Scan the generated QR or use direct account transfer. Attach valid proof below.
                </p>
                <div className="text-white font-mono text-sm space-y-4 mt-4 tracking-wider">
                  <div>
                    <span className="text-[#FFD54F] text-xs grid opacity-70">BANK ACC NO</span>
                    <span className="font-bold text-lg text-white">0980100100004973</span>
                  </div>
                  <div>
                    <span className="text-[#FFD54F] text-xs grid opacity-70">UPI ID</span>
                    <span className="font-bold text-xl text-white">6239500585m@pnb</span>
                  </div>
                  <div>
                    <span className="text-[#FFD54F] text-xs grid opacity-70">REGISTRATION AMOUNT</span>
                    <span className="font-bold text-xl text-white">
                      {formData.selectedEvent === "Robo Mec 2.0" ? "600rs" : "500rs"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#FFD54F] text-xs grid opacity-70">MERCHANT</span>
                    <span className="font-bold text-lg text-white">CT UNIVERSITY</span>
                  </div>
                </div>
              </div>

              {/* QR Code Graphic Box (Auto-resizing to tightly hug the tall image) */}
              <div className="bg-white p-2 sm:p-3 border-2 border-[#00F0FF] relative group shadow-[0_0_30px_rgba(0,240,255,0.2)] hover:shadow-[0_0_40px_rgba(0,240,255,0.5)] transition-all shrink-0 max-w-sm flex items-center justify-center">
                <img src={`/payment_qr.jpeg?timestamp=${new Date().getTime()}`} alt="UPI QR Code" className="h-56 sm:h-64 md:h-72 w-auto object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                <div className="absolute inset-0 bg-[#00F0FF]/10 animate-pulse pointer-events-none"></div>
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-[#00F0FF]"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-[#00F0FF]"></div>
              </div>
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Transmission Hash (Txn ID) *</label>
              <input type="text" name="transactionId" value={formData.transactionId} onChange={handleChange} required placeholder="e.g. UTR / Ref Number" className={inputClass} />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Visual Proof (Screenshot) *</label>
              <input type="file" accept="image/*" onChange={handleFileChange} required className="w-full p-2 sm:p-3 rounded-none border border-[#1A5BFF]/40 bg-[#0a0f18] text-[#00F0FF] focus:border-[#00F0FF] transition-all file:mr-3 sm:file:mr-6 file:py-2 sm:file:py-3 file:px-3 sm:file:px-6 file:border-0 file:text-[10px] sm:file:text-xs file:font-black file:uppercase file:tracking-[0.1em] sm:file:tracking-[0.2em] file:bg-[#00F0FF] file:text-[#060a12] hover:file:bg-[#FFD54F] hover:file:text-[#060a12] file:transition-colors file:cursor-pointer cursor-pointer text-xs sm:text-sm overflow-hidden text-ellipsis whitespace-nowrap" />
            </div>
          </div>

          <div className="pt-8 relative">
            <button type="submit" disabled={loading} className="w-full relative py-4 sm:py-6 bg-[#00F0FF]/10 text-[#00F0FF] font-black uppercase tracking-[0.15em] sm:tracking-[0.4em] text-sm sm:text-xl border border-[#00F0FF] hover:bg-[#00F0FF] hover:text-[#060a12] shadow-[0_0_20px_rgba(0,240,255,0.1)] hover:shadow-[0_0_40px_rgba(0,240,255,0.6)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] bg-no-repeat bg-[position:-100%_0,0_0] group-hover:animate-[shimmer_1.5s_infinite]"></div>
              <span className="relative z-10 flex items-center justify-center gap-4">
                {loading ? "PROCESSING..." : "FINALIZE REGISTRATION"}
              </span>
            </button>
          </div>
        </form>
      )}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
};

export default TeamRegistrationForm;
