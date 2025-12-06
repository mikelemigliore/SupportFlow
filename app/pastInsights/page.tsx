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
import { useEffect, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  {
    id: 2,
    date: "11/29/2025, 02:40 PM",
    overallSummary:
      "Several users reported slow application performance during peak hours, causing workflow delays.",
    recurringIssues:
      "High server load between 2–5 PM. Slow database queries leading to long loading times.",
    automationIdeas:
      "Add auto-scaling rules to handle traffic spikes. Implement query optimization alerts when queries exceed a response-time threshold.",
    suggestedFaqs:
      "Why is the app slow during certain hours? How does the system scale during high-traffic periods?",
  },
  {
    id: 3,
    date: "11/29/2025, 12:25 PM",
    overallSummary:
      "Users are experiencing issues with email notifications not being delivered or arriving late.",
    recurringIssues:
      "Email queue delays. Incorrect email configurations for some users.",
    automationIdeas:
      "Enable automated email queue monitoring. Add a configuration validation tool for user email settings.",
    suggestedFaqs:
      "Why am I not receiving emails? How do I verify my notification settings?",
  },
  {
    id: 4,
    date: "11/29/2025, 11:10 AM",
    overallSummary:
      "Multiple tickets describe issues with failed file uploads, especially large documents over 20MB.",
    recurringIssues:
      "Upload timeouts for large files. Browser-based upload limits being exceeded.",
    automationIdeas:
      "Introduce background uploads with resumable support. Implement pre-upload validation and compression suggestions.",
    suggestedFaqs:
      "How large of a file can I upload? What should I do if my upload fails?",
  },
  {
    id: 5,
    date: "11/29/2025, 09:50 AM",
    overallSummary:
      "Customers are frequently asking about subscription renewals and unexpected charges.",
    recurringIssues:
      "Confusion about auto-renewal settings. Lack of clear invoice breakdowns.",
    automationIdeas:
      "Automatically generate detailed renewal reminders. Add a billing breakdown tool to the user dashboard.",
    suggestedFaqs:
      "How do subscription renewals work? Why was I charged this amount?",
  },
];

interface InsightsProps {
  id: string;
  date: string;
  overallSummary: string;
  recurringIssues: string;
  automationIdeas: string;
  suggestedFaqs: string;
  createdAt: Date;
  userId: string;
}

type SortMode = "date_desc" | "date_asc" | "priority_desc" | "priority_asc";

function PastInsightsPage() {
  //const [insights, setInsights] = useState<InsightsProps[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("date_desc");
  const [rawInsights, setRawInsights] = useState<any[]>([]);

  useEffect(() => {
    //console.log("Fetching workflow...");
    async function fetchInsights() {
      try {
        const res = await fetch("/api/insight", { method: "GET" });
        //console.log("res", res);
        if (!res.ok) {
          const data = await res.json();
          //console.log("Data", data);
          throw new Error(data.error || "Failed to load insight");
        }

        const data = await res.json();
        //console.log("Data", data);
        setRawInsights(data.insight);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchInsights();
  }, []);

  const insights = useMemo(() => {
    // 2) sort
    return rawInsights.sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();

      if (sortMode === "date_desc") return timeB - timeA;
      if (sortMode === "date_asc") return timeA - timeB;

      // tie-break by date (newest first)
      return timeB - timeA;
    });
  }, [rawInsights, sortMode]);

  return (
    <div>
      <Breadcrumb>
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
            <BreadcrumbPage>Past Insights</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1>Past Insights</h1>
      <Select
        value={sortMode}
        onValueChange={(v) => setSortMode(v as SortMode)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Sort</SelectLabel>
            <SelectItem value="date_desc">Newest first</SelectItem>
            <SelectItem value="date_asc">Oldest first</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <div>
        {!insights || insights.length === 0 ? (
          <p> No past AI tickets results</p>
        ) : (
          <div className="space-y-10">
            {insights.map((result) => (
              <div className="border-5 border-blue-500" key={result.id}>
                <p>{result.date}</p>
                <p>{result.overallSummary}</p>
                {/* <p className="whitespace-pre-line">
                  {" "}
                  <b>{`Recurring Issues:\n`}</b> {result.recurringIssues}
                </p>
                <p className="whitespace-pre-line">
                  {" "}
                  <b>{`Automation Ideas:\n`}</b> {result.automationIdeas}
                </p>
                <p className="whitespace-pre-line">
                  {" "}
                  <b>{`Suggested FAQS:\n`}</b> {result.suggestedFaqs}
                </p> */}
                <div>
                  <Link href={`insights/${result.id}`}>View</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default PastInsightsPage;
