import { SidebarProvider } from "@/components/ui/sidebar";
import { Sidebar } from "./Sidebar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar />
        <main className="flex-1 overflow-auto p-8 bg-background">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}