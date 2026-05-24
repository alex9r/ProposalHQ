import { useState } from "react";
import { RegulatoryAnalysis, SandboxPolicy } from "../types";
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ShieldAlert, 
  BookOpen, 
  History, 
  Scale, 
  Clock, 
  Copy, 
  Check, 
  FileText,
  Info,
  Newspaper
} from "lucide-react";

interface RegulatoryLensProps {
  analysis: RegulatoryAnalysis;
  ideaText: string;
  rules?: SandboxPolicy[];
}

const DEFAULT_EXPLANATIONS: Record<string, { name: string; description: string; source: string }> = {
  "REG_B13": {
    name: "Cyber Resilience",
    description: "Per OSFI Guideline B-13, all new technology assets must have automated data backups, and any system handling financial transactions must not introduce single points of failure.",
    source: "OSFI Guideline B-13"
  },
  "REG_B10": {
    name: "Third-Party Risk",
    description: "Per OSFI Guideline B-10, cloud vendors and SaaS tools cannot subcontract data processing to \"fourth parties.\" Any tool that shares bank data with external third-party models is banned.",
    source: "OSFI Guideline B-10"
  },
  "REG_RESIDENCY": {
    name: "Data Sovereignty",
    description: "All Customer Personally Identifiable Information (PII), Social Insurance Numbers (SIN), and Primary Account Numbers (PAN) must be stored and processed exclusively on servers physically located within Canada.",
    source: "PIPEDA / Data Sovereignty"
  },
  "REG_PCI": {
    name: "Encryption",
    description: "Per PCI-DSS, all financial and customer data must be encrypted at rest using AES-256 and in transit using TLS 1.3. No unencrypted data transfers are permitted.",
    source: "PCI-DSS Standard"
  },
  "REG_DLP": {
    name: "Data Loss Prevention",
    description: "Systems cannot be designed to automatically email or export batches of customer data (e.g., >5 SINs or credit card numbers) to external domains.",
    source: "Data Leakage Prevention Policy"
  }
};

export default function RegulatoryLens({ analysis, ideaText, rules }: RegulatoryLensProps) {
  const { 
    status, 
    flagged_rule, 
    citation, 
    admin_review_required,
    precedent_mapping = [],
    approval_probability = 85,
    legal_review_time = 30,
    legislation_forecasting = "",
    news_bulletin = "",
    full_gatekeeper_formatted_text = ""
  } = analysis;

  const [viewMode, setViewMode] = useState<"dashboard" | "transcript">("dashboard");
  const [copied, setCopied] = useState(false);

  // Resolve matching policy rule
  const matchedRule = rules?.find(r => r.code === citation) || DEFAULT_EXPLANATIONS[citation];

  const handleCopyText = () => {
    navigator.clipboard.writeText(full_gatekeeper_formatted_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusConfig = () => {
    switch (status) {
      case "Pass":
        return {
          bg: "bg-emerald-50/80 border-emerald-200/80",
          text: "text-emerald-850",
          icon: <CheckCircle2 className="h-9 w-9 text-emerald-500" />,
          badgeBg: "bg-emerald-500",
          title: "Regulatory Pre-Cleared",
          desc: "This concept fully respects the specified corporate policies, data residency requirements, and privacy guidelines."
        };
      case "Fail":
        return {
          bg: "bg-red-50/80 border-red-200/80",
          text: "text-red-950",
          icon: <XCircle className="h-9 w-9 text-red-500 animate-pulse" />,
          badgeBg: "bg-red-500",
          title: "Compliance Risk Triggered",
          desc: "Critical corporate safety or data storage regulations have been directly transgressed."
        };
      case "Maybe":
      default:
        return {
          bg: "bg-yellow-50/90 border-yellow-250/90",
          text: "text-amber-950",
          icon: <AlertTriangle className="h-9 w-9 text-yellow-600" />,
          badgeBg: "bg-yellow-600",
          title: "Conditional Clearance Req.",
          desc: "Potential regulatory warning or unvetted workflow. Requires comprehensive compliance overview before sandbox progression."
        };
    }
  };

  const config = getStatusConfig();

  // Helper colors for precedents statuses
  const getPrecedentStatusColor = (statusText: string) => {
    switch (statusText.toLowerCase().trim()) {
      case "approved":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "rejected":
        return "bg-red-105 text-red-800 border-red-200";
      case "exception granted":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <div id="compliance-lens" className="bg-white rounded-xl border border-slate-200/85 overflow-hidden shadow-sm flex flex-col h-full">
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <BookOpen className="h-5 w-5 text-slate-700" />
          <div>
            <h3 className="font-semibold text-slate-850 text-sm uppercase tracking-wider">Financial Compliance Gatekeeper</h3>
            <p className="text-[11px] text-slate-500">Global Banking Risk-Assessment Engine</p>
          </div>
        </div>

        {/* View Toggle tabs */}
        <div className="flex bg-slate-200 p-0.5 rounded-lg border border-slate-300">
          <button
            onClick={() => setViewMode("dashboard")}
            className={`px-3 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
              viewMode === "dashboard" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Compliance Control Panel
          </button>
          <button
            onClick={() => setViewMode("transcript")}
            className={`px-3 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
              viewMode === "transcript" ? "bg-white text-slate-900 shadow-xs animate-pulse" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Strict Text Transcript
          </button>
        </div>
      </div>

      {viewMode === "dashboard" ? (
        <div className="p-6 flex flex-col flex-grow space-y-6">
          {/* Top Status Alert Card */}
          <div className={`p-5 rounded-xl border ${config.bg} flex items-start gap-4 transition-all duration-300 shadow-2xs`}>
            <div className="shrink-0 mt-0.5">{config.icon}</div>
            <div className="space-y-1 flex-grow">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] text-white font-black px-1.5 py-0.5 rounded uppercase tracking-wider ${config.badgeBg}`}>
                  {status}
                </span>
                <h4 className={`font-bold text-base leading-tight ${config.text}`}>
                  {config.title}
                </h4>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {config.desc}
              </p>
            </div>
          </div>

          {/* Dedicated Rule Violations / Warnings Findings Panel */}
          {status !== "Pass" && (
            <div className={`p-5 rounded-xl border ${status === "Fail" ? "bg-rose-50/70 border-rose-200" : "bg-amber-50/70 border-amber-250"} flex flex-col gap-3 shadow shadow-rose-100/30`}>
              <div className="flex items-center gap-2">
                {status === "Fail" ? (
                  <ShieldAlert className="h-5 w-5 text-red-600" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                )}
                <h5 className="font-bold text-sm text-slate-800">
                  {status === "Fail" ? "Identified Security & Compliance Infringements" : "Compliance Review Warnings & Advisories"}
                </h5>
              </div>
              
              <div className="space-y-3">
                {/* Specific Rule matched in sandbox rules */}
                {citation && citation !== "None" && (
                  <div className="bg-white border text-left border-slate-200 p-3.5 rounded-lg flex flex-col gap-1.5 shadow-4xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono bg-blue-105 text-blue-800 border border-blue-200 font-bold px-1.5 py-0.5 rounded uppercase">
                        CRITICAL MATCH: {citation}
                      </span>
                      {matchedRule && (
                        <span className="text-xs font-bold text-slate-800">
                          {matchedRule.name}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-normal font-sans">
                      {matchedRule?.description || "Regulatory policy guideline flagged under existing compliance checklists."}
                    </p>
                  </div>
                )}

                {/* Detailed description from compliance gatekeeper AI */}
                <div className="bg-white border border-slate-200 p-3.5 rounded-lg shadow-4xs text-left">
                  <span className="text-[10.5px] font-semibold text-slate-850 block mb-1">
                    Risk Assessment Detail
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed font-sans">
                    {flagged_rule && flagged_rule !== "None" ? flagged_rule : "Draft configuration has flagged standard bank guardrails requiring manual sign-off."}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Hand: Semantic mapping lookup */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2">
                <History className="h-4.5 w-4.5 text-slate-700" />
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight">1. Similar Projects to Yours</h4>
              </div>

              {precedent_mapping && precedent_mapping.length > 0 ? (
                <div className="space-y-3">
                  {precedent_mapping.map((proj, idx) => (
                    <div 
                      key={proj.id || idx} 
                      className={`border border-slate-200/85 p-3.5 rounded-xl bg-slate-50/55 hover:bg-slate-50 transition-all shadow-3xs flex flex-col space-y-2`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-mono font-extrabold text-indigo-700 tracking-tight">
                          {proj.id}
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border uppercase font-bold tracking-tight ${getPrecedentStatusColor(proj.status)}`}>
                          {proj.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 font-sans leading-relaxed">
                        {proj.description}
                      </p>
                      {proj.warning && 
                       proj.warning.trim() !== "" && 
                       proj.warning.trim().toLowerCase() !== "none" && 
                       proj.warning.trim().toLowerCase() !== "none." && (
                        <div className="bg-red-50 border border-red-105 rounded-lg p-2.5 flex items-start gap-2">
                          <AlertTriangle className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
                          <p className="text-[10.5px] font-sans text-red-700 leading-normal">
                            <span className="font-bold">Warning:</span> {proj.warning}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-500 italic p-4 bg-slate-50 border border-dashed rounded-lg text-center">
                  Searching historical projects...
                </div>
              )}
            </div>

            {/* Right Hand side: Probability gauges & Legislation forecasting */}
            <div className="lg:col-span-5 space-y-5">
              {/* Score section */}
              <div className="bg-slate-50 rounded-xl border border-slate-205 p-5 space-y-4 shadow-3xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Scale className="h-4.5 w-4.5 text-slate-700" />
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight">2. Approval Probability</h4>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-3.5 rounded-lg border border-slate-200 text-center space-y-1 shadow-4xs">
                    <span className="text-[10.5px] font-sans text-slate-500 block uppercase tracking-wider font-semibold">Approval %</span>
                    <div className="text-3xl font-mono font-black text-slate-850">
                      {approval_probability}%
                    </div>
                    {/* Tiny visual progress bar */}
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          approval_probability > 75 
                            ? "bg-emerald-500" 
                            : approval_probability > 40 
                            ? "bg-yellow-500" 
                            : "bg-red-500"
                        }`}
                        style={{ width: `${approval_probability}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-white p-3.5 rounded-lg border border-slate-200 text-center space-y-1 shadow-4xs">
                    <span className="text-[10.5px] font-sans text-slate-500 block uppercase tracking-wider font-semibold">Legal Review</span>
                    <div className="text-3xl font-mono font-black text-slate-850">
                      {legal_review_time} <span className="text-xs font-sans text-slate-500 font-semibold">days</span>
                    </div>
                    {/* Micro timer clock layout */}
                    <div className="flex items-center justify-center gap-1.5 mt-2.5 text-slate-400">
                      <Clock className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Estimated</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chief Risk Officer Legislation Forecast */}
              <div className="bg-indigo-50/50 rounded-xl border border-indigo-100/90 p-5 space-y-2.5 shadow-3xs text-indigo-950">
                <div className="flex items-center gap-2 border-b border-indigo-100 pb-2">
                  <ShieldAlert className="h-4.5 w-4.5 text-indigo-700 shrink-0" />
                  <h4 className="text-xs font-black text-slate-850 uppercase tracking-tight">3. CRO Legislative Forecast</h4>
                </div>
                <p className="text-xs font-sans leading-relaxed text-indigo-950/90 antialiased">
                  {legislation_forecasting ? (
                    legislation_forecasting.replace(/^Forecast:\s*/i, "")
                  ) : (
                    "Analyzing upcoming global legislations (Basel III Endgame, OSFI AI draft guidelines, EU AI Act, FINRA mandates) against the submitted design parameters..."
                  )}
                </p>
                <div className="text-[9.5px] font-mono text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded inline-block font-extrabold tracking-wide uppercase">
                  Conservative Audit Mode
                </div>
              </div>

              {/* Current Regulatory News Alert Bulletin */}
              <div className="bg-amber-50/40 rounded-xl border border-amber-100/90 p-5 space-y-2.5 shadow-3xs text-amber-950">
                <div className="flex items-center gap-2 border-b border-amber-100 pb-2">
                  <Newspaper className="h-4.5 w-4.5 text-amber-700 shrink-0" />
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight font-sans">4. Current Regulatory News Bulletin</h4>
                </div>
                <p className="text-xs font-sans leading-relaxed text-amber-900 antialiased">
                  {news_bulletin ? (
                    news_bulletin
                  ) : (
                    "Retrieving relevant ongoing supervisory developments, global SEC/FTC cyber bulletins, or FINRA warnings matching this innovation category..."
                  )}
                </p>
                <div className="text-[9.5px] font-mono text-amber-700 bg-amber-100 px-2 py-0.5 rounded inline-block font-extrabold tracking-wide uppercase">
                  Real-World Regulatory Context
                </div>
              </div>
            </div>
          </div>

          {/* Active Corporate Sandbox Rule matched, if any */}
          {citation && citation !== "None" && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
              <Info className="h-4.5 w-4.5 text-indigo-505 mt-0.5 shrink-0" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono bg-blue-100 text-blue-800 border border-blue-200 font-bold px-1.5 py-0.5 rounded uppercase">
                    Rule code: {citation}
                  </span>
                  {matchedRule && (
                    <span className="text-xs font-bold text-slate-800">
                      {matchedRule.name}
                    </span>
                  )}
                </div>
                <p className="text-[11.5px] text-slate-600 leading-relaxed font-sans mt-0.5">
                  {matchedRule ? matchedRule.description : `Triggered rule guidelines for standard security context matches.`}
                </p>
              </div>
            </div>
          )}

          {/* Review status notice footer has been deleted per user request */}
        </div>
      ) : (
        /* Strict Text Transcript View representing strictly compiled, raw formatted markdown */
        <div className="p-6 flex flex-col flex-grow space-y-4">
          <div className="bg-slate-50 p-4 border border-slate-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-700">
              <FileText className="h-4.5 w-4.5 text-blue-600" />
              <span className="text-xs font-bold font-sans">Strictly Formatted Gatekeeper Audit Transcript</span>
            </div>
            <button
              onClick={handleCopyText}
              className="flex items-center gap-1.5 text-xs bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-sans px-3 py-1.5 rounded-lg shadow-xs cursor-pointer transition active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold font-mono">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Text</span>
                </>
              )}
            </button>
          </div>

          <div className="flex-grow bg-slate-900 text-slate-100 font-mono text-xs p-5 rounded-xl border border-slate-800 overflow-y-auto max-h-[460px] shadow-sm leading-relaxed text-left whitespace-pre-wrap">
            {full_gatekeeper_formatted_text || "Compiling Financial Compliance Gatekeeper raw output transcript..."}
          </div>

          <p className="text-[11px] text-slate-400 italic">
            * This text transcript adheres strictly to the layout parameters required by risk auditors at global banking operations.
          </p>
        </div>
      )}
    </div>
  );
}
