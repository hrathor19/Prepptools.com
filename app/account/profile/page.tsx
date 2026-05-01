"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth, getAuthClient } from "@/components/AuthProvider";
import { Phone, Mail, User, Pencil, Check, X, Loader2, ChevronDown } from "lucide-react";

const COUNTRY_CODES = [
  { flag: "🇮🇳", name: "India",                code: "+91"  },
  { flag: "🇺🇸", name: "United States",         code: "+1"   },
  { flag: "🇬🇧", name: "United Kingdom",         code: "+44"  },
  { flag: "🇦🇺", name: "Australia",              code: "+61"  },
  { flag: "🇨🇦", name: "Canada",                 code: "+1"   },
  { flag: "🇸🇬", name: "Singapore",              code: "+65"  },
  { flag: "🇦🇪", name: "UAE",                    code: "+971" },
  { flag: "🇸🇦", name: "Saudi Arabia",           code: "+966" },
  { flag: "🇶🇦", name: "Qatar",                  code: "+974" },
  { flag: "🇰🇼", name: "Kuwait",                 code: "+965" },
  { flag: "🇧🇭", name: "Bahrain",                code: "+973" },
  { flag: "🇴🇲", name: "Oman",                   code: "+968" },
  { flag: "🇵🇰", name: "Pakistan",               code: "+92"  },
  { flag: "🇧🇩", name: "Bangladesh",             code: "+880" },
  { flag: "🇳🇵", name: "Nepal",                  code: "+977" },
  { flag: "🇱🇰", name: "Sri Lanka",              code: "+94"  },
  { flag: "🇲🇻", name: "Maldives",               code: "+960" },
  { flag: "🇧🇹", name: "Bhutan",                 code: "+975" },
  { flag: "🇲🇲", name: "Myanmar",                code: "+95"  },
  { flag: "🇹🇭", name: "Thailand",               code: "+66"  },
  { flag: "🇲🇾", name: "Malaysia",               code: "+60"  },
  { flag: "🇮🇩", name: "Indonesia",              code: "+62"  },
  { flag: "🇵🇭", name: "Philippines",            code: "+63"  },
  { flag: "🇻🇳", name: "Vietnam",                code: "+84"  },
  { flag: "🇰🇭", name: "Cambodia",               code: "+855" },
  { flag: "🇨🇳", name: "China",                  code: "+86"  },
  { flag: "🇯🇵", name: "Japan",                  code: "+81"  },
  { flag: "🇰🇷", name: "South Korea",            code: "+82"  },
  { flag: "🇭🇰", name: "Hong Kong",              code: "+852" },
  { flag: "🇹🇼", name: "Taiwan",                 code: "+886" },
  { flag: "🇩🇪", name: "Germany",                code: "+49"  },
  { flag: "🇫🇷", name: "France",                 code: "+33"  },
  { flag: "🇮🇹", name: "Italy",                  code: "+39"  },
  { flag: "🇪🇸", name: "Spain",                  code: "+34"  },
  { flag: "🇵🇹", name: "Portugal",               code: "+351" },
  { flag: "🇳🇱", name: "Netherlands",            code: "+31"  },
  { flag: "🇧🇪", name: "Belgium",                code: "+32"  },
  { flag: "🇨🇭", name: "Switzerland",            code: "+41"  },
  { flag: "🇦🇹", name: "Austria",                code: "+43"  },
  { flag: "🇸🇪", name: "Sweden",                 code: "+46"  },
  { flag: "🇳🇴", name: "Norway",                 code: "+47"  },
  { flag: "🇩🇰", name: "Denmark",                code: "+45"  },
  { flag: "🇫🇮", name: "Finland",                code: "+358" },
  { flag: "🇵🇱", name: "Poland",                 code: "+48"  },
  { flag: "🇺🇦", name: "Ukraine",                code: "+380" },
  { flag: "🇷🇺", name: "Russia",                 code: "+7"   },
  { flag: "🇹🇷", name: "Turkey",                 code: "+90"  },
  { flag: "🇮🇱", name: "Israel",                 code: "+972" },
  { flag: "🇯🇴", name: "Jordan",                 code: "+962" },
  { flag: "🇱🇧", name: "Lebanon",                code: "+961" },
  { flag: "🇮🇶", name: "Iraq",                   code: "+964" },
  { flag: "🇮🇷", name: "Iran",                   code: "+98"  },
  { flag: "🇦🇫", name: "Afghanistan",            code: "+93"  },
  { flag: "🇪🇬", name: "Egypt",                  code: "+20"  },
  { flag: "🇳🇬", name: "Nigeria",                code: "+234" },
  { flag: "🇬🇭", name: "Ghana",                  code: "+233" },
  { flag: "🇰🇪", name: "Kenya",                  code: "+254" },
  { flag: "🇹🇿", name: "Tanzania",               code: "+255" },
  { flag: "🇺🇬", name: "Uganda",                 code: "+256" },
  { flag: "🇿🇦", name: "South Africa",           code: "+27"  },
  { flag: "🇪🇹", name: "Ethiopia",               code: "+251" },
  { flag: "🇧🇷", name: "Brazil",                 code: "+55"  },
  { flag: "🇲🇽", name: "Mexico",                 code: "+52"  },
  { flag: "🇦🇷", name: "Argentina",              code: "+54"  },
  { flag: "🇨🇴", name: "Colombia",               code: "+57"  },
  { flag: "🇨🇱", name: "Chile",                  code: "+56"  },
  { flag: "🇵🇪", name: "Peru",                   code: "+51"  },
  { flag: "🇻🇪", name: "Venezuela",              code: "+58"  },
  { flag: "🇳🇿", name: "New Zealand",            code: "+64"  },
];

// Sorted longest-code-first so "+880" is matched before "+88", etc.
const CODES_BY_LENGTH = [...COUNTRY_CODES].sort((a, b) => b.code.length - a.code.length);

function parsePhone(full: string): { countryCode: string; local: string } {
  for (const c of CODES_BY_LENGTH) {
    if (full.startsWith(c.code + " ")) {
      return { countryCode: c.code, local: full.slice(c.code.length + 1) };
    }
  }
  return { countryCode: "+91", local: full.replace(/^\+\d+\s?/, "") };
}

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [editingPhone, setEditingPhone] = useState(false);
  const [selectedCode, setSelectedCode] = useState("+91");
  const [localNumber, setLocalNumber] = useState("");
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const [saveMsg, setSaveMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    getAuthClient()
      .from("profiles")
      .select("phone")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.phone) setPhone(data.phone);
        setFetchingProfile(false);
      });
  }, [user]);

  const openEdit = () => {
    const parsed = parsePhone(phone);
    setSelectedCode(parsed.countryCode);
    setLocalNumber(parsed.local);
    setSearch("");
    setDropdownOpen(false);
    setEditingPhone(true);
  };

  const handleSavePhone = async () => {
    if (!user || !localNumber.trim()) return;
    setSaving(true);
    setSaveMsg(null);
    const full = `${selectedCode} ${localNumber.trim()}`;
    const { error } = await getAuthClient()
      .from("profiles")
      .upsert({ user_id: user.id, phone: full }, { onConflict: "user_id" });

    if (error) {
      setSaveMsg({ type: "err", text: "Failed to save. Please try again." });
    } else {
      setPhone(full);
      setEditingPhone(false);
      setSaveMsg({ type: "ok", text: "Phone number saved." });
      setTimeout(() => setSaveMsg(null), 3000);
    }
    setSaving(false);
  };

  const handleRemovePhone = async () => {
    if (!user) return;
    setSaving(true);
    await getAuthClient()
      .from("profiles")
      .upsert({ user_id: user.id, phone: null }, { onConflict: "user_id" });
    setPhone("");
    setLocalNumber("");
    setEditingPhone(false);
    setSaving(false);
  };

  const filtered = search.trim()
    ? COUNTRY_CODES.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.code.includes(search)
      )
    : COUNTRY_CODES;

  const selected = COUNTRY_CODES.find((c) => c.code === selectedCode) ?? COUNTRY_CODES[0];

  if (loading || fetchingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const name = user.user_metadata?.full_name ?? "User";
  const avatarUrl = user.user_metadata?.avatar_url ?? null;
  const initials = name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 px-4">
      <div className="max-w-lg mx-auto space-y-5">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">My Profile</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Your account information</p>
        </div>

        {/* Profile card */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="h-24 bg-gradient-to-r from-blue-500 to-indigo-600" />
          <div className="px-6 pb-6">
            <div className="-mt-10 mb-4">
              {avatarUrl ? (
                <Image src={avatarUrl} alt={name} width={80} height={80}
                  className="rounded-full ring-4 ring-white dark:ring-gray-900 object-cover" />
              ) : (
                <div className="w-20 h-20 rounded-full ring-4 ring-white dark:ring-gray-900 bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                  {initials}
                </div>
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">PreppTools Member</p>
          </div>
        </div>

        {/* Info fields */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl divide-y divide-gray-100 dark:divide-gray-800 shadow-sm">
          {/* Name */}
          <div className="flex items-center gap-4 px-5 py-4">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-0.5">Full Name</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{name}</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-4 px-5 py-4">
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-0.5">Email</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.email}</p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-4 px-5 py-4">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center shrink-0 mt-0.5">
              <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1.5">Phone Number</p>

              {editingPhone ? (
                <div className="space-y-2">
                  {/* Country code dropdown + number input */}
                  <div className="flex gap-2">
                    {/* Dropdown */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setDropdownOpen((v) => !v)}
                        className="flex items-center gap-1.5 h-10 px-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white hover:border-blue-400 focus:outline-none focus:border-blue-500 transition-colors whitespace-nowrap">
                        <span className="text-base leading-none">{selected.flag}</span>
                        <span className="font-medium">{selected.code}</span>
                        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                      </button>

                      {dropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                          <div className="absolute left-0 top-full mt-1.5 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-20 overflow-hidden">
                            {/* Search */}
                            <div className="p-2 border-b border-gray-100 dark:border-gray-800">
                              <input
                                autoFocus
                                type="text"
                                placeholder="Search country…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 placeholder-gray-400"
                              />
                            </div>
                            {/* List */}
                            <ul className="max-h-52 overflow-y-auto py-1">
                              {filtered.length === 0 ? (
                                <li className="px-4 py-3 text-sm text-gray-400 text-center">No results</li>
                              ) : filtered.map((c, i) => (
                                <li key={`${c.code}-${c.name}-${i}`}>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedCode(c.code);
                                      setDropdownOpen(false);
                                      setSearch("");
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors ${
                                      selectedCode === c.code && selected.name === c.name
                                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                                        : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                                    }`}>
                                    <span className="text-base w-6 text-center">{c.flag}</span>
                                    <span className="flex-1 truncate">{c.name}</span>
                                    <span className="text-gray-400 dark:text-gray-500 font-mono text-xs">{c.code}</span>
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Local number */}
                    <input
                      type="tel"
                      value={localNumber}
                      onChange={(e) => setLocalNumber(e.target.value.replace(/\D/g, ""))}
                      placeholder="98765 43210"
                      className="flex-1 h-10 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 placeholder-gray-400 transition-colors"
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2">
                    <button onClick={handleSavePhone} disabled={saving || !localNumber.trim()}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium disabled:opacity-50 transition-colors">
                      {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                      Save
                    </button>
                    <button onClick={() => setEditingPhone(false)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium transition-colors">
                      <X className="w-3.5 h-3.5" /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  {phone ? (
                    <>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{phone}</p>
                      <div className="flex items-center gap-1 ml-auto">
                        <button onClick={openEdit}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={handleRemovePhone} disabled={saving}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <button onClick={openEdit}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">
                      + Add phone number
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Save message */}
        {saveMsg && (
          <div className={`text-sm px-4 py-3 rounded-xl border ${
            saveMsg.type === "ok"
              ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400"
              : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400"
          }`}>
            {saveMsg.text}
          </div>
        )}

        {/* Sign-in method */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl px-5 py-4 shadow-sm">
          <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">Signed in via</p>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Google</span>
          </div>
        </div>
      </div>
    </div>
  );
}
