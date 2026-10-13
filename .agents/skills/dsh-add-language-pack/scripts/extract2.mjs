import { readFileSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
const sp = process.argv[2]
const res = JSON.parse(readFileSync(sp + '/dicts.json', 'utf8'))
const m = await import(pathToFileURL(sp + '/agent-preset-locales.ts').href)
res['settings.agentPreset'] = { file: 'packages/client/ui-agent-preset/src/client/locales.ts', en: { ...m.en }, zh: { ...m.zh } }
// directory-picker inline dictionary
res['directory-browser'] = { file: 'packages/client/ui-directory-picker-browse/src/client/index.ts', zh: {}, en: {
 'browser.title': 'Select Workspace Directory', 'browser.home': 'Home', 'browser.newFolder': 'New folder',
 'browser.folderName': 'Folder name', 'browser.createIn': 'New folder in "{name}"', 'browser.untitledFolder': 'Untitled folder',
 'browser.create': 'Create', 'browser.cancel': 'Cancel', 'browser.open': 'Open', 'browser.editPath': 'Edit path',
 'browser.loading': 'Loading…', 'browser.truncated': 'Too many folders to list; only the beginning is shown.',
 'browser.showHidden': 'Show hidden files' } }
// desktop
const d = await import(pathToFileURL(process.argv[3] + '/apps/desktop/src/locale.ts').href)
res['@desktop'] = { file: 'apps/desktop/src/locale.ts', en: { ...d.en }, zh: { ...d.zh } }
writeFileSync(sp + '/dicts.json', JSON.stringify(res, null, 1))
let t = 0; const rows = []
for (const [k, v] of Object.entries(res)) { const n = Object.keys(v.en).length; t += n; rows.push(k + ':' + n) }
console.log(t, rows.join(' '))
// key set parity check
for (const [k, v] of Object.entries(res)) if (k !== 'directory-browser') {
  const a = Object.keys(v.en).sort().join('|'), b = Object.keys(v.zh).sort().join('|')
  if (a !== b) console.log('PARITY MISMATCH', k)
}
