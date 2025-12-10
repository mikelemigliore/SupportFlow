"use client";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
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
import { Button } from "@/components/ui/button";


const teams = [
  { value: "all", label: "All" },
  { value: "support-tier-1", label: "Support – Tier 1" },
  { value: "support-tier-2", label: "Support – Tier 2" },
  { value: "support-escalations", label: "Support – Escalations" },

  { value: "it-helpdesk", label: "IT – Helpdesk" },
  { value: "it-infrastructure", label: "IT – Infrastructure" },
  { value: "it-security", label: "IT – Security" },
  { value: "it-identity-access", label: "IT – Identity & Access" },

  { value: "sre", label: "SRE – Site Reliability Engineering" },
  { value: "devops", label: "DevOps / Platform Engineering" },
  { value: "cloud-ops", label: "Cloud Operations" },

  { value: "engineering-frontend", label: "Engineering – Frontend" },
  { value: "engineering-backend", label: "Engineering – Backend" },
  { value: "engineering-fullstack", label: "Engineering – Fullstack" },
  { value: "engineering-quality", label: "Engineering – QA" },

  { value: "billing-team", label: "Billing & Finance" },
  { value: "payments-team", label: "Payments" },

  { value: "logistics-team", label: "Logistics & Shipping" },
  { value: "inventory-team", label: "Inventory Management" },
  { value: "procurement-team", label: "Procurement" },
  { value: "supplier-relations", label: "Supplier Relations" },

  { value: "hr-team", label: "Human Resources" },
  { value: "talent-team", label: "HR – Talent & Onboarding" },
  { value: "payroll-team", label: "HR – Payroll" },

  { value: "sales-team", label: "Sales" },
  { value: "marketing-team", label: "Marketing" },
  { value: "customer-success", label: "Customer Success" },

  { value: "legal-team", label: "Legal" },
  { value: "compliance-team", label: "Compliance" },
];



type SortMode = "date_desc" | "date_asc";
type TeamFilter = "all" | (typeof teams)[number]["value"];

function PastComparisonsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("date_desc");
  const [teamFilter, setTeamFilter] = useState<TeamFilter>("all");
  const [rawWorkflow, setRawWorkflow] = useState<any[]>([]);

  const getTeamLabelFromValue = (value: TeamFilter) => {
    if (value === "all") return null;
    const match = teams.find((t) => t.value === value);
    return match?.label;
  };

  useEffect(() => {
    async function fetchWorkflow() {
      try {
        const res = await fetch("/api/workflow", { method: "GET" });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to load workflow");
        }

        const data = await res.json();
        setRawWorkflow(data.workflow);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchWorkflow();
  }, []);

  const workflow = useMemo(() => {
    // 1 filter by source
    const labelFilter = getTeamLabelFromValue(teamFilter);
    const filtered = rawWorkflow.filter((wf) => {
      if (!labelFilter) return true; // "all"

      const teamA = wf?.team;

      return teamA === labelFilter;
    });
    
    // 2 sort
    return [...filtered].sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();

      if (sortMode === "date_desc") return timeB - timeA;
      if (sortMode === "date_asc") return timeA - timeB;

      // tie-break by date
      return timeB - timeA;
    });
  }, [rawWorkflow, sortMode, teamFilter]);


  return (
    <div>
      <div className="flex p-10 pb-[0vh] space-x-5">
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
        <Select
          value={teamFilter}
          onValueChange={(v) => setTeamFilter(v as TeamFilter)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            {teams.map((team) => (
              <SelectItem key={team.value} value={team.value}>
                {team.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        {!workflow || workflow.length === 0 ? (
          <div className="flex items-center justify-center h-full mt-[20vh]">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <IconFolderCode />
                </EmptyMedia>
                <EmptyTitle>Empty</EmptyTitle>
                <EmptyDescription>
                  You haven&apos;t created any ticket yet. Get started by
                  creating a ticket.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </div>
        ) : (
          <div className="space-y-8 p-10 space-x-5 grid grid-cols-3">
            {workflow.map((result) => (
              <Card className="relative w-[30vw] h-[29vh] py-0 gap-3">
                <CardHeader></CardHeader>
                <CardAction className=""></CardAction>
                <CardContent className="space-y-3 grid grid-cols-2">
                  <div className=" gap-2">
                    <Label htmlFor="date">
                      <b>Date</b>
                    </Label>
                    <p>{result.date}</p>
                  </div>
                  <div className=" gap-2">
                    <Label htmlFor="createdBy">
                      <b>Created By</b>
                    </Label>
                    <p>{result.name}</p>
                  </div>
                  <div className=" gap-2">
                    <Label htmlFor="titleA">
                      <b>Title Workflow A</b>
                    </Label>
                    <p>{result.workflowA[0]?.title}</p>
                  </div>
                 <div className=" gap-2">
                    <Label htmlFor="titleB">
                      <b>Title Workflow B</b>
                    </Label>
                    <p>{result.workflowB[0]?.title}</p>
                  </div>
                  <div className="w-[12vw] gap-2">
                    <Label htmlFor="summary">
                      <b>Summary</b>
                    </Label>
                    <p>
                      {result.summary.length > 100
                        ? result.summary.slice(0, 100) + "..."
                        : result.summary}
                    </p>
                  </div>
                  <div className="absolute bottom-4 right-10">
                    <Button asChild className="cursor-pointer w-[7vw]">
                      <Link href={`workflows/${result.id}`}>View</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default PastComparisonsPage;
