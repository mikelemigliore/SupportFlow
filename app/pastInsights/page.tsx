import Link from "next/link";
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

function PastInsightsPage() {
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
      <div>
        {!AIInsightsresults || AIInsightsresults.length === 0 ? (
          <p> No past AI tickets results</p>
        ) : (
          <div className="space-y-10">
            {AIInsightsresults.map((result) => (
              <div className="border-5 border-blue-500" key={result.id}>
                <p>{result.date}</p>
                <p>{result.overallSummary}</p>
                <p>{result.recurringIssues}</p>
                <p>{result.automationIdeas}</p>
                <p>{result.suggestedFaqs}</p>
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
