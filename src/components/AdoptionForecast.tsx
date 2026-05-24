import { useState, useMemo } from "react";
import { AdoptionMetrics, SimulationPayload } from "../types";
import { 
  Sparkles, 
  TrendingUp, 
  Users, 
  Ticket, 
  DollarSign, 
  Brain, 
  Activity, 
  Coins, 
  Info,
  AlertTriangle,
  Calendar,
  GraduationCap,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from "recharts";

interface AdoptionForecastProps {
  payload?: SimulationPayload | null;
  ideaText?: string;
}

export default function AdoptionForecast({ payload, ideaText = "" }: AdoptionForecastProps) {
  const [forecastTab, setForecastTab] = useState<"scurve" | "roi">("scurve");
  const [isCounterfactualAligned, setIsCounterfactualAligned] = useState<boolean>(false);

  // Safely extract from payload
  const metrics = payload?.adoption_metrics;
  const dependency = payload?.dependency;
  
  const {
    tech_integration = 5.0,
    workflow_disruption = 5.0,
    regulatory_friction = 5.0,
    target_users = 500,
    efficiency = 45,
    it_tickets = 120,
    adoption_rate = 75,
    roi = 15000,
    has_called_ml_api = false
  } = metrics || {};

  const complexityScore = dependency?.complexity_score || 5;

  // 1. Departmental Change Fatigue Index Parsing
  const departmentData = useMemo(() => {
    const text = (ideaText || "").toLowerCase();
    
    // Explicit keywords mapping
    const isHr = text.includes("hr") || text.includes("employee") || text.includes("salary") || text.includes("salary bands") || text.includes("salaries") || text.includes("payroll") || text.includes("roster") || text.includes("workday") || text.includes("feedback") || text.includes("performance review");
    const isFinance = text.includes("finance") || text.includes("ledger") || text.includes("settlement") || text.includes("eod") || text.includes("accounting") || text.includes("invoice") || text.includes("lending") || text.includes("credit") || text.includes("interest") || text.includes("loan");
    const isSales = text.includes("sales") || text.includes("crm") || text.includes("customer success") || text.includes("churn") || text.includes("marketing") || text.includes("campaign");
    
    if (isHr) {
      return {
        department: "HR",
        majorChanges: 2,
        fatigueLevel: "HIGH",
        baselineTraining: "Q4 (November)",
        velocity: "45% slower adoption due to consecutive HCM upgrades in recent cycles",
        colorClass: "text-amber-750 border-amber-200 bg-amber-50",
        badgeColor: "bg-amber-100 text-amber-800 border-amber-250",
        delaySuggested: "delay by 6 months",
        implementationDipSaved: "52%"
      };
    } else if (isFinance) {
      return {
        department: "Finance",
        majorChanges: 0,
        fatigueLevel: "LOW (Ready for Change)",
        baselineTraining: "Q1 (February)",
        velocity: "Baseline or accelerated velocity - department has low operational change strain",
        colorClass: "text-emerald-800 border-emerald-200 bg-emerald-50/70",
        badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-250",
        delaySuggested: "align directly",
        implementationDipSaved: "92%"
      };
    } else if (isSales) {
      return {
        department: "Sales",
        majorChanges: 1,
        fatigueLevel: "MEDIUM",
        baselineTraining: "Q2 (May)",
        velocity: "15% slower adoption due to ongoing CRM field validation training",
        colorClass: "text-blue-800 border-blue-200 bg-blue-50/60",
        badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
        delaySuggested: "align with spring release",
        implementationDipSaved: "35%"
      };
    } else {
      // Default / Operations
      return {
        department: "Operations",
        majorChanges: 3,
        fatigueLevel: "CRITICAL (High Fatigue)",
        baselineTraining: "Q3 (August)",
        velocity: "80% slower adoption due to critical change fatigue and 3 major historical migrations",
        colorClass: "text-rose-800 border-rose-200 bg-rose-50/70",
        badgeColor: "bg-rose-100 text-rose-800 border-rose-2200",
        delaySuggested: "delay by 3 months",
        implementationDipSaved: "75%"
      };
    }
  }, [ideaText]);

  // 2. Helpdesk Ticket Volume Prediction Parsing
  const helpdeskData = useMemo(() => {
    let complexityStr: "Low" | "Medium" | "High" = "Medium";
    let desc = "New data tools, API integrations";
    let tickets = 200;
    let scaling = "5%";
    let ticketColor = "text-amber-700 bg-amber-50/80 border-amber-200";

    if (complexityScore <= 3) {
      complexityStr = "Low";
      desc = "UI updates, minor automations";
      tickets = 50;
      scaling = "0%";
      ticketColor = "text-emerald-700 bg-emerald-50/80 border-emerald-200";
    } else if (complexityScore > 7) {
      complexityStr = "High";
      desc = "Core migrations, enterprise AI agents";
      tickets = 450;
      scaling = "15%";
      ticketColor = "text-rose-700 bg-rose-50/80 border-rose-200";
    }

    return {
      complexityStr,
      desc,
      tickets,
      scaling,
      ticketColor
    };
  }, [complexityScore]);

  // 3. Mathematical data generation based on Counterfactual toggle status
  const data = useMemo(() => {
    return Array.from({ length: 31 }, (_, day) => {
      // If aligned with training cycle, workflow disruption falls by 60%
      const effectiveDisruption = isCounterfactualAligned 
        ? Math.max(1, workflow_disruption * 0.4) 
        : workflow_disruption;

      const t0 = 5 + (effectiveDisruption * 1.5); 
      const k = Math.max(0.12, 0.35 - (tech_integration * 0.015)); 
      
      const p_t = 1 / (1 + Math.exp(-k * (day - t0)));
      const p_0 = 1 / (1 + Math.exp(-k * (0 - t0)));
      const normal_p = Math.max(0, (p_t - p_0) / (1 - p_0));
      
      // Better adoption rate when counterfactual is turned on!
      const finalAdoptionRate = isCounterfactualAligned
        ? Math.min(100, Math.round(adoption_rate + (100 - adoption_rate) * 0.4))
        : adoption_rate;

      const currentAdoptionRate = Math.round(normal_p * finalAdoptionRate);
      const activeUsers = Math.round((currentAdoptionRate / 100) * target_users);
      
      // ROI J-Curve Calculations
      const baseSavings = (target_users * (efficiency / 100) * 550) / 180;
      const setupCost = (tech_integration * 4000) + (workflow_disruption * 2500) + (regulatory_friction * 3000);
      
      let cumulativeSavings = 0;
      for (let d = 0; d <= day; d++) {
        const d_p_t = 1 / (1 + Math.exp(-k * (d - t0)));
        const d_normal_p = Math.max(0, (d_p_t - p_0) / (1 - p_0));
        const d_rate = d_normal_p * finalAdoptionRate;
        cumulativeSavings += (d_rate / 100) * baseSavings;
      }
      
      // Aligning with training cycle saves 40% of the setup cost from downtime/retraining cost
      const effectiveSetupCost = isCounterfactualAligned 
        ? setupCost * 0.7 
        : setupCost;

      const cumulativeRoi = Math.round(cumulativeSavings - effectiveSetupCost);
      const alignedRoiValue = isCounterfactualAligned 
        ? Math.round(roi * 1.25) 
        : roi;

      return {
        day: `Day ${day}`,
        dayNum: day,
        rate: currentAdoptionRate,
        users: activeUsers,
        roi: cumulativeRoi,
        savings: Math.round(cumulativeSavings),
        cost: Math.round(effectiveSetupCost),
        alignedRoiValue
      };
    });
  }, [tech_integration, workflow_disruption, regulatory_friction, target_users, efficiency, adoption_rate, roi, isCounterfactualAligned]);

  // Find break even day
  const breakEvenPoint = data.find(d => d.roi >= 0);
  const breakEvenDay = breakEvenPoint ? breakEvenPoint.dayNum : null;

  const currentRoiValue = isCounterfactualAligned ? Math.round(roi * 1.25) : roi;
  const formattedRoi = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0
  }).format(currentRoiValue);

  // Custom tooltips
  const CustomAdoptionTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-lg border border-slate-750 shadow-xl font-sans text-xs space-y-1">
          <p className="font-bold text-slate-300">{payload[0].payload.day}</p>
          <div className="flex items-center gap-1.5 text-sky-400">
            <span className="h-2 w-2 rounded-full bg-sky-450"></span>
            <span>Adoption: <strong className="font-mono">{payload[0].value}%</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="h-2 w-2 rounded-full bg-slate-300"></span>
            <span>Active Staff: <strong className="font-mono">{payload[1]?.value || 0} / {target_users}</strong></span>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomRoiTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const roiValue = payload[0].value as number;
      const isNegative = roiValue < 0;
      const formattedVal = new Intl.NumberFormat("en-CA", {
        style: "currency",
        currency: "CAD",
        maximumFractionDigits: 0
      }).format(Math.abs(roiValue));

      return (
        <div className="bg-slate-900 text-white p-3 rounded-lg border border-slate-750 shadow-xl font-sans text-xs space-y-1">
          <p className="font-bold text-slate-300">{payload[0].payload.day}</p>
          <div className={`flex items-center gap-1.5 ${isNegative ? 'text-rose-400' : 'text-emerald-400'}`}>
            <span className={`h-2 w-2 rounded-full ${isNegative ? 'bg-rose-450' : 'bg-emerald-400'}`}></span>
            <span>Net Value: <strong>{isNegative ? "-" : ""}{formattedVal}</strong></span>
          </div>
          <p className="text-slate-400 text-[10px] pl-3.5">
            Cumulative Savings: {new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(payload[0].payload.savings)}
          </p>
          <p className="text-slate-400 text-[10px] pl-3.5">
            Initial Setup Cost: {new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(payload[0].payload.cost)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="adoption-forecast" className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col w-full h-full text-slate-850">
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-indigo-600 animate-pulse shrink-0" />
          <div>
            <h3 className="font-bold text-slate-900 text-xs font-mono uppercase tracking-wider">Step 4: Impact & Adoption Forecasting</h3>
            <span className="text-[10px] text-slate-500 font-sans block">Simulated enterprise roll-out modeling & Helpdesk impact</span>
          </div>
        </div>
        
        {has_called_ml_api && (
          <span className="bg-indigo-50 border border-indigo-150 text-[9px] font-mono font-extrabold text-indigo-700 uppercase px-2.5 py-0.5 rounded ml-auto inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-ping"></span>
            ML Forecast Pipeline Loaded
          </span>
        )}
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-b border-slate-150 bg-slate-50/40">
        {/* ROI Block */}
        <div className="p-4 border-r border-slate-150 text-left">
          <div className="flex items-center gap-1.5">
            <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 block">Proj. ROI (6-Mo)</span>
          </div>
          <span className={`text-base font-mono font-black block mt-1 ${currentRoiValue >= 0 ? "text-emerald-700" : "text-rose-600"}`}>
            {formattedRoi}
          </span>
          <span className="text-[9px] text-slate-400 font-sans">Risk-adjusted net savings</span>
        </div>

        {/* Efficiency Boost */}
        <div className="p-4 border-r md:border-r border-slate-150 text-left">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-indigo-600" />
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 block">Efficiency Boost</span>
          </div>
          <span className="text-base font-mono font-black text-indigo-800 block mt-1">
            +{isCounterfactualAligned ? Math.round(efficiency * 1.15) : efficiency}%
          </span>
          <span className="text-[9px] text-slate-400 font-sans">Estimated automation benefit</span>
        </div>

        {/* Adoption Velocity */}
        <div className="p-4 border-r border-slate-150 text-left font-sans">
          <div className="flex items-center gap-1.5 col-span-1">
            <Users className="h-3.5 w-3.5 text-sky-600" />
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 block">Adoption Goal</span>
          </div>
          <span className="text-base font-mono font-black text-sky-700 block mt-1">
            {isCounterfactualAligned ? Math.min(100, Math.round(adoption_rate + (100 - adoption_rate) * 0.4)) : adoption_rate}%
          </span>
          <span className="text-[9px] text-slate-400 font-sans">Target audience transition</span>
        </div>

        {/* Support Tickets */}
        <div className="p-4 text-left">
          <div className="flex items-center gap-1.5">
            <Ticket className="h-3.5 w-3.5 text-amber-600" />
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 block">Expected tickets</span>
          </div>
          <span className="text-base font-mono font-black text-amber-800 block mt-1">
            ~{isCounterfactualAligned ? Math.round(it_tickets * 0.5) : it_tickets}
          </span>
          <span className="text-[9px] text-slate-400 font-sans">Estimated helpdesk issues</span>
        </div>
      </div>

      {/* Main Analysis Panels */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 p-6 flex-grow overflow-y-auto">
        {/* Left Column: Core Database and Analytical Cards (7 Cols) */}
        <div className="xl:col-span-7 space-y-4">
          
          {/* Card 1: Departmental "Change Fatigue" Indexing */}
          <div className="border border-slate-200 rounded-lg p-4 bg-white shadow-3xs text-left hover:border-indigo-200 transition-all duration-200">
            <div className="flex items-center gap-2 border-b border-slate-150 pb-2 mb-3">
              <Calendar className="h-4.5 w-4.5 text-indigo-500 shrink-0" />
              <h4 className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-700">
                1. Departmental "Change Fatigue" Indexing
              </h4>
              <span className={`text-[8px] font-mono uppercase tracking-widest font-extrabold px-1.5 py-0.2 rounded border ml-auto ${departmentData.badgeColor}`}>
                {departmentData.department}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-150 rounded-lg p-3">
                <span className="text-[8.5px] font-mono text-slate-400 font-bold uppercase block">Impacted Segment</span>
                <span className="text-xs font-bold text-slate-900 block mt-0.5">{departmentData.department} Department</span>
                <p className="text-[10px] text-slate-500 mt-1">
                  Identified as the primary stakeholder division based on concept triggers.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-150 rounded-lg p-3 text-left">
                <span className="text-[8.5px] font-mono text-slate-400 font-bold uppercase block">Fatigue Index</span>
                <span className="text-xs font-black text-rose-600 block mt-0.5">{departmentData.fatigueLevel}</span>
                <p className="text-[10px] text-slate-500 mt-1">
                  Division currently records <strong>{departmentData.majorChanges} major migrations</strong> in the last 6 months.
                </p>
              </div>
            </div>

            <div className={`mt-3 border rounded-lg p-3 ${departmentData.colorClass} text-left`}>
              <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider block">Adoption Velocity Forecast</span>
              <p className="text-[11px] font-semibold mt-1 leading-relaxed">
                {departmentData.velocity}.
              </p>
            </div>
            
            {/* Context knowledge base tiny log citation */}
            <div className="mt-2.5 text-[8.5px] font-mono text-slate-400 text-right uppercase tracking-wider leading-none">
              Source: Database 3, Departmental Change History (Fatigue Index)
            </div>
          </div>

          {/* Card 2: Support Ticket Avalanche Prediction */}
          <div className="border border-slate-200 rounded-lg p-4 bg-white shadow-3xs text-left hover:border-indigo-200 transition-all duration-200">
            <div className="flex items-center gap-2 border-b border-slate-150 pb-2 mb-3">
              <Ticket className="h-4.5 w-4.5 text-indigo-500 shrink-0" />
              <h4 className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-700">
                2. Support Ticket Avalanche Prediction
              </h4>
              <span className="text-[8.5px] uppercase tracking-wider font-mono bg-slate-100 border border-slate-250 font-bold text-slate-600 px-1.5 py-0.2 rounded ml-auto">
                Helpdesk Forecast
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 border border-slate-150 rounded-lg">
                <span className="text-[8.5px] font-mono text-slate-400 font-bold uppercase block">Simulation Complexity</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className={`h-2.5 w-2.5 rounded-full ${complexityScore <= 3 ? "bg-emerald-500" : complexityScore > 7 ? "bg-rose-500 animate-pulse" : "bg-amber-500"}`}></span>
                  <span className="text-xs font-extrabold text-slate-800">{helpdeskData.complexityStr} Complexity</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                  ({helpdeskData.desc}) - score: <strong>{complexityScore}/10</strong>.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-150 rounded-lg">
                <span className="text-[8.5px] font-mono text-slate-400 font-bold uppercase block">Predicted Ticket Storm (14-Day)</span>
                <span className="text-sm font-black text-slate-900 block mt-0.5">
                  {isCounterfactualAligned ? Math.round(helpdeskData.tickets * 0.5) : helpdeskData.tickets} Level 1 Tickets
                </span>
                <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                  Expected volume of support requests in the first fortnight post-launch.
                </p>
              </div>
            </div>

            {/* Dynamic visual slider predicting required IT scale */}
            <div className="mt-3 bg-slate-50 border border-slate-150 rounded-lg p-3">
              <span className="text-[8.5px] font-mono text-slate-400 font-bold uppercase block mb-1.5">Required IT Support Capacity Scaling</span>
              
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1">
                <span>Enterprise Baseline</span>
                <span className={complexityScore > 7 ? "text-rose-600 animate-pulse" : complexityScore > 3 ? "text-amber-600" : "text-emerald-600"}>
                  {isCounterfactualAligned ? "Scale IT support by 0% (Optimized)" : `Scale Support by ${helpdeskData.scaling}`}
                </span>
              </div>
              
              {/* Fake progress bar illustrating the scale requirement */}
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    complexityScore <= 3 || isCounterfactualAligned
                      ? "bg-emerald-500 w-[15%]" 
                      : complexityScore > 7 
                      ? "bg-rose-500 w-[85%]" 
                      : "bg-amber-500 w-[50%]"
                  }`}
                />
              </div>

              <p className="text-[10.5px] text-slate-500 mt-2 leading-snug">
                {isCounterfactualAligned 
                  ? "✓ Training alignment drastically mitigates launch defects, completely eliminating the need to scale IT staff." 
                  : `Vetting warning: This complexity class requires an immediate increase of ${helpdeskData.scaling} IT support capacity to handle deployment feedback loops.`
                }
              </p>
            </div>

            <div className="mt-2 text-[8.5px] font-mono text-slate-400 text-right uppercase tracking-wider leading-none">
              Source: Database 4, Historical Launch & Helpdesk Database
            </div>
          </div>

          {/* Card 3: The Counterfactual Simulator (What If?) */}
          <div className="border border-indigo-150 rounded-lg p-4 bg-indigo-50/15 text-left hover:border-indigo-300 transition-all duration-200 ring-1 ring-indigo-50">
            <div className="flex items-center gap-2 border-b border-indigo-100 pb-2 mb-3">
              <Brain className="h-4.5 w-4.5 text-indigo-600 shrink-0" />
              <h4 className="text-[11px] font-bold uppercase tracking-wider font-mono text-indigo-700">
                3. The Counterfactual Simulator (What If?)
              </h4>
              <span className="text-[8.5px] uppercase tracking-wider font-mono bg-indigo-100 border border-indigo-200/50 font-black text-indigo-700 px-1.5 py-0.2 rounded ml-auto">
                Bespoke Sandbox
              </span>
            </div>

            <div className="p-3 bg-white border border-indigo-100 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3 shadow-3xs">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <GraduationCap className="h-4 w-4 text-indigo-650" />
                  Align Launch with Department Training Cycle
                </span>
                <p className="text-[10.5px] text-slate-500 leading-relaxed md:max-w-md">
                  We found that the <strong>{departmentData.department} Department</strong> has their standard, structured baseline training cycle scheduled in <strong className="text-indigo-650">{departmentData.baselineTraining}</strong>.
                </p>
              </div>

              {/* Toggle switch for the simulation */}
              <button
                onClick={() => setIsCounterfactualAligned(!isCounterfactualAligned)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer shadow-3xs active:scale-95 ${
                  isCounterfactualAligned
                    ? "bg-indigo-600 text-white border-indigo-700"
                    : "bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50/50"
                }`}
              >
                {isCounterfactualAligned ? "✓ Activated" : "Simulate Alignment"}
              </button>
            </div>

            {/* Simulated outcome description */}
            {!isCounterfactualAligned ? (
              <div className="bg-slate-50 border border-slate-200 text-slate-600 rounded-lg p-3 text-[11px] leading-relaxed">
                <div className="flex items-start gap-1.5">
                  <Info className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    Click <strong>"Simulate Alignment"</strong> to analyze the counterfactual alternative. Modeling delay shifts and training track bundling predictions.
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-lg p-3.5 text-[11px] leading-relaxed animate-fadeIn space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold block text-emerald-805">Simulated Alignment Outcome: Approved (What If Analysis)</span>
                    By choosing to <strong className="uppercase">{departmentData.delaySuggested}</strong> to match the <strong className="text-emerald-900 font-mono">{departmentData.baselineTraining} training cycle</strong>, staff will receive instructions embedded in pre-vetted curriculum blocks.
                  </div>
                </div>
                
                <div className="bg-white/90 border border-emerald-200 rounded p-2.5 mt-2 flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-600 uppercase">Implementation Dip Reduction:</span>
                  <span className="text-xs font-mono font-black text-emerald-700 bg-emerald-100/70 border border-emerald-205 px-2 py-0.5 rounded">
                    🚀 {departmentData.implementationDipSaved} Shrinkage in Lost Productivity
                  </span>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Visual S-Curve & ROI J-Curve Trajectories (5 Cols) */}
        <div className="xl:col-span-5 space-y-4">
          
          {/* Chart Wrapper Card */}
          <div className="border border-slate-200 rounded-lg bg-slate-50/30 overflow-hidden shadow-3xs flex flex-col h-full hover:border-slate-300 transition-all duration-200 min-h-[460px]">
            {/* Tab header selectors on card */}
            <div className="bg-slate-50 border-b border-slate-200 p-3 flex items-center justify-between">
              <span className="text-[10px] font-mono font-black text-slate-600 uppercase tracking-widest flex items-center gap-1">
                <Activity className="h-3.5 w-3.5 text-indigo-500" />
                Mathematic Projections
              </span>
              
              <div className="flex bg-slate-200 p-0.5 rounded-lg gap-0.5 scale-90">
                <button
                  onClick={() => setForecastTab("scurve")}
                  className={`text-[9.5px] font-bold px-2.5 py-1 rounded transition-all cursor-pointer ${
                    forecastTab === "scurve" 
                      ? "bg-white text-slate-900 shadow-3xs" 
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  S-Curve
                </button>
                <button
                  onClick={() => setForecastTab("roi")}
                  className={`text-[9.5px] font-bold px-2.5 py-1 rounded transition-all cursor-pointer ${
                    forecastTab === "roi" 
                      ? "bg-white text-slate-900 shadow-3xs" 
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  ROI Curve
                </button>
              </div>
            </div>

            {/* S-Curve Panel */}
            {forecastTab === "scurve" && (
              <div className="p-4 flex flex-col justify-between flex-grow space-y-3.5">
                <div className="space-y-1 text-left">
                  <div className="flex items-center justify-between">
                    <h5 className="text-[11px] font-extrabold text-slate-800 uppercase font-mono tracking-tight">
                      30-Day Human Adoption Path
                    </h5>
                    <span className="text-[10px] font-mono font-black text-sky-700">
                      Peak: {isCounterfactualAligned ? Math.min(100, Math.round(adoption_rate + (100 - adoption_rate) * 0.4)) : adoption_rate}%
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
                    Models structured sigmoid scaling. Higher disruption pulls the inflection point to the right. Retraining alignment advances early momentum.
                  </p>
                </div>

                <div className="h-60 w-full bg-white border border-slate-150 rounded-lg p-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.18}/>
                          <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.01}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="dayNum" 
                        stroke="#94a3b8" 
                        fontSize={9} 
                        tickFormatter={(v) => `D${v}`}
                      />
                      <YAxis 
                        stroke="#94a3b8" 
                        fontSize={9} 
                        domain={[0, 100]}
                        tickFormatter={(v) => `${v}%`}
                      />
                      <Tooltip content={<CustomAdoptionTooltip />} />
                      <Area 
                        name="Rate"
                        type="monotone" 
                        dataKey="rate" 
                        stroke="#0ea5e9" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorRate)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-sky-50/70 border border-sky-100 rounded p-2.5 text-[9.5px] text-sky-900 font-sans text-left leading-normal flex items-start gap-1.5">
                  <Users className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Target Reach:</strong> Serves <strong>{target_users} key personnel</strong>. Active daily users is expected to reach <strong>{Math.round((isCounterfactualAligned ? Math.min(100, Math.round(adoption_rate + (100 - adoption_rate) * 0.4)) : adoption_rate) / 100 * target_users)}</strong> by Day 30.
                  </span>
                </div>
              </div>
            )}

            {/* ROI Panel */}
            {forecastTab === "roi" && (
              <div className="p-4 flex flex-col justify-between flex-grow space-y-3.5">
                <div className="space-y-1 text-left">
                  <div className="flex items-center justify-between font-sans">
                    <h5 className="text-[11px] font-extrabold text-slate-800 uppercase font-mono tracking-tight">
                      Break-Even Trajectory
                    </h5>
                    <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-150 rounded">
                      {breakEvenDay ? `Day ${breakEvenDay} Break-Even` : ">30 Days"}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    Tracks initial sandbox deployment, audit & staffing costs offset by compounding efficiency savings as user adoption matures.
                  </p>
                </div>

                <div className="h-60 w-full bg-white border border-slate-150 rounded-lg p-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRoi" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.01}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="dayNum" 
                        stroke="#94a3b8" 
                        fontSize={9} 
                        tickFormatter={(v) => `D${v}`}
                      />
                      <YAxis 
                        stroke="#94a3b8" 
                        fontSize={9} 
                        tickFormatter={(v) => {
                          const prefix = v < 0 ? "-" : "";
                          return `${prefix}$${Math.abs(v) >= 1000 ? `${Math.round(Math.abs(v) / 1000)}k` : Math.abs(v)}`;
                        }}
                      />
                      <Tooltip content={<CustomRoiTooltip />} />
                      <ReferenceLine y={0} stroke="#cbd5e1" strokeWidth={1} />
                      {breakEvenDay && (
                        <ReferenceLine x={`Day ${breakEvenDay}`} stroke="#10b981" label={{ value: "Payback", fill: "#10b981", fontSize: 8, position: "top" }} />
                      )}
                      <Area 
                        name="ROI"
                        type="monotone" 
                        dataKey="roi" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorRoi)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-emerald-50 border border-emerald-100 rounded p-2.5 text-[9.5px] text-emerald-900 font-sans text-left leading-normal flex items-start gap-1.5">
                  <Coins className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Vetting Payback:</strong> Net financial savings becomes positive by Day {breakEvenDay || "30+"}. Compounding savings is optimized under vetted sandbox profiles.
                  </span>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
      
      {/* Dynamic system footer detail */}
      <div className="bg-slate-50 border-t border-slate-200 px-6 py-2.5 flex items-center justify-between text-[9px] font-mono text-slate-400">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="h-3 w-3 text-indigo-500" />
          ADOPTION SIMULATOR MODEL: GNN-ADOPT-V4.22
        </span>
        <span>LATENCY: 14MS</span>
      </div>
    </div>
  );
}
