"use client";

import handleDeleteTicketBtn from "@/utils/handleDeleteTicketBtn";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

interface Insight {
  id: string;
  userId: string;
  name: string;
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
        const found = data.insight.find((t: Insight) => t.id === id);

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
      }, 2000); 

      return () => clearTimeout(timer); 
    }
    setDeleted(false);
  }, [deleted]);

  const handleDeleteTicket = async () => {
    if (!insight) return;

    try {
      await handleDeleteTicketBtn({
        type: "insight",
        id: String(insight.id),
        userId: String(insight.userId),
      });
      setDeleted(true);
      toast("Insight Deleted Successfully");

    } catch (err: any) {
      console.error(err?.message || "Failed to save insight.");
    }
  };

  return (
    <div className="flex justify-center items-center py-20">
      <Card className=" relative w-[60vw] h-[52vh] overflow-y-auto">
        {deleted ? (
          ""
        ) : (
          <CardHeader>
            <CardTitle>{deleted ? "" : `Insight: ${insight?.id}`}</CardTitle>
            <CardDescription>
              Below you will see all the info available about this insight.
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
                <p>{insight?.date}</p>
              </div>
              <div className="gap-3">
                <Label htmlFor="name">
                  <b>Name</b>
                </Label>
                <p>{insight?.name}</p>
              </div>
              <div className=" gap-3">
                <Label htmlFor="recurringIssues">
                  <b>Recurring Issues</b>
                </Label>
                <p>{insight?.recurringIssues}</p>
              </div>
              <div className=" gap-3">
                <Label htmlFor="automationIdeas">
                  <b>Automation Ideas</b>
                </Label>
                <p>{insight?.automationIdeas}</p>
              </div>
              <div className=" gap-3">
                <Label htmlFor="suggestedFaqs">
                  <b>Suggested FAQS</b>
                </Label>
                <p>{insight?.suggestedFaqs}</p>
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
export default InsightDetailPage;
