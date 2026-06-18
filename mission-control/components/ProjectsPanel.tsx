"use client";

import { motion } from "motion/react";
import { PROJECTS } from "@/lib/agents";

export default function ProjectsPanel() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
        {PROJECTS.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, type: "spring", stiffness: 240, damping: 22 }}
            whileHover={{ y: -4 }}
            className="glass glow-ring p-5 relative overflow-hidden"
          >
            <div
              className="absolute -top-10 -right-10 h-28 w-28 rounded-full blur-2xl opacity-30"
              style={{ background: p.color }}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `${p.color}22`, color: p.color }}>
                {p.status}
              </span>
              <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
            </div>
            <h3 className="mt-3 font-semibold text-[15px]">{p.name}</h3>
            <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{p.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
