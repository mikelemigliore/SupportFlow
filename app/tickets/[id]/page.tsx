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
import handleDeleteTicketBtn from "@/utils/handleDeleteTicketBtn";
import { useRouter } from "next/navigation";

const AIresults = [
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
];

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

function TicketDetailPage() {
  const [ticket, setTicket] = useState<Ticket>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    async function fetchTickets() {
      try {
        const res = await fetch("/api/tickets", { method: "GET" });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to load tickets");
        }

        const data = await res.json();
        //console.log("Data ticket:", data);
        const found = data.tickets.find((t: Ticket) => t.id === id);
        console.log("Found ticket:", found);

        if (!found) {
          setError("Ticket not found");
        } else {
          setTicket(found);
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
        router.push("/pastTickets");
      }, 2000); // 2 second delay

      return () => clearTimeout(timer); // cleanup
    }
    setDeleted(false);
  }, [deleted]);

  if (loading) return <p>Loading ticket…</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!ticket) return <p>Ticket not found.</p>;

  const handleDeleteTicket = async () => {
    //console.log("Result:", ticket);
    if (!ticket) return;

    try {
      await handleDeleteTicketBtn({
        type: "ticket",
        id: String(ticket.id),
        userId: String(ticket.userId),
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
            <BreadcrumbLink href="/tickets">Tickets Page</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/pastTickets">Past Tickets</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{`Ticket Details (ID: ${id})`}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb> */}
      <h1>Ticket Details</h1>

      <p>
        <b>Date:</b> {ticket.date}
      </p>
      <p>
        <b>Created By:</b> {ticket.nameTicket}
      </p>
      <p>
        <b>Category:</b> {ticket.category}
      </p>
      <p>
        <b>Priority:</b> {ticket.priority}
      </p>
      <p>
        <b>Team:</b> {ticket.team}
      </p>
      <p>
        <b>Suggested Reply:</b> {ticket.suggestedReply}
      </p>
      <p>
        <b>Automation Idea:</b> {ticket.automationIdea}
      </p>
      <Button onClick={handleDeleteTicket}>Delete Ticket</Button>
      {deleted && <p>Ticket deleted successfully. Redirecting...</p>}
    </div>
  );
}
export default TicketDetailPage;
