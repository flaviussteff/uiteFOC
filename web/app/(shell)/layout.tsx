import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { MOCK_ALERTS } from "@/lib/mock/incidents";

/**
 * Every app route renders inside the shell. The right rail is a parallel route
 * slot (`@rail`), so each screen supplies its own rail content without the shell
 * knowing anything about incidents, risk cells or uploads.
 */
export default function ShellLayout({
  children,
  rail,
}: {
  children: ReactNode;
  rail: ReactNode;
}) {
  // TODO(be): replace with the live count from /api/alerts/active.
  return (
    <AppShell rail={rail} alertCount={MOCK_ALERTS.length}>
      {children}
    </AppShell>
  );
}
