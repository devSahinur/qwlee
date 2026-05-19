// Admin shell. Sidebar + sticky topbar + scrollable content area.
// Responsive: at <lg the sidebar becomes a slide-over.

import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="min-h-screen bg-ink-50/60 flex">
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onOpenMobileSidebar={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 animate-fadeIn">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
