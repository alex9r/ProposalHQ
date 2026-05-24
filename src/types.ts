/**
 * Type declarations for the Enterprise Innovation Simulator
 */

export interface PrecedentProject {
  id: string;
  description: string;
  status: "Approved" | "Rejected" | "Exception Granted";
  warning: string;
}

export interface RegulatoryAnalysis {
  status: "Pass" | "Fail" | "Maybe";
  flagged_rule: string;
  citation: string;
  admin_review_required: boolean;
  precedent_mapping?: PrecedentProject[];
  approval_probability?: number;
  legal_review_time?: number;
  legislation_forecasting?: string;
  news_bulletin?: string;
  full_gatekeeper_formatted_text?: string;
}

export interface TechnicalPipelineStep {
  stage: string;
  tool: string;
  status: "green" | "yellow" | "red";
  action: string;
}

export interface TechnicalAnalysis {
  approved_tools_to_use: string[];
  restricted_access_required: string[];
  banned_tools_flagged: string[];
  pipeline?: TechnicalPipelineStep[];
  integration_friction_prediction?: string;
  dlp_governance_check?: string;
  shadow_it_forecast?: string;
  hard_block_active?: boolean;
  hard_block_reason?: string;
  security_red_teaming_attack_simulation?: string;
  zero_trust_violation_detail?: string;
}

export interface DependencyAnalysis {
  directly_impacted_nodes: string[];
  indirectly_impacted_nodes: string[];
  complexity_score: number; // 1 to 10
  orphaned_process_discovery?: string;
  synergy_cannibalization?: string;
  mermaid_dependency_graph?: string;
}

export interface AdoptionMetrics {
  tech_integration?: number;
  workflow_disruption?: number;
  regulatory_friction?: number;
  target_users?: number;
  efficiency?: number;
  it_tickets?: number;
  adoption_rate?: number;
  roi?: number;
  has_called_ml_api?: boolean;
}

export interface SimulationPayload {
  regulatory: RegulatoryAnalysis;
  technical: TechnicalAnalysis;
  dependency: DependencyAnalysis;
  adoption_metrics?: AdoptionMetrics;
}

export interface SandboxPolicy {
  code: string;
  name: string;
  description: string;
  category: "compliance" | "technical" | "operational";
  source?: string;
  enabled: boolean;
}

export interface SandboxCatalogItem {
  id: string;
  name: string;
  category: "approved" | "banned" | "restricted";
  enabled: boolean;
}

export interface InnovationIdea {
  id: string;
  title: string;
  ideaText: string;
  timestamp: string;
  payload: SimulationPayload;
  isFavorite?: boolean;
  team?: string;
}

export const DEFAULT_RULES: SandboxPolicy[] = [
  {
    code: "REG_B13",
    name: "Cyber Resilience",
    description: "Per OSFI Guideline B-13, all new technology assets must have automated data backups, and any system handling financial transactions must not introduce single points of failure.",
    category: "compliance",
    source: "OSFI Guideline B-13",
    enabled: true
  },
  {
    code: "REG_B10",
    name: "Third-Party Risk",
    description: "Per OSFI Guideline B-10, cloud vendors and SaaS tools cannot subcontract data processing to \"fourth parties.\" Any tool that shares bank data with external third-party models is banned.",
    category: "compliance",
    source: "OSFI Guideline B-10",
    enabled: true
  },
  {
    code: "REG_RESIDENCY",
    name: "Data Sovereignty",
    description: "All Customer Personally Identifiable Information (PII), Social Insurance Numbers (SIN), and Primary Account Numbers (PAN) must be stored and processed exclusively on servers physically located within Canada.",
    category: "compliance",
    source: "PIPEDA / Data Sovereignty",
    enabled: true
  },
  {
    code: "REG_PCI",
    name: "Encryption",
    description: "Per PCI-DSS, all financial and customer data must be encrypted at rest using AES-256 and in transit using TLS 1.3. No unencrypted data transfers are permitted.",
    category: "compliance",
    source: "PCI-DSS Standard",
    enabled: true
  },
  {
    code: "REG_DLP",
    name: "Data Loss Prevention",
    description: "Systems cannot be designed to automatically email or export batches of customer data (e.g., >5 SINs or credit card numbers) to external domains.",
    category: "compliance",
    source: "Data Leakage Prevention Policy",
    enabled: true
  }
];

export const DEFAULT_TECHNICAL_CATALOG: SandboxCatalogItem[] = [
  // Approved & Available
  { id: "Microsoft Power Automate", name: "Microsoft Power Automate", category: "approved", enabled: true },
  { id: "Azure Active Directory / Entra ID", name: "Azure Active Directory / Entra ID", category: "approved", enabled: true },
  { id: "Enterprise Azure OpenAI", name: "Enterprise Azure OpenAI", category: "approved", enabled: true },
  { id: "Google Cloud Vertex AI", name: "Google Cloud Vertex AI", category: "approved", enabled: true },
  { id: "Internal API Gateway", name: "Internal API Gateway", category: "approved", enabled: true },
  { id: "React", name: "React", category: "approved", enabled: true },
  { id: "Python", name: "Python", category: "approved", enabled: true },
  { id: "FastAPI", name: "FastAPI", category: "approved", enabled: true },
  { id: "PostgreSQL", name: "PostgreSQL", category: "approved", enabled: true },

  // Strictly Banned
  { id: "Public Generative AI APIs", name: "Public Generative AI APIs", category: "banned", enabled: true },
  { id: "Public ChatGPT", name: "Public ChatGPT", category: "banned", enabled: true },
  { id: "Anthropic", name: "Anthropic", category: "banned", enabled: true },
  { id: "Midjourney", name: "Midjourney", category: "banned", enabled: true },
  { id: "HuggingFace", name: "HuggingFace", category: "banned", enabled: true },
  { id: "Public GitHub / GitLab", name: "Public GitHub / GitLab", category: "banned", enabled: true },
  { id: "Public Cloud Storage", name: "Public Cloud Storage", category: "banned", enabled: true },
  { id: "AWS S3 / Azure Blobs (Public)", name: "AWS S3 / Azure Blobs (Public)", category: "banned", enabled: true },
  { id: "Zapier", name: "Zapier", category: "banned", enabled: true },
  { id: "IFTTT", name: "IFTTT", category: "banned", enabled: true },
  { id: "Make.com", name: "Make.com", category: "banned", enabled: true },

  // Restricted Access (Requires 30-Day Security Review)
  { id: "Core_Banking_Ledger_DB", name: "Core_Banking_Ledger_DB", category: "restricted", enabled: true },
  { id: "Retail_Customer_Profiles", name: "Retail_Customer_Profiles", category: "restricted", enabled: true },
  { id: "HR_Employee_Records", name: "HR_Employee_Records", category: "restricted", enabled: true }
];

export const DEFAULT_DEPENDENCY_NODES = [
  "Customer_Mobile_App",
  "Core_Database",
  "Frontline_Staff_Portal",
  "IT_Help_Desk",
  "Corporate_Compliance_Auditors"
];
