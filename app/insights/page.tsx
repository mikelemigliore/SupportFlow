"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/lib/auth-context";
import handleSaveBtn from "@/utils/handleSaveBtn";
import {
  Card,
  CardContent,
  CardDescription,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

type TicketForInsight = {
  id: number;
  date: string;
  source: string;
  summary: string;
  priority: string;
  text: string;
};

function InsightsPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedTickets, setSelectedTickets] = useState<number[]>([]);
  const [specificTickets, setSpecificTickets] = useState({
    priority: "",
    source: "",
    quantity: "",
  });
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const { user } = useAuth();
  const [tickets, setTickets] = useState<TicketForInsight[]>([]);
  const [nameCheckbox, setNameCheckbox] = useState("");
  const [nameSpecific, setNameSpecific] = useState("");

  useEffect(() => {
    async function fetchTickets() {
      try {
        const res = await fetch("/api/tickets", { method: "GET" });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to load tickets");
        }

        const data = await res.json();
        setTickets(data.tickets);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTickets();
  }, []);

  const handleAIInsightCheckbox = async (
    selectedTicketData: TicketForInsight[]
  ) => {
    setLoading(true);

    try {
      const response = await fetch("/api/generate-insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tickets: selectedTicketData,
          name: nameCheckbox,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Request failed");
      }

      const data = await response.json();
      console.log("Data Insight", data);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleAIInsightSpecific = async (
    selectedTicketData: TicketForInsight[]
  ) => {
    setLoading(true);

    try {
      const response = await fetch("/api/generate-insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tickets: selectedTicketData,
          name: nameSpecific,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Request failed");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxList = async () => {
    const selectedTicketData = tickets.filter((ticket) =>
      selectedTickets.includes(ticket.id)
    );

    handleAIInsightCheckbox(selectedTicketData);
  };

  const handleSpecificList = () => {
    const results = tickets
      .filter((ticket) => {
        return (
          (!specificTickets.priority ||
            ticket.priority === specificTickets.priority) &&
          (!specificTickets.source || ticket.source === specificTickets.source)
        );
      })
      .slice(0, Number(specificTickets.quantity) || tickets.length);

    handleAIInsightSpecific(results);

  };

  const handleSave = async () => {
    if (!result) return;
    if (!user) {
      setSaveStatus("You must be logged in to save a insight.");
      return;
    }
    try {
      await handleSaveBtn({
        type: "Insight",
        name: String(result.name),
        automationIdeas: String(result.automationIdeas ?? ""),
        summary: String(result.summary ?? ""),
        recurringIssues: String(result.recurringIssues ?? ""),
        suggestedFaqs: String(result.suggestedFaqs ?? ""),
        userId: String(user.id),
        date: String(result.date ?? ""),
      });
      toast("Insight Saved Successfully");
    } catch (err: any) {
      setSaveStatus(err?.message || "Failed to save insight.");
    }
  };

  return (
    <div className="w-full relative md:flex justify-center md:space-x-25 space-y-12 h-[90vh] items-center">
      <div className="absolute md:top-4 md:left-4 top-[-5.5vh] left-4">
        <Button size="sm" asChild>
          <Link href="/pastInsights">View Past Insights</Link>
        </Button>
      </div>
      <div>
        <Card className="md:w-[50vw] md:h-[52vh] mt-15">
          <CardHeader>
            <CardTitle>New AI Insight Analisys</CardTitle>
            <CardDescription>
              Select a range of tickets and let AI get you recommendations and
              automation solutions on common issues.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="createdBy">Created By</Label>
                <Input
                  className="md:w-[10vw] flex"
                  value={nameCheckbox}
                  onChange={(e) => setNameCheckbox(e.target.value)}
                  placeholder="Your Name"
                />
              </div>
              <div className="grid gap-2 md:h-[24vh]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Checkbox</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Summary</TableHead>
                      <TableHead className="">Date</TableHead>
                      <TableHead className=""></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tickets.map(({ id, priority, date, summary, source }) => (
                      <TableRow key={id}>
                        <TableCell className="font-medium">
                          <Checkbox
                            className="cursor-pointer"
                            onClick={() =>
                              setSelectedTickets((prev) =>
                                prev.includes(id)
                                  ? prev.filter((ticketId) => ticketId !== id)
                                  : [...prev, id]
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>{priority}</TableCell>
                        <TableCell>{source}</TableCell>
                        <TableCell>
                          {" "}
                          {summary.length > 55
                            ? summary.slice(0, 55) + "..."
                            : summary}
                        </TableCell>
                        <TableCell className="">{date}</TableCell>
                        <TableCell className="">
                          <Link href={`tickets/${id}`}>View</Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Button
                className="cursor-pointer"
                onClick={handleCheckboxList}
                disabled={selectedTickets.length === 0 || !nameCheckbox}
              >
                Generate AI Insight
              </Button>
            </div>
          </CardContent>
        </Card>
        <div className="flex items-center justify-center my-2">
          <div className="h-px bg-gray-300 flex-1"></div>
          <span className="px-3 text-sm text-muted-foreground">Or</span>
          <div className="h-px bg-gray-300 flex-1"></div>
        </div>
        <div className="">
          <Card className="md:w-[50vw] md:h-[19vh] md:mb-[-4vh]">
            <CardHeader>
              <CardTitle>New AI Insight Analisys</CardTitle>
              <CardDescription>
                Select a range of tickets and let AI get you recommendations and
                automation solutions on common issues.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="md:flex md:space-x-6 space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="createdBy">Created By</Label>
                  <Input
                    className="md:w-[10vw] md:flex w-full"
                    value={nameSpecific}
                    onChange={(e) => setNameSpecific(e.target.value)}
                    placeholder="Your Name"
                  />
                </div>
                <div className="">
                  <div className="grid gap-2">
                    <Label htmlFor="createdBy">Specifics</Label>
                    <div className="md:space-x-3 space-y-3 md:flex">
                      <Select
                        onValueChange={(value) =>
                          setSpecificTickets({
                            ...specificTickets,
                            priority: value,
                          })
                        }
                      >
                        <SelectTrigger className="md:w-[9vw] w-full">
                          <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Priority</SelectLabel>
                            <SelectItem value="low">low</SelectItem>
                            <SelectItem value="medium">medium</SelectItem>
                            <SelectItem value="high">high</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <Select
                        onValueChange={(value) =>
                          setSpecificTickets({
                            ...specificTickets,
                            source: value,
                          })
                        }
                      >
                        <SelectTrigger className="md:w-[9vw] w-full">
                          <SelectValue placeholder="Source" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Source</SelectLabel>
                            <SelectItem value="customer">Costumer</SelectItem>
                            <SelectItem value="employee">Employee</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <Input
                        value={specificTickets.quantity}
                        onChange={(e) =>
                          setSpecificTickets({
                            ...specificTickets,
                            quantity: e.target.value,
                          })
                        }
                        className="md:w-[8vw] w-full"
                        placeholder="Quantity"
                      />
                      <Button
                        className="cursor-pointer w-full md:w-[8.5vw]"
                        onClick={handleSpecificList}
                        disabled={
                          specificTickets.priority === "" ||
                          specificTickets.source === "" ||
                          nameSpecific === ""
                        }
                      >
                        Generate AI Insight
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="md:w-20 h-6 flex items-center justify-center">
        {loading ? (
          <div className="flex space-x-12">
            <div className="loader"></div>
            <div className="loader"></div>
          </div>
        ) : null}
      </div>

      <div>
        <Card className="w-full max-w-lg h-[75vh] md:mb-[-5vh]">
          <CardHeader>
            <CardTitle>AI Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`md:max-h-[27vw] max-h-[58vh] ${result ? "overflow-y-auto" : ""}`}>
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
                    <Label htmlFor="overallSummary:">
                      <b>Overall Summary:</b>
                    </Label>
                    {result.summary}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="recurringIssues">
                      <b>Recurring Issues</b>
                    </Label>
                    {result.recurringIssues}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="automationIdeas">
                      <b>Automation Ideas</b>
                    </Label>
                    {result.automationIdeas}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="suggestedFaqs">
                      <b>Suggested FAQS</b>
                    </Label>
                    {result.suggestedFaqs}
                  </div>
                </div>
              ) : (
                <div className="w-full h-[63vh] bg-gray-100 rounded-xl">
                  {loading ? (
                    <div className="flex md:w-[25vw] w-full items-center justify-center h-full">
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
                            You haven&apos;t created any insight yet. Get
                            started by creating your insight to the left.
                          </EmptyDescription>
                        </EmptyHeader>
                      </Empty>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex-col gap-2 md:pt-9 pt-5">
              {result && (
                <Button className="cursor-pointer w-full" onClick={handleSave}>
                  Save
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default InsightsPage;
