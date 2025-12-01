import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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

function PastComparisonsPage() {
  return (
    <div>
      <Breadcrumb>
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
      </Breadcrumb>
      <h1>Past Comparisons</h1>
      <div>
        {!ComparisonResults || ComparisonResults.length === 0 ? (
          <p> No past AI tickets results</p>
        ) : (
          <div className="space-y-10">
            {ComparisonResults.map((result) => (
              <div className="border-5 border-blue-500" key={result.id}>
                <p>{result.date}</p>
                <p>{result.workflowA.name}</p>
                <p>{result.workflowB.name}</p>
                <p>{result.aiAnalysis.highLevelComparison}</p>
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
