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
import { useEffect, useState } from "react";

interface Ticket {
  id: string;
  userId: string;
  date: string;
  text: string;
  source: string;
  summary: string;
  category: string;
  priority: string;
  team: string;
  suggestedReply: string;
  automationIdea: string;
}

const AITicketresults = [
  {
    id: 1,
    date: "11/29/2025, 03:30 PM",
    summary:
      "The customer is unable to access their account due to forgetting their password.",
    category: "Access",
    priority: "high",
    team: "Support",
    suggestedReply:
      "Please follow the password reset link to regain access to your account.",
    automationIdea:
      "Implement a self-service password reset feature on the login page.",
  },
  {
    id: 2,
    date: "11/29/2025, 04:10 PM",
    summary:
      "User reports that the system keeps logging them out unexpectedly.",
    category: "Authentication",
    priority: "medium",
    team: "Engineering",
    suggestedReply:
      "We’re sorry for the trouble. Please try clearing your browser cache or switching devices while we investigate.",
    automationIdea:
      "Add automatic session monitoring to detect and resolve abnormal logout behavior.",
  },
  {
    id: 3,
    date: "11/29/2025, 01:05 PM",
    summary:
      "Customer states that their payment was charged twice for the same order.",
    category: "Billing",
    priority: "high",
    team: "Billing",
    suggestedReply:
      "We apologize for the inconvenience. We will review the duplicate charge and issue a refund if applicable.",
    automationIdea:
      "Enable automated duplicate-payment detection to prevent double charges before processing.",
  },
  {
    id: 4,
    date: "11/29/2025, 11:45 AM",
    summary:
      "User cannot upload files larger than 10MB despite the limit being 25MB.",
    category: "Features",
    priority: "medium",
    team: "Engineering",
    suggestedReply:
      "Thank you for reporting this. Our team is reviewing the file upload restriction and will update you shortly.",
    automationIdea:
      "Improve file-size validation to automatically adjust and warn the user instead of blocking uploads.",
  },
  {
    id: 5,
    date: "11/29/2025, 09:20 AM",
    summary:
      "The customer wants to upgrade their plan but is unsure which tier fits their needs.",
    category: "Sales",
    priority: "low",
    team: "Sales",
    suggestedReply:
      "We’d be happy to help you choose the best plan. Could you share how many users and features you expect to use?",
    automationIdea:
      "Add an interactive plan-recommendation tool based on usage and customer responses.",
  },
];

function PastTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("Fetching tickets...");
    async function fetchTickets() {
      try {
        const res = await fetch("/api/tickets", { method: "GET" });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to load tickets");
        }

        const data = await res.json();
        console.log("Data", data);
        setTickets(data.tickets);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTickets();
  }, []);

  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/tickets">Tickets Page</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Past Tickets</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1>Past Tickets</h1>
      <div>
        {!tickets || tickets.length === 0 ? (
          <p> No past AI tickets results</p>
        ) : (
          <div className="space-y-10">
            {tickets.map((result) => (
              <div className="border-5 border-blue-500" key={result.id}>
                <p>{result.summary}</p>
                <p>{result.category}</p>
                <p>{result.priority}</p>
                <p>{result.team}</p>
                <p>{result.suggestedReply}</p>
                <p>{result.automationIdea}</p>
                <div>
                  <Link href={`tickets/${result.id}`}>View</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default PastTicketsPage;
