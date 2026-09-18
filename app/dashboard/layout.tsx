import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { CommandMenu } from "@/components/layout/command-menu";
import { MobileNav } from "@/components/layout/mobile-nav";
import { DashboardTour } from "@/components/layout/dashboard-tour";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div id="dashboard-root" className="flex h-screen bg-background text-foreground overflow-hidden pb-20 md:pb-0">
      <DashboardTour />
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main id="dashboard-full-page" className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8">
          <div id="dashboard-content-wrapper" className="mx-auto w-full max-w-7xl h-full flex flex-col">
            {children}
          </div>
        </main>
      </div>
      <CommandMenu />
      <MobileNav />
    </div>
  );
}
