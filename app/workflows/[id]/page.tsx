"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import handleDeleteTicketBtn from "@/utils/handleDeleteTicketBtn";
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

interface WorkflowABProps {
  id: string;
  workflowsId: string;
  title: string;
  team: string;
  workflowType?: string;
  system?: string;
  text: string;
}

interface WorkflowProps {
  id: string;
  name: string;
  date: string;
  team: string;
  bottlenecks: string;
  summary: string;
  keyDifferences: string;
  recommendations: string;
  createdAt: Date;
  userId: string;
  workflowA: WorkflowABProps[];
  workflowB: WorkflowABProps[];
}

function ComparisonDetailPage() {
  const [workflow, setWorkflow] = useState<WorkflowProps>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams<{ id: string }>();
  const [deleted, setDeleted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchWorkflow() {
      try {
        const res = await fetch("/api/workflow", { method: "GET" });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to load workflow");
        }

        const data = await res.json();
        const found = data.workflow.find((t: WorkflowProps) => t.id === id);

        if (!found) {
          setError("Workflow not found");
        } else {
          setWorkflow(found);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchWorkflow();
  }, [id]);

  useEffect(() => {
    if (deleted) {
      const timer = setTimeout(() => {
        router.push("/pastComparisons");
      }, 2000);

      return () => clearTimeout(timer);
    }
    setDeleted(false);
  }, [deleted]);

  const handleDeleteWorkflow = async () => {
    if (!workflow) return;

    try {
      await handleDeleteTicketBtn({
        type: "workflow",
        id: workflow.id,
        userId: workflow.userId,
      });
      setDeleted(true);
      toast("Workflow Deleted Successfully");
    } catch (err: any) {
      console.error(err?.message || "Failed to save ticket.");
    }
  };

  return (
    <div>
      <div className="w-full relative md:flex md:justify-start md:space-x-25 space-y-12 h-[92vh] items-center">
        <Card className="md:w-[46.5vw] md:h-[72.5vh] md:ml-25 mt-10">
          {deleted ? (
            ""
          ) : (
            <CardHeader>
              <CardTitle>
                {deleted ? "" : `Workflow: ${workflow?.id}`}
              </CardTitle>
              <CardDescription>
                Below you will see all the info available about this workflow
                comparison.
              </CardDescription>
            </CardHeader>
          )}
          <CardContent>
            {deleted ? (
              <div className="flex items-center justify-center my-[20vh]">
                <Spinner className="size-25" />
              </div>
            ) : (
              <div>
                <div className="flex flex-col gap-6">
                  <div className="md:flex md:space-x-16 space-y-6">
                    <div className="grid gap-2 md:w-[10vw]">
                      <Label htmlFor="date">Date</Label>
                      <p>{workflow?.date}</p>
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="createdBy">Created By</Label>
                      </div>
                      {workflow?.name}
                    </div>
                    <div className="space-y-6">
                      <div className="grid gap-2">
                        <div className="flex items-center">
                          <Label htmlFor="team">Team</Label>
                        </div>
                        {workflow?.team}
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="grid gap-2">
                        <div className="flex items-center">
                          <Label htmlFor="department">Department</Label>
                        </div>
                        {workflow?.workflowA[0].workflowType || "N/A"}
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="grid gap-2">
                        <div className="flex items-center">
                          <Label htmlFor="platform">Platform</Label>
                        </div>
                        {workflow?.workflowA[0].system || "N/A"}
                      </div>
                    </div>
                  </div>
                  <div className="md:flex space-x-9 mt-6">
                    <div className="space-y-6">
                      <div className="grid gap-2 md:w-[20vw] w-full">
                        <Label htmlFor="titleA">Title for A</Label>
                        {workflow?.workflowA[0].title}
                      </div>
                      <div className="grid gap-2 overflow-y-auto">
                        <div className="flex items-center">
                          <Label htmlFor="textA">Workflow A</Label>
                        </div>
                        {workflow?.workflowA[0].text}
                      </div>
                    </div>
                    <div className="md:h-[41.5vh] md:w-px bg-gray-300 h-px w-full my-8 md:my-0"></div>
                    <div className="space-y-6">
                      <div className="grid gap-2 md:w-[20vw] w-full">
                        <Label htmlFor="titleA">Title for B</Label>
                        {workflow?.workflowB[0].title}
                      </div>
                      <div className="grid gap-2 overflow-y-auto">
                        <div className="flex items-center">
                          <Label htmlFor="textB">Workflow B</Label>
                        </div>
                        {workflow?.workflowB[0].text}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="relative md:w-[26vw] md:h-[73.5vh] md:mt-10">
          <CardHeader>
            <CardTitle>AI Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            {deleted ? (
              <div className="flex items-center justify-center my-[20vh]">
                <Spinner className="size-25" />
              </div>
            ) : (
              <div>
                <div
                  className={`md:max-h-[27vw] max-h-[58vh] ${
                    workflow ? "overflow-y-auto" : ""
                  }`}
                >
                  {error && <p className="text-red-500 mb-4">{error}</p>}

                  <div className="flex flex-col gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="highLevelComparison">
                        <b>High Level Comparison</b>
                      </Label>
                      {workflow?.summary}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="keyDifferences">
                        <b>Key Differences</b>
                      </Label>
                      {workflow?.keyDifferences}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="bottlenecks">
                        <b>Bottlenecks</b>
                      </Label>
                      {workflow?.bottlenecks}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="recommendations">
                        <b>Recommendations</b>
                      </Label>
                      {workflow?.recommendations}
                    </div>
                  </div>
                </div>

                <div className="hidden md:block flex-col gap-2 pt-5">
                  <Button
                    className="cursor-pointer w-full"
                    onClick={handleDeleteWorkflow}
                  >
                    Delete Comparison
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <div className="md:hidden p-3 w-full">
          <Button
            className="cursor-pointer w-full"
            onClick={handleDeleteWorkflow}
          >
            Delete Comparison
          </Button>
        </div>
      </div>
    </div>
  );
}
export default ComparisonDetailPage;
