import { notFound } from "next/navigation";
import { AGENTS } from "@/lib/agents";
import AgentView from "@/components/AgentView";

export function generateStaticParams() {
  return AGENTS.map((a) => ({ id: a.id }));
}

export default async function AgentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const agent = AGENTS.find((a) => a.id === id);
  if (!agent) notFound();
  return <AgentView agent={agent} />;
}
