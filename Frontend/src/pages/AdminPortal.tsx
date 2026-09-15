import React, { useState, useEffect, useMemo } from "react";
import { 
  Users, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  Trophy, 
  ShieldCheck, 
  Save, 
  RefreshCw, 
  Eye, 
  Phone, 
  Mail, 
  GraduationCap, 
  Building2, 
  Home as HomeIcon, 
  Sparkles, 
  Layers, 
  Calendar,
  ExternalLink,
  ChevronRight,
  UserCheck,
  AlertCircle,
  Lock,
  LogOut,
  KeyRound,
  ShieldAlert
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  getClubMembers, 
  updateClubMemberRole, 
  getEnquiries, 
  getContacts, 
  getEngineersDayStats,
  adminLogin,
  verifyAdminToken
} from "@/services/api";

export interface ClubMemberItem {
  _id: string;
  serialNumber?: number;
  memberId?: string;
  name: string;
  regNumber: string;
  contact: string;
  email: string;
  department: string;
  batch: string;
  residenceType?: string;
  photo?: string;
  interests?: string[];
  otherInterest?: string;
  designation?: string;
  roleAssignee?: string;
  role?: string;
  status?: string;
  cardSent?: boolean;
  screeningEmailSent?: boolean;
  cardSentAt?: string;
  createdAt?: string;
}

export interface EnquiryItem {
  _id: string;
  name: string;
  email: string;
  contact?: string;
  department?: string;
  batch?: string;
  interests?: string[];
  otherInterest?: string;
  createdAt?: string;
}

export interface ContactItem {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message?: string;
  createdAt?: string;
}

export default function AdminPortal() {
  // Admin Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [loginEmail, setLoginEmail] = useState<string>("techverse@ctuniversity.in");
  const [loginPassword, setLoginPassword] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<"members" | "queries" | "arenas">("members");
  const [loading, setLoading] = useState<boolean>(false);
  const [savingId, setSavingId] = useState<string | null>(null);

  // Data states
  const [members, setMembers] = useState<ClubMemberItem[]>([]);
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [eventStats, setEventStats] = useState<any>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  // Local editable draft state for role/designation
  const [editDrafts, setEditDrafts] = useState<{ [id: string]: { designation: string; roleAssignee: string } }>({});

  const loadData = async () => {
    setLoading(true);
    try {
      const [membersData, enquiriesData, contactsData, statsData] = await Promise.allSettled([
        getClubMembers(),
        getEnquiries(),
        getContacts(),
        getEngineersDayStats(),
      ]);

      if (membersData.status === "fulfilled" && Array.isArray(membersData.value)) {
        setMembers(membersData.value);
        // Initialize editable drafts
        const initialDrafts: any = {};
        membersData.value.forEach((m: ClubMemberItem) => {
          initialDrafts[m._id] = {
            designation: m.designation || "",
            roleAssignee: m.roleAssignee || "",
          };
        });
        setEditDrafts(initialDrafts);
      }

      if (enquiriesData.status === "fulfilled" && Array.isArray(enquiriesData.value)) {
        setEnquiries(enquiriesData.value);
      }

      if (contactsData.status === "fulfilled" && Array.isArray(contactsData.value)) {
        setContacts(contactsData.value);
      }

      if (statsData.status === "fulfilled" && statsData.value?.breakdown) {
        setEventStats(statsData.value);
      }
    } catch (err) {
      console.error("Error loading admin data:", err);
      toast.error("Failed to load some admin data from backend.");
    } finally {
      setLoading(false);
    }
  };

  // Check admin session on mount
  useEffect(() => {
    const token = localStorage.getItem("techverse_admin_token");
    if (!token) {
      setIsAuthenticated(false);
      setAuthChecking(false);
      return;
    }

    verifyAdminToken(token)
      .then((res) => {
        if (res && res.valid) {
          setIsAuthenticated(true);
          loadData();
        } else {
          localStorage.removeItem("techverse_admin_token");
          setIsAuthenticated(false);
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
      })
      .finally(() => {
        setAuthChecking(false);
      });
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    const cleanEmail = loginEmail.trim().toLowerCase();
    if (cleanEmail !== "techverse@ctuniversity.in") {
      setLoginError("Unauthorized: Only techverse@ctuniversity.in is authorized to access the Admin Portal.");
      toast.error("Access Denied: Only techverse@ctuniversity.in is authorized.");
      return;
    }

    if (!loginPassword) {
      setLoginError("Please enter the administrator password.");
      return;
    }

    setIsLoggingIn(true);
    try {
      const res = await adminLogin({ email: cleanEmail, password: loginPassword });
      if (res && res.token) {
        localStorage.setItem("techverse_admin_token", res.token);
        localStorage.setItem("techverse_admin_email", cleanEmail);
        setIsAuthenticated(true);
        toast.success("Welcome back, TechVerse Administrator!");
        loadData();
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Invalid administrative credentials.";
      setLoginError(msg);
      toast.error(msg);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("techverse_admin_token");
    localStorage.removeItem("techverse_admin_email");
    setIsAuthenticated(false);
    toast.info("Logged out of TechVerse Admin Portal.");
  };

  const handleDraftChange = (id: string, field: "designation" | "roleAssignee", value: string) => {
    setEditDrafts((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleSaveRole = async (id: string) => {
    const draft = editDrafts[id];
    if (!draft) return;

    setSavingId(id);
    try {
      const res = await updateClubMemberRole(id, {
        designation: draft.designation.trim(),
        roleAssignee: draft.roleAssignee.trim(),
      });

      const cardEmailed = Boolean(res?.cardEmailSent);

      // Update local members list
      setMembers((prev) =>
        prev.map((m) =>
          m._id === id
            ? { 
                ...m, 
                designation: draft.designation.trim(), 
                roleAssignee: draft.roleAssignee.trim(),
                status: draft.designation.trim() ? "Active" : "Under Screening",
                cardSent: cardEmailed || m.cardSent,
              }
            : m
        )
      );

      if (cardEmailed) {
        toast.success(`🎉 Designation assigned & Official Club Card emailed to member!`);
      } else if (draft.designation.trim()) {
        toast.success("Role & Designation updated in MongoDB Atlas successfully!");
      } else {
        toast.success("Member updated in MongoDB Atlas.");
      }
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error(error?.message || "Failed to update member role");
    } finally {
      setSavingId(null);
    }
  };

  // Filtered members
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        m.name?.toLowerCase().includes(q) ||
        m.regNumber?.toLowerCase().includes(q) ||
        m.email?.toLowerCase().includes(q) ||
        m.memberId?.toLowerCase().includes(q) ||
        String(m.serialNumber || "").includes(q);

      const matchesDept = deptFilter === "all" || m.department?.toLowerCase() === deptFilter.toLowerCase();

      const hasAssignment = Boolean(m.designation?.trim() || m.roleAssignee?.trim());
      const matchesRole =
        roleFilter === "all" ||
        (roleFilter === "assigned" && hasAssignment) ||
        (roleFilter === "pending" && !hasAssignment);

      return matchesSearch && matchesDept && matchesRole;
    });
  }, [members, searchQuery, deptFilter, roleFilter]);

  // Statistics
  const totalMembers = members.length;
  const assignedCount = members.filter((m) => m.designation?.trim() || m.roleAssignee?.trim()).length;
  const pendingCount = totalMembers - assignedCount;
  const totalQueries = enquiries.length + contacts.length;

  // 1. Loading State while checking authentication token
  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#060a17] text-slate-100 flex items-center justify-center pt-20 px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin shadow-lg shadow-cyan-500/20" />
          <div>
            <h3 className="text-base font-bold text-white font-space">Verifying Administrator Access</h3>
            <p className="text-xs text-slate-400 mt-1 font-mono">Securing connection to TechVerse SuperAdmin Gateway...</p>
          </div>
        </div>
      </div>
    );
  }

  // 2. Strict Email Login Wall (techverse@ctuniversity.in only)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#060a17] text-slate-100 pt-28 pb-20 px-4 flex items-center justify-center relative overflow-hidden">
        {/* Futuristic Ambience */}
        <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px]" />
          <div className="absolute bottom-1/4 right-1/3 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[140px]" />
        </div>

        <div className="w-full max-w-md animate-fade-in space-y-6">
          {/* Card Container */}
          <div className="relative rounded-3xl bg-[#090e21]/95 border border-white/10 p-7 sm:p-9 shadow-2xl backdrop-blur-2xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600" />

            <div className="text-center space-y-3 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600/20 to-cyan-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/10">
                <ShieldCheck className="w-8 h-8 text-cyan-400" />
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-[10px] font-mono tracking-widest text-blue-300 uppercase">
                  <Lock className="w-3 h-3 text-blue-400" />
                  Guarded Admin Gateway
                </div>
                <h2 className="text-2xl font-black font-space text-white tracking-tight">
                  Admin Sign In
                </h2>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Strictly restricted to official TechVerse administration credentials.
                </p>
              </div>
            </div>

            {/* Guard Notice Callout */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200/90 text-xs flex items-start gap-2.5 mb-6">
              <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <strong>Strict Access Policy:</strong> Only the official club admin email (<code className="text-cyan-300 font-mono font-bold">techverse@ctuniversity.in</code>) is authorized to log into this portal.
              </div>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 font-bold mb-1.5 uppercase tracking-wider">
                  Admin Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="admin-email-input"
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="techverse@ctuniversity.in"
                    className="pl-10 bg-white/5 border-white/10 text-white text-xs rounded-xl focus:border-cyan-400"
                  />
                </div>
                {loginEmail.trim().toLowerCase() !== "techverse@ctuniversity.in" && loginEmail.length > 0 && (
                  <p className="text-[11px] text-red-400 mt-1.5 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    Access restricted: Only techverse@ctuniversity.in can log in.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 font-bold mb-1.5 uppercase tracking-wider">
                  Admin Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="admin-password-input"
                    type={showPassword ? "text" : "password"}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter Admin Password..."
                    className="pl-10 pr-14 bg-white/5 border-white/10 text-white text-xs rounded-xl focus:border-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-mono"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <Button
                id="admin-login-btn"
                type="submit"
                disabled={isLoggingIn || loginEmail.trim().toLowerCase() !== "techverse@ctuniversity.in"}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/25 transition-all text-xs font-mono tracking-wider uppercase flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoggingIn ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Verifying Credentials...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Authorize Admin Access
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-5 border-t border-white/10 text-center">
              <a
                href="/"
                className="text-xs text-slate-400 hover:text-cyan-400 transition-colors inline-flex items-center gap-1 font-mono"
              >
                ← Return to TechVerse Public Portal
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060a17] text-slate-100 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* TOP HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30 text-[11px] font-mono tracking-widest uppercase">
                TechVerse Club Administration
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-space tracking-tight text-white flex items-center gap-3">
              Admin Portal <ShieldCheck className="w-8 h-8 text-cyan-400" />
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Assign club roles & designations, manage student enquiries, and track university registrations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-slate-300 text-[11px]">techverse@ctuniversity.in</span>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[9px] font-mono">
                SuperAdmin
              </Badge>
            </div>
            <Button
              id="refresh-admin-data-btn"
              type="button"
              variant="outline"
              size="sm"
              onClick={loadData}
              disabled={loading}
              className="bg-white/5 hover:bg-white/10 text-slate-200 border-white/10 text-xs font-semibold rounded-xl flex items-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh Data
            </Button>
            <Button
              id="logout-admin-btn"
              type="button"
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-300 border-red-500/30 text-xs font-semibold rounded-xl flex items-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              Log Out
            </Button>
          </div>
        </div>

        {/* METRICS OVERVIEW CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#0b1126]/80 border border-white/10 shadow-lg backdrop-blur-xl">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span>TOTAL MEMBERS</span>
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-3xl font-black font-space text-white">{totalMembers}</div>
            <span className="text-[11px] text-emerald-400 font-medium mt-1 block">Registered in MongoDB</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#0b1126]/80 border border-white/10 shadow-lg backdrop-blur-xl">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span>ROLES ASSIGNED</span>
              <UserCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black font-space text-emerald-400">{assignedCount}</div>
            <span className="text-[11px] text-slate-400 mt-1 block">Designation Active</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#0b1126]/80 border border-white/10 shadow-lg backdrop-blur-xl">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span>PENDING REVIEW</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-black font-space text-amber-400">{pendingCount}</div>
            <span className="text-[11px] text-slate-400 mt-1 block">Awaiting Role Assignment</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#0b1126]/80 border border-white/10 shadow-lg backdrop-blur-xl">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span>TOTAL QUERIES</span>
              <MessageSquare className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-3xl font-black font-space text-purple-400">{totalQueries}</div>
            <span className="text-[11px] text-slate-400 mt-1 block">Enquiries & Contact</span>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
          <button
            id="tab-members-btn"
            type="button"
            onClick={() => setActiveTab("members")}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center gap-2 ${
              activeTab === "members"
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/25"
                : "bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Club Members & Role Assignment</span>
            <span className="ml-1.5 px-2 py-0.5 rounded-full bg-black/30 text-[10px] font-mono">
              {members.length}
            </span>
          </button>

          <button
            id="tab-queries-btn"
            type="button"
            onClick={() => setActiveTab("queries")}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center gap-2 ${
              activeTab === "queries"
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/25"
                : "bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Student Queries & Enquiries</span>
            <span className="ml-1.5 px-2 py-0.5 rounded-full bg-black/30 text-[10px] font-mono">
              {totalQueries}
            </span>
          </button>

          <button
            id="tab-arenas-btn"
            type="button"
            onClick={() => setActiveTab("arenas")}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center gap-2 ${
              activeTab === "arenas"
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/25"
                : "bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Engineers' Day Arenas</span>
            <span className="ml-1.5 px-2 py-0.5 rounded-full bg-black/30 text-[10px] font-mono">
              {eventStats?.totalRegistrations ?? 13}
            </span>
          </button>
        </div>

        {/* ================================================================= */}
        {/* TAB 1: CLUB MEMBERS & ROLE ASSIGNMENT                             */}
        {/* ================================================================= */}
        {activeTab === "members" && (
          <div className="space-y-6">
            {/* Search & Filter Bar */}
            <div className="p-4 rounded-2xl bg-[#0b1126]/80 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  id="admin-search-input"
                  type="text"
                  placeholder="Search by Name, Reg No, or Email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white text-xs rounded-xl focus:border-cyan-400"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="bg-white/5 border border-white/10 text-slate-300 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-cyan-400"
                >
                  <option value="all" className="bg-[#0b1126] text-white">All Departments</option>
                  <option value="btech" className="bg-[#0b1126] text-white">B.Tech</option>
                  <option value="bca" className="bg-[#0b1126] text-white">BCA</option>
                </select>

                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-white/5 border border-white/10 text-slate-300 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-cyan-400"
                >
                  <option value="all" className="bg-[#0b1126] text-white">All Statuses</option>
                  <option value="pending" className="bg-[#0b1126] text-white">Pending Role Assignment</option>
                  <option value="assigned" className="bg-[#0b1126] text-white">Role Assigned</option>
                </select>
              </div>
            </div>

            {/* Members Cards / Table */}
            {filteredMembers.length === 0 ? (
              <div className="text-center py-16 p-8 rounded-3xl bg-white/[0.02] border border-white/10">
                <Users className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white">No Club Members Found</h3>
                <p className="text-sm text-slate-400 mt-1">Try adjusting your search terms or filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredMembers.map((member) => {
                  const draft = editDrafts[member._id] || {
                    designation: member.designation || "",
                    roleAssignee: member.roleAssignee || "",
                  };
                  const isSaving = savingId === member._id;
                  const isAssigned = Boolean(member.designation?.trim() || member.roleAssignee?.trim());

                  return (
                    <div
                      key={member._id}
                      className="p-5 sm:p-6 rounded-2xl bg-[#090e21]/90 border border-white/10 hover:border-cyan-500/40 transition-all shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
                    >
                      {/* Left: Avatar + Basic Info */}
                      <div className="flex items-start gap-4 min-w-[280px]">
                        {member.photo ? (
                          <img
                            src={member.photo}
                            alt={member.name}
                            className="w-16 h-20 rounded-xl object-cover border border-cyan-400/40 shadow flex-shrink-0"
                          />
                        ) : (
                          <div className="w-16 h-20 rounded-xl bg-blue-900/30 border border-blue-500/30 flex items-center justify-center text-blue-400 text-xl font-bold flex-shrink-0">
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                        )}

                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-base sm:text-lg font-bold text-white font-space">
                              {member.name}
                            </h3>
                            <Badge
                              className={`text-[10px] font-mono uppercase ${
                                member.status === "Active" || isAssigned
                                  ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                                  : "bg-amber-500/10 text-amber-300 border-amber-500/30"
                              }`}
                            >
                              {member.status === "Active" || isAssigned ? "Active Member" : "⏳ Under Screening"}
                            </Badge>
                            {member.cardSent && (
                              <Badge className="bg-blue-500/10 text-blue-300 border-blue-500/30 text-[10px] font-mono">
                                🪪 Card Sent
                              </Badge>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                            {member.serialNumber && (
                              <span className="font-mono text-amber-300 font-black bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30 text-[11px]">
                                #{member.serialNumber}
                              </span>
                            )}
                            {member.memberId && (
                              <span className="font-mono text-blue-300 font-semibold bg-blue-500/10 px-1.5 py-0.5 rounded text-[11px]">
                                {member.memberId}
                              </span>
                            )}
                            <span className="font-mono text-cyan-300 font-semibold">{member.regNumber}</span>
                            <span>•</span>
                            <span className="capitalize">{member.department.toUpperCase()} ({member.batch})</span>
                            <span>•</span>
                            <span className="text-slate-300">{member.residenceType || "Day Scholar"}</span>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 pt-1">
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-500" /> {member.contact}
                            </span>
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3 text-slate-500" /> {member.email}
                            </span>
                          </div>

                          {member.interests && member.interests.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1.5">
                              {member.interests.map((interest, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/10"
                                >
                                  {interest}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Middle: Role & Designation Inputs for Admin Assignment */}
                      <div className="w-full lg:w-auto flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                        <div>
                          <label className="block text-[11px] font-mono uppercase tracking-wider text-amber-300 font-bold mb-1">
                            Club Designation
                          </label>
                          <Input
                            placeholder="e.g. Technical Lead, Web Dev Head..."
                            value={draft.designation}
                            onChange={(e) => handleDraftChange(member._id, "designation", e.target.value)}
                            className="bg-white/5 border-white/10 text-white text-xs rounded-lg focus:border-amber-400"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono uppercase tracking-wider text-blue-300 font-bold mb-1">
                            Role Assignee
                          </label>
                          <Input
                            placeholder="e.g. Core Team, Associate, Volunteer..."
                            value={draft.roleAssignee}
                            onChange={(e) => handleDraftChange(member._id, "roleAssignee", e.target.value)}
                            className="bg-white/5 border-white/10 text-white text-xs rounded-lg focus:border-blue-400"
                          />
                        </div>
                      </div>

                      {/* Right: Save Action */}
                      <div className="flex sm:flex-col items-center gap-2 w-full lg:w-auto justify-end">
                        <Button
                          id={`save-role-btn-${member._id}`}
                          type="button"
                          onClick={() => handleSaveRole(member._id)}
                          disabled={isSaving}
                          size="sm"
                          className={`w-full sm:w-auto text-white text-xs font-bold rounded-xl px-4 py-2 flex items-center justify-center gap-1.5 shadow-md ${
                            draft.designation.trim()
                              ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/20"
                              : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-blue-500/20"
                          }`}
                        >
                          {isSaving ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> {draft.designation.trim() ? "Issuing Card..." : "Saving..."}
                            </>
                          ) : draft.designation.trim() ? (
                            <>
                              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Assign & Send ID Card 🪪
                            </>
                          ) : (
                            <>
                              <Save className="w-3.5 h-3.5" /> Save Role
                            </>
                          )}
                        </Button>

                        <span className="text-[10px] font-mono text-slate-500 block text-center">
                          ID: {member.memberId || "TV-2026"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: QUERIES & ENQUIRIES                                       */}
        {/* ================================================================= */}
        {activeTab === "queries" && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-[#0b1126]/80 border border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Student Inquiries & Contact Queries</h3>
                <p className="text-xs text-slate-400">Incoming messages from student contact submissions.</p>
              </div>
              <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/30 text-xs font-mono">
                {totalQueries} Total Queries
              </Badge>
            </div>

            {/* Enquiries List */}
            {enquiries.length === 0 && contacts.length === 0 ? (
              <div className="text-center py-16 p-8 rounded-3xl bg-white/[0.02] border border-white/10">
                <MessageSquare className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white">No Queries Found</h3>
                <p className="text-sm text-slate-400 mt-1">Student submissions will appear here automatically.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {enquiries.map((enq) => (
                  <div
                    key={enq._id}
                    className="p-5 rounded-2xl bg-[#090e21]/90 border border-white/10 shadow-lg space-y-3"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <span className="text-xs font-mono font-bold text-cyan-300">Club Enquiry</span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {enq.createdAt ? new Date(enq.createdAt).toLocaleDateString() : "Recent"}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-white">{enq.name}</h4>
                      <p className="text-xs text-slate-400">{enq.email} • {enq.contact || "No Contact"}</p>
                    </div>

                    {enq.otherInterest && (
                      <p className="text-xs text-slate-300 bg-white/5 p-2.5 rounded-xl border border-white/5 leading-relaxed">
                        {enq.otherInterest}
                      </p>
                    )}

                    {enq.interests && enq.interests.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {enq.interests.map((int, idx) => (
                          <span key={idx} className="text-[10px] bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/20">
                            {int}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {contacts.map((c) => (
                  <div
                    key={c._id}
                    className="p-5 rounded-2xl bg-[#090e21]/90 border border-white/10 shadow-lg space-y-3"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <span className="text-xs font-mono font-bold text-purple-300">Contact Message</span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "Recent"}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-white">{c.name}</h4>
                      <p className="text-xs text-slate-400">{c.email} • {c.phone || "No Phone"}</p>
                    </div>

                    {c.subject && (
                      <span className="text-xs font-semibold text-amber-300 block">{c.subject}</span>
                    )}

                    {c.message && (
                      <p className="text-xs text-slate-300 bg-white/5 p-2.5 rounded-xl border border-white/5 leading-relaxed">
                        {c.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: ENGINEERS' DAY ARENAS OVERVIEW                              */}
        {/* ================================================================= */}
        {activeTab === "arenas" && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-[#0b1126]/80 border border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Engineers' Day Live Competitions</h3>
                <p className="text-xs text-slate-400">Total registrations across all 13 arenas.</p>
              </div>
              <Badge className="bg-cyan-500/10 text-cyan-300 border-cyan-500/30 text-xs font-mono">
                {eventStats?.totalRegistrations ?? 0} Total Registrations
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {eventStats?.breakdown?.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#090e21]/90 border border-white/10 shadow-lg flex items-center justify-between"
                >
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                      Arena #{idx + 1}
                    </span>
                    <h4 className="text-sm font-bold text-white capitalize">
                      {item.eventSlug.replace(/-/g, " ")}
                    </h4>
                    <span className="text-[11px] font-mono text-cyan-400/80">
                      Collection: {item.collectionName}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-2xl font-black font-space text-white">{item.count}</span>
                    <span className="text-[10px] text-slate-400 block">entries</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
