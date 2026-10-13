import { readFileSync, readdirSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
const dir = process.argv[2]
const r = JSON.parse(readFileSync('dicts.json', 'utf8'))
const byFile = Object.fromEntries(Object.keys(r).filter(n => n !== '@desktop').map(n => [n.replaceAll('.', '-'), n]))
const ph = s => [...s.matchAll(/\{(\w+)\}/g)].map(m => m[1]).sort().join(',')
let bad = 0, done = []
for (const f of readdirSync(dir).filter(f => f.endsWith('.ts'))) {
  const base = f.replace(/\.ts$/, ''); const ns = byFile[base]
  if (!ns) { console.log('UNKNOWN FILE', f); bad++; continue }
  const m = await import(pathToFileURL(dir + '/' + f).href)
  const en = r[ns].en, pt = m.ptBR
  done.push(ns)
  for (const k of Object.keys(en)) {
    if (!(k in pt)) { console.log(ns, 'MISSING', k); bad++ }
    else if (ph(en[k]) !== ph(pt[k])) { console.log(ns, 'PLACEHOLDER', k, en[k], '=>', pt[k]); bad++ }
  }
  for (const k of Object.keys(pt)) if (!(k in en)) { console.log(ns, 'EXTRA', k); bad++ }
}
const todo = Object.keys(r).filter(n => n !== '@desktop' && !done.includes(n))
console.log('done', done.length, 'todo', todo.length, 'problems', bad)
console.log('TODO:', todo.join(' '))
