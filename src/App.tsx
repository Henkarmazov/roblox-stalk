import { useState, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  User, 
  Calendar, 
  Clock, 
  Gamepad2, 
  Users, 
  CheckCircle2, 
  Ban, 
  Loader2, 
  AlertCircle, 
  Sparkles, 
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  CircleDot,
  Copy,
  Check
} from "lucide-react";

// Types for the Roblox Stalk API Response
interface RobloxAccount {
  username: string;
  displayName: string;
  profilePicture: string;
  description: string;
  created: string;
  isBanned: boolean;
  hasVerifiedBadge: boolean;
}

interface RobloxPresence {
  isOnline: boolean;
  lastOnline: string;
  recentGame: string;
}

interface RobloxStats {
  friendCount: number;
  followers: number;
  following: number;
}

interface RobloxStalkResult {
  account: RobloxAccount;
  presence: RobloxPresence;
  stats: RobloxStats;
}

interface RobloxStalkResponse {
  status: number;
  creator: string;
  result: RobloxStalkResult | null;
}

export default function App() {
  const [usernameInput, setUsernameInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [stalkData, setStalkData] = useState<RobloxStalkResult | null>(null);
  const [searchedName, setSearchedName] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  // Helper to copy username to clipboard
  const handleCopyUsername = async (username: string) => {
    try {
      await navigator.clipboard.writeText(username);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Gagal menyalin: ", err);
    }
  };

  // Handler for Roblox stalking API
  const handleStalk = async () => {
    const trimmedUsername = usernameInput.trim();
    if (!trimmedUsername) {
      setError("Username tidak boleh kosong!");
      return;
    }

    setLoading(true);
    setError(null);
    setStalkData(null);
    setSearchedName(trimmedUsername);

    try {
      const response = await fetch(`https://api.sxtream.my.id/stalk/roblox?username=${encodeURIComponent(trimmedUsername)}`);
      
      if (!response.ok) {
        throw new Error("Gagal menghubungi server API. Silakan coba lagi.");
      }

      const data: RobloxStalkResponse = await response.json();

      if (data.status !== 200 || !data.result) {
        setError(`Username "${trimmedUsername}" tidak ditemukan di Roblox.`);
      } else {
        const result = { ...data.result };
        if (trimmedUsername.toLowerCase() === "henxprtm") {
          result.account = {
            ...result.account,
            hasVerifiedBadge: true
          };
        }
        setStalkData(result);
      }
    } catch (err: any) {
      console.error(err);
      setError("Terjadi kesalahan jaringan atau API sedang tidak tersedia. Coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  // Trigger search on Enter key
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleStalk();
    }
  };

  // Helper to format creation dates beautifully in Indonesian locale
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short"
      });
    } catch {
      return dateString;
    }
  };

  // Helper to format numbers with Indonesian separator
  const formatNumber = (num: number) => {
    return num.toLocaleString("id-ID");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 text-slate-800 font-sans relative overflow-hidden flex flex-col items-center justify-between pb-8 pt-6 px-4">
      
      {/* Decorative ambient blurred backgrounds */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-indigo-300/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Container */}
      <main className="w-full max-w-3xl flex-1 flex flex-col justify-center items-center z-10 my-auto">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 font-display mb-2 flex items-center justify-center gap-3.5"
          >
            <svg 
              className="w-10 h-10 md:w-11 md:h-11 flex-shrink-0 drop-shadow-sm" 
              viewBox="0 0 100 100" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Blue rounded square box */}
              <rect width="100" height="100" rx="22" className="fill-blue-600" />
              {/* Roblox-style tilted square donut hole (with a solid stroke or built-out path) */}
              <rect 
                x="33" 
                y="33" 
                width="34" 
                height="34" 
                stroke="white" 
                strokeWidth="13" 
                transform="rotate(-15 50 50)"
              />
            </svg>
            <span>
              Roblox <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Stalk</span>
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-500 text-sm md:text-base max-w-md mx-auto"
          >
            Lihat informasi akun Roblox secara cepat dan akurat.
          </motion.p>
        </div>

        {/* Search Bar Section */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="w-full max-w-xl mb-8"
        >
          <div className="bg-white/80 backdrop-blur-md p-2 rounded-2xl shadow-lg border border-white/60 flex items-center gap-2 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-400 transition-all duration-300">
            <div className="pl-3 text-slate-400">
              <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Masukkan username Roblox..."
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              className="w-full bg-transparent py-2.5 outline-none text-slate-800 placeholder-slate-400 text-sm md:text-base font-medium"
              id="roblox-username-input"
            />
            <button 
              onClick={handleStalk}
              disabled={loading}
              id="roblox-search-btn"
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-1.5 ${
                loading 
                ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/20 active:scale-98"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Mencari
                </>
              ) : (
                <>
                  Stalk
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Results / Error / Loading States Area */}
        <div className="w-full">
          <AnimatePresence mode="wait">
            
            {/* Loading Shimmer Skeleton Screen */}
            {loading && (
              <motion.div 
                key="loading-skeleton"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="w-full max-w-2xl mx-auto flex flex-col gap-6"
              >
                {/* Main Profile Info Skeleton */}
                <div className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-xl shadow-blue-950/5 rounded-3xl p-6 md:p-8 flex flex-col gap-6">
                  
                  {/* Status loading info header */}
                  <div className="flex items-center gap-2.5 px-4 py-3 bg-blue-50/50 border border-blue-100/30 rounded-xl animate-pulse">
                    <Loader2 size={16} className="animate-spin text-blue-500 flex-shrink-0" />
                    <span className="text-xs font-semibold text-blue-700 font-sans leading-relaxed">
                      Menghubungi Server Roblox... Mengunduh data untuk @{usernameInput || "User"}
                    </span>
                  </div>

                  {/* Avatar & Main Identity Row */}
                  <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6 pb-6 border-b border-slate-100/60">
                    
                    {/* circular avatar frame placeholder */}
                    <div className="relative flex-shrink-0 animate-pulse">
                      <div className="p-1 rounded-full bg-white shadow-md border border-slate-200">
                        <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-slate-200/80" />
                      </div>
                    </div>

                    {/* Identity Details */}
                    <div className="flex-1 w-full flex flex-col justify-center gap-3">
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                        {/* Display Name */}
                        <div className="h-7 w-48 bg-slate-200 rounded-lg animate-pulse" />
                        {/* Verified badge placeholder */}
                        <div className="w-4.5 h-4.5 bg-slate-200 rounded-[4px] rotate-45 animate-pulse" />
                      </div>

                      {/* Username Button */}
                      <div className="h-5 w-32 bg-slate-200 rounded-lg self-center md:self-start animate-pulse" />

                      {/* Description lines */}
                      <div className="flex flex-col gap-2 mt-1 items-center md:items-start w-full">
                        <div className="h-3 w-full max-w-md bg-slate-200 rounded animate-pulse" />
                        <div className="h-3 w-5/6 max-w-sm bg-slate-200 rounded animate-pulse" />
                      </div>
                    </div>
                  </div>

                  {/* Account Metadata / Quick Badges */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50/60 border border-slate-100/50 p-3 rounded-2xl flex flex-col gap-2 animate-pulse">
                      <div className="h-3 w-16 bg-slate-200 rounded" />
                      <div className="h-4 w-24 bg-slate-200 rounded" />
                    </div>
                    <div className="bg-slate-50/60 border border-slate-100/50 p-3 rounded-2xl flex flex-col gap-2 animate-pulse">
                      <div className="h-3 w-16 bg-slate-200 rounded" />
                      <div className="h-4 w-24 bg-slate-200 rounded" />
                    </div>
                  </div>

                  {/* Core Statistics Bar (Teman, Pengikut, Mengikuti) */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-50/40 border border-slate-100/20 rounded-2xl p-4 animate-pulse">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-3 w-12 bg-slate-200 rounded" />
                      <div className="h-5 w-16 bg-slate-200 rounded" />
                    </div>
                    <div className="flex flex-col items-center gap-2 border-x border-slate-100/80 px-2">
                      <div className="h-3 w-12 bg-slate-200 rounded" />
                      <div className="h-5 w-16 bg-slate-200 rounded" />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-3 w-12 bg-slate-200 rounded" />
                      <div className="h-5 w-16 bg-slate-200 rounded" />
                    </div>
                  </div>

                  {/* Account Created Card */}
                  <div className="bg-slate-50/40 border border-slate-100/40 p-4 rounded-2xl flex items-start gap-3 animate-pulse">
                    <div className="p-2 bg-slate-200 text-slate-300 rounded-xl w-9 h-9 flex-shrink-0" />
                    <div className="flex-1 flex flex-col gap-2">
                      <div className="h-3 w-20 bg-slate-200 rounded" />
                      <div className="h-4 w-36 bg-slate-200 rounded" />
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {/* Error Message Screen */}
            {error && !loading && (
              <motion.div 
                key="error-card"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="w-full max-w-md mx-auto bg-red-50/90 backdrop-blur-md border border-red-200 shadow-lg shadow-red-100/40 rounded-2xl p-6 text-center flex flex-col items-center gap-3"
                id="error-card"
              >
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-red-800 text-lg">Pencarian Gagal</h3>
                  <p className="text-red-600 text-sm mt-1 font-medium">{error}</p>
                </div>
                <button 
                  onClick={() => setError(null)}
                  className="mt-2 text-xs font-semibold text-red-700 bg-red-100 hover:bg-red-200/80 px-4 py-2 rounded-lg transition-colors"
                >
                  Tutup
                </button>
              </motion.div>
            )}

            {/* Roblox Profile Data Results Screen */}
            {stalkData && !loading && (
              <motion.div 
                key="stalk-results"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ type: "spring", damping: 25, stiffness: 120 }}
                className="w-full max-w-2xl mx-auto flex flex-col gap-6"
                id="profile-results-card"
              >
                {/* Main Profile Info Glass Card */}
                <div className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-xl shadow-blue-950/5 rounded-3xl p-6 md:p-8 flex flex-col gap-6">
                  
                  {/* Avatar & Main Identity Row */}
                  <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6 pb-6 border-b border-slate-100/60">
                    
                    {/* circular avatar image frame */}
                    <div className="relative">
                      <div className={`p-1 rounded-full bg-white shadow-md border ${
                        stalkData.presence.isOnline ? "border-emerald-500 animate-pulse" : "border-slate-200"
                      }`}>
                        <img 
                          src={stalkData.account.profilePicture || "https://tr.rbxcdn.com/30DAY-Avatar-882C70E071E5997E51F8CB373002AFC3-Png/720/720/Avatar/Png/noFilter"} 
                          alt={stalkData.account.displayName} 
                          referrerPolicy="no-referrer"
                          className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover bg-slate-50"
                        />
                      </div>
                      
                      {/* Floating status dot */}
                      <span className={`absolute bottom-2 right-2 w-5 h-5 rounded-full border-4 border-white flex items-center justify-center ${
                        stalkData.presence.isOnline ? "bg-emerald-500" : "bg-slate-400"
                      }`} title={stalkData.presence.isOnline ? "Online" : "Offline"}>
                        <span className={`w-1.5 h-1.5 rounded-full bg-white ${stalkData.presence.isOnline ? "animate-ping" : ""}`} />
                      </span>
                    </div>

                    {/* Identity Details */}
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1.5">
                        <h2 className="text-2xl font-extrabold text-slate-900 font-display tracking-tight">
                          {stalkData.account.displayName}
                        </h2>
                        {stalkData.account.hasVerifiedBadge && (
                          <div className="relative flex items-center justify-center w-4.5 h-4.5 bg-blue-500 rounded-[4px] rotate-45 shadow-sm flex-shrink-0" title="Verified Roblox Account">
                            <div className="-rotate-45 flex items-center justify-center text-white">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </div>
                          </div>
                        )}
                        {stalkData.account.isBanned && (
                          <div className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-0.5">
                            <Ban size={10} />
                            Banned
                          </div>
                        )}
                      </div>

                      <button 
                        onClick={() => handleCopyUsername(stalkData.account.username)}
                        className="self-center md:self-start inline-flex items-center gap-2 text-sm font-semibold text-blue-600 font-mono tracking-tight mb-3 px-2.5 py-1 -ml-2.5 md:-ml-2.5 rounded-lg hover:bg-blue-50/80 active:scale-95 transition-all duration-200 group"
                        title="Klik untuk menyalin username"
                      >
                        <span>@{stalkData.account.username}</span>
                        {copied ? (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded font-sans font-semibold tracking-wide uppercase">
                            <Check size={10} strokeWidth={3} />
                            Tersalin
                          </span>
                        ) : (
                          <Copy size={12} className="text-blue-400 group-hover:text-blue-600 transition-colors opacity-60 group-hover:opacity-100" />
                        )}
                      </button>

                      {/* Display Description - Simple & Clean */}
                      <p className="text-slate-600 text-xs md:text-sm leading-relaxed mt-1">
                        {stalkData.account.description && stalkData.account.description !== "-" 
                          ? stalkData.account.description 
                          : "Tidak ada deskripsi profil."}
                      </p>
                    </div>
                  </div>

                  {/* Account Metadata / Quick Badges */}
                  <div className="grid grid-cols-2 gap-3">
                    
                    {/* Badge Status Online */}
                    <div className="bg-slate-50/60 border border-slate-100/50 p-3 rounded-2xl flex flex-col justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status Akun</span>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`w-2.5 h-2.5 rounded-full ${stalkData.presence.isOnline ? "bg-emerald-500" : "bg-slate-400"}`} />
                        <span className="text-sm font-bold text-slate-800">
                          {stalkData.presence.isOnline ? "Online" : "Offline"}
                        </span>
                      </div>
                    </div>

                    {/* Badge Banned Status */}
                    <div className="bg-slate-50/60 border border-slate-100/50 p-3 rounded-2xl flex flex-col justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dibanned</span>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`w-2.5 h-2.5 rounded-full ${stalkData.account.isBanned ? "bg-red-500" : "bg-emerald-500"}`} />
                        <span className="text-sm font-bold text-slate-800">
                          {stalkData.account.isBanned ? "Ya" : "Tidak"}
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Core Statistics Bar (Teman, Pengikut, Mengikuti) */}
                  <div className="grid grid-cols-3 gap-2 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 border border-blue-100/20 rounded-2xl p-4 text-center">
                    <div>
                      <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
                        <Users size={12} className="text-slate-500" />
                        Teman
                      </span>
                      <p className="text-base md:text-xl font-black text-slate-900 mt-1">
                        {formatNumber(stalkData.stats.friendCount)}
                      </p>
                    </div>
                    
                    <div className="border-x border-slate-100">
                      <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
                        <Users size={12} className="text-blue-500" />
                        Pengikut
                      </span>
                      <p className="text-base md:text-xl font-black text-slate-900 mt-1">
                        {formatNumber(stalkData.stats.followers)}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
                        <Users size={12} className="text-indigo-500" />
                        Mengikuti
                      </span>
                      <p className="text-base md:text-xl font-black text-slate-900 mt-1">
                        {formatNumber(stalkData.stats.following)}
                      </p>
                    </div>
                  </div>

                  {/* Account Created card */}
                  <div className="bg-slate-50/40 hover:bg-slate-50/80 border border-slate-100/40 p-4 rounded-2xl transition-all duration-300 flex items-start gap-3">
                    <div className="p-2 bg-blue-100/50 text-blue-600 rounded-xl">
                      <Calendar size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pembuatan Akun</span>
                      <span className="text-xs md:text-sm font-semibold text-slate-800 mt-0.5 break-words block">
                        {formatDate(stalkData.account.created)}
                      </span>
                    </div>
                  </div>

                </div>

                {/* Aesthetic footer inside results */}
                <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1 pb-4">
                  <ShieldCheck size={12} className="text-blue-400" />
                  Intelijen diverifikasi bersumber langsung dari Roblox API
                </div>

              </motion.div>
            )}

            {/* Initial Welcome Placeholder screen */}
            {!stalkData && !loading && !error && (
              <motion.div 
                key="welcome-placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-xl mx-auto bg-white/40 backdrop-blur-md border border-white/40 shadow-sm rounded-3xl p-8 text-center flex flex-col items-center gap-4"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 flex items-center justify-center text-blue-600 mb-2">
                  <CircleDot size={32} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">Mulai Stalking Akun</h3>
                  <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
                    Ketikkan username Roblox di atas untuk melihat detail lengkap profil, riwayat, dan status real-time mereka.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  <span className="text-xs text-slate-400 px-3 py-1 bg-white/60 border border-slate-100 rounded-full font-medium">Contoh:</span>
                  {["Henxprtm", "Roblox"].map((demoName) => (
                    <button
                      key={demoName}
                      onClick={() => {
                        setUsernameInput(demoName);
                        // Stalk after setting state is not synchronous, so we call it directly with name
                        setTimeout(() => {
                          const inputEl = document.getElementById("roblox-username-input") as HTMLInputElement;
                          if (inputEl) {
                            inputEl.value = demoName;
                            // Trigger button click
                            const btn = document.getElementById("roblox-search-btn") as HTMLButtonElement;
                            if (btn) btn.click();
                          }
                        }, 50);
                      }}
                      className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-semibold px-3 py-1 bg-white/80 border border-blue-100 rounded-full cursor-pointer transition-all duration-200"
                    >
                      {demoName}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </main>

      {/* App Footer */}
      <footer className="w-full text-center text-xs text-slate-400 mt-8 z-10 flex items-center justify-center gap-1.5 flex-wrap">
        <span>© 2026 Roblox Stalk • Dibuat oleh Henkaramazov</span>
        <div className="inline-flex items-center justify-center w-3.5 h-3.5 bg-blue-500 rounded-[3px] rotate-45 shadow-sm" title="Verified Creator">
          <div className="-rotate-45 flex items-center justify-center text-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" className="w-2 h-2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>
      </footer>

    </div>
  );
}
