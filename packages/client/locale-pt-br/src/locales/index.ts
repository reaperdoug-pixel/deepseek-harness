/**
 * Namespace table for the pt-BR language pack. Each entry pairs a namespace
 * owned by another client plugin with this pack's dictionary for it; keys and
 * `{placeholder}` names mirror the English dictionary of that namespace.
 */
import { ptBR as agentTeam } from './agent-team.ts'
import { ptBR as approval } from './approval.ts'
import { ptBR as chat } from './chat.ts'
import { ptBR as command } from './command.ts'
import { ptBR as common } from './common.ts'
import { ptBR as conversation } from './conversation.ts'
import { ptBR as cordis } from './cordis.ts'
import { ptBR as deliverables } from './deliverables.ts'
import { ptBR as directoryBrowser } from './directory-browser.ts'
import { ptBR as documentHtml } from './documentHtml.ts'
import { ptBR as documentMarkdown } from './documentMarkdown.ts'
import { ptBR as feedback } from './feedback.ts'
import { ptBR as goal } from './goal.ts'
import { ptBR as job } from './job.ts'
import { ptBR as model } from './model.ts'
import { ptBR as openInApp } from './open-in-app.ts'
import { ptBR as permissionAccess } from './permission-access.ts'
import { ptBR as plan } from './plan.ts'
import { ptBR as pluginManager } from './pluginManager.ts'
import { ptBR as question } from './question.ts'
import { ptBR as reference } from './reference.ts'
import { ptBR as scheduleCatalog } from './schedule-catalog.ts'
import { ptBR as sessionLogDownload } from './session-log-download.ts'
import { ptBR as settings } from './settings.ts'
import { ptBR as settingsAgentPreset } from './settings-agentPreset.ts'
import { ptBR as settingsArchivedSessions } from './settings-archivedSessions.ts'
import { ptBR as settingsLocale } from './settings-locale.ts'
import { ptBR as settingsModels } from './settings-models.ts'
import { ptBR as settingsPermission } from './settings-permission.ts'
import { ptBR as settingsPluginInventory } from './settings-pluginInventory.ts'
import { ptBR as settingsPlugins } from './settings-plugins.ts'
import { ptBR as settingsTheme } from './settings-theme.ts'
import { ptBR as sidebar } from './sidebar.ts'
import { ptBR as sidebarBrowser } from './sidebarBrowser.ts'
import { ptBR as sidebarCodePreview } from './sidebarCodePreview.ts'
import { ptBR as sidebarDocumentPreview } from './sidebarDocumentPreview.ts'
import { ptBR as sidebarFiles } from './sidebarFiles.ts'
import { ptBR as sidebarImage } from './sidebarImage.ts'
import { ptBR as sidebarOffice } from './sidebarOffice.ts'
import { ptBR as sidebarPdf } from './sidebarPdf.ts'
import { ptBR as sidebarRight } from './sidebarRight.ts'
import { ptBR as sidebarTerminal } from './sidebarTerminal.ts'
import { ptBR as skill } from './skill.ts'
import { ptBR as slashMenu } from './slash-menu.ts'
import { ptBR as subagent } from './subagent.ts'
import { ptBR as trajectory } from './trajectory.ts'
import { ptBR as workflowRun } from './workflowRun.ts'
import { ptBR as workspace } from './workspace.ts'

/** One namespace and the pt-BR dictionary this pack registers for it. */
export type NamespaceDictionary = readonly [namespace: string, dictionary: Readonly<Record<string, string>>]

/** Every namespace the pack translates, in registration order. */
export const PT_BR_DICTIONARIES: readonly NamespaceDictionary[] = [
  ['common', common],
  ['settings.locale', settingsLocale],
  ['approval', approval],
  ['chat', chat],
  ['command', command],
  ['conversation', conversation],
  ['deliverables', deliverables],
  ['goal', goal],
  ['slash.menu', slashMenu],
  ['job', job],
  ['feedback', feedback],
  ['model', model],
  ['open-in-app', openInApp],
  ['settings.permission', settingsPermission],
  ['permission.access', permissionAccess],
  ['plan', plan],
  ['pluginManager', pluginManager],
  ['reference', reference],
  ['schedule.catalog', scheduleCatalog],
  ['settings', settings],
  ['settings.models', settingsModels],
  ['settings.pluginInventory', settingsPluginInventory],
  ['settings.plugins', settingsPlugins],
  ['settings.archivedSessions', settingsArchivedSessions],
  ['settings.agentPreset', settingsAgentPreset],
  ['settings.theme', settingsTheme],
  ['sidebar', sidebar],
  ['sidebarBrowser', sidebarBrowser],
  ['sidebarCodePreview', sidebarCodePreview],
  ['documentHtml', documentHtml],
  ['sidebarImage', sidebarImage],
  ['sidebarDocumentPreview', sidebarDocumentPreview],
  ['documentMarkdown', documentMarkdown],
  ['sidebarOffice', sidebarOffice],
  ['sidebarPdf', sidebarPdf],
  ['sidebarFiles', sidebarFiles],
  ['sidebarRight', sidebarRight],
  ['sidebarTerminal', sidebarTerminal],
  ['skill', skill],
  ['subagent', subagent],
  ['trajectory', trajectory],
  ['question', question],
  ['workflowRun', workflowRun],
  ['workspace', workspace],
  ['agent-team', agentTeam],
  ['cordis', cordis],
  ['session-log-download', sessionLogDownload],
  ['directory-browser', directoryBrowser],
]
