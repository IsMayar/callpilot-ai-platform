import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export function AppLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-svh bg-background text-foreground">
      <Sidebar className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-sidebar md:flex" />

      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <Sidebar
            className="h-full border-r-0"
            onNavigate={() => setMobileSidebarOpen(false)}
          />
        </SheetContent>
      </Sheet>

      <div className="flex min-h-svh flex-col md:pl-64">
        <Topbar onMenuClick={() => setMobileSidebarOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
