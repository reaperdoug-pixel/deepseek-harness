import { describe, expect, it } from 'vitest'
import { en, formatDesktopMessage, ptBR, resolveDesktopLocale, zh } from '../src/locale.ts'

/** Named `{placeholder}` tokens of one message, sorted for comparison. */
const placeholders = (message: string): string[] =>
  [...message.matchAll(/\{([^{}]+)\}/gu)].map(match => match[1]!).sort()

describe('desktop locale dictionaries', () => {
  it('ships the same key set in English, Chinese, and Portuguese', () => {
    expect(Object.keys(zh)).toEqual(Object.keys(en))
    expect(Object.keys(ptBR)).toEqual(Object.keys(en))
    expect(resolveDesktopLocale('zh-Hans-CN').messages).toEqual(zh)
    expect(resolveDesktopLocale('pt-BR')).toEqual({ id: 'pt-BR', messages: ptBR })
    expect(resolveDesktopLocale('pt-PT').messages).toEqual(ptBR)
    expect(resolveDesktopLocale('en-US').messages).toEqual(en)
    expect(resolveDesktopLocale('fr-FR').messages).toEqual(en)
  })

  it('keeps the placeholders of every English message in the Portuguese one', () => {
    for (const key of Object.keys(en) as (keyof typeof en)[]) {
      expect(placeholders(ptBR[key]), key).toEqual(placeholders(en[key]))
    }
  })

  it('formats named values without consuming unknown placeholders', () => {
    expect(formatDesktopMessage('{name}@{version} {missing}', { name: 'plugin', version: '1.2.3' }))
      .toBe('plugin@1.2.3 {missing}')
  })

})
