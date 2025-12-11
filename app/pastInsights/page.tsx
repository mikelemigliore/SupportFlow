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

type SortMode = "date_desc" | "date_asc" | "priority_desc" | "priority_asc";

function PastInsightsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("date_desc");
  const [rawInsights, setRawInsights] = useState<any[]>([]);

  useEffect(() => {
    async function fetchInsights() {
      try {
        const res = await fetch("/api/insight", { method: "GET" });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to load insight");
        }

        const data = await res.json();
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
    // 2 sort
    return rawInsights.sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();

      if (sortMode === "date_desc") return timeB - timeA;
      if (sortMode === "date_asc") return timeA - timeB;

      // tie-break by date
      return timeB - timeA;
    });
  }, [rawInsights, sortMode]);

  return (
    <div>
      <div className="flex p-10 pb-[0vh] space-x-5">
        <Select
          value={sortMode}
          onValueChange={(v) => setSortMode(v as SortMode)}
        >
          <SelectTrigger className="md:w-[180px] w-full">
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
      </div>

      <div>
        {!insights || insights.length === 0 ? (
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
          <div className="space-y-8 p-10 md:space-x-5 md:grid md:grid-cols-3">
            {insights.map((result) => (
              <Card className="md:relative md:w-[30vw] md:h-[29vh] py-5 gap-3">
                <CardAction className=""></CardAction>
                <CardContent className="md:space-y-6 space-y-4 md:grid md:grid-cols-2 md:pb-0 pb-3">
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
                  <div className="hidden md:block w-[12vw] gap-2">
                    <Label htmlFor="summary">
                      <b>Summary</b>
                    </Label>
                    <p>
                      {result.summary.length > 110
                        ? result.summary.slice(0, 110) + "..."
                        : result.summary}
                    </p>
                  </div>
                  <div className="md:absolute md:bottom-4 md:right-10">
                    <Button
                      asChild
                      className="cursor-pointer md:w-[7vw] w-full"
                    >
                      <Link href={`insights/${result.id}`}>View</Link>
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
export default PastInsightsPage;
