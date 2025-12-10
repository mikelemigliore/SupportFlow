"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import handleDeleteTicketBtn from "@/utils/handleDeleteTicketBtn";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

interface Ticket {
  id: string;
  name: string;
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
      }, 2000);

      return () => clearTimeout(timer);
    }
    setDeleted(false);
  }, [deleted]);

  if (loading)
    return (
      <div className="flex items-center justify-center my-[30vh]">
        <Spinner className="size-25" />
      </div>
    );
  if (error) return <p className="text-red-500">{error}</p>;
  if (!ticket) return <p>Ticket not found.</p>;

  const handleDeleteTicket = async () => {
    if (!ticket) return;

    try {
      await handleDeleteTicketBtn({
        type: "ticket",
        id: String(ticket.id),
        userId: String(ticket.userId),
      });
      setDeleted(true);
      toast("Ticket Deleted Successfully");
    } catch (err: any) {
      console.error(err?.message || "Failed to save ticket.");
    }
  };

  return (
    <div className="flex justify-center items-center py-20">
      <Card className=" relative w-[60vw] h-[62vh] overflow-y-auto">
        {deleted ? (
          ""
        ) : (
          <CardHeader>
            <CardTitle>{deleted ? "" : `Ticket: ${ticket.id}`}</CardTitle>
            <CardDescription>
              Below you will see all the info available about this ticket.
            </CardDescription>
          </CardHeader>
        )}

        <CardContent>
          {deleted ? (
            <div className="flex items-center justify-center my-[20vh]">
              <Spinner className="size-25" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="gap-3">
                <Label htmlFor="date">
                  <b>Date</b>
                </Label>
                <p>{ticket.date}</p>
              </div>
              <div className="gap-3">
                <Label htmlFor="name">
                  <b>Name</b>
                </Label>
                <p>{ticket.name}</p>
              </div>
              <div className=" gap-3">
                <Label htmlFor="priority">
                  <b>Priority</b>
                </Label>
                <p>{ticket.priority}</p>
              </div>
              <div className=" gap-3">
                <Label htmlFor="category">
                  <b>Category</b>
                </Label>
                <p>{ticket.category}</p>
              </div>
              <div className=" gap-3">
                <Label htmlFor="team">
                  <b>Team</b>
                </Label>
                <p>{ticket.team}</p>
              </div>
              <div className="gap-3">
                <Label htmlFor="summary">
                  <b>Summary</b>
                </Label>
                <p>{ticket.summary}</p>
              </div>
              <div className="gap-3">
                <Label htmlFor="suggestedReply">
                  <b>Suggested Reply</b>
                </Label>
                <p>{ticket.suggestedReply}</p>
              </div>
              <div className="gap-3">
                <Label htmlFor="automationIdea">
                  <b>Automation Idea</b>
                </Label>
                <p>{ticket.automationIdea}</p>
              </div>
              <div className="absolute top-7 right-10">
                <Button
                  className="cursor-pointer w-[7vw]"
                  onClick={handleDeleteTicket}
                >
                  Delete Ticket
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
export default TicketDetailPage;
