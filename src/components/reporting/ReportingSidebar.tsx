"use client";

import { useReports } from "@/hooks/useReports";
import { SidebarCollapsibleSection, SidebarCollapsibleGroup } from "@/components/shared/SidebarCollapsible";

export function ReportingSidebar() {
  const { reports } = useReports();

  // Filter reports
  const standardReports = reports.filter(r => r.type === "report");
  const templates = reports.filter(r => r.type === "template");

  const publishedReports = standardReports.filter(r => r.status === "published");
  const draftReports = standardReports.filter(r => r.status === "draft");

  const publishedTemplates = templates.filter(r => r.status === "published");
  const draftTemplates = templates.filter(r => r.status === "draft");

  return (
    <div className="w-full py-6 flex flex-col">
      <div className="px-6 mb-6">
        <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider">Document manager</h2>
      </div>

      <div className="px-2">
        <SidebarCollapsibleSection title="Reports" count={standardReports.length} defaultExpanded={true}>
          <SidebarCollapsibleGroup
            title="Published"
            count={publishedReports.length}
            items={publishedReports.map(r => ({ id: r.id, name: r.name, href: `/reporting/view/${r.id}` }))}
            defaultExpanded={true}
          />
          <SidebarCollapsibleGroup
            title="Draft"
            count={draftReports.length}
            items={draftReports.map(r => ({ id: r.id, name: r.name, href: `/reporting/view/${r.id}` }))}
            defaultExpanded={false}
          />
        </SidebarCollapsibleSection>

        <SidebarCollapsibleSection title="Workspace templates" count={templates.length} defaultExpanded={true}>
          <SidebarCollapsibleGroup
            title="Published"
            count={publishedTemplates.length}
            items={publishedTemplates.map(r => ({ id: r.id, name: r.name, href: `/reporting/view/${r.id}` }))}
            defaultExpanded={true}
          />
          <SidebarCollapsibleGroup
            title="Draft"
            count={draftTemplates.length}
            items={draftTemplates.map(r => ({ id: r.id, name: r.name, href: `/reporting/view/${r.id}` }))}
            defaultExpanded={false}
          />
        </SidebarCollapsibleSection>
      </div>
    </div>
  );
}
