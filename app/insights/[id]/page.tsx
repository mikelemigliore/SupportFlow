"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import handleDeleteTicketBtn from "@/utils/handleDeleteTicketBtn";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

const AIInsightsresults = [
  {
    id: 1,
    date: "11/29/2025, 03:58 PM",
    overallSummary:
      "The tickets mainly report issues related to delayed order processing and frequent VPN disconnections experienced by employees.",
    recurringIssues:
      "Delayed order processing leading to customer dissatisfaction. Frequent VPN disconnections affecting employee productivity.",
    automationIdeas:
      "Implement an automated order status update system to inform customers of their order progress. Create a monitoring tool to proactively identify and resolve VPN connectivity issues.",
    suggestedFaqs:
      "How to check the status of your order? What to do if your VPN keeps disconnecting?",
  },
];

interface Insight {
  id: string;
  userId: string;
  nameInsight:string;
  date: string;
  overallSummary: string;
  recurringIssues: string;
  automationIdeas: string;
  suggestedFaqs: string;
}

function InsightDetailPage() {
  const [insight, setInsight] = useState<Insight>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    async function fetchTickets() {
      try {
        const res = await fetch("/api/insight", { method: "GET" });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to load insight");
        }

        const data = await res.json();
        //console.log("Data insight:", data);
        const found = data.insight.find((t: Insight) => t.id === id);
        //console.log("Found insight:", found);

        if (!found) {
          setError("Insight not found");
        } else {
          setInsight(found);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTickets();
  }, [id]);

  useEffect(() => {
    if (deleted) {
      const timer = setTimeout(() => {
        router.push("/pastInsights");
      }, 2000); // 2 second delay

      return () => clearTimeout(timer); // cleanup
    }
    setDeleted(false);
  }, [deleted]);

  const handleDeleteTicket = async () => {
    //console.log("Result:", ticket);
    if (!insight) return;

    try {
      await handleDeleteTicketBtn({
        type: "insight",
        id: String(insight.id),
        userId: String(insight.userId),
        // date: String(ticket.date ?? ""),
        // text: String(ticket.text ?? ""),
        // source: String(ticket.source ?? ""),
        // summary: String(ticket.summary ?? ""),
        // category: String(ticket.category ?? ""),
        // priority: String(ticket.priority ?? ""),
        // team: String(ticket.team ?? ""),
        // suggestedReply: String(ticket.suggestedReply ?? ""),
        // automationIdea: String(ticket.automationIdea ?? ""),
      });
      setDeleted(true);

      // router.push("/pastTickets");
    } catch (err: any) {
      console.error(err?.message || "Failed to save insight.");
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
            <BreadcrumbLink href="/insights">Insights</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/pastInsights">Past Insights</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Insight Details</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb> */}
      <h1>Insight Details</h1>

      <p>
        <b>Date:</b> {insight?.date}
      </p>
      <p>
        <b>Created By:</b> {insight?.nameInsight}
      </p>
      <p className="whitespace-pre-line">
        {" "}
        <b>{`Recurring Issues:\n`}</b> {insight?.recurringIssues}
      </p>
      <p className="whitespace-pre-line">
        {" "}
        <b>{`Automation Ideas:\n`}</b> {insight?.automationIdeas}
      </p>
      <p className="whitespace-pre-line">
        {" "}
        <b>{`Suggested FAQS:\n`}</b> {insight?.suggestedFaqs}
      </p>
      <Button onClick={handleDeleteTicket}>Delete insight</Button>
      {deleted && <p>Insight deleted successfully. Redirecting...</p>}
    </div>
  );
}
export default InsightDetailPage;
