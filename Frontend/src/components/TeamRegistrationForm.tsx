import { useState, useEffect } from "react";
import { registerCodeCrafterTeam } from "../services/api";

const TeamRegistrationForm = () => {
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (error) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [error]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
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
    setFormData(prev => ({ ...prev, [name]: value }));
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
      console.log("Submitting form data:", submissionData);
      await registerCodeCrafterTeam(submissionData);
      setSubmitted(true);
    } catch (err: any) {
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

  const renderParticipantFields = () => {
    const participantFields = [];
    for (let i = 0; i < formData.teamSize; i++) {
      const ordinalSuffix = ["First", "Second", "Third", "Fourth"][i];
      participantFields.push(
        <div key={`participant-${i}`} className="space-y-5">
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
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Participant Name *</label>
            <input type="text" name={`participant${i + 1}Name`} value={formData.participants[i].name} onChange={(e) => handleParticipantChange(i, "name", e.target.value)} required placeholder={`Enter ${ordinalSuffix.toLowerCase()} participant's name`} className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-background/60 backdrop-blur-md text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-[#4676E6]/50 focus:border-[#4676E6] focus:outline-none transition-all duration-200" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Participant Email *</label>
            <input type="email" name={`participant${i + 1}Email`} value={formData.participants[i].email} onChange={(e) => handleParticipantChange(i, "email", e.target.value)} required placeholder={`Enter ${ordinalSuffix.toLowerCase()} participant's email`} className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-background/60 backdrop-blur-md text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-[#4676E6]/50 focus:border-[#4676E6] focus:outline-none transition-all duration-200" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Gender *</label>
            <select name={`participant${i + 1}Gender`} value={formData.participants[i].gender} onChange={(e) => handleParticipantChange(i, "gender", e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-background/60 backdrop-blur-md text-foreground focus:ring-2 focus:ring-[#4676E6]/50 focus:border-[#4676E6] focus:outline-none transition-all duration-200 appearance-none">
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">College *</label>
            <input type="text" name="college" value={formData.participants[i].college} onChange={(e) => handleParticipantChange(i, "college", e.target.value)} required className="w-full p-3 rounded-xl border border-primary/20 bg-background/60 backdrop-blur-md focus:ring-2 focus:ring-[#4676E6]/50 focus:border-[#4676E6] focus:outline-none transition-all duration-200" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Program *</label>
            <input type="text" name="program" value={formData.participants[i].program} onChange={(e) => handleParticipantChange(i, "program", e.target.value)} required className="w-full p-3 rounded-xl border border-primary/20 bg-background/60 backdrop-blur-md focus:ring-2 focus:ring-[#4676E6]/50 focus:border-[#4676E6] focus:outline-none transition-all duration-200" />
          </div>
        </div>
      );
    }
    return participantFields;
  };

  return (
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
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-3 pb-4">
              <span className="w-2 h-8 bg-gradient-to-b from-[#252D6F] to-[#4676E6] rounded-full"></span>
              Team Information
            </h2>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Team Name *</label>
              <input type="text" name="teamName" value={formData.teamName} onChange={handleChange} required className="w-full p-3 rounded-xl border border-primary/20 bg-background/60 backdrop-blur-md focus:ring-2 focus:ring-[#4676E6]/50 focus:border-[#4676E6] focus:outline-none transition-all duration-200" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Team Size *</label>
                <select name="teamSize" value={formData.teamSize} onChange={handleChange} className="w-full p-3 rounded-lg border border-primary/20 bg-background focus:ring-2 focus:ring-primary/40">
                  <option value="2">2 Members</option>
                  <option value="3">3 Members</option>
                  <option value="4">4 Members</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Contact Number *</label>
                <input type="tel" pattern="[0-9]{10}" inputMode="numeric" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required maxLength={10} title="Please enter a 10-digit phone number" className="w-full p-3 rounded-xl border border-primary/20 bg-background/60 backdrop-blur-md focus:ring-2 focus:ring-[#4676E6]/50 focus:border-[#4676E6] focus:outline-none transition-all duration-200" />
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-3 pb-4">
              <span className="w-2 h-8 bg-gradient-to-b from-[#252D6F] to-[#4676E6] rounded-full"></span>
              Team Members ({formData.teamSize})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {renderParticipantFields().map((field: any, index: number) => (
                <div key={index} className="relative p-4 sm:p-6 rounded-2xl border border-primary/20 bg-background/70 backdrop-blur-md shadow-md hover:shadow-xl hover:-translate-y-1 hover:border-[#4676E6]/40 transition-all duration-300">
                  {field}
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-3 pb-4">
              <span className="w-2 h-8 bg-gradient-to-b from-[#252D6F] to-[#4676E6] rounded-full"></span>
              Accommodation
            </h2>
            <select name="accommodationRequired" value={formData.accommodationRequired} onChange={handleChange} className="w-full p-3 rounded-lg border border-primary/20 bg-background focus:ring-2 focus:ring-primary/40">
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
            {formData.accommodationRequired === "Yes" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Boys Requiring Accommodation</label>
                  <input type="number" min="0" max={formData.teamSize} value={formData.accommodationDetails.boysCount} onChange={(e) => handleAccommodationChange("boysCount", e.target.value)} disabled={formData.accommodationRequired !== "Yes"} placeholder="Boys" className="w-full p-3 rounded-xl border border-primary/20 bg-background/60 backdrop-blur-md focus:ring-2 focus:ring-[#4676E6]/50 focus:border-[#4676E6] focus:outline-none transition-all duration-200" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Girls Requiring Accommodation</label>
                  <input type="number" min="0" max={formData.teamSize} value={formData.accommodationDetails.girlsCount} onChange={(e) => handleAccommodationChange("girlsCount", e.target.value)} disabled={formData.accommodationRequired !== "Yes"} placeholder="Girls" className="w-full p-3 rounded-xl border border-primary/20 bg-background/60 backdrop-blur-md focus:ring-2 focus:ring-[#4676E6]/50 focus:border-[#4676E6] focus:outline-none transition-all duration-200" />
                </div>
              </div>
            )}
          </div>
          <div className="pt-6">
            <button type="submit" disabled={loading} className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#252D6F] to-[#4676E6] text-white font-semibold text-lg shadow-lg hover:shadow-2xl hover:scale-[1.02] active:scale-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Submitting..." : "Register Team"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TeamRegistrationForm;
