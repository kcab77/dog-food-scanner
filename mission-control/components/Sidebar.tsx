"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { AGENTS } from "@/lib/agents";
import Avatar from "./Avatar";

export default function Sidebar() {
  const pathname = usePathname();
  const [statuses, setStatuses] = useState<Record<string, boolean>>({});
  const [now, setNow] = useState("");

  useEffect(() => {
    let alive = true;
    async function tick() {
      try {
        const r = await fetch("/api/agents");
        const d = await r.json();
        if (!alive) return;
        const map: Record<string, boolean> = {};
        (d.statuses as { id: string; running: boolean }[]).forEach((s) => (map[s.id] = s.running));
        setStatuses(map);
      } catch {}
    }
    tick();
    const t = setInterval(tick, 3000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  const liveCount = Object.values(statuses).filter(Boolean).length;

  return (
    <aside className="w-[272px] shrink-0 flex flex-col hairline-r" style={{ background: "var(--sidebar)" }}>
      {/* brand */}
      <div className="px-5 pt-5 pb-4 hairline">
        <div className="flex items-center gap-2.5">
          <div className="avatar avatar-sm" style={{ background: "linear-gradient(140deg, var(--violet), var(--cyan))" }}>🛰️</div>
          <div>
            <div className="text-[15px] font-bold tracking-tight">Mission Control</div>
            <div className="text-[11px]" style={{ color: "var(--muted)" }}>{liveCount} live · {now}</div>
          </div>
        </div>
      </div>

      {/* agent list */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        <div className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
          Agents
        </div>
        {AGENTS.map((a) => {
          const href = `/agent/${a.id}`;
          const active = pathname === href;
          const showStatus = a.kind === "server" || a.kind === "shell";
          return (
            <Link key={a.id} href={href} className="block">
              <motion.div
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                className="nav-item relative flex items-center gap-3 px-2.5 py-2"
                style={{ background: active ? "var(--panel-2)" : "transparent" }}
              >
                {active && (
                  <motion.div
                    layoutId="activeBar"
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-full"
                    style={{ background: a.accent, boxShadow: `0 0 10px ${a.accent}` }}
                  />
                )}
                <Avatar agent={a} size="sm" status={showStatus ? !!statuses[a.id] : null} />
                <div className="min-w-0 flex-1">
                  <div className="text-[13.5px] font-medium leading-tight" style={{ color: active ? "var(--text)" : "#d6dbe6" }}>
                    {a.name}
                  </div>
                  <div className="text-[11px] truncate" style={{ color: "var(--muted)" }}>{a.tagline}</div>
                </div>
                {a.configured === false && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-md font-semibold" style={{ background: "rgba(251,191,36,0.14)", color: "var(--amber)" }}>
                    SETUP
                  </span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="px-5 py-4 hairline text-[11px] mono" style={{ color: "var(--muted)", borderTop: "1px solid var(--border)" }}>
        <div>🔒 100% local</div>
        <div className="opacity-70 mt-0.5">Claude via CLI bridge</div>
      </div>
    </aside>
  );
}
