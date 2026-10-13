/**
 * Browser half of the Brazilian Portuguese language pack. Adds the `pt-BR`
 * definition to the locale catalog and registers one pt-BR dictionary per
 * namespace owned by the other client plugins. English is the declared
 * fallback, so a namespace this pack does not translate still renders.
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis'
// Type-only: pulls the locale plugin's Context merge (ctx.locale).
import type {} from '@deepseek-ai/dsh-client-locale/client'
import { PT_BR_DICTIONARIES } from '../locales/index.ts'

export { PT_BR_DICTIONARIES, type NamespaceDictionary } from '../locales/index.ts'

/** Locale id stored as the preference and written to `<html lang>`. */
export const PT_BR_LOCALE_ID = 'pt-BR'

/** Required service: the locale registry that owns the language catalog. */
export const inject = ['locale']

/**
 * Client plugin body: register the language definition, then one dictionary
 * per namespace. Each registration is an owned effect, so unloading the pack
 * removes the language and every dictionary it added.
 * @param ctx - client cordis context.
 */
export function apply(ctx: ClientContext): void {
  ctx.effect(
    () => ctx.locale.addLanguage({ id: PT_BR_LOCALE_ID, label: 'Português (Brasil)', fallback: 'en' }),
    'locale-pt-br: language',
  )
  for (const [namespace, dictionary] of PT_BR_DICTIONARIES) {
    ctx.effect(
      () => ctx.locale.register(namespace, PT_BR_LOCALE_ID, { ...dictionary }),
      `locale-pt-br: ${namespace} dictionary`,
    )
  }
}
