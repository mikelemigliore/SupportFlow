import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const AIComparisonResults = [
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
];

function ComparisonDetailPage() {
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
            <BreadcrumbLink href="/pastComparisons">Past Comparisons</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{`Comparison Details (ID: ${AIComparisonResults[0].id})`}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1>Comparison Details</h1>

      <p>
        <b>Date:</b> {AIComparisonResults[0].date}
      </p>
      <div className="flex justify-between p-4">
        <div>
          <h2>Workflow A</h2>
          <p>
            <b>Name:</b> {AIComparisonResults[0].workflowA.name}
          </p>
          <p>
            <b>Team:</b> {AIComparisonResults[0].workflowA.team}
          </p>
          <p>
            <b>Department:</b>{" "}
            {AIComparisonResults[0].workflowA.optional.department || "N/A"}
          </p>
          <p>
            <b>Platform:</b>{" "}
            {AIComparisonResults[0].workflowA.optional.platform || "N/A"}
          </p>
          <p>
            <b>Steps:</b> {AIComparisonResults[0].workflowA.steps.join(", ")}
          </p>
        </div>
        <div>
          <h2>Workflow B</h2>
          <p>
            <b>Name:</b> {AIComparisonResults[0].workflowB.name}
          </p>
          <p>
            <b>Team:</b> {AIComparisonResults[0].workflowB.team}
          </p>
          <p>
            <b>Department:</b>{" "}
            {AIComparisonResults[0].workflowB.optional.department || "N/A"}
          </p>
          <p>
            <b>Platform:</b>{" "}
            {AIComparisonResults[0].workflowB.optional.platform || "N/A"}
          </p>
          <p>
            <b>Steps:</b> {AIComparisonResults[0].workflowB.steps.join(", ")}
          </p>
        </div>
      </div>
      <h1>
        <b>AI Analysis</b>
      </h1>
      <p>
        <b>High Level Comparison:</b>{" "}
        {AIComparisonResults[0].aiAnalysis.highLevelComparison}
      </p>
      <p>
        <b>Key Differences:</b>{" "}
        {AIComparisonResults[0].aiAnalysis.keyDifferences}
      </p>
      <p>
        <b>Bottlenecks:</b> {AIComparisonResults[0].aiAnalysis.bottlenecks}
      </p>
      <p>
        <b>Recommendations:</b>{" "}
        {AIComparisonResults[0].aiAnalysis.recommendations}
      </p>
      <p>
        <b>automationIdeas:</b>{" "}
        {AIComparisonResults[0].aiAnalysis.automationIdeas}
      </p>
    </div>
  );
}
export default ComparisonDetailPage;
