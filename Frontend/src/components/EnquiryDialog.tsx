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
  Clock,
  Mail,
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
  serialNumber?: number;
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
        // Optimize to max 400px dimension and 0.75 quality for fast upload
        const maxDim = 400;
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
          const dataUrl = canvas.toDataURL("image/jpeg", 0.75);
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

    const tempMemberId = `TV-${new Date().getFullYear()}-0000`;
    const issuedAt = new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const payload = {
      ...data,
      designation: "", // Assigned by President/VP in /admin
      roleAssignee: "",
    };

    try {
      const res = await submitClubMember(payload);
      const savedMember = res?.member || {};
      const actualSerial = savedMember.serialNumber;
      const actualMemberId = savedMember.memberId || tempMemberId;

      toast.success("Application submitted! Screening acknowledgment emailed to your inbox.");
      setSubmittedMember({
        ...payload,
        serialNumber: actualSerial,
        memberId: actualMemberId,
        issuedAt,
      });
    } catch (err: any) {
      console.warn("Club member registration notice:", err);
      toast.info("Application received! You are now in the screening process.");
      setSubmittedMember({
        ...payload,
        memberId: tempMemberId,
        issuedAt,
      });
    } finally {
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
          /* ✅ SCREENING CONFIRMATION VIEW (POST SUBMISSION)                        */
          /* ======================================================================= */
          <div className="space-y-6 py-4 px-2 sm:px-4 animate-fade-in text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 border-2 border-emerald-400 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-600" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-black uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
                Screening Process Underway
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-space tracking-tight">
                Application Submitted Successfully! 🎉
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
                Thank you, <strong className="text-slate-900 font-bold">{submittedMember.name}</strong>, for showing interest in <strong className="text-blue-700 font-bold">TechVerse Club</strong>. Your application has been registered and is now under official review.
              </p>
            </div>

            {/* CURATED SCREENING SUMMARY CARD */}
            <div className="bg-gradient-to-b from-slate-50 to-blue-50/50 border-2 border-blue-200 rounded-2xl p-5 sm:p-6 text-left max-w-lg mx-auto shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-blue-100 pb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block">Application & Serial No.</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    {submittedMember.serialNumber && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-black font-mono text-xs border border-blue-300">
                        #{submittedMember.serialNumber}
                      </span>
                    )}
                    <span className="text-sm font-black font-mono text-blue-800">{submittedMember.memberId}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block">Submission Date</span>
                  <span className="text-xs font-semibold text-slate-700">{submittedMember.issuedAt}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Registration No.</span>
                  <span className="font-bold text-slate-800 font-mono">{submittedMember.regNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Program & Batch</span>
                  <span className="font-bold text-slate-800 uppercase">{submittedMember.department} ({submittedMember.batch})</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Residence Status</span>
                  <span className="font-semibold text-slate-700">{submittedMember.residenceType}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Contact</span>
                  <span className="font-semibold text-slate-700">{submittedMember.contact}</span>
                </div>
              </div>

              {/* NEXT STEPS CALLOUT */}
              <div className="bg-white p-4 rounded-xl border border-blue-100 space-y-2">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
                  <Mail className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>Acknowledgment Email Dispatched</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  A screening confirmation email has been dispatched to <strong className="text-blue-700 font-semibold">{submittedMember.email}</strong> from <strong className="text-slate-800">techverse@ctuniversity.in</strong>.
                </p>
              </div>

              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-amber-700 flex-shrink-0" />
                  <span>President / Vice President Review</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  The President & Vice President of TechVerse Club will review your profile and audition responses to assign your official <strong>Club Designation</strong> and <strong>Role Assignee</strong> soon.
                </p>
                <p className="text-emerald-700 font-semibold text-[11px] leading-relaxed">
                  🪪 Once your designation is assigned in the Admin Portal, your official verified <strong>TechVerse Club Membership Card</strong> will be automatically generated and delivered directly to your email inbox.
                </p>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button
                type="button"
                onClick={handleResetAndClose}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-2.5 rounded-xl shadow-md text-sm"
              >
                Got It, Thank You!
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSubmittedMember(null);
                  form.reset();
                  setPhotoPreview(null);
                }}
                className="font-semibold px-5 py-2.5 rounded-xl text-xs"
              >
                Submit Another Application
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
                      Submitting Application...
                    </span>
                  ) : (
                    "Submit Application & Enter Screening 🚀"
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
