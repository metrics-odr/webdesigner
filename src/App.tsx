import { useRef, useState } from 'react'
import {
  ArrowRight, Check, ChevronDown, Download, FileText, Github, Link2, LoaderCircle,
  Lock, Menu, MousePointer2, Paperclip, Sparkles, UploadCloud, WandSparkles, X,
} from 'lucide-react'
import { ACCEPTED_EXTENSIONS, extractTextFromFile } from './lib/files'
import { downloadTemplate, generateElementorTemplate, type ElementorTemplate } from './lib/elementor'

type InputMode = 'text' | 'link' | 'file'
type Status = 'idle' | 'reading' | 'generating' | 'ready' | 'error'

const sampleCopy = `Transforme conhecimento em um produto digital que vende todos os dias

Descubra o método prático para tirar sua ideia do papel, posicionar sua oferta e construir uma estrutura de vendas previsível — mesmo que você esteja começando agora.

✓ Encontre o posicionamento que faz sua oferta se destacar
✓ Crie uma mensagem que conecta e desperta desejo
✓ Construa um processo simples, validado e escalável

Você não precisa de uma audiência enorme ou de uma equipe completa. Precisa da estratégia certa e de um plano que possa executar.

QUERO CONSTRUIR MINHA OFERTA AGORA`

function App() {
  const [mode, setMode] = useState<InputMode>('text')
  const [copy, setCopy] = useState('')
  const [link, setLink] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const [template, setTemplate] = useState<ElementorTemplate | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)

  const hasContent = mode === 'text' ? copy.trim().length > 20 : mode === 'link' ? link.trim().length > 8 : Boolean(file)
  const characterCount = copy.length

  async function getSource() {
    if (mode === 'text') return copy
    if (mode === 'file' && file) {
      setStatus('reading')
      return extractTextFromFile(file)
    }
    if (mode === 'link') {
      throw new Error('Por segurança, links externos precisam de uma integração de servidor. Cole a copy ou envie o arquivo nesta versão.')
    }
    return ''
  }

  async function handleGenerate() {
    if (!hasContent) return
    setError('')
    setTemplate(null)
    try {
      const source = await getSource()
      if (source.trim().length < 20) throw new Error('A copy parece muito curta. Adicione mais conteúdo para gerar uma página completa.')
      setStatus('generating')
      await new Promise((resolve) => window.setTimeout(resolve, 850))
      const generated = generateElementorTemplate({
        title: source.split('\n').find((line) => line.trim().length > 12)?.trim().slice(0, 80) ?? 'Landing Page',
        niche: 'Produtos digitais', objective: 'Conversão', source,
      })
      setTemplate(generated)
      setStatus('ready')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível processar a copy.')
      setStatus('error')
    }
  }

  async function chooseFile(selected?: File) {
    if (!selected) return
    setError('')
    const extension = selected.name.split('.').pop()?.toLowerCase()
    if (!['txt', 'md', 'docx', 'pdf'].includes(extension ?? '')) {
      setError('Formato não compatível. Use TXT, MD, DOCX ou PDF.')
      setStatus('error')
      return
    }
    setFile(selected)
    setStatus('idle')
  }

  return (
    <div className="app-shell">
      <nav className="navbar">
        <a className="brand" href="#top" aria-label="Converte.Page — início">
          <span className="brand-mark"><MousePointer2 size={18} strokeWidth={2.8} /></span>
          <span>CONVERTE<span className="brand-dot">.</span>PAGE</span>
        </a>
        <div className="nav-links">
          <a href="#como-funciona">Como funciona</a>
          <a href="#recursos">Recursos</a>
          <a href="#faq">Dúvidas</a>
        </div>
        <a className="github-link" href="https://github.com" target="_blank" rel="noreferrer"><Github size={17} /> GitHub</a>
        <button className="menu-button" aria-label="Abrir menu"><Menu /></button>
      </nav>

      <main id="top">
        <section className="hero">
          <div className="aurora aurora-one" /><div className="aurora aurora-two" />
          <div className="eyebrow"><Sparkles size={14} /> COPY → DESIGN → ELEMENTOR</div>
          <h1>Sua copy merece uma página que <em>converte.</em></h1>
          <p className="hero-subtitle">Envie sua copy. Nossa IA estrutura, desenha e otimiza uma landing page completa — pronta para importar no Elementor.</p>
          <div className="trust-row">
            <span><Check size={15} /> Sem código</span><i /><span><Check size={15} /> 100% editável</span><i /><span><Check size={15} /> JSON compatível</span>
          </div>

          <section className="generator-card" aria-label="Gerador de landing page">
            <div className="card-topline"><span>01</span><p>ADICIONE SUA COPY</p><div className="secure"><Lock size={12} /> Seus dados ficam no seu navegador</div></div>
            <div className="tabs" role="tablist">
              <button className={mode === 'text' ? 'active' : ''} onClick={() => setMode('text')} role="tab"><FileText size={17} /> Colar texto</button>
              <button className={mode === 'link' ? 'active' : ''} onClick={() => setMode('link')} role="tab"><Link2 size={17} /> Link online</button>
              <button className={mode === 'file' ? 'active' : ''} onClick={() => setMode('file')} role="tab"><Paperclip size={17} /> Enviar arquivo</button>
            </div>

            <div className="input-area">
              {mode === 'text' && <>
                <textarea value={copy} onChange={(event) => { setCopy(event.target.value); setStatus('idle') }} placeholder={'Cole aqui a copy completa da sua landing page...\n\nPode incluir títulos, subtítulos, benefícios, depoimentos, oferta, garantia e CTA.'} aria-label="Copy da landing page" />
                <div className="textarea-footer"><button onClick={() => setCopy(sampleCopy)}><WandSparkles size={14} /> Usar copy de exemplo</button><span>{characterCount.toLocaleString('pt-BR')} caracteres</span></div>
              </>}
              {mode === 'link' && <div className="link-panel"><Link2 size={24} /><div><label htmlFor="source-link">Link do documento</label><p>Google Docs, Notion ou documento público</p></div><input id="source-link" value={link} onChange={(event) => setLink(event.target.value)} placeholder="https://docs.google.com/..." /></div>}
              {mode === 'file' && <div className={`dropzone ${file ? 'has-file' : ''}`} onClick={() => fileInput.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); void chooseFile(event.dataTransfer.files[0]) }}>
                <input ref={fileInput} type="file" accept={ACCEPTED_EXTENSIONS} onChange={(event) => void chooseFile(event.target.files?.[0])} hidden />
                {file ? <><div className="file-icon"><FileText /></div><strong>{file.name}</strong><span>{(file.size / 1024).toFixed(1)} KB · pronto para processar</span><button className="remove-file" onClick={(event) => { event.stopPropagation(); setFile(null) }} aria-label="Remover arquivo"><X size={16} /></button></> : <><UploadCloud size={32} /><strong>Arraste seu arquivo ou clique para selecionar</strong><span>TXT, MD, DOCX ou PDF · máximo recomendado de 10 MB</span></>}
              </div>}
            </div>

            {error && <div className="error-message" role="alert">{error}</div>}
            {status === 'ready' && template && <div className="success-message"><span><Check size={16} /></span><div><strong>Sua landing page está pronta!</strong><p>{template.content.length} seções criadas e otimizadas para o Elementor.</p></div></div>}

            <div className="generate-row">
              <div className="step-note"><span>02</span><div><strong>GERAR LANDING PAGE</strong><small>Estrutura + design + otimização</small></div></div>
              {status === 'ready' && template ?
                <button className="download-button" onClick={() => downloadTemplate(template)}><Download size={18} /> BAIXAR JSON <ArrowRight size={17} /></button> :
                <button className="generate-button" disabled={!hasContent || status === 'generating' || status === 'reading'} onClick={() => void handleGenerate()}>
                  {status === 'generating' || status === 'reading' ? <><LoaderCircle className="spin" size={18} /> {status === 'reading' ? 'LENDO ARQUIVO...' : 'CRIANDO SUA PÁGINA...'}</> : <>CRIAR MINHA LANDING PAGE <ArrowRight size={17} /></>}
                </button>}
            </div>
          </section>

          <p className="elementor-note"><span className="elementor-glyph">E</span> Compatível com <strong>Elementor</strong> e <strong>Elementor Pro</strong></p>
        </section>

        <section className="how" id="como-funciona">
          <div className="section-kicker">SIMPLES, RÁPIDO, INTELIGENTE</div>
          <h2>Da copy à página em três passos.</h2>
          <div className="steps-grid">
            <article><span>01</span><div className="step-icon"><FileText /></div><h3>Envie sua copy</h3><p>Cole o texto, envie um documento ou use o link da sua copy.</p></article>
            <article><span>02</span><div className="step-icon"><Sparkles /></div><h3>Nós criamos</h3><p>A estrutura de conversão e o design são montados para você.</p></article>
            <article><span>03</span><div className="step-icon"><Download /></div><h3>Importe no Elementor</h3><p>Baixe o JSON, importe no WordPress e personalize o que quiser.</p></article>
          </div>
        </section>

        <section className="features" id="recursos">
          <div><div className="section-kicker">DESIGN QUE VENDE</div><h2>Mais estratégia.<br />Menos página em branco.</h2><p>Um ponto de partida profissional para lançar mais rápido, testar novas ofertas e focar no que realmente importa: vender.</p></div>
          <div className="feature-list">
            {['Hierarquia visual otimizada para leitura', 'Seções pensadas para quebrar objeções', 'CTAs posicionados nos momentos certos', 'Layout responsivo e totalmente editável'].map((item) => <div key={item}><Check size={18} />{item}</div>)}
          </div>
        </section>

        <section className="faq" id="faq">
          <div className="section-kicker">DÚVIDAS FREQUENTES</div><h2>Antes de começar.</h2>
          {[
            ['O JSON funciona em qualquer site WordPress?', 'O arquivo segue a estrutura de templates do Elementor. Basta ter o plugin Elementor instalado e importar o JSON na biblioteca de modelos.'],
            ['A página fica totalmente editável?', 'Sim. Textos, cores, espaçamentos, imagens e botões podem ser ajustados normalmente dentro do editor.'],
            ['Meus arquivos são enviados para algum servidor?', 'Nesta versão, textos e arquivos são processados localmente no navegador. Nenhum conteúdo é armazenado.'],
          ].map(([question, answer], index) => <details key={question} open={index === 0}><summary>{question}<ChevronDown /></summary><p>{answer}</p></details>)}
        </section>
      </main>

      <footer><a className="brand" href="#top"><span className="brand-mark"><MousePointer2 size={16} /></span><span>CONVERTE<span className="brand-dot">.</span>PAGE</span></a><p>Feito para quem transforma ideias em negócios.</p><span>© 2026 Converte.Page</span></footer>
    </div>
  )
}

export default App
