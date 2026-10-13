import { pathToFileURL } from 'node:url'
import { writeFileSync } from 'node:fs'
import path from 'node:path'
const root = process.argv[2]
const out = process.argv[3]
const C = 'packages/client/'
const D = '/src/client/'
// [file, namespace, enExport, zhExport]
const sites = [
  [C+'ui-agent-preset'+D+'locales.ts','settings.agentPreset'],
  [C+'ui-approval'+D+'locales.ts','approval'],
  [C+'ui-chat'+D+'locale.ts','chat'],
  [C+'ui-commands'+D+'locales.ts','command'],
  [C+'ui-conversation'+D+'locales.ts','conversation'],
  [C+'ui-deliverables'+D+'locales.ts','deliverables'],
  [C+'ui-goal'+D+'locales.ts','goal'],
  [C+'ui-input-trigger'+D+'locales.ts','slash.menu'],
  [C+'ui-jobs'+D+'locales.ts','job'],
  [C+'ui-message-feedback'+D+'locales.ts','feedback'],
  [C+'ui-model-selection'+D+'locales.ts','model'],
  [C+'ui-open-in-app'+D+'locales.ts','open-in-app'],
  [C+'ui-permission-presets'+D+'locales.ts','settings.permission'],
  [C+'ui-permission-presets'+D+'locales.ts','permission.access','accessEn','accessZh'],
  [C+'ui-plan'+D+'locales.ts','plan'],
  [C+'ui-plugin-manager'+D+'locales.ts','pluginManager'],
  [C+'ui-reference'+D+'locales.ts','reference'],
  [C+'ui-schedule'+D+'locales.ts','schedule.catalog'],
  [C+'ui-settings-general'+D+'locales.ts','settings'],
  [C+'ui-settings-models'+D+'locales.ts','settings.models'],
  [C+'ui-settings-plugin-inventory'+D+'locales.ts','settings.pluginInventory'],
  [C+'ui-settings-plugins'+D+'locales.ts','settings.plugins'],
  [C+'ui-settings-unarchive-sessions'+D+'locales.ts','settings.archivedSessions'],
  [C+'ui-sidebar-browser'+D+'locales.ts','sidebarBrowser'],
  [C+'ui-sidebar-documentpreview'+D+'code/locales.ts','sidebarCodePreview'],
  [C+'ui-sidebar-documentpreview'+D+'html/locales.ts','documentHtml'],
  [C+'ui-sidebar-documentpreview'+D+'image/locales.ts','sidebarImage'],
  [C+'ui-sidebar-documentpreview'+D+'locales.ts','sidebarDocumentPreview'],
  [C+'ui-sidebar-documentpreview'+D+'markdown/locales.ts','documentMarkdown'],
  [C+'ui-sidebar-documentpreview'+D+'office/locales.ts','sidebarOffice'],
  [C+'ui-sidebar-documentpreview'+D+'pdf/locales.ts','sidebarPdf'],
  [C+'ui-sidebar-files'+D+'locales.ts','sidebarFiles'],
  [C+'ui-sidebar-right'+D+'locales.ts','sidebarRight'],
  [C+'ui-sidebar-terminal'+D+'locales.ts','sidebarTerminal'],
  [C+'ui-sidebar'+D+'locales.ts','sidebar'],
  [C+'ui-skill'+D+'locales.ts','skill'],
  [C+'ui-subagent'+D+'locales.ts','subagent'],
  [C+'ui-theme'+D+'locales.ts','settings.theme'],
  [C+'ui-trajectory'+D+'locales.ts','trajectory'],
  [C+'ui-user-questions'+D+'locales.ts','question'],
  [C+'ui-workflow-run'+D+'locales.ts','workflowRun'],
  [C+'ui-workspace'+D+'locales.ts','workspace'],
  ['packages/experimental/client-ui-agent-team/src/client/locales.ts','agent-team'],
  ['packages/extensions/ui-cordis/src/client/locales.ts','cordis'],
  ['packages/session-query/session-log-export/src/client/locales.ts','session-log-download'],
  [C+'locale/src/locales/index.ts','common'],
  [C+'locale/src/locales/settings.ts','settings.locale'],
]
const res = {}
const failures = []
for (const [file, ns, enName = 'en', zhName = 'zh'] of sites) {
  try {
    const m = await import(pathToFileURL(path.join(root, file)).href)
    const en = m[enName], zh = m[zhName]
    if (!en || !zh) throw new Error(`missing exports ${enName}/${zhName}: ${Object.keys(m)}`)
    res[ns] = { file, en: { ...en }, zh: { ...zh } }
  } catch (e) { failures.push([file, String(e.message).split('\n')[0]]) }
}
writeFileSync(out, JSON.stringify(res, null, 1))
console.log('ok', Object.keys(res).length, 'failures', JSON.stringify(failures, null, 1))
let total = 0; for (const v of Object.values(res)) total += Object.keys(v.en).length
console.log('keys', total)
