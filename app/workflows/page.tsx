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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import handleSaveBtn from "@/utils/handleSaveBtn";
import { useAuth } from "@/lib/auth-context";
import { Label } from "@/components/ui/label";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { IconFolderCode } from "@tabler/icons-react";
import { toast } from "sonner";

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
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const { user } = useAuth();
  const [name, setName] = useState("");

  const handleCompare = async () => {
    setLoading(true);
    try {
      const response = await fetch("api/compare-workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workflowA, workflowB, name }),
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
  };

  const handleSave = async () => {
    if (!result) return;
    if (!user) {
      setSaveStatus("You must be logged in to save a workflow.");
      return;
    }

    try {
      await handleSaveBtn({
        type: "Workflow",
        team: String(result.team ?? ""),
        name: String(result.name),
        bottlenecks: String(result.bottlenecks ?? ""),
        summary: String(result.summary ?? ""),
        keyDifferences: String(result.keyDifferences ?? ""),
        recommendations: String(result.recommendations ?? ""),
        userId: String(user.id),
        date: String(result.date ?? ""),
        workflowA: workflowA,
        workflowB: workflowB,
      });
      toast("Workflow Comparison Saved Successfully");
    } catch (err: any) {
      setSaveStatus(err?.message || "Failed to save workflow.");
    }
  };

  return (
    <div>
      <div className="w-full relative flex justify-start space-x-25 h-[92vh] items-center">
        <div className="absolute top-4 left-4 ml-2">
          <Button size="sm" asChild>
            <Link href={"/pastComparisons"}>View Past Comparisons</Link>
          </Button>
        </div>
        <Card className="w-[46.5vw] h-[72.5vh] ml-25">
          <CardHeader>
            <CardTitle>Workflow Comparison</CardTitle>
            <CardDescription>
              Enter the info below for the two workflows, A and B, and let AI
              analyze and compare them.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="flex space-x-5">
                <div className="grid gap-2 w-[10vw]">
                  <Label htmlFor="createdBy">Created By</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="team">Team</Label>
                  </div>
                  <Select
                    onValueChange={
                      (value) =>
                        setWorkflowA((prev) => ({ ...prev, team: value })) //Study better
                    }
                    value={workflowA.team}
                  >
                    <SelectTrigger className="w-[10vw]">
                      <SelectValue placeholder="Select a Team" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Teams</SelectLabel>
                        {teams.map((team) => (
                          <SelectItem key={team.value} value={team.value}>
                            {team.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-6">
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="soucre">Optional for A</Label>
                    </div>
                    <div className="flex space-x-3">
                      <Select
                        onValueChange={
                          (value) =>
                            setWorkflowA((prev) => ({
                              ...prev,
                              workflowType: value,
                            })) 
                        }
                        value={workflowA.workflowType}
                      >
                        <SelectTrigger className="w-[9vw]">
                          <SelectValue placeholder="Workflow Types" />
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
                          (value) =>
                            setWorkflowA((prev) => ({ ...prev, system: value })) 
                        }
                        value={workflowA.system}
                      >
                        <SelectTrigger className="w-[9vw]">
                          <SelectValue placeholder="System" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>System</SelectLabel>
                            {systems.map((system) => (
                              <SelectItem
                                key={system.value}
                                value={system.value}
                              >
                                {system.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-9 mt-6">
                <div className="space-y-6">
                  <div className="grid gap-2 w-[20vw]">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      placeholder="Title"
                      value={workflowA.title}
                      onChange={
                        (e) =>
                          setWorkflowA((prev) => ({
                            ...prev,
                            title: e.target.value,
                          })) 
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="text">Workflow A</Label>
                    </div>
                    <Textarea
                      onChange={(e) =>
                        setWorkflowA((prev) => ({
                          ...prev,
                          text: e.target.value,
                        }))
                      }
                      className="w-[20vw] h-[30vh] resize-none"
                      placeholder="Enter workflow here..."
                    />
                  </div>
                </div>
                <div className="h-[41.5vh] w-px bg-gray-300"></div>
                <div className="space-y-6">
                  <div className="grid gap-2 w-[20vw]">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      placeholder="Title"
                      value={workflowB.title}
                      onChange={
                        (e) =>
                          setWorkflowB((prev) => ({
                            ...prev,
                            title: e.target.value,
                          })) 
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="text">Workflow B</Label>
                    </div>
                    <Textarea
                      onChange={(e) =>
                        setWorkflowB((prev) => ({
                          ...prev,
                          text: e.target.value,
                        }))
                      }
                      className="w-[20vw] h-[30vh] resize-none"
                      placeholder="Enter workflow here..."
                    />
                  </div>
                </div>
              </div>
            </div>
            <CardFooter>
              <div className="flex w-full justify-center pt-7">
                <Button
                className="w-[44vw]"
                  disabled={
                    !workflowA.title ||
                    !workflowB.title ||
                    !workflowA.team ||
                    !workflowA.text ||
                    !workflowB.text ||
                    !name
                  }
                  onClick={handleCompare}
                >
                  Compare Workflows
                </Button>
              </div>
            </CardFooter>
          </CardContent>
        </Card>
        <div className="w-20 h-6 flex items-center justify-center">
          {loading ? (
            <div className="flex space-x-12">
              <div className="loader"></div>
              <div className="loader"></div>
            </div>
          ) : null}
        </div>
        <Card className="w-[26vw] h-[72.5vh]">
          <CardHeader>
            <CardTitle>AI Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`max-h-[27vw] ${result ? "overflow-y-auto" : ""}`}>
              {error && <p className="text-red-500 mb-4">{error}</p>}
              {result ? (
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="date">
                      <b>Date</b>
                    </Label>
                    {result.date}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="name">
                      <b>Created By</b>
                    </Label>
                    {result.name}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="team">
                      <b>Team</b>
                    </Label>
                    {result.team}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="summary">
                      <b>High Level Comparison</b>
                    </Label>
                    {result.summary}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="keyDiff">
                      <b>Key Differences</b>
                    </Label>
                    {result.keyDifferences}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="bottlenecks">
                      <b>Bottlenecks</b>
                    </Label>
                    {result.bottlenecks}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="recommendations">
                      <b>Recommendations</b>
                    </Label>
                    {result.recommendations}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="automationIdea">
                      <b>Automation Ideas</b>
                    </Label>
                    {result.automationIdeas}
                  </div>
                </div>
              ) : (
                <div className="w-full h-[60vh] bg-gray-100 rounded-xl">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <Spinner className="size-25" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Empty>
                        <EmptyHeader>
                          <EmptyMedia variant="icon">
                            <IconFolderCode />
                          </EmptyMedia>
                          <EmptyTitle>No Result Yet</EmptyTitle>
                          <EmptyDescription>
                            You haven&apos;t created a comparison yet. Get
                            started by creating it to the left.
                          </EmptyDescription>
                        </EmptyHeader>
                      </Empty>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex-col gap-2 pt-5">
              {result && (
                <Button className="cursor-pointer w-full" onClick={handleSave}>
                  Save
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default WorkflowsPage;
