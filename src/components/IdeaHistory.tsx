import { InnovationIdea } from "../types";
import { FolderHeart, Plus, Heart, HelpCircle, History, Sparkles, AlertCircle, FileCheck } from "lucide-react";

interface IdeaHistoryProps {
  history: InnovationIdea[];
  onLoadIdea: (idea: InnovationIdea) => void;
  onLoadTemplate: (text: string, title: string) => void;
  onToggleFavorite?: (id: string) => void;
  onClearAll?: () => void;
}

export default function IdeaHistory({
  history,
  onLoadIdea,
  onLoadTemplate,
  onToggleFavorite,
  onClearAll
}: IdeaHistoryProps) {
  const presets = [
    {
      title: "Public AI Banking Chatbot",
      highlight: "Violates Rule_102 Privacy Standards",
      text: "I want to add a feature to our banking app where users can ask an AI chatbot to read their statements using the public ChatGPT API to extract spend records."
    },
    {
      title: "Transit Operators System",
      highlight: "Passes/Maybe with Admin DB access",
      text: "Build an automated internal tracking system for our transit operators using Power Automate Pro that pulls scheduling data from the internal transit dispatch database."
    },
    {
      title: "Client-Facing Portal Redesign",
      highlight: "Requires WCAG 2.1 AA accessibility audit",
      text: "Modify our customer-facing web dashboard interfaces using React to show real-time financial tracking widgets, routing historical transaction files onto Canadian Postgres databases."
    }
  ];

  return (
    <div id="ideas-history" className="space-y-6">
      {/* History Ledger list */}
      <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-2">
            <History className="h-4 w-4 text-blue-600" />
            Simulation History Ledger
          </span>
          {history.length > 0 && onClearAll && (
            <button
              onClick={onClearAll}
              className="text-[10px] font-mono font-bold text-slate-400 hover:text-red-500 transition-colors cursor-pointer uppercase tracking-wider"
            >
              Purge Ledger
            </button>
          )}
        </div>

        <div className="p-5 max-h-[380px] overflow-y-auto">
          {history.length === 0 ? (
            <div className="text-center py-6">
              <FolderHeart className="h-8 w-8 text-slate-300 mx-auto opacity-70 mb-2" />
              <p className="text-xs text-slate-400">No simulations saved in history.</p>
              <p className="text-[10px] text-slate-400 mt-1 font-mono">Simulate ideas to save evaluations locally.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((idea) => {
                const status = idea.payload.regulatory.status;
                const statusColors = 
                  status === "Pass" ? "bg-emerald-100 text-emerald-800 border-emerald-200" :
                  status === "Fail" ? "bg-red-100 text-red-800 border-red-200" :
                  "bg-amber-100 text-amber-800 border-amber-200";

                return (
                  <div
                    key={idea.id}
                    className="p-3 border border-slate-200 rounded-lg flex items-start justify-between gap-2.5 hover:shadow-xs transition-all bg-slate-50/40"
                  >
                    <button
                      onClick={() => onLoadIdea(idea)}
                      className="flex-1 text-left min-w-0 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border uppercase shrink-0 ${statusColors}`}>
                          {status}
                        </span>
                        <span className="text-xs font-bold text-slate-800 truncate block font-mono">
                          {idea.title || "Unlabeled Synthesis"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-1 font-mono">
                        "{idea.ideaText}"
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 text-[9px] text-slate-400 font-mono">
                        <span>{new Date(idea.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span>•</span>
                        <span>Complexity: <strong className="font-semibold text-slate-600">{idea.payload.dependency.complexity_score}/10</strong></span>
                      </div>
                    </button>

                    {onToggleFavorite && (
                      <button
                        onClick={() => onToggleFavorite(idea.id)}
                        className={`p-1.5 rounded hover:bg-slate-200 shrink-0 cursor-pointer ${
                          idea.isFavorite ? "text-red-500" : "text-slate-300 hover:text-slate-500"
                        }`}
                      >
                        <Heart className="h-3.5 w-3.5 fill-current" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
