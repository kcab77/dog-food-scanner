#!/usr/bin/env node
/** Concern links must resolve. A concern pointing at a missing topic or product
 *  sends the reader to a 404 from the easiest door on the site. */
import { readFileSync } from 'node:fs'
const u = (p) => readFileSync(new URL(p, import.meta.url), 'utf8')
const con = u('../lib/concerns.ts')
const topics = new Set([...u('../lib/library-data.ts').matchAll(/"slug":\s*"([^"]+)"/g)].map(m => m[1]))
const prods  = new Set([...u('../lib/partners.ts').matchAll(/id: '([^']+)'/g)].map(m => m[1]))
const blocks = [...con.matchAll(/topics: \[([^\]]*)\]/g)].flatMap(m => [...m[1].matchAll(/'([^']+)'/g)].map(x => x[1]))
const pblocks = [...con.matchAll(/products: \[([^\]]*)\]/g)].flatMap(m => [...m[1].matchAll(/'([^']+)'/g)].map(x => x[1]))
const badT = [...new Set(blocks.filter(s => !topics.has(s)))]
const badP = [...new Set(pblocks.filter(s => !prods.has(s)))]
console.log(`  ${blocks.length} topic links · ${pblocks.length} product links`)
if (badT.length) { console.error(`  ❌ missing topics: ${badT.join(', ')}`); process.exit(1) }
if (badP.length) { console.error(`  ❌ missing products: ${badP.join(', ')}`); process.exit(1) }
console.log('  ✅ all resolve')
