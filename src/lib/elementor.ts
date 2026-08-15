export type ElementorElement = {
  id: string
  elType: 'container' | 'widget'
  widgetType?: string
  settings: Record<string, unknown>
  elements: ElementorElement[]
}

export type ElementorTemplate = {
  content: ElementorElement[]
  page_settings: Record<string, unknown>
  version: string
  title: string
  type: 'page'
}

export type PageBrief = {
  title: string
  niche: string
  objective: string
  source: string
}

const colors = {
  background: '#071018',
  surface: '#0D1B24',
  primary: '#B8FF5C',
  text: '#F5F7F2',
  muted: '#A8B3AD',
}

function id(index: number) {
  return index.toString(16).padStart(7, '0').slice(-7)
}

function widget(index: number, widgetType: string, settings: Record<string, unknown>): ElementorElement {
  return { id: id(index), elType: 'widget', widgetType, settings, elements: [] }
}

function container(index: number, settings: Record<string, unknown>, elements: ElementorElement[]): ElementorElement {
  return { id: id(index), elType: 'container', settings, elements }
}

function cleanText(value: string) {
  return value.replace(/^#{1,6}\s*/, '').replace(/^[-*•]\s*/, '').trim()
}

function parseCopy(source: string) {
  const blocks = source
    .split(/\n\s*\n|\r\n\s*\r\n/)
    .map(cleanText)
    .filter(Boolean)

  const headline = blocks.find((block) => block.length >= 15 && block.length <= 120) ?? 'Uma nova forma de alcançar seus objetivos'
  const paragraphs = blocks.filter((block) => block !== headline && block.length > 60)
  const shortBlocks = blocks.filter((block) => block !== headline && block.length >= 12 && block.length <= 90)
  const bullets = source
    .split('\n')
    .filter((line) => /^\s*[-*•✓✔]/.test(line))
    .map(cleanText)

  return {
    headline,
    subheadline: paragraphs[0] ?? shortBlocks[0] ?? 'Descubra o método criado para transformar intenção em resultado.',
    body: paragraphs.slice(1, 4),
    benefits: (bullets.length ? bullets : shortBlocks.slice(1, 4)).slice(0, 4),
    cta: shortBlocks.find((block) => /quero|comece|garanta|inscreva|comprar|acessar/i.test(block)) ?? 'QUERO COMEÇAR AGORA',
  }
}

export function generateElementorTemplate(brief: PageBrief): ElementorTemplate {
  const copy = parseCopy(brief.source)
  const benefits = copy.benefits.length
    ? copy.benefits
    : ['Estratégia direta ao ponto', 'Método simples de aplicar', 'Resultados que você consegue perceber']

  let n = 1
  const benefitCards = benefits.map((benefit) =>
    container(n++, {
      content_width: 'full',
      background_background: 'classic',
      background_color: colors.surface,
      border_radius: { unit: 'px', top: '16', right: '16', bottom: '16', left: '16', isLinked: true },
      padding: { unit: 'px', top: '28', right: '28', bottom: '28', left: '28', isLinked: true },
    }, [
      widget(n++, 'icon', { selected_icon: { value: 'fas fa-check', library: 'fa-solid' }, primary_color: colors.primary }),
      widget(n++, 'heading', { title: benefit, header_size: 'h3', title_color: colors.text, typography_font_weight: '600' }),
    ]),
  )

  const content: ElementorElement[] = [
    container(n++, {
      content_width: 'boxed', min_height: { unit: 'vh', size: 88 }, flex_direction: 'column', justify_content: 'center',
      background_background: 'gradient', background_color: colors.background, background_color_b: '#10291E',
      padding: { unit: 'px', top: '96', right: '24', bottom: '96', left: '24', isLinked: false },
    }, [
      widget(n++, 'heading', {
        title: copy.headline, header_size: 'h1', align: 'center', title_color: colors.text,
        typography_font_family: 'Inter', typography_font_size: { unit: 'px', size: 58 }, typography_font_weight: '700',
      }),
      widget(n++, 'text-editor', { editor: `<p>${copy.subheadline}</p>`, align: 'center', text_color: colors.muted }),
      widget(n++, 'button', {
        text: copy.cta, align: 'center', size: 'lg', button_text_color: '#071018', background_color: colors.primary,
        border_radius: { unit: 'px', top: '10', right: '10', bottom: '10', left: '10', isLinked: true },
        link: { url: '#oferta', is_external: '', nofollow: '' },
      }),
    ]),
    container(n++, {
      content_width: 'boxed', flex_direction: 'column', gap: { unit: 'px', size: 24 }, background_color: colors.background,
      padding: { unit: 'px', top: '88', right: '24', bottom: '88', left: '24', isLinked: false },
    }, [
      widget(n++, 'heading', { title: 'Tudo o que você precisa para avançar', header_size: 'h2', align: 'center', title_color: colors.text }),
      container(n++, { flex_direction: 'row', flex_wrap: 'wrap', gap: { unit: 'px', size: 20 } }, benefitCards),
    ]),
    container(n++, {
      content_width: 'boxed', flex_direction: 'column', background_color: colors.surface,
      padding: { unit: 'px', top: '88', right: '24', bottom: '88', left: '24', isLinked: false },
    }, [
      widget(n++, 'heading', { title: 'Feito para quem está pronto para mudar', header_size: 'h2', title_color: colors.text }),
      widget(n++, 'text-editor', { editor: `<p>${copy.body.join('</p><p>') || copy.subheadline}</p>`, text_color: colors.muted }),
    ]),
    container(n++, {
      css_id: 'oferta', content_width: 'boxed', flex_direction: 'column', align_items: 'center', background_color: colors.background,
      padding: { unit: 'px', top: '96', right: '24', bottom: '96', left: '24', isLinked: false },
    }, [
      widget(n++, 'heading', { title: 'Seu próximo passo começa aqui.', header_size: 'h2', align: 'center', title_color: colors.text }),
      widget(n++, 'text-editor', { editor: '<p>Você já sabe onde quer chegar. Agora só precisa tomar a decisão.</p>', align: 'center', text_color: colors.muted }),
      widget(n++, 'button', { text: copy.cta, align: 'center', size: 'lg', button_text_color: '#071018', background_color: colors.primary, link: { url: '#', is_external: '', nofollow: '' } }),
    ]),
  ]

  return {
    content,
    page_settings: {
      background_background: 'classic', background_color: colors.background,
      hide_title: 'yes', template: 'elementor_canvas',
    },
    version: '0.4',
    title: brief.title || 'Landing Page de Alta Conversão',
    type: 'page',
  }
}

export function downloadTemplate(template: ElementorTemplate) {
  const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `${template.title.toLowerCase().replace(/[^a-z0-9]+/gi, '-') || 'landing-page'}.json`
  anchor.click()
  URL.revokeObjectURL(url)
}
