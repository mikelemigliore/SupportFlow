"use client";
import Link from "next/link";
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
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { IconFolderCode } from "@tabler/icons-react";

type SortMode = "date_desc" | "date_asc" | "priority_desc" | "priority_asc";
type SourceFilter = "all" | "customer" | "employee" | "system";

function PastTicketsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("date_desc");
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");
  const [rawTickets, setRawTickets] = useState<any[]>([]);

  useEffect(() => {
    async function fetchTickets() {
      try {
        const res = await fetch(`/api/tickets`, {
          method: "GET",
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to load tickets");
        }

        const data = await res.json();
        setRawTickets(data.tickets);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTickets();
  }, []);

  const priorityOrder = { high: 3, medium: 2, low: 1 } as const;

  const tickets = useMemo(() => {
    // 1 filter by source
    const filtered = rawTickets.filter((t) => {
      if (sourceFilter === "all") return true;
      return t.source === sourceFilter;
    });

    // 2 sort
    return [...filtered].sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();

      if (sortMode === "date_desc") return timeB - timeA;
      if (sortMode === "date_asc") return timeA - timeB;

      const pA = priorityOrder[a.priority as keyof typeof priorityOrder];
      const pB = priorityOrder[b.priority as keyof typeof priorityOrder];

      if (pA !== pB) {
        return sortMode === "priority_desc" ? pB - pA : pA - pB;
      }

      return timeB - timeA;
    });
  }, [rawTickets, sortMode, sourceFilter]);

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
              <SelectItem value="priority_desc">
                Priority: high → low
              </SelectItem>
              <SelectItem value="priority_asc">Priority: low → high</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          value={sourceFilter}
          onValueChange={(v) => setSourceFilter(v as SourceFilter)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="customer">Customer</SelectItem>
            <SelectItem value="employee">Employee</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        {!tickets || tickets.length === 0 ? (
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
            {tickets.map((result) => (
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
                    <Label htmlFor="name">
                      <b>Name</b>
                    </Label>
                    <p>{result.name}</p>
                  </div>
                  <div className=" gap-2">
                    <Label htmlFor="priority">
                      <b>Priority</b>
                    </Label>
                    <p>{result.priority}</p>
                  </div>
                  <div className=" gap-2">
                    <Label htmlFor="category">
                      <b>Category</b>
                    </Label>
                    <p>{result.category}</p>
                  </div>
                  <div className="w-[12vw] gap-2">
                    <Label htmlFor="summary">
                      <b>Summary</b>
                    </Label>
                    <p>
                      {result.summary.length > 110
                        ? result.summary.slice(0, 110) + "..."
                        : result.summary}
                    </p>
                  </div>
                  <div className=" gap-2">
                    <Label htmlFor="team">
                      <b>Team</b>
                    </Label>
                    <p>{result.team}</p>
                  </div>
                  <div className="absolute bottom-4 right-10">
                    <Button asChild className="cursor-pointer w-[7vw]">
                      <Link href={`tickets/${result.id}`}>View</Link>
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
export default PastTicketsPage;
