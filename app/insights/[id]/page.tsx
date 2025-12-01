import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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
];

function InsightDetailPage() {
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
            <BreadcrumbLink href="/pastInsights">Past Insights</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Insight Details</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1>Insight Details</h1>

      <p>
        <b>Date:</b> {AIInsightsresults[0].date}
      </p>
      <p>
        <b>Category:</b> {AIInsightsresults[0].overallSummary}
      </p>
      <p>
        <b>Priority:</b> {AIInsightsresults[0].recurringIssues}
      </p>
      <p>
        <b>Team:</b> {AIInsightsresults[0].automationIdeas}
      </p>
      <p>
        <b>Suggested Reply:</b> {AIInsightsresults[0].suggestedFaqs}
      </p>
    </div>
  );
}
export default InsightDetailPage;
