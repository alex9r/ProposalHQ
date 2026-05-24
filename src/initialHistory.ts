import { InnovationIdea, SimulationPayload } from "./types";

const CUSTOMER_FEEDBACK_PAYLOAD: SimulationPayload = {
  regulatory: {
    status: "Pass",
    flagged_rule: "None",
    citation: "None",
    admin_review_required: false,
    precedent_mapping: [
      {
        id: "FIN-INV-1008",
        description: "NLP tool to summarize overnight filings for wealth management.",
        status: "Approved",
        warning: ""
      },
      {
        id: "FIN-INV-1010",
        description: "Automated dashboard consolidating supply chain metrics for commercial lending.",
        status: "Approved",
        warning: ""
      },
      {
        id: "FIN-INV-1012",
        description: "Smart contract deployment for internal vendor invoice settlement.",
        status: "Exception Granted",
        warning: ""
      }
    ],
    approval_probability: 92,
    legal_review_time: 21,
    legislation_forecasting: "This secure customer feedback tool represents extremely minor risk to banking systems. Running on standard approved infrastructure (React and PostgreSQL) with zero fourth-party AI leaks, it fully complies with domestic OSFI B-10 guidelines and will not face regulatory friction.",
    news_bulletin: "In recent fintech compliance news, financial examiners have placed premium security emphasis on web-embedded client widgets to prevent cross-site scripting vulnerabilities and raw database ingestion risks.",
    full_gatekeeper_formatted_text: "### 1. Similar Projects to Yours\n* [FIN-INV-1008] - NLP tool to summarize overnight filings for wealth management.\n* Status: Approved\n\n* [FIN-INV-1010] - Automated dashboard consolidating supply chain metrics for commercial lending.\n* Status: Approved\n\n* [FIN-INV-1012] - Smart contract deployment for internal vendor invoice settlement.\n* Status: Exception Granted\n\n### 2. Historical Approval Probability\n* Estimated Approval Probability: 92%\n* Estimated Legal Review Time: 21 days\n\n### 3. Regulatory & Legislation Forecasting\n* Forecast: This secure customer feedback tool represents extremely minor risk to banking systems. Running on standard approved infrastructure (React and PostgreSQL) with zero fourth-party AI leaks, it fully complies with domestic OSFI B-10 guidelines and will not face regulatory friction.\n\n### 4. Relevant Regulatory News Banner\n* Alert: In recent fintech compliance news, financial examiners have placed premium security emphasis on web-embedded client widgets to prevent cross-site scripting vulnerabilities and raw database ingestion risks."
  },
  technical: {
    approved_tools_to_use: ["React", "PostgreSQL"],
    restricted_access_required: [],
    banned_tools_flagged: [],
    integration_friction_prediction: "Because local database architectures and React frontend stacks are fully pre-approved, IT will clear the deployment automatically inside 15 working days. Expect minimal (0%) integration friction.",
    dlp_governance_check: "DLP Policy Cleared: Proposed web client is sandboxed inside bank network domains, processing Tier 2 (Internal Data). It does not access restricted databases or third-party web endpoints.",
    shadow_it_forecast: "Because standard, high-performance approved paths exist for database feedback collection, the likelihood of staff seeking unsanctioned workarounds is near 0%.",
    hard_block_active: false,
    hard_block_reason: "None",
    security_red_teaming_attack_simulation: "Cybersecurity Red Team Hacker Persona: A basic Web Script Injection target could exist if the feedback input lacks absolute sanitization. A rogue actor could write malformed script payloads simulating client errors.",
    zero_trust_violation_detail: "Zero-Trust Assessment: Satisfies all current micro-segmentation routing requirements. Localized ingress rules are fully segregated back to secure customer interface servers."
  },
  dependency: {
    directly_impacted_nodes: ["Customer_Mobile_App"],
    indirectly_impacted_nodes: ["Core_Database"],
    complexity_score: 2,
    orphaned_process_discovery: "Orphaned Process: Under 10% probability of disrupting adjacent components. The customer feedback form communicates natively with local API controllers, leaving the regulatory database and internal HR roster unaffected.",
    synergy_cannibalization: "Workflow Impact: Excellent synergy with Cluster 1 (Casual Retail) mobile app users who appreciate quick UI enhancements. Prompts real-time interaction without adding friction or task manual loops.",
    mermaid_dependency_graph: "```mermaid\ngraph TD\n  App[Customer Mobile App] -.->|Direct Custom Input| Feedback[Feedback API Controller]\n  Feedback -.->|Secure DB Store| Db[(Core Database)]\n  style App fill:#e0f2fe,stroke:#0284c7\n  style Db fill:#fef3c7,stroke:#d97706\n```"
  },
  adoption_metrics: {
    tech_integration: 2.0,
    workflow_disruption: 1.5,
    regulatory_friction: 1.0,
    target_users: 1250,
    efficiency: 68,
    it_tickets: 43,
    adoption_rate: 91,
    roi: 58400,
    has_called_ml_api: false
  }
};

const NLP_FILINGS_PAYLOAD: SimulationPayload = {
  regulatory: {
    status: "Pass",
    flagged_rule: "None",
    citation: "None",
    admin_review_required: false,
    precedent_mapping: [
      {
        id: "FIN-INV-1008",
        description: "NLP tool to summarize overnight filings for wealth management.",
        status: "Approved",
        warning: ""
      },
      {
        id: "FIN-INV-1010",
        description: "Automated dashboard consolidating supply chain metrics for commercial lending.",
        status: "Approved",
        warning: ""
      }
    ],
    approval_probability: 95,
    legal_review_time: 14,
    legislation_forecasting: "Autonomous summarization on internal enterprise servers posing negligible risks. It satisfies all core compliance directives of domestic and commercial banking. Data remains sovereign and secure.",
    news_bulletin: "Securities compliance directives emphasize transparency in automated wealth advisory tools.",
    full_gatekeeper_formatted_text: "### 1. Similar Projects to Yours\n* [FIN-INV-1008] - NLP tool to summarize overnight filings for wealth management.\n* Status: Approved\n\n### 2. Historical Approval Probability\n* Estimated Approval Probability: 95%\n* Estimated Legal Review Time: 14 days"
  },
  technical: {
    approved_tools_to_use: ["Python", "Google Cloud Vertex AI", "PostgreSQL"],
    restricted_access_required: [],
    banned_tools_flagged: [],
    integration_friction_prediction: "Low friction pathway. Enterprise cloud APIs are configured properly, minimizing IT delays.",
    dlp_governance_check: "DLP Policy Cleared: Processing Tier 2 (Internal Regulatory Filings) with zero customer PII interaction.",
    shadow_it_forecast: "Extremely low probability of workarounds because developer workflows are pre-approved.",
    hard_block_active: false,
    hard_block_reason: "None",
    security_red_teaming_attack_simulation: "Attacker could craft poison inputs inside regulatory filings to trigger text model injection anomalies.",
    zero_trust_violation_detail: "No active microsegmentation violations. Access is strictly compartmentalized to analytics sandbox environments."
  },
  dependency: {
    directly_impacted_nodes: ["Corporate_Compliance_Auditors"],
    indirectly_impacted_nodes: ["Core_Database"],
    complexity_score: 3,
    orphaned_process_discovery: "Orphaned Process: Zero broken links. Handled as independent ingestion feed.",
    synergy_cannibalization: "Workflow Impact: Outstanding synergy with Cluster 2 (Power Wealth) users by providing faster regulatory summary reports.",
    mermaid_dependency_graph: "```mermaid\ngraph TD\n  Auditors[Compliance Auditors] -.->|Ingests Summarized Filings| NLP[NLP Filing Engine]\n  NLP -.->|Reads| Db[(Core Database)]\n  style Auditors fill:#e0f2fe,stroke:#0284c7\n```"
  },
  adoption_metrics: {
    tech_integration: 3.0,
    workflow_disruption: 2.0,
    regulatory_friction: 1.0,
    target_users: 250,
    efficiency: 85,
    it_tickets: 15,
    adoption_rate: 88,
    roi: 125000,
    has_called_ml_api: false
  }
};

const CHATBOT_FAIL_PAYLOAD: SimulationPayload = {
  regulatory: {
    status: "Fail",
    flagged_rule: "Violates Rule_102 Privacy Standards by transmitting financial customer PII to public servers.",
    citation: "REG_RESIDENCY",
    admin_review_required: true,
    precedent_mapping: [
      {
        id: "FIN-INV-1001",
        description: "GenAI retail investment advisor chatbot for Wealth Management.",
        status: "Rejected",
        warning: "Fails explainability requirements for credit decisions (FCRA/ECOA)"
      },
      {
        id: "FIN-INV-1004",
        description: "Biometric voice-print authentication for phone banking.",
        status: "Rejected",
        warning: "Data residency violation (PIPEDA cross-border transfer)"
      }
    ],
    approval_probability: 5,
    legal_review_time: 0,
    legislation_forecasting: "This proposal poses immediate legal blocks. Shipping customer transaction records outside national sovereign borders fails PIPEDA standards and will lead to millions in administrative fines.",
    news_bulletin: "Regulators recently fined two mid-market banks for leaking customer statements through unvetted consumer-facing chatbots.",
    full_gatekeeper_formatted_text: "### 1. Similar Projects to Yours\n* [FIN-INV-1001] - GenAI retail investment advisor chatbot for Wealth Management.\n* Status: Rejected\n* Warning: Fails explainability guidelines."
  },
  technical: {
    approved_tools_to_use: ["React"],
    restricted_access_required: [],
    banned_tools_flagged: ["Public ChatGPT", "Public Generative AI APIs"],
    integration_friction_prediction: "100% friction: Security and compliance will automatically reject this design profile upon entry.",
    dlp_governance_check: "DLP BLOCKED: Bypassing enterprise security boundaries to transmit highly sensitive customer transactional information to public cloud sub-processors.",
    shadow_it_forecast: "If blocked, team members might manually extract transaction logs and input them into personal browser accounts to test prompts.",
    hard_block_active: true,
    hard_block_reason: "HARD BLOCK: Access to unapproved Public Generative AI endpoints is strictly banned for processing standard customer accounts or statement data (Tier 3 PII).",
    security_red_teaming_attack_simulation: "External actors can extract active workspace customer keys directly from public inference history logs due to a lack of backend channel shielding.",
    zero_trust_violation_detail: "This architecture violates Seg-409, transmitting secure ledger transactions to public domains."
  },
  dependency: {
    directly_impacted_nodes: ["Customer_Mobile_App"],
    indirectly_impacted_nodes: ["Core_Database", "IT_Help_Desk"],
    complexity_score: 7,
    orphaned_process_discovery: "Orphaned Process: Bypassing official core database pipelines disrupts audit-trail compliance validation.",
    synergy_cannibalization: "Severe user behavior disruption for Cluster 1 (Casual Retail) who will experience conflicting suggestions and confusing chatbot security prompts.",
    mermaid_dependency_graph: "```mermaid\ngraph TD\n  App[Customer Mobile App] -.->|Unsanitized Data Out| GPT[Public ChatGPT API]\n  GPT -.->|Data Residual Storage| Public[(Unsecured Cloud)]\n  style GPT fill:#ffe4e6,stroke:#f43f5e\n  style Public fill:#ffcccc,stroke:#ff0000\n```"
  },
  adoption_metrics: {
    tech_integration: 7.0,
    workflow_disruption: 6.5,
    regulatory_friction: 9.0,
    target_users: 5000,
    efficiency: 10,
    it_tickets: 450,
    adoption_rate: 15,
    roi: -450000,
    has_called_ml_api: false
  }
};

const MAINFRAME_PAYLOAD: SimulationPayload = {
  regulatory: {
    status: "Maybe",
    flagged_rule: "Bypasses standard dual authentication rules on internal financial systems.",
    citation: "REG_B13",
    admin_review_required: true,
    precedent_mapping: [
      {
        id: "FIN-INV-1005",
        description: "Cloud migration of core banking transaction database for Wealth Management.",
        status: "Approved",
        warning: ""
      },
      {
        id: "FIN-INV-1012",
        description: "Smart contract deployment for internal vendor invoice settlement.",
        status: "Exception Granted",
        warning: ""
      }
    ],
    approval_probability: 58,
    legal_review_time: 45,
    legislation_forecasting: "Will require special executive waiver. Automating workforce payroll transfers between disparate network segments without multi-stage consensus can trigger severe internal operational risk fines.",
    news_bulletin: "OSFI issues strict alert warning financial groups regarding automated system-to-system high-priority database modifications.",
    full_gatekeeper_formatted_text: "### 1. Similar Projects to Yours\n* [FIN-INV-1012] - Smart contract deployment.\n* Status: Exception Granted"
  },
  technical: {
    approved_tools_to_use: ["PostgreSQL"],
    restricted_access_required: ["HR_Employee_Records"],
    banned_tools_flagged: ["Zapier"],
    integration_friction_prediction: "High friction: Requires a 30-day manual IT configuration review to secure API scopes.",
    dlp_governance_check: "DLP Policy Warning: System requests access to highly private HR data (Tier 4 Performance/Salaries). Standard shared automation nodes cannot read these databases unless strict hardware tokens are active.",
    shadow_it_forecast: "Staff may create auxiliary Access sheets of employee emails to bypass high-security access restrictions.",
    hard_block_active: true,
    hard_block_reason: "HARD BLOCK: Shared software automation components are strictly banned from processing TIER 4 (Highly Restricted) employee salary and performance review metrics.",
    security_red_teaming_attack_simulation: "Attacker who gains access to the shared automation workspace can hijack system OAuth tokens to download raw payroll spreadsheets.",
    zero_trust_violation_detail: "Violates active directory segmentation boundaries between internal workforce domains and public cloud tenants."
  },
  dependency: {
    directly_impacted_nodes: ["Core_Database"],
    indirectly_impacted_nodes: ["IT_Help_Desk", "Corporate_Compliance_Auditors"],
    complexity_score: 5,
    orphaned_process_discovery: "Orphaned Process: High failure liability (40% probability). Severing manual payroll validation scripts disrupts EOD reporting controls.",
    synergy_cannibalization: "Good synergy on HR Segment workloads but creates operational friction and excess help-desk tickets during transition phase.",
    mermaid_dependency_graph: "```mermaid\ngraph TD\n  Db[(Core Database)] -.->|Automated Ingress| Safe[(On-premises Ledger)]\n  style Safe fill:#fef3c7,stroke:#d97706\n```"
  },
  adoption_metrics: {
    tech_integration: 5.0,
    workflow_disruption: 4.5,
    regulatory_friction: 6.0,
    target_users: 850,
    efficiency: 52,
    it_tickets: 95,
    adoption_rate: 64,
    roi: 12500,
    has_called_ml_api: false
  }
};

export const INITIAL_PROJECT_PROPOSALS: InnovationIdea[] = [
  {
    id: "prop-customer-widget",
    title: "Customer Mobile Feedback Widget",
    ideaText: "I want to add a secure feedback widget inside our Customer Mobile App using React that pushes customer responses into a PostgreSQL database.",
    timestamp: "2026-05-24T12:00:00.000Z",
    payload: CUSTOMER_FEEDBACK_PAYLOAD,
    isFavorite: true,
    team: "Retail Mobile Core Team"
  },
  {
    id: "prop-nlp-filings",
    title: "Wealth Management NLP Summarizer",
    ideaText: "Automate overnight regulatory filings aggregation using pre-approved LLM embeddings routed to secure Canadian PostgreSQL instances.",
    timestamp: "2026-05-24T10:15:00.000Z",
    payload: NLP_FILINGS_PAYLOAD,
    isFavorite: false,
    team: "Wealth Management Compliance"
  },
  {
    id: "prop-public-chatbot",
    title: "Public Conversational Chatbot Integration",
    ideaText: "I want to add a feature to our banking app where users can ask an AI chatbot to read their statements using the public ChatGPT API to extract spend records.",
    timestamp: "2026-05-23T18:45:00.000Z",
    payload: CHATBOT_FAIL_PAYLOAD,
    isFavorite: true,
    team: "Retail Banking Digital Team"
  },
  {
    id: "prop-payroll-auto",
    title: "Workforce Payroll Service Automation",
    ideaText: "Modify workforce Workday payroll automated records transfer through unvetted cloud webhook platforms into core databases.",
    timestamp: "2026-05-22T09:30:00.000Z",
    payload: MAINFRAME_PAYLOAD,
    isFavorite: false,
    team: "Corporate Human Resources IT"
  }
];
