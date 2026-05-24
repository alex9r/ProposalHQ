import { useState, useEffect } from "react";
import { Shield, Clock, RefreshCw } from "lucide-react";

export default function Header() {
  const [timeStr, setTimeStr] = useState("2026.05.23_19:00:06");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const year = now.getUTCFullYear();
      const month = String(now.getUTCMonth() + 1).padStart(2, "0");
      const day = String(now.getUTCDate()).padStart(2, "0");
      const hours = String(now.getUTCHours()).padStart(2, "0");
      const minutes = String(now.getUTCMinutes()).padStart(2, "0");
      const seconds = String(now.getUTCSeconds()).padStart(2, "0");
      setTimeStr(`${year}.${month}.${day}_${hours}:${minutes}:${seconds}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 bg-slate-900 text-white flex items-center justify-between px-6 md:px-8 shrink-0 border-b border-slate-800 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
          </svg>
        </div>
        <div>
          <h1 className="text-sm md:text-base font-extrabold tracking-tight uppercase">Enterprise Innovation Simulator</h1>
          <p className="text-[9px] text-slate-400 font-mono uppercase tracking-widest leading-tight">Core Logic Engine // v4.2.0-Production</p>
        </div>
      </div>
      <div className="flex items-center gap-4 md:gap-6">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-[9px] text-slate-400 uppercase tracking-tighter">Engine Status</span>
          <span className="text-emerald-400 text-xs font-mono font-extrabold flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            OPERATIONAL
          </span>
        </div>
        <div className="hidden sm:block h-8 w-px bg-slate-700"></div>
        <div className="text-[10px] font-mono text-slate-300">
          SYS_TIME: {timeStr}
        </div>
      </div>
    </header>
  );
}
