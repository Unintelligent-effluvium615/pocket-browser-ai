# IA de Bolso — Pocket Browser AI

**Um modelo de linguagem completo rodando dentro da sua aba. Sem servidor, sem
conta, sem etapa de build — três arquivos estáticos.**

🇬🇧 [Read in English](./README.md)

[![Demonstração](https://img.shields.io/badge/demo-GitHub%20Pages-a9f47b?style=flat-square)](https://claudneysessa.github.io/pocket-browser-ai/)
[![WebLLM](https://img.shields.io/badge/WebLLM-0.2.84-3b82f6?style=flat-square)](https://github.com/mlc-ai/web-llm)
[![Licença: MIT](https://img.shields.io/badge/licen%C3%A7a-MIT-999?style=flat-square)](./LICENSE)

**Demonstração online:** https://claudneysessa.github.io/pocket-browser-ai/

![Tela de abertura do IA de Bolso: o nome do modelo, três fatos sobre rodá-lo localmente e um único botão Iniciar](./docs/images/pocket-browser-ai-overview.png)

A aplicação abre numa tela que diz o que vai acontecer — os pesos são baixados
uma única vez, a inferência roda na sua GPU, nada sai do dispositivo — e só então
oferece **Iniciar**. Disparar um download de centenas de megabytes a partir de um
botão sem aviso seria hostil.

### Depois a conversa, com o modelo na sua GPU

![Animação de uma pergunta sendo digitada e o modelo transmitindo a resposta palavra por palavra dentro do navegador](./docs/images/demo.gif)

A animação é saída real e não editada do modelo de 0,5B rodando local. Nada foi
encenado e nenhuma resposta foi reescrita — inclusive nos trechos em que um modelo
desse porte mostra seus limites.

Remover o modelo volta para a tela de abertura e apaga a conversa. Sem modelo não
existe chat, então os dois estados permanecem honestos entre si.

## O que é

O menor exemplo honesto de inferência local de LLM na web. Os pesos são baixados
uma única vez para o cache do navegador, compilados para a sua GPU via WebGPU, e
cada token é gerado na sua própria máquina. Nada é enviado para lugar algum.

Ele existe como contraponto deliberado ao
[**IAí?**](https://github.com/claudneysessa/in-browser-ai-chat), onde construí a
experiência completa: Next.js, React, Tailwind, Drizzle, Cloudflare Workers,
conversas persistentes e pesquisa na web com citação de fontes. Aquele projeto
responde *"até onde isso pode ir?"*. Este responde uma pergunta diferente e
igualmente útil: **qual é o mínimo irredutível?**

A resposta acabou sendo `index.html`, `app.js`, `style.css` e uma linha de
import. Mesmo modelo, mesmos parâmetros, cerca de 150 linhas de JavaScript, zero
dependências instaláveis.

## Como funciona

```
index.html   marcação e estados
app.js       ES module → importa o WebLLM direto de um CDN
style.css    tema escuro, tela única, sem framework
```

Não existe bundler porque não existe nada para empacotar. O navegador resolve o
import nativamente:

```js
import { CreateMLCEngine } from "https://esm.run/@mlc-ai/web-llm@0.2.84";

const engine = await CreateMLCEngine("Qwen2.5-0.5B-Instruct-q4f16_1-MLC", {
  initProgressCallback: ({ progress, text }) => mostrarProgresso(progress, text),
});

const stream = await engine.chat.completions.create({
  messages,
  stream: true,
  temperature: 0.7,
  max_tokens: 320,
});
```

Quatro passos, nesta ordem: checar o WebGPU, baixar e compilar o modelo,
transmitir a resposta token a token, e permitir que o usuário apague os pesos.

## Parâmetros de inferência

Idênticos aos do IAí?, para que a comparação entre os dois projetos seja justa.

| Configuração | Valor |
|---|---|
| Modelo | `Qwen2.5-0.5B-Instruct-q4f16_1-MLC` |
| Runtime | `@mlc-ai/web-llm` 0.2.84 (WebGPU) |
| Temperatura | `0.7` |
| Máximo de tokens | `320` |
| Streaming | habilitado |
| System prompt | assistente didático, responde em português do Brasil |

## Executando localmente

É necessário um servidor estático — o Chrome bloqueia ES modules carregados por
`file://`, então abrir o `index.html` com dois cliques não vai funcionar.

```bash
git clone https://github.com/claudneysessa/pocket-browser-ai.git
cd pocket-browser-ai
npx serve .          # ou: python -m http.server 8000
```

Abra o endereço exibido e clique em **Carregar modelo**. O primeiro acesso baixa
os pesos; os seguintes leem do cache do navegador.

## Requisitos e limites

Ditos com clareza, porque uma demonstração que esconde suas restrições não é uma
demonstração:

- **WebGPU é obrigatório.** Chrome ou Edge recentes no desktop. O suporte em
  Firefox e Safari ainda é irregular, e a página informa isso em vez de falhar
  em silêncio.
- **O primeiro carregamento é um download real.** Algumas centenas de megabytes
  de pesos quantizados. A barra de progresso reporta bytes de verdade, não uma
  animação decorativa.
- **0,5B de parâmetros é um modelo pequeno.** Ele é fluente e rápido, não
  conhecedor. Vai errar fatos. Esse é o trade-off honesto de rodar inteiramente
  na GPU de um notebook.
- **Sem persistência.** O histórico vive em memória e é apagado ao recarregar.
  Isso é característica do mínimo, não esquecimento — persistência é o papel do
  IAí?.
- **A biblioteca vem de um CDN.** Fixada em uma versão exata. Isso não adiciona
  uma nova classe de dependência, já que os pesos do modelo são buscados na rede
  no primeiro uso de qualquer forma.
- **Sem testes nem CI.** Sem build para quebrar e sem regra de domínio para
  proteger, um pipeline seria cerimônia. A verificação aqui é abrir a página.

## Possíveis próximos passos

- Permitir escolher entre alguns tamanhos de modelo para sentir a curva entre
  qualidade e latência.
- Mover a inferência para um Web Worker, mantendo a interface responsiva durante
  a geração.
- Medir e exibir tokens por segundo reais por dispositivo.
- Publicar uma comparação lado a lado com o IAí? sobre o que a complexidade extra
  realmente entrega.

## Créditos

- [WebLLM / MLC AI](https://github.com/mlc-ai/web-llm) — o runtime que compila e
  executa o modelo no navegador.
- [Qwen2.5-0.5B-Instruct](https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct) —
  modelo da equipe Qwen, da Alibaba Cloud, quantizado pela MLC AI.
- [Erick Wendel](https://github.com/ErickWendel) — as aulas de Web AI dele foram
  o ponto de partida da minha exploração deste assunto.

Código da aplicação, interface e documentação por **Claudney Sarti Sessa**. A
autoria e o treinamento do modelo não são meus — a contribuição aqui é de
engenharia: fazer aquilo rodar no navegador com a menor superfície possível.

## Licença

[MIT](./LICENSE)
