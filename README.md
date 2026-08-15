# Converte.Page

Front-end para transformar copies de produtos digitais em templates JSON importáveis no Elementor. A aplicação foi projetada para ser publicada gratuitamente no GitHub Pages e processa os arquivos diretamente no navegador.

## O que já funciona

- Entrada por texto completo ou arquivos `.txt`, `.md`, `.docx` e `.pdf`;
- Extração local do conteúdo de documentos;
- Identificação de headline, texto de apoio, benefícios e CTA;
- Geração de quatro seções responsivas no formato de template do Elementor;
- Download imediato do arquivo `.json`;
- Interface responsiva, sem necessidade de conta ou servidor.

> A opção de documento por URL está desenhada na interface, mas requer um proxy/backend por causa das restrições CORS dos provedores de documentos. A interface informa essa limitação em vez de enviar a copy para serviços desconhecidos.

## Desenvolvimento

```bash
npm install
npm run dev
```

Validações:

```bash
npm run lint
npm test
npm run build
```

## Importar no Elementor

1. Gere e baixe o JSON na aplicação;
2. No WordPress, abra **Elementor → Modelos salvos**;
3. Clique em **Importar modelos** e selecione o JSON;
4. Crie ou abra uma página com Elementor;
5. Abra a biblioteca de modelos e insira o template importado;
6. Troque imagens, links e informações específicas da oferta antes de publicar.

## Publicação no GitHub Pages

O workflow em `.github/workflows/deploy.yml` compila o Vite e publica a pasta `dist`. No GitHub, abra **Settings → Pages** e selecione **GitHub Actions** como fonte. A configuração `base: './'` permite que os assets funcionem em repositórios de qualquer nome.

## Próximas evoluções

- Backend seguro para ler Google Docs e Notion;
- Integração opcional com um modelo de IA para análise semântica avançada;
- Escolha de identidade visual, nicho e estilo antes da geração;
- Preview visual da página gerada;
- Mais seções: depoimentos, FAQ, garantia, preço e bônus;
- Validação com versões específicas do Elementor e biblioteca de templates.
