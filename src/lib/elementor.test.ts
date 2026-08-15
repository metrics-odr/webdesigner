import { describe, expect, it } from 'vitest'
import { generateElementorTemplate } from './elementor'

const copy = `Domine sua estratégia digital e venda todos os dias

Um método completo para transformar o seu conhecimento em uma oferta irresistível para o mercado.

✓ Posicione sua mensagem
✓ Construa sua oferta
✓ Venda com previsibilidade

QUERO COMEÇAR AGORA`

describe('generateElementorTemplate', () => {
  it('gera um template importável com a estrutura básica do Elementor', () => {
    const template = generateElementorTemplate({ title: 'Oferta Digital', niche: 'Infoproduto', objective: 'Vendas', source: copy })

    expect(template.version).toBe('0.4')
    expect(template.type).toBe('page')
    expect(template.title).toBe('Oferta Digital')
    expect(template.content).toHaveLength(4)
    expect(template.content[0].elType).toBe('container')
    expect(template.content[0].elements.some((element) => element.widgetType === 'button')).toBe(true)
  })

  it('inclui os benefícios fornecidos pela copy', () => {
    const serialized = JSON.stringify(generateElementorTemplate({ title: 'Teste', niche: '', objective: '', source: copy }))
    expect(serialized).toContain('Posicione sua mensagem')
    expect(serialized).toContain('Construa sua oferta')
  })
})
