/** pt-BR dictionary for the `sidebarFiles` namespace. */
export const ptBR = {
  'type.label': 'Arquivos',
  'guide.title': 'Arquivos do workspace',
  'guide.description': 'Navegue pelos arquivos do workspace desta sessão',
  'loading': 'Lendo…',
  'empty': 'Diretório vazio',
  'truncated': 'Há entradas demais; exibindo apenas parte delas.',
  'noWorkspace': 'Esta sessão não tem um diretório de workspace.',
  'reload': 'Recarregar',
  'entry.other': 'Não é um arquivo nem um diretório, então não pode ser aberto.',
  'error.notFound': 'Esse diretório não existe mais. Ele pode ter sido movido ou excluído.',
  'error.outsideWorkspace': 'Esse diretório está fora do workspace, então a barra lateral não o lerá.',
  'error.notDirectory': 'Isso não é um diretório.',
  'error.unavailable': 'Falha na leitura: {message}',
} as const satisfies Record<string, string>
