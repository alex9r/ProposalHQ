import * as React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Header from "./components/Header";
import RegulatoryLens from "./components/RegulatoryLens";
import TechnicalLens from "./components/TechnicalLens";
import DependencyLens from "./components/DependencyLens";
import AdoptionForecast from "./components/AdoptionForecast";
import SandboxSettings from "./components/SandboxSettings";
import { INITIAL_PROJECT_PROPOSALS } from "./initialHistory";
import { 
  SimulationPayload, 
  SandboxPolicy, 
  SandboxCatalogItem, 
  InnovationIdea, 
  DEFAULT_RULES, 
  DEFAULT_TECHNICAL_CATALOG, 
  DEFAULT_DEPENDENCY_NODES 
} from "./types";
import { 
  Play, 
  AlertCircle, 
  CheckCircle, 
  HelpCircle, 
  BookOpen, 
  Wrench, 
  Network, 
  Terminal, 
  Sparkles, 
  Save, 
  Info,
  ChevronRight,
  RefreshCcw,
  BookMarked,
  TrendingUp,
  Plus,
  ArrowLeft,
  Trash2,
  Heart,
  Calendar,
  Layers,
  Building,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from "lucide-react";

export default function App() {
  // Navigation View State
  const [viewMode, setViewMode] = useState<"dashboard" | "new-proposal" | "project-details">("dashboard");
  const [selectedIdea, setSelectedIdea] = useState<InnovationIdea | null>(null);

  // Innovation Form States (for creating new ideas)
  const [newTitle, setNewTitle] = useState("");
  const [newTeam, setNewTeam] = useState("Retail Banking Mobile Team");
  const [newText, setNewText] = useState("");

  // Adaptive configuration states (retained for sandbox custom rules)
  const [rules, setRules] = useState<SandboxPolicy[]>([]);
  const [catalog, setCatalog] = useState<SandboxCatalogItem[]>([]);
  const [nodes, setNodes] = useState<string[]>([]);
  const [history, setHistory] = useState<InnovationIdea[]>([]);

  // Simulation status triggers
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPayload, setCurrentPayload] = useState<SimulationPayload | null>(null);
  const [activeTab, setActiveTab] = useState<"regulatory" | "technical" | "dependency" | "adoption">("regulatory");

  // Keep these states for details view backwards compatibility and search filters
  const [ideaText, setIdeaText] = useState("");
  const [ideaTitle, setIdeaTitle] = useState("");

  // Load from LocalStorage securely
  useEffect(() => {
    try {
      const storedRules = localStorage.getItem("sandbox_rules");
      const storedCatalog = localStorage.getItem("sandbox_catalog");
      const storedNodes = localStorage.getItem("sandbox_nodes");
      const storedHistory = localStorage.getItem("sim_history");

      setRules(storedRules ? JSON.parse(storedRules) : DEFAULT_RULES);
      setCatalog(storedCatalog ? JSON.parse(storedCatalog) : DEFAULT_TECHNICAL_CATALOG);
      setNodes(storedNodes ? JSON.parse(storedNodes) : DEFAULT_DEPENDENCY_NODES);

      if (storedHistory) {
        const parsed = JSON.parse(storedHistory);
        if (parsed && parsed.length > 0) {
          setHistory(parsed);
        } else {
          setHistory(INITIAL_PROJECT_PROPOSALS);
          localStorage.setItem("sim_history", JSON.stringify(INITIAL_PROJECT_PROPOSALS));
        }
      } else {
        setHistory(INITIAL_PROJECT_PROPOSALS);
        localStorage.setItem("sim_history", JSON.stringify(INITIAL_PROJECT_PROPOSALS));
      }
    } catch (e) {
      console.error("Local storage restoration error:", e);
      setRules(DEFAULT_RULES);
      setCatalog(DEFAULT_TECHNICAL_CATALOG);
      setNodes(DEFAULT_DEPENDENCY_NODES);
      setHistory(INITIAL_PROJECT_PROPOSALS);
    }
  }, []);

  // Save changes to parameters dynamically
  useEffect(() => {
    if (rules.length > 0) localStorage.setItem("sandbox_rules", JSON.stringify(rules));
  }, [rules]);

  useEffect(() => {
    if (catalog.length > 0) localStorage.setItem("sandbox_catalog", JSON.stringify(catalog));
  }, [catalog]);

  useEffect(() => {
    if (nodes.length > 0) localStorage.setItem("sandbox_nodes", JSON.stringify(nodes));
  }, [nodes]);

  // Execute simulation API
  const handleSimulate = async () => {
    if (!newTitle.trim()) {
      setError("Please specify a project title for your innovation concept.");
      return;
    }
    if (!newText.trim()) {
      setError("Please write down an innovative technology concept to simulate.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ideaText: newText,
          rules,
          catalog,
          nodes
        })
      });

      if (!res.ok) {
        const errPayload = await res.json().catch(() => ({}));
        throw new Error(errPayload.error || `Server responded with status: ${res.status}`);
      }

      const data = await res.json();
      setCurrentPayload(data);

      // Auto write to local history
      const newHistoryItem: InnovationIdea = {
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2, 9),
        title: newTitle.trim(),
        ideaText: newText.trim(),
        timestamp: new Date().toISOString(),
        payload: data,
        isFavorite: false,
        team: newTeam || "General Operations"
      };

      const updatedHist = [newHistoryItem, ...history.slice(0, 24)]; // Hold up to 25 items
      setHistory(updatedHist);
      localStorage.setItem("sim_history", JSON.stringify(updatedHist));

      // Load project into selected details and transition
      setSelectedIdea(newHistoryItem);
      setIdeaTitle(newHistoryItem.title);
      setIdeaText(newHistoryItem.ideaText);
      setViewMode("project-details");
      setActiveTab("regulatory");

      // Reset Create Form
      setNewTitle("");
      setNewText("");
    } catch (err: any) {
      console.error("Simulation run failure:", err);
      setError(err.message || "Failed to trigger automated simulation pipelines.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectProject = (idea: InnovationIdea) => {
    setSelectedIdea(idea);
    setIdeaText(idea.ideaText);
    setIdeaTitle(idea.title);
    setCurrentPayload(idea.payload);
    setError(null);
    setViewMode("project-details");
    setActiveTab("regulatory");
  };

  const handleDeleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmed = window.confirm("Are you sure you want to delete this project proposal evaluation?");
    if (!confirmed) return;
    
    const updated = history.filter(h => h.id !== id);
    setHistory(updated);
    localStorage.setItem("sim_history", JSON.stringify(updated));
    if (selectedIdea?.id === id) {
      setSelectedIdea(null);
      setCurrentPayload(null);
    }
  };

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = history.map(h => h.id === id ? { ...h, isFavorite: !h.isFavorite } : h);
    setHistory(updated);
    localStorage.setItem("sim_history", JSON.stringify(updated));
    if (selectedIdea?.id === id) {
      setSelectedIdea(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
    }
  };

  const handleClearAllHistory = () => {
    const confirmed = window.confirm("Are you sure you want to purge all project proposal simulations?");
    if (!confirmed) return;
    setHistory([]);
    localStorage.removeItem("sim_history");
    setSelectedIdea(null);
    setCurrentPayload(null);
    setViewMode("dashboard");
  };

  const handleLoadTemplate = (title: string, dept: string, text: string) => {
    setNewTitle(title);
    setNewTeam(dept);
    setNewText(text);
  };

  // Stats Counters
  const totalProposals = history.length;
  const passedProposals = history.filter(h => h.payload?.regulatory?.status === "Pass").length;
  const alertProposals = history.filter(h => h.payload?.regulatory?.status === "Maybe" || h.payload?.regulatory?.status === "Fail").length;
  const uniqueDepts = Array.from(new Set(history.map(h => h.team || "General Operations"))).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 select-none">
      <Header />

      {/* Main Container */}
      <div className="flex-grow p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto flex flex-col space-y-6">
        
        {/* ======================= VIEW 1: DASHBOARD PORTAL ======================= */}
        {viewMode === "dashboard" && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Upper Action Row */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <h2 className="text-xl md:text-2xl font-black text-slate-950 uppercase tracking-tight flex items-center gap-2">
                  <Layers className="h-6 w-6 text-blue-600" />
                  Innovation Proposals Hub
                </h2>
                <p className="text-xs text-slate-505 font-medium leading-relaxed mt-1">
                  Examine plain-text financial technical proposals against systemic risk, compliance guidelines, and infrastructure dependencies.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setViewMode("new-proposal")}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-500/10 uppercase tracking-wider flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Plus className="h-4 w-4 stroke-[3px]" />
                  Simulate New Concept
                </button>
                {history.length > 0 && (
                  <button
                    onClick={handleClearAllHistory}
                    className="px-3.5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 hover:text-red-650 text-slate-500 font-bold text-xs rounded-xl transition-colors uppercase tracking-wider cursor-pointer"
                  >
                    Reset Portal
                  </button>
                )}
              </div>
            </div>

            {/* Statistics Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-col justify-between h-[110px]">
                <div className="text-[10px] uppercase font-bold text-slate-450 font-mono tracking-widest flex items-center gap-1.5">
                  <BookMarked className="h-3.5 w-3.5 text-blue-500" /> Loaded Proposals
                </div>
                <div className="text-3xl font-black text-slate-900">{String(totalProposals).padStart(2, "0")}</div>
                <div className="text-[9.5px] text-slate-500 font-medium">Evaluation history ledger</div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-col justify-between h-[110px]">
                <div className="text-[10px] uppercase font-bold text-slate-450 font-mono tracking-widest flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> Pre-Cleared (Pass)
                </div>
                <div className="text-3xl font-black text-emerald-600">{String(passedProposals).padStart(2, "0")}</div>
                <div className="text-[9.5px] text-slate-500 font-medium">Automated fast-track target</div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-col justify-between h-[110px]">
                <div className="text-[10px] uppercase font-bold text-slate-450 font-mono tracking-widest flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5 text-amber-500" /> Risk Advisories
                </div>
                <div className="text-3xl font-black text-amber-600">{String(alertProposals).padStart(2, "0")}</div>
                <div className="text-[9.5px] text-slate-500 font-medium">Requires compliance review</div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-col justify-between h-[110px]">
                <div className="text-[10px] uppercase font-bold text-slate-450 font-mono tracking-widest flex items-center gap-1.5">
                  <Building className="h-3.5 w-3.5 text-purple-500" /> Engaged Divisions
                </div>
                <div className="text-3xl font-black text-purple-600">{String(uniqueDepts).padStart(2, "0")}</div>
                <div className="text-[9.5px] text-slate-500 font-medium">Unique corporate departments</div>
              </div>
            </div>

            {/* Proposals grid view */}
            {history.length === 0 ? (
              <div className="bg-white border border-slate-200 border-dashed rounded-3xl p-12 text-center max-w-xl mx-auto space-y-4">
                <Layers className="h-12 w-12 text-slate-350 mx-auto" />
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 text-sm uppercase">Ecosystem Inactive</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    There are no simulated proposals saved in this portal. Click on the button below to analyze your very first technology innovation design.
                  </p>
                </div>
                <button
                  onClick={() => setViewMode("new-proposal")}
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold font-mono hover:bg-slate-800 transition-colors uppercase tracking-wider cursor-pointer"
                >
                  + Simulate New Concept
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-450 font-mono">Simulated Project Registry</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {history.map((idea) => {
                    const status = idea.payload?.regulatory?.status || "Maybe";
                    const statusConfig = 
                      status === "Pass" ? { label: "Pass / Safe", color: "bg-emerald-500 text-white", textCol: "text-emerald-700", border: "border-emerald-200" } :
                      status === "Fail" ? { label: "Fail / Banned", color: "bg-rose-500 text-white", textCol: "text-rose-700", border: "border-rose-200" } :
                      { label: "Advisory / Warning", color: "bg-amber-500 text-slate-950", textCol: "text-amber-800", border: "border-amber-200" };

                    return (
                      <div
                        key={idea.id}
                        onClick={() => handleSelectProject(idea)}
                        className="bg-white border border-slate-200/90 rounded-2xl hover:border-slate-350 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden group cursor-pointer"
                      >
                        {/* Status Bar */}
                        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                          <div className="flex items-center gap-2 max-w-[80%]">
                            <span className="w-2 h-2 rounded-full bg-blue-500 group-hover:scale-125 transition-transform shrink-0"></span>
                            <span className="text-[10px] font-mono font-bold text-slate-450 uppercase truncate">
                              {idea.team || "Banking Operations"}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => handleToggleFavorite(idea.id, e)}
                              className={`p-1 rounded hover:bg-slate-200/60 transition-colors shrink-0 ${
                                idea.isFavorite ? "text-red-500" : "text-slate-350 hover:text-slate-500"
                              }`}
                            >
                              <Heart className="h-4 w-4 fill-current" />
                            </button>
                            <button
                              onClick={(e) => handleDeleteProject(idea.id, e)}
                              className="p-1 rounded text-slate-350 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-6 flex-grow space-y-4">
                          <div className="space-y-1 text-left">
                            <h4 className="font-bold text-slate-900 group-hover:text-blue-650 transition-colors text-sm font-sans tracking-tight">
                              {idea.title}
                            </h4>
                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-mono">
                              "{idea.ideaText}"
                            </p>
                          </div>

                          {/* Quick Stats Grid */}
                          <div className="grid grid-cols-2 gap-3 border-t border-b border-dashed border-slate-150 py-3 text-xs">
                            <div>
                              <span className="text-[9.5px] uppercase font-bold text-slate-400 font-mono tracking-tight block">Legal Process Range</span>
                              <strong className="text-slate-700 text-[11px] font-semibold">{idea.payload?.regulatory?.legal_review_time ?? 30} Working Days</strong>
                            </div>
                            <div>
                              <span className="text-[9.5px] uppercase font-bold text-slate-400 font-mono tracking-tight block">Approval Likelihood</span>
                              <strong className="text-slate-700 text-[11px] font-semibold">{idea.payload?.regulatory?.approval_probability ?? 80}% Probability</strong>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-xs pt-1">
                            <div className="flex items-center gap-1.5 font-mono text-slate-400 text-[10.5px]">
                              <Calendar className="h-3.5 w-3.5 text-slate-300" />
                              <span>{new Date(idea.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <span className="text-[9.5px] font-mono text-slate-405 font-bold">COMPLEXITY:</span>
                              <span className="font-mono font-black text-slate-800 bg-slate-100 rounded px-1.5 py-0.2">
                                {String(idea.payload?.dependency?.complexity_score || 2).padStart(2, "0")}/10
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Card Footer Action */}
                        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs group-hover:bg-blue-50/10 transition-colors">
                          <div className="flex items-center gap-2">
                            <span className={`text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded-full ${statusConfig.color}`}>
                              {statusConfig.label}
                            </span>
                            <span className="text-[10px] text-slate-405 font-mono">
                              {idea.payload?.regulatory?.admin_review_required ? "Audit Required" : "Fast-Track"}
                            </span>
                          </div>
                          
                          <span className="text-[11px] text-blue-600 font-mono font-bold group-hover:translate-x-1.5 transition-transform flex items-center gap-1">
                            Review Compliance Folder <ChevronRight className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {/* Dynamic "+ Add New Card" Placeholder */}
                  <div
                    onClick={() => setViewMode("new-proposal")}
                    className="border-2 border-dashed border-slate-250 bg-white/40 rounded-2xl hover:bg-slate-50 hover:border-blue-400 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center p-8 text-center min-h-[290px] gap-3"
                  >
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                      <Plus className="h-5 w-5 stroke-[2.5px]" />
                    </div>
                    <div className="space-y-1">
                      <h5 className="font-bold text-slate-850 text-xs uppercase font-mono">Simulate New Concept</h5>
                      <p className="text-[11px] text-slate-400 max-w-[240px]">
                        Draft regulatory boundaries and map tech stacks on different ideas dynamically.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}


        {/* ======================= VIEW 2: NEW PROPOSAL BUILDER ======================= */}
        {viewMode === "new-proposal" && (
          <div className="space-y-6 animate-fade-in text-left">
            
            {/* Header / Breadcrumb */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-5">
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setViewMode("dashboard");
                    setError(null);
                  }}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 cursor-pointer uppercase font-mono"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
                </button>
                <h2 className="text-xl md:text-2xl font-black text-slate-950 uppercase tracking-tight">
                  Simulate New Innovation Concept
                </h2>
              </div>
              <button
                onClick={() => {
                  setViewMode("dashboard");
                  setError(null);
                }}
                className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg transition-colors uppercase cursor-pointer"
              >
                Cancel Input
              </button>
            </div>

            {/* Live Error alerts */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-650 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-red-900">Simulation Configuration Denied</span>
                  <p className="text-red-700 leading-relaxed mt-0.5">{error}</p>
                </div>
              </div>
            )}

            {/* 2-Pane Draft & Settings Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Draft Entry Input pane */}
              <div className="lg:col-span-7 bg-white border border-slate-300 rounded-2xl shadow-xs overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-500 font-mono flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    Draft Project Parameters
                  </span>
                  
                  <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase">
                    Step 1 of 2
                  </span>
                </div>

                <div className="p-6 space-y-5">
                  <div className="space-y-1">
                    <label className="text-[9.5px] uppercase font-bold text-slate-400 font-mono block">Simulation Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Wealth overnight summaries bot"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs font-sans font-semibold focus:ring-1 focus:ring-slate-900 focus:bg-white focus:outline-none transition-all placeholder:text-slate-405"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9.5px] uppercase font-bold text-slate-400 font-mono block">Responsible Team Department</label>
                    <select
                      value={newTeam}
                      onChange={(e) => setNewTeam(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs font-medium text-slate-700 focus:ring-1 focus:ring-slate-900 focus:outline-none focus:bg-white cursor-pointer"
                    >
                      <option value="Retail Mobile Core Team">Retail Mobile Core Team</option>
                      <option value="Wealth Management Compliance">Wealth Management Compliance</option>
                      <option value="Securities & Margin Lending">Securities & Margin Lending</option>
                      <option value="HR Systems & Payroll IT">HR Systems & Payroll IT</option>
                      <option value="Commercial Banking Portal Team">Commercial Banking Portal Team</option>
                      <option value="Enterprise Risk Operations">Enterprise Risk Operations</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9.5px] uppercase font-bold text-slate-400 font-mono block">Corporate Plain-Text Design Description</label>
                    <textarea
                      placeholder="e.g. I want to build a tool that reads raw client statements using ChatGPT API..."
                      value={newText}
                      onChange={(e) => setNewText(e.target.value)}
                      rows={6}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 text-xs font-sans focus:ring-1 focus:ring-slate-900 focus:bg-white focus:outline-none resize-none leading-relaxed transition-all placeholder:text-slate-400"
                    />
                  </div>

                  {/* Quick-Fill template helpers */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <span className="text-[9px] uppercase font-bold text-slate-400 font-mono flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-blue-500 animate-pulse" /> Draft template quick loaders
                    </span>
                    <div className="flex flex-col gap-1.5">
                      {[
                        {
                          t: "Public AI Banking Chatbot",
                          d: "Retail Banking Digital Team",
                          txt: "I want to add a feature to our banking app where users can ask an AI chatbot to read their statements using the public ChatGPT API to extract spend records."
                        },
                        {
                          t: "Transit Operators System",
                          d: "Commercial Banking Portal Team",
                          txt: "Build an automated internal tracking system for our transit operators using Power Automate Pro that pulls scheduling data from the internal transit dispatch database."
                        },
                        {
                          t: "Client-Facing Portal Redesign",
                          d: "Retail Mobile Core Team",
                          txt: "Modify our customer-facing web dashboard interfaces using React to show real-time financial tracking widgets, routing historical transaction files onto Canadian Postgres databases."
                        }
                      ].map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleLoadTemplate(item.t, item.d, item.txt)}
                          className="px-3 py-2 bg-slate-50 border border-slate-200 text-left rounded-lg text-xs leading-relaxed font-sans block hover:bg-blue-50/10 hover:border-blue-400 transition-colors"
                        >
                          <span className="font-bold text-blue-700 font-mono text-[10.5px] block">{item.t}</span>
                          <span className="text-slate-505 block line-clamp-1 mt-0.5 font-mono text-[10px] italic">"{item.txt}"</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Submit Container */}
                <div className="p-5 bg-slate-50 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={handleSimulate}
                    disabled={isLoading || !newText.trim() || !newTitle.trim()}
                    className="px-6 py-3 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all uppercase tracking-widest flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <Play className={`h-4 w-4 text-emerald-400 ${isLoading ? 'animate-spin' : ''}`} />
                    {isLoading ? "Running Risk Engine Models..." : "Run Active Audit Simulator"}
                  </button>
                </div>
              </div>

              {/* Ecosystem Constants SandboxSettings control pane */}
              <div className="lg:col-span-5 space-y-4">
                <SandboxSettings 
                  rules={rules} 
                  setRules={setRules} 
                  catalog={catalog} 
                  setCatalog={setCatalog} 
                  nodes={nodes} 
                  setNodes={setNodes} 
                />
              </div>

            </div>

            {/* Waiting simulator state indicator overlay */}
            {isLoading && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-6 animate-fade-in">
                <div className="bg-white border border-slate-300 rounded-2xl max-w-md w-full p-8 text-center space-y-4 shadow-2xl">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute w-12 h-12 border-2 border-slate-100 rounded-full animate-ping"></div>
                    <div className="w-10 h-10 border-4 border-slate-950 border-t-blue-500 rounded-full animate-spin"></div>
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-bold text-slate-900 animate-pulse uppercase font-mono tracking-tight">Active Ingestion Pipeline Executing</h4>
                    <p className="text-xs text-slate-505 leading-relaxed font-mono">
                      Consulting global financial regulations, scanning system catalogs, and tracing Operational GNN dependencies in real-time.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}


        {/* ======================= VIEW 3: PROJECT REVIEW PORTFOLIO (FULL SCREEN) ======================= */}
        {viewMode === "project-details" && currentPayload && selectedIdea && (
          <div className="space-y-6 animate-fade-in text-left">
            
            {/* Upper Action breadcrumb row */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-5">
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setViewMode("dashboard");
                    setError(null);
                  }}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 cursor-pointer uppercase font-mono"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
                </button>
                <h2 className="text-xl md:text-2xl font-black text-slate-950 uppercase tracking-tight">
                  {selectedIdea?.title || "Project Compliance Portfolio"}
                </h2>
              </div>
              <button
                onClick={() => {
                  setViewMode("dashboard");
                  setError(null);
                }}
                className="px-4 py-2 bg-white border border-slate-350 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition-colors uppercase cursor-pointer"
              >
                Close Folder
              </button>
            </div>

            {/* Top region: Full-Page-Width Row (Desc on Left, Complexity/Review indicators as tabs to the Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Left Side: Plain-text prompt used */}
              <div className="lg:col-span-8 bg-white border border-slate-205 rounded-2xl shadow-2xs p-6 flex flex-col justify-between">
                <div className="space-y-4 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase block tracking-wider">
                      Innovation Proposal Parameter
                    </span>
                    <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-150 rounded text-[10px] font-mono font-bold tracking-tight">
                      {selectedIdea.team || "Banking Operations"}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 border-l-2 border-blue-600 pl-3">
                    {selectedIdea.title}
                  </h3>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 relative overflow-hidden">
                    {/* Visual quote mark indicator */}
                    <div className="absolute -right-2 -bottom-6 text-slate-200/40 text-7xl font-serif leading-none select-none pointer-events-none">
                      ”
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed italic relative z-10 whitespace-pre-wrap font-mono">
                      "{selectedIdea.ideaText}"
                    </p>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-slate-400 mt-4 border-t border-slate-100 pt-3 flex items-center gap-2">
                  <span>Simulated ID: {selectedIdea.id}</span>
                  <span>•</span>
                  <span>Timestamp: {new Date(selectedIdea.timestamp).toUTCString()}</span>
                </div>
              </div>

              {/* Right Side: Complexity and Review Required Stack */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                
                {/* 1. Complexity Index Card */}
                <div className="bg-blue-600 text-white rounded-2xl p-5 shadow-xs flex-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold opacity-80 font-mono tracking-widest">Complexity Index</span>
                    <span className="text-[9.5px] bg-white/20 px-2 py-0.5 rounded font-mono font-bold">STAGE 3 GNN</span>
                  </div>
                  <div>
                    <div className="text-5xl font-extrabold tracking-tighter mt-2">
                      {String(currentPayload.dependency.complexity_score).padStart(2, "0")}
                      <span className="text-sm font-normal text-blue-105">/10</span>
                    </div>
                  </div>
                  <div className="space-y-1 mt-2">
                    <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white transition-all duration-500" 
                        style={{ width: `${(currentPayload.dependency.complexity_score || 0) * 10}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[9px] text-blue-100">
                      <span>STABLE ROUTING</span>
                      <span>{currentPayload.dependency.complexity_score > 6 ? "HIGH FRICTION" : "PRE-CLEARED"}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Review Required Status Card */}
                <div className="bg-white border border-slate-300 rounded-2xl p-5 shadow-sm flex-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-450 font-mono tracking-widest">Review Requirements</span>
                    <span className={`w-2.5 h-2.5 rounded-full ${currentPayload.regulatory.admin_review_required ? "bg-amber-500" : "bg-emerald-500 animate-pulse"}`}></span>
                  </div>
                  <div>
                    <div className={`text-3xl font-black leading-tight ${currentPayload.regulatory.admin_review_required ? "text-amber-600" : "text-emerald-600"}`}>
                      {currentPayload.regulatory.admin_review_required ? "REQUIRED" : "PRE-CLEARED"}
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 leading-normal border-t border-slate-100 pt-2 font-medium">
                    {currentPayload.regulatory.admin_review_required 
                      ? "Requires CRO board exception waiver sign-off." 
                      : "Eligible for fast-track enterprise deployment."}
                  </div>
                </div>

              </div>

            </div>

            {/* Bottom region: Tab Selector and Core Lens Modules spanning full page horizontal width */}
            <div className="space-y-4">
              
              {/* Tab Selector */}
              <div className="flex bg-white p-1 rounded-2xl shadow-2xs border border-slate-300 gap-1 overflow-x-auto text-[11px] font-bold uppercase tracking-wider font-mono">
                <button
                  onClick={() => setActiveTab("regulatory")}
                  className={`flex-1 py-3 px-4 rounded-xl text-center whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === "regulatory" ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:text-slate-950 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2 font-sans text-xs">
                    <BookOpen className="h-4 w-4 shrink-0" />
                    Step 1: Regulatory ({currentPayload.regulatory.status})
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("technical")}
                  className={`flex-1 py-3 px-4 rounded-xl text-center whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === "technical" ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:text-slate-950 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2 font-sans text-xs">
                    <Wrench className="h-4 w-4 shrink-0" />
                    Step 2: Technical Catalog
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("dependency")}
                  className={`flex-1 py-3 px-4 rounded-xl text-center whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === "dependency" ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:text-slate-950 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2 font-sans text-xs">
                    <Network className="h-4 w-4 shrink-0" />
                    Step 3: Dependency Ripple
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("adoption")}
                  className={`flex-1 py-3 px-4 rounded-xl text-center whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === "adoption" ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:text-slate-950 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2 font-sans text-xs">
                    <TrendingUp className="h-4 w-4 shrink-0" />
                    Step 4: Adoption Forecast
                  </div>
                </button>
              </div>
              
              {/* Dynamic Step Title & Description Banner (Directly below step selections) */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-left shadow-2xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-black font-mono uppercase px-2 py-0.5 rounded-md ${
                      activeTab === "regulatory" ? "bg-blue-600 text-white" :
                      activeTab === "technical" ? "bg-emerald-600 text-white" :
                      activeTab === "dependency" ? "bg-purple-600 text-white" :
                      "bg-indigo-600 text-white"
                    }`}>
                      {activeTab === "regulatory" ? "Assessment Step 01" :
                       activeTab === "technical" ? "Assessment Step 02" :
                       activeTab === "dependency" ? "Assessment Step 03" :
                       "Assessment Step 04"}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                      Dynamic Corporate Sandbox Audit Pipeline
                    </span>
                  </div>
                  <h3 className="text-lg md:text-xl font-extrabold text-slate-900 tracking-tight uppercase">
                    {activeTab === "regulatory" && `Step 1: Regulatory Compliance (${currentPayload.regulatory.status})`}
                    {activeTab === "technical" && "Step 2: Technical Tool Catalog Alignment"}
                    {activeTab === "dependency" && "Step 3: Dependency Network & System Ripple"}
                    {activeTab === "adoption" && "Step 4: Operational Adoption & Change Fatigue Forecast"}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-4xl leading-relaxed font-sans">
                    {activeTab === "regulatory" && "Evaluates plain-text descriptions against data residency laws, global PIPEDA directives, encryption frameworks, and historical approval precedents."}
                    {activeTab === "technical" && "Inspects target application stacks against corporate software whitelist registries, highlights unvetted third-party APIs, and models active sandbox risks."}
                    {activeTab === "dependency" && "Identifies direct server impact lines and models indirect workflow disruption risks with high-fidelity topological node tracing."}
                    {activeTab === "adoption" && "Projects long-term team learning curves, Change Fatigue fatigue alerts, potential help desk workloads, and estimated technology business ROI."}
                  </p>
                </div>
              </div>

              {/* Lens view rendering spanning full screen space */}
              <div className="w-full">
                {activeTab === "regulatory" && (
                  <RegulatoryLens 
                    analysis={currentPayload.regulatory} 
                    ideaText={selectedIdea.ideaText} 
                    rules={rules}
                  />
                )}
                {activeTab === "technical" && (
                  <TechnicalLens 
                    analysis={currentPayload.technical} 
                  />
                )}
                {activeTab === "dependency" && (
                  <DependencyLens 
                    analysis={currentPayload.dependency} 
                    allNodes={nodes} 
                  />
                )}
                {activeTab === "adoption" && (
                  <AdoptionForecast 
                    payload={currentPayload} 
                    ideaText={selectedIdea.ideaText}
                  />
                )}
              </div>

            </div>

          </div>
        )}

      </div>

      {/* Footer Bar */}
      <footer className="h-12 bg-white border-t border-slate-300 flex items-center px-6 md:px-8 justify-between shrink-0 font-sans text-xs text-slate-500">
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-[10px] text-slate-500 font-extrabold uppercase font-mono tracking-wider">Regulations Active</span>
          </div>
          <div className="flex items-center gap-2 text-slate-200">|</div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span className="text-[10px] text-slate-500 font-extrabold uppercase font-mono tracking-wider">AI Sandbox Operational</span>
          </div>
        </div>
        <div className="text-[10px] font-mono text-slate-400">SESSION_TOKEN: {selectedIdea ? selectedIdea.id.slice(0, 8) : "INITIAL_DB"}</div>
      </footer>
    </div>
  );
}
