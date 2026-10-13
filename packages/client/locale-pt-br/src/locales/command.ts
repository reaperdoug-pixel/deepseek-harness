/**
 * pt-BR dictionary for the `command` namespace. The `token.*` entries stay the
 * English command names: typed spelling resolves through the registered command
 * name and the built-in zh/en aliases only, so a localized token would not resolve.
 */
export const ptBR = {
  'section.add': 'Adicionar',
  'section.commands': 'Comandos',
  'label.goal': 'Objetivo',
  'label.plan': 'Plano',
  'label.feedback': 'Feedback',
  'label.compact': 'Compactar',
  'label.permission': 'Permissão',
  'label.export': 'Exportar',
  'description.goal': 'Define ou exibe o objetivo de uma tarefa de longa duração',
  'description.plan': 'Entra no modo de plano ou sai dele',
  'description.feedback': 'Registra um feedback sobre esta sessão',
  'description.compact': 'Compacta o histórico mais antigo da conversa',
  'description.permission': 'Troca o preset de permissão (modo sandbox + política de aprovação)',
  'description.export': 'Baixa o log desta sessão como um arquivo ZIP',
  'token.goal': 'goal',
  'token.plan': 'plan',
  'token.feedback': 'feedback',
  'token.compact': 'compact',
  'token.permission': 'permission',
  'token.export': 'export',
  'search.placeholder': 'Pesquisar…',
  'search.aria': 'Filtrar opções',
  'status.loading': 'Carregando opções…',
  'status.applying': 'Aplicando…',
  'status.empty': 'Nenhuma opção',
  'overlay.aria': 'Opções de /{command}',
  'listbox.aria': 'Correspondências de /{command}',
  'notice.attachmentsUnsupported': '/{command} não aceita anexos; remova-os primeiro',
} as const satisfies Record<string, string>
