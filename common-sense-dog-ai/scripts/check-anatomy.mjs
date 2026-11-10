#!/usr/bin/env node
/** Every body-map hotspot must point at a topic that exists. A dot that 404s
 *  is worse than no dot — the reader clicks their symptom and lands nowhere. */
import { readFileSync } from 'node:fs'
const anat = readFileSync(new URL('../lib/anatomy.ts', import.meta.url), 'utf8')
const lib = readFileSync(new URL('../lib/library-data.ts', import.meta.url), 'utf8')
const slugs = new Set([...lib.matchAll(/"slug":\s*"([^"]+)"/g)].map(m => m[1]))
const used = [...anat.matchAll(/slug: '([^']+)'/g)].map(m => m[1])
const bad = used.filter(s => !slugs.has(s))
console.log(`  ${used.length} hotspots · ${slugs.size} topics in the library`)
if (bad.length) { console.error(`  ❌ point at missing topics: ${bad.join(', ')}`); process.exit(1) }
console.log('  ✅ every hotspot resolves')
