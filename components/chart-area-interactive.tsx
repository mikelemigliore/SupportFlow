"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useState, useEffect } from "react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export const description = "An interactive area chart";

const chartConfig = {
  activityData: {
    label: "Activity",
  },
  total: {
    label: "total",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

type ChartData = {
  date: string;
  total: number;
};

type Ticket = { createdAt: string /* ... */ };
type Workflow = { createdAt: string /* ... */ };
type Insight = { createdAt: string /* ... */ };

type ActivityData = {
  tickets: Ticket[];
  workflows: Workflow[];
  insights: Insight[];
};

export function ChartAreaInteractive({ activity }: { activity: ActivityData }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = React.useState("7d");
  const [lenghtTickets, setLenghtTickets] = useState<number>(0);
  const [lenghtWorkflows, setLenghtWorkflows] = useState<number>(0);
  const [lenghtInsights, setLenghtInsights] = useState<number>(0);
//   const [activity, setActivity] = useState<ActivityData>({
//     tickets: [],
//     workflows: [],
//     insights: [],
//   });
  const [chartData, setChartData] = useState<ChartData[]>([]);

//   useEffect(() => {
//     async function fetchActivity() {
//       try {
//         const [resTickets, resWorkflows, resInsight] = await Promise.all([
//           fetch("/api/tickets"),
//           fetch("/api/workflow"),
//           fetch("/api/insight"),
//         ]);

//         const dataTickets = await resTickets.json();
//         const dataWorkflows = await resWorkflows.json();
//         const dataInsights = await resInsight.json();

//         setActivity({
//           tickets: (dataTickets.tickets ?? []).map((t: any) => ({
//             createdAt: t.createdAt,
//           })),
//           workflows: (dataWorkflows.workflow ?? []).map((w: any) => ({
//             createdAt: w.createdAt,
//           })),
//           insights: (dataInsights.insight ?? []).map((i: any) => ({
//             createdAt: i.createdAt,
//           })),
//         });
//       } catch (err: any) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchActivity();
//   }, []);

  useEffect(() => {
    buildChartData(activity);
    //console.log("Activity", activity);
  }, [activity]);

  function normalizeTimestampToDay(timestamp: string) {
    //console.log("timestamp", timestamp);
    return new Date(timestamp).toISOString().split("T")[0]; // YYYY-MM-DD
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
    //console.log("date >= startDate",date >= startDate)
    return date >= startDate;
  });

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Activity</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total for the last{" "}
            {timeRange === "90d"
              ? "3 months"
              : timeRange !== "90d" && timeRange !== "30d"
              ? "7 days"
              : "30 days"}
          </span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="filltotal" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-total)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-total)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fi0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--costopOpacity={0.8}" />
                <stop offset="95%" stopColor="var(--costopOpacity={0.1}" />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="total"
              type="natural"
              fill="url(#filltotal)"
              stroke="var(--color-total)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
