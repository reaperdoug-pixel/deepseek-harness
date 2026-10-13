/** pt-BR dictionary for the `job` namespace. */
export const ptBR = {
  'count.live.one': '{count} job em segundo plano em execução',
  'count.live.other': '{count} jobs em segundo plano em execução',
  'count.idle.one': '{count} job em segundo plano',
  'count.idle.other': '{count} jobs em segundo plano',
  'list.aria': 'Jobs em segundo plano',
  'status.running': 'em execução',
  'status.stopping': 'parando',
  'status.completed': 'concluído',
  'status.killed': 'cancelado',
  'status.failed': 'falhou',
  'duration.seconds': '{seconds}s',
  'duration.minutes': '{minutes}min {seconds}s',
  'duration.hours': '{hours}h {minutes}min',
  'duration.title.live': 'Em execução há {duration}',
  'duration.title.done': 'Levou {duration}',
} as const satisfies Record<string, string>
