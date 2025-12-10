"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import handleSaveBtn from "@/utils/handleSaveBtn";
import { useAuth } from "@/lib/auth-context";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

function TicketsPage() {
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [source, setSource] = useState("");
  //   const [priority, setPriority] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    //console.log("Fetching tickets...");
    async function fetchTickets() {
      try {
        const res = await fetch("/api/tickets", { method: "GET" });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to load tickets");
        }

        const data = await res.json();
        //console.log("Data", data);
        setTickets(data.tickets);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTickets();
  }, []);

  function truncate(text: string, maxLength: number): string {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  }

  const handleAnalyze = async () => {
    setLoading(true);
    if (!text || !source || !name) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch("/api/analyze-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, source, name }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Request failed");
      }

      const data = await response.json();
      setResult(data);
      //console.log("AI Result:", data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    //console.log("Result:", result);
    if (!result) return;
    if (!user) {
      setSaveStatus("You must be logged in to save a ticket.");
      return;
    }
    //console.log("ticket:", result);
    //if (user && !user.id) {
    try {
      await handleSaveBtn({
        type: "Ticket",
        userId: String(user.id),
        date: String(result.date ?? ""),
        name: String(result.name),
        text,
        source,
        summary: String(result.summary ?? ""),
        category: String(result.category ?? ""),
        priority: String(result.priority ?? ""),
        team: String(result.team ?? ""),
        suggestedReply: String(result.suggestedReply ?? ""),
        automationIdea: String(result.automationIdea ?? ""),
      });

      toast("Ticket Saved Successfully");

      setSaveStatus("Ticket saved!");
    } catch (err: any) {
      setSaveStatus(err?.message || "Failed to save ticket.");
    }
    // }
  };

  return (
    <div className="w-full relative flex justify-center space-x-35 h-[90vh] items-center">
      <div className="absolute top-4 left-4">
        <Button size="sm" asChild>
          <Link href="/pastTickets">View Past Tickets</Link>
        </Button>
      </div>
      <Card className="w-full max-w-lg h-[72vh]">
        <CardHeader>
          <CardTitle>New AI Ticket Analisys</CardTitle>
          <CardDescription>
            Enter the info below and let AI analyze and organize it for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="createdBy">Created By</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="soucre">Source</Label>
              </div>
              <Select onValueChange={setSource}>
                <SelectTrigger className="w-[10vw]">
                  <SelectValue placeholder="Select a source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Source</SelectLabel>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="text">Ticket Info</Label>
              </div>
              <Textarea
                className="w-[24vw] h-[32vh] resize-none"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter ticket main text here..."
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2 ">
          <Button
            className="cursor-pointer w-full"
            onClick={handleAnalyze}
            disabled={loading || !text || !source || !name}
          >
            AI Analyze Ticket
          </Button>
        </CardFooter>
      </Card>
      <div className="w-20 h-6 flex items-center justify-center">
        {loading ? (
          <div className="flex space-x-12">
            <div className="loader"></div>
            <div className="loader"></div>
          </div>
        ) : null}
      </div>
      <Card className="w-full max-w-lg h-[74vh]">
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
                  <Label htmlFor="summary">
                    <b>Summary</b>
                  </Label>
                  {result.summary}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">
                    <b>Category</b>
                  </Label>
                  {result.category}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="priority">
                    <b>Priority</b>
                  </Label>
                  {result.priority}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="team">
                    <b>Team</b>
                  </Label>
                  {result.team}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="suggestedReply">
                    <b>Suggested Reply</b>
                  </Label>
                  {result.suggestedReply}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="automationIdea">
                    <b>Automation Idea</b>
                  </Label>
                  {result.automationIdea}
                </div>
              </div>
            ) : (
              <div className="w-full h-[63vh] bg-gray-100 rounded-xl">
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
                          You haven&apos;t created any ticket yet. Get started
                          by creating your ticket to the left.
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
  );
}

export default TicketsPage;
