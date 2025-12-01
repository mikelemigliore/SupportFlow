"use client";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const teams = [
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

const systems = [
  { value: "salesforce-service-cloud", label: "Salesforce Service Cloud" },
  { value: "zendesk", label: "Zendesk" },
  { value: "freshdesk", label: "Freshdesk" },
  { value: "hubspot-service-hub", label: "HubSpot Service Hub" },
  { value: "intercom", label: "Intercom" },
  { value: "servicenow", label: "ServiceNow" },
  { value: "jira-service-management", label: "Jira Service Management" },
  { value: "solarwinds", label: "SolarWinds Service Desk" },
  { value: "manageengine", label: "ManageEngine ServiceDesk Plus" },
  { value: "bmc-remedy", label: "BMC Remedy" },

  { value: "jira-software", label: "Jira Software" },
  { value: "github-issues", label: "GitHub Issues" },
  { value: "azure-devops", label: "Azure DevOps Boards" },
  { value: "gitlab-issues", label: "GitLab Issues" },
  { value: "youtrack", label: "YouTrack" },

  { value: "datadog", label: "Datadog" },
  { value: "newrelic", label: "New Relic" },
  { value: "grafana-prometheus", label: "Grafana / Prometheus" },
  { value: "splunk", label: "Splunk" },
  { value: "pagerduty", label: "PagerDuty" },
  { value: "elastic", label: "Elastic (ELK Stack)" },
  { value: "sentry", label: "Sentry" },

  { value: "uipath", label: "UiPath" },
  { value: "automation-anywhere", label: "Automation Anywhere" },
  { value: "blue-prism", label: "Blue Prism" },
  { value: "power-automate", label: "Microsoft Power Automate" },

  { value: "okta", label: "Okta" },
  { value: "azure-ad", label: "Azure Active Directory" },
  { value: "ping-identity", label: "Ping Identity" },
  { value: "auth0", label: "Auth0" },

  { value: "aws", label: "AWS Services" },
  { value: "azure-cloud", label: "Azure Cloud Services" },
  { value: "google-cloud", label: "Google Cloud Platform" },

  { value: "slack", label: "Slack Workflows" },
  { value: "microsoft-teams", label: "Microsoft Teams" },
  { value: "confluence", label: "Confluence" },
  { value: "sharepoint", label: "SharePoint" },
];

const workflowTypes = [
  { value: "customer-support", label: "Customer Support" },
  { value: "technical-support", label: "Technical Support" },
  { value: "billing", label: "Billing & Finance" },
  { value: "complaint-handling", label: "Complaint Handling" },
  { value: "order-troubleshooting", label: "Order Troubleshooting" },
  { value: "warranty-processing", label: "Warranty Processing" },
  { value: "account-management", label: "Account Management" },

  { value: "it-access-request", label: "IT Access Request" },
  { value: "it-hardware", label: "IT Hardware / Laptop" },
  { value: "password-reset", label: "Password Reset" },
  { value: "account-provisioning", label: "Account Provisioning" },
  { value: "software-installation", label: "Software Installation" },
  { value: "network-issues", label: "Network Issues" },
  { value: "it-onboarding", label: "IT Onboarding / Offboarding" },

  { value: "incident-response", label: "Incident Response (SRE)" },
  { value: "outage-mitigation", label: "Outage Mitigation" },
  { value: "oncall-escalation", label: "On-call Escalation" },
  { value: "service-health-check", label: "Service Health Check" },
  { value: "monitoring-alerting", label: "Monitoring & Alerting" },
  { value: "ci-cd", label: "CI/CD Deployment" },
  { value: "root-cause-analysis", label: "Root-Cause Analysis (RCA)" },

  { value: "shipping-logistics", label: "Shipping & Logistics" },
  { value: "inventory-management", label: "Inventory Management" },
  { value: "supplier-onboarding", label: "Supplier Onboarding" },
  { value: "delivery-exceptions", label: "Delivery Exception Handling" },

  { value: "hr-onboarding", label: "HR Onboarding" },
  { value: "payroll-processing", label: "Payroll Processing" },
  { value: "procurement", label: "Procurement" },
  { value: "vendor-approval", label: "Vendor Approval" },
  { value: "document-workflow", label: "Document Workflow" },
];

type WorkflowProps = {
  title: string;
  team: string;
  workflowType?: string;
  system?: string;
  text: string;
};

function WorkflowsPage() {
  const [workflowA, setWorkflowA] = useState<WorkflowProps>({
    title: "",
    team: "",
    workflowType: "",
    system: "",
    text: "",
  });

  const [workflowB, setWorkflowB] = useState<WorkflowProps>({
    title: "",
    team: "",
    workflowType: "",
    system: "",
    text: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCompare = async () => {
    setLoading(true);
    try {
      const response = await fetch("api/compare-workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workflowA, workflowB }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Request failed");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
    // console.log("Compare A:", workflowA);
    // console.log("Compare B:", workflowB);
  };

  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Workflows Page</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1>Workflows Page</h1>
      <Link href={"/pastComparisons"}>View Past Comparisons</Link>
      <div className="flex justify-between p-4">
        <div className="w-[40vw]">
          <h1>Workflow A</h1>
          <Input
            placeholder="Title"
            value={workflowA.title}
            onChange={
              (e) =>
                setWorkflowA((prev) => ({ ...prev, title: e.target.value })) //Study better
            }
          />
          <Select
            onValueChange={
              (value) => setWorkflowA((prev) => ({ ...prev, team: value })) //Study better
            }
            value={workflowA.team}
          >
            <SelectTrigger className="w-[10vw]">
              <SelectValue placeholder="Select a Team" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Source</SelectLabel>
                {teams.map((team) => (
                  <SelectItem key={team.value} value={team.value}>
                    {team.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <h2>Optional</h2>
          <Select
            onValueChange={
              (value) =>
                setWorkflowA((prev) => ({ ...prev, workflowType: value })) //Study better
            }
            value={workflowA.workflowType}
          >
            <SelectTrigger className="w-[10vw]">
              <SelectValue placeholder="Select a Workflow Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Workflow Types</SelectLabel>
                {workflowTypes.map((workflowType) => (
                  <SelectItem
                    key={workflowType.value}
                    value={workflowType.value}
                  >
                    {workflowType.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            onValueChange={
              (value) => setWorkflowA((prev) => ({ ...prev, system: value })) //Study better
            }
            value={workflowA.system}
          >
            <SelectTrigger className="w-[10vw]">
              <SelectValue placeholder="Select a System" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>System</SelectLabel>
                {systems.map((system) => (
                  <SelectItem key={system.value} value={system.value}>
                    {system.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Textarea
            onChange={(e) =>
              setWorkflowA((prev) => ({ ...prev, text: e.target.value }))
            }
            className="w-[40vw] h-[30vh]"
            placeholder="Enter workflow here..."
          />
        </div>
        <div className="">
          <h1>Workflow B</h1>
          <Input
            placeholder="Title"
            value={workflowB.title}
            onChange={
              (e) =>
                setWorkflowB((prev) => ({ ...prev, title: e.target.value })) //Study better
            }
          />
          <Select
            onValueChange={
              (value) => setWorkflowB((prev) => ({ ...prev, team: value })) //Study better
            }
            value={workflowB.team}
          >
            <SelectTrigger className="w-[10vw]">
              <SelectValue placeholder="Select a Team" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Source</SelectLabel>
                {teams.map((team) => (
                  <SelectItem key={team.value} value={team.value}>
                    {team.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <h2>Optional</h2>
          <Select
            onValueChange={
              (value) =>
                setWorkflowB((prev) => ({ ...prev, workflowType: value })) //Study better
            }
            value={workflowB.workflowType}
          >
            <SelectTrigger className="w-[10vw]">
              <SelectValue placeholder="Select a Workflow Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Workflow Types</SelectLabel>
                {workflowTypes.map((workflowType) => (
                  <SelectItem
                    key={workflowType.value}
                    value={workflowType.value}
                  >
                    {workflowType.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            onValueChange={
              (value) => setWorkflowB((prev) => ({ ...prev, system: value })) //Study better
            }
            value={workflowB.system}
          >
            <SelectTrigger className="w-[10vw]">
              <SelectValue placeholder="Select a System" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>System</SelectLabel>
                {systems.map((system) => (
                  <SelectItem key={system.value} value={system.value}>
                    {system.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Textarea
            onChange={(e) =>
              setWorkflowB((prev) => ({ ...prev, text: e.target.value }))
            }
            className="w-[40vw] h-[30vh]"
            placeholder="Enter workflow here..."
          />
        </div>
      </div>
      <div className="flex justify-center mt-8">
        <Button
          disabled={
            !workflowA.title ||
            !workflowB.title ||
            !workflowA.team ||
            !workflowB.team ||
            !workflowA.text ||
            !workflowB.text
          }
          onClick={handleCompare}
        >
          Compare Workflow
        </Button>
      </div>
      <div>
        <h1>Result</h1>
        <div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {loading && <Spinner className="size-8" />}
          {result && (
            <div className="border rounded p-4 space-y-2">
              <h2 className="font-semibold">AI Analysis</h2>
              <p>
                <b>Date:</b> {result.date}
              </p>
              <p>
                <b>High Level Comparison:</b> {result.highLevelComparison}
              </p>
              <p>
                <b>Key Differences:</b> {result.keyDifferences}
              </p>
              <p>
                <b>Bottlenecks:</b> {result.bottlenecks}
              </p>
              <p>
                <b>Recommendations:</b> {result.recommendations}
              </p>
              <p>
                <b>Automation Ideas:</b> {result.automationIdeas}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WorkflowsPage;
