"use client";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";

type SectionCardProps = {
  lenghtTickets: number;
  lenghtWorkflows: number;
  lenghtInsights: number;
};

export function SectionCards({
  lenghtTickets,
  lenghtWorkflows,
  lenghtInsights,
}: SectionCardProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
//   const [lenghtTickets, setLenghtTickets] = useState<number>(0);
//   const [lenghtWorkflows, setLenghtWorkflows] = useState<number>(0);
//   const [lenghtInsights, setLenghtInsights] = useState<number>(0);

//   useEffect(() => {
//     //console.log("Fetching tickets...");
//     async function fetchTickets() {
//       try {
//         const resTickets = await fetch(`/api/tickets`, {
//           method: "GET",
//         });

//         const resWorkflows = await fetch(`/api/workflow`, {
//           method: "GET",
//         });

//         const resInsight = await fetch(`/api/insight`, {
//           method: "GET",
//         });

//         const dataTickets = await resTickets.json();
//         //console.log("Data", dataTickets);
//         setLenghtTickets(dataTickets.tickets.length);

//         const dataWorkflows = await resWorkflows.json();
//         //console.log("dataWorkflows", dataWorkflows);
//         setLenghtWorkflows(dataWorkflows.workflow.length);

//         const dataInsights = await resInsight.json();
//         //console.log("dataInsights", dataInsights);
//         setLenghtInsights(dataInsights.insight.length);
//       } catch (err: any) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchTickets();
//   }, []);

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-6">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Tickets</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {lenghtTickets}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Workflows</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {lenghtWorkflows}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown />
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Insights</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {lenghtInsights}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
    </div>
  );
}
