import { readFileSync } from 'node:fs'
const r = JSON.parse(readFileSync('dicts.json','utf8'))
for (const ns of process.argv.slice(2)) {
  console.log('### ' + ns)
  for (const [k,v] of Object.entries(r[ns].en)) console.log(k + ' = ' + JSON.stringify(v))
}
