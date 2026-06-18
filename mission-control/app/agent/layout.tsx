import Sidebar from "@/components/Sidebar";

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <div className="aurora" />
      <div className="grid-overlay" />
      <div className="relative z-10 flex h-full">
        <Sidebar />
        <main className="flex-1 min-w-0 flex flex-col">{children}</main>
      </div>
    </div>
  );
}
