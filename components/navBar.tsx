
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ROUTE_CRUMBS, normalizePath, Crumb } from "./breadcrumbConfig";
import { IconCirclePlusFilled } from "@tabler/icons-react";

function NavBar() {
  const pathname = usePathname();
  if (!pathname) return null;

  const normalized = normalizePath(pathname);
  let crumbs: Crumb[] = ROUTE_CRUMBS[normalized] ?? [];

  return (
    <header className="flex w-full items-center justify-between px-6 py-3 border-b">
      <Breadcrumb>
        <BreadcrumbList>
          {crumbs.map((crumb, i) => {
            const isLast = i === crumbs.length - 1;

            return (
              <BreadcrumbItem key={i}>
                {!isLast && crumb.href ? (
                  <BreadcrumbLink className="text-lg" href={crumb.href}>
                    {crumb.label}
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className="font-semibold text-lg">
                    {crumb.label}
                  </BreadcrumbPage>
                )}
                {!isLast && <BreadcrumbSeparator />}
              </BreadcrumbItem>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-x-4">
        <Button size="sm">
          <IconCirclePlusFilled />
          <Link href="/tickets">Quick Ticket</Link>
        </Button>
        <Button size="sm">
          <IconCirclePlusFilled />
          <Link href="/workflows">Quick Workflow </Link>
        </Button>
        <Button size="sm">
          <IconCirclePlusFilled />
          <Link href="/insights">Quick Insight</Link>
        </Button>
      </div>
    </header>
  );
}

export default NavBar;
