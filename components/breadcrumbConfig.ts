
export type Crumb = { label: string; href?: string };

export const ROUTE_CRUMBS: Record<string, Crumb[]> = {
  "/dashboard": [{ label: "Dashboard" }],

  "/tickets": [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Tickets", href: "/tickets" },
  ],

  "/tickets/[id]": [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Tickets", href: "/tickets" },
    { label: "Past Tickets", href: "/pastTickets" },
    { label: "Ticket Details" },
  ],

  "/workflows": [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Workflows", href: "/workflows" },
  ],

  "/workflows/[id]": [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Workflows", href: "/workflows" },
    { label: "Past Comparisons", href: "/pastComparisons" },
    { label: "Workflow Details" },
  ],

  "/insights": [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Insights", href: "/insights" },
  ],

  "/insights/[id]": [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Insights", href: "/insights" },
    { label: "Insight Details" },
  ],

  "/pastTickets": [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Tickets", href: "/tickets" },
    { label: "Past Tickets", href: "/pastTickets" },
  ],

  "/pastTickets/[id]": [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Tickets", href: "/tickets" },
    { label: "Past Tickets", href: "/pastTickets" },
    { label: "Ticket Details" },
  ],

  "/pastComparisons": [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Workflows", href: "/workflows" },
    { label: "Past Comparisons", href: "/pastComparisons" },
  ],

  "/pastComparisons/[id]": [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Workflows", href: "/workflows" },
    { label: "Past Comparisons", href: "/pastComparisons" },
    { label: "Comparison Details" },
  ],

  "/pastInsights": [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Insights", href: "/insights" },
    { label: "Past Insights", href: "/pastInsights" },
  ],

  "/pastInsights/[id]": [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Insights", href: "/insights" },
    { label: "Past Insights", href: "/pastInsights" },
    { label: "Insights Details" },
  ],
};

const PATTERN_BASES = new Set([
  "/tickets",
  "/workflows",
  "/insights",
  "/pastTickets",
  "/pastComparisons",
  "/pastInsights",
]);

export function normalizePath(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean); 

  if (parts.length >= 2) {
    const base = "/" + parts.slice(0, -1).join("/"); 
    const last = parts[parts.length - 1];

    if (PATTERN_BASES.has(base) && last !== "new") {
      return `${base}/[id]`;
    }
  }

  return pathname;
}
