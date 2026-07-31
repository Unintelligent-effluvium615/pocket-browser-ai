# Estado atual — IA de Bolso / pocket-browser-ai

Última revisão: 2026-07-31.

## Identidade

- Pasta: `E:\GitHub\projects\pocket-browser-ai`
- Repositório: `claudneysessa/pocket-browser-ai` (ainda não criado)
- Demonstração: `https://claudneysessa.github.io/pocket-browser-ai/` (após publicar)
- Branch: `main`
- Versão: 0.1.0

## Estado validado

- Sintaxe do `app.js` aprovada como ES module (`node --input-type=module --check`).
- CDN verificado: `https://esm.run/@mlc-ai/web-llm@0.2.84` responde HTTP 200 e o
  mapa de exports contém `CreateMLCEngine`, `hasModelInCache` e
  `deleteModelAllInfoInCache` como named exports.
- Servidor estático local entrega `/`, `/app.js` e `/style.css` com HTTP 200 e
  content-type correto.
- Zero dependências instaláveis; nenhuma etapa de build.
- **Inferência real confirmada por Claudney em 31/07/2026**, em navegador com
  WebGPU: detecção de suporte, download dos pesos com progresso, geração em
  streaming e destravamento da caixa de texto.
- Ciclo completo observado em Chrome desktop: cache detectado, modelo carregado
  do cache em cerca de 19s, resposta transmitida token a token.
- Responsividade verificada em 1920×1080, 1366×768 e viewport estreito (~500px).
  Em 1366×768 a área operacional inteira cabe sem rolagem; só o rodapé fica
  abaixo da dobra, o que o padrão da raiz permite para conteúdo explicativo.
- Mídia real capturada: `docs/images/pocket-browser-ai-overview.png` (960×1040)
  e `docs/images/demo.gif` (760×728, 221 quadros, 415 KB), ambas de execução
  real e sem edição de conteúdo.
- Publicação verificada: repositório público, Pages verde, URL respondendo HTTP
  200 e os três arquivos servidos com content-type correto.

## Não validado ainda

- Comportamento em GPUs e navegadores diferentes do ambiente de teste.
- Primeiro download em origem sem cache (o teste usou o cache já existente).

## Como validar

```text
cd E:\GitHub\projects\pocket-browser-ai
npx serve .
# abrir no Chrome/Edge desktop, clicar em "Carregar modelo",
# aguardar o download, enviar uma pergunta e conferir o streaming
```

## Último marco

- Entrega: publicação completa em 31/07/2026 — aplicação, documentação bilíngue,
  mídia real, repositório público e GitHub Pages verde.
- Correções de acabamento aplicadas após inspeção visual: estado vazio passou a
  acompanhar o modelo carregado, texto vazio centralizado e negrito de markdown
  renderizado sem parser e sem `innerHTML`.

## Próximo passo recomendado

- Medir e exibir tokens por segundo reais, por dispositivo.

## Pendências

- Testar em outras GPUs e navegadores; hoje há evidência de um ambiente só.
- Avaliar mover a inferência para Web Worker, mantendo a interface responsiva
  durante a geração.

## Decisões abertas

- Nenhuma. Nome, escopo e abordagem sem build foram aprovados em 31/07/2026.

## Não refazer

- Não adicionar bundler, framework, testes ou CI: a ausência deles é o produto.
  O projeto existe como contraponto mínimo ao IAí?, que já é a versão completa.
- Não trocar o modelo nem os parâmetros de geração: eles são deliberadamente
  idênticos aos do IAí? para permitir comparação justa.
- Não adicionar persistência de histórico. Isso é o papel do IAí?.
