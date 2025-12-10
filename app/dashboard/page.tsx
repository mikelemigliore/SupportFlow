
"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import SideBar from "@/components/sidebar";
import { SectionCards } from "@/components/sectionCard";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";

type Ticket = { createdAt: string  };
type Workflow = { createdAt: string };
type Insight = { createdAt: string };

type ActivityData = {
  tickets: Ticket[];
  workflows: Workflow[];
  insights: Insight[];
};



type ChartData = {
  date: string;
  total: number;
};

function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [Tickets, setTickets] = useState<any[]>([]);
  const [Workflows, setWorkflows] = useState<any[]>([]);
  const [Insights, setInsights] = useState<any[]>([]);
  const [activity, setActivity] = useState<ActivityData>({
    tickets: [],
    workflows: [],
    insights: [],
  });
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [timeRange, setTimeRange] = React.useState("7d");
  const [collective, setCollective] = useState<any[]>([]);

  useEffect(() => {
    async function fetchActivity() {
      try {
        const [resTickets, resWorkflows, resInsight] = await Promise.all([
          fetch("/api/tickets"),
          fetch("/api/workflow"),
          fetch("/api/insight"),
        ]);

        const dataTickets = await resTickets.json();
        setTickets(dataTickets.tickets);
        const dataWorkflows = await resWorkflows.json();
        setWorkflows(dataWorkflows.workflow);
        const dataInsights = await resInsight.json();
        setInsights(dataInsights.insight);

        const combined = [
          ...(dataTickets.tickets ?? []),
          ...(dataWorkflows.workflow ?? []),
          ...(dataInsights.insight ?? []),
        ];

        const sorted = combined.sort(
          (a, b) =>
            new Date(b.createdAt || b.date).getTime() -
            new Date(a.createdAt || a.date).getTime()
        );

        const limited = sorted.slice(0, 20);


        setCollective(limited);

        setActivity({
          tickets: (dataTickets.tickets ?? []).map((t: any) => ({
            createdAt: t.createdAt,
          })),
          workflows: (dataWorkflows.workflow ?? []).map((w: any) => ({
            createdAt: w.createdAt,
          })),
          insights: (dataInsights.insight ?? []).map((i: any) => ({
            createdAt: i.createdAt,
          })),
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchActivity();
  }, []);

  useEffect(() => {
    buildChartData(activity);
  }, [activity]);

  function normalizeTimestampToDay(timestamp: string) {
    return new Date(timestamp).toISOString().split("T")[0]; 
  }

  function buildChartData(activity: ActivityData) {
    const map: Record<string, number> = {};

    const add = (items: { createdAt: string }[] = []) => {
      items.forEach((item) => {
        const day = normalizeTimestampToDay(item.createdAt);
        map[day] = (map[day] || 0) + 1;
      });
    };

    add(activity.tickets);
    add(activity.workflows);
    add(activity.insights);

    const result: ChartData[] = Object.entries(map)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .map(([date, total]) => ({ date, total }));

    setChartData(result);
    return result;
  }

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = Date.now();
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <div>
      <div className="@container/main flex flex-1 flex-col gap-2 ml-64">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards
            lenghtTickets={Tickets.length}
            lenghtWorkflows={Workflows.length}
            lenghtInsights={Insights.length}
          />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive
              filteredData={filteredData}
              timeRange={timeRange}
              setTimeRange={setTimeRange}
            />
          </div>
          <div className="px-4 lg:px-6">
            <h1 className="font-semibold p-2">History</h1>
            <DataTable
              columns={[
                { accessorKey: "id", header: "Ticket ID" },
                { accessorKey: "summary", header: "Summary" },
                { accessorKey: "type", header: "Type" },
                { accessorKey: "date", header: "Date Created" },
                { accessorKey: "name", header: "Created By" },
              ]}
              data={collective}
            />
          </div>
        </div>
      </div>
      <SideBar />
    </div>
  );
}

export default DashboardPage;
