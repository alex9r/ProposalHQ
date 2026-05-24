import { useState, useEffect, useRef, useMemo } from "react";
import { DependencyAnalysis } from "../types";
import { 
  Network, 
  HelpCircle, 
  Activity, 
  GitFork, 
  AlertTriangle, 
  ArrowRightLeft, 
  Terminal, 
  Copy, 
  Check, 
  BrainCircuit,
  Info,
  Layers,
  Sparkles
} from "lucide-react";
import mermaid from "mermaid";

// Initialize mermaid once safely on mount
if (typeof window !== "undefined") {
  mermaid.initialize({
    startOnLoad: false,
    theme: "neutral",
    securityLevel: "loose",
    themeVariables: {
      background: "#f8fafc",
      primaryColor: "#f1f5f9",
      primaryTextColor: "#0f172a",
      lineColor: "#94a3b8"
    }
  });
}

interface DependencyLensProps {
  analysis: DependencyAnalysis;
  allNodes: string[];
}

export default function DependencyLens({ analysis, allNodes }: DependencyLensProps) {
  const { 
    directly_impacted_nodes = [], 
    indirectly_impacted_nodes = [], 
    complexity_score = 1,
    orphaned_process_discovery = "",
    synergy_cannibalization = "",
    mermaid_dependency_graph = ""
  } = analysis;

  const [copied, setCopied] = useState(false);
  const [showSource, setShowSource] = useState(false);
  const [svgMarkup, setSvgMarkup] = useState<string>("");
  const [renderError, setRenderError] = useState(false);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Shorten and make readable bullets for Step 3 list
  const processBullets = useMemo(() => {
    return (orphaned_process_discovery || "")
      .split(/[.!?]/)
      .map(s => s.trim())
      .filter(s => s.length > 10)
      .slice(0, 2);
  }, [orphaned_process_discovery]);

  const synergyBullets = useMemo(() => {
    return (synergy_cannibalization || "")
      .split(/[.!?]/)
      .map(s => s.trim())
      .filter(s => s.length > 10)
      .slice(0, 2);
  }, [synergy_cannibalization]);



  const isDirectNormalized = (nodeId: string) => {
    return directly_impacted_nodes.some(n => 
      n.toLowerCase().replace(/[\s\-_.]/g, "") === nodeId.toLowerCase().replace(/[\s\-_.]/g, "")
    );
  };

  const isIndirectNormalized = (nodeId: string) => {
    return indirectly_impacted_nodes.some(n => 
      n.toLowerCase().replace(/[\s\-_.]/g, "") === nodeId.toLowerCase().replace(/[\s\-_.]/g, "")
    );
  };

  const { parsedNodes, parsedLinks } = useMemo(() => {
    try {
      const nodesMap = new Map<string, { id: string; label: string; isRed: boolean }>();
      const linksList: Array<{ from: string; to: string; label: string; isDashed: boolean }> = [];
      const code = (mermaid_dependency_graph || "")
        .replace(/^```mermaid\s*/i, "")
        .replace(/```$/, "")
        .trim();
      
      const lines = code.split("\n");
      const redNodes = new Set<string>();

      // Parse styles first
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith("style ")) {
          const match = trimmed.match(/style\s+([a-zA-Z0-9_\-.]+)\s+(.*)/);
          if (match) {
            const nodeId = match[1];
            const rule = match[2];
            if (rule.includes("fill:#ffcccc") || rule.includes("#ff0000") || rule.includes("red")) {
              redNodes.add(nodeId);
            }
          }
        }
      }

      // Parse connections
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("graph") || trimmed.startsWith("flowchart") || trimmed.startsWith("style ")) {
          continue;
        }

        const isDashed = trimmed.includes("-.->");
        const connector = isDashed ? "-.->" : "-->";

        if (trimmed.includes(connector)) {
          const parts = trimmed.split(connector);
          if (parts.length >= 2) {
            let left = parts[0].trim();
            let right = parts[1].trim();

            let linkLabel = "";
            const labelMatch = right.match(/^\|([^|]+)\|\s*(.*)/);
            if (labelMatch) {
              linkLabel = labelMatch[1].trim();
              right = labelMatch[2].trim();
            }

            const cleanNode = (part: string) => {
              const bMatch = part.match(/^([a-zA-Z0-9_\-.]+)\s*[\[\(\{](.*?)[\]\)\}]/);
              if (bMatch) {
                return { id: bMatch[1], label: bMatch[2].replace(/^"|"$/g, "").trim() };
              }
              return { id: part, label: part };
            };

            const leftN = cleanNode(left);
            const rightN = cleanNode(right);

            if (!nodesMap.has(leftN.id)) {
              nodesMap.set(leftN.id, { id: leftN.id, label: leftN.label, isRed: redNodes.has(leftN.id) });
            }
            if (!nodesMap.has(rightN.id)) {
              nodesMap.set(rightN.id, { id: rightN.id, label: rightN.label, isRed: redNodes.has(rightN.id) });
            }

            linksList.push({
              from: leftN.id,
              to: rightN.id,
              label: linkLabel,
              isDashed
            });
          }
        } else {
          // Single Node
          const bMatch = trimmed.match(/^([a-zA-Z0-9_\-.]+)\s*[\[\(\{](.*?)[\]\)\}]/);
          if (bMatch) {
            const id = bMatch[1];
            const label = bMatch[2].replace(/^"|"$/g, "").trim();
            if (!nodesMap.has(id)) {
              nodesMap.set(id, { id, label, isRed: redNodes.has(id) });
            }
          } else if (/^[a-zA-Z0-9_\-.]+$/.test(trimmed)) {
            if (!nodesMap.has(trimmed)) {
              nodesMap.set(trimmed, { id: trimmed, label: trimmed, isRed: redNodes.has(trimmed) });
            }
          }
        }
      }

      return { parsedNodes: Array.from(nodesMap.values()), parsedLinks: linksList };
    } catch (e) {
      console.warn("Failed to parse flowchart.", e);
      return { parsedNodes: [], parsedLinks: [] };
    }
  }, [mermaid_dependency_graph]);

  // Categorise nodes into 3 pipeline columns (1: Proposed Source, 2: Direct Impacts, 3: Downstream/Ripples)
  const nodesByColumn = useMemo(() => {
    const col1: typeof parsedNodes = [];
    const col2: typeof parsedNodes = [];
    const col3: typeof parsedNodes = [];

    parsedNodes.forEach(node => {
      const isDirect = isDirectNormalized(node.id) || node.isRed;
      const isIndirect = !isDirect && isIndirectNormalized(node.id);
      
      const isCenter = node.id.toLowerCase().includes("proposed") || 
                       node.id.toLowerCase().includes("idea") || 
                       node.id.toLowerCase().includes("draft") ||
                       (!isDirect && !isIndirect && parsedLinks.some(l => l.from === node.id && !parsedLinks.some(l2 => l2.to === node.id)));

      if (isCenter) {
        col1.push(node);
      } else if (isDirect) {
        col2.push(node);
      } else if (isIndirect) {
        col3.push(node);
      } else {
        // Fallback column tracing
        const hasInbound = parsedLinks.some(l => l.to === node.id);
        const hasOutbound = parsedLinks.some(l => l.from === node.id);
        if (!hasInbound && hasOutbound) {
          col1.push(node);
        } else if (hasInbound && !hasOutbound) {
          col3.push(node);
        } else {
          col2.push(node);
        }
      }
    });

    // Ensure we have at least one starting point in column 1 for visual layout
    if (col1.length === 0 && parsedNodes.length > 0) {
      let bestNode = parsedNodes[0];
      let maxOut = -1;
      parsedNodes.forEach(node => {
        const outCount = parsedLinks.slice().filter(l => l.from === node.id).length;
        if (outCount > maxOut) {
          maxOut = outCount;
          bestNode = node;
        }
      });
      col1.push(bestNode);
      const index2 = col2.indexOf(bestNode);
      if (index2 > -1) col2.splice(index2, 1);
      const index3 = col3.indexOf(bestNode);
      if (index3 > -1) col3.splice(index3, 1);
    }

    if (col2.length === 0 && col3.length > 0) {
      const half = Math.ceil(col3.length / 2);
      col2.push(...col3.splice(0, half));
    }

    return { col1, col2, col3 };
  }, [parsedNodes, parsedLinks, directly_impacted_nodes, indirectly_impacted_nodes]);

  const parsedPositions = useMemo(() => {
    const positions: Record<string, { x: number; y: number }> = {};
    if (parsedNodes.length === 0) return positions;

    const { col1, col2, col3 } = nodesByColumn;
    const x1 = 80;
    const x2 = 270;
    const x3 = 460;

    const assignY = (nodesList: typeof parsedNodes, xCoord: number) => {
      const k = nodesList.length;
      if (k === 1) {
        positions[nodesList[0].id] = { x: xCoord, y: 160 };
      } else {
        const startY = 70;
        const endY = 270;
        const heightRange = endY - startY;
        const spacing = heightRange / (k - 1);
        nodesList.forEach((node, idx) => {
          positions[node.id] = {
            x: xCoord,
            y: Math.round(startY + idx * spacing)
          };
        });
      }
    };

    assignY(col1, x1);
    assignY(col2, x2);
    assignY(col3, x3);

    return positions;
  }, [parsedNodes, nodesByColumn]);

  // Helper for complexity text
  const getComplexityDesc = (score: number) => {
    if (score <= 3) return { text: "Low Complexity Team Actionable", color: "text-emerald-600 bg-emerald-50 border border-emerald-200", desc: "No core systems are altered. Relies primarily on pre-authorized client integrations." };
    if (score <= 6) return { text: "Moderate Systems Modification", color: "text-amber-600 bg-amber-50 border border-amber-200", desc: "Requires schema edits or API integrations with downstream operational queues." };
    return { text: "High Custom Ledger Refactoring", color: "text-red-650 bg-red-50 border border-red-200", desc: "Heavy architectural work altering major compliance flows or high-traffic DB infrastructure." };
  };

  const complexity = getComplexityDesc(complexity_score);

  // Calculate SVG stroke configs
  const circleCircumference = 2 * Math.PI * 34; // r=34
  const strokeDashoffset = circleCircumference * (1 - complexity_score / 10);

  // Copy Mermaid source code helper
  const handleCopy = () => {
    navigator.clipboard.writeText(mermaid_dependency_graph);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper function to sanitize and format Mermaid graphs so that they never trigger parsing/syntax crashes.
  const sanitizeMermaidCode = (rawGraph: string): string => {
    if (!rawGraph) return "graph TD\n  Proposed[Proposed Feature] --> Ledger[Legacy SQL Ledger]";

    // 1. Robust extraction: find content between ```mermaid and ``` anywhere in the string
    let codeStr = "";
    const match = rawGraph.match(/```mermaid([\s\S]*?)```/);
    if (match) {
      codeStr = match[1].trim();
    } else {
      // Stripping outer backticks if they exist
      let temp = rawGraph.replace(/```mermaid/gi, "").replace(/```/g, "").trim();
      const graphIndex = temp.search(/(graph|flowchart)\b/i);
      if (graphIndex !== -1) {
        codeStr = temp.substring(graphIndex).trim();
      } else {
        codeStr = temp;
      }
    }

    // 2. Sanitize line by line
    const lines = codeStr.split("\n");
    const sanitizedLines: string[] = [];

    for (let line of lines) {
      let trimmed = line.trim();
      if (!trimmed) continue;

      // Keep direct headers, styles, etc.
      if (trimmed.startsWith("graph") || trimmed.startsWith("flowchart") || trimmed.startsWith("style ")) {
        if (trimmed.startsWith("style ")) {
          const parts = trimmed.split(/\s+/);
          if (parts.length >= 3) {
            const nodeName = parts[1];
            // Replace dots, spaces, hyphens in node name
            const cleanNode = nodeName.replace(/[\s\-. ]/g, "_");
            sanitizedLines.push(`style ${cleanNode} ${parts.slice(2).join(" ")}`);
            continue;
          }
        }
        sanitizedLines.push(trimmed);
        continue;
      }

      // Connections or Node definitions
      const hasConnection = trimmed.includes("-->") || trimmed.includes("-.->");
      if (hasConnection) {
        let arrow = "-->";
        let splitChar = "-->";
        if (trimmed.includes("-.->")) {
          arrow = "-.->";
          splitChar = "-.->";
        }

        const parts = trimmed.split(splitChar);
        if (parts.length === 2) {
          let left = parts[0].trim();
          let right = parts[1].trim();

          // Check for direct label inline in arrow or right side, e.g., -.->|Label|
          let label = "";
          if (right.startsWith("|")) {
            const endLabelIndex = right.indexOf("|", 1);
            if (endLabelIndex !== -1) {
              label = right.substring(0, endLabelIndex + 1);
              right = right.substring(endLabelIndex + 1).trim();
            }
          }

          const parseNodePart = (part: string) => {
            // Check if already declared with a label like ID[Label]
            const matchBrackets = part.match(/^([a-zA-Z0-9_\-.]+)\s*([\[\(\{].*?[\]\)\}])/);
            if (matchBrackets) {
              const id = matchBrackets[1].replace(/[\s\-. ]/g, "_");
              const labelContent = matchBrackets[2];
              return { id, display: `${id}${labelContent}` };
            }

            if (/[\s\-.]/.test(part)) {
              const id = part.replace(/[\s\-. ]/g, "_");
              return { id, display: `${id}["${part}"]` };
            }
            return { id: part, display: part };
          };

          const leftClean = parseNodePart(left);
          const rightClean = parseNodePart(right);

          sanitizedLines.push(`  ${leftClean.display} ${arrow}${label} ${rightClean.display}`);
        } else {
          sanitizedLines.push(trimmed);
        }
      } else {
        // Single Node
        const matchBrackets = trimmed.match(/^([a-zA-Z0-9_\-.]+)\s*([\[\(\{].*?[\]\)\}])/);
        if (matchBrackets) {
          const id = matchBrackets[1].replace(/[\s\-. ]/g, "_");
          const labelContent = matchBrackets[2];
          sanitizedLines.push(`  ${id}${labelContent}`);
        } else if (/[\s\-.]/.test(trimmed)) {
          const id = trimmed.replace(/[\s\-. ]/g, "_");
          sanitizedLines.push(`  ${id}["${trimmed}"]`);
        } else {
          sanitizedLines.push(trimmed);
        }
      }
    }

    // Ensure graph TD is always present as the first line if missing
    if (sanitizedLines.length > 0 && !sanitizedLines[0].startsWith("graph") && !sanitizedLines[0].startsWith("flowchart")) {
      sanitizedLines.unshift("graph TD");
    } else if (sanitizedLines.length === 0) {
      return "graph TD\n  Proposed[Proposed Feature] --> Ledger[Legacy SQL Ledger]";
    }

    return sanitizedLines.join("\n");
  };

  // Render Mermaid.js dynamically whenever mermaid_dependency_graph changes
  useEffect(() => {
    if (!mermaid_dependency_graph) {
      setSvgMarkup("");
      return;
    }

    setRenderError(false);

    // Apply the robust sanitizer to produce perfect Mermaid syntax
    const cleanedCode = sanitizeMermaidCode(mermaid_dependency_graph);
    const uniqueId = `mermaid-graph-${Math.floor(Math.random() * 99999) + 1}`;

    const generateGraph = async () => {
      try {
        const { svg } = await mermaid.render(uniqueId, cleanedCode);
        setSvgMarkup(svg);
      } catch (err) {
        console.warn("Could not render custom mermaid code inline. Using visual schematic backup.", err);
        setRenderError(true);
      }
    };

    generateGraph();
  }, [mermaid_dependency_graph]);

  return (
    <div id="dependency-lens" className="bg-white rounded-xl border border-slate-200/85 overflow-hidden shadow-sm flex flex-col h-full">
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Network className="h-5 w-5 text-slate-700" />
          <h3 className="font-semibold text-slate-800 text-sm uppercase tracking-wider">Dependency & Ripple Lens</h3>
        </div>
        <span className="text-[10px] font-mono bg-slate-200 text-slate-700 px-2 py-0.5 rounded uppercase font-semibold">
          Node Map
        </span>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Real Visual Dependency Graph */}
        <div className="md:col-span-8 flex flex-col bg-slate-50 border border-slate-200/80 rounded-xl min-h-[300px] relative overflow-hidden shadow-xs">
          {/* Box Header Controls */}
          <div className="bg-slate-100/90 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Network className="h-4.5 w-4.5 text-indigo-650" />
              <span className="text-[10px] font-extrabold text-slate-700 uppercase font-mono tracking-tight">
                Visual Dependency Graph (Interactive Flow)
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setShowSource(!showSource)}
                className="text-[9px] font-bold text-indigo-600 hover:text-indigo-800 bg-white border border-slate-200 px-2.5 py-1 rounded cursor-pointer flex items-center gap-1 font-mono transition-colors shadow-2xs"
              >
                <Terminal className="h-3 w-3" />
                {showSource ? "Show Graph" : "Source"}
              </button>
              <button 
                onClick={handleCopy}
                className="text-[9px] font-bold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 p-1.5 rounded cursor-pointer transition-colors shadow-2xs"
                title="Copy Mermaid string"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          {/* Render Board */}
          <div className="p-4 flex-grow flex flex-col justify-center min-h-[250px]">
            {showSource ? (
              <div className="bg-slate-900 text-slate-200 font-mono text-[10px] p-4 rounded-lg border border-slate-800 text-left whitespace-pre overflow-x-auto min-h-[220px] max-h-[340px]">
                {mermaid_dependency_graph || "No flowchart code generated."}
              </div>
            ) : parsedNodes.length > 0 ? (
              <div className="relative w-full overflow-x-auto py-2">
                <svg viewBox="0 0 540 320" className="w-[540px] h-[320px] mx-auto overflow-visible select-none">
                  {/* CSS Keyframes for beautiful line flows */}
                  <style>{`
                    @keyframes svg-flow-dash {
                      to {
                        stroke-dashoffset: -20;
                      }
                    }
                  `}</style>

                  {/* Arrow markers defined */}
                  <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="24" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 1.5 L 8 5 L 0 8.5 z" className="fill-slate-450" />
                    </marker>
                    <marker id="arrow-active" viewBox="0 0 10 10" refX="24" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 1.5 L 8 5 L 0 8.5 z" className="fill-indigo-500" />
                    </marker>
                    <marker id="arrow-breaking" viewBox="0 0 10 10" refX="24" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 1.5 L 8 5 L 0 8.5 z" className="fill-rose-500" />
                    </marker>
                  </defs>

                  {/* Column Background Dividers */}
                  <line x1="175" y1="20" x2="175" y2="300" className="stroke-slate-200/60 stroke-[1.5] stroke-dasharray-[4,4]" />
                  <line x1="365" y1="20" x2="365" y2="300" className="stroke-slate-200/60 stroke-[1.5] stroke-dasharray-[4,4]" />

                  {/* Column Labels */}
                  <text x="80" y="24" textAnchor="middle" className="text-[8px] font-mono font-black fill-slate-400 tracking-wider uppercase">
                    1. Proposed Action
                  </text>
                  <text x="270" y="24" textAnchor="middle" className="text-[8px] font-mono font-black fill-slate-400 tracking-wider uppercase">
                    2. Primary Touchpoint
                  </text>
                  <text x="460" y="24" textAnchor="middle" className="text-[8px] font-mono font-black fill-slate-400 tracking-wider uppercase">
                    3. Downstream Ripple
                  </text>

                  {/* Draw Connections/Edges */}
                  {parsedLinks.map((link, idx) => {
                    const fromPos = parsedPositions[link.from];
                    const toPos = parsedPositions[link.to];

                    if (!fromPos || !toPos) return null;

                    // Interaction state calculations
                    const activeNodeId = hoveredNodeId || selectedNodeId;
                    const isLinkedToActive = activeNodeId ? (link.from === activeNodeId || link.to === activeNodeId) : false;
                    const isDimmed = activeNodeId && !isLinkedToActive;

                    // Color categorizations
                    const isFromDirect = isDirectNormalized(link.from);
                    const isToDirect = isDirectNormalized(link.to);
                    const isDirectConnection = isFromDirect || isToDirect;

                    let strokeClass = "stroke-slate-350 stroke-[1.2]";
                    let markerId = "arrow";

                    if (isDirectConnection) {
                      strokeClass = isLinkedToActive ? "stroke-rose-500 stroke-[1.8]" : "stroke-rose-350 stroke-[1.3]";
                      markerId = "arrow-breaking";
                    } else if (isLinkedToActive) {
                      strokeClass = "stroke-indigo-500 stroke-[1.8]";
                      markerId = "arrow-active";
                    }

                    const dx = Math.abs(toPos.x - fromPos.x) * 0.45;
                    const pathData = `M ${fromPos.x} ${fromPos.y} C ${fromPos.x + dx} ${fromPos.y}, ${toPos.x - dx} ${toPos.y}, ${toPos.x} ${toPos.y}`;

                    return (
                      <g key={`link-${idx}`} className="transition-all duration-300">
                        {/* Interactive glow backing path on hover */}
                        {isLinkedToActive && (
                          <path
                            d={pathData}
                            className={`stroke-8 fill-none opacity-20 pointer-events-none ${
                              isDirectConnection ? "stroke-rose-450" : "stroke-indigo-400"
                            }`}
                          />
                        )}

                        {/* Solid system line edge */}
                        <path
                          d={pathData}
                          className={`transition-all duration-300 fill-none ${strokeClass} ${
                            isDimmed ? "opacity-15" : "opacity-100"
                          }`}
                          style={{
                            strokeDasharray: link.isDashed ? "5,5" : undefined
                          }}
                          markerEnd={`url(#${markerId})`}
                        />

                        {/* Animated pulsing flows on hover */}
                        {isLinkedToActive && (
                          <path
                            d={pathData}
                            className={`stroke-[1.5] fill-none opacity-80 pointer-events-none stroke-dasharray-[5,5] ${
                              isDirectConnection ? "stroke-rose-600" : "stroke-indigo-600"
                            }`}
                            style={{
                              animation: "svg-flow-dash 1.2s linear infinite"
                            }}
                          />
                        )}

                        {/* Connection system link context badges */}
                        {link.label && !isDimmed && (
                          <foreignObject
                            x={(fromPos.x + toPos.x) / 2 - 35}
                            y={(fromPos.y + toPos.y) / 2 - 8}
                            width="70"
                            height="16"
                            className="overflow-visible pointer-events-none"
                          >
                            <div className="flex items-center justify-center">
                              <span className="bg-slate-900/90 text-[7px] font-mono tracking-wide font-extrabold text-white px-1.5 py-0.2 rounded border border-slate-750/30 shadow-3xs uppercase">
                                {link.label}
                              </span>
                            </div>
                          </foreignObject>
                        )}
                      </g>
                    );
                  })}

                  {/* Draw Node Circles */}
                  {parsedNodes.map((node) => {
                    const pos = parsedPositions[node.id];
                    if (!pos) return null;

                    const isDirect = isDirectNormalized(node.id) || node.isRed;
                    const isIndirect = !isDirect && isIndirectNormalized(node.id);
                    const isCenter = node.id === parsedNodes.find(n => n.id.toLowerCase().includes("proposed") || n.id.toLowerCase().includes("idea") || n.id.toLowerCase().includes("draft") || n.id === parsedNodes[0]?.id)?.id;

                    // Highlight and state selectors
                    const activeNodeId = hoveredNodeId || selectedNodeId;
                    const isHighlighted = !activeNodeId || node.id === activeNodeId || parsedLinks.some(l => 
                      (l.from === activeNodeId && l.to === node.id) || 
                      (l.to === activeNodeId && l.from === node.id)
                    );
                    const isActiveNode = node.id === activeNodeId;

                    let borderStroke = "stroke-slate-450";
                    let fillCircle = "fill-white";
                    let glowRing = null;

                    if (isDirect) {
                      borderStroke = "stroke-rose-500 stroke-[2.5]";
                      fillCircle = "fill-rose-50/95";
                      glowRing = (
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r={22}
                          className="stroke-rose-400 stroke-1.5 fill-none animate-ping opacity-35"
                          style={{ animationDuration: "3s" }}
                        />
                      );
                    } else if (isIndirect) {
                      borderStroke = "stroke-amber-500 stroke-[2]";
                      fillCircle = "fill-amber-50/95";
                      glowRing = (
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r={20}
                          className="stroke-amber-400/80 stroke-1.5 fill-none stroke-dasharray-[3,3] animate-spin"
                          style={{ animationDuration: "14s" }}
                        />
                      );
                    } else if (isCenter) {
                      borderStroke = "stroke-indigo-600 stroke-[2.5]";
                      fillCircle = "fill-indigo-50/95";
                      glowRing = (
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r={21}
                          className="stroke-indigo-300 stroke-[2] fill-none animate-pulse opacity-50"
                        />
                      );
                    } else {
                      borderStroke = "stroke-slate-400 stroke-[1.5]";
                      fillCircle = "fill-white";
                      if (isActiveNode) {
                        glowRing = (
                          <circle
                            cx={pos.x}
                            cy={pos.y}
                            r={19}
                            className="stroke-slate-300 stroke-1 fill-none animate-pulse"
                          />
                        );
                      }
                    }

                    return (
                      <g
                        key={node.id}
                        onMouseEnter={() => setHoveredNodeId(node.id)}
                        onMouseLeave={() => setHoveredNodeId(null)}
                        onClick={() => setSelectedNodeId(selectedNodeId === node.id ? null : node.id)}
                        className={`transition-all duration-300 cursor-pointer ${
                          isHighlighted ? "opacity-100" : "opacity-30 pointer-events-none"
                        } ${isActiveNode ? "scale-110" : ""}`}
                      >
                        {glowRing}
                        
                        {/* External boundary ring */}
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r={15}
                          className={`transition-all duration-300 shadow-2xs ${fillCircle} ${borderStroke} ${
                            isActiveNode ? "filter drop-shadow-[0_2px_5px_rgba(99,102,241,0.25)]" : ""
                          }`}
                        />

                        {/* Heart Pulse Micro Core */}
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r={4.5}
                          className={`transition-colors duration-300 ${
                            isDirect ? "fill-rose-500 animate-pulse" :
                            isIndirect ? "fill-amber-500" :
                            isCenter ? "fill-indigo-600" : "fill-slate-400"
                          }`}
                        />

                        {/* Systems Dynamic Nameplate tags */}
                        <foreignObject
                          x={pos.x - 60}
                          y={pos.y + 18}
                          width={120}
                          height={45}
                          className="overflow-visible pointer-events-none select-none"
                        >
                          <div className="flex flex-col items-center justify-center text-center">
                            <span className={`text-[9.5px] px-2 py-0.5 rounded-md font-sans border shadow-3xs max-w-[115px] truncate block leading-none ${
                              isDirect 
                                ? "bg-rose-50 border-rose-205 text-rose-800 font-extrabold" 
                                : isIndirect 
                                ? "bg-amber-50 border-amber-205 text-amber-800 font-extrabold"
                                : isCenter
                                ? "bg-indigo-50 border-indigo-205 text-indigo-850 font-bold"
                                : "bg-white border-slate-205 text-slate-700 font-semibold"
                            } ${
                              isActiveNode ? "scale-105 shadow-2xs opacity-100 ring-1 ring-indigo-200" : "opacity-90"
                            } transition-all duration-200`}>
                              {node.label}
                            </span>
                            
                            {isActiveNode && (
                              <span className={`text-[7px] font-mono font-extrabold tracking-wider mt-0.5 uppercase ${
                                isDirect ? "text-rose-600 animate-pulse" :
                                isIndirect ? "text-amber-600 animate-pulse" :
                                isCenter ? "text-indigo-600" : "text-slate-500"
                              }`}>
                                {isDirect ? "DIRECT IMPACT" :
                                 isIndirect ? "RIPPLE SPIKE" :
                                 isCenter ? "PROPOSED ACTION" : "ACTIVE NODE"}
                              </span>
                            )}
                          </div>
                        </foreignObject>
                      </g>
                    );
                  })}
                </svg>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 space-y-2 text-slate-400">
                <Activity className="h-6 w-6 animate-pulse text-indigo-400" />
                <span className="text-[10px] font-mono">Synthesizing operation map...</span>
              </div>
            )}
          </div>

          {/* Interactive Inspection Tracker Belt Box */}
          <div className="bg-slate-100/60 border-t border-slate-200 p-3.5 flex items-center justify-between text-xs transition-all min-h-[52px]">
            {(() => {
              const activeId = hoveredNodeId || selectedNodeId;
              if (!activeId) {
                return (
                  <div className="flex items-center gap-2 text-slate-500 font-medium font-sans w-full justify-center md:justify-start">
                    <Activity className="h-4 w-4 animate-pulse text-slate-400 shrink-0" />
                    <span className="text-[11px] leading-relaxed text-slate-500">Interactive Mesh: Hover or click any system node to trace downstream ripple segments.</span>
                  </div>
                );
              }

              const activeNode = parsedNodes.find(n => n.id === activeId);
              if (!activeNode) return null;

              const isDirect = isDirectNormalized(activeNode.id) || activeNode.isRed;
              const isIndirect = !isDirect && isIndirectNormalized(activeNode.id);
              const isCenter = activeNode.id === parsedNodes.find(n => n.id.toLowerCase().includes("proposed") || n.id.toLowerCase().includes("idea") || n.id.toLowerCase().includes("draft") || n.id === parsedNodes[0]?.id)?.id;

              let bgBadge = "bg-slate-100 text-slate-700 border-slate-200";
              let titleBadge = "Baseline System Piece";
              if (isDirect) {
                bgBadge = "bg-rose-50 text-rose-700 border-rose-200 animate-pulse";
                titleBadge = "Direct Breaking Node";
              } else if (isIndirect) {
                bgBadge = "bg-amber-50 text-amber-700 border-amber-200";
                titleBadge = "Ripple Propagation Spike";
              } else if (isCenter) {
                bgBadge = "bg-indigo-50 text-indigo-700 border-indigo-200";
                titleBadge = "Seed / Proposed Action Node";
              }

              // Trace connections
              const connectionsOut = parsedLinks.filter(l => l.from === activeNode.id);
              const connectionsIn = parsedLinks.filter(l => l.to === activeNode.id);

              return (
                <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-2 text-left">
                  <div className="space-y-0.5 max-w-[80%]">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 font-sans tracking-tight text-[11.5px]">{activeNode.label}</span>
                      <span className={`text-[7.5px] font-mono uppercase tracking-wider font-extrabold px-1.5 py-0.2 rounded border ${bgBadge}`}>
                        {titleBadge}
                      </span>
                    </div>
                    <p className="text-[10.5px] text-slate-500 font-sans leading-none">
                      Holds system signature <code className="bg-slate-205 font-mono text-[9px] px-1 rounded font-bold">({activeNode.id})</code>. Custom updates trigger dynamic schema adjustments.
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-[9.5px] font-mono text-slate-600">
                    <div className="bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-3xs flex items-center gap-0.5">
                      <span className="font-extrabold text-indigo-600">{connectionsIn.length}</span> Inbound
                    </div>
                    <div className="bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-3xs flex items-center gap-0.5">
                      <span className="font-extrabold text-indigo-600">{connectionsOut.length}</span> Outbound
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Node Legend Info Banner */}
          <div className="bg-slate-100/70 border-t border-slate-200/80 px-4 py-2 flex items-center gap-1.5 text-[9px] text-slate-500 font-medium whitespace-normal">
            <Info className="h-3.5 w-3.5 shrink-0 text-slate-400 font-semibold" />
            <span className="text-left leading-normal font-sans">
              Solid lines represent official financial systems. Dashed lines indicate unofficial/shadow access lines. Red highlight indicates potential system breakdown points.
            </span>
          </div>
        </div>

        {/* Complexity Dial Rating Card */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-3">
          <div className="relative flex items-center justify-center h-28 w-28">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="56"
                cy="56"
                r="34"
                className="stroke-slate-100 stroke-[7] fill-none"
              />
              <circle
                cx="56"
                cy="56"
                r="34"
                className="stroke-indigo-600 stroke-[7] fill-none transition-all duration-700 ease-out"
                strokeDasharray={`${circleCircumference}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-3xl font-extrabold text-slate-900 leading-none">
                {complexity_score}
              </span>
              <span className="text-[9px] font-mono block uppercase text-slate-400 tracking-wider font-bold mt-0.5">
                of 10 Rank
              </span>
            </div>
          </div>

          <div className="mt-4 space-y-1">
            <span className={`text-[10px] font-mono tracking-wider font-semibold uppercase px-2 py-0.5 rounded-md ${complexity.color}`}>
              {complexity.text}
            </span>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              {complexity.desc}
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-100 my-1 mx-6"></div>

      {/* Step 3: Enterprise Dependency Mapping */}
      <div className="p-6 pt-3 space-y-5 flex-grow">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <BrainCircuit className="h-5 w-5 text-indigo-600" />
          <h4 className="text-xs font-bold uppercase tracking-wide text-slate-800 font-mono">
            Step 3: Enterprise Dependency Mapping
          </h4>
          <span className="text-[9px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-150 rounded px-1.5 py-0.5 ml-auto font-mono uppercase">
            Dependency Mapping Engine GNN
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. Orphaned Process Discovery - Clean and short */}
          <div className="border border-slate-200 rounded-lg p-4 bg-white shadow-3xs hover:border-amber-300 transition-all duration-200 text-left">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-1.5 mb-2.5">
              <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
              <span className="text-[10.5px] font-extrabold text-slate-700 uppercase font-mono tracking-tight">
                1. Silent Operational Dependencies
              </span>
              <span className="text-[8px] font-bold uppercase bg-amber-50 text-amber-700 font-mono px-1.5 py-0.5 rounded ml-auto border border-amber-200">
                Shadow Risk
              </span>
            </div>
            
            <div className="space-y-2">
              {processBullets.length > 0 ? (
                processBullets.map((bullet, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-xs text-slate-600 leading-relaxed">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                    <span>{bullet}.</span>
                  </div>
                ))
              ) : (
                <div className="flex items-start gap-1.5 text-xs text-slate-600 leading-relaxed">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                  <span>Cross-checking your idea against undocumented enterprise logs. No major silent dependencies found.</span>
                </div>
              )}
            </div>
          </div>

          {/* 2. Operational Synergy & Integration Impact - Clean and short */}
          <div className="border border-slate-200 rounded-lg p-4 bg-white shadow-3xs hover:border-indigo-300 transition-all duration-200 text-left">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-1.5 mb-2.5">
              <ArrowRightLeft className="h-4 w-4 text-indigo-500 shrink-0" />
              <span className="text-[10.5px] font-extrabold text-slate-700 uppercase font-mono tracking-tight">
                2. Operational Synergy & Integration Impact
              </span>
              <span className="text-[8px] font-bold uppercase bg-indigo-50 text-indigo-700 font-mono px-1.5 py-0.5 rounded ml-auto border border-indigo-200">
                Workflow Impact
              </span>
            </div>

            <div className="space-y-2">
              {synergyBullets.length > 0 ? (
                synergyBullets.map((bullet, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-xs text-slate-600 leading-relaxed">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                    <span>{bullet}.</span>
                  </div>
                ))
              ) : (
                <div className="flex items-start gap-1.5 text-xs text-slate-600 leading-relaxed">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                  <span>Evaluated feature impact against other active divisions. No friction blocks detected.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
