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

## Não validado ainda

- Responsividade nas quatro larguras exigidas pelo padrão da raiz.
- Mídia: nenhum screenshot ou GIF capturado.

## Como validar

```text
cd E:\GitHub\projects\pocket-browser-ai
npx serve .
# abrir no Chrome/Edge desktop, clicar em "Carregar modelo",
# aguardar o download, enviar uma pergunta e conferir o streaming
```

## Último marco

- Commit: inicial (estrutura mínima funcional)
- Entrega: aplicação estática de três arquivos replicando modelo e parâmetros
  do IAí?

## Próximo passo recomendado

- Capturar screenshot e GIF reais e incorporá-los aos dois READMEs.

## Pendências

- Screenshot e GIF reais, apenas depois de validar a inferência no navegador
  (`MEDIA_STANDARD.md` proíbe capturar antes de layout e nome fechados).
- Publicação no GitHub e ativação do Pages.
- Registro em `PROJECTS.md` e `memory/INDEX.md` do orquestrador.

## Decisões abertas

- Nenhuma. Nome, escopo e abordagem sem build foram aprovados em 31/07/2026.

## Não refazer

- Não adicionar bundler, framework, testes ou CI: a ausência deles é o produto.
  O projeto existe como contraponto mínimo ao IAí?, que já é a versão completa.
- Não trocar o modelo nem os parâmetros de geração: eles são deliberadamente
  idênticos aos do IAí? para permitir comparação justa.
- Não adicionar persistência de histórico. Isso é o papel do IAí?.
