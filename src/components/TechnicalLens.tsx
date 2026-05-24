import { TechnicalAnalysis, TechnicalPipelineStep } from "../types";
import { Wrench, CheckCircle2, ShieldAlert, AlertTriangle, AlertCircle, HelpCircle, ArrowRight, Lock, Check, AlertOctagon } from "lucide-react";

interface TechnicalLensProps {
  analysis: TechnicalAnalysis;
}

export default function TechnicalLens({ analysis }: TechnicalLensProps) {
  const { approved_tools_to_use, restricted_access_required, banned_tools_flagged, pipeline } = analysis;

  const hasBanned = banned_tools_flagged && banned_tools_flagged.length > 0;
  const hasRestricted = restricted_access_required && restricted_access_required.length > 0;

  // Generate an elegant default pipeline as a fallback if the analyzer response hasn't synced yet
  const defaultSteps: TechnicalPipelineStep[] = [
    {
      stage: "1. Frontend Host",
      tool: "React with Vite",
      status: "green",
      action: "Standard corporate UI ingress with local state persistence."
    },
    ...((approved_tools_to_use || []).map((t, i) => ({
      stage: `2.${i + 2} Core Execution`,
      tool: t,
      status: "green" as const,
      action: "Utilize approved secure cloud microservice routines."
    }))),
    ...((restricted_access_required || []).map((t, i) => ({
      stage: `3.${i + 1} System Bridge`,
      tool: t,
      status: "yellow" as const,
      action: "Requires active authorization token & security credentials."
    }))),
    ...((banned_tools_flagged || []).map((t, i) => ({
      stage: `4. Danger Ring`,
      tool: t,
      status: "red" as const,
      action: "DANGER: Core architectural policy blocker! Ditch immediately."
    })))
  ];

  const steps = (pipeline && pipeline.length > 0) ? pipeline : defaultSteps.slice(0, 5);

  return (
    <div id="technical-lens" className="bg-white rounded-xl border border-slate-200/85 overflow-hidden shadow-sm flex flex-col h-full">
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wrench className="h-5 w-5 text-slate-700" />
          <h3 className="font-semibold text-slate-800 text-sm uppercase tracking-wider">Technical Infrastructure Lens</h3>
        </div>
        <span className="text-[10px] font-mono bg-slate-200 text-slate-700 px-2 py-0.5 rounded uppercase font-semibold">
          Stack Alignment
        </span>
      </div>

      <div className="p-6 space-y-6 flex-grow flex flex-col justify-between">
        
        {/* Visual End-to-End Compile Pipeline */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-extrabold block">
              Core End-to-End Implementation Pipeline
            </span>
            <span className="text-[9.5px] font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-black uppercase">
              Build Flow
            </span>
          </div>

          <div className="flex flex-col lg:flex-row gap-2 lg:items-stretch">
            {steps.map((step, idx) => {
              const itemStatus = step.status || "green";
              
              // Define colored styles based on status values
              let borderClass = "border-emerald-500 bg-emerald-50/40 text-emerald-900 shadow-[0_0_10px_rgba(16,185,129,0.1)]";
              let circleClass = "border-emerald-500 bg-emerald-100/80 text-emerald-700";
              let statusIcon = <Check className="h-3.5 w-3.5" />;
              
              if (itemStatus === "yellow") {
                borderClass = "border-amber-500 bg-amber-50/40 text-amber-900 shadow-[0_0_10px_rgba(245,158,11,0.1)]";
                circleClass = "border-amber-500 bg-amber-100/80 text-amber-700";
                statusIcon = <AlertTriangle className="h-3.5 w-3.5" />;
              } else if (itemStatus === "red") {
                borderClass = "border-red-500 bg-red-50/50 text-red-900 shadow-[0_0_15px_rgba(239,68,68,0.15)] animate-pulse";
                circleClass = "border-red-500 bg-red-100 text-red-700";
                statusIcon = <Lock className="h-3.5 w-3.5" />;
              }

              return (
                <div key={idx} className="flex flex-col lg:flex-row flex-grow items-center gap-1.5">
                  {/* Step Card with green, yellow, red circles around tool */}
                  <div className={`w-full p-3 rounded-lg border-2 ${borderClass} flex flex-col justify-between min-h-[145px] transition-all hover:scale-[1.01]`}>
                    <div>
                      {/* Step Stage header */}
                      <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 font-bold block">
                        {step.stage}
                      </span>
                      
                      {/* Circle Container wrapping the core Tool/Framework */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className={`h-7 w-7 rounded-full border-2 ${circleClass} flex items-center justify-center shrink-0`}>
                          {statusIcon}
                        </div>
                        <span className="text-[12.5px] font-black tracking-tight font-mono truncate max-w-full">
                          {step.tool}
                        </span>
                      </div>
                    </div>

                    {/* Action Guideline explanation block */}
                    <div className="mt-2.5 pt-2 border-t border-slate-200/40">
                      <p className="text-[10.5px] text-slate-600 leading-normal font-sans font-medium line-clamp-3">
                        {step.action}
                      </p>
                    </div>
                  </div>

                  {/* Connecting Arrow for Desktop layouts */}
                  {idx < steps.length - 1 && (
                    <div className="hidden lg:flex items-center justify-center text-slate-300">
                      <ArrowRight className="h-4 w-4 shrink-0" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Alerts if banned exist */}
        {hasBanned && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <ShieldAlert className="h-5 w-5 text-red-600 shrink-0 animate-bounce" />
            <div className="text-xs">
              <span className="font-bold text-red-900 block">Critical Stack Violation</span>
              <p className="text-red-700 font-medium leading-relaxed mt-0.5">
                The simulated idea utilizes tools labeled as <strong className="font-bold">Banned</strong> in the enterprise environment: <span className="font-mono bg-red-100 px-1 py-0.5 rounded text-red-800">{banned_tools_flagged.join(", ")}</span>. This requires immediate architectural redirection.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
          {/* Approved & Applied */}
          <div className="bg-emerald-50/20 border border-emerald-150/80 p-4 rounded-xl space-y-3">
            <div className="flex items-center gap-1 text-emerald-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <h4 className="text-xs font-bold uppercase tracking-wider">Approved Stack</h4>
            </div>
            
            {approved_tools_to_use && approved_tools_to_use.length > 0 ? (
              <div className="space-y-1.5">
                {approved_tools_to_use.map(tool => (
                  <div key={tool} className="flex items-center gap-2 text-xs text-slate-705 bg-emerald-50/50 px-2 py-1 rounded border border-emerald-100">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    <span className="font-medium font-mono">{tool}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No approved tools detected in description.</p>
            )}
          </div>

          {/* Restricted & Tracked */}
          <div className={`p-4 rounded-xl space-y-3 border ${
            hasRestricted ? "bg-amber-50/20 border-amber-200/60" : "bg-slate-50 border-slate-200"
          }`}>
            <div className="flex items-center gap-1 text-amber-800">
              <AlertTriangle className={`h-4 w-4 ${hasRestricted ? 'text-amber-500 animate-pulse' : 'text-slate-400'}`} />
              <h4 className="text-xs font-bold uppercase tracking-wider">Restricted Core</h4>
            </div>
            
            {restricted_access_required && restricted_access_required.length > 0 ? (
              <div className="space-y-1.5">
                {restricted_access_required.map(tool => (
                  <div key={tool} className="flex items-center justify-between gap-2 text-xs text-slate-705 bg-amber-50/30 px-2 py-1 rounded border border-amber-100">
                    <span className="font-medium font-mono truncate">{tool}</span>
                    <span className="text-[8px] uppercase tracking-wide font-bold bg-amber-100 text-amber-800 px-1 py-0.5 rounded leading-none">
                      Audit Req
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No restricted ledger triggers identified.</p>
            )}
          </div>

          {/* Banned Elements */}
          <div className={`p-4 rounded-xl space-y-3 border ${
            hasBanned ? "bg-red-50/20 border-red-200/60" : "bg-slate-50 border-slate-200"
          }`}>
            <div className="flex items-center gap-1 text-red-800">
              <AlertCircle className={`h-4 w-4 ${hasBanned ? 'text-red-500' : 'text-slate-400'}`} />
              <h4 className="text-xs font-bold uppercase tracking-wider">Banned Assets</h4>
            </div>
            
            {banned_tools_flagged && banned_tools_flagged.length > 0 ? (
              <div className="space-y-1.5">
                {banned_tools_flagged.map(tool => (
                  <div key={tool} className="flex items-center justify-between gap-2 text-xs text-red-700 bg-red-50/30 px-2 py-1 rounded border border-red-100">
                    <span className="font-semibold font-mono truncate">{tool}</span>
                    <span className="text-[8px] uppercase tracking-wide font-semibold bg-red-100 text-red-800 px-1 py-0.5 rounded leading-none shrink-0">
                      Blocker
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No blacklisted systems flagged.</p>
            )}
          </div>
        </div>

        {/* Step 2: Technical Feasibility & App Restrictions */}
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/30 mt-4">
          <div className="bg-slate-100/80 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-slate-700 font-bold" />
              <h4 className="text-xs font-black uppercase tracking-tight text-slate-800">
                Step 2: Technical Feasibility & App Restrictions
              </h4>
            </div>
            <span className="text-[9px] font-mono font-extrabold uppercase bg-slate-200 text-slate-800 px-2 py-0.5 rounded border border-slate-300">
              Governance & DLP Audit
            </span>
          </div>
          
          <div className="p-4 space-y-4">
            {/* Hard Block Banner if active */}
            {analysis.hard_block_active ? (
              <div className="p-4 rounded-lg bg-red-55/90 border-2 border-red-300 shadow-sm flex items-start gap-3">
                <AlertOctagon className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-xs font-black tracking-tight text-slate-900 uppercase">
                    CRITICAL EXCLUSION BLOCKER (DLP AUDIT VIOLATION)
                  </span>
                  <p className="text-xs text-red-950 font-sans leading-relaxed font-bold">
                    {analysis.hard_block_reason || "Access to high-restriction database tier is blocked for the selected tools."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-emerald-50/55 border border-emerald-250/70 rounded-lg flex items-center gap-2.5">
                <Check className="h-5 w-5 text-emerald-600 font-black" />
                <span className="text-xs font-sans text-emerald-950 font-semibold">
                  Approved for Sandbox Dev: Proposed data integration conforms to standard DLP permissions. No architectural hard blocks.
                </span>
              </div>
            )}

            <div className="space-y-4">
              {/* Full-width Data Governance & DLP Check */}
              <div className="bg-white border border-slate-205 p-4 rounded-lg shadow-3xs">
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-[10px] font-extrabold text-slate-500 uppercase font-mono">
                      Data Governance & DLP Check
                    </span>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${analysis.hard_block_active ? "bg-red-50 text-red-700 border border-red-200 animate-pulse" : "bg-emerald-50 text-emerald-700 border border-emerald-200"}`}>
                      {analysis.hard_block_active ? "DLP Blocked" : "DLP Cleared"}
                    </span>
                  </div>
                  <p className="text-[11.5px] text-slate-800 leading-relaxed font-sans font-semibold">
                    {analysis.dlp_governance_check || "No data tier violations detected for the active toolchain."}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Integration Friction Quote */}
                <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-3xs">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase font-mono">
                        Integration Friction Prediction
                      </span>
                      <span className="text-[9px] font-mono bg-blue-50 text-blue-700 font-bold px-1.5 py-0.5 rounded uppercase border border-blue-150">
                        IT Assessment
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-700 leading-relaxed font-sans font-medium">
                      {analysis.integration_friction_prediction || "Minimal enterprise deployment friction predicted."}
                    </p>
                  </div>
                </div>

                {/* Shadow IT Forecast */}
                <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-3xs">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase font-mono">
                        Shadow IT Forecast
                      </span>
                      <span className="text-[9px] font-mono bg-amber-50 text-amber-700 font-bold px-1.5 py-0.5 rounded uppercase border border-amber-150">
                        Risk Projection
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-700 leading-relaxed font-sans font-medium">
                      {analysis.shadow_it_forecast || "Risks of unsecure employee walkarounds on alternative applications are evaluated as low (0%)."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            
          </div>
        </div>

        {/* Dynamic Architectural Recommendations */}
        <div className="mt-4 bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1">
          <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-bold block">
            Architectural Action Plan
          </span>
          <div className="text-xs text-slate-600 leading-relaxed font-normal">
            {hasBanned ? (
              <p className="flex items-start gap-1.5 mt-1">
                <span>⚠️</span>
                <span>Swap out flagged tools immediately. For AI capabilities, replace public ChatGPT endpoints with the pre-approved enterprise-isolated <strong className="text-slate-900">Google Cloud Vertex AI</strong> or local hosting structures.</span>
              </p>
            ) : hasRestricted ? (
              <p className="flex items-start gap-1.5 mt-1">
                <span>ℹ️</span>
                <span>Requires raising an IT ticket for API credential access to the secure core systems. Access is reviewable on a quarterly basis.</span>
              </p>
            ) : (
              <p className="flex items-start gap-1.5 mt-1">
                <span>✓</span>
                <span>Your technical architecture lies entirely within pre-approved parameters. Pre-cleared for local environment testing.</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
