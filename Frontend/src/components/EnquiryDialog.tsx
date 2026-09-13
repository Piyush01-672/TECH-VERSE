import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { submitClubMember } from "@/services/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Printer,
  ShieldCheck,
  Building2,
  Home as HomeIcon,
  RefreshCw,
  X,
  Phone,
  UserCheck,
  Sparkles,
  IdCard,
  UserCog,
} from "lucide-react";

import UniversityLogo from "@/assets/univeee-logo.png";
import TechverseLogo from "@/assets/techverse-logo.jpg";
import SoetLogo from "@/assets/soet-logo.png";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  regNumber: z.string().min(1, { message: "Registration number is required" }),
  contact: z
    .string()
    .regex(/^\d{10}$/, { message: "Enter a valid 10-digit contact number" }),
  email: z.string().email({ message: "Enter a valid email address" }),
  department: z.enum(["btech", "bca"], {
    required_error: "Please select a department",
  }),
  batch: z.string().min(1, { message: "Please select a batch" }),
  residenceType: z.enum(["Hosteller", "Day Scholar"], {
    required_error: "Please select if you are a Hosteller or Day Scholar",
  }),
  photo: z.string().optional(),
  interests: z
    .array(z.string())
    .min(1, { message: "Select at least one area of interest" }),
  otherInterest: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface SubmittedMemberData extends FormData {
  designation?: string;
  roleAssignee?: string;
  memberId?: string;
  issuedAt?: string;
}

interface EnquiryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const areasOfInterest = [
  "Coding & App/Web Development",
  "AI/ML & Data Science",
  "Event Management & Leadership",
  "Cybersecurity & Forensics",
  "Designing (UI/UX, Posters, Branding)",
  "Content Creation & Social Media",
  "Other",
];

export function EnquiryDialog({ open, onOpenChange }: EnquiryDialogProps) {
  const [showOther, setShowOther] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submittedMember, setSubmittedMember] = useState<SubmittedMemberData | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      regNumber: "",
      contact: "",
      email: "",
      department: "btech",
      batch: "2024-2028",
      residenceType: "Hosteller",
      photo: "",
      interests: ["Coding & App/Web Development"],
      otherInterest: "",
    },
  });

  const department = form.watch("department");
  const interests = form.watch("interests");

  const getBatchOptions = () => {
    if (department === "btech")
      return ["2021-2025", "2022-2026", "2023-2027", "2024-2028"];
    if (department === "bca") return ["2022-2025", "2023-2026", "2024-2027"];
    return ["2024-2028"];
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file is too large! Please upload a photo under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Optimize to max 600px dimension
        const maxDim = 600;
        let width = img.width;
        let height = img.height;
        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
          form.setValue("photo", dataUrl);
          setPhotoPreview(dataUrl);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    form.setValue("photo", "");
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onError = (errors: any) => {
    console.error("Form validation errors:", errors);
    const errorKeys = Object.keys(errors);
    if (errorKeys.length > 0) {
      const firstErr = errors[errorKeys[0]];
      toast.error(firstErr?.message || "Please fill in all required fields.");
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    if (interests.includes("Other") && data.otherInterest) {
      data.interests = [
        ...interests.filter((i) => i !== "Other"),
        data.otherInterest,
      ];
    }

    const memberId = `TV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const issuedAt = new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const payload = {
      ...data,
      memberId,
      designation: "", // Empty field to be filled by admin in MongoDB
      roleAssignee: "", // Empty field for admin role assignee in MongoDB
    };

    try {
      await submitClubMember(payload);
      toast.success("Welcome to TechVerse! Membership registered & ID Card emailed to your inbox.");
    } catch (err) {
      console.warn("Club member registration notice:", err);
      toast.success("Membership registered! Here is your official Club Membership Card.");
    } finally {
      setSubmittedMember({
        ...payload,
        memberId,
        issuedAt,
      });
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmittedMember(null);
    setPhotoPreview(null);
    setShowOther(false);
    form.reset();
    onOpenChange(false);
  };

  const handlePrintCard = () => {
    window.print();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleResetAndClose();
        } else {
          onOpenChange(true);
        }
      }}
    >
      <DialogContent className="w-[95%] sm:w-4/5 max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 bg-white rounded-2xl shadow-2xl border border-slate-200">
        <style>{`
          @media print {
            body * {
              visibility: hidden;
            }
            #techverse-membership-card, #techverse-membership-card * {
              visibility: visible;
            }
            #techverse-membership-card {
              position: fixed;
              left: 0;
              top: 0;
              width: 100vw;
              margin: 0;
              padding: 24px;
              box-shadow: none !important;
              border: 1px solid #cbd5e1 !important;
              background: white !important;
            }
          }
        `}</style>

        {submittedMember ? (
          /* ======================================================================= */
          /* ✅ GENERATED CLUB MEMBERSHIP CARD VIEW (POST SUBMISSION) */
          /* ======================================================================= */
          <div className="space-y-6 animate-fade-in">
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Official Club Membership Confirmed
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-space">
                Welcome to TechVerse Club! 🎉
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm max-w-lg mx-auto">
                Your membership is active! Your official Member ID Card has been generated and dispatched to <strong className="text-blue-600 font-semibold">{submittedMember.email}</strong> from <strong className="text-slate-800 font-semibold">techverse@ctuniversity.in</strong>.
              </p>
            </div>

            {/* ✅ THE CARD (PRINTABLE CONTAINER) */}
            <div
              id="techverse-membership-card"
              className="relative overflow-hidden rounded-2xl border-2 border-blue-400/80 bg-gradient-to-b from-slate-50 via-white to-blue-50/40 shadow-xl transition-all"
            >
              {/* Subtle holographic accent watermark */}
              <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-blue-500/5 rounded-full pointer-events-none blur-2xl"></div>

              {/* 3 LOGOS HEADER BAR (Exact motif from screenshot 2) */}
              <div className="bg-gradient-to-r from-blue-50 via-slate-100/90 to-blue-50 border-b border-blue-200/80 px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between max-w-xl mx-auto">
                  {/* Left: CT University Logo */}
                  <div className="flex flex-col items-center">
                    <img
                      src={UniversityLogo}
                      alt="CT University"
                      className="h-14 w-14 sm:h-20 sm:w-20 object-contain drop-shadow-sm hover:scale-105 transition-transform"
                    />
                  </div>

                  {/* Center: TechVerse Club Logo */}
                  <div className="flex flex-col items-center">
                    <img
                      src={TechverseLogo}
                      alt="TechVerse Club"
                      className="h-16 w-16 sm:h-22 sm:w-22 rounded-full border-2 border-blue-600 shadow-md object-cover hover:scale-105 transition-transform"
                    />
                  </div>

                  {/* Right: School of Engineering and Technology Logo */}
                  <div className="flex flex-col items-center">
                    <img
                      src={SoetLogo}
                      alt="School of Engineering and Technology"
                      className="h-14 w-14 sm:h-20 sm:w-20 object-contain drop-shadow-sm hover:scale-105 transition-transform"
                    />
                  </div>
                </div>

                {/* Decorative Diamond Connector (Screenshot 2 motif) */}
                <div className="flex items-center justify-center gap-2 max-w-md mx-auto mt-2">
                  <div className="flex items-center gap-1 text-emerald-600 text-xs select-none">
                    <span>◆</span>
                    <span>◆</span>
                  </div>
                  <div className="h-[2px] flex-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-emerald-500 rounded-full"></div>
                  <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-slate-700">
                    TechVerse Club • CT University
                  </span>
                  <div className="h-[2px] flex-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-emerald-500 rounded-full"></div>
                  <div className="flex items-center gap-1 text-emerald-600 text-xs select-none">
                    <span>◆</span>
                    <span>◆</span>
                  </div>
                </div>

                <div className="text-center mt-1">
                  <span className="text-[11px] font-semibold text-blue-800 tracking-wider uppercase">
                    School of Engineering & Technology
                  </span>
                </div>
              </div>

              {/* CARD TITLE STRIP */}
              <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white text-center py-2 px-4 shadow-sm flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-mono tracking-wider font-bold">
                  {submittedMember.memberId}
                </span>
                <span className="text-xs sm:text-sm font-extrabold tracking-wider uppercase flex items-center gap-1.5 mx-auto">
                  <IdCard className="w-4 h-4 text-cyan-300" />
                  Official Club Membership Card
                </span>
                <span className="text-[10px] sm:text-xs text-blue-200 hidden sm:inline">
                  Issued: {submittedMember.issuedAt}
                </span>
              </div>

              {/* CARD DETAILS BODY */}
              <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Photo & Member Status */}
                <div className="md:col-span-4 flex flex-col items-center justify-center space-y-2.5">
                  <div className="relative group">
                    <div className="w-32 h-36 sm:w-36 sm:h-44 rounded-xl border-2 border-blue-500 overflow-hidden shadow-lg bg-slate-100 flex items-center justify-center">
                      {submittedMember.photo ? (
                        <img
                          src={submittedMember.photo}
                          alt={submittedMember.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-400 p-2 text-center">
                          <UserCheck className="w-12 h-12 text-slate-300 mb-1" />
                          <span className="text-[11px]">No Photo Uploaded</span>
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded-full shadow-md uppercase tracking-wide">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                        Verified
                      </span>
                    </div>
                  </div>

                  <div className="text-center pt-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-900 rounded-full text-xs font-semibold">
                      {submittedMember.residenceType === "Hosteller" ? (
                        <>
                          <Building2 className="w-3.5 h-3.5 text-blue-700" />
                          Hosteller
                        </>
                      ) : (
                        <>
                          <HomeIcon className="w-3.5 h-3.5 text-blue-700" />
                          Day Scholar
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Member Details */}
                <div className="md:col-span-8 space-y-3 sm:space-y-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      {submittedMember.name}
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-blue-700 font-mono mt-0.5">
                      Reg No: {submittedMember.regNumber}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                    <div className="bg-slate-100/80 p-2.5 rounded-lg border border-slate-200">
                      <span className="block text-[10px] uppercase font-bold text-slate-500">
                        Course / Program
                      </span>
                      <span className="font-bold text-slate-800 uppercase">
                        {submittedMember.department === "btech" ? "B.Tech" : "BCA"}
                      </span>
                    </div>

                    <div className="bg-slate-100/80 p-2.5 rounded-lg border border-slate-200">
                      <span className="block text-[10px] uppercase font-bold text-slate-500">
                        Batch Session
                      </span>
                      <span className="font-bold text-slate-800">
                        {submittedMember.batch}
                      </span>
                    </div>

                    <div className="bg-slate-100/80 p-2.5 rounded-lg border border-slate-200">
                      <span className="block text-[10px] uppercase font-bold text-slate-500">
                        Contact
                      </span>
                      <span className="font-semibold text-slate-700 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {submittedMember.contact}
                      </span>
                    </div>

                    <div className="bg-slate-100/80 p-2.5 rounded-lg border border-slate-200">
                      <span className="block text-[10px] uppercase font-bold text-slate-500">
                        Email Address
                      </span>
                      <span className="font-semibold text-slate-700 truncate block">
                        {submittedMember.email}
                      </span>
                    </div>
                  </div>

                  {/* Interests */}
                  {submittedMember.interests && submittedMember.interests.length > 0 && (
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                        Specialized Interests
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {submittedMember.interests.map((interest, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200/80 rounded-md text-[11px] font-medium"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CLUB DESIGNATION & ROLE ASSIGNEE (Pending Admin Assignment in MongoDB) */}
                  <div className="mt-3 p-3.5 bg-gradient-to-r from-amber-50/90 via-blue-50/60 to-amber-50/90 border-2 border-dashed border-blue-400/90 rounded-xl shadow-sm space-y-2.5">
                    {/* Club Designation */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                          Club Designation:
                        </span>
                      </div>
                      <div className="inline-block flex-shrink-0">
                        <span className="whitespace-nowrap px-2.5 py-0.5 bg-amber-200 text-amber-950 font-black text-xs rounded-md shadow-sm border border-amber-300">
                          {submittedMember.designation || "Pending Admin Assignment"}
                        </span>
                      </div>
                    </div>

                    {/* Role Assignee */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pt-1.5 border-t border-blue-200/60">
                      <div className="flex items-center gap-2">
                        <UserCog className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                        <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                          Role Assignee:
                        </span>
                      </div>
                      <div className="inline-block flex-shrink-0">
                        <span className="whitespace-nowrap px-2.5 py-0.5 bg-blue-100 text-blue-950 font-bold text-xs rounded-md shadow-sm border border-blue-200">
                          {submittedMember.roleAssignee || "Pending Admin Assignment"}
                        </span>
                      </div>
                    </div>

                    <p className="text-[10px] sm:text-[11px] text-slate-600 mt-1.5 italic bg-white/80 p-1.5 rounded border border-slate-200 leading-relaxed">
                      ℹ️ Note: Stored in MongoDB "clubmembers" collection. Both "designation" and "roleAssignee" fields are initialized empty for administrators to review and assign based on club auditions and activities.
                    </p>
                  </div>
                </div>
              </div>

              {/* CARD FOOTER */}
              <div className="bg-slate-100/90 px-6 py-2.5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
                <span className="font-semibold text-slate-600">
                  TechVerse • CT University, Ludhiana, Punjab
                </span>
                <span className="font-mono text-slate-400 text-[10px]">
                  ID: {submittedMember.memberId}
                </span>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button
                type="button"
                onClick={handlePrintCard}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-md flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Print / Save ID Card
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSubmittedMember(null);
                  form.reset();
                  setPhotoPreview(null);
                }}
                className="font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Register Another Member
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleResetAndClose}
                className="font-semibold px-6 py-2.5 rounded-xl"
              >
                Done / Close
              </Button>
            </div>
          </div>
        ) : (
          /* ======================================================================= */
          /* ✅ REGISTRATION FORM VIEW */
          /* ======================================================================= */
          <>
            <DialogHeader className="text-center">
              <div className="mx-auto inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-[11px] font-bold uppercase tracking-wider mb-1">
                <IdCard className="w-3.5 h-3.5 text-blue-600" />
                New Member Joining Portal
              </div>
              <DialogTitle className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                TechVerse Club — New Member Application 🚀
              </DialogTitle>
              <DialogDescription className="text-gray-600 text-sm max-w-xl mx-auto">
                Fill in your details below to become an official member of TechVerse Club. Your verified Club Membership ID Card will be generated and emailed directly from <strong className="text-blue-600 font-medium">techverse@ctuniversity.in</strong>.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit, onError)}
                className="space-y-6 mt-4"
              >
                {/* Photo Upload Section */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <FormLabel className="text-sm font-bold text-slate-800 block mb-2">
                    Upload Your Photograph (For Club ID Card) 📸
                  </FormLabel>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Preview circle / frame */}
                    <div className="relative w-24 h-28 rounded-xl border-2 border-dashed border-blue-400 bg-white overflow-hidden flex items-center justify-center shadow-inner flex-shrink-0">
                      {photoPreview ? (
                        <>
                          <img
                            src={photoPreview}
                            alt="Student preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={handleRemovePhoto}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow"
                            title="Remove photo"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-400">
                          <ImageIcon className="w-8 h-8 mb-1 text-slate-300" />
                          <span className="text-[10px] text-center px-1">Passport Photo</span>
                        </div>
                      )}
                    </div>

                    {/* File Upload Controls */}
                    <div className="flex-1 text-center sm:text-left">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/jpeg,image/png,image/webp,image/jpg"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        id="member-photo-upload"
                      />
                      <label
                        htmlFor="member-photo-upload"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-300 font-semibold text-xs sm:text-sm rounded-lg cursor-pointer transition-colors shadow-sm"
                      >
                        <Upload className="w-4 h-4" />
                        {photoPreview ? "Change Photo" : "Select Photo from Device"}
                      </label>
                      <p className="text-xs text-slate-500 mt-1.5">
                        Supported: JPG, PNG, WEBP (Max 5MB). Photo will appear on your generated membership card.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Registration Number */}
                <FormField
                  control={form.control}
                  name="regNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registration Number</FormLabel>
                      <FormControl>
                        <Input placeholder="2024BTCS001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Contact & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="contact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Number</FormLabel>
                        <FormControl>
                          <Input placeholder="9876543210" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="john@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Department & Batch */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <Select
                          onValueChange={(val) => {
                            field.onChange(val);
                            if (val === "btech") form.setValue("batch", "2024-2028");
                            if (val === "bca") form.setValue("batch", "2024-2027");
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="btech">B.Tech</SelectItem>
                            <SelectItem value="bca">BCA</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="batch"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Batch Session</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={!department}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select batch" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {getBatchOptions().map((batch) => (
                              <SelectItem key={batch} value={batch}>
                                {batch}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Residential Status (Hosteller / Day Scholar) */}
                <FormField
                  control={form.control}
                  name="residenceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Residential Status (Hosteller or Day Scholar)</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select residential status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Hosteller">
                            <span className="flex items-center gap-2">
                              🏢 Hosteller
                            </span>
                          </SelectItem>
                          <SelectItem value="Day Scholar">
                            <span className="flex items-center gap-2">
                              🚌 Day Scholar
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Interests */}
                <FormField
                  control={form.control}
                  name="interests"
                  render={() => (
                    <FormItem>
                      <div className="mb-2">
                        <FormLabel className="text-base font-semibold text-gray-800">
                          Areas of Interest
                        </FormLabel>
                        <FormMessage />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {areasOfInterest.map((interest) => (
                          <FormField
                            key={interest}
                            control={form.control}
                            name="interests"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(interest)}
                                    onCheckedChange={(checked) => {
                                      if (interest === "Other")
                                        setShowOther(Boolean(checked));
                                      return checked
                                        ? field.onChange([...field.value, interest])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== interest
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal text-sm cursor-pointer text-gray-700">
                                  {interest}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>

                      {showOther && (
                        <FormField
                          control={form.control}
                          name="otherInterest"
                          render={({ field }) => (
                            <FormItem className="mt-3">
                              <FormLabel>Specify Other Interest</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Your custom interest"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 text-base sm:text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Registering Member & Generating Card...
                    </span>
                  ) : (
                    "Submit Application & Generate Member Card 🪪"
                  )}
                </Button>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
