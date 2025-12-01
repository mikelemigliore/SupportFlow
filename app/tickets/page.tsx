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
import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import handleSaveBtn from "@/utils/handleSaveBtn";
import { useAuth } from "@/lib/auth-context";

type Ticket = {
  id: number;
  date: string;
  summary: string;
  priority: string;
  text: string;
};

const tickets: Ticket[] = [
  {
    id: 1,
    date: "2024-06-01",
    summary: "Order stuck in processing",
    priority: "high",
    text: "Full original text for ticket 1...",
  },
  {
    id: 2,
    date: "2024-15-01",
    summary: "VPN disconnecting",
    priority: "high",
    text: "Full original text for ticket 2...",
  },
  {
    id: 3,
    date: "2024-15-01",
    summary: "VPN disconnecting",
    priority: "high",
    text: "Full original text for ticket 2...",
  },
  {
    id: 4,
    date: "2024-15-01",
    summary: "VPN disconnecting",
    priority: "high",
    text: "Full original text for ticket 2...",
  },
];

function TicketsPage() {
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  //   const [priority, setPriority] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const { user } = useAuth();

  const handleAnalyze = async () => {
    setLoading(true);
    if (!text || !source) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch("/api/analyze-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, source }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Request failed");
      }

      const data = await response.json();
      setResult(data);
      console.log("AI Result:", data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    console.log("Result:", result);
    if (!result) return;
    if (!user) {
      setSaveStatus("You must be logged in to save a ticket.");
      return;
    }
    //console.log("User:", user.id);
    //if (user && !user.id) {
    try {
      await handleSaveBtn({
        userId: String(user.id),
        date: String(result.date ?? ""),
        text,
        source,
        summary: String(result.summary ?? ""),
        category: String(result.category ?? ""),
        priority: String(result.priority ?? ""),
        team: String(result.team ?? ""),
        suggestedReply: String(result.suggestedReply ?? ""),
        automationIdea: String(result.automationIdea ?? ""),
      });
      setSaveStatus("Ticket saved!");
    } catch (err: any) {
      setSaveStatus(err?.message || "Failed to save ticket.");
    }
    // }
  };

  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Ticket Page</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1>Tickets Page</h1>
      <Link href="/pastTickets">Go to Past Tickets</Link>
      <div>
        <h1>New Ticket Analisys</h1>
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
        <div className="w-[30vw]">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter ticket main text here..."
          />
        </div>
        <Button
          className="cursor-pointer"
          onClick={handleAnalyze}
          disabled={loading || !text || !source}
        >
          AI Analyze Ticket
        </Button>
      </div>
      <div>
        <h1>Result</h1>
        <div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {loading && <Spinner className="size-8" />}
          {result && (
            <div className="border rounded p-4 space-y-2">
              <h2 className="font-semibold">AI Analysis</h2>
              <p>
                <b>Date:</b> {result.date}
              </p>
              <p>
                <b>Summary:</b> {result.summary}
              </p>
              <p>
                <b>Category:</b> {result.category}
              </p>
              <p>
                <b>Priority:</b> {result.priority}
              </p>
              <p>
                <b>Team:</b> {result.team}
              </p>
              <p>
                <b>Suggested reply:</b> {result.suggestedReply}
              </p>
              <p>
                <b>Automation idea:</b> {result.automationIdea}
              </p>
              <Button onClick={handleSave}>Save</Button>
              {saveStatus && <p>{saveStatus}</p>}
            </div>
          )}
        </div>
      </div>
      <div>
        <h1>Recent</h1>
        <ScrollArea className="h-[20vh] w-[45vw] rounded-md border">
          <div className="p-4">
            {/* <h4 className="mb-4 text-sm leading-none font-medium">Recent</h4> */}
            <div className="grid grid-cols-4 w-full items-center gap-4">
              <div>
                <h5 className="mb-4 text-sm leading-none font-medium">
                  Priority
                </h5>
              </div>
              <div>
                <h5 className="mb-4 text-sm leading-none font-medium">
                  Summary
                </h5>
              </div>
              <div>
                <h5 className="mb-4 text-sm leading-none font-medium">Date</h5>
              </div>
            </div>

            {!tickets || tickets.length === 0 ? (
              <p>No Recent Tickets</p>
            ) : (
              tickets.map(({ id, priority, date, summary }) => (
                <React.Fragment key={id}>
                  <div className="grid grid-cols-4 w-full items-center gap-4">
                    <div>
                      <p>{priority}</p>
                    </div>
                    <div>
                      <p>{summary}</p>
                    </div>
                    <div>
                      <p>{date}</p>
                    </div>
                    <div>
                      <Link href={`tickets/${id}`}>View</Link>
                    </div>
                  </div>
                  <Separator className="my-2" />
                </React.Fragment>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

export default TicketsPage;
