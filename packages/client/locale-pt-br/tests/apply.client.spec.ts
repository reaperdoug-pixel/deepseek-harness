// @vitest-environment jsdom
/**
 * The pt-BR language pack adds one selectable language and one dictionary per
 * namespace, and its keys stay aligned with the shipped English dictionaries.
 */
import { describe, expect, it } from 'vitest'
import { Context } from '@deepseek-ai/cordis'
import { LocaleRuntime } from '@deepseek-ai/dsh-client-locale/client'
import { apply as hostApply } from '../src/index.ts'
import { apply, inject, PT_BR_DICTIONARIES, PT_BR_LOCALE_ID } from '../src/client/index.ts'

/** Boot the pack over a locale registry that has no Host settings scope. */
async function bench() {
  const ctx = new Context()
  const locale = new LocaleRuntime(ctx)
  ctx.provide('locale', locale)
  const plugin = ctx.plugin({ inject: [...inject], apply })
  await plugin.await()
  return { ctx, locale, plugin }
}

describe('pt-BR language pack', () => {
  it('adds the pt-BR language with English as its fallback', async () => {
    const { locale } = await bench()
    const definition = locale.getLocale().locales.find(entry => entry.id === PT_BR_LOCALE_ID)
    expect(definition).toEqual({ id: 'pt-BR', label: 'Português (Brasil)', fallback: 'en' })
  })

  it('translates the common namespace once the locale is selected', async () => {
    const { locale } = await bench()
    const t = locale.bind('common')
    locale.setLocale(PT_BR_LOCALE_ID)
    expect(t('cancel')).toBe('Cancelar')
    expect(t('copy.optionsHint', { action: 'Copiar' })).toBe(
      'Copiar; clique com o botão direito para ver as opções de cópia',
    )
  })

  it('keeps the slash command tokens equal to the registered command names', async () => {
    const { locale } = await bench()
    locale.setLocale(PT_BR_LOCALE_ID)
    const t = locale.bind('command')
    expect(t('token.goal')).toBe('goal')
    expect(t('token.plan')).toBe('plan')
    expect(t('token.feedback')).toBe('feedback')
    expect(t('token.compact')).toBe('compact')
    expect(t('token.permission')).toBe('permission')
    expect(t('token.export')).toBe('export')
  })

  it('has no host-side behavior of its own', () => {
    expect(() => { hostApply() }).not.toThrow()
  })

  it('keeps one dictionary per namespace', () => {
    const namespaces = PT_BR_DICTIONARIES.map(([namespace]) => namespace)
    expect(new Set(namespaces).size).toBe(namespaces.length)
  })

  it('removes the language and its dictionaries when the plugin unloads', async () => {
    const { locale, plugin } = await bench()
    locale.setLocale(PT_BR_LOCALE_ID)
    await plugin.dispose()
    expect(locale.getLocale().locales.some(entry => entry.id === PT_BR_LOCALE_ID)).toBe(false)
    expect(locale.getLocale().active).toBe('en')
  })
})
