"use client";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useEffect, useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ComparisonResults = [
  {
    id: 1,
    date: "11/29/2025, 04:09 PM",
    workflowA: {
      name: "Password Reset Flow",
      team: "Support – Tier 1",
      optional: {
        department: "Customer Support",
        platform: "Zendesk",
      },
      steps: [
        "Customer submits a 'Can't log in' ticket through Zendesk.",
        "Agent reviews the ticket and verifies the customer email.",
        "Agent opens the internal Identity Portal.",
        "Agent manually triggers a password reset email.",
        "Customer receives the reset email and clicks the link.",
        "Customer completes the reset form.",
        "Agent closes the ticket as 'Resolved'.",
      ],
    },
    workflowB: {
      name: "MFA Password Reset Escalation",
      team: "IT – Security",
      optional: {
        department: "IT Access Request",
        platform: "Okta",
      },
      steps: [
        "Employee submits an access ticket in the internal IT portal.",
        "IT Helpdesk reviews the ticket and checks user identity info.",
        "IT checks MFA status in Okta Admin.",
        "If the MFA device is locked or missing, IT opens an identity verification form.",
        "Agent validates the employee identity using HR database cross-check.",
        "IT unlocks MFA, then resets the password through Okta dashboard.",
        "System sends a forced-password-change email to the employee.",
        "IT agent updates ticket with audit notes and resolves it.",
      ],
    },
    aiAnalysis: {
      highLevelComparison:
        "Workflow A handles customer password resets, while Workflow B handles internal employee MFA resets.",
      keyDifferences:
        "Workflow A is customer-facing through Zendesk, while Workflow B is internal and uses Okta and HR systems. Workflow B adds identity verification complexity and MFA checks.",
      bottlenecks:
        "Workflow A slows down due to manual email verification. Workflow B slows due to HR verification and multiple system dependencies.",
      recommendations:
        "Automate email verification in Workflow A; integrate HR checks into the IT portal for Workflow B.",
      automationIdeas:
        "Trigger automated password reset emails in Workflow A; automate MFA status detection and unlocking in Workflow B.",
    },
  },
  {
    id: 2,
    date: "11/30/2025, 10:22 AM",
    workflowA: {
      name: "New Employee Onboarding",
      team: "HR – Operations",
      optional: {
        department: "Human Resources",
        platform: "Workday",
      },
      steps: [
        "HR enters new hire data into Workday.",
        "HR sends welcome email with onboarding checklist.",
        "Manager receives task to prepare workstation and equipment.",
        "IT creates new user accounts and assigns access based on role.",
        "Facilities prepares badge and office space.",
        "Employee completes onboarding documents in Workday.",
        "HR verifies completion and schedules orientation.",
      ],
    },
    workflowB: {
      name: "Technical Role Onboarding",
      team: "IT – Engineering Support",
      optional: {
        department: "IT Operations",
        platform: "Jira",
      },
      steps: [
        "HR submits a technical role onboarding request through Jira.",
        "Engineering Support reviews required access and permissions.",
        "IT provisions GitHub, AWS, and internal tool accounts.",
        "Security team assigns role-based permissions and MFA tokens.",
        "DevOps creates sandbox and deploy permissions.",
        "Manager approves final access list.",
        "IT closes the Jira onboarding request.",
      ],
    },
    aiAnalysis: {
      highLevelComparison:
        "Workflow A covers general corporate onboarding, while Workflow B is specific to onboarding technical employees.",
      keyDifferences:
        "Workflow A is HR-driven with Workday; Workflow B is IT-driven with Jira and includes developer tools, cloud access, and security processes.",
      bottlenecks:
        "Workflow A delays occur due to manual coordination across departments. Workflow B delays happen when waiting for security approvals or provisioning cloud resources.",
      recommendations:
        "Create an automated checklist to notify teams in Workflow A; auto-assign permissions based on job role templates in Workflow B.",
      automationIdeas:
        "Automate workstation preparation tasks for Workflow A; build a role-based provisioning engine for Workflow B to eliminate repetitive setup steps.",
    },
  },
];

const teams = [
  { value: "all", label: "All" },
  { value: "support-tier-1", label: "Support – Tier 1" },
  { value: "support-tier-2", label: "Support – Tier 2" },
  { value: "support-escalations", label: "Support – Escalations" },

  { value: "it-helpdesk", label: "IT – Helpdesk" },
  { value: "it-infrastructure", label: "IT – Infrastructure" },
  { value: "it-security", label: "IT – Security" },
  { value: "it-identity-access", label: "IT – Identity & Access" },

  { value: "sre", label: "SRE – Site Reliability Engineering" },
  { value: "devops", label: "DevOps / Platform Engineering" },
  { value: "cloud-ops", label: "Cloud Operations" },

  { value: "engineering-frontend", label: "Engineering – Frontend" },
  { value: "engineering-backend", label: "Engineering – Backend" },
  { value: "engineering-fullstack", label: "Engineering – Fullstack" },
  { value: "engineering-quality", label: "Engineering – QA" },

  { value: "billing-team", label: "Billing & Finance" },
  { value: "payments-team", label: "Payments" },

  { value: "logistics-team", label: "Logistics & Shipping" },
  { value: "inventory-team", label: "Inventory Management" },
  { value: "procurement-team", label: "Procurement" },
  { value: "supplier-relations", label: "Supplier Relations" },

  { value: "hr-team", label: "Human Resources" },
  { value: "talent-team", label: "HR – Talent & Onboarding" },
  { value: "payroll-team", label: "HR – Payroll" },

  { value: "sales-team", label: "Sales" },
  { value: "marketing-team", label: "Marketing" },
  { value: "customer-success", label: "Customer Success" },

  { value: "legal-team", label: "Legal" },
  { value: "compliance-team", label: "Compliance" },
];

interface WorkflowABProps {
  id: string;
  workflowsId: string;
  title: string;
  team: string;
  workflowType?: string;
  system?: string;
  text: string;
}

interface WorkflowProps {
  id: string;
  date: string;
  bottlenecks: string;
  highLevelComparison: string;
  keyDifferences: string;
  recommendations: string;
  createdAt: Date;
  userId: string;
  workflowA: WorkflowABProps[];
  workflowB: WorkflowABProps[];
}

type SortMode = "date_desc" | "date_asc";
type TeamFilter = "all" | (typeof teams)[number]["value"];

function PastComparisonsPage() {
  //const [workflow, setWorkflow] = useState<WorkflowProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("date_desc");
  const [teamFilter, setTeamFilter] = useState<TeamFilter>("all");
  const [rawWorkflow, setRawWorkflow] = useState<any[]>([]);

  const getTeamLabelFromValue = (value: TeamFilter) => {
    //console.log("value", value);
    if (value === "all") return null;
    const match = teams.find((t) => t.value === value);
    //console.log("match", match);
    return match?.label;
  };

  useEffect(() => {
    //console.log("Fetching workflow...");
    async function fetchWorkflow() {
      try {
        //console.log("Fetching workflow...");
        const res = await fetch("/api/workflow", { method: "GET" });
        //console.log("res", res);
        if (!res.ok) {
          const data = await res.json();
          //console.log("Data", data);
          throw new Error(data.error || "Failed to load workflow");
        }

        const data = await res.json();
        //console.log("Data", data);
        setRawWorkflow(data.workflow);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchWorkflow();
  }, []);

  const workflow = useMemo(() => {
    // 1) filter by source
    //console.log("teamFilter", teamFilter);
    const labelFilter = getTeamLabelFromValue(teamFilter);
    //console.log("labelFilter", labelFilter);
    const filtered = rawWorkflow.filter((wf) => {
      if (!labelFilter) return true; // "all"

      const teamA = wf?.team;

      //const teamB = wf.workflowB[0]?.team;

      // workflows that involve the selected team on either side
      return teamA === labelFilter;
    });
    // 2) sort
    return [...filtered].sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();

      if (sortMode === "date_desc") return timeB - timeA;
      if (sortMode === "date_asc") return timeA - timeB;

      // tie-break by date (newest first)
      return timeB - timeA;
    });
  }, [rawWorkflow, sortMode, teamFilter]);

  //console.log("Workflow", workflow);

  return (
    <div>
      {/* <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/workflows">Workflows</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Past Comparisons</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb> */}
      <h1>Past Comparisons</h1>
      <Select
        value={sortMode}
        onValueChange={(v) => setSortMode(v as SortMode)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Sort</SelectLabel>
            <SelectItem value="date_desc">Newest first</SelectItem>
            <SelectItem value="date_asc">Oldest first</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select
        value={teamFilter}
        onValueChange={(v) => setTeamFilter(v as TeamFilter)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Source" />
        </SelectTrigger>
        <SelectContent>
          {teams.map((team) => (
            <SelectItem key={team.value} value={team.value}>
              {team.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div>
        {!workflow || workflow.length === 0 ? (
          <p> No past AI tickets results</p>
        ) : (
          <div className="space-y-10">
            {workflow.map((result) => (
              <div className="border-5 border-blue-500" key={result.id}>
                <p>{result.date}</p>
                <p>{result.nameWorkflow}</p>
                <p>{result.workflowA[0]?.title}</p>
                <p>{result.workflowB[0]?.title}</p>
                <p>{result.highLevelComparison}</p>
                <div>
                  <Link href={`workflows/${result.id}`}>View</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default PastComparisonsPage;
