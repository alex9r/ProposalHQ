import { useState } from "react";
import { SandboxPolicy, SandboxCatalogItem } from "../types";
import { Sliders, Wrench, ShieldAlert, Network, Plus, Trash2, CheckCircle2, AlertTriangle, XCircle, Info, Search, Globe, Check, Loader2 } from "lucide-react";

interface SandboxSettingsProps {
  rules: SandboxPolicy[];
  setRules: (rules: SandboxPolicy[]) => void;
  catalog: SandboxCatalogItem[];
  setCatalog: (catalog: SandboxCatalogItem[]) => void;
  nodes: string[];
  setNodes: (nodes: string[]) => void;
}

export default function SandboxSettings({
  rules,
  setRules,
  catalog,
  setCatalog,
  nodes,
  setNodes
}: SandboxSettingsProps) {
  const [activeTab, setActiveTab] = useState<"regulatory" | "technical" | "nodes">("regulatory");
  const [newRuleCode, setNewRuleCode] = useState("");
  const [newRuleName, setNewRuleName] = useState("");
  const [newRuleDesc, setNewRuleDesc] = useState("");

  const [newToolName, setNewToolName] = useState("");
  const [newToolCat, setNewToolCat] = useState<"approved" | "banned" | "restricted">("approved");

  const [newNodeName, setNewNodeName] = useState("");

  // OSFI Scraper States
  const [osfiQueryPreset, setOsfiQueryPreset] = useState("B-13 Technology Risk");
  const [customOsfiQuery, setCustomOsfiQuery] = useState("");
  const [scrapedRules, setScrapedRules] = useState<SandboxPolicy[]>([]);
  const [scrapedSources, setScrapedSources] = useState<{title: string, uri: string}[]>([]);
  const [isScraping, setIsScraping] = useState(false);
  const [scraperError, setScraperError] = useState<string | null>(null);

  // Functions to toggle and add items
  const toggleRule = (code: string) => {
    setRules(rules.map(r => r.code === code ? { ...r, enabled: !r.enabled } : r));
  };

  const addRule = () => {
    if (!newRuleCode || !newRuleName || !newRuleDesc) return;
    const rule: SandboxPolicy = {
      code: newRuleCode.trim(),
      name: newRuleName.trim(),
      description: newRuleDesc.trim(),
      category: "compliance",
      enabled: true
    };
    setRules([...rules, rule]);
    setNewRuleCode("");
    setNewRuleName("");
    setNewRuleDesc("");
  };

  const removeRule = (code: string) => {
    setRules(rules.filter(r => r.code !== code));
  };

  // OSFI Scraper action
  const handleScrapeOSFI = async () => {
    setIsScraping(true);
    setScraperError(null);
    setScrapedRules([]);
    setScrapedSources([]);
    try {
      const targetQuery = customOsfiQuery.trim() || osfiQueryPreset;
      const res = await fetch("/api/scrape-osfi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: targetQuery })
      });
      if (!res.ok) {
        throw new Error(`Failed to scrape OSFI Registry: ${res.statusText}`);
      }
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const formatted = (data.rules || []).map((r: any) => ({
        ...r,
        enabled: true
      }));
      setScrapedRules(formatted);
      setScrapedSources(data.sources || []);
    } catch (err: any) {
      console.error(err);
      setScraperError(err.message || "An unexpected error occurred during regulatory crawl.");
    } finally {
      setIsScraping(false);
    }
  };

  const importScrapedRule = (rule: SandboxPolicy) => {
    if (rules.some(r => r.code === rule.code)) return;
    setRules([...rules, rule]);
    setScrapedRules(scrapedRules.filter(r => r.code !== rule.code));
  };

  const importAllScraped = () => {
    const fresh = scrapedRules.filter(sr => !rules.some(r => r.code === sr.code));
    if (fresh.length === 0) return;
    setRules([...rules, ...fresh]);
    setScrapedRules([]);
  };

  const toggleCatalog = (id: string) => {
    setCatalog(catalog.map(c => c.id === id ? { ...c, enabled: !c.enabled } : c));
  };

  const addTool = () => {
    if (!newToolName) return;
    const tool: SandboxCatalogItem = {
      id: newToolName.trim(),
      name: newToolName.trim(),
      category: newToolCat,
      enabled: true
    };
    setCatalog([...catalog, tool]);
    setNewToolName("");
  };

  const removeTool = (id: string) => {
    setCatalog(catalog.filter(c => c.id !== id));
  };

  const addNode = () => {
    if (!newNodeName || nodes.includes(newNodeName)) return;
    setNodes([...nodes, newNodeName.trim()]);
    setNewNodeName("");
  };

  const removeNode = (nodeName: string) => {
    setNodes(nodes.filter(n => n !== nodeName));
  };

  return (
    <div id="sandbox-config" className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-sm">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-2">
          <Sliders className="h-4 w-4 text-blue-600" />
          Simulator Ecosystem Control
        </span>
        <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full font-bold">
          Interactive Toggles
        </span>
      </div>

      <div className="p-5">
        <p className="text-xs text-slate-500 mb-4">
          Customize the constraints and configurations of the sandbox below. The AI evaluates your idea in real-time based on these parameters.
        </p>

        {/* Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-lg gap-1 border border-slate-200 text-xs mb-4">
          <button
            onClick={() => setActiveTab("regulatory")}
            className={`flex-1 py-1.5 px-3 rounded-md font-bold text-center transition-all cursor-pointer ${
              activeTab === "regulatory" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center justify-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5" />
              Laws ({rules.filter(r => r.enabled).length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab("technical")}
            className={`flex-1 py-1.5 px-3 rounded-md font-bold text-center transition-all cursor-pointer ${
              activeTab === "technical" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center justify-center gap-1.5">
              <Wrench className="h-3.5 w-3.5" />
              Catalog ({catalog.filter(c => c.enabled).length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab("nodes")}
            className={`flex-1 py-1.5 px-3 rounded-md font-bold text-center transition-all cursor-pointer ${
              activeTab === "nodes" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center justify-center gap-1.5">
              <Network className="h-3.5 w-3.5" />
              Nodes ({nodes.length})
            </div>
          </button>
        </div>

      {/* Regulatory Constraints Tab */}
      {activeTab === "regulatory" && (
        <div className="space-y-3">
          <div className="divide-y divide-slate-100 bg-white border border-slate-200/80 rounded-lg overflow-hidden max-h-[220px] overflow-y-auto">
            {rules.map((rule) => (
              <div key={rule.code} className={`p-2.5 flex items-start justify-between gap-2 text-xs transition-colors ${rule.enabled ? 'bg-slate-50/50' : 'bg-slate-200/10'}`}>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-1.5 py-0.5 rounded font-mono font-bold uppercase text-[10px] ${rule.enabled ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-400'}`}>
                      {rule.code}
                    </span>
                    <span className={`font-semibold ${rule.enabled ? 'text-slate-800' : 'text-slate-400 line-through'}`}>{rule.name}</span>
                  </div>
                  <p className={`mt-1 text-[11px] leading-relaxed ${rule.enabled ? 'text-slate-600' : 'text-slate-400'}`}>{rule.description}</p>
                  {rule.source && (
                    <span className="text-[9px] text-slate-400 block mt-0.5">Source: {rule.source}</span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 self-center">
                  <input
                    type="checkbox"
                    checked={rule.enabled}
                    onChange={() => toggleRule(rule.code)}
                    className="rounded text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5 cursor-pointer"
                  />
                  {rules.length > 3 && (
                    <button
                      type="button"
                      onClick={() => removeRule(rule.code)}
                      className="text-slate-400 hover:text-red-500 p-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* OSFI Guideline Scraper Block */}
          <div className="bg-slate-50 border border-slate-300 rounded-lg p-3 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5 uppercase font-mono tracking-tight">
                <Globe className="h-3.5 w-3.5 text-blue-600 animate-pulse" /> Real-time OSFI Scraper
              </h4>
              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">Web Grounded</span>
            </div>
            
            <p className="text-[11px] text-slate-500 leading-normal">
              Directly crawl, extract, and ingest Canadian regulatory directives (guidelines & constraints) based on active OSFI topics:
            </p>

            {/* Presets Grid */}
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { label: "B-13 Technology", val: "B-13 Technology and Cyber Risk Management" },
                { label: "B-10 Outsourcing", val: "B-10 Outsourcing and Third Party risk and Cloud hosting" },
                { label: "E-23 Model Risk", val: "E-23 Enterprise-Wide Model Risk Management algorithms and AI" },
                { label: "E-21 Operational Continuity", val: "E-21 Operational Risk Management and business continuity" }
              ].map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    setOsfiQueryPreset(p.val);
                    setCustomOsfiQuery("");
                  }}
                  className={`px-2 py-1 text-[10px] text-left font-bold rounded border transition-colors ${
                    (customOsfiQuery === "" && osfiQueryPreset === p.val)
                      ? "bg-blue-600 text-white border-blue-700"
                      : "bg-white text-slate-700 border-slate-250 hover:bg-slate-50"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-slate-400 font-mono">Custom Regulatory Scan Word</label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="e.g. data residency, crypto policies..."
                  value={customOsfiQuery}
                  onChange={(e) => setCustomOsfiQuery(e.target.value)}
                  className="flex-grow bg-white border border-slate-300 px-2 py-1 text-xs rounded shadow-xs focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleScrapeOSFI}
                  disabled={isScraping}
                  className="px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded transition-colors disabled:opacity-50 flex items-center gap-1 cursor-pointer"
                >
                  {isScraping ? (
                    <Loader2 className="h-3 w-3 animate-spin text-white" />
                  ) : (
                    <Search className="h-3 w-3 text-white" />
                  )}
                  Scrape
                </button>
              </div>
            </div>

            {/* Scraper Output Display */}
            {isScraping && (
              <div className="p-4 bg-white/60 border border-slate-200 rounded-lg text-center space-y-2">
                <Loader2 className="h-5 w-5 animate-spin mx-auto text-blue-600" />
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-extrabold">Crawling active OSFI registers...</p>
                <p className="text-[9.5px] text-slate-400">Querying live superintendent bulletins & parsing rules using Gemini.</p>
              </div>
            )}

            {scraperError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-[11px] text-red-600 font-mono">
                Error during Scrape: {scraperError}
              </div>
            )}

            {/* Scraped rules list */}
            {scrapedRules.length > 0 && (
              <div className="space-y-2 max-h-[220px] overflow-y-auto bg-white p-2.5 rounded-lg border border-slate-200 shadow-inner">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Scraped Laws ({scrapedRules.length})</span>
                  <button
                    type="button"
                    onClick={importAllScraped}
                    className="text-[9px] font-mono font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider cursor-pointer"
                  >
                    Import All
                  </button>
                </div>
                <div className="space-y-2">
                  {scrapedRules.map((rule) => {
                    const isAlreadyImported = rules.some((r) => r.code === rule.code);
                    return (
                      <div key={rule.code} className="p-2 border border-slate-150 rounded bg-slate-50/50 flex items-start justify-between gap-1.5 text-[11px]">
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-[9px] bg-blue-100 text-blue-800 px-1 rounded uppercase">
                              {rule.code}
                            </span>
                            <span className="font-bold text-slate-900 truncate block">{rule.name}</span>
                          </div>
                          <p className="text-slate-600 mt-1 leading-normal font-sans text-[10.5px]">{rule.description}</p>
                          <span className="text-[8.5px] text-slate-400 block mt-0.5 italic">{rule.source}</span>
                        </div>
                        <div className="shrink-0 self-center">
                          {isAlreadyImported ? (
                            <span className="text-[10px] font-mono text-emerald-600 font-extrabold flex items-center gap-0.5">
                              <Check className="h-3 w-3" /> In Sandbox
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => importScrapedRule(rule)}
                              className="px-2 py-0.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded cursor-pointer uppercase font-mono tracking-tighter"
                            >
                              + Import
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Scraped official sources citation list */}
            {scrapedSources.length > 0 && (
              <div className="bg-slate-100/50 p-2 rounded border border-slate-250 space-y-1">
                <span className="text-[9px] font-mono uppercase font-bold text-slate-400 block tracking-wider">Verifiable Grounding Sources (OSFI Site)</span>
                <div className="space-y-1">
                  {scrapedSources.map((src, idx) => (
                    <a
                      key={idx}
                      href={src.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      referrerPolicy="no-referrer"
                      className="text-[10px] text-blue-600 hover:underline block truncate font-mono flex items-center gap-1"
                    >
                      <Globe className="h-3 w-3 shrink-0 text-slate-400" />
                      {src.title || src.uri}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-slate-100 p-3 rounded-lg border border-slate-200 space-y-2 mt-2">
            <h4 className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              <Plus className="h-3 w-3" /> Add Custom Regulatory Policy
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Code (e.g. Rule_104)"
                value={newRuleCode}
                onChange={(e) => setNewRuleCode(e.target.value)}
                className="bg-white border border-slate-200 px-2 py-1 text-xs rounded shadow-xs focus:ring-indigo-500"
              />
              <input
                type="text"
                placeholder="Name"
                value={newRuleName}
                onChange={(e) => setNewRuleName(e.target.value)}
                className="bg-white border border-slate-200 px-2 py-1 text-xs rounded shadow-xs focus:ring-indigo-500"
              />
            </div>
            <textarea
              placeholder="Rule Description (e.g. All employee emails must trigger dual consent)"
              value={newRuleDesc}
              onChange={(e) => setNewRuleDesc(e.target.value)}
              className="w-full bg-white border border-slate-200 p-2 text-xs rounded shadow-xs focus:ring-indigo-500 h-12 resize-none"
            />
            <button
              onClick={addRule}
              disabled={!newRuleCode || !newRuleName || !newRuleDesc}
              className="w-full py-1.5 bg-slate-800 text-white rounded font-medium text-xs hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Inject Compliance Law
            </button>
          </div>
        </div>
      )}

      {/* Technical catalog Tab */}
      {activeTab === "technical" && (
        <div className="space-y-3">
          <div className="divide-y divide-slate-100 bg-white border border-slate-200/80 rounded-lg overflow-hidden max-h-[220px] overflow-y-auto">
            {catalog.map((item) => (
              <div key={item.id} className="p-2 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    item.category === "approved" ? "bg-emerald-500" :
                    item.category === "banned" ? "bg-red-500" : "bg-amber-500"
                  }`}></span>
                  <span className={`font-medium ${item.enabled ? 'text-slate-800' : 'text-slate-400 line-through'}`}>{item.name}</span>
                  <span className="text-[9px] uppercase font-mono px-1 rounded bg-slate-150 text-slate-500">
                    {item.category}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={item.enabled}
                    onChange={() => toggleCatalog(item.id)}
                    className="rounded text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => removeTool(item.id)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-100 p-3 rounded-lg border border-slate-200 space-y-2 mt-2">
            <h4 className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              <Plus className="h-3 w-3" /> Add Custom Infra Tool
            </h4>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Tool or API Name"
                value={newToolName}
                onChange={(e) => setNewToolName(e.target.value)}
                className="flex-grow bg-white border border-slate-200 px-2 py-1 text-xs rounded shadow-xs focus:ring-indigo-500"
              />
              <select
                value={newToolCat}
                onChange={(e) => setNewToolCat(e.target.value as any)}
                className="bg-white border border-slate-200 px-2 py-1 text-xs rounded focus:ring-indigo-500 text-slate-700"
              >
                <option value="approved">Approved</option>
                <option value="banned">Banned</option>
                <option value="restricted">Restricted</option>
              </select>
            </div>
            <button
              onClick={addTool}
              disabled={!newToolName}
              className="w-full py-1.5 bg-slate-800 text-white rounded font-medium text-xs hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Inject Tool into Catalog
            </button>
          </div>
        </div>
      )}

      {/* Nodes Tab */}
      {activeTab === "nodes" && (
        <div className="space-y-3">
          <div className="bg-white border border-slate-200/80 rounded-lg p-2.5 max-h-[220px] overflow-y-auto">
            <div className="flex flex-wrap gap-1.5">
              {nodes.map((node) => (
                <div key={node} className="flex items-center gap-1 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full text-xs font-mono text-slate-700">
                  <span>{node}</span>
                  <button
                    type="button"
                    onClick={() => removeNode(node)}
                    className="text-slate-400 hover:text-red-500 rounded-full hover:bg-slate-200 p-0.5"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-100 p-3 rounded-lg border border-slate-200 space-y-2 mt-2">
            <h4 className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              <Plus className="h-3 w-3" /> Add Operational Node
            </h4>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Node identifier (e.g. Finance_Portal)"
                value={newNodeName}
                onChange={(e) => setNewNodeName(e.target.value)}
                className="flex-grow bg-white border border-slate-200 px-2 py-1 text-xs rounded shadow-xs focus:ring-indigo-500 font-mono"
              />
              <button
                onClick={addNode}
                disabled={!newNodeName}
                className="py-1 px-3 bg-slate-800 text-white rounded font-medium text-xs hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add Node
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
