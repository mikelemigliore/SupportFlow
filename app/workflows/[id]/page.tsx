"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import handleDeleteTicketBtn from "@/utils/handleDeleteTicketBtn";

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
    },
  },
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
  nameWorkflow: string;
  date: string;
  team: string;
  bottlenecks: string;
  highLevelComparison: string;
  keyDifferences: string;
  recommendations: string;
  createdAt: Date;
  userId: string;
  workflowA: WorkflowABProps[];
  workflowB: WorkflowABProps[];
}

function ComparisonDetailPage() {
  const [workflow, setWorkflow] = useState<WorkflowProps>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams<{ id: string }>();
  const [deleted, setDeleted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchWorkflow() {
      try {
        const res = await fetch("/api/workflow", { method: "GET" });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to load workflow");
        }

        const data = await res.json();
        //console.log("Data", data)
        const found = data.workflow.find((t: WorkflowProps) => t.id === id);
        //console.log("Found workflow:", found);

        if (!found) {
          setError("Workflow not found");
          //console.log("Error:", error);
        } else {
          setWorkflow(found);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchWorkflow();
  }, [id]);

  useEffect(() => {
    if (deleted) {
      const timer = setTimeout(() => {
        router.push("/pastComparisons");
      }, 2000); // 2 second delay

      return () => clearTimeout(timer); // cleanup
    }
    setDeleted(false);
  }, [deleted]);

  const handleDeleteWorkflow = async () => {
    //console.log("Result:", ticket);
    if (!workflow) return;

    try {
      //console.log("Workflow", workflow);
      await handleDeleteTicketBtn({
        type: "workflow",
        id: workflow.id, // ✅ this is what your API expects
        userId: workflow.userId, // or remove if not needed
      });
      setDeleted(true);
    } catch (err: any) {
      console.error(err?.message || "Failed to save ticket.");
    }
  };

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
            <BreadcrumbLink href="/pastComparisons">
              Past Comparisons
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{`Comparison Details (ID: ${workflow?.id})`}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb> */}
      <h1>Comparison Details</h1>

      <p>
        <b>Date:</b> {workflow?.date}
      </p>
      <p>
        <b>Created By:</b> {workflow?.nameWorkflow}
      </p>
      <div className="flex justify-between p-4">
        <div>
          <h2>Workflow A</h2>
          <p>
            <b>Name:</b> {workflow?.workflowA[0].title}
          </p>
          <p>
            <b>Team:</b> {workflow?.team}
          </p>
          <p>
            <b>Department:</b> {workflow?.workflowA[0].workflowType || "N/A"}
          </p>
          <p>
            <b>Platform:</b> {workflow?.workflowA[0].system || "N/A"}
          </p>
          <p>
            <b>Steps:</b> {workflow?.workflowA[0].text}
          </p>
        </div>
        <div>
          <h2>Workflow B</h2>
          <p>
            <b>Name:</b> {workflow?.workflowB[0].title}
          </p>
          <p>
            <b>Team:</b> {workflow?.workflowB[0].team}
          </p>
          <p>
            <b>Department:</b> {workflow?.workflowB[0].workflowType || "N/A"}
          </p>
          <p>
            <b>Platform:</b> {workflow?.workflowB[0].system || "N/A"}
          </p>
          <p>
            <b>Steps:</b> {workflow?.workflowB[0].text}
          </p>
        </div>
      </div>
      <h1>
        <b>AI Analysis</b>
      </h1>
      <p>
        <b>High Level Comparison:</b> {workflow?.highLevelComparison}
      </p>
      <p>
        <b>Key Differences:</b> {workflow?.keyDifferences}
      </p>
      <p>
        <b>Bottlenecks:</b> {workflow?.bottlenecks}
      </p>
      <p>
        <b>Recommendations:</b> {workflow?.recommendations}
      </p>
      <Button onClick={handleDeleteWorkflow}>Delete Ticket</Button>
      {deleted && <p>Ticket deleted successfully. Redirecting...</p>}
    </div>
  );
}
export default ComparisonDetailPage;
